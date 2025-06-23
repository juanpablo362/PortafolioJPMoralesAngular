import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, AboutData } from '../../../Services/data.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {
  aboutData: any;
  isLoading = true;
  error: string | null = null;
  activeTab = 'experience';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadAboutData();
  }

  loadAboutData(): void {
    this.isLoading = true;
    this.error = null;
    this.dataService.getAboutData().subscribe({
      next: (data) => {
        this.aboutData = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching about data:', err);
        this.error = 'No se pudo cargar la información. Por favor, inténtalo de nuevo más tarde.';
        this.isLoading = false;
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('');
  }

  getCertificationStatus(expiry: string): { status: string, color: string } {
    if (expiry.toLowerCase() === 'n/a') {
      return { status: 'Válida', color: 'bg-green-500' };
    }
    const expiryDate = new Date(expiry);
    const today = new Date();
    if (expiryDate < today) {
      return { status: 'Expirada', color: 'bg-red-500' };
    }
    return { status: 'Válida', color: 'bg-green-500' };
  }

  getLanguageLevelColor(proficiency: number): string {
    if (proficiency > 85) return 'from-pink-400 to-rose-400';
    if (proficiency > 70) return 'from-blue-400 to-cyan-400';
    return 'from-slate-500 to-slate-400';
  }
}
