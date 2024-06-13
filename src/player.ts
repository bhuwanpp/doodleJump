import { gravity } from "./main";

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
    // let borderWidth = 2; // Adjust border width as needed
    // this.ctx.strokeStyle = "red"; // Border color
    // this.ctx.lineWidth = borderWidth; // Border width
    // this.ctx.strokeRect(
    //   this.x - borderWidth / 2,
    //   this.y - borderWidth / 2,
    //   this.width + borderWidth,
    //   this.height + borderWidth
    // );

    this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  updatePlayer() {
    this.vy += gravity;
    this.y += this.vy;
  }
}
