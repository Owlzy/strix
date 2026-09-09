import {Vector2} from "../math";

export class Node {
    // public fields
    public position: Vector2 = new Vector2();
    public children: Node[] = [];

    public updateTransforms(){
        for(const c of this.children){
            c.updateTransforms();
        }
    }
}