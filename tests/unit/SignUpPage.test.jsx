import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SignUpPage from '@/pages/SignUpPage';
import { UserAuth } from '@/context/AuthContext';

vi.mock('@/context/AuthContext', () => ({
    UserAuth: vi.fn(),
}));

vi.mock('@/components/AdminPasswordModal', () => ({
    default: ({ isOpen, onClose, onSuccess }) => (
        isOpen ? (
            <div data-testid="admin-modal">
                <button onClick={onClose}>Close</button>
                <button onClick={onSuccess}>Success</button>
            </div>
        ) : null
    ),
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

describe('SignUpPage Component', () => {
    const mockSignUpNewUser = vi.fn();
    let timers;

    beforeEach(() => {
        vi.clearAllMocks();
        timers = vi.useFakeTimers();
        UserAuth.mockReturnValue({
            session: null,
            signUpNewUser: mockSignUpNewUser,
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should render the sign up form', () => {
        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Get Started')).toBeInTheDocument();
        expect(screen.getByText('Join TechGuide today')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your first name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your last name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Create a password (min 6 characters)')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('should render header with logo and link to home', () => {
        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );

        expect(screen.getByText('TECHGUIDE')).toBeInTheDocument();
        const homeLink = screen.getByRole('link', { name: /techguide/i });
        expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should have link to sign in page', () => {
        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );

        const signInLinks = screen.getAllByRole('link', { name: /sign in/i });
        expect(signInLinks.length).toBeGreaterThan(0);
        expect(signInLinks[0]).toHaveAttribute('href', '/signin');
    });

    it('should redirect to dashboard if already logged in', () => {
        UserAuth.mockReturnValue({
            session: { user: { id: '123' } },
            signUpNewUser: mockSignUpNewUser,
        });

        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );

        expect(screen.getByTestId('navigate')).toHaveTextContent('/dashboard');
    });

    it('should have required fields', () => {
        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );

        const emailInput = screen.getByPlaceholderText('Enter your email');
        const passwordInput = screen.getByPlaceholderText('Create a password (min 6 characters)');

        expect(emailInput).toBeRequired();
        expect(passwordInput).toBeRequired();
    });

    it('should have correct input types', () => {
        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );

        expect(screen.getByPlaceholderText('Enter your email')).toHaveAttribute('type', 'email');
        expect(screen.getByPlaceholderText('Create a password (min 6 characters)')).toHaveAttribute('type', 'password');
    });

    it('should show success message on successful signup with countdown', async () => {
        const user = userEvent.setup({ delay: null });
        mockSignUpNewUser.mockResolvedValue({ success: true });

        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );

        await user.type(screen.getByPlaceholderText('Enter your first name'), 'John');
        await user.type(screen.getByPlaceholderText('Enter your last name'), 'Doe');
        await user.type(screen.getByPlaceholderText('Enter your email'), 'john@example.com');
        await user.type(screen.getByPlaceholderText('Create a password (min 6 characters)'), 'password123');

        await user.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(screen.getByText(/account created successfully/i)).toBeInTheDocument();
            expect(screen.getByText(/please check your email to verify/i)).toBeInTheDocument();
            expect(screen.getByText(/we've sent a confirmation link/i)).toBeInTheDocument();
        });

        // Check countdown appears
        await waitFor(() => {
            expect(screen.getByText(/redirecting to sign in in/i)).toBeInTheDocument();
        });

        // Advance timers to check countdown
        vi.advanceTimersByTime(1000);
        await waitFor(() => {
            expect(screen.getByText(/redirecting to sign in in 9 second/i)).toBeInTheDocument();
        });

        // Advance to end of countdown
        vi.advanceTimersByTime(9000);
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/signin');
        });
    });

    it('should show error message on failed signup', async () => {
        const user = userEvent.setup({ delay: null });
        mockSignUpNewUser.mockResolvedValue({
            success: false,
            error: { message: 'Email already exists' }
        });

        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );

        await user.type(screen.getByPlaceholderText('Enter your first name'), 'John');
        await user.type(screen.getByPlaceholderText('Enter your last name'), 'Doe');
        await user.type(screen.getByPlaceholderText('Enter your email'), 'existing@example.com');
        await user.type(screen.getByPlaceholderText('Create a password (min 6 characters)'), 'password123');

        await user.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(screen.getByText('Email already exists')).toBeInTheDocument();
        });
    });

    it('should show sign in link in error message when email already registered', async () => {
        const user = userEvent.setup({ delay: null });
        mockSignUpNewUser.mockResolvedValue({
            success: false,
            error: { message: 'User is already registered' }
        });

        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );

        await user.type(screen.getByPlaceholderText('Enter your first name'), 'John');
        await user.type(screen.getByPlaceholderText('Enter your last name'), 'Doe');
        await user.type(screen.getByPlaceholderText('Enter your email'), 'existing@example.com');
        await user.type(screen.getByPlaceholderText('Create a password (min 6 characters)'), 'password123');

        await user.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(screen.getByText(/click here to sign in/i)).toBeInTheDocument();
            const signInLink = screen.getByRole('link', { name: /click here to sign in/i });
            expect(signInLink).toHaveAttribute('href', '/signin');
        });
    });

    it('should disable button during submission', async () => {
        const user = userEvent.setup({ delay: null });
        mockSignUpNewUser.mockImplementation(() =>
            new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
        );

        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );

        await user.type(screen.getByPlaceholderText('Enter your first name'), 'John');
        await user.type(screen.getByPlaceholderText('Enter your last name'), 'Doe');
        await user.type(screen.getByPlaceholderText('Enter your email'), 'john@example.com');
        await user.type(screen.getByPlaceholderText('Create a password (min 6 characters)'), 'password123');

        const button = screen.getByRole('button', { name: /create account/i });
        await user.click(button);

        expect(screen.getByRole('button', { name: /please wait/i })).toBeDisabled();
    });

    it('should clear form fields after successful signup', async () => {
        const user = userEvent.setup({ delay: null });
        mockSignUpNewUser.mockResolvedValue({ success: true });

        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );

        const firstNameInput = screen.getByPlaceholderText('Enter your first name');
        const lastNameInput = screen.getByPlaceholderText('Enter your last name');
        const emailInput = screen.getByPlaceholderText('Enter your email');
        const passwordInput = screen.getByPlaceholderText('Create a password (min 6 characters)');

        await user.type(firstNameInput, 'John');
        await user.type(lastNameInput, 'Doe');
        await user.type(emailInput, 'john@example.com');
        await user.type(passwordInput, 'password123');

        await user.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(firstNameInput).toHaveValue('');
            expect(lastNameInput).toHaveValue('');
            expect(emailInput).toHaveValue('');
            expect(passwordInput).toHaveValue('');
        });
    });

    it('should show admin access button', () => {
        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );

        const adminButton = screen.getByRole('button', { name: /admin access/i });
        expect(adminButton).toBeInTheDocument();
    });

    it('should open admin modal when admin button is clicked', async () => {
        const user = userEvent.setup({ delay: null });

        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );

        const adminButton = screen.getByRole('button', { name: /admin access/i });
        await user.click(adminButton);

        expect(screen.getByTestId('admin-modal')).toBeInTheDocument();
    });

    it('should call signUpNewUser with correct parameters', async () => {
        const user = userEvent.setup({ delay: null });
        mockSignUpNewUser.mockResolvedValue({ success: true });

        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );

        await user.type(screen.getByPlaceholderText('Enter your first name'), 'John');
        await user.type(screen.getByPlaceholderText('Enter your last name'), 'Doe');
        await user.type(screen.getByPlaceholderText('Enter your email'), 'john@example.com');
        await user.type(screen.getByPlaceholderText('Create a password (min 6 characters)'), 'password123');

        await user.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(mockSignUpNewUser).toHaveBeenCalledWith(
                'john@example.com',
                'password123',
                'John',
                'Doe',
                'Student'
            );
        });
    });
});
