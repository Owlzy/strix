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
sprite.texture = app.renderer.loadTexture("/test.png");

sprite.position = new Vector2(100, 100);
sprite.rotation = 0.3;
sprite.anchor = new Vector2(0.5, 0.5);
sprite.scale = new Vector2(2, 2);
app.root.add(sprite);