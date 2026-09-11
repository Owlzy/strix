import { Scene } from "./Scene";
import { Application, Sprite, Vector2 } from "../../src";
import { Player } from "../game/Player";
import { Asteroid } from "../game/Asteroid";
import type { Entity } from "../game/Entity";

export class GameScene extends Scene {
    // player
    private readonly player: Player;

    // asteroids
    private readonly asteroids: Asteroid[] = [];

    constructor(app: Application) {
        super(app);

        this.player = new Player(this.app.assets.get("player"));
        this.player.position = new Vector2(
            this.app.renderer.canvas.width / 2,
            this.app.renderer.canvas.height / 2,
        );
        this.add(this.player);

        this.spawnAsteroids(10);
    }

    override update(dt: number) {
        super.update(dt);

        this.player.update(dt);
        this.wrap(this.player);

        for (let i = 0; i < this.asteroids.length; i++) {
            const a = this.asteroids[i];
            a.update(dt);
            this.wrap(a);
        }
    }

    wrap(e: Entity) {
        const w = this.app.renderer.canvas.width;
        const h = this.app.renderer.canvas.height;
        if (e.x < 0) e.x += w;
        if (e.x > w) e.x -= w;
        if (e.y < 0) e.y += h;
        if (e.y > h) e.y -= h;
    }

    spawnAsteroids(count: number) {
        const textures = [
            this.app.assets.get("asteroid_big"),
            this.app.assets.get("asteroid_medium1"),
            this.app.assets.get("asteroid_medium2"),
            this.app.assets.get("asteroid_small1"),
            this.app.assets.get("asteroid_small2"),
        ];

        for (let i = 0; i < count; i++) {
            const a: Asteroid = new Asteroid(textures[Math.floor(Math.random() * textures.length)]);

            a.x = Math.random() * this.app.renderer.canvas.width;
            a.y = Math.random() * this.app.renderer.canvas.height;

            this.add(a);
            this.asteroids.push(a);
        }
    }
}
