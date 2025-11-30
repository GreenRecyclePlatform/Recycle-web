import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialService } from '../../core/services/material.service';
import { Material } from '../../core/models/material.model';

@Component({
  selector: 'app-manage-materials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-materials.html',
  styleUrl: './manage-materials.css',
})
export class ManageMaterials implements OnInit {
  materials: Material[] = [];
  selectedMaterial: Material | null = null;
  isEditMode = false;
  showDeleteModal = false;
  showMaterialModal = false;
  showEmojiPicker = false;

  // Predefined emojis for recycling materials
  recyclingEmojis = [
    '♻️', '📦', '📄', '🗞️', '📰', '🧻',
     '🥤', '🧃', '🧴', '🛢️', '💡',
    '🔋',  '⌨️', '🖱️',
    '🔧', '🔩','🔌'
  ];

  emojiTitles: { [key: string]: string } = {
    '♻️': 'Recycling',
    '📦': 'Cardboard Box',
    '📄': 'Paper',
    '🗞️': 'Newspaper',
    '📰': 'News',
    '🧻': 'Tissue Paper',
    '🥤': 'Plastic Cup',
    '🧃': 'Beverage Box',
    '🧴': 'Plastic Bottle',
    '🛢️': 'Oil Drum',
    '💡': 'Light Bulb',
    '🔋': 'Battery',
    '💻': 'Laptop',
    '🔌':'copper'

  };

  materialForm = {
    name: '',
    icon: '♻️',
    description: '',
    unit: 'kg',
    buyingPrice: 0,
    sellingPrice: 0,
    pricePerKg: 0,
    status: 'active' as 'active' | 'inactive',
    image: ''
  };

  imagePreview: string = '';
  imageFile: File | null = null;

  constructor(private materialService: MaterialService) {}

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.materialService.getMaterials().subscribe({
      next: (data) => {
        this.materials = data;
      },
      error: (error) => {
        console.error('Error loading materials:', error);
        alert('Failed to load materials. Please try again.');
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedMaterial = null;
    this.resetForm();
    this.showMaterialModal = true;
  }

  openEditModal(material: Material): void {
    this.isEditMode = true;
    this.selectedMaterial = material;
    this.materialForm = {
      name: material.name,
      icon: material.icon,
      description: material.description || '',
      unit: material.unit || 'kg',
      buyingPrice: material.buyingPrice,
      sellingPrice: material.sellingPrice,
      pricePerKg: material.pricePerKg,
      status: material.status,
      image: material.image || ''
    };
    this.imagePreview = material.image || '';
    this.showMaterialModal = true;
  }

  openDeleteModal(material: Material): void {
    this.selectedMaterial = material;
    this.showDeleteModal = true;
  }

  closeModal(): void {
    this.showMaterialModal = false;
    this.showDeleteModal = false;
    this.showEmojiPicker = false;
    this.resetForm();
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  selectEmoji(emoji: string): void {
    this.materialForm.icon = emoji;
    this.showEmojiPicker = false;
  }

  getEmojiTitle(emoji: string): string {
    return this.emojiTitles[emoji] || 'Icon';
  }

  calculatePricePerKg(): void {
    if (this.materialForm.buyingPrice > 0 && this.materialForm.sellingPrice > 0) {
      // Average of buying and selling price
      this.materialForm.pricePerKg = (this.materialForm.buyingPrice + this.materialForm.sellingPrice) / 2;
    }
  }

  onImageSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should not exceed 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      this.imageFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.materialForm.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imageFile = null;
    this.imagePreview = '';
    this.materialForm.image = '';
  }

  saveMaterial(): void {
    // Validation
    if (!this.materialForm.name.trim()) {
      alert('Please enter material name');
      return;
    }
    if (this.materialForm.buyingPrice <= 0) {
      alert('Please enter a valid buying price');
      return;
    }
    if (this.materialForm.sellingPrice <= 0) {
      alert('Please enter a valid selling price');
      return;
    }
    if (this.materialForm.sellingPrice <= this.materialForm.buyingPrice) {
      alert('Selling price must be greater than buying price');
      return;
    }

    // ALWAYS calculate pricePerKg from buying and selling prices before sending
    if (this.materialForm.buyingPrice > 0 && this.materialForm.sellingPrice > 0) {
      this.materialForm.pricePerKg = (this.materialForm.buyingPrice + this.materialForm.sellingPrice) / 2;
    }

    // Final validation to ensure pricePerKg is valid
    if (this.materialForm.pricePerKg <= 0) {
      alert('Price per kg must be greater than 0. Please check buying and selling prices.');
      return;
    }

    // Log what we're about to send
    console.log('Material Form Data (with calculated pricePerKg):', this.materialForm);

    if (this.isEditMode && this.selectedMaterial) {
      this.materialService.updateMaterial(this.selectedMaterial.id, this.materialForm).subscribe({
        next: () => {
          this.loadMaterials();
          this.closeModal();
          alert('Material updated successfully!');
        },
        error: (error) => {
          console.error('Error updating material:', error);
          alert(`Failed to update material:\n${error.message}`);
        }
      });
    } else {
      this.materialService.createMaterial(this.materialForm).subscribe({
        next: () => {
          this.loadMaterials();
          this.closeModal();
          alert('Material added successfully!');
        },
        error: (error) => {
          console.error('Error creating material:', error);
          alert(`Failed to add material:\n${error.message}`);
        }
      });
    }
  }

  deleteMaterial(): void {
    if (this.selectedMaterial) {
      this.materialService.deleteMaterial(this.selectedMaterial.id).subscribe({
        next: () => {
          this.loadMaterials();
          this.closeModal();
          alert('Material deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting material:', error);
          alert('Failed to delete material. Please try again.');
        }
      });
    }
  }

  resetForm(): void {
    this.materialForm = {
      name: '',
      icon: '♻️',
      description: '',
      unit: 'kg',
      buyingPrice: 0,
      sellingPrice: 0,
      pricePerKg: 0,
      status: 'active',
      image: ''
    };
    this.imagePreview = '';
    this.imageFile = null;
  }
}
