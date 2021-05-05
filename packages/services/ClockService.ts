'use strict';

import { app } from 'electron';
const Moment = require('moment');
// import * as Moment from 'moment';
// import 'moment/locale/pt-br';
// import ResetDateCache from "reset-date-cache";

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

    // systemPreferences.subscribeNotification(
    //   "NSSystemTimeZoneDidChangeDistributedNotification",
    //   () => this.onTimeZoneChange(),
    // );
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

  // onTimeZoneChange(): this {
  //   setTimeout(() => {
  //     ResetDateCache();
  //   }, 1000);

  //   return this;
  // }

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
    return Moment().format(this.getFormat());
  }
}
