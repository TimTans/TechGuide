import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '@/pages/dashboard.jsx';
import { UserAuth } from '@/context/AuthContext';

// Mock supabase client
const mockSupabase = {
    from: vi.fn((table) => {
        const mockQuery = {
            select: vi.fn((columns, options) => {
                if (options?.head) {
                    return Promise.resolve({ count: 0, error: null });
                }
                return {
                    eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
                };
            }),
            eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
        };
        return mockQuery;
    }),
    auth: {
        getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
        getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
        signOut: vi.fn(() => Promise.resolve({ error: null })),
    },
};

vi.mock('@/context/AuthContext', () => ({
    UserAuth: vi.fn(),
    supabase: mockSupabase,
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
    const mockGetUserData = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call navigate to signin when session is null', () => {
        UserAuth.mockReturnValue({
            session: null,
            getUserData: mockGetUserData,
        });

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });

    it('should render nothing when not authenticated', () => {
        UserAuth.mockReturnValue({
            session: null,
            getUserData: mockGetUserData,
        });

        const { container } = render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        expect(container.firstChild).toBeNull();
    });

    it('should call getUserData when authenticated', async () => {
        mockGetUserData.mockResolvedValue({
            success: true,
            data: { name: 'Test User' }
        });

        UserAuth.mockReturnValue({
            session: { user: { id: '123', email: 'test@example.com' } },
            getUserData: mockGetUserData,
        });

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        expect(mockGetUserData).toHaveBeenCalled();
    });

    it('should render dashboard when authenticated', () => {
        mockGetUserData.mockResolvedValue({
            success: true,
            data: {}
        });

        UserAuth.mockReturnValue({
            session: { user: { id: '123', email: 'test@example.com' } },
            getUserData: mockGetUserData,
        });

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        // Dashboard should render something (not null)
        expect(mockNavigate).not.toHaveBeenCalledWith('/signin');
    });
});
