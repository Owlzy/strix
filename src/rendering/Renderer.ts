export class Renderer {
    // public fields
    public readonly canvas: HTMLCanvasElement;

    // private fields
    private readonly gl: WebGL2RenderingContext;

    constructor(canvas?: HTMLCanvasElement) {
        this.canvas = canvas ?? document.createElement('canvas');

        const gl = this.canvas.getContext('webgl2');
        if (!gl) throw new Error('WebGL2 not supported');

        this.gl = gl;
    }

    render() {
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        this.gl.clearColor(1, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}