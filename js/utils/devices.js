/**
 * Device Presets for iPhone Lock Screen Wallpapers
 * Each preset includes dimensions and safe area margins
 */

export const DEVICES = {
  // iPhone 13 mini
  'iphone13mini': {
    name: 'iPhone 13 mini',
    width: 1080,
    height: 2340,
    safeAreaTop: 0.22,
    safeAreaBottom: 0.05
  },

  // iPhone 13 / 13 Pro / 14 / 14 Pro
  'iphone13': {
    name: 'iPhone 13 / 13 Pro / 14 / 14 Pro',
    width: 1170,
    height: 2532,
    safeAreaTop: 0.22,
    safeAreaBottom: 0.05
  },

  // iPhone 13 Pro Max / 14 Plus / 14 Pro Max
  'iphone14promax': {
    name: 'iPhone 13 Pro Max / 14 Plus / 14 Pro Max',
    width: 1284,
    height: 2778,
    safeAreaTop: 0.22,
    safeAreaBottom: 0.05
  },

  // iPhone 15 / 15 Pro / 16
  'iphone15': {
    name: 'iPhone 15 / 15 Pro / 16',
    width: 1179,
    height: 2556,
    safeAreaTop: 0.22,
    safeAreaBottom: 0.05
  },

  // iPhone 15 Plus / 15 Pro Max / 16 Plus
  'iphone15promax': {
    name: 'iPhone 15 Plus / 15 Pro Max / 16 Plus',
    width: 1290,
    height: 2796,
    safeAreaTop: 0.25,
    safeAreaBottom: 0.05
  },

  // iPhone 16 Pro
  'iphone16pro': {
    name: 'iPhone 16 Pro',
    width: 1206,
    height: 2622,
    safeAreaTop: 0.22,
    safeAreaBottom: 0.05
  },

  // iPhone 16 Pro Max
  'iphone16promax': {
    name: 'iPhone 16 Pro Max',
    width: 1320,
    height: 2868,
    safeAreaTop: 0.25,
    safeAreaBottom: 0.05
  },

  // iPhone 17 (expected)
  'iphone17': {
    name: 'iPhone 17',
    width: 1179,
    height: 2556,
    safeAreaTop: 0.22,
    safeAreaBottom: 0.05
  },

  // iPhone 17 Pro (expected)
  'iphone17pro': {
    name: 'iPhone 17 Pro',
    width: 1206,
    height: 2622,
    safeAreaTop: 0.22,
    safeAreaBottom: 0.05
  },

  // iPhone 17 Pro Max (expected)
  'iphone17promax': {
    name: 'iPhone 17 Pro Max',
    width: 1320,
    height: 2868,
    safeAreaTop: 0.25,
    safeAreaBottom: 0.05
  },

  // iPhone SE (legacy)
  'iphonese': {
    name: 'iPhone SE',
    width: 750,
    height: 1334,
    safeAreaTop: 0.18,
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
