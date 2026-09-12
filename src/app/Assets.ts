import type { Renderer } from "../rendering";
import { TextureRegion, type Texture, type TextureView } from "../texture";
import type { Disposable } from "../core/Disposable";

interface AtlasFrame {
    frame: { x: number; y: number; w: number; h: number };
}

interface AtlasData {
    frames: Record<string, AtlasFrame>;
    meta: { image: string; size: { w: number; h: number } };
}

export class Assets implements Disposable {
    private readonly views = new Map<string, TextureView>();
    private readonly data = new Map<string, unknown>();
    private readonly pages: Texture[] = []; // GPU-owning textures, for disposal

    constructor(private readonly renderer: Renderer) {}

    /**
     * Load key -> image-url; resolves once every page is ready.
     * @param manifest
     */
    async load(manifest: Record<string, string>): Promise<void> {
        await Promise.all(
            Object.entries(manifest).map(async ([key, url]) => {
                const texture = this.renderer.loadTexture(url);
                await texture.ready;
                this.pages.push(texture);
                this.views.set(key, texture);
            }),
        );
    }

    /**
     * Load key -> json-url into the data store.
     * @param manifest
     */
    async loadData(manifest: Record<string, string>): Promise<void> {
        await Promise.all(
            Object.entries(manifest).map(async ([key, url]) => {
                this.data.set(key, await fetchJson(url));
            }),
        );
    }

    /**
     * Load a Texture-Packer (Pixi) atlas.
     * @param jsonUrl
     */
    async loadAtlas(jsonUrl: string): Promise<void> {
        const atlas = (await fetchJson(jsonUrl)) as AtlasData;
        const dir = jsonUrl.slice(0, jsonUrl.lastIndexOf("/") + 1); // page path is relative to the json
        const page = this.renderer.loadTexture(dir + atlas.meta.image);
        await page.ready;
        this.pages.push(page);
        for (const [name, entry] of Object.entries(atlas.frames)) {
            const key = name.replace(/\.[^/.]+$/, ""); // drop a file extension if the packer kept it
            this.views.set(key, new TextureRegion(page, entry.frame));
        }
    }

    /**
     * @param key
     */
    get(key: string): TextureView {
        const view = this.views.get(key);
        if (!view) throw new Error(`Asset not loaded: "${key}"`);
        return view;
    }

    /**
     * @param key
     */
    getData<T>(key: string): T {
        const value = this.data.get(key);
        if (value === undefined) throw new Error(`Data not loaded: "${key}"`);
        return value as T;
    }

    dispose(): void {
        for (const page of this.pages) page.dispose();
        this.pages.length = 0;
        this.views.clear();
        this.data.clear();
    }
}

/**
 * @param url
 */
async function fetchJson(url: string): Promise<unknown> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch "${url}": ${res.status}`);
    return res.json();
}