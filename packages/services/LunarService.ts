import { Solar, Lunar } from 'lunar-typescript';

/**
 * 显示日期相关功能
 */
export default class LunarService {
  lunar: Lunar;
  solar: Solar;

  constructor(date: Date = new Date()) {
    this.lunar = Lunar.fromDate(date);
    this.solar = Solar.fromDate(date);
  }

  /**
   * 包括：法定节日、农历等
   * @returns 显示在界面上所有和节日有关的
   */
  showNongliData(changeShowFestivals: boolean): string {

    if (changeShowFestivals) {
      const solarFestivals = this.solar.getFestivals();

      if (solarFestivals.length > 0) {
        return solarFestivals.join(' ');
      }

      const lunarFestivals = this.lunar.getFestivals();

      if (lunarFestivals.length > 0) {
        return lunarFestivals.join(' ');
      }
    }

    return this.lunar.getJieQi() ||
    `${this.lunar.getMonthInChinese()}月${this.lunar.getDayInChinese()}`;
  }

  /**
   * @returns 获取黄历页面需要得数据
   */
  getDateViewDate(): LunarServiceResult {
    const nongliString = `农历${this.lunar.getMonthInChinese()}月${this.lunar.getDayInChinese()}`;

    const ganzhi = [
      `${this.lunar.getYearInGanZhi()}${this.lunar.getYearShengXiao()}年`,
      `${this.lunar.getMonthInGanZhi()}月`,
      `${this.lunar.getDayInGanZhi()}日`,
    ];

    const yangliString = this.solar.toFullString();

    const yi = this.lunar.getDayYi();

    const ji = this.lunar.getDayJi();

    return {
      nongliString: nongliString,
      ganzhi: ganzhi,
      yangliString: yangliString,
      yi: yi,
      ji: ji,
    };
  }
}

export declare interface LunarServiceResult {
  nongliString: string,
  ganzhi: string[],
  yangliString: string,
  yi: string[],
  ji: string[],
}
