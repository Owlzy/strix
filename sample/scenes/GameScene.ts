import {Scene} from "./Scene";
import {Application} from "../../src";
import {Sprite} from "../../src/graph/Sprite";

export class GameScene extends Scene {
    private player:Sprite;

    constructor(app: Application) {
        super(app);

        this.player = new Sprite();
        this.player.texture = this.app.renderer.loadTexture("/test.png");
        this.add(this.player);
    }

    override update(dt: number) {
        super.update(dt);
    }
}