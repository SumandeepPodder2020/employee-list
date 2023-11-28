import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { of, delay } from 'rxjs'
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatDialog } from '@angular/material/dialog';
import { MY_FORMATS } from '../type/constant';
import { UserType, FilterOperationType } from '../type/type';
import { ViewEditUserComponent } from '../view-edit-user/view-edit-user.component';
import { NumberOnlyDirective } from '../directive/number-only.directive';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule,  CommonModule, NumberOnlyDirective],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe
  ]
})
export class EmployeeListComponent implements OnInit {
  jobTitle: Array<string> = ['Manager', 'Tech Lead', 'Software Developer', 'Quality Analysis', 'UI Designer'];
  selectedJobTitle = '';  
  name = '';
  age = '';
  strDt = '';
  endDt = '';
  isAddUserFormOpen = false;
  displayUserArr: UserType[] = [];
  users:UserType[] = [{
    slNo: 1,
    name: 'Deep',
    jobTitle: 'Manager',
    age: 36,
    startDate: '01-01-2019',
    endDate: '01-01-2022'
  },
  {
    slNo: 2,
    name: 'Suman',
    jobTitle: 'Software Developer',
    age: 26,
    startDate: '01-01-2019',
    endDate: ''
  }
];

  addUserForm: FormGroup = new FormGroup({});
  @ViewChild('emptyTh') emptyTh: ElementRef;
  @ViewChild('emptyTd') emptyTd: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dialog: MatDialog) { }
  ngOnInit(): void {
    this.addUserForm = this.formBuilder.group({
      nameCtrl: ['', Validators.required],
      ageCtrl: [null],
      jobTitleCtrl: ['', Validators.required],
      startDateCtrl: ['', Validators.required],
      endDateCtrl: ['']
    });
    this.displayUserArr = [...this.users];
  }
  openAddUserForm(): void {
    this.isAddUserFormOpen = true;
    const wdth = this.emptyTd.nativeElement.clientWidth;
    const o = of([]).pipe(delay(0)).subscribe(() => {
      this.emptyTh.nativeElement.width = (wdth - 20)+1;
      o.unsubscribe();
    });
    console.log('emptyTd', this.emptyTd);
    
  }
  addUser(): void {
    this.users.push({
      slNo: this.users.length+1,
      name: this.addUserForm.controls['nameCtrl'].value,
      jobTitle: this.addUserForm.controls['jobTitleCtrl'].value,
      age:  Number(this.addUserForm.controls['ageCtrl'].value),
      startDate: this.addUserForm.controls['startDateCtrl'].value,
      endDate: this.addUserForm.controls['endDateCtrl'].value
    });
    this.displayUserArr = [...this.users];
    this.addUserForm.reset();
    this.addUserForm.updateValueAndValidity();
  }
  cancelAdd(): void {
    this.addUserForm.reset();
    this.addUserForm.updateValueAndValidity();
    this.isAddUserFormOpen = false;
  }
  deleteUser(user: UserType): void {
    if(this.users.length > 1) {
      this.users.splice(this.users.indexOf(user), 1);
      this.displayUserArr = [...this.users];
    }
  }
  checkValidation(controlName: string): Boolean {
    return this.addUserForm.controls[controlName].hasError('required');
  }
  filter(): void {
    const filterObjArr: FilterOperationType[]  = [];
    if (this.name) {
      filterObjArr.push({key:'name', value:this.name});
    }
    if (this.age) {
      filterObjArr.push({key:'age', value: Number(this.age)});
    }
    if(this.selectedJobTitle) {
      filterObjArr.push({key: 'jobTitle', value: this.selectedJobTitle});
    }
    if(this.strDt) {
      const date = this.datePipe.transform(this.strDt, 'dd-MM-yyyy')?.toString() || '';
      filterObjArr.push({key: 'startDate', value:  date});
    }
    if(this.endDt) {
      const date = this.datePipe.transform(this.endDt, 'dd-MM-yyyy')?.toString() || '';
      filterObjArr.push({key: 'endDate', value: date});
    }        
    this.displayUserArr = this.users.filter(user => {
      return filterObjArr.every(filterObj => this.evaluateExpression(filterObj, user));
    });
  }

  evaluateExpression(expression: FilterOperationType, obj: any): boolean {
    const { key, value } = expression;
    let propValue;
    if (key === 'startDate' || key === 'endDate') {
      propValue = this.datePipe.transform(obj[key], 'dd-MM-yyyy')?.toString()
    } else {
      propValue = obj[key]; 
    }         
    return propValue === value;
  }

  editViewDetail(user: UserType): void {
    const dialogRef = this.dialog.open(ViewEditUserComponent, {
      data: user,
      closeOnNavigation: true,
      autoFocus: false,
      minWidth: '30vw',
      minHeight: '50vh',
    })
    dialogRef.afterClosed().subscribe((data: UserType) => {
      if(data?.slNo) {
        this.users.splice(this.users.indexOf(user), 1, data);
        this.displayUserArr = [...this.users];
      }
    })
  }

  resetFilter(): void {
    this.selectedJobTitle = '';  
    this.name = '';
    this.age = '';
    this.strDt = '';
    this.endDt = '';
    this.displayUserArr = [...this.users];
  }
}
