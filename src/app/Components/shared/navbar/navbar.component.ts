import { Component, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NavSection {
  id: string;
  label: string;
}

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  isScrolled = false;
  isMobileMenuOpen = false;
  activeSection = 'hero';

  readonly sections: NavSection[] = [
    { id: 'hero', label: 'Inicio' },
    { id: 'projects', label: 'Proyectos' },
    { id: 'about', label: 'Sobre mí' },
    { id: 'skills', label: 'Habilidades' },
    { id: 'contact', label: 'Contacto' },
  ];

  private sectionObserver?: IntersectionObserver;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  ngAfterViewInit(): void {
    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          this.activeSection = visible[0].target.id;
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] }
    );

    this.sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        this.sectionObserver?.observe(element);
      }
    });
  }

  ngOnDestroy(): void {
    this.sectionObserver?.disconnect();
  }

  isActive(sectionId: string): boolean {
    return this.activeSection === sectionId;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
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
