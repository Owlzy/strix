import {Application} from "./src";
import {Color} from "./src/color";
import {Sprite} from "./src/graph/Sprite";
import {Vector2} from "./src/math";
import {GameScene} from "./sample/scenes/GameScene";

const app = new Application();
document.body.appendChild(app.renderer.canvas);

app.renderer.canvas.width = screen.width;
app.renderer.canvas.height = screen.height;

app.renderer.clearColor = Color.BLACK;

const game = new GameScene(app);
app.root.add(game);