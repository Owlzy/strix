import type { TextureView } from "strix";
import { Entity } from "./Entity";

export const ASTEROID_TIERS = {
    big: { textures: ["asteroid_big"], next: "medium", count: 2, score: 20, speed: 60 },
    medium: { textures: ["asteroid_medium1", "asteroid_medium2"], next: "small", count: 2, score: 60, speed: 100 },
    small: { textures: ["asteroid_small1", "asteroid_small2"], next: null, count: 0, score: 100, speed: 180 },
} as const;
export type AsteroidSize = keyof typeof ASTEROID_TIERS;
export const ASTEROID_SIZES = Object.keys(ASTEROID_TIERS) as AsteroidSize[];

export class Asteroid extends Entity {
    constructor(
        texture: TextureView,
        public readonly size: AsteroidSize,
        readonly speed: number = 60
    ) {
        super(texture);

        const a = Math.random() * 2 * Math.PI;
        this.velocity.x = Math.cos(a) * speed;
        this.velocity.y = Math.sin(a) * speed;
    }

    update(dt: number) {
        this.x += this.velocity.x * dt;
        this.y += this.velocity.y * dt;
    }
}
