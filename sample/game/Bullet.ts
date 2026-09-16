import { Entity } from "./Entity";

export class Bullet extends Entity {
    private readonly maxLife: number = 0.6;
    private readonly speed: number = 1200;
    private life: number = 0;
    active: boolean = false;

    spawn(x: number, y: number, rotation: number): void {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.velocity.x = Math.sin(rotation) * this.speed;
        this.velocity.y = -Math.cos(rotation) * this.speed;
        this.life = this.maxLife;
        this.active = true;
        this.visible = true;
    }

    retire(): void {
        this.active = false;
        this.visible = false;
        this.stop();
    }

    update(dt: number): void {
        if (!this.active) return;
        this.x += this.velocity.x * dt;
        this.y += this.velocity.y * dt;
        this.life -= dt;
        if (this.life <= 0) this.retire();
    }
}
