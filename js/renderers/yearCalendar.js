/**
 * Year Calendar Renderer
 * Visualizes 365/366 dots representing each day of the year
 */

import { getDevice } from '../utils/devices.js';

/**
 * Check if year is a leap year
 * @param {number} year - Year to check
 * @returns {boolean}
 */
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Get day of year (1-365 or 1-366)
 * @param {Date} date - Date to calculate
 * @returns {number}
 */
function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

/**
 * Render year calendar to canvas
 * @param {HTMLCanvasElement} canvas - Target canvas element
 * @param {Object} options - Rendering options
 */
export function renderYearCalendar(canvas, options = {}) {
    const {
        deviceId = 'iphone15',
        accentColor = '#ff6b6b',
        backgroundColor = '#000000',
        dotColor = '#ffffff',
        emptyDotColor = '#333333',
        customWidth,
        customHeight
    } = options;

    const device = getDevice(deviceId);
    const ctx = canvas.getContext('2d');

    // Use custom dimensions if provided, otherwise use device preset
    canvas.width = customWidth || device.width;
    canvas.height = customHeight || device.height;

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate grid parameters
    const now = new Date();
    const year = now.getFullYear();
    const totalDays = isLeapYear(year) ? 366 : 365;
    const currentDay = getDayOfYear(now);

    // Grid layout: 20 columns
    const cols = 20;
    const rows = Math.ceil(totalDays / cols);

    // Calculate safe area
    const safeTop = canvas.height * device.safeAreaTop;
    const safeBottom = canvas.height * device.safeAreaBottom;
    const availableHeight = canvas.height - safeTop - safeBottom;

    // Calculate dot size and spacing
    const padding = canvas.width * 0.08;
    const gridWidth = canvas.width - (padding * 2);
    const gridHeight = availableHeight * 0.6;

    const dotSpacingX = gridWidth / cols;
    const dotSpacingY = gridHeight / rows;
    const dotRadius = Math.min(dotSpacingX, dotSpacingY) * 0.35;

    // Center grid vertically in available space
    const startX = padding + dotSpacingX / 2;
    const startY = safeTop + (availableHeight - gridHeight) / 2 + dotSpacingY / 2;

    // Draw dots
    for (let i = 0; i < totalDays; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * dotSpacingX;
        const y = startY + row * dotSpacingY;
        const dayNum = i + 1;

        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);

        if (dayNum < currentDay) {
            // Past days - filled
            ctx.fillStyle = dotColor;
            ctx.fill();
        } else if (dayNum === currentDay) {
            // Current day - accent color
            ctx.fillStyle = accentColor;
            ctx.fill();
            // Add glow effect
            ctx.shadowColor = accentColor;
            ctx.shadowBlur = dotRadius * 2;
            ctx.fill();
            ctx.shadowBlur = 0;
        } else {
            // Future days - empty outline
            ctx.strokeStyle = emptyDotColor;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    // Draw year label
    ctx.fillStyle = dotColor;
    ctx.font = `bold ${canvas.width * 0.06}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(year.toString(), canvas.width / 2, startY + gridHeight + canvas.height * 0.08);

    // Draw progress text
    const progressPercent = ((currentDay / totalDays) * 100).toFixed(1);
    ctx.font = `${canvas.width * 0.035}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = '#888888';
    ctx.fillText(`${progressPercent}% of ${year} complete`, canvas.width / 2, startY + gridHeight + canvas.height * 0.12);

    return canvas;
}

/**
 * Get year calendar statistics
 * @returns {Object} Stats object
 */
export function getYearStats() {
    const now = new Date();
    const year = now.getFullYear();
    const totalDays = isLeapYear(year) ? 366 : 365;
    const currentDay = getDayOfYear(now);
    const remainingDays = totalDays - currentDay;
    const progressPercent = ((currentDay / totalDays) * 100).toFixed(1);

    return {
        year,
        totalDays,
        currentDay,
        remainingDays,
        progressPercent
    };
}
