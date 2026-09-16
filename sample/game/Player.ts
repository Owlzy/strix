import type { TextureView } from "strix";
import { Entity } from "./Entity";
import type { Weapon } from "./Weapon";
import {Keyboard} from "./Keyboard";

export class Player extends Entity {
    readonly kb: Keyboard;

    readonly acceleration: number = 260;
    readonly drag: number = 0.6;
    readonly turnSpeed: number = 3;

    private readonly weapon: Weapon;

    private textureOn: TextureView;
    private textureOff: TextureView;

    constructor(textureOff: TextureView, textureOn: TextureView, weapon: Weapon, kb: Keyboard) {
        super(textureOff);
        this.textureOff = textureOff;
        this.textureOn = textureOn;
        this.weapon = weapon;
        this.kb = kb;
    }

    update(dt: number) {
        if (this.kb.isDown(Keyboard.keys.ArrowLeft) || this.kb.isDown(Keyboard.keys.A))
            this.view.rotation -= this.turnSpeed * dt;
        if (this.kb.isDown(Keyboard.keys.ArrowRight) || this.kb.isDown(Keyboard.keys.D))
            this.view.rotation += this.turnSpeed * dt;
        if (this.kb.isDown(Keyboard.keys.ArrowUp) || this.kb.isDown(Keyboard.keys.W)) {
            // thrust along the facing direction:
            const a = this.view.rotation;
            this.velocity.x += Math.sin(a) * this.acceleration * dt;
            this.velocity.y += -Math.cos(a) * this.acceleration * dt;
            this.view.texture = this.textureOn;
        } else {
            this.view.texture = this.textureOff;
        }

        if (this.kb.wasPressed(Keyboard.keys.Space)) this.fire();

        const damp = Math.exp(-this.drag * dt); // dv/dt = -k * v
        this.velocity.x *= damp;
        this.velocity.y *= damp;

        this.x += this.velocity.x * dt;
        this.y += this.velocity.y * dt;
    }

    fire() {
        this.weapon.fire(this.x, this.y, this.view.rotation);
    }

    public override stop() {
        this.velocity.x = this.velocity.y = 0;
        this.view.rotation = this.viewDuplicate.rotation = 0;
    }

    override dispose() {
        super.dispose();
        this.kb.dispose();
    }
}