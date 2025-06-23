import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../../Services/data.service';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.css'
})
export class ProjectModalComponent {
  @Input() project: Project | null = null;
  @Output() close = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }

  openLink(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'completado':
        return 'bg-green-500';
      case 'en desarrollo':
        return 'bg-yellow-500';
      case 'planificado':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'Full Stack':
        return 'bg-gradient-to-r from-purple-500 to-blue-500';
      case 'Frontend':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'Backend':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'Mobile':
        return 'bg-gradient-to-r from-pink-500 to-rose-500';
      case 'DevOps':
        return 'bg-gradient-to-r from-orange-500 to-red-500';
      case 'AI/ML':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'Data Visualization':
        return 'bg-gradient-to-r from-indigo-500 to-purple-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  }
}
