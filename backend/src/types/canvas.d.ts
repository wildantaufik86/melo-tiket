declare module 'canvas' {
  export class CanvasRenderingContext2D {
    drawImage(image: any, dx: number, dy: number, dWidth?: number, dHeight?: number): void;
    fillText(text: string, x: number, y: number, maxWidth?: number): void;
    font: string;
    fillStyle: string;
    textAlign: 'start' | 'end' | 'left' | 'right' | 'center';
  }

  export class Canvas {
    getContext(contextId: string): CanvasRenderingContext2D;
    toDataURL(type?: string, quality?: number): string;
    width: number;
    height: number;
  }

  export function createCanvas(width: number, height: number): Canvas;
  export function loadImage(source: string): Promise<any>;

  export function registerFont(path: string, options: { family: string, weight?: string, style?: string }): void;
}
