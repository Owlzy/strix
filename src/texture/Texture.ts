export class Texture {
    public readonly texture: WebGLTexture;
    public width = 1;
    public height = 1;
    public loaded = false;

    private readonly gl: WebGL2RenderingContext;

    constructor(gl: WebGL2RenderingContext, url: string) {
        this.gl = gl;

        const texture = gl.createTexture();
        if (!texture) throw new Error("Failed to create texture");
        this.texture = texture;

        // 1x1 white placeholder, so the texture is usable before the image loads
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
            gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]),
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        const image = new Image();
        image.onload = () => {
            this.width = image.width;
            this.height = image.height;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            this.loaded = true;
        };
        image.onerror = () => console.error(`Failed to load texture: ${url}`);
        image.src = url;
    }
}