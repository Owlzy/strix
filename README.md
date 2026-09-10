# Strix

A lightweight 2D WebGL2 engine written in TypeScript; a scene graph, textured sprites, and input, with **zero runtime dependencies**.

![License](https://img.shields.io/badge/license-MIT-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)
![WebGL2](https://img.shields.io/badge/render-WebGL2-990000)
![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)

Strix gives you the pieces you need to put moving, textured things on a canvas; a transform hierarchy, sprite rendering, asset loading and a game loop; without the weight of a full engine. It's small, strict, and built to be read and understood for learning purposes, rather than as a production ready framework.

## Features

- **WebGL2 renderer** with a batched draw path, alpha blending, and a pixel-space projection so you work in screen coordinates, not clip space.
- **Scene graph** with a full transform hierarchy — position, rotation, scale and anchors, resolved parent-to-child each frame.
- **Textured sprites** that size themselves to their image, tint via a colour, and blend transparency correctly.
- **Async, keyed asset loading** — declare a manifest, `await` it once, then look textures up by name anywhere.
- **Keyboard input** as pollable state, built for game loops rather than one-off events.
- **Delta-time loop** so motion is frame-rate independent.
- **Strict TypeScript throughout**, shipped as tree-shakeable ESM with type declarations.

## Quick start

Project isn't on NPM yet, so simply grab the bundle from dist and import it.

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

That's a spinning sprite on screen. Everything below is detail.

## Core concepts

**`Application`** is the entry point. It owns the renderer, the game loop, the scene root, the asset store and input:

```ts
const app = new Application();          // creates its own canvas...
const app = new Application(myCanvas);  // ...or takes one you supply
```

- `app.renderer` — the WebGL2 renderer (`clearColor`, `canvas`, `loadTexture`).
- `app.root` — the root `SceneNode`; add things with `app.root.add(node)`.
- `app.assets` — the asset store (`load`, `get`).
- `app.ticker` — a callback run every frame with the delta time.

**The scene graph** is a tree of `SceneNode`s. Each node has a transform (`position`/`rotation`/`scale`) and children; world transforms are computed down the tree every frame. `Mesh` is a `SceneNode` with geometry, and `Sprite` is a `Mesh` that draws a textured quad.

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

**Math** — `Vector2` and a column-major `Mat3` for 2D transforms (translate/rotate/scale, plus a pixel-to-clip projection), laid out to hand straight to WebGL uniforms.

## Development

```bash
npm run dev        # dev server (serves the sample game)
npm run build      # type-check, then bundle the library to dist/
npm run typecheck  # tsc --noEmit
```

Strix builds with [Vite](https://vitejs.dev) in library mode. Because Vite transpiles but doesn't type-check, `typecheck` is the command that actually enforces the types — the dev server will happily run with type errors, so lean on it (and your editor).

## Sample game

`sample/` contains a small Asteroids-style game that exercises the engine — sprite movement with thrust physics, screen wrapping, keyboard control and asset loading. Run `npm run dev` to play it, and read it as a worked example of building on Strix.

## Design notes

A few deliberate choices, in case you're reading the source:

- **Transforms and rendering are separate passes.** The loop resolves every node's world transform first, then the renderer walks the tree and draws. Keeping them apart is what leaves room for sorting and batching.
- **GL resources are handled at the boundary.** WebGL's creation calls are nullable and its objects need care; those are wrapped once (in `Renderer`, `Texture`, `Mesh`) so the rest of the engine works with clean, non-null types.
- **The scene graph is context-free.** Nodes carry data and transforms, not a GL context, so they're simple to reason about and test; the renderer realises them on the GPU.

## Contributing

Issues and pull requests are welcome. Keep PRs small and single-purpose, with a clear description of what changed and why, and run `npm run typecheck` before opening one.

## License

MIT © Owain Bell
