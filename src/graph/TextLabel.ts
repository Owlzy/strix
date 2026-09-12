import { Sprite } from "./Sprite";
import { CanvasTexture } from "../texture/CanvasTexture";

export interface TextStyle {
    fontFamily: string;
    fontSize: number;
    fill: string;
}

const DEFAULT_STYLE: TextStyle = {
    fontFamily: "sans-serif",
    fontSize: 16,
    fill: "#ffffff",
};

export class TextLabel extends Sprite {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private readonly style: TextStyle;

    private gpu: CanvasTexture | null = null; // created lazily on first draw
    private dirty = true;
    private _text: string;

    constructor(text: string = "", style: Partial<TextStyle> = {}) {
        super();
        this.canvas = document.createElement("canvas");
        const ctx = this.canvas.getContext("2d");
        if (!ctx) throw new Error("2D canvas context unavailable");
        this.ctx = ctx;
        this.style = { ...DEFAULT_STYLE, ...style };
        this._text = text;
        this.rasterise();
    }

    get text(): string { return this._text; }
    set text(value: string) {
        if (value === this._text) return;
        this._text = value;
        this.rasterise();
    }

    /**
     * Draw the string using DOM and size the sprite.
     * @private
     */
    private rasterise(): void {
        const { ctx, canvas, style } = this;
        const dpr = window.devicePixelRatio || 1;
        const font = `${style.fontSize}px ${style.fontFamily}`;

        ctx.font = font;                                    // before measuring
        const w = Math.max(1, Math.ceil(ctx.measureText(this._text).width));
        const h = Math.max(1, Math.ceil(style.fontSize * 1.3));

        canvas.width = w * dpr;                             // resizing resets ctx state...
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
        ctx.font = font;                                    // ...so re-apply after resize
        ctx.textBaseline = "top";
        ctx.fillStyle = style.fill;
        ctx.fillText(this._text, 0, 0);

        this.width = w;                                     // logical size; texture holds device px
        this.height = h;
        this.dirty = true;                                  // upload deferred to prepare()
    }

    /**
     * Draw-time GL injection: build/refresh the GPU texture. gl is not stored.
     * @param gl
     */
    override prepare(gl: WebGL2RenderingContext): void {
        if (!this.gpu) {
            this.gpu = new CanvasTexture(gl);
            this.texture = this.gpu;                        // now drawable
        }
        if (this.dirty) {
            this.gpu.update(this.canvas);
            this.dirty = false;
        }
    }

    protected override onDispose(): void {
        this.gpu?.dispose(); // only dispose if we drew it
    }
}