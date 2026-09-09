import {SceneNode} from "../../src/graph";
import {Application} from "../../src";

export abstract class Scene extends SceneNode {

    protected app: Application;

    constructor(app: Application) {
        super();
        this.app = app;
    }

    update(dt: number) {

    }
}