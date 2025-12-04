import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SignInPage from '@/pages/SignInPage';
import { UserAuth } from '@/context/AuthContext';

vi.mock('@/context/AuthContext', () => ({
    UserAuth: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        Navigate: ({ to }) => <div data-testid="navigate">{to}</div>,
    };
});

describe('SignInPage Component', () => {
    const mockSignIn = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        UserAuth.mockReturnValue({
            session: null,
            signIn: mockSignIn,
        });
    });

    it('should render the sign in form', () => {
        render(
            <BrowserRouter>
                <SignInPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        expect(screen.getByText('Sign in to continue learning')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should render TECHGUIDE logo with link to home', () => {
        render(
            <BrowserRouter>
                <SignInPage />
            </BrowserRouter>
        );

        const logoLink = screen.getByText('TECHGUIDE').closest('a');
        expect(logoLink).toHaveAttribute('href', '/');
        expect(screen.getByText('TECHGUIDE')).toBeInTheDocument();
    });

    it('should have link to sign up page', () => {
        render(
            <BrowserRouter>
                <SignInPage />
            </BrowserRouter>
        );

        const signUpLink = screen.getByRole('link', { name: /sign up/i });
        expect(signUpLink).toHaveAttribute('href', '/signup');
    });

    it('should redirect to dashboard if already logged in', () => {
        UserAuth.mockReturnValue({
            session: { user: { id: '123' } },
            signIn: mockSignIn,
        });

        render(
            <BrowserRouter>
                <SignInPage />
            </BrowserRouter>
        );

        expect(screen.getByTestId('navigate')).toHaveTextContent('/dashboard');
    });

    it('should have required fields', () => {
        render(
            <BrowserRouter>
                <SignInPage />
            </BrowserRouter>
        );

        const emailInput = screen.getByPlaceholderText('Enter your email');
        const passwordInput = screen.getByPlaceholderText('Enter your password');

        expect(emailInput).toBeRequired();
        expect(passwordInput).toBeRequired();
    });

    it('should have correct input types', () => {
        render(
            <BrowserRouter>
                <SignInPage />
            </BrowserRouter>
        );

        expect(screen.getByPlaceholderText('Enter your email')).toHaveAttribute('type', 'email');
        expect(screen.getByPlaceholderText('Enter your password')).toHaveAttribute('type', 'password');
    });

    it('should have correct labels for form fields', () => {
        render(
            <BrowserRouter>
                <SignInPage />
            </BrowserRouter>
        );

        expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('should navigate to dashboard on successful sign in', async () => {
        const user = userEvent.setup();
        mockSignIn.mockResolvedValue({ success: true });

        render(
            <BrowserRouter>
                <SignInPage />
            </BrowserRouter>
        );

        await user.type(screen.getByPlaceholderText('Enter your email'), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('should show error message on failed sign in', async () => {
        const user = userEvent.setup();
        mockSignIn.mockResolvedValue({
            success: false,
            error: { message: 'Invalid email or password' }
        });

        render(
            <BrowserRouter>
                <SignInPage />
            </BrowserRouter>
        );

        await user.type(screen.getByPlaceholderText('Enter your email'), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Enter your password'), 'wrongpassword');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
        });
    });

    it('should show default error message when error has no message', async () => {
        const user = userEvent.setup();
        mockSignIn.mockResolvedValue({
            success: false,
            error: {}
        });

        render(
            <BrowserRouter>
                <SignInPage />
            </BrowserRouter>
        );

        await user.type(screen.getByPlaceholderText('Enter your email'), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText('Failed to sign in. Please check your credentials.')).toBeInTheDocument();
        });
    });

    it('should show default error message when error is null', async () => {
        const user = userEvent.setup();
        mockSignIn.mockResolvedValue({
            success: false,
            error: null
        });

        render(
            <BrowserRouter>
                <SignInPage />
            </BrowserRouter>
        );

        await user.type(screen.getByPlaceholderText('Enter your email'), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText('Failed to sign in. Please check your credentials.')).toBeInTheDocument();
        });
    });

    it('should clear form fields after successful sign in', async () => {
        const user = userEvent.setup();
        mockSignIn.mockResolvedValue({ success: true });

        render(
            <BrowserRouter>
                <SignInPage />
            </BrowserRouter>
        );

        const emailInput = screen.getByPlaceholderText('Enter your email');
        const passwordInput = screen.getByPlaceholderText('Enter your password');

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(emailInput).toHaveValue('');
            expect(passwordInput).toHaveValue('');
        });
    });

    it('should disable button and show loading text during submission', async () => {
        const user = userEvent.setup();
        mockSignIn.mockImplementation(() =>
            new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
        );

        render(
            <BrowserRouter>
                <SignInPage />
            </BrowserRouter>
        );

        await user.type(screen.getByPlaceholderText('Enter your email'), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');

        const button = screen.getByRole('button', { name: /sign in/i });
        await user.click(button);

        expect(screen.getByRole('button', { name: /please wait/i })).toBeDisabled();
    });

    it('should update email input value when user types', async () => {
        const user = userEvent.setup();

        render(
            <BrowserRouter>
                <SignInPage />
            </BrowserRouter>
        );

        const emailInput = screen.getByPlaceholderText('Enter your email');
        await user.type(emailInput, 'user@example.com');

        expect(emailInput).toHaveValue('user@example.com');
    });

    it('should update password input value when user types', async () => {
        const user = userEvent.setup();

        render(
            <BrowserRouter>
                <SignInPage />
            </BrowserRouter>
        );

        const passwordInput = screen.getByPlaceholderText('Enter your password');
        await user.type(passwordInput, 'mypassword');

        expect(passwordInput).toHaveValue('mypassword');
    });

    it('should clear error message when form is submitted again', async () => {
        const user = userEvent.setup();
        mockSignIn
            .mockResolvedValueOnce({
                success: false,
                error: { message: 'First error' }
            })
            .mockResolvedValueOnce({
                success: false,
                error: { message: 'Second error' }
            });

        render(
            <BrowserRouter>
                <SignInPage />
            </BrowserRouter>
        );

        const emailInput = screen.getByPlaceholderText('Enter your email');
        const passwordInput = screen.getByPlaceholderText('Enter your password');

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText('First error')).toBeInTheDocument();
        });

        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.queryByText('First error')).not.toBeInTheDocument();
            expect(screen.getByText('Second error')).toBeInTheDocument();
        });
    });
});

