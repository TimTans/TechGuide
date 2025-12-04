import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Tutorials from '@/pages/tutorials';

describe('Tutorials Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the TECHGUIDE logo', () => {
        render(
            <BrowserRouter>
                <Tutorials />
            </BrowserRouter>
        );

        expect(screen.getByText('TECHGUIDE')).toBeInTheDocument();
    });

    it('should render navigation links', () => {
        render(
            <BrowserRouter>
                <Tutorials />
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
                <Tutorials />
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
                <Tutorials />
            </BrowserRouter>
        );

        expect(screen.getByText('GET STARTED')).toBeInTheDocument();
    });

    it('should have GET STARTED link pointing to signup', () => {
        render(
            <BrowserRouter>
                <Tutorials />
            </BrowserRouter>
        );

        const getStartedLink = screen.getByText('GET STARTED').closest('a');
        expect(getStartedLink).toHaveAttribute('href', '/signup');
    });

    it('should toggle phone number visibility when phone button is clicked', async () => {
        const user = userEvent.setup();
        render(
            <BrowserRouter>
                <Tutorials />
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
                <Tutorials />
            </BrowserRouter>
        );

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Tutorials')).toBeInTheDocument();
    });

    it('should have breadcrumb home link pointing to root', () => {
        render(
            <BrowserRouter>
                <Tutorials />
            </BrowserRouter>
        );

        const homeLink = screen.getByText('Home').closest('a');
        expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should render main heading', () => {
        render(
            <BrowserRouter>
                <Tutorials />
            </BrowserRouter>
        );

        expect(screen.getByText('Learn with TechGuide')).toBeInTheDocument();
    });

    it('should render description text', () => {
        render(
            <BrowserRouter>
                <Tutorials />
            </BrowserRouter>
        );

        expect(screen.getByText(/TechGuide is a platform designed to help beginners/i)).toBeInTheDocument();
    });

    it('should render topic bubble', () => {
        render(
            <BrowserRouter>
                <Tutorials />
            </BrowserRouter>
        );

        expect(screen.getByText(/These videos will help you learn basic digital skills/i)).toBeInTheDocument();
    });

    it('should render all video cards', () => {
        render(
            <BrowserRouter>
                <Tutorials />
            </BrowserRouter>
        );

        // Check for video titles
        expect(screen.getByText('Computer Basics: Setting Up a Desktop Computer')).toBeInTheDocument();
        expect(screen.getByText('Create a Gmail Account')).toBeInTheDocument();
        expect(screen.getByText('How to Send an Email through Gmail')).toBeInTheDocument();
        expect(screen.getByText('Protect Your Computer')).toBeInTheDocument();
        expect(screen.getByText('How to spot Dangerous emails')).toBeInTheDocument();
    });

    it('should have correct YouTube links for videos', () => {
        render(
            <BrowserRouter>
                <Tutorials />
            </BrowserRouter>
        );

        // Video 1: Computer Basics
        const video1 = screen.getByText('Computer Basics: Setting Up a Desktop Computer').closest('a');
        expect(video1).toHaveAttribute('href', 'https://www.youtube.com/watch?v=RnM3u99xIf4&list=PL7096007028FAA3F6&index=7');
        expect(video1).toHaveAttribute('target', '_blank');

        // Video 2: Create Gmail Account
        const video2 = screen.getByText('Create a Gmail Account').closest('a');
        expect(video2).toHaveAttribute('href', 'https://www.youtube.com/watch?v=7rcG8iapnhk');
        expect(video2).toHaveAttribute('target', '_blank');

        // Video 3: Send Email
        const video3 = screen.getByText('How to Send an Email through Gmail').closest('a');
        expect(video3).toHaveAttribute('href', 'https://www.youtube.com/watch?v=_FNJm4xzZCw');
        expect(video3).toHaveAttribute('target', '_blank');

        // Video 4: Protect Computer
        const video4 = screen.getByText('Protect Your Computer').closest('a');
        expect(video4).toHaveAttribute('href', 'https://www.youtube.com/watch?v=6mMZFoXbKqI&list=PL7096007028FAA3F6&index=11');
        expect(video4).toHaveAttribute('target', '_blank');

        // Video 5: Dangerous Emails
        const video5 = screen.getByText('How to spot Dangerous emails').closest('a');
        expect(video5).toHaveAttribute('href', 'https://www.youtube.com/watch?v=NI37JI7KnSc&list=PL7096007028FAA3F6&index=16');
        expect(video5).toHaveAttribute('target', '_blank');
    });

    it('should render video descriptions', () => {
        render(
            <BrowserRouter>
                <Tutorials />
            </BrowserRouter>
        );

        expect(screen.getByText(/Perfect for learning how to set up an area in your home/i)).toBeInTheDocument();
        expect(screen.getByText(/Learn how to create a gmail account so you can email/i)).toBeInTheDocument();
        expect(screen.getByText(/Learn how to stay in touch with your familty and friends/i)).toBeInTheDocument();
        expect(screen.getByText(/Learn how to keep your computer safe from hackers/i)).toBeInTheDocument();
        expect(screen.getByText(/Learn how to stay safe online by spotting phishing/i)).toBeInTheDocument();
    });

    it('should render video images', () => {
        render(
            <BrowserRouter>
                <Tutorials />
            </BrowserRouter>
        );

        const images = screen.getAllByRole('img');
        expect(images.length).toBeGreaterThan(0);

        // Check for specific alt texts
        expect(screen.getByAltText('Intro to Computers')).toBeInTheDocument();
        expect(screen.getByAltText('Create Gmail Account')).toBeInTheDocument();
        expect(screen.getByAltText('Send an Email')).toBeInTheDocument();

        // There are two images with "Protecting Your Computer" alt text, so use getAllByAltText
        const protectingImages = screen.getAllByAltText('Protecting Your Computer');
        expect(protectingImages.length).toBeGreaterThanOrEqual(1);
    });

    it('should render footer with copyright', () => {
        render(
            <BrowserRouter>
                <Tutorials />
            </BrowserRouter>
        );

        const currentYear = new Date().getFullYear();
        expect(screen.getByText(`© ${currentYear} TechGuide. All rights reserved.`)).toBeInTheDocument();
    });

    it('should have logo link pointing to home', () => {
        render(
            <BrowserRouter>
                <Tutorials />
            </BrowserRouter>
        );

        const logoLink = screen.getByText('TECHGUIDE').closest('a');
        expect(logoLink).toHaveAttribute('href', '/');
    });

    it('should render all video cards with proper structure', () => {
        render(
            <BrowserRouter>
                <Tutorials />
            </BrowserRouter>
        );

        // All video links should have the proper classes for styling
        const videoLinks = screen.getAllByRole('link').filter(link =>
            link.getAttribute('href')?.includes('youtube.com')
        );

        expect(videoLinks.length).toBe(5);

        videoLinks.forEach(link => {
            expect(link).toHaveAttribute('target', '_blank');
            expect(link.className).toContain('min-w-[260px]');
        });
    });
});

