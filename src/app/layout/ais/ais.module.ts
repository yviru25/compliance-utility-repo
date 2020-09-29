import { FeedbackDComponent } from './../../shared/feedback/feedback-d/feedback-d.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AisComponent } from './ais.component';
import { AISRoutingModule } from './ais.routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkColumnDef } from '@angular/cdk/table';
import { DynamicDialogComponent } from '../../shared/dyanmic-dialog/dynamic-dialog.component';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { FeedbackBComponent } from '../../shared/feedback/feedback-b/feedback-b.component';
import { PopupMsgDialogComponent } from '../../shared/feedback/popup-msg-dialog/popup-msg-dialog.component';
import { NumberDirective } from '../../shared/numbers-only.directive';
import { BulkDialogComponent } from '../../shared/bulk-dialog/bulk-dialog.component';
import { AadharMaskPipe } from '../../shared/pipes/adhar-mask.pipe';

@NgModule({
  declarations: [AisComponent, DynamicDialogComponent,
                 DynamicFormComponent, BulkDialogComponent,
                 FeedbackBComponent, FeedbackDComponent, NumberDirective, AadharMaskPipe],
  imports: [
    CommonModule,
    AISRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [CdkColumnDef],
  entryComponents: [DynamicDialogComponent, BulkDialogComponent]
})
export class AisModule { }
