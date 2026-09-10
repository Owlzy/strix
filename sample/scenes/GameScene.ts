import {Scene} from "./Scene";
import {Application, Sprite, Vector2} from "../../src";

export class GameScene extends Scene {
    private readonly kb: Keyboard = new Keyboard();

    // player
    private readonly player: Sprite;
    private readonly playerAcceleration: number = 260;
    private readonly velocity: Vector2 = new Vector2();
    private readonly drag: number = 0.6;

    // asteroids
    private readonly asteroids: Asteroid[] = [];

    constructor(app: Application) {
        super(app);

        this.player = new Sprite(this.app.assets.get("player"));
        this.player.x = 100;
        this.player.y = 100;
        this.player.anchor = new Vector2(0.5, 0.5);
        this.player.scale = new Vector2(2, 2);
        this.player.position = new Vector2(this.app.renderer.canvas.width / 2, this.app.renderer.canvas.height / 2);
        this.add(this.player);

        this.spawnAsteroids(10);
    }

    override update(dt: number) {
        super.update(dt);

        const turnSpeed = 3;   // radians/sec

        if (this.kb.isDown("ArrowLeft")) this.player.rotation -= turnSpeed * dt;
        if (this.kb.isDown("ArrowRight")) this.player.rotation += turnSpeed * dt;
        if (this.kb.isDown("ArrowUp")) {
            // thrust along the facing direction:
            const a = this.player.rotation;
            this.velocity.x += Math.sin(a) * this.playerAcceleration * dt;
            this.velocity.y += -Math.cos(a) * this.playerAcceleration * dt;
        }

        const damp = 1 - this.drag * dt;
        this.velocity.x *= damp;
        this.velocity.y *= damp;

        this.player.x += this.velocity.x * dt;
        this.player.y += this.velocity.y * dt;

        const w = this.app.renderer.canvas.width;
        const h = this.app.renderer.canvas.height;
        if (this.player.x < 0) this.player.x += w;
        if (this.player.x > w) this.player.x -= w;
        if (this.player.y < 0) this.player.y += h;
        if (this.player.y > h) this.player.y -= h;

        for (let i = 0; i < this.asteroids.length; i++) {
            const a = this.asteroids[i];
            a.sprite.x += a.velocity.x * dt;
            a.sprite.y += a.velocity.y * dt;

            if (a.sprite.x < 0) a.sprite.x += w;
            if (a.sprite.x > w) a.sprite.x -= w;
            if (a.sprite.y < 0) a.sprite.y += h;
            if (a.sprite.y > h) a.sprite.y -= h;
        }
    }

    spawnAsteroids(count: number) {
        const textures = [
            this.app.assets.get("asteroid_big"),
            this.app.assets.get("asteroid_medium1"),
            this.app.assets.get("asteroid_medium2"),
            this.app.assets.get("asteroid_small1"),
            this.app.assets.get("asteroid_small2")
        ];

        for (let i = 0; i < count; i++) {
            const a: Asteroid =
                {
                    sprite: new Sprite(textures[Math.floor(Math.random() * textures.length)]),
                    velocity: new Vector2()
                };
            a.sprite.x = Math.random() * this.app.renderer.canvas.width;
            a.sprite.y = Math.random() * this.app.renderer.canvas.height;
            a.velocity.x = Math.random() * 60;
            a.velocity.y = Math.random() * 60;

            this.add(a.sprite);
            this.asteroids.push(a);
        }
    }
}

interface Asteroid {
    sprite: Sprite;
    velocity: Vector2;
}

export class Keyboard {
    private readonly pressed = new Set<string>();

    constructor() {
        window.addEventListener("keydown", (e) => this.pressed.add(e.code));
        window.addEventListener("keyup", (e) => this.pressed.delete(e.code));
        // if the window loses focus, drop everything so a held key doesn't "stick"
        window.addEventListener("blur", () => this.pressed.clear());
    }

    isDown(code: string): boolean {
        return this.pressed.has(code);
    }
}