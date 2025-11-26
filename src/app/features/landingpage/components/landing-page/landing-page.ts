import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Material,FAQ,Testimonial } from './models/landingpage';
import { CommonModule } from '@angular/common';


@Component({
    imports: [CommonModule],

  selector: 'app-landing-page',
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.css']
})
export class LandingPageComponent implements OnInit {
  materials: Material[] = [
    {
      name: 'Plastic Bottles',
      price: '₹25/kg',
    //  image: 'https://images.unsplash.com/photo-1557344252-4d5c9909579c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      image:'https://img.freepik.com/premium-photo/recycling-plastic-bottles_76964-37399.jpg',
      icon: '♻️'
    },
    {
      name: 'Paper/Cardboard',
      price: '₹15/kg',
      image: 'https://images.unsplash.com/photo-1719600804011-3bff3909b183?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      icon: '📄'
    },
    {
      name: 'Metals',
      price: '₹40/kg',
    //  image: 'https://images.unsplash.com/photo-1625662276901-4a7ec44fbeed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
     // image:'https://img.freepik.com/premium-photo/aluminum-recycling-bins-filled-with-cans-created-with-generative-ai_419341-38321.jpg',
     image:'https://greentumble.com/wp-content/uploads/2018/08/recycled-aluminum.jpg',
      icon: '🔧'
    },
    {
      name: 'Electronics',
      price: '₹35/kg',
      image:'https://img.freepik.com/premium-photo/e-waste-management-recycling-becomes-major-concern_1041953-2158.jpg',
      //image: 'https://images.unsplash.com/photo-1612965110667-4175024b0dcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      icon: '💻'
    }
  ];

  testimonials: Testimonial[] = [
    {
      name: 'Priya Sharma',
      role: 'Homemaker',
      content: 'RecycleHub made it so easy to recycle and earn money! The pickup service is prompt and the payment is instant.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1610208033812-c0d714ad9b5a?w=100&h=100&fit=crop'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Business Owner',
      content: 'As a small business, we generate a lot of cardboard waste. RecycleHub helps us dispose of it responsibly while earning some money back.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    },
    {
      name: 'Amit Patel',
      role: 'Apartment Resident',
      content: 'The app is user-friendly and the drivers are professional. Highly recommend RecycleHub for anyone wanting to recycle!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    }
  ];

  faqs: FAQ[] = [
    {
      question: 'What materials do you accept?',
      answer: 'We accept plastic bottles, paper, cardboard, metals, glass, and electronics. Check our Materials section for the complete list and pricing.',
      isOpen: false
    },
    {
      question: 'How does the pickup process work?',
      answer: 'Simply submit your materials through our app with photos, select a convenient pickup time, and our driver will collect the materials from your doorstep.',
      isOpen: false
    },
    {
      question: 'When will I receive my payment?',
      answer: 'Payment is processed within 24 hours of successful pickup verification. Money is transferred directly to your registered bank account or wallet.',
      isOpen: false
    },
    {
      question: 'Is there a minimum quantity requirement?',
      answer: 'Yes, the minimum pickup quantity is 5kg for mixed materials or 3kg for single material types.',
      isOpen: false
    },
    {
      question: 'What areas do you serve?',
      answer: 'We currently operate in major cities across India. Enter your pincode during registration to check if we service your area.',
      isOpen: false
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }
}