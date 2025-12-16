import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/authservice';
import { Navbar } from "../navbar/navbar";

@Component({
  selector: 'app-user-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-sidebar.html',
  styleUrl: './user-sidebar.css',
})
export class UserSidebar implements OnInit {

  
  userName:string='User';
userRole:string='User';
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userName = this.authService.getUserName() || "user";
  }


 logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}

