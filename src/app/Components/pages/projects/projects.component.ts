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
  featuredProject: Project | null = null;
  selectedCategory: string = 'all';
  selectedTechnology: string = 'all';
  isLoading: boolean = true;
  error: string | null = null;
  selectedProject: Project | null = null;

  categories: string[] = ['all'];
  technologies: string[] = ['all'];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.dataService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.featuredProject = projects.find((p) => p.id === 1) ?? projects[0] ?? null;
        this.filteredProjects = projects;
        this.buildFilterOptions(projects);
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los proyectos';
        this.isLoading = false;
        console.error('Error loading projects:', error);
      }
    });
  }

  private buildFilterOptions(projects: Project[]): void {
    const categorySet = new Set(projects.map((p) => p.category));
    this.categories = ['all', ...Array.from(categorySet).sort()];

    const techSet = new Set(projects.flatMap((p) => p.technologies));
    this.technologies = ['all', ...Array.from(techSet).sort()];
  }

  get showFeatured(): boolean {
    return !!this.featuredProject
      && !this.hasActiveFilters()
      && this.filteredProjects.some((p) => p.id === this.featuredProject!.id);
  }

  get gridProjects(): Project[] {
    if (!this.showFeatured) {
      return this.filteredProjects;
    }
    return this.filteredProjects.filter((p) => p.id !== this.featuredProject!.id);
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

  hasActiveFilters(): boolean {
    return this.selectedCategory !== 'all' || this.selectedTechnology !== 'all';
  }

  openProjectModal(project: Project): void {
    this.selectedProject = project;
  }

  closeProjectModal(): void {
    this.selectedProject = null;
  }

  openLink(url: string, event?: Event): void {
    event?.stopPropagation();
    if (url) {
      window.open(url, '_blank');
    }
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'completado':
        return 'tag-accent';
      case 'en desarrollo':
        return 'tag text-zinc-300 border-zinc-600 bg-zinc-900';
      case 'planificado':
        return 'tag text-zinc-400 border-zinc-700 bg-zinc-950';
      default:
        return 'tag';
    }
  }

  getCategoryColor(_category: string): string {
    return 'tag';
  }
}
