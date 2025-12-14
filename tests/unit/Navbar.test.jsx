import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '@/components/Navbar';
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
    };
});

describe('Navbar Component', () => {
    const mockSignOut = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        UserAuth.mockReturnValue({
            signOut: mockSignOut,
        });
    });

    it('should render the TECHGUIDE logo', () => {
        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );

        expect(screen.getByText('TECHGUIDE')).toBeInTheDocument();
    });

    // Notification bell removed from component - test removed

    it('should have dashboard link in logo', () => {
        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );

        const logo = screen.getByText('TECHGUIDE').closest('a');
        expect(logo).toHaveAttribute('href', '/dashboard');
    });

    it('should render user profile dropdown button', () => {
        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );

        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
    });

    it('should call signOut and navigate home on sign out', async () => {
        const user = userEvent.setup();
        mockSignOut.mockResolvedValue({ success: true });

        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );

        // Find the dropdown button by looking for the button that contains a User icon
        const buttons = screen.getAllByRole('button');
        const menuButton = buttons.find(btn => btn.querySelector('svg'));
        expect(menuButton).toBeDefined();
        await user.click(menuButton);

        await waitFor(() => {
            expect(screen.getByText('Sign Out')).toBeInTheDocument();
        });

        const signOutButton = screen.getByText('Sign Out');
        await user.click(signOutButton);

        await waitFor(() => {
            expect(mockSignOut).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    it('should open and close dropdown menu', async () => {
        const user = userEvent.setup();

        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );

        expect(screen.queryByText('User Profile')).not.toBeInTheDocument();

        // Find the dropdown button by looking for the button that contains a User icon
        const buttons = screen.getAllByRole('button');
        const menuButton = buttons.find(btn => btn.querySelector('svg'));
        expect(menuButton).toBeDefined();
        await user.click(menuButton);

        await waitFor(() => {
            expect(screen.getByText('User Profile')).toBeInTheDocument();
            expect(screen.getByText('Settings')).toBeInTheDocument();
        });
    });

    it('should navigate to user profile when clicked', async () => {
        const user = userEvent.setup();

        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );

        // Find the dropdown button by looking for the button that contains a User icon
        const buttons = screen.getAllByRole('button');
        const menuButton = buttons.find(btn => btn.querySelector('svg'));
        expect(menuButton).toBeDefined();
        await user.click(menuButton);

        await waitFor(() => {
            expect(screen.getByText('User Profile')).toBeInTheDocument();
        });

        const profileButton = screen.getByText('User Profile');
        await user.click(profileButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/userprofile');
        });
    });

    it('should navigate to settings when clicked', async () => {
        const user = userEvent.setup();

        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );

        // Find the dropdown button by looking for the button that contains a User icon
        const buttons = screen.getAllByRole('button');
        const menuButton = buttons.find(btn => btn.querySelector('svg'));
        expect(menuButton).toBeDefined();
        await user.click(menuButton);

        await waitFor(() => {
            expect(screen.getByText('Settings')).toBeInTheDocument();
        });

        const settingsButton = screen.getByText('Settings');
        await user.click(settingsButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/settings');
        });
    });
});
