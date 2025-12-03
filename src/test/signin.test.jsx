import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SignInPage from '../pages/SignInPage';
import { UserAuth } from '../context/AuthContext';

// Mock the AuthContext
vi.mock('../context/AuthContext', () => ({
    UserAuth: vi.fn(),
}));

// Mock react-router-dom Navigate and useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        Navigate: ({ to }) => <div data-testid="navigate">{to}</div>,
    };
});

describe('SignInPage', () => {
    const mockSignIn = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        UserAuth.mockReturnValue({
            session: null,
            signIn: mockSignIn,
        });
    });

    const renderSignInPage = () => {
        return render(
            <BrowserRouter>
                <SignInPage />
            </BrowserRouter>
        );
    };

    it('should render the sign in form', () => {
        renderSignInPage();

        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should successfully sign in and navigate to dashboard', async () => {
        const user = userEvent.setup();
        mockSignIn.mockResolvedValue({ success: true });
        renderSignInPage();

        await user.type(screen.getByLabelText('Email Address'), 'test@example.com');
        await user.type(screen.getByLabelText('Password'), 'password123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('should display error message on failed sign in', async () => {
        const user = userEvent.setup();
        mockSignIn.mockResolvedValue({
            success: false,
            error: { message: 'Invalid email or password' }
        });
        renderSignInPage();

        await user.type(screen.getByLabelText('Email Address'), 'wrong@example.com');
        await user.type(screen.getByLabelText('Password'), 'wrongpassword');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
        });
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should show loading state when submitting', async () => {
        const user = userEvent.setup();
        mockSignIn.mockImplementation(() =>
            new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
        );
        renderSignInPage();

        await user.type(screen.getByLabelText('Email Address'), 'test@example.com');
        await user.type(screen.getByLabelText('Password'), 'password123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        expect(screen.getByRole('button', { name: /please wait/i })).toBeDisabled();
    });

    it('should redirect to dashboard if already logged in', () => {
        UserAuth.mockReturnValue({
            session: { user: { id: '123', email: 'test@example.com' } },
            signIn: mockSignIn,
        });

        renderSignInPage();

        expect(screen.getByTestId('navigate')).toHaveTextContent('/dashboard');
        expect(screen.queryByText('Welcome Back')).not.toBeInTheDocument();
    });
});
