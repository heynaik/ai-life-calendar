/**
 * Life Calendar Renderer
 * Visualizes life in weeks (52 columns × years rows)
 */

import { getDevice } from '../utils/devices.js';

/**
 * Calculate weeks lived from birth date
 * @param {Date} birthDate - Birth date
 * @returns {number} Weeks lived
 */
function getWeeksLived(birthDate) {
    const now = new Date();
    const diffMs = now - birthDate;
    const oneWeekMs = 1000 * 60 * 60 * 24 * 7;
    return Math.floor(diffMs / oneWeekMs);
}

/**
 * Render life calendar to canvas
 * @param {HTMLCanvasElement} canvas - Target canvas element
 * @param {Object} options - Rendering options
 */
export function renderLifeCalendar(canvas, options = {}) {
    const {
        deviceId = 'iphone15',
        birthDate = new Date(1990, 0, 1),
        lifeExpectancy = 80,
        accentColor = '#ff6b6b',
        backgroundColor = '#000000',
        filledColor = '#ffffff',
        emptyColor = '#222222',
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
    const cols = 52; // Weeks per year
    const rows = lifeExpectancy; // Years
    const totalWeeks = cols * rows;
    const weeksLived = getWeeksLived(birthDate);
    const currentWeekInLife = Math.min(weeksLived, totalWeeks);

    // Calculate safe area
    const safeTop = canvas.height * device.safeAreaTop;
    const safeBottom = canvas.height * device.safeAreaBottom;
    const availableHeight = canvas.height - safeTop - safeBottom;

    // Calculate block size and spacing
    const padding = canvas.width * 0.05;
    const gridWidth = canvas.width - (padding * 2);
    const gridHeight = availableHeight * 0.7;

    const blockWidth = (gridWidth / cols) * 0.85;
    const blockHeight = (gridHeight / rows) * 0.85;
    const spacingX = gridWidth / cols;
    const spacingY = gridHeight / rows;

    // Center grid
    const startX = padding;
    const startY = safeTop + (availableHeight - gridHeight) / 2.5;

    // Draw blocks
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const weekNum = row * cols + col;
            const x = startX + col * spacingX;
            const y = startY + row * spacingY;

            if (weekNum < currentWeekInLife) {
                // Weeks lived - filled
                ctx.fillStyle = filledColor;
                ctx.fillRect(x, y, blockWidth, blockHeight);
            } else if (weekNum === currentWeekInLife) {
                // Current week - accent color with glow
                ctx.fillStyle = accentColor;
                ctx.shadowColor = accentColor;
                ctx.shadowBlur = 10;
                ctx.fillRect(x, y, blockWidth, blockHeight);
                ctx.shadowBlur = 0;
            } else {
                // Future weeks - empty
                ctx.fillStyle = emptyColor;
                ctx.fillRect(x, y, blockWidth, blockHeight);
            }
        }
    }

    // Calculate age
    const now = new Date();
    const ageYears = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24 * 365.25));
    const weeksRemaining = totalWeeks - currentWeekInLife;

    // Draw labels
    const labelY = startY + gridHeight + canvas.height * 0.05;

    ctx.fillStyle = filledColor;
    ctx.font = `bold ${canvas.width * 0.055}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`${ageYears} years lived`, canvas.width / 2, labelY);

    ctx.font = `${canvas.width * 0.032}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = '#888888';
    ctx.fillText(`${weeksRemaining.toLocaleString()} weeks remain`, canvas.width / 2, labelY + canvas.height * 0.04);

    // Progress percentage
    const progressPercent = ((currentWeekInLife / totalWeeks) * 100).toFixed(1);
    ctx.fillText(`${progressPercent}% of ${lifeExpectancy} years`, canvas.width / 2, labelY + canvas.height * 0.07);

    return canvas;
}

/**
 * Get life calendar statistics
 * @param {Date} birthDate - Birth date
 * @param {number} lifeExpectancy - Expected lifespan in years
 * @returns {Object} Stats object
 */
export function getLifeStats(birthDate, lifeExpectancy = 80) {
    const now = new Date();
    const weeksLived = getWeeksLived(birthDate);
    const totalWeeks = 52 * lifeExpectancy;
    const weeksRemaining = Math.max(0, totalWeeks - weeksLived);
    const ageYears = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24 * 365.25));
    const progressPercent = ((weeksLived / totalWeeks) * 100).toFixed(1);

    return {
        ageYears,
        weeksLived,
        weeksRemaining,
        totalWeeks,
        progressPercent,
        lifeExpectancy
    };
}
