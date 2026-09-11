import { Matrix3, Vector2 } from "../math";
import type { Disposable } from "../core/Disposable";

export class SceneNode implements Disposable {
    public get x() {
        return this.position.x;
    }

    set x(value) {
        this.position.x = value;
    }

    public get y() {
        return this.position.y;
    }

    set y(value) {
        this.position.y = value;
    }

    public position: Vector2 = new Vector2();
    public rotation: number = 0;
    public scale: Vector2 = new Vector2(1, 1);
    public visible: boolean = true;

    // readonly reference, mutable contents — the same distinction as `velocity`.
    public readonly children: SceneNode[] = [];

    private _parent: SceneNode | null = null;
    public get parent(): SceneNode | null {
        return this._parent;
    }

    public localMatrix: Matrix3 = new Matrix3();
    public worldMatrix: Matrix3 = new Matrix3();

    private disposed = false;

    updateTransforms(parentWorld: Matrix3): void {
        this.localMatrix = Matrix3.translation(this.position.x, this.position.y)
            .multiply(Matrix3.rotation(this.rotation))
            .multiply(Matrix3.scaling(this.scale.x, this.scale.y));
        this.worldMatrix = parentWorld.multiply(this.localMatrix);
        for (const c of this.children) c.updateTransforms(this.worldMatrix);
    }

    getWorldPosition(): Vector2 {
        return this.worldMatrix.getTranslation();
    }

    add(node: SceneNode): void {
        node._parent?.remove(node); // a node lives in exactly one tree
        node._parent = this;
        this.children.push(node);
    }

    remove(node: SceneNode): void {
        const i = this.children.indexOf(node);
        if (i === -1) return;
        this.children.splice(i, 1);
        node._parent = null;
    }

    dispose(): void {
        if (this.disposed) return;
        this.disposed = true;

        // Detach each child *before* recursing, so the child sees a null parent and
        // skips its own splice; then drop the array in one go. O(n), not O(n^2).
        for (const child of this.children) {
            child._parent = null;
            child.dispose();
        }
        this.children.length = 0;

        this.onDispose(); // subclasses free their own resources here
        this._parent?.remove(this); // only the node you called dispose() on has a live parent to leave
    }

    protected onDispose(): void {}
}
