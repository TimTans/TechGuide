import {
    Mail, Video, MessageCircle, ShoppingCart, Phone, Globe, Wifi, Shield,
    ClipboardList, Film, Heart, MapPin
} from "lucide-react";

// Icon mapping for database icon names
export const iconMap = {
    Mail,
    Video,
    MessageCircle,
    ShoppingCart,
    Phone,
    Globe,
    Wifi,
    Shield,
    ClipboardList,
    Film,
    Heart,
    MapPin
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

// Category to icon and color mapping
// category_id: { icon, color }
const categoryMetadata = {
    1: { icon: Mail, color: 'blue' },        // Communication
    2: { icon: MessageCircle, color: 'pink' }, // Social Media
    3: { icon: ShoppingCart, color: 'emerald' }, // Online Shopping & Commerce
    4: { icon: Phone, color: 'orange' },      // Device Basics
    5: { icon: Globe, color: 'indigo' },      // Internet & Connectivity
    6: { icon: Shield, color: 'red' },        // Safety & Security
    7: { icon: Film, color: 'violet' },        // Entertainment & Media
    8: { icon: Heart, color: 'rose' },        // Health & Wellness
    9: { icon: MapPin, color: 'sky' },        // Travel & Navigation
    10: { icon: ClipboardList, color: 'teal' } // Productivity
};

// Helper function to get icon and color based on title or category
export const getCourseMetadata = (title, categoryId) => {
    // First, check if we have category-specific metadata
    if (categoryId && categoryMetadata[categoryId]) {
        const categoryMeta = categoryMetadata[categoryId];
        // Still check title for more specific matches, but use category as fallback
        const titleLower = title?.toLowerCase() || '';

        // Override with title-based matches if found
        if (titleLower.includes('email') || titleLower.includes('gmail')) {
            return { icon: Mail, color: 'blue' };
        } else if (titleLower.includes('video') || titleLower.includes('call') || titleLower.includes('zoom')) {
            return { icon: Video, color: 'purple' };
        } else if (titleLower.includes('social') || titleLower.includes('facebook') || titleLower.includes('instagram')) {
            return { icon: MessageCircle, color: 'pink' };
        } else if (titleLower.includes('shop') || titleLower.includes('amazon') || titleLower.includes('ebay')) {
            return { icon: ShoppingCart, color: 'emerald' };
        } else if (titleLower.includes('phone') || titleLower.includes('smartphone')) {
            return { icon: Phone, color: 'orange' };
        } else if (titleLower.includes('brows') || titleLower.includes('internet') || titleLower.includes('web')) {
            return { icon: Globe, color: 'indigo' };
        } else if (titleLower.includes('wifi') || titleLower.includes('connect')) {
            return { icon: Wifi, color: 'cyan' };
        } else if (titleLower.includes('safety') || titleLower.includes('scam') || titleLower.includes('fraud') || titleLower.includes('protect')) {
            return { icon: Shield, color: 'red' };
        }

        // Return category-based metadata
        return categoryMeta;
    }

    // Fallback: determine icon based on title keywords only
    const titleLower = title?.toLowerCase() || '';
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

// Helper function to get category icon and color directly
export const getCategoryMetadata = (categoryId) => {
    if (categoryId && categoryMetadata[categoryId]) {
        return categoryMetadata[categoryId];
    }
    // Default fallback
    return { icon: Globe, color: 'indigo' };
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
        },
        violet: {
            bg: 'bg-violet-100',
            text: 'text-violet-600',
            progress: 'bg-violet-500'
        },
        rose: {
            bg: 'bg-rose-100',
            text: 'text-rose-600',
            progress: 'bg-rose-500'
        },
        sky: {
            bg: 'bg-sky-100',
            text: 'text-sky-600',
            progress: 'bg-sky-500'
        },
        teal: {
            bg: 'bg-teal-100',
            text: 'text-teal-600',
            progress: 'bg-teal-500'
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

