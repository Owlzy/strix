import {Mesh} from "./Mesh";

export class Sprite extends Mesh {
    constructor(public width: number = 100, public height: number = 100) {
        super();
    }

    protected getVertices(): Float32Array {
        const w = this.width;
        const h = this.height;
        // quad as two triangles, in local pixel space (0,0)-(w,h)
        return new Float32Array([
            0, 0,  w, 0,  0, h,
            0, h,  w, 0,  w, h,
        ]);
    }
}