import { Mail, Video, MessageCircle, ShoppingCart, Phone, Globe, Wifi, Shield } from "lucide-react";

// Icon mapping for database icon names
export const iconMap = {
    Mail,
    Video,
    MessageCircle,
    ShoppingCart,
    Phone,
    Globe,
    Wifi,
    Shield
};

// Helper function to format duration from minutes to readable format
export const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours}h ${mins}m`;
};

// Helper function to get icon and color based on title or category
export const getCourseMetadata = (title, categoryId) => {
    const titleLower = title?.toLowerCase() || '';

    // Determine icon based on title keywords
    let icon = Mail;
    let color = 'blue';

    if (titleLower.includes('email') || titleLower.includes('gmail')) {
        icon = Mail;
        color = 'blue';
    } else if (titleLower.includes('video') || titleLower.includes('call') || titleLower.includes('zoom')) {
        icon = Video;
        color = 'purple';
    } else if (titleLower.includes('social') || titleLower.includes('facebook') || titleLower.includes('instagram')) {
        icon = MessageCircle;
        color = 'pink';
    } else if (titleLower.includes('shop') || titleLower.includes('amazon') || titleLower.includes('ebay')) {
        icon = ShoppingCart;
        color = 'emerald';
    } else if (titleLower.includes('phone') || titleLower.includes('smartphone')) {
        icon = Phone;
        color = 'orange';
    } else if (titleLower.includes('brows') || titleLower.includes('internet') || titleLower.includes('web')) {
        icon = Globe;
        color = 'indigo';
    } else if (titleLower.includes('wifi') || titleLower.includes('connect')) {
        icon = Wifi;
        color = 'cyan';
    } else if (titleLower.includes('safety') || titleLower.includes('scam') || titleLower.includes('fraud') || titleLower.includes('protect')) {
        icon = Shield;
        color = 'red';
    }

    return { icon, color };
};

// Color utility functions
export const getColorClasses = (color) => {
    const colorMap = {
        blue: {
            bg: 'bg-blue-100',
            text: 'text-blue-600',
            progress: 'bg-blue-500'
        },
        purple: {
            bg: 'bg-purple-100',
            text: 'text-purple-600',
            progress: 'bg-purple-500'
        },
        pink: {
            bg: 'bg-pink-100',
            text: 'text-pink-600',
            progress: 'bg-pink-500'
        },
        emerald: {
            bg: 'bg-emerald-100',
            text: 'text-emerald-600',
            progress: 'bg-emerald-500'
        },
        orange: {
            bg: 'bg-orange-100',
            text: 'text-orange-600',
            progress: 'bg-orange-500'
        },
        indigo: {
            bg: 'bg-indigo-100',
            text: 'text-indigo-600',
            progress: 'bg-indigo-500'
        },
        cyan: {
            bg: 'bg-cyan-100',
            text: 'text-cyan-600',
            progress: 'bg-cyan-500'
        },
        red: {
            bg: 'bg-red-100',
            text: 'text-red-600',
            progress: 'bg-red-500'
        }
    };

    return colorMap[color] || colorMap.blue;
};

export const getDifficultyBadgeClasses = (difficulty) => {
    const difficultyLower = (difficulty || 'Beginner').toLowerCase();
    if (difficultyLower === 'beginner') {
        return 'bg-green-100 text-green-700';
    } else if (difficultyLower === 'intermediate') {
        return 'bg-amber-100 text-amber-700';
    } else {
        return 'bg-red-100 text-red-700';
    }
};

