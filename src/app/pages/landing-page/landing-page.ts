//neww

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MaterialService } from '../../core/services/material.service';
import { Material } from '../../core/models/material.model';
import { Navbar } from '../../shared/components/navbar/navbar';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, Navbar],
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.css'],
})
export class LandingPage implements OnInit {
  materials: Material[] = [];
  loading: boolean = false;
  categories = ['All', 'Plastic', 'Metal', 'Paper', 'Glass', 'Electronics'];
  selectedCategory = 'All';

  testimonials: Testimonial[] = [
    {
      name: 'Priya Sharma',
      role: 'Homemaker',
      content:
        'RecycleHub made it so easy to recycle and earn money! The pickup service is prompt and the payment is instant.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1610208033812-c0d714ad9b5a?w=100&h=100&fit=crop',
    },
    {
      name: 'Rajesh Kumar',
      role: 'Business Owner',
      content:
        'As a small business, we generate a lot of cardboard waste. RecycleHub helps us dispose of it responsibly while earning some money back.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    {
      name: 'Amit Patel',
      role: 'Apartment Resident',
      content:
        'The app is user-friendly and the drivers are professional. Highly recommend RecycleHub for anyone wanting to recycle!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
  ];

  faqs: FAQ[] = [
    {
      question: 'What materials do you accept?',
      answer:
        'We accept plastic bottles, paper, cardboard, metals, glass, and electronics. Check our Materials section for the complete list and pricing.',
      isOpen: false,
    },
    {
      question: 'How does the pickup process work?',
      answer:
        'Simply submit your materials through our app with photos, select a convenient pickup time, and our driver will collect the materials from your doorstep.',
      isOpen: false,
    },
    {
      question: 'When will I receive my payment?',
      answer:
        'Payment is processed within 24 hours of successful pickup verification. Money is transferred directly to your registered bank account or wallet.',
      isOpen: false,
    },
    {
      question: 'Is there a minimum quantity requirement?',
      answer:
        'Yes, the minimum pickup quantity is 5kg for mixed materials or 3kg for single material types.',
      isOpen: false,
    },
    {
      question: 'What areas do you serve?',
      answer:
        'We currently operate in major cities across Egypt. Enter your pincode during registration to check if we service your area.',
      isOpen: false,
    },
  ];

  constructor(private materialService: MaterialService) {}

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.loading = true;
    this.materialService.getActiveMaterials().subscribe({
      next: (data) => {
        this.materials = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading materials:', error);
        this.loading = false;
      },
    });
  }

  get filteredMaterials() {
    if (this.selectedCategory === 'All') {
      return this.materials;
    }

    // Filter by material name containing the category
    return this.materials.filter((material) =>
      material.name.toLowerCase().includes(this.selectedCategory.toLowerCase())
    );
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  toggleFAQ(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 64; // Height of navbar in pixels (4rem)
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
