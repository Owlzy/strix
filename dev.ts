import { Application } from "./src";
import { Color } from "./src/color";

const app = new Application();
document.body.appendChild(app.renderer.canvas);

app.renderer.canvas.width = screen.width;
app.renderer.canvas.height = screen.height;

app.renderer.clearColor = Color.BLACK;
