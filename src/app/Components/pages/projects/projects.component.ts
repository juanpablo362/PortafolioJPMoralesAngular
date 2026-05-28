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
        return 'tag text-emerald-400 border-emerald-800 bg-emerald-950';
      case 'en desarrollo':
        return 'tag text-amber-400 border-amber-800 bg-amber-950';
      case 'planificado':
        return 'tag text-blue-400 border-blue-800 bg-blue-950';
      default:
        return 'tag';
    }
  }

  getCategoryColor(_category: string): string {
    return 'tag';
  }
}
