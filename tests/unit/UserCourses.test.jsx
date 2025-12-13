import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserCourses from '@/components/UserCourses';

// Mock AuthContext properly with UserAuth
vi.mock('@/context/AuthContext', () => ({
    UserAuth: vi.fn(),
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    order: vi.fn(() => Promise.resolve({
                        data: [],
                        error: null
                    }))
                }))
            }))
        }))
    }
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('UserCourses Component', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        const { UserAuth } = await import('@/context/AuthContext');
        UserAuth.mockReturnValue({
            session: {
                user: {
                    id: 'user-123',
                    email: 'test@example.com'
                }
            }
        });
    });

    it('should render component without crashing', () => {
        const { container } = render(
            <BrowserRouter>
                <UserCourses />
            </BrowserRouter>
        );

        expect(container).toBeInTheDocument();
        expect(container.querySelector('.grid')).toBeInTheDocument();
    });

    it('should fetch user courses on mount', async () => {
        const { supabase } = await import('@/context/AuthContext');
        
        render(
            <BrowserRouter>
                <UserCourses />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(supabase.from).toHaveBeenCalled();
        });
    });

    it('should handle null session gracefully', async () => {
        const { UserAuth } = await import('@/context/AuthContext');
        UserAuth.mockReturnValue({
            session: null
        });

        const { container } = render(
            <BrowserRouter>
                <UserCourses />
            </BrowserRouter>
        );

        expect(container).toBeInTheDocument();
    });

    it('should call supabase from enrollments table', async () => {
        const { supabase } = await import('@/context/AuthContext');
        
        render(
            <BrowserRouter>
                <UserCourses />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(supabase.from).toHaveBeenCalledWith('user_progress');
        });
    });

    it('should display skeleton loading state', () => {
        const { container } = render(
            <BrowserRouter>
                <UserCourses />
            </BrowserRouter>
        );

        // Check for skeleton loader (animate-pulse class)
        expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });
});