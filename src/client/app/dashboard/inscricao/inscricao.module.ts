import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { InscricaoComponent } from './inscricao.component';
import { InscricaoService } from './inscricao.service';

@NgModule({
    imports: [CommonModule, RouterModule, FormsModule],
    declarations: [InscricaoComponent],
    exports: [InscricaoComponent],
    providers:[{provide: InscricaoService, useClass: InscricaoService}]
})

export class InscricaoModule { }
