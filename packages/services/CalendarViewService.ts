import * as Moment from 'moment';
import LunarService from './LunarService';

export default class CalendarViewService {
  // 综合显示
  showView(dayNumberText: string, date: Date, changeShowFestivals: boolean, weather: any) {
    const lunarService = new LunarService(date);
    const dayTextInChinese = lunarService.inDayCellContent(changeShowFestivals);
    const dateWeather = this.showWeather(date, weather);

    if (dateWeather == undefined) {
      return {
        html: `<div class="fc-daygrid-day-number">${dayNumberText}</div>
            <div class="fc-daygrid-day-chinese">${dayTextInChinese}</div>`,
      };
    } else {
      return {
        html: `<div class="fc-daygrid-day-number">${dayNumberText}</div>
            <div class="fc-daygrid-day-chinese">${dayTextInChinese}</div>
            <div class="fc-daygrid-day-chinese">${dateWeather.textDay}</div>
            <div class="fc-daygrid-day-chinese">${dateWeather.tempMin}-${dateWeather.tempMax}</div>`,
      };
    }
  }

  // 先显示当天的天气情况
  showWeather(date: Date, weather: any) {
    if (weather == null) {
      return false;
    }
    const dateString = Moment(date).format('YYYY-MM-DD');
    const result = weather.weatherDailies.find((dateWeather: { fxDate: string; }) => dateWeather.fxDate == dateString);
    return result;
  }
}
