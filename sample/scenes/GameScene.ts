import { Scene } from "./Scene";
import { Application, Vector2, TextLabel } from "../../src";
import { Player } from "../game/Player";
import { Asteroid, ASTEROID_SIZES, ASTEROID_TIERS, type AsteroidSize } from "../game/Asteroid";
import { BulletPool } from "../game/BulletPool";
import { Keyboard } from "../game/Keyboard";
import type { Entity } from "../game/Entity";
import {LivesPanel} from "../game/LivesPanel";

export class GameScene extends Scene {
    private state: "playing" | "won" | "lost" = "playing";

    readonly player: Player;

    readonly asteroids: Asteroid[] = [];
    readonly bullets: BulletPool;

    readonly maxLives: number = 3;
    readonly invulnerabilityLength: number = 3;
    currentLives: number;
    invulnerabilityTimer: number = 0;

    readonly livesPanel: LivesPanel;

    readonly scoreLabel: TextLabel;
    private score: number = 0;

    readonly gameOverLabel: TextLabel;
    readonly restartLabel: TextLabel;
    readonly winLabel: TextLabel;

    readonly kb: Keyboard = new Keyboard();

    constructor(app: Application) {
        super(app);

        this.currentLives = this.maxLives;

        const pool = new BulletPool(this, this.app.assets.get("bullet"));
        this.player = new Player(
            this.app.assets.get("spaceship"),
            this.app.assets.get("spaceship_accelerate"),
            pool,
            this.kb,
        );
        this.bullets = pool;
        this.add(this.player);

        this.resetPlayer();
        this.populateAsteroids(10);

        this.scoreLabel = new TextLabel("0", { fontSize: 24, fill: "#ffffff" });
        this.add(this.scoreLabel);
        this.scoreLabel.x = 16;
        this.scoreLabel.y = 16;

        this.gameOverLabel = new TextLabel("GAME OVER", { fontSize: 54, fill: "#ffffff" });
        this.add(this.gameOverLabel);
        this.gameOverLabel.x = this.app.renderer.canvas.width * 0.5;
        this.gameOverLabel.y = this.app.renderer.canvas.height * 0.5;
        this.gameOverLabel.anchor = new Vector2(0.5, 0.5);
        this.gameOverLabel.visible = false;

        this.restartLabel = new TextLabel("Press Space to Restart", {
            fontSize: 28,
            fill: "#ffffff",
        });
        this.add(this.restartLabel);
        this.restartLabel.x = this.gameOverLabel.x;
        this.restartLabel.y = this.gameOverLabel.y + 40;
        this.restartLabel.anchor = new Vector2(0.5, 0.5);
        this.restartLabel.visible = false;

        this.livesPanel = new LivesPanel(this.app.assets.get("spaceship"), this.maxLives);
        this.add(this.livesPanel);
        this.livesPanel.x = this.app.renderer.canvas.width - this.maxLives * 40 - 16;
        this.livesPanel.y = 16;
        this.livesPanel.setLives(this.currentLives);

        this.winLabel = new TextLabel("YOU WIN", { fontSize: 54, fill: "#ffffff" });
        this.winLabel.anchor = new Vector2(0.5, 0.5);
        this.winLabel.visible = false;
        this.add(this.winLabel);

        this.resize();
    }

    override resize() {
        super.resize();

        const { width, height } = this.app.renderer.canvas;
        this.scoreLabel.x = 16;
        this.scoreLabel.y = 16;
        this.gameOverLabel.x = width * 0.5;
        this.gameOverLabel.y = height * 0.5;
        this.restartLabel.x = this.gameOverLabel.x;
        this.restartLabel.y = this.gameOverLabel.y + 40;
        this.livesPanel.x = width - this.maxLives * 40 - 16;
        this.livesPanel.y = 16;
    }

    override update(dt: number) {
        super.update(dt);

        if (this.state === "playing") {
            this.player.update(dt);
            this.wrap(this.player);
            this.updateInvulnerability(dt);
            this.updateAsteroids(dt);
            if (this.state === "playing") {
                this.updateBullets(dt);
                if (this.asteroids.length === 0) this.endGame("won");
            }
        } else if (this.kb.wasPressed(Keyboard.keys.Space)) {
            this.reset();
        }

        this.kb.update();
    }

    private endGame(result: "won" | "lost"): void {
        this.state = result;
        this.restartLabel.visible = true;
        (result === "won" ? this.winLabel : this.gameOverLabel).visible = true;
        if (result === "lost") this.player.visible = false;   // survive on a win, vanish on a loss
    }

    private reset() {
        this.state = "playing";
        this.winLabel.visible = false;
        this.gameOverLabel.visible = false;
        this.restartLabel.visible = false;

        for (const a of this.asteroids) {
            a.dispose();
        }

        this.asteroids.length = 0;

        this.bullets.forEachActive((b) => b.retire());

        this.score = 0;
        this.scoreLabel.text = String(this.score);

        this.currentLives = this.maxLives;

        this.resetPlayer();
        this.populateAsteroids(10);

        this.livesPanel.setLives(this.currentLives);
    }

    private updateInvulnerability(dt: number) {
        if (this.invulnerabilityTimer > 0) {
            this.invulnerabilityTimer -= dt;

            if (this.invulnerabilityTimer <= 0) {
                this.invulnerabilityTimer = 0;
                this.player.visible = true;
            } else {
                const flashInterval = 0.15;
                this.player.visible =
                    Math.floor(this.invulnerabilityTimer / flashInterval) % 2 === 0;
            }
        }
    }

    private updateAsteroids(dt: number) {
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const a = this.asteroids[i];
            a.update(dt);
            this.wrap(a);
            if (this.invulnerabilityTimer <= 0 && this.collide(a, this.player)) {
                this.resetPlayer();
                this.currentLives--;
                this.livesPanel.setLives(this.currentLives);
                if (this.currentLives <= 0) this.endGame("lost");
                break;
            }
        }
    }

    private updateBullets(dt: number) {
        this.bullets.update(dt);
        this.bullets.forEachActive((b) => {
            this.wrap(b);
            for (let i = this.asteroids.length - 1; i >= 0; i--) {
                const a = this.asteroids[i];
                if (this.collide(a, b)) {
                    b.retire();
                    const tier = ASTEROID_TIERS[a.size];
                    if (tier.next) this.spawnAsteroid(tier.next, a.position, tier.count);
                    a.dispose();
                    this.asteroids.splice(i, 1);
                    this.score += tier.score;
                    this.scoreLabel.text = String(this.score);
                    break;
                }
            }
        });
    }

    private wrap(e: Entity): void {
        const w = this.app.renderer.canvas.width;
        const h = this.app.renderer.canvas.height;
        // teleport
        if (e.x < 0) e.x += w;
        if (e.x > w) e.x -= w;
        if (e.y < 0) e.y += h;
        if (e.y > h) e.y -= h;

        // show a duplicate on the opposite side while partly over an edge
        const r = e.radius;
        const dx = e.x + r > w ? -w : e.x - r < 0 ? w : 0;
        const dy = e.y + r > h ? -h : e.y - r < 0 ? h : 0;
        e.setWrapOffset(dx, dy);
    }

    private populateAsteroids(count: number) {
        const safeArea = this.player.radius * 4;

        for (let i = 0; i < count; i++) {
            let spawn = new Vector2(
                Math.random() * this.app.renderer.canvas.width,
                Math.random() * this.app.renderer.canvas.height,
            );

            while (spawn.distanceToSquared(this.player.position) < safeArea * safeArea) {
                spawn = new Vector2(
                    Math.random() * this.app.renderer.canvas.width,
                    Math.random() * this.app.renderer.canvas.height,
                );
            }

            this.spawnAsteroid(ASTEROID_SIZES[0], spawn);
        }
    }

    private spawnAsteroid(size: AsteroidSize, pos: Vector2, count: number = 1): void {
        for (let i = 0; i < count; i++) {
            const keys = ASTEROID_TIERS[size].textures;
            const key = keys[Math.floor(Math.random() * keys.length)];
            const a = new Asteroid(this.app.assets.get(key), size, ASTEROID_TIERS[size].speed);
            a.position = new Vector2(pos.x, pos.y); // copy, per the aliasing note
            this.add(a);
            this.asteroids.push(a);
        }
    }

    private collide(a: Entity, b: Entity): boolean {
        const r = a.radius + b.radius;
        return a.position.distanceToSquared(b.position) < r * r;
    }

    private resetPlayer() {
        this.player.position = new Vector2(
            this.app.renderer.canvas.width / 2,
            this.app.renderer.canvas.height / 2,
        );
        this.player.stop();
        this.invulnerabilityTimer = this.invulnerabilityLength;
    }

    protected override onDispose(): void {
        this.kb.dispose();
    }
}
