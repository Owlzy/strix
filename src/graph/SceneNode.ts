import {Matrix3, Vector2} from "../math";

export class SceneNode {
    // getters / setters
    public get x() {
        return this.position.x;
    };

    public set x(value) {
        this.position = new Vector2(value, this.position.y);
    };

    public get y() {
        return this.position.y;
    };

    public set y(value) {
        this.position = new Vector2(this.position.x, value);
    };

    // public fields
    public position: Vector2 = new Vector2();
    public rotation: number = 0;
    public scale: Vector2 = new Vector2(1, 1);

    public children: SceneNode[] = [];

    // private fields
    public localMatrix: Matrix3 = new Matrix3();
    public worldMatrix: Matrix3 = new Matrix3();

    updateTransforms(parentWorld: Matrix3): void {
        this.localMatrix = Matrix3.translation(this.position.x, this.position.y)
            .multiply(Matrix3.rotation(this.rotation))
            .multiply(Matrix3.scaling(this.scale.x, this.scale.y));

        this.worldMatrix = parentWorld.multiply(this.localMatrix);
        for (const c of this.children) c.updateTransforms(this.worldMatrix);
    }

    /**
     * Pull the resolved world position back out of the matrix.
     */
    getWorldPosition(): Vector2 {
        return this.worldMatrix.getTranslation();
    }

    add(node: SceneNode) {
        this.children.push(node);
    }
}
