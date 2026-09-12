import type { Disposable } from "../core/Disposable";

export class Texture implements Disposable {
    get source(): WebGLTexture { return this.texture; }
    
    public readonly texture: WebGLTexture;
    public readonly ready: Promise<this>;
    public width = 1;
    public height = 1;
    public loaded = false;
    private readonly gl: WebGL2RenderingContext;
    private disposed = false;

    // UV's
    public readonly u0 = 0;
    public readonly v0 = 0;
    public readonly u1 = 1;
    public readonly v1 = 1;

    constructor(gl: WebGL2RenderingContext, url: string) {
        this.gl = gl;
        const texture = gl.createTexture();
        if (!texture) throw new Error("Failed to create texture");
        this.texture = texture;

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            1,
            1,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 0, 0]),
        ); // transparent placeholder

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // <- the one that matters
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        this.ready = new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                if (this.disposed) return; // disposed mid-download: the GL texture is gone
                this.width = image.width;
                this.height = image.height;
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                this.loaded = true;
                resolve(this);
            };
            image.onerror = () => reject(new Error(`Failed to load texture: ${url}`));
            image.src = url;
        });
    }

    dispose(): void {
        if (this.disposed) return;
        this.disposed = true;
        this.gl.deleteTexture(this.texture);
    }
}