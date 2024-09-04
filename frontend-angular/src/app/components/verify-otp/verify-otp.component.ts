import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonserviceService } from '../../services/commonservice.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOtpComponent{
  otp1: string = '';
  otp2: string = '';
  otp3: string = '';
  otp4: string = '';
  otp5: string = '';
  otp6: string = '';
  email: string = '';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private httpService: CommonserviceService,
  ){
    const navigation = this.router.getCurrentNavigation();
    if(navigation?.extras.state){
      this.email = navigation.extras.state['email'];
    }
  }

  verifyOTP(){
    const enteredOtp = this.otp1 + this.otp2 + this.otp3 + this.otp4 + this.otp5 + this.otp6;
    this.httpService.verifyOTP(this.email, enteredOtp).subscribe((response: any)=>{
      console.log('Employee details-----', response)

      if(response.success){
        localStorage.setItem('authToken', response.data.token);
        this.toastr.success('Login Successfull');
        const employeeName = response.data.employee.employeeName;
        console.log(employeeName);
        this.router.navigate(['/dashboard'], {state: {employeeName: employeeName}});
      } else{
        this.toastr.error('OTP verification failed. Please try again later.');
      }
    }, (error)=>{
      console.error('Error verifying OTP', error);
    });
  }

  moveFocus(event: any, nextInput:string): void {
    const input = event.target as HTMLInputElement;
    const maxLength = parseInt(input.maxLength.toString(), 10);
    const currentLength = input.value.length;
    if (currentLength >= maxLength) {
      const element = document.getElementsByName(nextInput)[0] as HTMLInputElement;
      if(element){
        element.focus();
      }
    }
  }

  resendOTP() {
    this.httpService.sendOTP(this.email).subscribe((response: any) => {
      if (response.success) {
        this.toastr.success('OTP resent successfully', `Your OTP is ${response.data.otp}`);
      } else {
        this.toastr.error('Failed to resend OTP. Please try again later.');
      }
    }, (error) => {
      console.error('Error resending OTP', error);
      this.toastr.error('Error occurred while resending OTP.');
    });
  }
  
}
