import {hexToRgba} from "../color";
import {Mat3} from "../math";
import type {Mesh} from "../graph/Mesh";

const vert = `#version 300 es
layout(location = 0) in vec2 a_position;
uniform mat3 u_matrix;
void main() {
    vec3 pos = u_matrix * vec3(a_position, 1.0);
    gl_Position = vec4(pos.xy, 0.0, 1.0);
}
`;

const frag = `#version 300 es
precision highp float;
uniform vec4 u_color;
out vec4 outColor;
void main() {
    outColor = u_color;
}
`;

export class Renderer {
    public readonly canvas: HTMLCanvasElement;
    public clearColor?: string;

    private readonly gl: WebGL2RenderingContext;
    private readonly program: WebGLProgram;
    private readonly matrixLocation: WebGLUniformLocation | null;
    private readonly colorLocation: WebGLUniformLocation | null;

    constructor(canvas?: HTMLCanvasElement) {
        this.canvas = canvas ?? document.createElement('canvas');
        const gl = this.canvas.getContext('webgl2');
        if (!gl) throw new Error('WebGL2 not supported');
        this.gl = gl;

        this.program = createProgram(gl, vert, frag);
        this.matrixLocation = gl.getUniformLocation(this.program, 'u_matrix');
        this.colorLocation = gl.getUniformLocation(this.program, 'u_color');
    }

    render(mesh: Mesh): void {
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

        // pixels -> clip space; rebuilt each frame so it tracks canvas size
        const projection = Mat3.projection(this.canvas.width, this.canvas.height);
        const matrix = projection.multiply(mesh.worldMatrix);

        mesh.upload(gl);
        gl.uniformMatrix3fv(this.matrixLocation, false, matrix.data);
        gl.uniform4fv(this.colorLocation, mesh.color);
        mesh.draw(gl);
    }
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
    const shader = gl.createShader(type);
    if (!shader) throw new Error('Failed to create shader');
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(`Shader compile failed: ${log}`);
    }
    return shader;
}

function createProgram(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string): WebGLProgram {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!program) throw new Error('Failed to create program');
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const log = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error(`Program link failed: ${log}`);
    }
    return program;
}