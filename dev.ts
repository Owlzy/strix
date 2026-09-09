import {Application} from "./src";
import {Color} from "./src/color";
import {Sprite} from "./src/graph/Sprite";
import {Vector2} from "./src/math";

const app = new Application();
document.body.appendChild(app.renderer.canvas);

app.renderer.canvas.width = screen.width;
app.renderer.canvas.height = screen.height;

app.renderer.clearColor = Color.BLACK;

const sprite = new Sprite();
sprite.position = new Vector2(100, 100);
app.root.add(sprite);