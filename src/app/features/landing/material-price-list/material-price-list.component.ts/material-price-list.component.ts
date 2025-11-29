import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialService } from '../../../../core/services/material.service';
import { Material } from '../../../../core/models/material.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-material-price-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './material-price-list.component.html',
  styleUrl: './material-price-list.component.css'
})
export class MaterialPriceListComponent implements OnInit {
  materials: Material[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private materialService: MaterialService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.loading = true;
    this.error = null;

    this.materialService.getActiveMaterials().subscribe({
      next: (data: Material[]) => {
        this.materials = data;
        this.loading = false;
      },
      error: (error: Error) => {
        console.error('Error loading materials:', error);
        this.error = 'Failed to load materials. Please try again later.';
        this.loading = false;
      }
    });
  }

  startRecycling(): void {
    this.router.navigate(['/register']);
  }
}
