import { SceneNode, Sprite, Texture, Vector2 } from "../../src";

export abstract class Entity extends SceneNode {
    protected readonly view: Sprite;
    protected readonly velocity: Vector2 = new Vector2();

    constructor(texture: Texture) {
        super();
        this.view = new Sprite(texture);
        this.view.anchor = new Vector2(0.5, 0.5);
        this.add(this.view);
    }

    abstract update(dt: number): void;
}
