import {Mat3, Vector2} from "../math";

export class SceneNode {
    // public fields
    public position: Vector2 = new Vector2();
    public rotation: number = 0;
    public scale: Vector2 = new Vector2(1, 1);

    public children: SceneNode[] = [];

    // private fields
    public localMatrix: Mat3 = new Mat3();
    public worldMatrix: Mat3 = new Mat3();

    updateTransforms(parentWorld: Mat3): void {
        this.localMatrix = Mat3.translation(this.position.x, this.position.y)
            .multiply(Mat3.rotation(this.rotation))
            .multiply(Mat3.scaling(this.scale.x, this.scale.y));

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
