import { Application, Color } from "../src";
import { GameScene } from "./scenes/GameScene";

const view = document.querySelector<HTMLCanvasElement>("#view");
if (!view) throw new Error("Canvas #view not found");

const app = new Application(view);
app.renderer.clearColor = Color.BLACK;

/*
await app.assets.load({
    player: "/assets/spaceship.png",
    player_accelerate: "/assets/spaceship_accelerate.png",
    particle: "/assets/explosion_particle.png",
    asteroid_small1: "/assets/asteroid_small1.png",
    asteroid_small2: "/assets/asteroid_small2.png",
    asteroid_medium1: "/assets/asteroid_medium1.png",
    asteroid_medium2: "/assets/asteroid_medium2.png",
    asteroid_big: "/assets/asteroid_big.png",
    bullet: "/assets/bullet.png",
});
 */

await app.assets.loadAtlas("./assets/main.json");

let game:GameScene;

function resize() {
    if (!view) return;
    view.width = view.clientWidth;
    view.height = view.clientHeight;
    if (game) game.resize();
}
resize();

game = new GameScene(app);
app.ticker = (dt) => game.update(dt);
app.root.add(game);

window.addEventListener("resize", resize);
