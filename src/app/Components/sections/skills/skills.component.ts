import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, SkillsData } from '../../../Services/data.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent implements OnInit {
  skillsData: SkillsData | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getSkills().subscribe({
      next: (data) => {
        this.skillsData = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las habilidades.';
        this.isLoading = false;
      }
    });
  }

  formatYears(years: number): string {
    const rounded = Math.max(1, Math.round(years));
    return rounded === 1 ? '1 año' : `${rounded} años`;
  }
}
