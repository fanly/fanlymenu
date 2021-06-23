'use strict';
import axios from 'axios';
import wrapper from 'axios-cache-plugin';
export default class EventService {
  notion_api_key: string;
  notion_database_id: string;
  constructor(notion_api_key: string, notion_database_id: string) {
    this.notion_api_key = notion_api_key;
    this.notion_database_id = notion_database_id;
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
        headers: this.getHeaders(),
        data: {
          'parent': { 'type': 'database_id', 'database_id': this.notion_database_id },
          'properties': this.getParams(title, start, end),
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
        headers: this.getHeaders(),
        data: {
          'properties': this.getParams(title, start, end),
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
      url: import.meta.env.VITE_NOTION_DATABASE_API + this.notion_database_id + '/query',
      method: 'post',
      headers: this.getHeaders(),
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

  // 增加 set
  setApiKey(notion_api_key: string): this {
    if (notion_api_key === '') {
      return this;
    }
    this.notion_api_key = notion_api_key;
    return this;
  }

  setDatabaseId(notion_database_id: string): this {
    if (notion_database_id === '') {
      return this;
    }
    this.notion_database_id = notion_database_id;
    return this;
  }

  getHeaders(): any {
    return {
      'Notion-Version': import.meta.env.VITE_NOtion_VERSION,
      'Authorization': 'Bearer '+ this.notion_api_key,
    };
  }

  getParams(
    title: string,
    start: Date,
    end: Date,
  ): any {
    return {
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
    };
  }
}
