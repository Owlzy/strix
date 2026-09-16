import { Application, SceneNode } from "../../src";

export abstract class Scene extends SceneNode {
    protected app: Application;

    constructor(app: Application) {
        super();
        this.app = app;
    }

    resize() {}

    update(dt: number) {}
}