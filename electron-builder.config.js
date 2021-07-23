const now = new Date;
const buildVersion = `${now.getFullYear() - 2020}.${now.getMonth() - 6}.${now.getDate()}`;
const id = 'cn.coding01.fanlycalendar';
/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  appId: id,
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
    target: 'pkg',
    entitlements: 'buildResources/entitlements.mas.plist',
    extendInfo: {
      CFBundlePackageType: 'APPL',
      CFBundleIdentifier: id,
      CFBundleShortVersionString: buildVersion,
    },
  },
};

module.exports = config;
