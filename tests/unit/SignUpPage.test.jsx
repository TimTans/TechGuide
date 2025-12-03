import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SignUpPage from '@/pages/SignUpPage';
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

describe('SignUpPage Component', () => {
    const mockSignUpNewUser = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        UserAuth.mockReturnValue({
            session: null,
            signUpNewUser: mockSignUpNewUser,
        });
    });

    it('should render the sign up form', () => {
        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );
        
        expect(screen.getByText('Get Started')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your first name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('should render role dropdown with options', () => {
        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );
        
        const options = screen.getAllByRole('option');
        expect(options.length).toBe(3);
        expect(screen.getByRole('option', { name: 'Student' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Instructor' })).toBeInTheDocument();
    });

    it('should have link to sign in page', () => {
        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );
        
        const signInLink = screen.getByRole('link', { name: /sign in/i });
        expect(signInLink).toHaveAttribute('href', '/signin');
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
        const passwordInput = screen.getByPlaceholderText(/create a password/i);
        
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
        expect(screen.getByPlaceholderText(/create a password/i)).toHaveAttribute('type', 'password');
    });

    it('should show success message on successful signup', async () => {
        const user = userEvent.setup();
        mockSignUpNewUser.mockResolvedValue({ success: true });
        
        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );
        
        await user.type(screen.getByPlaceholderText('Enter your first name'), 'John');
        await user.type(screen.getByPlaceholderText('Enter your last name'), 'Doe');
        await user.type(screen.getByPlaceholderText('Enter your email'), 'john@example.com');
        await user.type(screen.getByPlaceholderText(/create a password/i), 'password123');
        
        const roleSelect = screen.getByRole('combobox');
        await user.selectOptions(roleSelect, 'Student');
        
        await user.click(screen.getByRole('button', { name: /create account/i }));
        
        await waitFor(() => {
            expect(screen.getByText(/account created successfully/i)).toBeInTheDocument();
        });
    });

    it('should show error message on failed signup', async () => {
        const user = userEvent.setup();
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
        await user.type(screen.getByPlaceholderText(/create a password/i), 'password123');
        
        const roleSelect = screen.getByRole('combobox');
        await user.selectOptions(roleSelect, 'Student');
        
        await user.click(screen.getByRole('button', { name: /create account/i }));
        
        await waitFor(() => {
            expect(screen.getByText('Email already exists')).toBeInTheDocument();
        });
    });

    it('should disable button during submission', async () => {
        const user = userEvent.setup();
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
        await user.type(screen.getByPlaceholderText(/create a password/i), 'password123');
        
        const roleSelect = screen.getByRole('combobox');
        await user.selectOptions(roleSelect, 'Student');
        
        const button = screen.getByRole('button', { name: /create account/i });
        await user.click(button);
        
        expect(screen.getByRole('button', { name: /please wait/i })).toBeDisabled();
    });
});
