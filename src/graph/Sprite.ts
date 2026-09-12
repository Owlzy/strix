import {Mesh} from "./Mesh";
import {Matrix3, Vector2} from "../math";
import {Texture} from "../texture";

export class Sprite extends Mesh {
    get width(): number { return this._width; }
    set width(v: number) { this._width = v; this.invalidate(); }
    get height(): number { return this._height; }
    set height(v: number) { this._height = v; this.invalidate(); }

    public anchor: Vector2 = new Vector2();
    private _width: number;
    private _height: number;

    constructor(texture?: Texture, width?: number, height?: number) {
        super();
        this.texture = texture;
        this._width = width ?? texture?.width ?? 100;
        this._height = height ?? texture?.height ?? 100;
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

    override updateTransforms(parentWorld: Matrix3): void {
        this.localMatrix = Matrix3.translation(this.position.x, this.position.y)
            .multiply(Matrix3.rotation(this.rotation))
            .multiply(Matrix3.scaling(this.scale.x, this.scale.y))
            .multiply(Matrix3.translation(-this.anchor.x * this.width, -this.anchor.y * this.height));

        this.worldMatrix = parentWorld.multiply(this.localMatrix);
        for (const c of this.children) c.updateTransforms(this.worldMatrix);
    }
}
