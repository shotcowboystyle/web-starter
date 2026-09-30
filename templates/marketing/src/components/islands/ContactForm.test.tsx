import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import ContactForm from './ContactForm';

describe('ContactForm', () => {
  it('renders labels and inputs', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<ContactForm />);
    const submitButton = screen.getByRole('button', { name: /Send Message/i });

    fireEvent.click(submitButton);

    expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Message is required/i)).toBeInTheDocument();
  });

  it('shows error for invalid email', async () => {
    render(<ContactForm />);
    const emailInput = screen.getByLabelText(/Email/i);

    fireEvent.change(emailInput, { target: { id: 'email', value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

    expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument();
  });

  it('successfully submits the form', async () => {
    // vi.useFakeTimers() for the setTimeout in HandleSubmit
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { id: 'name', value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { id: 'email', value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { id: 'message', value: 'Hello world' } });

    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

    expect(screen.getByText(/Sending.../i)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByText(/Message Sent!/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    expect(screen.getByText(/We'll get back to you as soon as possible./i)).toBeInTheDocument();
  });
});
