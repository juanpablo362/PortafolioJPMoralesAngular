import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
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
  projectCount = 0;
  displayCount = 0;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    forkJoin({
      about: this.dataService.getAboutData(),
      projects: this.dataService.getProjects()
    }).subscribe({
      next: ({ about, projects }) => {
        this.personalInfo = about.personal;
        this.projectCount = projects.length;
        this.isLoading = false;
        this.animateCount(projects.length);
      },
      error: (err) => {
        this.error = 'No se pudo cargar la información personal.';
        this.isLoading = false;
        console.error('Error loading hero data:', err);
      }
    });
  }

  loadPersonalInfo(): void {
    this.loadData();
  }

  private animateCount(target: number): void {
    const duration = 900;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.displayCount = Math.round(target * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  getInitials(name: string | undefined): string {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  downloadCV() {
    const link = document.createElement('a');
    link.href = '/cv_JPMR.pdf';
    link.download = 'CV_JuanPablo_Morales.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
