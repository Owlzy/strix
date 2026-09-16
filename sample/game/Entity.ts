import {SceneNode, Sprite, Vector2, type TextureView} from "../../src";

export abstract class Entity extends SceneNode {
    get radius(): number {
        return Math.min(this.view.width, this.view.height) / 2 * 0.8; // scale down to make it a bit more forgiving
    }

    protected readonly view: Sprite;
    protected readonly viewDuplicate: Sprite;
    protected readonly velocity: Vector2 = new Vector2();

    constructor(texture: TextureView) {
        super();
        this.view = new Sprite(texture);
        this.view.anchor = new Vector2(0.5, 0.5);
        this.add(this.view);

        this.viewDuplicate = new Sprite(texture);
        this.viewDuplicate.anchor = new Vector2(0.5, 0.5);
        this.viewDuplicate.visible = false;
        this.add(this.viewDuplicate);
    }

    abstract update(dt: number): void;

    public stop() {
    }

    /**
     * Show a screen-space mirror of the view at (dx, dy); (0, 0) hides it.
     * @param dx
     * @param dy
     */
    setWrapOffset(dx: number, dy: number): void {
        const dup = this.viewDuplicate;
        if (dx === 0 && dy === 0) {
            dup.visible = false;
            return;
        }
        dup.x = dx;
        dup.y = dy;
        dup.rotation = this.view.rotation;   // mirror facing
        dup.texture = this.view.texture;     // mirror current frame (thrust on/off)
        dup.visible = true;
    }

}
