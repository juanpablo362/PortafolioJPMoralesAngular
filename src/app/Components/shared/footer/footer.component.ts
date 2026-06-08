import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, PersonalInfo } from '../../../Services/data.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  currentYear = new Date();
  personalInfo: PersonalInfo | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getAboutData().subscribe({
      next: (data) => {
        this.personalInfo = data.personal;
      }
    });
  }
}
