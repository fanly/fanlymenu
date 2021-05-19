'use strict';

import axios from 'axios';

export default class WeatherService {
  async getWeathers() {
    const res = await axios.get('https://open.coding01.cn/weatherdata');
    return res.data;
  }
}