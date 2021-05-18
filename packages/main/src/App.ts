import { app, BrowserWindow, screen } from 'electron';
import {join} from 'path';
import TrayService from '../../services/TrayService';
import ClockService from '../../services/ClockService';
import { Lunar } from 'lunar-typescript';
import {URL} from 'url';

export default class App {
  trayService: TrayService;
  clockService: ClockService;
  willQuite: boolean;
  window: BrowserWindow;
  env: ImportMetaEnv

  constructor() {
    app.dock.hide();
    this.env = import.meta.env;
    this.trayService = new TrayService();
    this.clockService = new ClockService();
    this.willQuite = false;
    this.window = this.createWindow();
    this.registerListeners();
  }

  createWindow(): BrowserWindow {
    const window = new BrowserWindow({
      width: 600,
      height: 700,
      resizable: false,
      alwaysOnTop: true,
      show: false,
      frame: false,
      webPreferences: {
        webSecurity: false,
        preload: join(__dirname, '../../preload/dist/index.cjs'),
        contextIsolation: this.env.MODE !== 'test',   // Spectron tests can't work with contextIsolation: true
        enableRemoteModule: this.env.MODE === 'test', // Spectron tests can't work with enableRemoteModule: false
      },
    });

    window.on('blur', () => this.onBlur());

    // window.on('ready-to-show', () => {
    //   window?.show();

    //   if (this.env.MODE === 'development') {
    //     this.window?.webContents.openDevTools();
    //   }
    // });

    /**
     * URL for main window.
     * Vite dev server for development.
     * `file://../renderer/index.html` for production and test
     */
    const pageUrl = this.env.MODE === 'development'
      ? this.env.VITE_DEV_SERVER_URL
      : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();

    window.loadURL(pageUrl);

    return window;
  }

  onBlur(): void {
    this.hide();
  }

  registerListeners(): this {
    const lunar = Lunar.fromDate(new Date());
    const dayTextInChinese =
      lunar.getJieQi() ||
      `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;

    this.clockService.onTick((clock: { toString: () => string; }) => {
      this.trayService.setLabel(dayTextInChinese + ' ' + clock.toString());
    });

    this.trayService.onClick(() => {
      const bounds = this.trayService.getBounds();
      const currentMousePosition = screen.getCursorScreenPoint();
      const currentDisplay = screen.getDisplayNearestPoint(
        currentMousePosition,
      );
      this.setPosition(bounds.x + bounds.width / 2, currentDisplay.workArea.y);

      if (this.isVisible()) {
        this.hide();
      } else {
        this.show();
      }
    });

    app.on('before-quit', () => {
      this.willQuite = true;
    });

    return this;
  }

  isVisible(): boolean {
    return this.window.isVisible();
  }

  show(): this {
    this.window.show();
    return this;
  }

  hide(): this {
    this.window.hide();
    return this;
  }

  setPosition(x: number, y: number, centerToX = true): this {
    this.window.setPosition(
      centerToX ? Math.round(x - this.window.getSize()[0] / 2) : x,
      y,
    );
    return this;
  }
}
