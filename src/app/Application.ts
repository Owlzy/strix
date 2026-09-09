import {Renderer} from '../rendering';

export class Application {
    // getters / setters
    public get deltaTime() {
        return this._deltaTime;
    }

    // public fields
    public readonly renderer: Renderer;

    // private fields
    private lastTime: number;
    private _deltaTime: number = 0;

    constructor(canvas?: HTMLCanvasElement) {
        this.renderer = new Renderer(canvas);
        this.lastTime = performance.now();

        requestAnimationFrame(this.update);
    }

    private update = (time: number) => {
        this._deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.renderer.render();
        requestAnimationFrame(this.update);
    }
}