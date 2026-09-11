import { Texture } from "../../src";
import { Entity } from "./Entity";

export class Player extends Entity {
    private readonly kb: Keyboard = new Keyboard();

    private acceleration: number = 260;
    private drag: number = 0.6;
    private turnSpeed: number = 3;

    constructor(texture: Texture) {
        super(texture);
    }

    update(dt: number) {
        if (this.kb.isDown("ArrowLeft")) this.view.rotation -= this.turnSpeed * dt;
        if (this.kb.isDown("ArrowRight")) this.view.rotation += this.turnSpeed * dt;
        if (this.kb.isDown("ArrowUp")) {
            // thrust along the facing direction:
            const a = this.view.rotation;
            this.velocity.x += Math.sin(a) * this.acceleration * dt;
            this.velocity.y += -Math.cos(a) * this.acceleration * dt;
        }

        const damp = 1 - this.drag * dt;
        this.velocity.x *= damp;
        this.velocity.y *= damp;

        this.x += this.velocity.x * dt;
        this.y += this.velocity.y * dt;
    }
}

class Keyboard {
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
