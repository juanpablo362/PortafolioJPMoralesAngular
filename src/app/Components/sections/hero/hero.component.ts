import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, PersonalInfo } from '../../../Services/data.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements OnInit {
  personalInfo: PersonalInfo | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadPersonalInfo();
  }

  loadPersonalInfo(): void {
    this.isLoading = true;
    this.dataService.getAboutData().subscribe({
      next: (data) => {
        this.personalInfo = data.personal;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar la información personal.';
        this.isLoading = false;
        console.error('Error loading personal info:', err);
      }
    });
  }

  getInitials(name: string | undefined): string {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  downloadCV() {
    const link = document.createElement('a');
    link.href = '/CV para portafolio.pdf';
    link.download = 'CV_JuanPablo_Morales.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
} 