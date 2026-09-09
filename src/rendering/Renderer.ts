import {hexToRgba} from "../color";

const vert = `#version 300 es
in vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
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
    private readonly vao: WebGLVertexArrayObject;
    private readonly vertexCount: number;

    constructor(canvas?: HTMLCanvasElement) {
        this.canvas = canvas ?? document.createElement('canvas');
        const gl = this.canvas.getContext('webgl2');
        if (!gl) throw new Error('WebGL2 not supported');
        this.gl = gl;

        // --- one-time setup ---
        this.program = createProgram(gl, vert, frag);

        const positions = new Float32Array([
            0.0, 0.5,
            -0.5, -0.5,
            0.5, -0.5,
        ]);
        this.vertexCount = positions.length / 2;

        const positionBuffer = gl.createBuffer();
        if (!positionBuffer) throw new Error('Failed to create buffer');
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const vao = gl.createVertexArray();
        if (!vao) throw new Error('Failed to create VAO');
        this.vao = vao;
        gl.bindVertexArray(vao);

        const positionLocation = gl.getAttribLocation(this.program, 'a_position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.useProgram(this.program);

        const colorLocation = gl.getUniformLocation(this.program, 'u_color');
        gl.uniform4f(colorLocation, 1, 1, 1, 1); // white

        gl.bindVertexArray(null);
    }

    render() {
        const gl = this.gl;

        gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        if (this.clearColor) {
            const rgba = hexToRgba(this.clearColor);
            gl.clearColor(rgba[0], rgba[1], rgba[2], 1);
        } else {
            gl.clearColor(0, 0, 0, 1);
        }
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if (this.program) {
            gl.useProgram(this.program);
            gl.bindVertexArray(this.vao);
            gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
        }
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