/**
 * AI Life Calendar - Main Application
 * Configuration wizard and rendering controller
 */

import { renderYearCalendar, getYearStats } from './renderers/yearCalendar.js';
import { renderLifeCalendar, getLifeStats } from './renderers/lifeCalendar.js';
import { renderGoalCountdown, getGoalStats } from './renderers/goalCountdown.js';
import { getDevice, getDeviceOptions } from './utils/devices.js';

// Application state
const state = {
    calendarType: 'year',
    deviceId: 'iphone15',
    accentColor: '#ff6b6b',
    // Life calendar specific
    birthDate: new Date(1990, 0, 1),
    lifeExpectancy: 80,
    // Goal countdown specific
    targetDate: new Date(new Date().getFullYear(), 11, 31),
    goalTitle: 'End of Year'
};

/**
 * Initialize the application
 */
function init() {
    setupEventListeners();
    populateDeviceSelector();
    updatePreview();
    updateStats();
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Calendar type buttons
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.calendarType = btn.dataset.type;
            updateOptionsVisibility();
            updatePreview();
            updateStats();
        });
    });

    // Device selector
    document.getElementById('deviceSelect')?.addEventListener('change', (e) => {
        state.deviceId = e.target.value;
        updatePreview();
    });

    // Accent color picker
    document.getElementById('accentColor')?.addEventListener('input', (e) => {
        state.accentColor = e.target.value;
        updateColorSwatches();
        updatePreview();
    });

    // Color swatches
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', () => {
            const color = swatch.dataset.color;
            if (color) {
                state.accentColor = color;
                document.getElementById('accentColor').value = color;
                updateColorSwatches();
                updatePreview();
            }
        });
    });

    // Birth date input
    document.getElementById('birthDate')?.addEventListener('change', (e) => {
        state.birthDate = new Date(e.target.value);
        updatePreview();
        updateStats();
    });

    // Life expectancy input
    document.getElementById('lifeExpectancy')?.addEventListener('change', (e) => {
        state.lifeExpectancy = parseInt(e.target.value) || 80;
        updatePreview();
        updateStats();
    });

    // Goal date input
    document.getElementById('goalDate')?.addEventListener('change', (e) => {
        state.targetDate = new Date(e.target.value);
        updatePreview();
        updateStats();
    });

    // Goal title input
    document.getElementById('goalTitle')?.addEventListener('input', (e) => {
        state.goalTitle = e.target.value || 'Goal';
        updatePreview();
    });

    // Download button
    document.getElementById('downloadBtn')?.addEventListener('click', downloadWallpaper);

    // Copy URL button
    document.getElementById('copyUrlBtn')?.addEventListener('click', copyDynamicUrl);
}

/**
 * Populate device selector dropdown
 */
function populateDeviceSelector() {
    const select = document.getElementById('deviceSelect');
    if (!select) return;

    const devices = getDeviceOptions();
    select.innerHTML = devices.map(device =>
        `<option value="${device.id}" ${device.id === state.deviceId ? 'selected' : ''}>
      ${device.name} (${device.dimensions})
    </option>`
    ).join('');
}

/**
 * Show/hide options based on calendar type
 */
function updateOptionsVisibility() {
    const lifeOptions = document.getElementById('lifeOptions');
    const goalOptions = document.getElementById('goalOptions');

    if (lifeOptions) {
        lifeOptions.style.display = state.calendarType === 'life' ? 'block' : 'none';
    }
    if (goalOptions) {
        goalOptions.style.display = state.calendarType === 'goal' ? 'block' : 'none';
    }
}

/**
 * Update color swatch active states
 */
function updateColorSwatches() {
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        const swatchColor = swatch.dataset.color?.toLowerCase();
        const currentColor = state.accentColor.toLowerCase();
        swatch.classList.toggle('active', swatchColor === currentColor);
    });
}

/**
 * Update the preview canvas
 */
function updatePreview() {
    const canvas = document.getElementById('previewCanvas');
    if (!canvas) return;

    const options = {
        deviceId: state.deviceId,
        accentColor: state.accentColor
    };

    switch (state.calendarType) {
        case 'year':
            renderYearCalendar(canvas, options);
            break;
        case 'life':
            renderLifeCalendar(canvas, {
                ...options,
                birthDate: state.birthDate,
                lifeExpectancy: state.lifeExpectancy
            });
            break;
        case 'goal':
            renderGoalCountdown(canvas, {
                ...options,
                targetDate: state.targetDate,
                goalTitle: state.goalTitle
            });
            break;
    }

    // Scale canvas for preview inside phone frame
    const phoneFrame = document.querySelector('.phone-frame');
    const container = document.querySelector('.preview-container');
    if (container && phoneFrame) {
        const maxHeight = Math.min(container.clientHeight - 60, 500);
        const scale = maxHeight / canvas.height;
        const scaledWidth = canvas.width * scale;
        const scaledHeight = canvas.height * scale;
        canvas.style.width = `${scaledWidth}px`;
        canvas.style.height = `${scaledHeight}px`;
    } else if (container) {
        const maxHeight = container.clientHeight - 40;
        const scale = maxHeight / canvas.height;
        canvas.style.width = `${canvas.width * scale}px`;
        canvas.style.height = `${canvas.height * scale}px`;
    }
}

/**
 * Update statistics display
 */
function updateStats() {
    const statsContainer = document.getElementById('stats');
    if (!statsContainer) return;

    let stats;
    let html = '';

    switch (state.calendarType) {
        case 'year':
            stats = getYearStats();
            html = `
        <div class="stat">
          <span class="stat-value">${stats.currentDay}</span>
          <span class="stat-label">days passed</span>
        </div>
        <div class="stat">
          <span class="stat-value">${stats.remainingDays}</span>
          <span class="stat-label">days remaining</span>
        </div>
        <div class="stat">
          <span class="stat-value">${stats.progressPercent}%</span>
          <span class="stat-label">of ${stats.year}</span>
        </div>
      `;
            break;
        case 'life':
            stats = getLifeStats(state.birthDate, state.lifeExpectancy);
            html = `
        <div class="stat">
          <span class="stat-value">${stats.ageYears}</span>
          <span class="stat-label">years lived</span>
        </div>
        <div class="stat">
          <span class="stat-value">${stats.weeksRemaining.toLocaleString()}</span>
          <span class="stat-label">weeks remaining</span>
        </div>
        <div class="stat">
          <span class="stat-value">${stats.progressPercent}%</span>
          <span class="stat-label">of life</span>
        </div>
      `;
            break;
        case 'goal':
            stats = getGoalStats(state.targetDate);
            html = `
        <div class="stat">
          <span class="stat-value">${stats.daysRemaining}</span>
          <span class="stat-label">days to go</span>
        </div>
        <div class="stat">
          <span class="stat-value">${stats.progressPercent}%</span>
          <span class="stat-label">complete</span>
        </div>
      `;
            break;
    }

    statsContainer.innerHTML = html;
}

/**
 * Download wallpaper as PNG
 */
function downloadWallpaper() {
    const canvas = document.getElementById('previewCanvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${state.calendarType}-calendar-${state.deviceId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

/**
 * Copy dynamic URL for iOS Shortcuts
 * Format: render.html?type=year&width=1179&height=2556&accent=ff6b6b
 */
function copyDynamicUrl() {
    import('./utils/devices.js').then(({ getDevice }) => {
        const device = getDevice(state.deviceId);
        const baseUrl = window.location.origin + window.location.pathname;

        // Use width and height parameters for iOS Shortcuts compatibility
        const params = new URLSearchParams({
            type: state.calendarType,
            width: device.width,
            height: device.height,
            accent: state.accentColor.replace('#', '')
        });

        if (state.calendarType === 'life') {
            params.set('birth', state.birthDate.toISOString().split('T')[0]);
            params.set('expectancy', state.lifeExpectancy);
        } else if (state.calendarType === 'goal') {
            params.set('target', state.targetDate.toISOString().split('T')[0]);
            params.set('title', state.goalTitle);
        }

        const url = `${baseUrl}render.html?${params.toString()}`;

        navigator.clipboard.writeText(url).then(() => {
            const btn = document.getElementById('copyUrlBtn');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
            btn.classList.add('success');
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('success');
            }, 2000);
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
