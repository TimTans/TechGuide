export const getColorClasses = (color) => {
    const colorClasses = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-600', progress: 'bg-blue-500' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600', progress: 'bg-purple-500' },
        pink: { bg: 'bg-pink-100', text: 'text-pink-600', progress: 'bg-pink-500' },
        emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', progress: 'bg-emerald-500' },
        orange: { bg: 'bg-orange-100', text: 'text-orange-600', progress: 'bg-orange-500' },
        indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', progress: 'bg-indigo-500' },
        red: { bg: 'bg-red-100', text: 'text-red-600', progress: 'bg-red-500' },
        violet: { bg: 'bg-violet-100', text: 'text-violet-600', progress: 'bg-violet-500' },
        rose: { bg: 'bg-rose-100', text: 'text-rose-600', progress: 'bg-rose-500' },
        sky: { bg: 'bg-sky-100', text: 'text-sky-600', progress: 'bg-sky-500' },
        teal: { bg: 'bg-teal-100', text: 'text-teal-600', progress: 'bg-teal-500' },
        cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', progress: 'bg-cyan-500' }
    };
    return colorClasses[color] || colorClasses.blue;
};
