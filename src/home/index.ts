import './index.css';

import { cloneNode } from '@finsweet/ts-utils';

import { fetchNewsDatabase, fetchNewsStatDatabase } from '$utils/api';
import type { NewsData } from '$utils/types';

let currentPage: number = 1;
const perPage = 10;
let oldItems: HTMLDivElement[] = [];
// const itemTemplate = document.querySelector<HTMLDivElement>('[data-element="news-item"]');
let totPages: number = 1;
// let pre_page:number = 0;

window.Webflow ||= [];
window.Webflow.push(async () => {
  const item_stat = await fetchNewsStatDatabase(
    `http://metro-info.edwardxwliu.cn:5000/stat?per_page=${perPage}`
  );
  totPages = item_stat.tot_pages;
  loadItems(currentPage);

  // create before and next button and add events
  const nextButton = document.querySelector<HTMLButtonElement>('[data-element="next-page"]');
  const previousButton = document.querySelector<HTMLButtonElement>(
    '[data-element="previous-page"]'
  );

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      loadItems(currentPage + 1);
    });
  }
  if (previousButton) {
    previousButton.addEventListener('click', () => {
      loadItems(currentPage - 1);
    });
  }

  // create page index buttons
  loadPageIndex(1, 10);

  // handleNavButtons(currentPage);
});

const createPageIndex = (index: number, itemTemplate: HTMLButtonElement) => {
  const item = cloneNode(itemTemplate);

  if (item) {
    item.textContent = index.toString();
    item.setAttribute('page-nav-index', index.toString());
  }
  item.addEventListener('click', () => {
    if (!item.disabled) {
      loadItems(index);
    }
  });
  return item;
};

const loadPageIndex = async (stPage: number, edPage: number) => {
  // find the index template
  const pageIndexTemplate = document.querySelector<HTMLButtonElement>(
    '[data-element="page-index"]'
  );
  if (!pageIndexTemplate) return;
  // find page index wrapper
  const pageIndexList = pageIndexTemplate.parentElement!;
  pageIndexTemplate.remove();

  for (let i = stPage; i <= edPage; i++) {
    pageIndexList.append(createPageIndex(i, pageIndexTemplate));
  }
};

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

  // console.log(item, typeElement, titleElement);
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

  item.removeAttribute('data-cloak');
  return item;
};

const loadItems = async (page: number) => {
  // console.log(page);

  if (page < 1 || page > totPages) return;
  const newsData = await fetchNewsDatabase(
    `http://metro-info.edwardxwliu.cn:5000/search?page=${page}&per_page=${perPage}`
  );
  if (!newsData) {
    window.location.replace('/');
    return;
  }

  const itemTemplate = document.querySelector<HTMLDivElement>('[data-element="news-item"]');
  if (!itemTemplate) return;

  const itemList = itemTemplate.parentElement!;
  // itemTemplate.remove();

  const newsItems = newsData.map((data) => createNewsItem(data, itemTemplate));
  // console.log(oldItems);
  if (oldItems) {
    oldItems.map((child) => itemList.removeChild(child));
  }

  itemList.append(...newsItems);
  oldItems = newsItems;
  handleNavButtons(page);
  currentPage = page;
};

function handleNavButtons(page: number) {
  if (page + 4 > totPages) {
    cleanPageIndex(page);
    loadPageIndex(totPages - 9, totPages);
  } else if (page > 6) {
    cleanPageIndex(page);
    loadPageIndex(page - 5, page + 4);
  } else if (page <= 6) {
    cleanPageIndex(page);
    loadPageIndex(1, 10);
  }
  pageButActive(page);
  if (page !== currentPage) {
    pageButInactive(currentPage);
  }
  if (page === 1) {
    pageButActive(0);
  } else {
    pageButInactive(0);
  }
  if (page === totPages) {
    pageButActive(-1);
  } else {
    pageButInactive(-1);
  }
}

const pageButActive = (pageIndex: number) => {
  const item = document.querySelector<HTMLButtonElement>(`[page-nav-index="${pageIndex}"]`);
  // console.log(item?.textContent, pageIndex);
  item?.classList.add('page-index_active');
  if (item) item.disabled = true;
};

const pageButInactive = (pageIndex: number) => {
  const item = document.querySelector<HTMLButtonElement>(`[page-nav-index="${pageIndex}"]`);
  item?.classList.remove('page-index_active');
  if (item) item.disabled = false;
};

const pageButRemove = (pageIndex: number) => {
  const item = document.querySelector<HTMLButtonElement>(`[page-nav-index="${pageIndex}"]`);
  item?.remove();
};

const cleanPageIndex = (page: number) => {
  const pageIndexWrap = document.querySelector<HTMLDivElement>('[data-element="page-index-wrap"]');

  if (!pageIndexWrap) return;
  const st_i = pageIndexWrap.firstElementChild?.getAttribute('page-nav-index');
  const ed_i = pageIndexWrap.lastElementChild?.getAttribute('page-nav-index');

  if (st_i && ed_i) {
    for (let i: number = +st_i; i <= +ed_i; i++) {
      if (i !== page) pageButRemove(i);
    }
  }
};
