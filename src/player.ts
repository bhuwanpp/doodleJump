import { gravity } from "./main";
/**
 * It represents doodle Player in the game
 * It contains img, x, y, width , height, its velocity
 */
export class Player {
  constructor(
    public img: HTMLImageElement,
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public vy: number,
    public ctx: CanvasRenderingContext2D
  ) {}

  drawPlayer() {
    this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  updatePlayer() {
    this.vy += gravity;
    this.y += this.vy;
  }
}
