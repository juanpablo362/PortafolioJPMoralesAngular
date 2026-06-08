import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactService } from '../../../Services/contact.service';

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

  private readonly maxMessageLength = 2000;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      from_name: ['', [Validators.required, Validators.maxLength(100)]],
      from_email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.maxLength(this.maxMessageLength)]],
      website: ['']
    });
  }

  sendEmail(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSending = true;
    this.sendSuccess = false;
    this.sendError = null;

    this.contactService.sendMessage(this.contactForm.value).subscribe({
      next: () => {
        this.sendSuccess = true;
        this.contactForm.reset();
        this.isSending = false;
      },
      error: (err) => {
        this.sendError = err.error?.error
          ?? err.error?.message
          ?? 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.';
        this.isSending = false;
        console.error('Error sending email:', err);
      }
    });
  }

  get from_name() { return this.contactForm.get('from_name'); }
  get from_email() { return this.contactForm.get('from_email'); }
  get message() { return this.contactForm.get('message'); }
}
