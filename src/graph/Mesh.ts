import {SceneNode} from "./SceneNode";
import {Texture} from "../texture/Texture";

export abstract class Mesh extends SceneNode {
    public color: [number, number, number, number] = [1, 1, 1, 1];
    public texture?: Texture;

    private uploaded = false;
    private vao: WebGLVertexArrayObject | null = null;
    private vertexCount = 0;

    protected abstract getVertices(): Float32Array;

    /**
     * Lazily build the GPU buffer + VAO. No-op after the first call.
     * @param gl
     */
    public upload(gl: WebGL2RenderingContext): void {
        if (this.uploaded) return;

        const vertices = this.getVertices();
        this.vertexCount = vertices.length / 4;   // now 4 floats per vertex

        const buffer = gl.createBuffer();
        if (!buffer) throw new Error("Failed to create buffer");
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const vao = gl.createVertexArray();
        if (!vao) throw new Error("Failed to create VAO");
        gl.bindVertexArray(vao);

        const stride = 4 * Float32Array.BYTES_PER_ELEMENT; // 16 bytes
        gl.enableVertexAttribArray(0); // a_position
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(1); // a_texCoord
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);

        gl.bindVertexArray(null);
        this.vao = vao;
        this.uploaded = true;
    }

    /**
     * Bind geometry and draw.
     * @param gl
     */
    public draw(gl: WebGL2RenderingContext): void {
        gl.bindVertexArray(this.vao);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
    }
}
