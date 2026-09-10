import {Application} from "./src";
import {Color} from "./src/color";
import {GameScene} from "./sample/scenes/GameScene";

const app = new Application();
document.body.appendChild(app.renderer.canvas);

app.renderer.canvas.width = window.innerWidth;
app.renderer.canvas.height = window.innerHeight;

app.renderer.clearColor = Color.BLACK;

await app.assets.load({
    player: "/test.png",
});

const game = new GameScene(app);
app.ticker = (deltaTime) => game.update(deltaTime);
app.root.add(game);