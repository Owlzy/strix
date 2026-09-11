import {Renderer} from "../rendering";
import {Matrix3} from "../math";
import {SceneNode} from "../graph";
import {Assets} from "./Assets";

export class Application {
    // getters / setters
    public get deltaTime() {
        return this._deltaTime;
    }

    // public fields
    public readonly renderer: Renderer;
    public readonly root: SceneNode = new SceneNode();
    public readonly assets: Assets;

    public ticker? = (dt: number) => {
    };

    // private fields
    private lastTime: number;
    private _deltaTime: number = 0;

    constructor(canvas?: HTMLCanvasElement) {
        this.renderer = new Renderer(canvas);
        this.assets = new Assets(this.renderer);
        this.lastTime = performance.now();

        requestAnimationFrame(this.update);
    }

    private update = (time: number) => {
        this._deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.root.updateTransforms(new Matrix3());
        this.renderer.render(this.root);

        if (this.ticker)
            this.ticker(this._deltaTime);

        requestAnimationFrame(this.update);
    };
}
