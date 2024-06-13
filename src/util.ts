// canvas
export const canvasWidth = 640;
export const canvasHeight = 700;
// player
export let playerX = canvasWidth / 2;
export let playerY = 150;
export const playerWidth = 100;
export const playerHeight = 100;
export let payerDy = 6;

// platform
export const platformWidth = 100;
export const platformHeight = 30;

// type for min max
type RandomNum = {
  max: number;
  min: number;
};

/**
 *It represents  to make random number
 * @param param0 max:number, min:number
 * @returns  random num:number
 */
export function random({ max, min }: RandomNum): number {
  let num: number = Math.floor(Math.random() * (max - min) + min);
  return num;
}
