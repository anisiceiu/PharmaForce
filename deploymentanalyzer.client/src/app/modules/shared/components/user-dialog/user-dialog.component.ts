import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../../models/user';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent {

  isOpenManageUserSidebar = false;
  userForm: FormGroup;
  showOption = false;
  generatedPassword!: string;
  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,public fb:FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { user: User, showOption: true }
  ) {
    this.showOption = data.showOption;
    var oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    if(data.user && data.user.id > 0){
      this.userForm = this.fb.group({
        id: [data.user.id],
        name: [data.user.name, [Validators.required]],
        userName: [data.user.userName, [Validators.required]],
        password: [data.user.password, [Validators.required]],
        enabled: [data.user.enabled],
        expires: [data.user.expires],
        created: [data.user.created],
        userType: [data.user.userType, [Validators.required]],
        email: [data.user.email],
        logo: [data.user.logo],
        clientLimit: [data.user.clientLimit],
        description: [data.user.description],
      });
    }else{
      this.userForm = this.fb.group({
        id: [null],
        name: [data.user.name, [Validators.required]],
        userName: [data.user.userName, [Validators.required]],
        password: [data.user.password, [Validators.required]],
        enabled: [data.user.enabled , [Validators.required]],
        expires: [oneYearFromNow, [Validators.required]],
        created: [data.user.created],
        userType: [data.user.userType, [Validators.required]],
        email: [data.user.email, [Validators.required]],
        logo: [data.user.logo],
        clientLimit: [data.user.clientLimit],
        description: [data.user.description],
      });
    }
    this.isOpenManageUserSidebar = true;
    this.generatedPassword = this.generatePassword();
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
    
      this.userForm.get('logo')?.setValue(file.name);
    }
  }

  generatePassword(): string {
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const specialChars = '@#$%&*!';
    const allChars = upperChars + lowerChars + digits + specialChars;
  
    let password = '';
    
    // Ensure at least one character from each set
    password += upperChars.charAt(Math.floor(Math.random() * upperChars.length));
    password += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));
    password += digits.charAt(Math.floor(Math.random() * digits.length));
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  
    // Fill the remaining length with random characters from all sets
    for (let i = 4; i < 12; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
  
    // Shuffle the password to ensure randomness
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }
  

  showPassword: boolean = false;
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  get userFormControls() { return this.userForm.controls; }
}
