import {Mesh} from "./Mesh";
import {Mat3, Vector2} from "../math";

export class Sprite extends Mesh {
    public anchor: Vector2 = new Vector2();

    constructor(
        public width: number = 100,
        public height: number = 100,
    ) {
        super();
    }

    protected getVertices(): Float32Array {
        const w = this.width;
        const h = this.height;
        //   x  y    u  v
        return new Float32Array([
            0, 0, 0, 0,
            w, 0, 1, 0,
            0, h, 0, 1,

            0, h, 0, 1,
            w, 0, 1, 0,
            w, h, 1, 1,
        ]);
    }

    override updateTransforms(parentWorld: Mat3): void {
        this.localMatrix = Mat3.translation(this.position.x, this.position.y)
            .multiply(Mat3.rotation(this.rotation))
            .multiply(Mat3.scaling(this.scale.x, this.scale.y))
            .multiply(Mat3.translation(-this.anchor.x * this.width, -this.anchor.y * this.height));

        this.worldMatrix = parentWorld.multiply(this.localMatrix);
        for (const c of this.children) c.updateTransforms(this.worldMatrix);
    }
}
