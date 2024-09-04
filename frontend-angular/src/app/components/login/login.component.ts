import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonserviceService } from '../../services/commonservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  otpForm: any;
  constructor(private fb: FormBuilder, 
    private router: Router, 
    private toastr: ToastrService,
    private httpService: CommonserviceService,
  ){
    this.otpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  get email() {
    return this.otpForm.get('email');
  }

  sendOTP(){
    if(this.otpForm.valid){
      const email = this.otpForm.get('email')?.value;
      this.httpService.sendOTP(email).subscribe((response: any)=>{
        if(response.success){
          this.toastr.success('OTP sent successfully!', `Your OTP is ${response.data.otp}`);
          this.router.navigate(['/verify-otp'], {state: {email: email}});
        }
      }, (error)=>{
        this.toastr.error(error.error.message)
        this.toastr.error('Error sending OTP.');
      })
    } else {
      this.toastr.error('Please enter a valid email');
    }
  }
}
