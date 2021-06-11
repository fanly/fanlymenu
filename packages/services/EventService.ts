'use strict';
import axios from 'axios';
import wrapper from 'axios-cache-plugin';
export default class EventService {
  async getEvents() {
    const http = wrapper(axios, {
      maxCacheSize: 15,
      ttl: 60000, //ms
    });
    http.__addFilter(/weatherdata/);

    const headers = {
      'Notion-Version': '2021-05-13',
      'Authorization': 'Bearer '+ import.meta.env.VITE_NOTION_KEY,
    };

    const res = await http({
      url: import.meta.env.VITE_NOTION_DATABASE_API + import.meta.env.VITE_NOTION_DATABASE_ID + '/query',
      method: 'post',
      headers: headers,
    });

    return this.list2Events(res.data.results);
  }

  list2Events(results: []) {
    const events = results.map((element: any) => {
      return {
        'id': element.properties?.event_id.number,
        'title': element.properties?.title.rich_text[0].plain_text,
        'start': element.properties?.start.date.start,
        'end': element.properties?.end?.date.start,
      };
    });

    return events;
  }
}
