import './index.css';

import { cloneNode } from '@finsweet/ts-utils';

import { fetchData } from '$utils/api';
import type { NewsData } from '$utils/types';
let oldItems: HTMLLinkElement[] = []; // 历史item数组

window.Webflow ||= [];
window.Webflow.push(async () => {
  // 获取search input值
  const urlParams = new URLSearchParams(window.location.search);
  const inputVal = urlParams.get('query');

  const searchInput = document.querySelector<HTMLInputElement>('[data-element="search-input"]');

  const searchForm = document.querySelector<HTMLFormElement>('[data-element="search-form"]');

  const searchInputSide = document.querySelector<HTMLInputElement>(
    '[data-element="search-input-side"]'
  );
  const searchFormSide = document.querySelector<HTMLFormElement>(
    '[data-element="search-form-side"]'
  );

  if (!searchInput) return;
  if (!searchInputSide) return;
  if (!searchForm) return;
  if (!searchFormSide) return;
  if (inputVal) {
    searchInput.value = inputVal;
    searchInputSide.value = inputVal;
    loadItems(searchInput.value);
  }

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const inputVal = searchInput.value;
    // loadItems(searchInput.value);
    // directToSearch();
    window.location.href = `/search.html?query=${encodeURIComponent(inputVal)}`;
  });

  searchFormSide?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!searchInputSide) return;
    const inputVal = searchInputSide.value;
    window.location.href = `/search.html?query=${encodeURIComponent(inputVal)}`;
  });
  // const item = cloneNode(url);
  // search_container?.append(item);

  // loadItems(oldPageIndex); // 加载item数组
  // setInterval(updatePage, 5000); // 页面更新判断每5秒一次
});

/**
 * 创建消息item
 * @param param0 一个{@link newsData}对象
 * @param itemTemplate webflow模板
 * @returns 一个{@link HTMLDivElement}对象
 */
const createNewsItem = (
  { url, title, content, org, p_date }: NewsData,
  itemTemplate: HTMLLinkElement
) => {
  const item = cloneNode(itemTemplate);
  // const linkElement = item.querySelector<HTMLLinkElement>('[data-element="search-link"]');
  const titleElement = item.querySelector<HTMLHeadingElement>('[data-element="search-title"]');
  const orgElement = item.querySelector<HTMLDivElement>('[data-element="search-org"]');
  const dateElement = item.querySelector<HTMLParagraphElement>('[data-element="search-date"]');
  const snippetElement = item.querySelector<HTMLDivElement>('[data-element="search-snippet"]');

  // 赋值
  if (item) {
    item.href = url;
  }
  if (titleElement) {
    titleElement.innerHTML = title;
  }
  if (orgElement) {
    orgElement.textContent = org;
  }
  if (dateElement) {
    dateElement.textContent = p_date;
  }
  if (snippetElement) {
    snippetElement.innerHTML = content;
  }
  item.removeAttribute('data-cloak'); // 移除遮挡style
  return item;
};

/**
 * 罗列并呈现items
 * @param page 当前页
 * @returns 异常返回
 */
const loadItems = async (searchInput: string) => {
  // 获取search input

  // 获取item json数据
  const newsData: NewsData[] = await fetchData<NewsData>(
    `http://metro-info.edwardxwliu.cn:5000/query?value=${searchInput}`
  );
  // 有异常或没有数据返回到根目录
  if (!newsData) {
    window.location.replace('/');
    return;
  }

  const itemTemplate = document.querySelector<HTMLLinkElement>('[data-element="search-link"]');

  if (!itemTemplate) return;
  const itemList = document.querySelector<HTMLDivElement>('[data-element="search-grid"]'); // 获取webflow模板
  if (!itemList) return;

  const newsItems = newsData.map((data) => createNewsItem(data, itemTemplate)); // 使用模板初始化item数据

  if (oldItems) {
    oldItems.map((child) => itemList.removeChild(child));
  }

  itemTemplate.remove(); // 删除模板
  const secondItemTemplate = document.querySelector<HTMLLinkElement>(
    '[data-element="search-link"]'
  );
  if (secondItemTemplate) secondItemTemplate.remove(); // 删除模板

  itemList.append(...newsItems); // 给itemList追加新数据
  oldItems = newsItems; // 更新保存历史数据
};
