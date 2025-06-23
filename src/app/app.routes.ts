import { Routes } from '@angular/router';
import { AboutComponent } from './Components/pages/about/about.component';
import { ContactComponent } from './Components/pages/contact/contact.component';
import { HeroComponent } from './Components/sections/hero/hero.component';

export const routes: Routes = [
    {
        path: '',
        component: HeroComponent
    },
    {
        path: 'nosotros',
        component: AboutComponent
    },
    {
        path: 'contacto',
        component: ContactComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
