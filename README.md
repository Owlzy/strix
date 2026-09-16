# Strix

A lightweight 2D WebGL2 engine written in TypeScript, with **zero runtime dependencies**. It provides a scene graph, batched sprite rendering, texture atlases, text, asset loading and a game loop.

![License](https://img.shields.io/badge/license-MIT-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)
![WebGL2](https://img.shields.io/badge/render-WebGL2-990000)
![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)

Strix is a small set of building blocks for drawing moving, textured things on a canvas. It is strict, dependency-free, and written to be read. Use it for learning and small projects rather than as a production framework.

## Features

- WebGL2 renderer with a batched draw path. Sprites that share a texture are drawn together in one call. Alpha blending is enabled, and the projection is in pixel space, so you work in screen coordinates rather than clip space.
- Scene graph with a full transform hierarchy: position, rotation, scale and anchors, resolved from parent to child every frame.
- Textured sprites that size themselves to their image, tint with a colour, and blend transparency correctly.
- Texture atlases in the Free Texture Packer (Pixi) JSON format. Pack sprites into one sheet, load them by name, and they batch into a single draw call.
- Text rendering with `TextLabel`, which rasterises a string to a texture for a score or other on-screen text.
- Async, keyed asset loading. Declare a manifest, `await` it once, then look assets up by name.
- Delta-time loop, so motion stays frame-rate independent.
- Explicit disposal for GPU resources, which the garbage collector does not free on its own.
- Strict TypeScript throughout, shipped as tree-shakeable ESM with type declarations.

Input is left to the game rather than baked into the engine, which keeps the engine focused on rendering and scene management. The sample includes a small pollable `Keyboard` you can copy or adapt.

## Quick start

Strix is not on npm yet. Build it (see Building below) and import the bundle from `dist`.

```ts
import { Application, Sprite, Color, Vector2 } from "strix";

const app = new Application();
document.body.appendChild(app.renderer.canvas);
app.renderer.clearColor = Color.BLACK;

// preload assets, then look them up by key
await app.assets.load({ hero: "/hero.png" });

const hero = new Sprite(app.assets.get("hero"));  // sized to the image
hero.anchor = new Vector2(0.5, 0.5);              // pivot on the centre
hero.x = 200;
hero.y = 150;
app.root.add(hero);

// drive it from the loop; dt is seconds since the last frame
app.ticker = (dt) => {
    hero.rotation += dt;
};
```

That draws a spinning sprite centred at (200, 150). The sections below explain the pieces.

## Core concepts

**`Application`** is the entry point. It owns the renderer, the game loop, the scene root and the asset store:

```ts
const app = new Application();          // creates its own canvas
const app = new Application(myCanvas);  // or takes one you supply
```

- `app.renderer`: the WebGL2 renderer (`clearColor`, `canvas`, `loadTexture`).
- `app.root`: the root `SceneNode`. Add things with `app.root.add(node)`.
- `app.assets`: the asset store (`load`, `loadAtlas`, `get`).
- `app.ticker`: a callback run every frame with the delta time.

**The scene graph** is a tree of `SceneNode`s. Each node has a transform (`position`, `rotation`, `scale`) and children, and world transforms are computed down the tree every frame. `Mesh` is a `SceneNode` with geometry, and `Sprite` is a `Mesh` that draws a textured quad.

```ts
const group = new SceneNode();
group.add(spriteA);
group.add(spriteB);   // A and B move with the group
app.root.add(group);
```

**Assets** load in parallel and resolve together, so nothing renders half-loaded:

```ts
await app.assets.load({
    player: "/player.png",
    asteroid: "/asteroid.png",
});
const sprite = new Sprite(app.assets.get("player"));
```

For a texture atlas, use `loadAtlas` with a Free Texture Packer JSON file. Each frame is then available by name through `app.assets.get`, exactly like a loose texture.

**Math**: `Vector2` and a column-major `Mat3` for 2D transforms (translate, rotate, scale, plus a pixel-to-clip projection), laid out to pass straight to WebGL uniforms.

## Building

You need Node and npm.

```bash
npm install
npm run dev          # dev server, serves the sample game with hot reload
npm run build        # type-check, then bundle the library to dist/
npm run typecheck    # tsc --noEmit
npm run format       # format with Prettier
```

Strix builds with [Vite](https://vitejs.dev) in library mode and emits an ESM bundle, a UMD bundle for script tags, and type declarations. Vite transpiles but does not type-check, so `npm run typecheck` (and your editor) is what enforces the types. The dev server runs even with type errors.

Shaders live in `shaders/` as `.vert` and `.frag` files. A Vite plugin imports them as strings and inlines them into the bundle at build time, so they add no runtime dependency.

## Sample game

`sample/` contains a small Asteroids-style game that exercises the engine: thrust movement, screen wrapping, shooting with a bullet pool, splitting asteroids, score, lives, and win and lose states. Run `npm run dev` to play it, and read it as a worked example.

In development the sample imports the engine from source, so editing the engine hot-reloads the game.

### Building and hosting the sample

```bash
npm run build:sample     # build the engine, then the sample, into sample-dist/
npm run preview:sample   # serve sample-dist/ locally to check the build
```

`build:sample` produces a self-contained static site in `sample-dist/`: an `index.html`, the bundled JavaScript, and the art under `assets/`. It uses relative paths, so it runs at a domain root, in a subfolder, or on GitHub Pages without changes. Copy `sample-dist/` to any static host.

The sample build imports the engine from the built `dist/` bundle rather than source, so it also confirms the packaged library works.

## Design notes

Some choices worth knowing if you read the source:

- Transforms and rendering are separate passes. The loop resolves every node's world transform first, then the renderer walks the tree and draws. Keeping them apart leaves room for sorting and batching.
- GL resources are handled at the boundary. WebGL's creation calls are nullable and its objects need care, so they are wrapped once (in `Renderer`, `Texture`, `Mesh`, `Batcher`) and the rest of the engine works with clean, non-null types.
- The scene graph is context-free. Nodes carry data and transforms, not a GL context, so they are simple to reason about and test. The renderer realises them on the GPU, and hands a node the context only when one genuinely needs it, such as text uploading its canvas.
- GPU resources are freed explicitly. Textures, buffers and programs are not reclaimed by the garbage collector, so the objects that own them expose `dispose`.

## Contributing

Issues and pull requests are welcome. Keep pull requests small and single-purpose, describe what changed and why, and run `npm run typecheck` before opening one.

## License

MIT © Owain Bell