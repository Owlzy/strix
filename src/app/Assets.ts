import type {Renderer} from "../rendering";
import type {Texture} from "../texture";

export class Assets {
    private readonly textures = new Map<string, Texture>();

    constructor(private readonly renderer: Renderer) {}

    /** Load a manifest of key -> url; resolves once every texture is ready. */
    async load(manifest: Record<string, string>): Promise<void> {
        await Promise.all(
            Object.entries(manifest).map(async ([key, url]) => {
                const texture = this.renderer.loadTexture(url);
                await texture.ready;
                this.textures.set(key, texture);
            }),
        );
    }

    get(key: string): Texture {
        const texture = this.textures.get(key);
        if (!texture) throw new Error(`Asset not loaded: "${key}"`);
        return texture;
    }
}