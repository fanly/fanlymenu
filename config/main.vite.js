const {join} = require('path');
const {node} = require('./electron-dep-versions');

/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  alias: [
    {
      find: /^\/@\//,
      replacement: join(process.cwd(), './src/main') + '/',
    },
  ],
  build: {
    target: `node${node}`,
    outDir: 'dist/source/main',
    assetsDir: '.',
    minify: process.env.MODE === 'development' ? false : 'terser',
    lib: {
      entry: 'src/main/index.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: require('./external-packages'),
      output: {
        entryFileNames: '[name].[format].js',
        chunkFileNames: '[name].[format].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
};
