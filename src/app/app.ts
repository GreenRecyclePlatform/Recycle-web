import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingPage } from './pages/landing-page/landing-page';
import { Navbar } from './shared/components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'Recycle-web';
}
