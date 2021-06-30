import type { Rectangle} from 'electron';
import { Tray, nativeImage} from 'electron';
export default class TrayService {
  tray: Tray;
  label: string;
  clickHandler: (() => void) | null = null;

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

  setLabel(label: string): void {
    if (this.tray.isDestroyed()) {
      return;
    }

    this.tray.setTitle((this.label = label));
  }

  onClick(fn: (() => void) | null): void {
    this.clickHandler = fn;
  }
}
