import { Component } from '@angular/core';
import { NavbarComponent } from './Components/shared/navbar/navbar.component';
import { HeroComponent } from './Components/sections/hero/hero.component';
import { SkillsComponent } from './Components/sections/skills/skills.component';
import { FooterComponent } from './Components/shared/footer/footer.component';
import { ProjectsComponent } from './Components/pages/projects/projects.component';
import { AboutComponent } from './Components/pages/about/about.component';
import { ContactComponent } from './Components/pages/contact/contact.component';

@Component({
  selector: 'app-root',
  imports: [
    NavbarComponent, 
    HeroComponent, 
    SkillsComponent, 
    ProjectsComponent,
    AboutComponent,
    ContactComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  host: { class: 'block' }
})
export class AppComponent {
  title = 'PortafolioJPMR';
}
