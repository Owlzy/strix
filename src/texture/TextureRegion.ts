import type {TextureView} from "./TextureView";
import type {Texture} from "./Texture";

export class TextureRegion implements TextureView {
    constructor(
        private readonly page: Texture,
        private readonly frame: { x: number; y: number; w: number; h: number },
    ) {}

    get source(): WebGLTexture { return this.page.source; }
    get u0(): number { return this.frame.x / this.page.width; }
    get v0(): number { return this.frame.y / this.page.height; }
    get u1(): number { return (this.frame.x + this.frame.w) / this.page.width; }
    get v1(): number { return (this.frame.y + this.frame.h) / this.page.height; }
    get width(): number { return this.frame.w; }
    get height(): number { return this.frame.h; }
}