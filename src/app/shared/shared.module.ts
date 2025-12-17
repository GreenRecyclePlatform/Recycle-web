import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Navbar } from './components/navbar/navbar'; // ✅ Import Navbar

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    Navbar  // ✅ Import the standalone Navbar component
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    Navbar  // ✅ Export it so other modules can use it
  ]
})
export class SharedModule { }