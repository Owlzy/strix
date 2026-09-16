import { SceneNode, type TextureView } from "strix";
import { Bullet } from "./Bullet";
import type { Weapon } from "./Weapon";

export class BulletPool implements Weapon {
    private readonly bullets: Bullet[];

    constructor(parent: SceneNode, texture: TextureView, size: number = 4) {
        this.bullets = [];
        for (let i = 0; i < size; i++) {
            const b = new Bullet(texture);
            parent.add(b);
            this.bullets.push(b);
        }
    }

    fire(x: number, y: number, rotation: number): void {
        const b = this.acquire();
        if (!b) return;
        b.spawn(x, y, rotation);
    }

    private acquire(): Bullet | null {
        for (const b of this.bullets) {
            if (!b.active) return b;
        }
        return null;
    }

    update(dt: number): void {
        for (const b of this.bullets) b.update(dt);
    }

    forEachActive(fn: (b: Bullet) => void): void {
        for (const b of this.bullets) if (b.active) fn(b);
    }
}
