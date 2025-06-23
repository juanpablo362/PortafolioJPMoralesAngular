import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  isSending: boolean = false;
  sendSuccess: boolean = false;
  sendError: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      from_name: ['', Validators.required],
      from_email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  async sendEmail() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSending = true;
    this.sendSuccess = false;
    this.sendError = null;
    
    emailjs.init('pRBJrHKqMT0eC0dHt');
    try {
      await emailjs.send("service_y10kk4g", "template_a54j3t6", this.contactForm.value);
      this.sendSuccess = true;
      this.contactForm.reset();
    } catch (error) {
      this.sendError = 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.';
      console.error('Error sending email:', error);
    } finally {
      this.isSending = false;
    }
  }

  // Helper getters for easy access in template
  get from_name() { return this.contactForm.get('from_name'); }
  get from_email() { return this.contactForm.get('from_email'); }
  get message() { return this.contactForm.get('message'); }
}
