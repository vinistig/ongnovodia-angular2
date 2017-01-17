import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InscricaoComponent } from './inscricao.component';

@NgModule({
    imports: [FormsModule],
    declarations: [InscricaoComponent],
    exports: [InscricaoComponent]
})

export class InscricaoModule { }
