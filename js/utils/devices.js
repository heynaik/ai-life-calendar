/**
 * Device Presets for iPhone Lock Screen Wallpapers
 * Each preset includes dimensions and safe area margins
 */

export const DEVICES = {
  'iphone15promax': {
    name: 'iPhone 15 Pro Max',
    width: 1290,
    height: 2796,
    safeAreaTop: 0.25,
    safeAreaBottom: 0.05
  },
  'iphone15pro': {
    name: 'iPhone 15 Pro',
    width: 1179,
    height: 2556,
    safeAreaTop: 0.25,
    safeAreaBottom: 0.05
  },
  'iphone15': {
    name: 'iPhone 15 / 14',
    width: 1170,
    height: 2532,
    safeAreaTop: 0.22,
    safeAreaBottom: 0.05
  },
  'iphonese': {
    name: 'iPhone SE',
    width: 750,
    height: 1334,
    safeAreaTop: 0.20,
    safeAreaBottom: 0.05
  }
};

/**
 * Get device configuration by ID
 * @param {string} deviceId - Device identifier
 * @returns {Object} Device configuration
 */
export function getDevice(deviceId) {
  return DEVICES[deviceId] || DEVICES['iphone15pro'];
}

/**
 * Get all available device options for selector
 * @returns {Array} Array of device options
 */
export function getDeviceOptions() {
  return Object.entries(DEVICES).map(([id, device]) => ({
    id,
    name: device.name,
    dimensions: `${device.width} × ${device.height}`
  }));
}
