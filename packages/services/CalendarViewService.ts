import * as Moment from 'moment';
import LunarService from './LunarService';
import weathericons from '~/images/weathericons/100.png';

export default class CalendarViewService {
  // 综合显示
  showView(
    dayNumberText: string,
    date: Date,
    changeShowFestivals: boolean,
    changeShowWeather: boolean,
    weather: any): any {
    const lunarService = new LunarService(date);
    const dayTextInChinese = lunarService.showNongliData(changeShowFestivals);

    if (!changeShowWeather) {
      return {
        html: `<div class="fc-daygrid-day-number">${dayNumberText}</div>
            <div class="fc-daygrid-day-chinese">${dayTextInChinese}</div>`,
      };
    }
    const dateWeather = this.showWeather(date, weather);
    if (dateWeather == undefined) {
      return {
        html: `<div class="fc-daygrid-day-number">${dayNumberText}</div>
            <div class="fc-daygrid-day-chinese">${dayTextInChinese}</div>`,
      };
    } else {
      const imgSrc = weathericons + '/../' + dateWeather.iconDay +'.png';
      return {
        html: `<div class="fc-daygrid-day-number">${dayNumberText}</div>
          <div class="fc-daygrid-day-chinese">${dayTextInChinese}</div>
          <div class="fc-daygrid-dayweather">
            <img class="fc-daygrid-dayweather-iconday" src=${imgSrc}/>
            <span class="fc-daygrid-dayweather-temp">${dateWeather.textDay} ${dateWeather.tempMin}-${dateWeather.tempMax}°C</span>
          </div>`,
      };
    }
  }

  // 先显示当天的天气情况
  showWeather(date: Date, weather: any) {

    if (weather == null || weather.weatherDailies == null) {
      return undefined;
    }
    const dateString = Moment(date).format('YYYY-MM-DD');
    const result = weather.weatherDailies.find((dateWeather: { fxDate: string; }) => dateWeather.fxDate == dateString);
    return result;
  }
}
