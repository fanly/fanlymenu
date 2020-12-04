# Overwrite

> Vite+Electron = 🔥

This template uses [Vite](https://github.com/vitejs/vite/) as bundler and [Electron builder](https://www.electron.build/) as compiler.

This is a minimalist template designed for a **simple and flexible start of your project**.

## Features
- [Vue 3](https://v3.vuejs.org/)
- Latest [Electron](https://www.electronjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://github.com/vitejs/vite/) for bundling
- [electron-builder](https://www.electron.build/)
- Auto releases when push to main
- Auto Updates
- Typed `.env` files supports

## Status
- ✅ Building main and renderer endpoints in production mode -- works great.
- ✅ Development mode with hot reload for renderer endpoint -- works great.
- ⚠ Development mode for main and preload endpoints -- work fine, but it is possible to reboot the backend faster ([vite#972](https://github.com/vitejs/vite/issues/972))
- ✅ Compile the app with electron builder in CD -- work.
- ✅ Auto update -- work.
- ✅ Typechecking in `.ts` and `.vue` files -- work thanks [@vuedx/typecheck](https://github.com/znck/vue-developer-experience/tree/master/packages/typecheck)
- ⚠ Linting -- work fine, but need review the configuration files and refactor its. It may also intersect somewhat with Typechecking.
- ⏳ Code signing -- planned. 
- ⏳ Add Vue dev tools -- planned.
- ⏳ Refactor and simplify the set of npm scripts -- planned.
- ⏳ Refactor and simplify eslint configs -- planned.

## How it works
The template required a minimum [dependencies](https://github.com/cawa-93/vite-electron-builder/blob/main/package.json). Only **Vite** is used for building, nothing more.

All additional dependencies for linter or typechecking well be install, if necessary in the CI workflow.

### Modes and Environment Variables
All environment variables set as part of the `import.meta`, so you can access them as follows: `import.meta.env`. 

You can also build type definitions of your variables by running `/bin/buildEnvTypes.js`. This command will create `/types/env.d.ts` file with describing all environment variables for all modes.

The mode option is used to specify the value of `import.meta.env.MODE` and the corresponding environment variables files that needs to be loaded.

By default, there are two modes:
  - `production` is used by `build:*` scripts
  - `development` is used by `watch:build:*` scripts


When running `build:*` or `watch:build:*`, environment variables are loaded from the following files in your project root:

```
.env                # loaded in all cases
.env.local          # loaded in all cases, ignored by git
.env.[mode]         # only loaded in specified env mode
.env.[mode].local   # only loaded in specified env mode, ignored by git
```

**Note:** only variables prefixed with `VITE_` are exposed to your code. e.g. `VITE_SOME_KEY=123` will be exposed as `import.meta.env.VITE_SOME_KEY`, but `SOME_KEY=123` will not. This is because the `.env` files may be used by some users for server-side or build scripts and may contain sensitive information that should not be exposed in code shipped to browsers.

### Project Structure
- `/src`
  Contains all source code.
  - `/src/main` 
  Contain entrypoint for Electron [**main script**](https://www.electronjs.org/docs/tutorial/quick-start#create-the-main-script-file).
  - `/src/renderer` 
    Contain entrypoint for Electron [**web page**](https://www.electronjs.org/docs/tutorial/quick-start#create-a-web-page). All files in this directory work as a regular Vue application.
  - `/src/preload` 
    Contain entrypoint for custom script. It uses as `preload` script in `BrowserWindow.webPreferences.preload`. See [Checklist: Security Recommendations](https://www.electronjs.org/docs/tutorial/security#2-do-not-enable-nodejs-integration-for-remote-content).
  - `/src/*` It is assumed any entry points will be added here, for custom scripts, web workers, webassembly compilations, etc.
- `/dist` 
  - `/dist/source`
  Contains all bundled code.
    - `/dist/source/main` Bundled *main* entrypoint.
    - `/dist/source/renderer` Bundled *renderer* entrypoint.
    - `/dist/source/preload` Bundled *preload* entrypoint.
    - `/dist/source/*` Bundled any custom files.
  - `/dist/app`
  Contain packages and ready-to-distribute electron apps for any platform. Files in this directory created using [electron-builder](https://www.electron.build/).
- `/config`
  Contains various configuration files for Vite, TypeScript, electron builder, etc.
- `/bin`
  It is believed any scripts for build the application will be located here.
- `/types` 
  Contains all declaration files to be applied globally to the entire project

### Development Setup
This project requires at least 14 versions or later.
1. Fork this repository
1. Run `npm install` to install all dependencies
1. Build all entry points for production -- `npm run build`
1. Compile Electron app -- `npm run electron-builder`
1. Build single entry point for production -- `npm run build:<entrypoint>`
1. Run development watching build -- `npm run watch:build:<entrypoint>`
1. Run electron in development mode -- `npm run electron`

# Contributing
See [contributing.md](/contributing.md)
