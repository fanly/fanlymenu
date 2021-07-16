import { format } from 'date-fns';
import LunarService from './LunarService';
import type { WeatherDaily, WeatherValueMap } from '../renderer/types/custom';
import WeatherService from './WeatherService';
export default class CalendarViewService {
  // 综合显示
  showView(
    dayNumberText: string,
    date: Date,
    changeShowFestivals: boolean,
    changeShowWeather: boolean,
    weather: WeatherValueMap): { 'html': string } {
    const lunarService = new LunarService(date);
    const dayTextInChinese = lunarService.showNongliData(changeShowFestivals);
    const dayNumberTextSub = dayNumberText.replace('日', '');
    if (!changeShowWeather) {
      return {
        html: `<div class="fc-daygrid-day-number">${dayNumberTextSub}</div><div class="fc-daygrid-day-chinese">${dayTextInChinese}</div>`,
      };
    }
    const dateWeather = this.showWeather(date, weather);
    if (dateWeather == undefined) {
      return {
        html: `<div class="fc-daygrid-day-number">${dayNumberTextSub}</div><div class="fc-daygrid-day-chinese">${dayTextInChinese}</div>`,
      };
    } else {
      const imgSrc = WeatherService.getIcon(dateWeather.iconDay);
      return {
        html: `<div class="fc-daygrid-day-number">${dayNumberTextSub}</div><div class="fc-daygrid-day-chinese">${dayTextInChinese}</div>
          <div class="fc-daygrid-dayweather">
            <img class="fc-daygrid-dayweather-iconday" src=${imgSrc}/>
            <span class="fc-daygrid-dayweather-temp">${dateWeather.textDay} ${dateWeather.tempMin}-${dateWeather.tempMax}°C</span>
          </div>`,
      };
    }
  }

  // 先显示当天的天气情况
  showWeather(date: Date, weather: WeatherValueMap): WeatherDaily | undefined {
    if (weather == null || weather.weatherDailies == null) {
      return undefined;
    }
    const dateString = format(date, 'yyyy-MM-dd');
    const result = weather.weatherDailies.find((dateWeather: { fxDate: string; }) => dateWeather.fxDate == dateString);
    return result;
  }
}
