const now = new Date;
const buildVersion = `${now.getFullYear() - 2020}.${now.getMonth() - 6}.${now.getDate()}`;

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  appId: 'cn.coding01.fanlycalendar',
  directories: {
    output: 'dist',
    buildResources: 'buildResources',
  },
  files: [
    'packages/**/dist/**',
  ],
  extraMetadata: {
    version: buildVersion,
  },
  mac: {
    target: 'dmg',
    extendInfo: {
      CFBundlePackageType: 'APPL',
    },
  },
};

module.exports = config;
