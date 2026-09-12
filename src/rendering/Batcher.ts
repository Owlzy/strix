import type { Disposable } from "../core/Disposable";

export class Batcher implements Disposable {
    private static readonly FLOATS_PER_VERTEX = 8; // x, y, u, v, r, g, b, a
    private static readonly VERTS_PER_QUAD = 6;

    private readonly gl: WebGL2RenderingContext;
    private readonly buffer: WebGLBuffer;
    private readonly vao: WebGLVertexArrayObject;
    private readonly data: Float32Array;
    private readonly maxQuads: number;

    private count = 0;                                  // quads buffered since last flush
    private currentTexture: WebGLTexture | null = null;

    constructor(gl: WebGL2RenderingContext, maxQuads: number = 1000) {
        this.gl = gl;
        this.maxQuads = maxQuads;
        this.data = new Float32Array(
            maxQuads * Batcher.VERTS_PER_QUAD * Batcher.FLOATS_PER_VERTEX,
        );

        const buffer = gl.createBuffer();
        if (!buffer) throw new Error("Failed to create batch buffer");
        this.buffer = buffer;
        const vao = gl.createVertexArray();
        if (!vao) throw new Error("Failed to create batch VAO");
        this.vao = vao;

        const F = Float32Array.BYTES_PER_ELEMENT;
        const stride = Batcher.FLOATS_PER_VERTEX * F;
        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.data.byteLength, gl.DYNAMIC_DRAW); // reserve, stream per flush
        gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 2, gl.FLOAT, false, stride, 2 * F);
        gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 4, gl.FLOAT, false, stride, 4 * F);
        gl.bindVertexArray(null);
    }

    begin(): void {
        this.count = 0;
        this.currentTexture = null;
    }

    /** verts: local [x,y,u,v] × 6 ; m: column-major mat3 (worldMatrix.data) ; color: [r,g,b,a] */
    draw(texture: WebGLTexture, m: Float32Array, verts: Float32Array, color: readonly number[]): void {
        if (this.count > 0 && (texture !== this.currentTexture || this.count >= this.maxQuads)) {
            this.flush();
        }
        this.currentTexture = texture;

        let o = this.count * Batcher.VERTS_PER_QUAD * Batcher.FLOATS_PER_VERTEX;
        for (let v = 0; v < Batcher.VERTS_PER_QUAD; v++) {
            const lx = verts[v * 4], ly = verts[v * 4 + 1];
            const u = verts[v * 4 + 2], w = verts[v * 4 + 3];
            this.data[o++] = m[0] * lx + m[3] * ly + m[6];   // world x
            this.data[o++] = m[1] * lx + m[4] * ly + m[7];   // world y
            this.data[o++] = u; this.data[o++] = w;
            this.data[o++] = color[0]; this.data[o++] = color[1];
            this.data[o++] = color[2]; this.data[o++] = color[3];
        }
        this.count++;
    }

    flush(): void {
        if (this.count === 0) return;
        const gl = this.gl;
        const floats = this.count * Batcher.VERTS_PER_QUAD * Batcher.FLOATS_PER_VERTEX;
        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.data.subarray(0, floats));
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.currentTexture);
        gl.drawArrays(gl.TRIANGLES, 0, this.count * Batcher.VERTS_PER_QUAD);
        this.count = 0;
    }

    dispose(): void {
        this.gl.deleteBuffer(this.buffer);
        this.gl.deleteVertexArray(this.vao);
    }
}