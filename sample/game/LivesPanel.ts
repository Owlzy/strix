import type {TextureView} from "../../src";
import {SceneNode, Sprite} from "../../src";

export class LivesPanel extends SceneNode {
    private readonly icons: Sprite[] = [];

    constructor(texture: TextureView, maxLives: number, spacing: number = 24) {
        super();
        for (let i = 0; i < maxLives; i++) {
            const icon = new Sprite(texture);
            icon.x = i * spacing;
            // scale down / anchor as the art needs
            this.add(icon);
            this.icons.push(icon);
        }
    }

    setLives(n: number): void {
        for (let i = 0; i < this.icons.length; i++) {
            this.icons[i].visible = i < n;
        }
    }
}