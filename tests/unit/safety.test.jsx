import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Safety from '@/pages/safety';

describe('Safety Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the TECHGUIDE logo', () => {
        render(
            <BrowserRouter>
                <Safety />
            </BrowserRouter>
        );

        expect(screen.getByText('TECHGUIDE')).toBeInTheDocument();
    });

    it('should render navigation links', () => {
        render(
            <BrowserRouter>
                <Safety />
            </BrowserRouter>
        );

        expect(screen.getByText('TUTORIALS')).toBeInTheDocument();
        expect(screen.getByText('SAFETY')).toBeInTheDocument();
        expect(screen.getByText('SUPPORT')).toBeInTheDocument();
        expect(screen.getByText('ABOUT')).toBeInTheDocument();
    });

    it('should have correct href attributes for navigation links', () => {
        render(
            <BrowserRouter>
                <Safety />
            </BrowserRouter>
        );

        const tutorialsLink = screen.getByText('TUTORIALS').closest('a');
        const safetyLink = screen.getByText('SAFETY').closest('a');
        const supportLink = screen.getByText('SUPPORT').closest('a');
        const aboutLink = screen.getByText('ABOUT').closest('a');

        expect(tutorialsLink).toHaveAttribute('href', '/tutorials');
        expect(safetyLink).toHaveAttribute('href', '/safety');
        expect(supportLink).toHaveAttribute('href', '/support');
        expect(aboutLink).toHaveAttribute('href', '/about');
    });

    it('should render the GET STARTED button', () => {
        render(
            <BrowserRouter>
                <Safety />
            </BrowserRouter>
        );

        expect(screen.getByText('GET STARTED')).toBeInTheDocument();
    });

    it('should have GET STARTED link pointing to signup', () => {
        render(
            <BrowserRouter>
                <Safety />
            </BrowserRouter>
        );

        const getStartedLink = screen.getByText('GET STARTED').closest('a');
        expect(getStartedLink).toHaveAttribute('href', '/signup');
    });

    it('should toggle phone number visibility when phone button is clicked', async () => {
        const user = userEvent.setup();
        render(
            <BrowserRouter>
                <Safety />
            </BrowserRouter>
        );

        // Phone number element exists but should be hidden initially (opacity-0)
        const phoneNumberContainer = screen.getByText('(123) 456-7890').closest('div');
        expect(phoneNumberContainer).toHaveClass('opacity-0');
        expect(phoneNumberContainer).toHaveClass('max-w-0');

        // Find and click the phone button
        const phoneButtons = screen.getAllByRole('button');
        const phoneButton = phoneButtons.find(button =>
            button.querySelector('svg') !== null
        );

        if (phoneButton) {
            await user.click(phoneButton);

            // Phone number should now be visible (opacity-100)
            expect(phoneNumberContainer).toHaveClass('opacity-100');
            expect(phoneNumberContainer).toHaveClass('max-w-xs');

            // Click again to hide
            await user.click(phoneButton);

            // Phone number should be hidden again
            expect(phoneNumberContainer).toHaveClass('opacity-0');
            expect(phoneNumberContainer).toHaveClass('max-w-0');
        }
    });

    it('should render breadcrumb navigation', () => {
        render(
            <BrowserRouter>
                <Safety />
            </BrowserRouter>
        );

        expect(screen.getByText('Home')).toBeInTheDocument();
        // Safety Alert Center appears in both breadcrumb and main heading
        const safetyAlertTexts = screen.getAllByText('Safety Alert Center');
        expect(safetyAlertTexts.length).toBeGreaterThanOrEqual(1);
    });

    it('should have breadcrumb home link pointing to root', () => {
        render(
            <BrowserRouter>
                <Safety />
            </BrowserRouter>
        );

        const homeLink = screen.getByText('Home').closest('a');
        expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should render main heading', () => {
        render(
            <BrowserRouter>
                <Safety />
            </BrowserRouter>
        );

        const headings = screen.getAllByText('Safety Alert Center');
        expect(headings.length).toBeGreaterThan(0);
    });

    it('should render description text', () => {
        render(
            <BrowserRouter>
                <Safety />
            </BrowserRouter>
        );

        expect(screen.getByText(/Stay informed about the latest online scams/i)).toBeInTheDocument();
    });

    it('should render all safety alerts', () => {
        render(
            <BrowserRouter>
                <Safety />
            </BrowserRouter>
        );

        expect(screen.getByText('IRS Phone Scam Warning')).toBeInTheDocument();
        expect(screen.getByText('Fake Tech Support Pop-ups')).toBeInTheDocument();
        expect(screen.getByText('Email Password Reset Scams')).toBeInTheDocument();
    });

    it('should render alert dates', () => {
        render(
            <BrowserRouter>
                <Safety />
            </BrowserRouter>
        );

        expect(screen.getByText('Published: Today')).toBeInTheDocument();
        expect(screen.getByText('Published: 3 Days Ago')).toBeInTheDocument();
        expect(screen.getByText('Published: Last Week')).toBeInTheDocument();
    });

    it('should render alert summaries', () => {
        render(
            <BrowserRouter>
                <Safety />
            </BrowserRouter>
        );

        expect(screen.getByText(/The IRS will never call to demand immediate payment/i)).toBeInTheDocument();
        expect(screen.getByText(/Never give remote access to your computer/i)).toBeInTheDocument();
        expect(screen.getByText(/Be suspicious of 'password reset' emails/i)).toBeInTheDocument();
    });

    it('should render "Read Full Alert" buttons for each alert', () => {
        render(
            <BrowserRouter>
                <Safety />
            </BrowserRouter>
        );

        const readFullAlertButtons = screen.getAllByText('Read Full Alert');
        expect(readFullAlertButtons.length).toBe(3);
    });

    it('should render additional safety resources section', () => {
        render(
            <BrowserRouter>
                <Safety />
            </BrowserRouter>
        );

        expect(screen.getByText('Additional Safety Resources')).toBeInTheDocument();
    });

    it('should render all resource cards', () => {
        render(
            <BrowserRouter>
                <Safety />
            </BrowserRouter>
        );

        expect(screen.getByText('Internet Security Guide')).toBeInTheDocument();
        expect(screen.getByText('Phishing Prevention')).toBeInTheDocument();
        expect(screen.getByText('Report a Scam')).toBeInTheDocument();
    });

    it('should render resource card descriptions', () => {
        render(
            <BrowserRouter>
                <Safety />
            </BrowserRouter>
        );

        expect(screen.getByText(/Step-by-step guide to securing your home network/i)).toBeInTheDocument();
        expect(screen.getByText(/Learn to spot malicious emails and deceptive websites/i)).toBeInTheDocument();
        expect(screen.getByText(/Official links and numbers to report fraud/i)).toBeInTheDocument();
    });

    it('should render "View Resource" buttons for each resource card', () => {
        render(
            <BrowserRouter>
                <Safety />
            </BrowserRouter>
        );

        const viewResourceButtons = screen.getAllByText('View Resource');
        expect(viewResourceButtons.length).toBe(3);
    });

    it('should have logo link pointing to home', () => {
        render(
            <BrowserRouter>
                <Safety />
            </BrowserRouter>
        );

        const logoLink = screen.getByText('TECHGUIDE').closest('a');
        expect(logoLink).toHaveAttribute('href', '/');
    });

    it('should render alerts with proper structure and styling classes', () => {
        render(
            <BrowserRouter>
                <Safety />
            </BrowserRouter>
        );

        const alertCards = screen.getAllByText(/IRS Phone Scam Warning|Fake Tech Support Pop-ups|Email Password Reset Scams/);
        expect(alertCards.length).toBe(3);

        // Check that alert cards have the expected parent structure
        // The title (h2) is inside a flex div, which is inside the card container
        alertCards.forEach(card => {
            // Traverse up to find the card container (parent of parent)
            const flexContainer = card.closest('div');
            const cardContainer = flexContainer?.parentElement;
            expect(cardContainer).toBeInTheDocument();
            expect(cardContainer).toHaveClass('bg-white');
            expect(cardContainer).toHaveClass('rounded-3xl');
        });
    });

    it('should render AlertTriangle icon', () => {
        render(
            <BrowserRouter>
                <Safety />
            </BrowserRouter>
        );

        // The AlertTriangle icon should be present in the heading area
        // Find the main heading (the larger one) and check for icon nearby
        const headings = screen.getAllByText('Safety Alert Center');
        const mainHeading = headings.find(heading =>
            heading.className.includes('text-4xl') || heading.className.includes('text-5xl')
        );
        expect(mainHeading).toBeInTheDocument();

        // Check that there's an icon in the same container
        const headingContainer = mainHeading.closest('div');
        const svgIcons = headingContainer?.querySelectorAll('svg');
        expect(svgIcons?.length).toBeGreaterThan(0);
    });
});

