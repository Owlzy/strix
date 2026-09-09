import {Mat3, Vector2} from "../math";

export class Node {
    // public fields
    public position: Vector2 = new Vector2();
    public children: Node[] = [];

    // private fields
    private localMatrix: Mat3 = new Mat3();
    private worldMatrix: Mat3 = new Mat3();

    updateTransforms(parentWorld: Mat3): void {
        this.worldMatrix = parentWorld.multiply(this.localMatrix);
        for (const c of this.children) c.updateTransforms(this.worldMatrix);
    }
}