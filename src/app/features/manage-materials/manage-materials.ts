import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialService } from '../../core/services/material.service';
import { Material } from '../../core/models/material.model';

@Component({
  selector: 'app-manage-materials',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ REMOVED Navbar and AdminSidebarComponent
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

  isLoading = false;
  isSaving = false;
  isDeleting = false;

  recyclingEmojis = [
    '♻️', '📦', '📄', '🗞️', '📰', '🧻',
    '🍾', '🥤', '🧃', '🧴', '🛢️',
    '🔋', '⌨️', '🖱️','🔩', '⚙️', '🪛', '🪙', '💿',
    '🔌'
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
    '🔧': 'Wrench',
    '🔩': 'Nut and Bolt',
    '⚙️': 'Gear',
    '🪙': 'Coin/Metal',
    '💿': 'CD/DVD',
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
    this.isLoading = true;

    this.materialService.getMaterials().subscribe({
      next: (data) => {
        this.materials = data;
        this.isLoading = false;
        console.log('📋 Materials loaded:', data);
      },
      error: (error) => {
        console.error('❌ Error loading materials:', error);
        this.isLoading = false;
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
      image: material.imageUrl || ''
    };

    this.imagePreview = material.imageUrl || '';
    this.imageFile = null;
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
      this.materialForm.pricePerKg = (this.materialForm.buyingPrice + this.materialForm.sellingPrice) / 2;
    }
  }

  onImageSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should not exceed 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      this.imageFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);

      console.log('🖼️ Image selected:', file.name, 'Size:', file.size);
    }
  }

  removeImage(): void {
    this.imageFile = null;
    this.imagePreview = '';
    this.materialForm.image = '';

    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  saveMaterial(): void {
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

    this.isSaving = true;

    console.log('💾 Saving Material...');
    console.log('📝 Form Data:', this.materialForm);
    console.log('🖼️ Image File:', this.imageFile);

    if (this.isEditMode && this.selectedMaterial) {
      this.materialService.updateMaterial(
        this.selectedMaterial.id,
        this.materialForm,
        this.imageFile
      ).subscribe({
        next: (response) => {
          console.log('✅ Material updated successfully:', response);
          this.isSaving = false;
          this.loadMaterials();
          this.closeModal();
          alert('Material updated successfully!');
        },
        error: (error) => {
          console.error('❌ Error updating material:', error);
          this.isSaving = false;
          alert(`Failed to update material: ${error.message}`);
        }
      });
    } else {
      this.materialService.createMaterial(
        this.materialForm,
        this.imageFile
      ).subscribe({
        next: (response) => {
          console.log('✅ Material created successfully:', response);
          this.isSaving = false;
          this.loadMaterials();
          this.closeModal();
          alert('Material added successfully!');
        },
        error: (error) => {
          console.error('❌ Error creating material:', error);
          this.isSaving = false;
          alert(`Failed to add material: ${error.message}`);
        }
      });
    }
  }

  deleteMaterial(): void {
    if (this.selectedMaterial) {
      this.isDeleting = true;

      this.materialService.deleteMaterial(this.selectedMaterial.id).subscribe({
        next: () => {
          console.log('✅ Material deleted successfully');
          this.isDeleting = false;
          this.loadMaterials();
          this.closeModal();
          alert('Material deleted successfully!');
        },
        error: (error) => {
          console.error('❌ Error deleting material:', error);
          this.isDeleting = false;
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

    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
