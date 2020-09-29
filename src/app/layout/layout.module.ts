import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { AppHeaderComponent } from '../shared/app-header/app-header.component';
import { SharedModule } from '../shared/shared.module';
import { PopupMsgDialogComponent } from '../shared/feedback/popup-msg-dialog/popup-msg-dialog.component';

@NgModule({
  declarations: [LayoutComponent, AppHeaderComponent, PopupMsgDialogComponent],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule
  ],
  entryComponents: [PopupMsgDialogComponent]
})
export class LayoutModule { }
