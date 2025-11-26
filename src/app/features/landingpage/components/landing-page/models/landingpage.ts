export interface Material {
  name: string;
  price: string;
  image: string;
  icon: string;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}