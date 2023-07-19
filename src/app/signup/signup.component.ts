import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  signUpForm!: FormGroup;
  submitted = false;

  constructor(private authService: AuthService){}

  ngOnInit() {
    this.signUpForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('')
    });
  }

  onSubmit() {
    this.submitted = true;
    this.authService.signUp(this.signUpForm.value);

    // stop here if form is invalid
    if (this.signUpForm.invalid) {
        return;
    }


    // display form values on success
    console.log('SUCCESS!!', this.signUpForm.value);
}



}
