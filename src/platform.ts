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
    // // Draw the border
    // let borderWidth = 2; // Adjust border width as needed
    // this.ctx.strokeStyle = "blue"; // Border color
    // this.ctx.lineWidth = borderWidth; // Border width
    // this.ctx.strokeRect(
    //   this.x - borderWidth / 2,
    //   this.y - borderWidth / 2,
    //   this.width + borderWidth,
    //   this.height + borderWidth
    // );

    this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}
