import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { ContactComponent } from './contact.component';
import { ContactService } from '../../../Services/contact.service';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let contactService: jasmine.SpyObj<ContactService>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    const contactServiceSpy = jasmine.createSpyObj('ContactService', ['sendMessage']);

    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ContactService, useValue: contactServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    contactService = TestBed.inject(ContactService) as jasmine.SpyObj<ContactService>;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not send when form is invalid', () => {
    component.sendEmail();
    expect(contactService.sendMessage).not.toHaveBeenCalled();
  });

  it('should send message when form is valid', () => {
    contactService.sendMessage.and.returnValue(of({ success: true }));

    component.contactForm.setValue({
      from_name: 'Juan',
      from_email: 'juan@example.com',
      message: 'Hola',
      website: ''
    });

    component.sendEmail();

    expect(contactService.sendMessage).toHaveBeenCalledWith({
      from_name: 'Juan',
      from_email: 'juan@example.com',
      message: 'Hola',
      website: ''
    });
    expect(component.sendSuccess).toBeTrue();
    expect(component.isSending).toBeFalse();
  });

  it('should show error message on failure', () => {
    contactService.sendMessage.and.returnValue(
      throwError(() => ({ error: { error: 'Error de prueba' } }))
    );

    component.contactForm.setValue({
      from_name: 'Juan',
      from_email: 'juan@example.com',
      message: 'Hola',
      website: ''
    });

    component.sendEmail();

    expect(component.sendError).toBe('Error de prueba');
    expect(component.isSending).toBeFalse();
  });
});
