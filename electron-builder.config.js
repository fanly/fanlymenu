const now = new Date;
const buildVersion = `${now.getFullYear() - 2020}.${now.getMonth() - 6}.${now.getDate() + 4}`;
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
  dmg: {
    contents: [
      {
        x: 410,
        y: 150,
        type: 'link',
        path: '/Applications',
      },
      {
        x: 130,
        y: 150,
        type: 'file',
      },
    ],
  },
  mac: {
    target: 'dmg',
    type: 'distribution',
    hardenedRuntime : true,
    gatekeeperAssess: false,
    entitlements: 'buildResources/entitlements.mas.plist',
    entitlementsInherit: 'buildResources/entitlements.mas.inherit.plist',
    extendInfo: {
      CFBundlePackageType: 'APPL',
      CFBundleIdentifier: id,
      CFBundleShortVersionString: buildVersion,
    },
  },
  afterSign: 'electron-builder-notarize',
};

module.exports = config;
