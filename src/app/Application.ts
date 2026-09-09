import {Renderer} from '../rendering';
import type {Mesh} from "../graph/Mesh";
import {Sprite} from "../graph/Sprite";

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

    private tempTestMesh: Mesh = new Sprite();

    constructor(canvas?: HTMLCanvasElement) {
        this.renderer = new Renderer(canvas);
        this.lastTime = performance.now();

        requestAnimationFrame(this.update);
    }

    private update = (time: number) => {
        this._deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.renderer.render(this.tempTestMesh);
        requestAnimationFrame(this.update);
    }
}