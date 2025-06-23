import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Project } from '../../../Services/data.service';
import { ProjectModalComponent } from './project-modal/project-modal.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectModalComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  selectedCategory: string = 'all';
  selectedTechnology: string = 'all';
  isLoading: boolean = true;
  error: string | null = null;
  selectedProject: Project | null = null;

  categories: string[] = ['all', 'Full Stack', 'Frontend', 'Backend', 'Mobile', 'DevOps', 'AI/ML', 'Data Visualization'];
  technologies: string[] = ['all', 'Angular', 'Vue.js', 'React', '.NET Core', 'Node.js', 'Python', 'AWS', 'Azure', 'Docker'];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.dataService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.filteredProjects = projects;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los proyectos';
        this.isLoading = false;
        console.error('Error loading projects:', error);
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  filterByTechnology(technology: string): void {
    this.selectedTechnology = technology;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProjects = this.projects.filter(project => {
      const categoryMatch = this.selectedCategory === 'all' || project.category === this.selectedCategory;
      const technologyMatch = this.selectedTechnology === 'all' || project.technologies.includes(this.selectedTechnology);
      return categoryMatch && technologyMatch;
    });
  }

  clearFilters(): void {
    this.selectedCategory = 'all';
    this.selectedTechnology = 'all';
    this.filteredProjects = this.projects;
  }

  openProjectModal(project: Project): void {
    this.selectedProject = project;
  }

  closeProjectModal(): void {
    this.selectedProject = null;
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
