import {Application} from './src';

const app = new Application();
document.body.appendChild(app.renderer.canvas);

app.renderer.canvas.width = screen.width;
app.renderer.canvas.height = screen.height;