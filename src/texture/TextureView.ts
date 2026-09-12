export interface TextureView {
    readonly source: WebGLTexture;
    readonly u0: number; readonly v0: number;
    readonly u1: number; readonly v1: number;
    readonly width: number; // region size in pixels (default quad size)
    readonly height: number;
}