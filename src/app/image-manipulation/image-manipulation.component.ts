import { Component, ElementRef, ViewChild } from '@angular/core';

import { ImageManipulationService } from './image-manipulation.service';

@Component({
    selector: 'app-image-manipulation',
    templateUrl: './image-manipulation.component.html',
    styleUrls: ['./image-manipulation.component.scss'],
})
export class ImageManipulationComponent {
    @ViewChild('imageCanvas') imageCanvas!: ElementRef<HTMLCanvasElement>;
    public ctx!: CanvasRenderingContext2D;
    public img!: HTMLImageElement;
    public originalImageData: ImageData | null = null;
    rotation = 0;
    selectedColor = '#000000';

    constructor(public imageManipulationService: ImageManipulationService) {}

    ngAfterViewInit() {
        const context = this.imageCanvas.nativeElement.getContext('2d');
        if (!context) {
            throw new Error('Failed to get the 2D rendering context.');
        }
        this.ctx = context;
    }

    onFileSelected(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            const file = target.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                this.img = new Image();
                this.img.src = reader.result as string;
                this.img.onload = () => {
                    this.drawImage();
                };
            };

            reader.readAsDataURL(file);
        }
    }

    drawImage() {
        if (!this.ctx || !this.img) return;

        this.rotation = 0;
        this.originalImageData = this.imageManipulationService.drawImage(
            this.ctx,
            this.img
        );
    }

    changeColor() {
        if (!this.ctx || !this.originalImageData) return;

        this.imageManipulationService.changeColor(
            this.ctx,
            this.originalImageData,
            this.selectedColor
        );
    }

    rotateImage() {
        this.rotation = this.imageManipulationService.rotateImage(
            this.rotation
        );
        this.originalImageData = this.imageManipulationService.drawRotatedImage(
            this.ctx,
            this.img,
            this.rotation
        );

        // Reapply the color change after rotation
        this.changeColor();
    }
}
