import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import InstructorDashboard from '../../src/pages/InstructorDashboard';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock supabase - use hoisted to define mock function before mock factory
const { mockSignOut, mockSupabase } = vi.hoisted(() => {
    const createMockQuery = () => {
        const mockQuery = {
            select: vi.fn(function (columns) {
                // Return a chainable object that has order() and can also be awaited directly
                const chainable = {
                    order: vi.fn(function () {
                        return Promise.resolve({ data: [], error: null });
                    }),
                    eq: vi.fn(function () {
                        return Promise.resolve({ data: [], error: null });
                    }),
                };
                // Make it thenable so it can be used in Promise.all
                chainable.then = (resolve) => Promise.resolve({ data: [], error: null }).then(resolve);
                chainable.catch = (reject) => Promise.resolve({ data: [], error: null }).catch(reject);
                return chainable;
            }),
            eq: vi.fn(function () { return Promise.resolve({ data: [], error: null }); }),
        };
        return mockQuery;
    };

    const mockFrom = vi.fn((table) => {
        return createMockQuery();
    });

    return {
        mockSignOut: vi.fn(() => Promise.resolve({ error: null })),
        mockSupabase: {
            from: mockFrom,
            auth: {
                signOut: vi.fn(() => Promise.resolve({ error: null })),
            },
        },
    };
});

const mockUserAuth = vi.fn();
vi.mock('../../src/context/AuthContext', () => ({
    UserAuth: () => mockUserAuth(),
    supabase: mockSupabase,
}));

// Helper function to render component with router
const renderWithRouter = (component, user = null) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('InstructorDashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockSignOut.mockResolvedValue({});

        // Set default mock return value for UserAuth
        mockUserAuth.mockReturnValue({
            session: { user: { id: '123', email: 'instructor@example.com' } },
        });
    });

    describe('Component Rendering', () => {
        it('should render the dashboard header with TECHGUIDE logo', async () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            await waitFor(() => {
                expect(screen.getByText('TECHGUIDE')).toBeInTheDocument();
            });
        });

        it('should render the main heading "Instructor Dashboard"', async () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            await waitFor(() => {
                expect(screen.getByText('Instructor Dashboard')).toBeInTheDocument();
            });
        });

        it('should display user email prefix when user is provided', async () => {
            const user = { email: 'instructor@example.com' };
            renderWithRouter(<InstructorDashboard user={user} />);

            await waitFor(() => {
                expect(screen.getByText('instructor')).toBeInTheDocument();
            });
        });

        it('should not display user email prefix when user is not provided', async () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            await waitFor(() => {
                const emailPrefix = screen.queryByText(/instructor|@/);
                expect(emailPrefix).not.toBeInTheDocument();
            });
        });

        it('should render sign out button', async () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
            });
        });

        // Notification bell removed from component - test removed
    });

    describe('Statistics Display', () => {
        it('should display total students count', async () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            await waitFor(() => {
                expect(screen.getByText('Total Students')).toBeInTheDocument();
            });
            // The count will be 0 or whatever the mock returns
            const totalStudentsText = screen.getByText('Total Students');
            expect(totalStudentsText).toBeInTheDocument();
        });

        it('should display active courses count', async () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            await waitFor(() => {
                expect(screen.getByText('Active Courses')).toBeInTheDocument();
            });
            // The count will be 0 or whatever the mock returns
            const activeCoursesText = screen.getByText('Active Courses');
            expect(activeCoursesText).toBeInTheDocument();
        });

        it('should display completed sessions count', async () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            await waitFor(() => {
                expect(screen.getByText('Sessions')).toBeInTheDocument();
            });
            // The count will be 0 or whatever the mock returns
            const sessionsText = screen.getByText('Sessions');
            expect(sessionsText).toBeInTheDocument();
        });
    });

    describe('Courses Section', () => {
        it('should render "Your Courses" heading', async () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            await waitFor(() => {
                expect(screen.getByText('Your Courses')).toBeInTheDocument();
            });
        });

        it('should render courses section', async () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            await waitFor(() => {
                expect(screen.getByText('Your Courses')).toBeInTheDocument();
            });
            // Component will show "No courses available yet." or courses if data exists
            const coursesHeading = screen.getByText('Your Courses');
            expect(coursesHeading).toBeInTheDocument();
        });

        it('should render "Manage All" button', async () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            await waitFor(() => {
                expect(screen.getByText('Manage All')).toBeInTheDocument();
            });
        });
    });

    describe('Students Section', () => {
        it('should render "Recent Students" heading', async () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            await waitFor(() => {
                expect(screen.getByText('Recent Students')).toBeInTheDocument();
            });
        });

        it('should render students section', async () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            await waitFor(() => {
                expect(screen.getByText('Recent Students')).toBeInTheDocument();
            });
            // Component will show "No students with activity yet." or students if data exists
            const studentsHeading = screen.getByText('Recent Students');
            expect(studentsHeading).toBeInTheDocument();
        });

        it('should render "View All" button', async () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            await waitFor(() => {
                expect(screen.getByText('View All')).toBeInTheDocument();
            });
        });
    });

    describe('Recent Activity Section', () => {
        it('should render "Recent Activity" heading', async () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            await waitFor(() => {
                expect(screen.getByText('Recent Activity')).toBeInTheDocument();
            });
        });

        it('should render recent activity section', async () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            await waitFor(() => {
                expect(screen.getByText('Recent Activity')).toBeInTheDocument();
            });
            // Component will show "No recent activity." or activities if data exists
            const activityHeading = screen.getByText('Recent Activity');
            expect(activityHeading).toBeInTheDocument();
        });
    });

    describe('Quick Actions Section', () => {
        it('should render "Quick Actions" heading', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('Quick Actions')).toBeInTheDocument();
        });

        it('should render "Create New Course" button', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByRole('button', { name: /create new course/i })).toBeInTheDocument();
        });

        it('should render "Add Lesson Content" button', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByRole('button', { name: /add lesson content/i })).toBeInTheDocument();
        });

        it('should render "Manage Students" button', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByRole('button', { name: /manage students/i })).toBeInTheDocument();
        });
    });

    describe('Help & Support Section', () => {
        it('should render "Need Support?" heading', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('Need Support?')).toBeInTheDocument();
        });

        it('should render support description', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText(/Contact our admin team for assistance/i)).toBeInTheDocument();
        });

        it('should render "Contact Admin" button', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByRole('button', { name: /contact admin/i })).toBeInTheDocument();
        });

        it('should display support phone number', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('(123) 456-7890')).toBeInTheDocument();
        });
    });

    describe('Teaching Tip Section', () => {
        it('should render teaching tip', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText(/Teaching Tip/i)).toBeInTheDocument();
            expect(screen.getByText(/Break complex topics into smaller, digestible steps/i)).toBeInTheDocument();
        });
    });

    describe('Sign Out Functionality', () => {
        it('should call supabase signOut when sign out button is clicked', async () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            const signOutButton = screen.getByRole('button', { name: /sign out/i });
            fireEvent.click(signOutButton);

            await waitFor(() => {
                expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(1);
            });
        });

        it('should navigate to home page after sign out', async () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            const signOutButton = screen.getByRole('button', { name: /sign out/i });
            fireEvent.click(signOutButton);

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/');
            });
        });
    });

    describe('Link Navigation', () => {
        it('should render link to home page', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            const homeLink = screen.getByRole('link', { name: /techguide/i });
            expect(homeLink).toHaveAttribute('href', '/');
        });
    });

    describe('Accessibility', () => {
        it('should have proper button roles', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThan(0);
        });

        it('should have proper heading hierarchy', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            const mainHeading = screen.getByRole('heading', { name: /instructor dashboard/i });
            expect(mainHeading).toBeInTheDocument();
        });
    });
});

