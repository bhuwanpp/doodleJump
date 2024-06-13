/**
 * It represents the Monster enemy it contain x, y, width , height
 */

export class Monster {
  constructor(
    public img: HTMLImageElement,
    public sx: number,
    public sy: number,
    public swidth: number,
    public sheight: number,
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public ctx: CanvasRenderingContext2D
  ) {}

  drawMonster() {
    this.ctx.drawImage(
      this.img,
      this.sx,
      this.sy,
      this.swidth,
      this.sheight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
