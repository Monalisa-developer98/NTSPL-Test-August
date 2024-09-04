import { Component, OnInit } from '@angular/core';
import { CommonserviceService } from '../../services/commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  employees: any[] = [];
  addEmployeeForm!: FormGroup;

  totalItems: number = 0;
  itemsPerPage: number = 2;
  p: number = 1;
  searchKey: string = '';
  updatedTime: any;
  email!: AbstractControl; employeeName!: AbstractControl; employeeId!: AbstractControl;

  constructor(
    private httpService: CommonserviceService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.addEmployeeForm = this.fb.group({
      employeeName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      employeeId: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10), Validators.pattern(/^[a-zA-Z0-9\-\/]*$/)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(30)]],
      designation: ['', Validators.required],
      department: ['', Validators.required],
      unit: ['', Validators.required],
    });

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.employeeName = navigation.extras.state['employeeName'];
    }
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  onSubmit(): void {
    if (this.addEmployeeForm.valid) {
      this.httpService.addEmployee(this.addEmployeeForm.value).subscribe(
        response => {
          console.log('Employee added successfully', response);
          this.toastr.success(response.message);
          this.addEmployeeForm.reset();
          this.loadEmployees();
        },
        error => {
          console.log('Error while adding employee', error);
          this.toastr.error(error.error.message);
        }
      );
    }
  }

  loadEmployees(): void {
    const order = -1;
    const payload = {
      searchKey: this.searchKey
    };

    console.log('Loading Employees with Payload:', payload);

    this.httpService.getEmployees(order, this.itemsPerPage, this.p, payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);

        if (response && response.data) {
          this.totalItems = response.data.totalEmployees || 0;
          this.employees = response.data.employeeData.map((employee: any) => ({
            ...employee,
            formattedDate: this.formatDate(employee.updatedAt),
            formattedTime: this.formatTime(employee.updatedAt)
          }));
          this.updatedTime = this.employees[0]?.formattedDate || '';
        } else {
          this.toastr.error('Unexpected response format');
        }
      },
      error => {
        console.log('Error while loading employees', error);
        this.toastr.error('Failed to load employees');
      }
    );
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);
  }

  formatTime(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', options);
  }

  onSearch(): void {
    this.p = 1;
    this.loadEmployees();
  }

  get showingRange(): string {
    const start = (this.p - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.p * this.itemsPerPage, this.totalItems);
    return `Showing ${start} to ${end} of ${this.totalItems} entries`;
  }

  onItemsPerPageChange(event: Event): void {
    this.p = 1;
    this.loadEmployees();
  }

  onStatusChange(employeeId: string, isActive: boolean): void {
    const action = isActive ? 'activate' : 'deactivate';
    this.httpService.updateEmployeeStatus(employeeId, action).subscribe(
      response => {
        console.log(`${action}d employee successfully`, response);
        this.toastr.success(response.message);
        this.loadEmployees();
      },
      error => {
        console.log(`Error while ${action}ing employee`, error);
        this.toastr.error(`Error while ${action}ing employee`);
        this.loadEmployees();
      }
    );
  }

logout() {
  localStorage.removeItem('token');
  this.router.navigate(['/login']);
}

}