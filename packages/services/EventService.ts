'use strict';
import axios from 'axios';
import wrapper from 'axios-cache-plugin';
import type { EventInput } from '@fullcalendar/vue3';
import type { Page } from '../renderer/types/custom';
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
  async postEvent(event: EventInput): Promise<any> {
      const http = wrapper(axios, {
        maxCacheSize: 15,
      });
      const res = await http({
        url: import.meta.env.VITE_NOTION_PAGE_API,
        method: 'post',
        headers: this.getHeaders(),
        data: {
          'parent': { 'type': 'database_id', 'database_id': this.notion_database_id },
          'properties': this.getParams(event),
        },
      });

      return res;
  }

  /**
   * 更新 title 或者 start、end 到 Notion API
   */
  async patchEvent(event: EventInput): Promise<any> {
      const http = wrapper(axios, {
        maxCacheSize: 15,
      });
      const res = await http({
        url: import.meta.env.VITE_NOTION_PAGE_API + '/' + event.id,
        method: 'patch',
        headers: this.getHeaders(),
        data: {
          'properties': this.getParams(event),
        },
      });

      return res;
  }

  async getEvents(): Promise<EventInput[]> {
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

  list2Events(results: []): EventInput[] {
    const events = results.map((element: Page) => {
      return {
        'id': element.id,
        'title': element.properties?.title?.rich_text[0].plain_text,
        'start': element.properties?.start?.date.start,
        'end': element.properties?.end?.date.start,
      } as EventInput;
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

  getHeaders(): {
    'Notion-Version': string,
    'Authorization': string,
  } {
    return {
      'Notion-Version': import.meta.env.VITE_NOtion_VERSION,
      'Authorization': 'Bearer '+ this.notion_api_key,
    };
  }

  getParams(event: EventInput): any {
    return {
      'title': {
        'type': 'rich_text',
        'rich_text': [{
          'type': 'text',
          'text': { 'content': event.title },
        }],
      },
      'start': {
        'type': 'date',
        'date': { 'start': event.start },
      },
      'end': {
        'type': 'date',
        'date': { 'start': event.end },
      },
    };
  }
}
