export class Mat3 {
    // 9 elements, COLUMN-MAJOR, because that's the layout WebGL's
    // uniformMatrix3fv expects. Logical matrix:
    //   | a  c  tx |        stored as:
    //   | b  d  ty |   ->   [a, b, 0,  c, d, 0,  tx, ty, 1]
    //   | 0  0  1  |
    private readonly _data: Float32Array;

    constructor() {
        this._data = new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ]);
    }

    /**
     * The raw column-major array, ready to hand to uniformMatrix3fv.
     */
    get data(): Float32Array {
        return this._data;
    }

    identity(): this {
        this._data.set([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        return this;
    }

    clone(): Mat3 {
        const m = new Mat3();
        m._data.set(this._data);
        return m;
    }

    /**
     * Returns a NEW matrix equal to (this * other).
     * @param other
     */
    multiply(other: Mat3): Mat3 {
        const [a0, a1, a2, a3, a4, a5, a6, a7, a8] = this._data;
        const [b0, b1, b2, b3, b4, b5, b6, b7, b8] = other._data;

        const m = new Mat3();
        m._data.set([
            a0 * b0 + a3 * b1 + a6 * b2,
            a1 * b0 + a4 * b1 + a7 * b2,
            a2 * b0 + a5 * b1 + a8 * b2,

            a0 * b3 + a3 * b4 + a6 * b5,
            a1 * b3 + a4 * b4 + a7 * b5,
            a2 * b3 + a5 * b4 + a8 * b5,

            a0 * b6 + a3 * b7 + a6 * b8,
            a1 * b6 + a4 * b7 + a7 * b8,
            a2 * b6 + a5 * b7 + a8 * b8,
        ]);
        return m;
    }

    static translation(x: number, y: number): Mat3 {
        const m = new Mat3();
        m._data.set([1, 0, 0, 0, 1, 0, x, y, 1]);
        return m;
    }

    static rotation(radians: number): Mat3 {
        const c = Math.cos(radians);
        const s = Math.sin(radians);
        const m = new Mat3();
        m._data.set([c, s, 0, -s, c, 0, 0, 0, 1]);
        return m;
    }

    static scaling(x: number, y: number): Mat3 {
        const m = new Mat3();
        m._data.set([x, 0, 0, 0, y, 0, 0, 0, 1]);
        return m;
    }

    /**
     * Maps pixel coords (0,0 top-left → width,height bottom-right) into clip space.
     * @param width
     * @param height
     */
    static projection(width: number, height: number): Mat3 {
        const m = new Mat3();
        m._data.set([2 / width, 0, 0, 0, -2 / height, 0, -1, 1, 1]);
        return m;
    }
}