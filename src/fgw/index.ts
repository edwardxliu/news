import './index.css';

import { cloneNode } from '@finsweet/ts-utils';

import { fetchData } from '$utils/api';
import type { NewsData, NewsDataStat } from '$utils/types';

let oldPageIndex: number = 1; // 导航栏历史index
let curPageIndex: number = 1; // 导航栏当前index
const perPage: number = 10; // 每页显示item数量，默认10
let oldItems: HTMLDivElement[] = []; // 历史item数组
let totPages: number = 1; // 导航栏总标签数，初始化为1
let totItems: number = 0; // item总数，初始化0
const maxShowNavIndex: number = 10; // 页面显示最多页数
const midShowNavIndex: number = Math.floor(maxShowNavIndex / 2);
let clickTimeour: number | null = null;
const key: string = 'fgw';

window.Webflow ||= [];
window.Webflow.push(async () => {
  // 获取数据总数量和总分页数，分页通过perPage计算。
  const item_stat: NewsDataStat[] = await fetchData<NewsDataStat>(
    `http://localhost:5000/stat?key=${key}&per_page=${perPage}`
  );
  totPages = item_stat[0].tot_pages; // 更新总页数
  totItems = item_stat[0].tot_items;
  loadItems(oldPageIndex); // 加载item数组
  initBeforeNextButtons();
  setInterval(updatePage, 5000); // 页面更新判断每5秒一次
});

/**
 * 通过判断item总数的变化来决定是否更新页面
 */
async function updatePage() {
  if (curPageIndex === 1) {
    // 当用户在第1页时才触发更新，否则不触发
    const item_stat: NewsDataStat[] = await fetchData<NewsDataStat>(
      `http://localhost:5000/stat?key=${key}&per_page=${perPage}`
    );
    const newTotItems = item_stat[0].tot_items;
    if (newTotItems !== totItems) {
      totItems = newTotItems;
      totPages = item_stat[0].tot_pages;
      loadItems(curPageIndex);
    }
  }
}

/**
 * 初始化翻页按钮
 */
function initBeforeNextButtons() {
  const nextButton = document.querySelector<HTMLButtonElement>('[data-element="next-page"]');
  const previousButton = document.querySelector<HTMLButtonElement>(
    '[data-element="previous-page"]'
  );

  // 绑定加载item事件
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      loadItems(oldPageIndex + 1);
    });
  }
  if (previousButton) {
    previousButton.addEventListener('click', () => {
      loadItems(oldPageIndex - 1);
    });
  }
}

/**
 * 创建一个导航栏index按钮
 * @param index 导航index
 * @param itemTemplate webflow模板
 * @returns 一个{@link HTMLButtonElement}对象
 */
const createPageIndex = (index: number, itemTemplate: HTMLButtonElement) => {
  const item = cloneNode(itemTemplate);
  // 设置item的属性和显示值
  if (item) {
    item.textContent = index.toString();
    item.setAttribute('page-nav-index', index.toString());
  }
  // 绑定鼠标单击事件
  item.addEventListener('click', () => {
    if (!clickTimeour) {
      // 防止双击事件
      clickTimeour = window.setTimeout(() => {
        clickTimeour = null;
        // 防止触发再次点击
        if (!item.disabled) {
          loadItems(index); // 加载数据页
        }
      }, 500);
    }
  });
  return item;
};

/**
 * 创建页码导航栏
 * @param stPage  导航起始页码
 * @param edPage  导航结束页码
 * @returns 异常
 */
const cratePageNav = async (stPage: number, edPage: number) => {
  const pageIndexTemplate = document.querySelector<HTMLButtonElement>(
    '[data-element="page-index"]'
  );
  if (!pageIndexTemplate) return;
  const pageIndexList = pageIndexTemplate.parentElement!;
  pageIndexTemplate.remove();
  pageIndexTemplate.classList.remove('page-index_active'); // 默认不激活按钮

  for (let i = stPage; i <= edPage; i++) {
    pageIndexList.append(createPageIndex(i, pageIndexTemplate));
  }
};

/**
 * 创建消息item
 * @param param0 一个{@link newsData}对象
 * @param itemTemplate webflow模板
 * @returns 一个{@link HTMLDivElement}对象
 */
const createNewsItem = (
  { type, title, url, preview, p_date, org }: NewsData,
  itemTemplate: HTMLDivElement
) => {
  const item = cloneNode(itemTemplate);
  const typeElement = item.querySelector<HTMLDivElement>('[data-element="news-type"]');
  const titleElement = item.querySelector<HTMLLinkElement>('[data-element="news-title"]');
  const previewElement = item.querySelector<HTMLDivElement>('[data-element="news-preview');
  const orgElement = item.querySelector<HTMLDivElement>('[data-element="news-org"]');
  const dateElement = item.querySelector<HTMLDivElement>('[data-element="news-date"]');
  // 赋值
  if (typeElement) {
    typeElement.textContent = type;
  }
  if (titleElement) {
    titleElement.textContent = title;
    titleElement.href = url;
  }
  if (previewElement) {
    previewElement.textContent = preview;
  }
  if (orgElement) {
    orgElement.textContent = org;
  }
  if (dateElement) {
    dateElement.textContent = p_date;
  }

  item.removeAttribute('data-cloak'); // 移除遮挡style
  return item;
};

/**
 * 罗列并呈现items
 * @param page 当前页
 * @returns 异常返回
 */
const loadItems = async (page: number) => {
  curPageIndex = page;
  if (page < 1 || page > totPages) return;
  // 获取item json数据
  const newsData: NewsData[] = await fetchData<NewsData>(
    `http://localhost:5000/search?key=${key}&page=${page}&per_page=${perPage}`
  );
  // 有异常或没有数据返回到根目录
  if (!newsData) {
    window.location.replace('/');
    return;
  }

  const itemTemplate = document.querySelector<HTMLDivElement>('[data-element="news-item"]'); // 获取webflow模板
  if (!itemTemplate) return;
  const itemList = itemTemplate.parentElement!; // 获取item模板父元素item list component

  const newsItems = newsData.map((data) => createNewsItem(data, itemTemplate)); // 使用模板初始化item数据
  // 从itemList中清除历史数据
  if (oldItems) {
    oldItems.map((child) => itemList.removeChild(child));
  }
  itemTemplate.remove(); // 删除模板

  itemList.append(...newsItems); // 给itemList追加新数据
  oldItems = newsItems; // 更新保存历史数据
  handleNavButtons(page); // 更新导航栏按钮状态和布局
  oldPageIndex = page; // 更新历史导航index
};

/**
 * 更新底部导航栏状态
 * @param page 当前页码
 */
function handleNavButtons(page: number) {
  // 总页数大于1时需要处理
  if (totPages > 1) {
    // 清空除当前页以外的其它导航按钮
    cleanPageIndex(page);
    if (totPages <= maxShowNavIndex) {
      // 总页数小于最大显示页码时，只创建从1到最大页码的导航按钮
      cratePageNav(1, totPages);
    } else if (page + midShowNavIndex > totPages) {
      // 当前页面距离最终页过近，不调整导航栏布局（最右）
      cratePageNav(totPages - maxShowNavIndex + 1, totPages);
    } else if (page <= midShowNavIndex) {
      // 当前页小于最长显示页数的一半，不调整导航栏布局（最左）
      cratePageNav(1, maxShowNavIndex);
    } else if (page > midShowNavIndex) {
      // 其余情况：当前页大于最长显示页数一半，并且没有达到尾端（中间），调整导航栏布局
      cratePageNav(page - midShowNavIndex, page + midShowNavIndex);
    }
  }
  // 当前页按钮样式激活
  pageButActive(page);
  if (page !== oldPageIndex) {
    // 取消上一次激活的按钮
    pageButInactive(oldPageIndex);
  }
  // 如果当前页码为1时，激活上一页按钮；反之消除。
  if (page === 1) {
    pageButActive(0);
  } else {
    pageButInactive(0);
  }
  // 如果当前页码=最大页码数时，激活下一页按钮；反之消除。
  if (page === totPages) {
    pageButActive(-1);
  } else {
    pageButInactive(-1);
  }
}

/**
 * 激活导航栏按钮样式
 * @param pageIndex 导航栏按钮index
 */
const pageButActive = (pageIndex: number) => {
  const item = document.querySelector<HTMLButtonElement>(`[page-nav-index="${pageIndex}"]`);
  item?.classList.add('page-index_active');
  if (item) item.disabled = true; // 激活后禁用点击
};

/**
 * 取消导航栏按钮激活样式
 * @param pageIndex 导航栏按钮index
 */
const pageButInactive = (pageIndex: number) => {
  const item = document.querySelector<HTMLButtonElement>(`[page-nav-index="${pageIndex}"]`);
  item?.classList.remove('page-index_active');
  if (item) item.disabled = false; // 允许点击
};

/**
 * 删除导航栏页码按钮
 * @param pageIndex 导航栏按钮index
 */
const pageButRemove = (pageIndex: number) => {
  const item = document.querySelector<HTMLButtonElement>(`[page-nav-index="${pageIndex}"]`);
  item?.remove();
};

/**
 * 清空除输入参数指定的按钮之外的其它导航栏页码按钮
 * @param page 导航栏按钮index
 * @returns 异常
 */
const cleanPageIndex = (page: number) => {
  const pageIndexWrap = document.querySelector<HTMLDivElement>('[data-element="page-index-wrap"]');

  if (!pageIndexWrap) return;
  // 获得导航栏起始index
  const st_i = pageIndexWrap.firstElementChild?.getAttribute('page-nav-index');
  // 获得导航栏结束index
  const ed_i = pageIndexWrap.lastElementChild?.getAttribute('page-nav-index');

  if (st_i && ed_i) {
    for (let i: number = +st_i; i <= +ed_i; i++) {
      if (i !== page) pageButRemove(i);
    }
  }
};
