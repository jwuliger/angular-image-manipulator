import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ImageManipulationService {
    constructor() {}

    drawImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement): ImageData {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        return ctx.getImageData(0, 0, img.width, img.height);
    }

    drawRotatedImage(
        ctx: CanvasRenderingContext2D,
        img: HTMLImageElement,
        rotation: number
    ): ImageData {
        const centerX = img.width / 2;
        const centerY = img.height / 2;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        ctx.drawImage(img, -centerX, -centerY);
        ctx.restore();

        return ctx.getImageData(0, 0, img.width, img.height);
    }

    changeColor(
        ctx: CanvasRenderingContext2D,
        originalImageData: ImageData,
        selectedColor: string
    ): void {
        ctx.putImageData(originalImageData, 0, 0);

        const imageData = ctx.getImageData(
            0,
            0,
            originalImageData.width,
            originalImageData.height
        );
        const data = imageData.data;
        const rgbColor = this.hexToRgb(selectedColor);

        for (let i = 0; i < data.length; i += 4) {
            data[i] = (data[i] * rgbColor!.r) / 255;
            data[i + 1] = (data[i + 1] * rgbColor!.g) / 255;
            data[i + 2] = (data[i + 2] * rgbColor!.b) / 255;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    rotateImage(rotation: number): number {
        return (rotation + Math.PI / 2) % (2 * Math.PI);
    }

    private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            return {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            };
        } else {
            return null;
        }
    }
}
