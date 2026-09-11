import { hexToRgba } from "../color";
import { Matrix3 } from "../math";
import { Mesh } from "../graph/Mesh";
import { Texture } from "../texture";

import type { SceneNode } from "../graph";
import type { Disposable } from "../core/Disposable";

const vert = `#version 300 es
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_texCoord;
uniform mat3 u_matrix;
out vec2 v_texCoord;
void main() {
    vec3 pos = u_matrix * vec3(a_position, 1.0);
    gl_Position = vec4(pos.xy, 0.0, 1.0);
    v_texCoord = a_texCoord;
}
`;

const frag = `#version 300 es
precision highp float;
in vec2 v_texCoord;
uniform sampler2D u_texture;
uniform vec4 u_color;
out vec4 outColor;
void main() {
    outColor = texture(u_texture, v_texCoord) * u_color;
    //outColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

export class Renderer implements Disposable {
    public readonly canvas: HTMLCanvasElement;
    public clearColor?: string;

    private disposed = false;

    private readonly gl: WebGL2RenderingContext;
    private readonly program: WebGLProgram;
    private readonly matrixLocation: WebGLUniformLocation | null;
    private readonly colorLocation: WebGLUniformLocation | null;
    private readonly whiteTexture: WebGLTexture;

    constructor(canvas?: HTMLCanvasElement) {
        this.canvas = canvas ?? document.createElement("canvas");
        const gl = this.canvas.getContext("webgl2");
        if (!gl) throw new Error("WebGL2 not supported");
        this.gl = gl;

        this.program = createProgram(gl, vert, frag);
        this.matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
        this.colorLocation = gl.getUniformLocation(this.program, "u_color");

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.useProgram(this.program);
        gl.uniform1i(gl.getUniformLocation(this.program, "u_texture"), 0);

        const white = gl.createTexture();
        if (!white) throw new Error("Failed to create texture");
        gl.bindTexture(gl.TEXTURE_2D, white);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            1,
            1,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            new Uint8Array([255, 255, 255, 255]),
        );
        this.whiteTexture = white;
    }

    render(root: SceneNode): void {
        const gl = this.gl;
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        if (this.clearColor) {
            const rgba = hexToRgba(this.clearColor);
            gl.clearColor(rgba[0], rgba[1], rgba[2], 1);
        } else {
            gl.clearColor(0, 0, 0, 1);
        }
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(this.program);
        const projection = Matrix3.projection(this.canvas.width, this.canvas.height);
        this.drawNode(root, projection);
    }

    private drawNode(node: SceneNode, projection: Matrix3): void {
        if (!node.visible) return;

        if (node instanceof Mesh) {
            const gl = this.gl;
            const matrix = projection.multiply(node.worldMatrix);
            node.upload(gl);

            gl.uniformMatrix3fv(this.matrixLocation, false, matrix.data);
            gl.uniform4fv(this.colorLocation, node.color);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, node.texture?.texture ?? this.whiteTexture);

            node.draw(gl);
        }
        for (const c of node.children) this.drawNode(c, projection);
    }

    /**
     * Texture factory
     * @param url
     */
    public loadTexture(url: string): Texture {
        return new Texture(this.gl, url);
    }

    dispose(): void {
        if (this.disposed) return;
        this.disposed = true;
        this.gl.deleteProgram(this.program);
        this.gl.deleteTexture(this.whiteTexture);
    }
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Failed to create shader");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(`Shader compile failed: ${log}`);
    }
    return shader;
}

function createProgram(
    gl: WebGL2RenderingContext,
    vertexSource: string,
    fragmentSource: string,
): WebGLProgram {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!program) throw new Error("Failed to create program");
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const log = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error(`Program link failed: ${log}`);
    }
    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return program;
}
