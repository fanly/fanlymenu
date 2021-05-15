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
  inDayCellContent(changeShowFestivals: boolean): string {

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
}
