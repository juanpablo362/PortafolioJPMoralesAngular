import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  imports: [MatGridListModule, MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router: Router) {}

  verProyectos() {
    this.router.navigate(['/projects']);
  }

  contactar() {
    this.router.navigate(['/contact']);
  }
}
