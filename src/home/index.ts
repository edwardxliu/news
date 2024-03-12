import './index.css';

import { cloneNode } from '@finsweet/ts-utils';

import { fetchData, getCurrentDate } from '$utils/api';
import { directToSearch } from '$utils/event';
import type { NewsData, NewsDataStat } from '$utils/types';

let oldPageIndex: number = 1; // 导航栏历史index
let curPageIndex: number = 1; // 导航栏当前index
const perPage: number = 10; // 每页显示item数量，默认10
const currentDate: string = getCurrentDate();

class GlobalState {
  private variables: { [key: string]: number | HTMLDivElement[] } = {};
  constructor(initVals: { [key: string]: number | HTMLDivElement[] }) {
    this.variables = initVals;
  }
  setValue(key: string, val: number | HTMLDivElement[]) {
    if (key in this.variables) {
      this.variables[key] = val;
    } else {
      console.log(`No such variable '${key}' found`);
    }
  }
  getValue<T>(key: string): T {
    return this.variables[key] as T;
  }
}

const globalState = new GlobalState({
  fgwTotItems: 0,
  wechatTotItems: 0,
  gzdtTotItems: 0,
  fgwOldItemsHistory: [], // 历史item数组
  fgwOldItemsToday: [],
  wechatOldItemsHistory: [],
  wechatOldItemsToday: [],
  gzdtOldItemsHistory: [],
  gzdtOldItemsToday: [],
});

window.Webflow ||= [];
window.Webflow.push(() => {
  directToSearch();

  handleNews('fgw', 'fgwTotItems', 'fgwOldItemsToday', 'fgwOldItemsHistory');
  handleNews('wechat', 'wechatTotItems', 'wechatOldItemsToday', 'wechatOldItemsHistory');
  handleNews('gzdt', 'gzdtTotItems', 'gzdtOldItemsToday', 'gzdtOldItemsHistory');

  const searchInput = document.querySelector<HTMLInputElement>('[data-element="search-input"]');
  const searchButton = document.querySelector<HTMLButtonElement>('[data-element="search-button"]');
  console.log(searchInput, searchButton);
});

async function handleNews(key: string, glTotItems: string, glbToday: string, glbHistory: string) {
  // 获取数据总数量和总分页数，分页通过perPage计算。
  const item_stat: NewsDataStat[] = await fetchData<NewsDataStat>(
    `http://metro-info.edwardxwliu.cn:5000/stat?key=${key}&per_page=${perPage}`
  );
  globalState.setValue(glTotItems, item_stat[0].tot_items);
  loadItems(key, oldPageIndex, glbToday, glbHistory); // 加载item数组
  setInterval(() => updateNews(key, glTotItems, glbToday, glbHistory), 5000); // 页面更新判断每5秒一次
}

/**
 * 通过判断item总数的变化来决定是否更新页面
 */
async function updateNews(key: string, glTotItems: string, glbToday: string, glbHistory: string) {
  if (curPageIndex === 1) {
    // 当用户在第1页时才触发更新，否则不触发
    const item_stat: NewsDataStat[] = await fetchData<NewsDataStat>(
      `http://metro-info.edwardxwliu.cn:5000/stat?key=${key}&per_page=${perPage}`
    );
    const newTotItems = item_stat[0].tot_items;
    const oldTotItems = globalState.getValue(glTotItems);
    if (newTotItems !== oldTotItems) {
      // oldTotItems = newTotItems;
      globalState.setValue(glTotItems, newTotItems);
      loadItems(key, oldPageIndex, glbToday, glbHistory); // 加载item数组
    }
  }
}

/**
 * 创建消息item
 * @param param0 一个{@link newsData}对象
 * @param itemTemplate webflow模板
 * @returns 一个{@link HTMLDivElement}对象
 */
const createNewsItem = (
  key: string,
  { type, title, pic_url, url, p_date }: NewsData,
  itemTemplate: HTMLDivElement
) => {
  const item = cloneNode(itemTemplate);
  // console.log(itemTemplate, pic_url);
  const typeElement = item.querySelector<HTMLDivElement>(`[data-element="${key}-type"]`);
  const titleElement = item.querySelector<HTMLLinkElement>(`[data-element="${key}-title"]`);
  // const previewElement = item.querySelector<HTMLDivElement>('[data-element="news-preview');
  // const orgElement = item.querySelector<HTMLDivElement>('[data-element="news-org"]');
  const dateElement = item.querySelector<HTMLDivElement>(`[data-element="${key}-date"]`);
  // const imgElement = item.querySelector<HTMLDivElement>(`[data-element="${key}-img-preview"]`);
  const imgElement = item.querySelector<HTMLImageElement>(`[data-element="${key}-img-preview"]`);
  // 赋值
  if (typeElement) {
    typeElement.textContent = type;
  }
  if (titleElement) {
    titleElement.textContent = title;
    titleElement.href = url;
  }

  if (dateElement) {
    dateElement.textContent = p_date;
  }

  if (imgElement) {
    // imgElement.style.backgroundImage = `url(${pic_url})`;
    imgElement.src = pic_url;
  }
  item.removeAttribute('data-cloak'); // 移除遮挡style
  return item;
};

/**
 * 罗列并呈现items
 * @param page 当前页
 * @returns 异常返回
 */
const loadItems = async (key: string, page: number, glbToday: string, glbHistory: string) => {
  curPageIndex = page;
  if (page < 1) return;
  // 获取item json数据
  // const newsData: NewsData[] = await fetchData<NewsData>(
  //   `http://metro-info.edwardxwliu.cn:5000/search?page=${page}&per_page=${perPage}`
  // );

  const todayNews: NewsData[] = await fetchData<NewsData>(
    `http://metro-info.edwardxwliu.cn:5000/search?key=${key}&page=${page}&per_page=${perPage}&date=${currentDate}&today=1`
  );
  const historyNews: NewsData[] = await fetchData<NewsData>(
    `http://metro-info.edwardxwliu.cn:5000/search?key=${key}&page=${page}&per_page=${perPage}&date=${currentDate}`
  );

  // 有异常或没有数据返回到根目录
  if (!historyNews) {
    window.location.replace('/');
    return;
  }

  // const todayNews = newsData.filter((data) => data.p_date === currentDate);
  // const historyNews = newsData.filter((data) => data.p_date !== currentDate);

  const itemTemplateToday = document.querySelector<HTMLDivElement>(
    `[data-element="${key}-item-today"]`
  ); // 获取webflow模板
  const itemTemplateHistory = document.querySelector<HTMLDivElement>(
    `[data-element="${key}-item-history"]`
  );

  const itemMoreWrapperToday = document.querySelector<HTMLDivElement>(
    `[data-element="${key}-more-today"]`
  );
  const itemMoreWrapperHistory = document.querySelector<HTMLDivElement>(
    `[data-element="${key}-more-history"]`
  );

  if (
    !itemTemplateToday ||
    !itemTemplateHistory ||
    !itemMoreWrapperToday ||
    !itemMoreWrapperHistory
  ) {
    return;
  }

  itemMoreWrapperToday.hidden = todayNews.length < 10 ? true : false;
  // itemMoreWrapperHistory.hidden = historyNews.length < perPage ? true : false;

  if (todayNews.length > 0) {
    const itemListToday = itemTemplateToday.parentElement!;
    const newsItemsToday = todayNews.map((data) => createNewsItem(key, data, itemTemplateToday));

    const oldItemsToday: HTMLDivElement[] = globalState.getValue<HTMLDivElement[]>(glbToday);

    if (oldItemsToday) {
      oldItemsToday.map((child) => itemListToday.removeChild(child));
    }
    itemListToday.append(...newsItemsToday);
    // oldItemsToday = newsItemsToday;
    globalState.setValue(glbToday, newsItemsToday);
  }

  if (historyNews.length > 0) {
    const itemListHistory = itemTemplateHistory.parentElement!; // 获取item模板父元素item list component
    // itemTemplate.remove(); // 删除模板

    const newsItemsHistory = historyNews.map((data) =>
      createNewsItem(key, data, itemTemplateHistory)
    ); // 使用模板初始化item数据

    const oldItemsHistory: HTMLDivElement[] = globalState.getValue<HTMLDivElement[]>(glbHistory);
    // 从itemList中清除历史数据
    if (oldItemsHistory) {
      oldItemsHistory.map((child) => itemListHistory.removeChild(child));
    }

    itemListHistory.append(...newsItemsHistory); // 给itemList追加新数据
    // oldItemsHistory = newsItemsHistory; // 更新保存历史数据
    globalState.setValue(glbHistory, newsItemsHistory);
  }

  oldPageIndex = page; // 更新历史导航index
};
