import {Scene} from "./Scene";
import {Application} from "../../src";
import {Sprite} from "../../src/graph/Sprite";

export class GameScene extends Scene {
    private player: Sprite;

    constructor(app: Application) {
        super(app);

        this.player = new Sprite();
        this.player.texture = this.app.renderer.loadTexture("/test.png");
        this.player.x = 100;
        this.player.y = 100;
        this.add(this.player);
    }

    override update(dt: number) {
        super.update(dt);

        this.player.x += dt * 100;
    }
}