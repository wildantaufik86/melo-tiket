declare module 'canvas' {
  export class Canvas {
    getContext(contextId: string): CanvasRenderingContext2D;
    toDataURL(type?: string, quality?: number): string;
    width: number;
    height: number;
  }

  export class CanvasRenderingContext2D {
    drawImage(image: any, dx: number, dy: number, dWidth?: number, dHeight?: number): void;
    fillText(text: string, x: number, y: number, maxWidth?: number): void;
    font: string;
    fillStyle: string;
  }

  export function createCanvas(width: number, height: number): Canvas;
  export function loadImage(source: string): Promise<any>;
}
