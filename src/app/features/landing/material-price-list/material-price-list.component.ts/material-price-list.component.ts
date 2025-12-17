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
styleUrls: ['./material-price-list.component.css']
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

    console.log('🔍 Starting to load materials...');

    this.materialService.getActiveMaterials().subscribe({
      next: (data: Material[]) => {
        console.log('✅ Materials received:', data);
        console.log('📊 Total materials:', data.length);

        // Log each material's image info
        data.forEach((material, index) => {
          console.log(`Material ${index + 1}:`, {
            name: material.name,
            imageUrl: material.imageUrl,
            hasImage: !!material.imageUrl
          });
        });

        this.materials = data;
        this.loading = false;
        console.log(this.materials[0].imageUrl);
        console.log(this.materials[0].imageLocalPath);
      },
      error: (error: any) => {
        console.error('❌ Error loading materials:', error);
        this.error = 'Failed to load materials. Please try again later.';
        this.loading = false;
      }
    });
  }

  onImageError(event: any): void {
    console.error('🖼️ Image failed to load:', event.target.src);
    event.target.src = 'https://placehold.co/150x150';
  }

  startRecycling(): void {
    this.router.navigate(['/register']);
  }
}
