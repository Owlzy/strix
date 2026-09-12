import {Mesh} from "./Mesh";
import {Matrix3, Vector2} from "../math";
import type {TextureView} from "../texture";

export class Sprite extends Mesh {
    get width(): number { return this._width; }
    set width(v: number) { this._width = v; this.invalidate(); }
    get height(): number { return this._height; }
    set height(v: number) { this._height = v; this.invalidate(); }

    public anchor: Vector2 = new Vector2();
    private _width: number;
    private _height: number;

    constructor(texture?: TextureView, width?: number, height?: number) {
        super();
        this.texture = texture;
        this._width = width ?? texture?.width ?? 100;
        this._height = height ?? texture?.height ?? 100;
    }

    protected getVertices(): Float32Array {
        const w = this.width;
        const h = this.height;
        const t = this.texture;
        const u0 = t?.u0 ?? 0, v0 = t?.v0 ?? 0, u1 = t?.u1 ?? 1, v1 = t?.v1 ?? 1;
        return new Float32Array([
            0, 0, u0, v0,   w, 0, u1, v0,   0, h, u0, v1,
            0, h, u0, v1,   w, 0, u1, v0,   w, h, u1, v1,
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
