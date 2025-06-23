import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
  year: number;
  status: string;
  github: string;
  demo: string;
  features: string[];
}

export interface Skill {
  name: string;
  level: number;
  years: number;
  icon: string;
  description: string;
}

export interface SkillCategory {
  name: string;
  icon: string;
  color: string;
  skills: Skill[];
}

export interface SoftSkill {
  name: string;
  level: number;
  description: string;
}

export interface SkillsData {
  categories: SkillCategory[];
  softSkills: SoftSkill[];
}

export interface Experience {
  id: number;
  position: string;
  company: string;
  period: string;
  location: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  period: string;
  location: string;
  description: string;
  gpa: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  expiry: string;
  id: string;
}

export interface Language {
  language: string;
  level: string;
  proficiency: number;
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  avatar: string;
  bio: string;
}

export interface AboutData {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  interests: string[];
  languages: Language[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>('assets/Data/projects.json');
  }

  getSkills(): Observable<SkillsData> {
    return this.http.get<SkillsData>('assets/Data/skills.json');
  }

  getAboutData(): Observable<AboutData> {
    return this.http.get<AboutData>('assets/Data/about.json');
  }
}
