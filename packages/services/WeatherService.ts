'use strict';
import axios from 'axios';
import wrapper from 'axios-cache-plugin';
export default class WeatherService {

  async getWeathers(location: any) {
    const locationStr = location.longitude + ',' + location.latitude;
    const http = wrapper(axios, {
      maxCacheSize: 15,
      ttl: 7200000, //ms
    });
    http.__addFilter(/weatherdata/);

    const res = await http({
      url: import.meta.env.VITE_WEATHER_API,
      method: 'get',
      params: {
        param: JSON.stringify({
          location: locationStr,
        }),
      },
    });

    return res.data;
  }
}
