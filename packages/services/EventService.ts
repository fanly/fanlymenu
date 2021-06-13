'use strict';
import axios from 'axios';
import wrapper from 'axios-cache-plugin';
export default class EventService {
  headers: any;
  constructor() {
    this.headers = {
      'Notion-Version': import.meta.env.VITE_NOtion_VERSION,
      'Authorization': 'Bearer '+ import.meta.env.VITE_NOTION_KEY,
    };
  }

  /**
   * 提交title和start、end 到 Notion API
   */
  async postEvent(
    title: string,
    start: Date,
    end: Date,
    ) {
      const http = wrapper(axios, {
        maxCacheSize: 15,
      });
      const res = await http({
        url: import.meta.env.VITE_NOTION_PAGE_API,
        method: 'post',
        headers: this.headers,
        data: {
          'parent': { 'type': 'database_id', 'database_id': import.meta.env.VITE_NOTION_DATABASE_ID },
          'properties': {
            'title': {
              'type': 'rich_text',
              'rich_text': [{
                'type': 'text',
                'text': { 'content': title },
              }],
            },
            'start': {
              'type': 'date',
              'date': { 'start': start },
            },
            'end': {
              'type': 'date',
              'date': { 'start': end },
            },
          },
        },
      });

      return res;
  }

  /**
   * 更新 title 或者 start、end 到 Notion API
   */
  async patchEvent(
    id: string,
    title: string,
    start: Date,
    end: Date,
    ) {
      const http = wrapper(axios, {
        maxCacheSize: 15,
      });
      const res = await http({
        url: import.meta.env.VITE_NOTION_PAGE_API + '/' + id,
        method: 'patch',
        headers: this.headers,
        data: {
          'properties': {
            'title': {
              'type': 'rich_text',
              'rich_text': [{
                'type': 'text',
                'text': { 'content': title },
              }],
            },
            'start': {
              'type': 'date',
              'date': { 'start': start },
            },
            'end': {
              'type': 'date',
              'date': { 'start': end },
            },
          },
        },
      });

      return res;
  }

  async getEvents() {
    const http = wrapper(axios, {
      maxCacheSize: 15,
      ttl: 60000, //ms
    });
    const res = await http({
      url: import.meta.env.VITE_NOTION_DATABASE_API + import.meta.env.VITE_NOTION_DATABASE_ID + '/query',
      method: 'post',
      headers: this.headers,
    });

    return this.list2Events(res.data.results);
  }

  list2Events(results: []) {
    const events = results.map((element: any) => {
      return {
        'id': element.id,
        'title': element.properties?.title?.rich_text[0].plain_text,
        'start': element.properties?.start?.date.start,
        'end': element.properties?.end?.date.start,
      };
    });

    return events;
  }
}
