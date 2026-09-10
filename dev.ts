import {Application} from "./src";
import {Color} from "./src/color";
import {Sprite} from "./src/graph/Sprite";
import {Vector2} from "./src/math";
import {GameScene} from "./sample/scenes/GameScene";

const app = new Application();
document.body.appendChild(app.renderer.canvas);

app.renderer.canvas.width = window.innerWidth;
app.renderer.canvas.height = window.innerHeight;

app.renderer.clearColor = Color.BLACK;

const game = new GameScene(app);
app.ticker = (deltaTime) => game.update(deltaTime);
app.root.add(game);