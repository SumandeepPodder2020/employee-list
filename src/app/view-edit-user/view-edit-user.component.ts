import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserType } from '../type/type';
import { MY_FORMATS } from '../type/constant';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { NumberOnlyDirective } from '../directive/number-only.directive';
@Component({
  selector: 'app-view-edit-user',
  standalone: true,
  imports: [
    CommonModule,  
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    NumberOnlyDirective,
    FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe
  ],
  templateUrl: './view-edit-user.component.html',
  styleUrl: './view-edit-user.component.scss'
})
export class ViewEditUserComponent implements OnInit {
  editViewForm: FormGroup;
  userData: UserType;
  jobTitle: Array<string> = ['Manager', 'Tech Lead', 'Software Developer', 'Quality Analysis', 'UI Designer'];
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UserType,
    private dialogRef: MatDialogRef<ViewEditUserComponent>,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
  ) {}
  ngOnInit(): void {
    this.userData = {...this.data};
    this.editViewForm = this.formBuilder.group({
      nameCtrl: [this.userData.name, Validators.required],
      ageCtrl: [this.userData.age],
      jobTitleCtrl: [this.userData.jobTitle, Validators.required],
      startDateCtrl: [new Date(this.userData.startDate), Validators.required],
      endDateCtrl: [this.userData.endDate ? new Date(this.userData.endDate) : '']
    });
  }
  checkValidation(controlName: string): Boolean {
    return this.editViewForm.controls[controlName].hasError('required');
  }
  updateUser() {
    this.dialogRef.close({
      slNo: this.userData.slNo,
      name:  this.editViewForm.controls['nameCtrl'].value,
      jobTitle: this.editViewForm.controls['jobTitleCtrl'].value,
      age: this.editViewForm.controls['ageCtrl'].value,
      startDate: this.editViewForm.controls['startDateCtrl'].value,
      endDate: this.editViewForm.controls['endDateCtrl'].value,
    
    });
  }
}
