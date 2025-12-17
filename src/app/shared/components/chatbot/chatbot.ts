import { Component, signal, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';


interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  sources?: string[];
}

interface QuickQuestion {
  id: string;
  question: string;
  icon: string;
  category: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})export class Chatbot implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  messages = signal<Message[]>([]);
  quickQuestions = signal<QuickQuestion[]>([]);
  userInput = '';
  isLoading = signal(false);
  errorMessage = signal('');
  isChatOpen = signal(false); 
  unreadCount = signal(0);

    private readonly apiUrl = `${environment.apiUrl}/chatbot`;
  
  private shouldScrollToBottom = false;

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    await this.loadQuickQuestions();
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  async loadQuickQuestions() {
    try {
      const questions = await firstValueFrom(
        this.http.get<QuickQuestion[]>(`${this.apiUrl}/quick-questions`)
      );
      this.quickQuestions.set(questions);
    } catch (error) {
      console.error('Error loading quick questions:', error);
    }
  }

  async sendMessage(event: Event) {
    event.preventDefault();
    
    if (!this.userInput.trim() || this.isLoading()) return;

    const userMessage: Message = {
      text: this.userInput,
      isUser: true,
      timestamp: new Date()
    };

    this.messages.update(msgs => [...msgs, userMessage]);
    const messageText = this.userInput;
    this.userInput = '';
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.shouldScrollToBottom = true;

    try {
      const response = await firstValueFrom(
        this.http.post<any>(`${this.apiUrl}/chat`, { 
          message: messageText 
        })
      );

      const botMessage: Message = {
        text: response.message,
        isUser: false,
        timestamp: new Date(),
        sources: response.sourcesUsed
      };

      this.messages.update(msgs => [...msgs, botMessage]);
      this.shouldScrollToBottom = true;
    } catch (error: any) {
      console.error('Error:', error);
      const errorMsg = error.error?.message || 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.';
      this.errorMessage.set(errorMsg);
      
      const errorBotMessage: Message = {
        text: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني على 19777.',
        isUser: false,
        timestamp: new Date()
      };
      this.messages.update(msgs => [...msgs, errorBotMessage]);
      this.shouldScrollToBottom = true;
    } finally {
      this.isLoading.set(false);
    }
  }

  sendQuickQuestion(question: string) {
    this.userInput = question;
    this.sendMessage(new Event('submit'));
  }

  toggleChat() {
    this.isChatOpen.update(open => !open);
    if (this.isChatOpen()) {
      this.unreadCount.set(0);
    }
  }
  

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('ar-EG', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
  

  formatMessage(text: string): string {
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }
  

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = 
        this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) {
      console.error('Scroll error:', err);
    }
  }
}
