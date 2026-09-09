import {Renderer} from '../rendering';

export class Application {
    // public fields
    public readonly renderer: Renderer;

    constructor(canvas?: HTMLCanvasElement) {
        this.renderer = new Renderer(canvas);

        requestAnimationFrame(this.update);
    }

    public update() {
        this.renderer.render();
    }
}