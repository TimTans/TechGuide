import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '@/pages/dashboard.jsx';

// Mock AuthContext with proper structure
vi.mock('@/context/AuthContext', () => ({
    UserAuth: vi.fn(),
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => Promise.resolve({
                    data: [],
                    error: null
                }))
            }))
        }))
    }
}));

// Mock UserCourses to avoid nested complexity
vi.mock('@/components/UserCourses', () => ({
    default: () => <div data-testid="user-courses">User Courses Component</div>
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Dashboard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call navigate to signin when session is null', async () => {
        const { UserAuth } = await import('@/context/AuthContext');
        UserAuth.mockReturnValue({
            session: null,
            getUserData: vi.fn(),
        });

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/signin');
        });
    });

    it('should render nothing when not authenticated', async () => {
        const { UserAuth } = await import('@/context/AuthContext');
        UserAuth.mockReturnValue({
            session: null,
            getUserData: vi.fn(),
        });

        const { container } = render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        expect(container.firstChild).toBeNull();
    });

    it('should call getUserData when authenticated', async () => {
        const mockGetUserData = vi.fn().mockResolvedValue({
            success: true,
            data: { name: 'Test User' }
        });

        const { UserAuth } = await import('@/context/AuthContext');
        UserAuth.mockReturnValue({
            session: { user: { id: '123', email: 'test@example.com' } },
            getUserData: mockGetUserData,
        });

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(mockGetUserData).toHaveBeenCalled();
        });
    });

    it('should render dashboard when authenticated', async () => {
        const mockGetUserData = vi.fn().mockResolvedValue({
            success: true,
            data: {}
        });

        const { UserAuth } = await import('@/context/AuthContext');
        UserAuth.mockReturnValue({
            session: { user: { id: '123', email: 'test@example.com' } },
            getUserData: mockGetUserData,
        });

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(mockNavigate).not.toHaveBeenCalledWith('/signin');
        });
    });
});