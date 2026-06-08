import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../../Services/data.service';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.css'
})
export class ProjectModalComponent implements OnChanges, OnDestroy {
  @Input() project: Project | null = null;
  @Output() close = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if ('project' in changes) {
      document.body.style.overflow = this.project ? 'hidden' : '';
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  closeModal(): void {
    this.close.emit();
  }

  openLink(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }
}
