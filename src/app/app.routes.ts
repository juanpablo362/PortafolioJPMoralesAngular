import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { AboutComponent } from './Components/about/about.component';
import { ContactComponent } from './Components/contact/contact.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
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
