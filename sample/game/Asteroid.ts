import { Texture } from "../../src";
import { Entity } from "./Entity";

export class Asteroid extends Entity {
    constructor(texture: Texture) {
        super(texture);

        this.velocity.x = Math.random() * 60;
        this.velocity.y = Math.random() * 60;
    }

    update(dt: number) {
        this.x += this.velocity.x * dt;
        this.y += this.velocity.y * dt;
    }
}
