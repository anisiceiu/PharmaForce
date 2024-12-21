import { A11yModule } from '@angular/cdk/a11y';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DialogModule } from '@angular/cdk/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkMenuModule } from '@angular/cdk/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { AgGridModule } from 'ag-grid-angular';

import { ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlName, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';
import { HttpClientModule } from '@angular/common/http';
import { CompanyDialogComponent } from './components/company-dialog/company-dialog.component';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { NavbarComponent } from '../core/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { ConfirmActionComponent } from './components/confirm-action/confirm-action.component';
import { DataManagerAddPopupComponent } from './components/data-manager-add-popup/data-manager-add-popup.component';
import { DataManagerProductAddPopupComponent } from './components/data-manager-product-add-popup/data-manager-product-add-popup.component';
import { DataManagerEditPopupComponent } from './components/data-manager-edit-popup/data-manager-edit-popup.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DataManagerProductEditPopupComponent } from './components/data-manager-product-edit-popup/data-manager-product-edit-popup.component';
import { CitationPopupComponent } from './components/citation-popup/citation-popup.component';
import { NotesPopupComponent } from './components/notes-popup/notes-popup.component';
import { AddEditMastercodePopupComponent } from './components/add-edit-mastercode-popup/add-edit-mastercode-popup.component';
import { NewsDialogPopupComponent } from './components/news-dialog-popup/news-dialog-popup.component';
import { QcQueueActionPopupComponent } from './components/qc-queue-action-popup/qc-queue-action-popup.component';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { AddUserEmailSuffixPopupComponent } from './add-user-email-suffix-popup/add-user-email-suffix-popup.component';
import { AddClientPopupComponent } from './add-client-popup/add-client-popup.component';
import { NotesComponent } from '.././master-data/notes/notes.component';
import { DataManagerAddProductPopupComponent } from './data-manager-add-product-popup/data-manager-add-product-popup.component';
import { DataManagerAddSalesforcePopupComponent } from './data-manager-add-salesforce-popup/data-manager-add-salesforce-popup.component';

import { KeyUpdateDialogPopupComponent } from './components/key-update-dialog-popup/key-update-dialog-popup.component';
import { AddMyBrandGroupPopupComponent } from './add-my-brand-group-popup/add-my-brand-group-popup.component';
import { DualListBoxControlComponent } from './dual-list-box-control/dual-list-box-control.component';
import { AddCountryMasterCodeComponent } from './master-code/add-country-master-code/add-country-master-code.component';
import { AddCompanyMasterCodeComponent } from './master-code/add-company-master-code/add-company-master-code.component';
import { AddSalesforceNameMasterCodeComponent } from './master-code/add-salesforce-name-master-code/add-salesforce-name-master-code.component';
import { AddSalesforceTypeMasterCodeComponent } from './master-code/add-salesforce-type-master-code/add-salesforce-type-master-code.component';
import { AddGenericNameMasterCodeComponent } from './master-code/add-generic-name-master-code/add-generic-name-master-code.component';
import { AddBrandNameMasterCodeComponent } from './master-code/add-brand-name-master-code/add-brand-name-master-code.component';
import { AddTherapeuticCategoryMasterCodeComponent } from './master-code/add-therapeutic-category-master-code/add-therapeutic-category-master-code.component';
import { AddPhysicianSpecialtyMasterCodeComponent } from './master-code/add-physician-specialty-master-code/add-physician-specialty-master-code.component';
import { AddPhysicianFocusMasterCodeComponent } from './master-code/add-physician-focus-master-code/add-physician-focus-master-code.component';
import { AddContractSalesOrgMasterCodeComponent } from './master-code/add-contract-sales-org-master-code/add-contract-sales-org-master-code.component';
import { AddPeriodMasterCodeComponent } from './master-code/add-period-master-code/add-period-master-code.component';
import { SessionTimeoutDialogComponent } from './components/session-timeout-dialog/session-timeout-dialog.component';
import { AddSalesforcePopupComponent } from './data-manager/add-salesforce-popup/add-salesforce-popup.component';
import { EditSalesforcePopupComponent } from './data-manager/edit-salesforce-popup/edit-salesforce-popup.component';
import { UserSavedSearchsPopupComponent } from './analytics/user-saved-searchs-popup/user-saved-searchs-popup.component';
import { AddUserRestrictedEmailSuffixPopupComponent } from './add-user-restricted-email-suffix-popup/add-user-restricted-email-suffix-popup.component';
import { TermsAndConditionsPopupComponent } from './terms-and-conditions-popup/terms-and-conditions-popup.component';
import { QcqNotePopupComponent } from './qcq-note-popup/qcq-note-popup.component';
import { AgGridDeleteButtonComponent } from './ag-grid-delete-button/ag-grid-delete-button.component';
import { AgGridNumericCellEditorComponent } from './ag-grid-numeric-cell-editor/ag-grid-numeric-cell-editor.component';
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    A11yModule,
    CdkAccordionModule,
    ClipboardModule,
    CdkMenuModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    DialogModule,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    AgGridModule,
  ],
  declarations: [LoaderComponent, CompanyDialogComponent, NavbarComponent, DeleteDialogComponent, ConfirmActionComponent,
    DataManagerAddPopupComponent, DataManagerProductAddPopupComponent, DataManagerProductEditPopupComponent, NotesComponent,
    DataManagerEditPopupComponent, CitationPopupComponent, NotesPopupComponent, AddEditMastercodePopupComponent, DualListBoxControlComponent,
      NewsDialogPopupComponent, QcQueueActionPopupComponent, UserDialogComponent, AddUserEmailSuffixPopupComponent, AddClientPopupComponent, KeyUpdateDialogPopupComponent, DataManagerAddProductPopupComponent, DataManagerAddSalesforcePopupComponent, AddMyBrandGroupPopupComponent, AddCountryMasterCodeComponent, AddCompanyMasterCodeComponent, AddSalesforceNameMasterCodeComponent, AddSalesforceTypeMasterCodeComponent, AddGenericNameMasterCodeComponent, AddBrandNameMasterCodeComponent, AddTherapeuticCategoryMasterCodeComponent, AddPhysicianSpecialtyMasterCodeComponent, AddPhysicianFocusMasterCodeComponent, AddContractSalesOrgMasterCodeComponent, AddPeriodMasterCodeComponent, SessionTimeoutDialogComponent, AddSalesforcePopupComponent, EditSalesforcePopupComponent, UserSavedSearchsPopupComponent, AddUserRestrictedEmailSuffixPopupComponent, TermsAndConditionsPopupComponent, QcqNotePopupComponent, AgGridDeleteButtonComponent, AgGridNumericCellEditorComponent
  ],
  exports:[LoaderComponent,HttpClientModule,CompanyDialogComponent,NavbarComponent,
    FormsModule,
    ReactiveFormsModule,
    A11yModule,
    CdkAccordionModule,
    ClipboardModule,
    CdkMenuModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    DialogModule,
    MatDialogContent,
    MatDialogActions,
    AgGridModule
  ],
  providers:[FormControlName,
    [
      {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
    ]
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: SharedModule
    };
  }
}
