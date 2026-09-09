import {SceneNode} from "./SceneNode";

export abstract class Mesh extends SceneNode {
    public color: [number, number, number, number] = [1, 1, 1, 1];

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
        this.vertexCount = vertices.length / 2;

        const buffer = gl.createBuffer();
        if (!buffer) throw new Error('Failed to create buffer');
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const vao = gl.createVertexArray();
        if (!vao) throw new Error('Failed to create VAO');
        gl.bindVertexArray(vao);
        gl.enableVertexAttribArray(0);                 // a_position = layout(location = 0)
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
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