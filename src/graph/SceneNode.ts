import {Mat3, Vector2} from "../math";

export class SceneNode {
    // public fields
    public position: Vector2 = new Vector2();
    public children: SceneNode[] = [];

    // private fields
    private localMatrix: Mat3 = new Mat3();
    worldMatrix: Mat3 = new Mat3();

    updateTransforms(parentWorld: Mat3): void {
        this.localMatrix.setTranslation(this.position.x, this.position.y);
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