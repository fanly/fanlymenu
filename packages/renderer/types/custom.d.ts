// 天气预报相关
export declare interface FLocation {
  longitude: number, // 经度
  latitude: number,  // 纬度
}

export type WeatherValueMap = {
  locations: [LocationStr],
  updateTime: Date,
  weatherDailies: [WeatherDaily],
}
export interface LocationStr {
  name: string,
  id: string,
  lat: string,
  lon: string,
  adm2: string,
  adm1: string,
  country: string,
  tz: string,
  utcOffset: string,
  isDst: string,
  type: string,
  rank: string,
  fxLink: string,
}

/**

fxDate: "2021-07-02",
sunrise: "05:03",
sunset: "19:49",
moonrise: "00:22",
moonset: "12:43",
moonPhase: "下弦月",
tempMax: "30",
tempMin: "22",
iconDay: "302",
textDay: "雷阵雨",
iconNight: "306",
textNight: "中雨",
wind360Day: "150",
windDirDay: "东南风",
windScaleDay: "3-4",
windSpeedDay: "15",
wind360Night: "0",
windDirNight: "北风",
windScaleNight: "1-2",
windSpeedNight: "3",
humidity: "80",
precip: "1.0",
pressure: "991",
vis: "24",
cloud: "40",
uvIndex: "6"
 */
export interface WeatherDaily {
  fxDate: string,
  sunrise: string,
  sunset: string,
  moonrise: string,
  moonset: string,
  moonPhase: string,
  tempMax: string,
  tempMin: string,
  iconDay: string,
  textDay: string,
  iconNight: string,
  textNight: string,
  wind360Day: string,
  windDirDay: string,
  windScaleDay: string,
  windSpeedDay: string,
  wind360Night: string,
  windDirNight: string,
  windScaleNight: string,
  humidity: string,
  precip: string,
  pressure: string,
  vis: string,
  cloud: string,
  uvIndex: string,
}
// notion api 相关
export type { Page, InputPropertyValueMap } from './api-endpoints';
