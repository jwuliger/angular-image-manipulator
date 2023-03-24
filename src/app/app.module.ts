import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ColorPickerModule } from '@iplab/ngx-color-picker';
import { ImageManipulationComponent } from './image-manipulation/image-manipulation.component';
import { ImageManipulationService } from './image-manipulation/image-manipulation.service';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [AppComponent, ImageManipulationComponent],
    imports: [BrowserModule, BrowserAnimationsModule, ColorPickerModule],
    providers: [ImageManipulationService],
    bootstrap: [AppComponent],
})
export class AppModule {}
