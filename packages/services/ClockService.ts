'use strict';

import { app } from 'electron';
const Moment = require('moment');
import LunarService from './LunarService';

export default class ClockService {
  format: any;
  onTickHandler: any;
  intervalId: any;
  constructor() {
    Moment.locale(app.getLocale());
    // this.setFormat("MM/DD HH:mm:ss");
    // lll
    this.setFormat('MMMDo dddd HH:mm:ss');
    this.start();
  }

  start(): this {
    if (typeof this.onTickHandler !== 'function') {
      this.onTickHandler = () => {};
    }

    this.intervalId = setInterval(() => this.onTickHandler(this), 1000);

    return this;
  }

  stop(): this {
    if (this.intervalId) {
      this.intervalId = clearInterval(this.intervalId);
    }

    return this;
  }

  onTick(callback: any): this {
    this.onTickHandler = callback;

    return this;
  }

  getFormat(): any {
    return this.format;
  }

  setFormat(format: any): this {
    if (typeof format !== 'string') {
      return this;
    }

    this.format = format;

    return this;
  }

  toString(): string {
    const lunarService = new LunarService();
    const dayTextInChinese = lunarService.showNongliData(true);
    return dayTextInChinese + ' ' + Moment().format(this.getFormat());
  }
}
