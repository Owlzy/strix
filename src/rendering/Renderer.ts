export class Renderer {
    // public fields
    public readonly canvas: HTMLCanvasElement;

    // private fields
    private readonly gl: WebGL2RenderingContext;

    constructor(canvas?: HTMLCanvasElement) {
        this.canvas = canvas ?? document.createElement('canvas');

        const gl = canvas?.getContext('webgl2');
        if (!gl) throw new Error('WebGL2 not supported');

        this.gl = gl;
    }
    
}