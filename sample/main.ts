import { Application, Color } from "strix";
import { GameScene } from "./scenes/GameScene";

const view = document.querySelector<HTMLCanvasElement>("#view");
if (!view) throw new Error("Canvas #view not found");

const app = new Application(view);
app.renderer.clearColor = Color.BLACK;

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
