export class Vector2 {
    public x: number;
    public y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // assignment
    set(x: number, y: number): this { this.x = x; this.y = y; return this; }
    copy(v: Vector2): this { this.x = v.x; this.y = v.y; return this; }
    clone(): Vector2 { return new Vector2(this.x, this.y); }

    // arithmetic (mutate this, return this for chaining)
    add(v: Vector2): this { this.x += v.x; this.y += v.y; return this; }
    subtract(v: Vector2): this { this.x -= v.x; this.y -= v.y; return this; }
    scale(s: number): this { this.x *= s; this.y *= s; return this; }
    negate(): this { this.x = -this.x; this.y = -this.y; return this; }

    // products
    dot(v: Vector2): number { return this.x * v.x + this.y * v.y; }
    cross(v: Vector2): number { return this.x * v.y - this.y * v.x; } // scalar in 2D

    // length (squared variants avoid the sqrt)
    lengthSquared(): number { return this.x * this.x + this.y * this.y; }
    length(): number { return Math.sqrt(this.lengthSquared()); }

    normalize(): this {
        const len = this.length();
        if (len > 0) { this.x /= len; this.y /= len; }  // guard against divide-by-zero
        return this;
    }

    /**
     * @param v
     */
    distanceToSquared(v: Vector2): number {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return dx * dx + dy * dy;
    }

    /**
     * @param v
     */
    distanceTo(v: Vector2): number { return Math.sqrt(this.distanceToSquared(v)); }

    // angles
    angle(): number { return Math.atan2(this.y, this.x); }                    // vector's own angle
    angleTo(v: Vector2): number { return Math.atan2(this.cross(v), this.dot(v)); } // signed angle this→v

    /**
     * @param radians
     */
    rotate(radians: number): this {
        const c = Math.cos(radians);
        const s = Math.sin(radians);
        const x = this.x;
        const y = this.y;
        this.x = x * c - y * s;
        this.y = x * s + y * c;
        return this;
    }

    perpendicular(): this { const x = this.x; this.x = -this.y; this.y = x; return this; }

    /**
     * @param v
     * @param t
     */
    lerp(v: Vector2, t: number): this {
        this.x += (v.x - this.x) * t;
        this.y += (v.y - this.y) * t;
        return this;
    }
}