import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LayoutsModule } from '../layouts.module';
import { Navbar } from '../../components/navbar/navbar';
import { CommonModule } from '@angular/common';
import { UserSidebar } from '../../components/user-sidebar/user-sidebar';
import { AuthService } from '../../../core/services/authservice';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.html',
  styleUrls: ['./user-layout.css'],
  imports: [CommonModule, Navbar, RouterModule,UserSidebar]
})
export class UserLayoutComponent{
  userName: string = 'User';
  userRole: string = 'User';

  constructor(private router: Router,private authService: AuthService) { }

  // ngOnInit(): void {
    // Get user info from localStorage or auth service
    // const storedUser = localStorage.getItem('userName');
    // if (storedUser) {
    //   this.userName = storedUser;
    // }
  //}

  
}