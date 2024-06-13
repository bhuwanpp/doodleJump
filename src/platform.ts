export class Platform {
  constructor(
    public img: HTMLImageElement,
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public ctx: CanvasRenderingContext2D
  ) {}

  drawPlatform() {
    this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}
