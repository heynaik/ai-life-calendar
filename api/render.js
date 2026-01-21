const { URLSearchParams } = require('url');

// Device definitions for fallback
const DEVICES = {
    'iphone15promax': { width: 1290, height: 2796, safeTop: 0.25, safeBottom: 0.05 },
    'iphone15pro': { width: 1179, height: 2556, safeTop: 0.25, safeBottom: 0.05 },
    'iphone15': { width: 1170, height: 2532, safeTop: 0.22, safeBottom: 0.05 },
    'iphone13': { width: 1170, height: 2532, safeTop: 0.22, safeBottom: 0.05 },
    'iphone13mini': { width: 1080, height: 2340, safeTop: 0.22, safeBottom: 0.05 },
    'iphonese': { width: 750, height: 1334, safeTop: 0.18, safeBottom: 0.05 }
};

// Helper to escape HTML/XML characters
const escape = (str) => str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[m]);

module.exports = (req, res) => {
    try {
        const { query } = req;
        const type = query.type || 'year';
        const accentColor = query.accent ? '#' + query.accent.replace('#', '') : '#ff6b6b';
        const deviceId = query.device || 'iphone15pro';

        // Determine dimensions
        let width = parseInt(query.width);
        let height = parseInt(query.height);

        // Fallback to device preset
        const device = DEVICES[deviceId] || DEVICES['iphone15pro'];
        if (!width || !height) {
            width = device.width;
            height = device.height;
        }

        // Common style constants
        const bg = '#000000';
        const fg = '#ffffff';
        const muted = '#333333';
        const textMuted = '#888888';

        // Safe area calculations (using percentages from device or defaults)
        const safeTopPct = device ? device.safeTop : 0.22;
        const safeBottomPct = device ? device.safeBottom : 0.05;
        const safeTop = height * safeTopPct;
        const safeBottom = height * safeBottomPct;
        const availableHeight = height - safeTop - safeBottom;

        let svgContent = '';

        // --- RENDERERS ---

        if (type === 'year') {
            const now = new Date();
            const year = now.getFullYear();
            const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
            const totalDays = isLeap ? 366 : 365;
            const startOfYear = new Date(year, 0, 0);
            const diff = now - startOfYear;
            const oneDay = 1000 * 60 * 60 * 24;
            const currentDay = Math.floor(diff / oneDay);

            const cols = 20;
            const rows = Math.ceil(totalDays / cols);

            const padding = width * 0.08;
            const gridWidth = width - (padding * 2);
            const gridHeight = availableHeight * 0.6;

            const spacingX = gridWidth / cols;
            const spacingY = gridHeight / rows;
            const radius = Math.min(spacingX, spacingY) * 0.35;

            const startX = padding + spacingX / 2;
            const startY = safeTop + (availableHeight - gridHeight) / 2 + spacingY / 2;

            let dots = '';
            for (let i = 0; i < totalDays; i++) {
                const col = i % cols;
                const row = Math.floor(i / cols);
                const cx = startX + col * spacingX;
                const cy = startY + row * spacingY;

                if (i + 1 < currentDay) {
                    dots += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${fg}" />`;
                } else if (i + 1 === currentDay) {
                    dots += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${accentColor}" />`;
                    // Glow effect using opacity layers
                    dots += `<circle cx="${cx}" cy="${cy}" r="${radius * 2}" fill="${accentColor}" opacity="0.3" />`;
                } else {
                    // Empty dot (stroke)
                    dots += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${muted}" stroke-width="2" />`;
                }
            }

            const progress = ((currentDay / totalDays) * 100).toFixed(1);

            svgContent = `
        ${dots}
        <text x="${width / 2}" y="${startY + gridHeight + height * 0.08}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="${width * 0.06}" font-weight="bold" fill="${fg}" text-anchor="middle">${year}</text>
        <text x="${width / 2}" y="${startY + gridHeight + height * 0.12}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${width * 0.035}" fill="${textMuted}" text-anchor="middle">${progress}% of ${year} complete</text>
      `;

        } else if (type === 'life') {
            const birthStr = query.birth || '1990-01-01';
            const birthDate = new Date(birthStr);
            const expectancy = parseInt(query.expectancy) || 80;

            const now = new Date();
            const diffMs = now - birthDate;
            const oneWeekMs = 1000 * 60 * 60 * 24 * 7;
            const weeksLived = Math.floor(diffMs / oneWeekMs);

            const cols = 52;
            const rows = expectancy;
            const totalWeeks = cols * rows;
            const currentWeek = Math.min(weeksLived, totalWeeks);

            const padding = width * 0.05;
            const gridWidth = width - (padding * 2);
            const gridHeight = availableHeight * 0.7;

            const blockW = (gridWidth / cols) * 0.85;
            const blockH = (gridHeight / rows) * 0.85;
            const spacingX = gridWidth / cols;
            const spacingY = gridHeight / rows;

            const startX = padding;
            const startY = safeTop + (availableHeight - gridHeight) / 2.5;

            let blocks = '';
            // Optimization: Don't draw thousands of individual rects if possible, or group them?
            // For SVG size, drawing 4000 rects is heavy but handleable. 
            // To optimize: Draw 'lived' blocks as one group if they aren't grid-spaced, but they IS grid-spaced.
            // We will draw simple rects.

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const idx = r * cols + c;
                    const x = startX + c * spacingX;
                    const y = startY + r * spacingY;

                    if (idx < currentWeek) {
                        blocks += `<rect x="${x}" y="${y}" width="${blockW}" height="${blockH}" fill="${fg}" />`;
                    } else if (idx === currentWeek) {
                        blocks += `<rect x="${x}" y="${y}" width="${blockW}" height="${blockH}" fill="${accentColor}" />`;
                    } else {
                        blocks += `<rect x="${x}" y="${y}" width="${blockW}" height="${blockH}" fill="${muted}" />`;
                    }
                }
            }

            const age = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
            const weeksLeft = totalWeeks - currentWeek;
            const labelY = startY + gridHeight + height * 0.05;

            svgContent = `
        ${blocks}
        <text x="${width / 2}" y="${labelY}" font-family="-apple-system, system-ui, sans-serif" font-size="${width * 0.055}" font-weight="bold" fill="${fg}" text-anchor="middle">${age} years lived</text>
        <text x="${width / 2}" y="${labelY + height * 0.04}" font-family="-apple-system, system-ui, sans-serif" font-size="${width * 0.032}" fill="${textMuted}" text-anchor="middle">${weeksLeft.toLocaleString()} weeks remain</text>
      `;

        } else if (type === 'goal') {
            const targetStr = query.target;
            const targetDate = targetStr ? new Date(targetStr) : new Date(new Date().getFullYear(), 11, 31);
            const title = query.title ? decodeURIComponent(query.title) : 'Goal';

            const now = new Date();
            const start = new Date(now.getFullYear(), 0, 1); // approximate start
            const oneDay = 1000 * 60 * 60 * 24;

            const totalDays = Math.ceil((targetDate - start) / oneDay);
            const daysElapsed = Math.ceil((now - start) / oneDay);
            const daysRemaining = Math.max(0, Math.ceil((targetDate - now) / oneDay));
            const progress = Math.min(1, Math.max(0, daysElapsed / totalDays));

            const centerY = safeTop + availableHeight / 2;
            const padding = width * 0.1;

            // Countdown
            const displayDays = daysRemaining.toString();

            // Bar
            const barWidth = width - (padding * 2);
            const barHeight = width * 0.025;
            const barY = centerY + height * 0.08;
            const barX = padding;
            const radius = barHeight / 2;
            const progWidth = barWidth * progress;

            const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
            const dateStr = targetDate.toLocaleDateString('en-US', dateOptions);
            const pct = (progress * 100).toFixed(1);

            svgContent = `
        <text x="${width / 2}" y="${centerY - height * 0.08}" font-family="-apple-system, system-ui, sans-serif" font-size="${width * 0.25}" font-weight="bold" fill="${fg}" text-anchor="middle" dominant-baseline="middle">${displayDays}</text>
        <text x="${width / 2}" y="${centerY + height * 0.02}" font-family="-apple-system, system-ui, sans-serif" font-size="${width * 0.05}" fill="${textMuted}" text-anchor="middle">${daysRemaining === 1 ? 'day' : 'days'} remaining</text>
        
        <!-- Progress Bar Background -->
        <rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" rx="${radius}" fill="${muted}" />
        
        <!-- Progress Fill -->
        ${progWidth > 0 ? `<rect x="${barX}" y="${barY}" width="${progWidth}" height="${barHeight}" rx="${radius}" fill="${accentColor}" />` : ''}
        
        <text x="${width / 2}" y="${barY + height * 0.07}" font-family="-apple-system, system-ui, sans-serif" font-size="${width * 0.045}" font-weight="bold" fill="${fg}" text-anchor="middle">${escape(title)}</text>
        <text x="${width / 2}" y="${barY + height * 0.10}" font-family="-apple-system, system-ui, sans-serif" font-size="${width * 0.032}" fill="${textMuted}" text-anchor="middle">${dateStr}</text>
        <text x="${width / 2}" y="${barY + height * 0.13}" font-family="-apple-system, system-ui, sans-serif" font-size="${width * 0.032}" fill="${textMuted}" text-anchor="middle">${pct}% complete</text>
      `;
        }

        // Wrap in SVG
        const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${bg}" />
  ${svgContent}
</svg>`;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache for 1 hour
        res.status(200).send(svg);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error rendering wallpaper');
    }
};
