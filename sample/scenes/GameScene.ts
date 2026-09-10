import {Scene} from "./Scene";
import {Application} from "../../src";
import {Sprite} from "../../src/graph/Sprite";
import {Vector2} from "../../src/math";

export class GameScene extends Scene {
    private player: Sprite;

    constructor(app: Application) {
        super(app);

        this.player = new Sprite(this.app.assets.get("player"));
        this.player.x = 100;
        this.player.y = 100;
        this.player.anchor = new Vector2();
        this.add(this.player);
    }

    override update(dt: number) {
        super.update(dt);

        this.player.x += dt * 100;
    }
}