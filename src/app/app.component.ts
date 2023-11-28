import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeListComponent } from './employeee-list/employee-list.component';



    @Component({
      selector: 'app-root',
      standalone: true,
      imports: [CommonModule, EmployeeListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      templateUrl: './app.component.html',
      styleUrl: './app.component.scss',
    })

    export class AppComponent {

    }
