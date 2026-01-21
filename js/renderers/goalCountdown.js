/**
 * Goal Countdown Renderer
 * Visualizes countdown to a specific future date
 */

import { getDevice } from '../utils/devices.js';

/**
 * Calculate days between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {number} Days between
 */
function daysBetween(startDate, endDate) {
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.ceil((endDate - startDate) / oneDay);
}

/**
 * Render goal countdown to canvas
 * @param {HTMLCanvasElement} canvas - Target canvas element
 * @param {Object} options - Rendering options
 */
export function renderGoalCountdown(canvas, options = {}) {
    const {
        deviceId = 'iphone15',
        targetDate = new Date(new Date().getFullYear(), 11, 31), // Default: end of year
        goalTitle = 'Goal',
        startDate = null, // If null, calculates from beginning of year
        accentColor = '#ff6b6b',
        backgroundColor = '#000000',
        progressColor = '#ffffff',
        emptyColor = '#333333',
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

    // Calculate dates
    const now = new Date();
    const start = startDate || new Date(now.getFullYear(), 0, 1);
    const target = new Date(targetDate);

    const totalDays = daysBetween(start, target);
    const daysElapsed = daysBetween(start, now);
    const daysRemaining = daysBetween(now, target);
    const progress = Math.min(1, Math.max(0, daysElapsed / totalDays));

    // Calculate safe area
    const safeTop = canvas.height * device.safeAreaTop;
    const safeBottom = canvas.height * device.safeAreaBottom;
    const availableHeight = canvas.height - safeTop - safeBottom;

    // Center content
    const centerY = safeTop + availableHeight / 2;
    const padding = canvas.width * 0.1;

    // Draw large countdown number
    ctx.fillStyle = progressColor;
    ctx.font = `bold ${canvas.width * 0.25}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const displayDays = Math.max(0, daysRemaining);
    ctx.fillText(displayDays.toString(), canvas.width / 2, centerY - canvas.height * 0.08);

    // Draw "days" label
    ctx.font = `${canvas.width * 0.05}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = '#888888';
    ctx.fillText(displayDays === 1 ? 'day remaining' : 'days remaining', canvas.width / 2, centerY + canvas.height * 0.02);

    // Draw progress bar
    const barWidth = canvas.width - (padding * 2);
    const barHeight = canvas.width * 0.025;
    const barY = centerY + canvas.height * 0.08;
    const barX = padding;
    const borderRadius = barHeight / 2;

    // Background bar
    ctx.fillStyle = emptyColor;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barWidth, barHeight, borderRadius);
    ctx.fill();

    // Progress bar
    const progressWidth = barWidth * progress;
    if (progressWidth > 0) {
        // Gradient for progress
        const gradient = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
        gradient.addColorStop(0, accentColor);
        gradient.addColorStop(1, progressColor);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(barX, barY, progressWidth, barHeight, borderRadius);
        ctx.fill();
    }

    // Draw goal title
    ctx.fillStyle = progressColor;
    ctx.font = `bold ${canvas.width * 0.045}px Inter, system-ui, sans-serif`;
    ctx.fillText(goalTitle, canvas.width / 2, barY + canvas.height * 0.07);

    // Draw target date
    const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = target.toLocaleDateString('en-US', dateOptions);
    ctx.font = `${canvas.width * 0.032}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = '#888888';
    ctx.fillText(formattedDate, canvas.width / 2, barY + canvas.height * 0.10);

    // Draw progress percentage
    const progressPercent = (progress * 100).toFixed(1);
    ctx.fillText(`${progressPercent}% complete`, canvas.width / 2, barY + canvas.height * 0.13);

    return canvas;
}

/**
 * Get goal countdown statistics
 * @param {Date} targetDate - Goal target date
 * @param {Date} startDate - Optional start date
 * @returns {Object} Stats object
 */
export function getGoalStats(targetDate, startDate = null) {
    const now = new Date();
    const start = startDate || new Date(now.getFullYear(), 0, 1);
    const target = new Date(targetDate);

    const totalDays = daysBetween(start, target);
    const daysElapsed = daysBetween(start, now);
    const daysRemaining = Math.max(0, daysBetween(now, target));
    const progress = Math.min(1, Math.max(0, daysElapsed / totalDays));
    const progressPercent = (progress * 100).toFixed(1);

    return {
        totalDays,
        daysElapsed,
        daysRemaining,
        progress,
        progressPercent,
        targetDate: target,
        isComplete: daysRemaining <= 0
    };
}
