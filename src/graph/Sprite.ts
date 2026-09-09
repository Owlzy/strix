import { Mesh } from "./Mesh";

export class Sprite extends Mesh {
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
            0, 0,  0, 0,
            w, 0,  1, 0,
            0, h,  0, 1,

            0, h,  0, 1,
            w, 0,  1, 0,
            w, h,  1, 1,
        ]);
    }
}
