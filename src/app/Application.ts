import {Renderer} from '../rendering';
import {Mat3} from "../math";
import {SceneNode} from "../graph";

export class Application {
    // getters / setters
    public get deltaTime() {
        return this._deltaTime;
    }

    // public fields
    public readonly renderer: Renderer;
    public readonly root: SceneNode = new SceneNode();

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

        this.root.updateTransforms(new Mat3());
        this.renderer.render(this.root);

        requestAnimationFrame(this.update);
    }
}