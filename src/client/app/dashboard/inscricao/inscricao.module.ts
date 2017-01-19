import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { InscricaoComponent } from './inscricao.component';
import { InscricaoService } from './inscricao.service';

import { TextMaskModule } from 'angular2-text-mask';
import {WebCamComponent} from './webcam/webcam.component';

@NgModule({
    imports: [CommonModule,
              RouterModule,
              FormsModule,
              TextMaskModule],
    declarations: [InscricaoComponent, WebCamComponent],
    exports: [InscricaoComponent],
    providers:[{provide: InscricaoService, useClass: InscricaoService}]
})

export class InscricaoModule { }
