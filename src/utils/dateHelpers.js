/**
 * Convert a date/timestamp to Eastern Time Zone and return as YYYY-MM-DD string
 * @param {Date|string} dateInput - Date object or ISO string
 * @returns {string} Date string in YYYY-MM-DD format in Eastern time zone
 */
export const toEasternDateString = (dateInput) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    // Format date in Eastern time zone (America/New_York)
    // This automatically handles EST/EDT transitions
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const parts = formatter.formatToParts(date);
    const year = parts.find(p => p.type === 'year').value;
    const month = parts.find(p => p.type === 'month').value;
    const day = parts.find(p => p.type === 'day').value;

    return `${year}-${month}-${day}`;
};

/**
 * Get today's date in Eastern Time Zone as YYYY-MM-DD string
 * @returns {string} Today's date in YYYY-MM-DD format in Eastern time zone
 */
export const getTodayEastern = () => {
    return toEasternDateString(new Date());
};

/**
 * Get yesterday's date in Eastern Time Zone as YYYY-MM-DD string
 * @returns {string} Yesterday's date in YYYY-MM-DD format in Eastern time zone
 */
export const getYesterdayEastern = () => {
    return getDateEastern(1);
};

/**
 * Get a date N days ago in Eastern Time Zone
 * @param {number} daysAgo - Number of days to go back (0 = today)
 * @returns {string} Date string in YYYY-MM-DD format in Eastern time zone
 */
export const getDateEastern = (daysAgo = 0) => {
    if (daysAgo === 0) {
        return getTodayEastern();
    }

    // Get today's date in Eastern time zone
    const todayStr = getTodayEastern();
    const [year, month, day] = todayStr.split('-').map(Number);

    // Create a date object representing noon on this date in UTC
    // Then we'll format it in Eastern time, which handles DST correctly
    // We use UTC to avoid local timezone interference
    const dateObj = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    dateObj.setUTCDate(dateObj.getUTCDate() - daysAgo);

    // Format the result back to Eastern time zone string
    // This ensures we get the correct date even across DST boundaries
    return toEasternDateString(dateObj);
};

/**
 * Get the day of week (0-6, where 0 is Sunday) for a date in Eastern Time Zone
 * @param {number} daysAgo - Number of days to go back (0 = today)
 * @returns {number} Day of week (0 = Sunday, 6 = Saturday)
 */
export const getDayOfWeekEastern = (daysAgo = 0) => {
    const dateStr = getDateEastern(daysAgo);
    const [year, month, day] = dateStr.split('-');

    // Create a date object representing this date at noon Eastern time
    // Using noon avoids DST transition issues
    const date = new Date(`${year}-${month}-${day}T12:00:00-05:00`);

    // Get day of week in Eastern time zone
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        weekday: 'short'
    });

    // Convert weekday name to number
    const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekdayName = formatter.format(date);
    return weekdayNames.indexOf(weekdayName);
};
