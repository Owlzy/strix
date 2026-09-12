import type { TextureView } from "./TextureView";

export class CanvasTexture implements TextureView {
    private readonly tex: WebGLTexture;
    public width = 0;
    public height = 0;
    public readonly u0 = 0;
    public readonly v0 = 0;
    public readonly u1 = 1;
    public readonly v1 = 1;

    private disposed = false;

    constructor(private readonly gl: WebGL2RenderingContext) {
        const tex = gl.createTexture();
        if (!tex) throw new Error("Failed to create texture");
        this.tex = tex;
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }

    get source(): WebGLTexture {
        return this.tex;
    }

    update(canvas: HTMLCanvasElement): void {
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        // straight (non-premultiplied) alpha, to match the renderer's SRC_ALPHA blend
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
        this.width = canvas.width;
        this.height = canvas.height;
    }

    dispose(): void {
        if (this.disposed) return;
        this.disposed = true;
        this.gl.deleteTexture(this.tex);
    }
}