import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatDividerModule, MatExpansionModule,
  MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule,
  MatProgressBarModule, MatProgressSpinnerModule, MatSnackBarModule,
  MatTableModule, MatToolbarModule, MatTooltipModule
} from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatPaginatorModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatTableModule,
    MatInputModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatCheckboxModule
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatPaginatorModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatTableModule,
    MatInputModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatCheckboxModule
  ]
})
export class MaterialModule {
}
