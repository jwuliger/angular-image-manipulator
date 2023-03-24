import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageManipulationComponent } from './image-manipulation.component';
import { ImageManipulationService } from './image-manipulation.service';

describe('ImageManipulationComponent', () => {
    let component: ImageManipulationComponent;
    let fixture: ComponentFixture<ImageManipulationComponent>;
    let imageManipulationService: ImageManipulationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ImageManipulationComponent],
            providers: [ImageManipulationService],
        }).compileComponents();

        fixture = TestBed.createComponent(ImageManipulationComponent);
        component = fixture.componentInstance;
        imageManipulationService = TestBed.inject(ImageManipulationService);
        fixture.detectChanges();
    });

    it('should create and initialize default values', () => {
        expect(component).toBeTruthy();
        expect(component.rotation).toBe(0);
        expect(component.selectedColor).toBe('#000000');
        expect(component.originalImageData).toBeNull();
    });

    it('should set up the canvas context after view init', () => {
        component.ngAfterViewInit();
        expect(component.ctx).toBeTruthy();
        expect(component.ctx).toBeInstanceOf(CanvasRenderingContext2D);
    });

    it('should handle a file selection event', (done) => {
        spyOn(component, 'drawImage').and.callThrough();
        const inputElement = document.createElement('input');
        inputElement.type = 'file';
        inputElement.files = new FileListMock([
            new File([''], 'test-image.png'),
        ]);

        component.onFileSelected({
            target: inputElement,
        } as unknown as InputEvent);

        setTimeout(() => {
            expect(component.drawImage).toHaveBeenCalled();
            done();
        }, 100);
    });

    it('should draw the image on the canvas', () => {
        const drawImageSpy = spyOn(
            imageManipulationService,
            'drawImage'
        ).and.callThrough();
        component.img = new Image();
        component.ctx = new CanvasRenderingContext2D();

        component.drawImage();

        expect(drawImageSpy).toHaveBeenCalledWith(component.ctx, component.img);
    });

    it('should change the image color', () => {
        const changeColorSpy = spyOn(
            imageManipulationService,
            'changeColor'
        ).and.callThrough();
        component.ctx = new CanvasRenderingContext2D();
        component.originalImageData = new ImageData(1, 1);

        component.changeColor();

        expect(changeColorSpy).toHaveBeenCalledWith(
            component.ctx,
            component.originalImageData,
            component.selectedColor
        );
    });

    it('should rotate the image', () => {
        const rotateImageSpy = spyOn(
            imageManipulationService,
            'rotateImage'
        ).and.callThrough();
        const drawRotatedImageSpy = spyOn(
            imageManipulationService,
            'drawRotatedImage'
        ).and.callThrough();
        const changeColorSpy = spyOn(
            component,
            'changeColor'
        ).and.callThrough();
        component.ctx = new CanvasRenderingContext2D();
        component.img = new Image();
        component.rotation = 0;

        component.rotateImage();

        expect(rotateImageSpy).toHaveBeenCalledWith(component.rotation);
        expect(drawRotatedImageSpy).toHaveBeenCalledWith(
            component.ctx,
            component.img,
            component.rotation
        );
        expect(changeColorSpy).toHaveBeenCalled();
    });
});

class FileListMock implements FileList {
    private files: File[];

    constructor(files: File[]) {
        this.files = files;
    }

    get length(): number {
        return this.files.length;
    }

    item(index: number): File | null {
        return this.files[index] || null;
    }

    [index: number]: File;
}
