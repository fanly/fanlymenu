import type { Rectangle} from 'electron';
import { Tray, nativeImage} from 'electron';
export default class TrayService {
  tray: Tray;
  label: string;
  clickHandler: any;

  constructor() {
    this.label = '';
    const icon = nativeImage.createEmpty();
    this.tray = new Tray(icon);
    this.tray.on('click', () => (this.clickHandler || (() => {}))());
  }

  getBounds(): Rectangle {
    return this.tray.getBounds();
  }

  getLabel(): string {
    return this.label;
  }

  setLabel(label: string): this {
    if (this.tray.isDestroyed()) {
      return this;
    }

    this.tray.setTitle((this.label = label));
    return this;
  }

  onClick(fn: any): void {
    this.clickHandler = fn;
  }
}
