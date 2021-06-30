'use strict';

import { app } from 'electron';
const Moment = require('moment');
import LunarService from './LunarService';

export default class ClockService {
  format = 'MMMDo HH:mm';
  // onTickHandler: ((toString: (arg0: ClockService) => string) => void) | null = null;
  onTickHandler: ((arg0: ClockService) => void) | null = null;
  intervalId: NodeJS.Timeout | null = null;
  params: ClockSettingParams;
  constructor() {
    Moment.locale(app.getLocale());
    this.params = {} as ClockSettingParams;
    // lll MMMDo dddd HH:mm:ss
    this.setFormat('MMMDo HH:mm');
    this.start();
  }

  start(): this {
    if (typeof this.onTickHandler !== 'function') {
      this.onTickHandler = () => {};
    }

    this.intervalId = setInterval(() => {
      if (this.onTickHandler) {
        this.onTickHandler(this);
      }
    }, 1000);

    return this;
  }

  stop(): this {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    return this;
  }

  onTick(callback: ((arg0: ClockService) => void) | null): this {
    this.onTickHandler = callback;

    return this;
  }

  getFormat(): string {
    return this.format;
  }

  setFormat(format: string): this {
    if (typeof format !== 'string') {
      return this;
    }

    this.format = format;

    return this;
  }

  /* {
    trayFestivalsModel: true,
    trayWeatherModel: false,
    trayWeekModel: true,
    traySecondsModel: true
  }*/
  setParams(params: ClockSettingParams): this {
    this.params = params;

    // MMMDo dddd HH:mm:ss
    let default_format = 'MMMDo ';

    if (this.params.trayWeekModel) {
      default_format = default_format.concat('dddd ');
    }

    default_format = default_format.concat('HH:mm');

    if (this.params.traySecondsModel) {
      default_format = default_format.concat(':ss');
    }

    return this.setFormat(default_format);
  }

  getParams(): ClockSettingParams {
    return this.params;
  }

  toString(): string {
    let showString = '';
    if (this.params.trayFestivalsModel) {
      const lunarService = new LunarService();
      const dayTextInChinese = lunarService.showNongliData(true);
      showString = showString.concat(...[dayTextInChinese, ' ']);
    }

    return showString.concat(Moment().format(this.getFormat()));
  }
}


export declare interface ClockSettingParams {
  trayFestivalsModel: boolean,
  trayWeatherModel: boolean,
  trayWeekModel: boolean,
  traySecondsModel: boolean
}
