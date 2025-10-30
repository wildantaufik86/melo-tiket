declare module 'qrcode' {
  export function toDataURL(
    text: string,
    options?: {
      errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
      margin?: number;
      width?: number;
      color?: {
        dark?: string;
        light?: string;
      };
    }
  ): Promise<string>;

  export function toCanvas(
    canvas: any,
    text: string,
    options?: object
  ): Promise<any>;

  export function toBuffer(
    text: string,
    options?: {
      errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
      margin?: number;
      width?: number;
      color?: {
        dark?: string;
        light?: string;
      };
    }
  ): Promise<Buffer>;
}
