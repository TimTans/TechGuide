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

// Mock supabase
const mockSignOut = vi.fn();
vi.mock('../../src/App', () => ({
    supabase: {
        auth: {
            signOut: mockSignOut,
        },
    },
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
    });

    describe('Component Rendering', () => {
        it('should render the dashboard header with TECHGUIDE logo', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('TECHGUIDE')).toBeInTheDocument();
        });

        it('should render the main heading "Instructor Dashboard"', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('Instructor Dashboard')).toBeInTheDocument();
        });

        it('should display user email prefix when user is provided', () => {
            const user = { email: 'instructor@example.com' };
            renderWithRouter(<InstructorDashboard user={user} />);

            expect(screen.getByText('instructor')).toBeInTheDocument();
        });

        it('should not display user email prefix when user is not provided', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            const emailPrefix = screen.queryByText(/instructor|@/);
            expect(emailPrefix).not.toBeInTheDocument();
        });

        it('should render sign out button', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
        });

        it('should render notification bell with badge', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            const bellButton = screen.getByRole('button', { name: '' });
            expect(bellButton).toBeInTheDocument();
            expect(screen.getByText('3')).toBeInTheDocument();
        });
    });

    describe('Statistics Display', () => {
        it('should display total students count', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('42')).toBeInTheDocument();
            expect(screen.getByText('Total Students')).toBeInTheDocument();
        });

        it('should display active courses count', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('6')).toBeInTheDocument();
            expect(screen.getByText('Active Courses')).toBeInTheDocument();
        });

        it('should display average rating in quick stats', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('4.8')).toBeInTheDocument();
            expect(screen.getByText('Avg. Rating')).toBeInTheDocument();
        });

        it('should display completed sessions count', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('128')).toBeInTheDocument();
            expect(screen.getByText('Sessions')).toBeInTheDocument();
        });
    });

    describe('Courses Section', () => {
        it('should render "Your Courses" heading', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('Your Courses')).toBeInTheDocument();
        });

        it('should render all courses', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('Email Basics')).toBeInTheDocument();
            expect(screen.getByText('Video Calls')).toBeInTheDocument();
            expect(screen.getByText('Social Media')).toBeInTheDocument();
            expect(screen.getByText('Online Shopping')).toBeInTheDocument();
        });

        it('should display course descriptions', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('Teaching email fundamentals to seniors')).toBeInTheDocument();
            expect(screen.getByText('Master Zoom, Skype, and FaceTime')).toBeInTheDocument();
            expect(screen.getByText('Connect with family on Facebook & Instagram')).toBeInTheDocument();
            expect(screen.getByText('Shop safely on Amazon, eBay, and more')).toBeInTheDocument();
        });

        it('should display student count for each course', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('15 Students')).toBeInTheDocument();
            expect(screen.getByText('12 Students')).toBeInTheDocument();
            expect(screen.getByText('10 Students')).toBeInTheDocument();
            expect(screen.getByText('5 Students')).toBeInTheDocument();
        });

        it('should display progress percentage for each course', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('75%')).toBeInTheDocument();
            expect(screen.getByText('60%')).toBeInTheDocument();
            expect(screen.getByText('45%')).toBeInTheDocument();
            expect(screen.getByText('30%')).toBeInTheDocument();
        });

        it('should render "Manage Course" button for each course', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            const manageButtons = screen.getAllByRole('button', { name: /manage course/i });
            expect(manageButtons).toHaveLength(4);
        });

        it('should render "Manage All" button', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('Manage All')).toBeInTheDocument();
        });
    });

    describe('Students Section', () => {
        it('should render "Recent Students" heading', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('Recent Students')).toBeInTheDocument();
        });

        it('should render all students', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('Mary Johnson')).toBeInTheDocument();
            expect(screen.getByText('Robert Smith')).toBeInTheDocument();
            expect(screen.getByText('Patricia Williams')).toBeInTheDocument();
            expect(screen.getByText('James Brown')).toBeInTheDocument();
        });

        it('should display student course assignments', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('Email Basics')).toBeInTheDocument();
            expect(screen.getByText('Video Calls')).toBeInTheDocument();
            expect(screen.getByText('Social Media')).toBeInTheDocument();
            expect(screen.getByText('Online Shopping')).toBeInTheDocument();
        });

        it('should display student progress percentages', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('80%')).toBeInTheDocument();
            expect(screen.getByText('60%')).toBeInTheDocument();
            expect(screen.getByText('45%')).toBeInTheDocument();
            expect(screen.getByText('30%')).toBeInTheDocument();
        });

        it('should display student status badges', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            const activeBadges = screen.getAllByText('active');
            expect(activeBadges.length).toBeGreaterThan(0);
        });

        it('should render "View All" button', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('View All')).toBeInTheDocument();
        });
    });

    describe('Recent Activity Section', () => {
        it('should render "Recent Activity" heading', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('Recent Activity')).toBeInTheDocument();
        });

        it('should render all recent activities', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText(/New student enrolled: Email Basics/i)).toBeInTheDocument();
            expect(screen.getByText(/Session completed: Video Calls - Lesson 3/i)).toBeInTheDocument();
            expect(screen.getByText(/Student achievement: First Week Complete!/i)).toBeInTheDocument();
        });

        it('should display activity timestamps', () => {
            renderWithRouter(<InstructorDashboard user={null} />);

            expect(screen.getByText('Today at 2:30 PM')).toBeInTheDocument();
            expect(screen.getByText('Today at 1:15 PM')).toBeInTheDocument();
            expect(screen.getByText('Yesterday')).toBeInTheDocument();
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
                expect(mockSignOut).toHaveBeenCalledTimes(1);
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

