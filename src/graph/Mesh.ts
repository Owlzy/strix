import { SceneNode } from "./SceneNode";
import type { Texture } from "../texture";

export abstract class Mesh extends SceneNode {
    public color: [number, number, number, number] = [1, 1, 1, 1];
    public texture?: Texture;

    private uploaded = false;
    private vao: WebGLVertexArrayObject | null = null;
    private buffer: WebGLBuffer | null = null;        // keep it or we can never free it
    private vertexCount = 0;
    private gl: WebGL2RenderingContext | null = null; // needed at disposal time

    protected abstract getVertices(): Float32Array;

    public upload(gl: WebGL2RenderingContext): void {
        if (this.uploaded) return;
        this.gl = gl;
        const vertices = this.getVertices();
        this.vertexCount = vertices.length / 4;

        const buffer = gl.createBuffer();
        if (!buffer) throw new Error("Failed to create buffer");
        this.buffer = buffer;                          // <- the line that was missing
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const vao = gl.createVertexArray();
        if (!vao) throw new Error("Failed to create VAO");
        gl.bindVertexArray(vao);
        const stride = 4 * Float32Array.BYTES_PER_ELEMENT;
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
        gl.bindVertexArray(null);
        this.vao = vao;
        this.uploaded = true;
    }

    public draw(gl: WebGL2RenderingContext): void {
        gl.bindVertexArray(this.vao);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
    }

    protected override onDispose(): void {
        // Free only what this mesh created. texture is BORROWED — its owner frees it.
        const gl = this.gl;
        if (gl) {
            gl.deleteVertexArray(this.vao);
            gl.deleteBuffer(this.buffer);
        }
        this.vao = null;
        this.buffer = null;
        this.gl = null;
        this.uploaded = false;
    }
}