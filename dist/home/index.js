"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // node_modules/.pnpm/@finsweet+ts-utils@0.40.0/node_modules/@finsweet/ts-utils/dist/helpers/cloneNode.js
  var cloneNode = (node, deep = true) => node.cloneNode(deep);

  // src/utils/api.ts
  var fetchNewsDatabase = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return data;
    } catch (err) {
      return [];
    }
  };
  var fetchNewsStatDatabase = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return data;
    } catch (err) {
      return [];
    }
  };

  // src/home/index.ts
  var currentPage = 1;
  var perPage = 10;
  var oldItems = [];
  var totPages = 1;
  window.Webflow ||= [];
  window.Webflow.push(async () => {
    const item_stat = await fetchNewsStatDatabase(
      `http://metro-info.edwardxwliu.cn:5000/stat?per_page=${perPage}`
    );
    totPages = item_stat.tot_pages;
    loadItems(currentPage);
    const nextButton = document.querySelector('[data-element="next-page"]');
    const previousButton = document.querySelector(
      '[data-element="previous-page"]'
    );
    if (nextButton) {
      nextButton.addEventListener("click", () => {
        loadItems(currentPage + 1);
      });
    }
    if (previousButton) {
      previousButton.addEventListener("click", () => {
        loadItems(currentPage - 1);
      });
    }
    loadPageIndex(1, 10);
  });
  var createPageIndex = (index, itemTemplate) => {
    const item = cloneNode(itemTemplate);
    if (item) {
      item.textContent = index.toString();
      item.setAttribute("page-nav-index", index.toString());
    }
    item.addEventListener("click", () => {
      if (!item.disabled) {
        loadItems(index);
      }
    });
    return item;
  };
  var loadPageIndex = async (stPage, edPage) => {
    const pageIndexTemplate = document.querySelector(
      '[data-element="page-index"]'
    );
    if (!pageIndexTemplate)
      return;
    const pageIndexList = pageIndexTemplate.parentElement;
    pageIndexTemplate.remove();
    for (let i = stPage; i <= edPage; i++) {
      pageIndexList.append(createPageIndex(i, pageIndexTemplate));
    }
  };
  var createNewsItem = ({ type, title, url, preview, p_date, org }, itemTemplate) => {
    const item = cloneNode(itemTemplate);
    const typeElement = item.querySelector('[data-element="news-type"]');
    const titleElement = item.querySelector('[data-element="news-title"]');
    const previewElement = item.querySelector('[data-element="news-preview');
    const orgElement = item.querySelector('[data-element="news-org"]');
    const dateElement = item.querySelector('[data-element="news-date"]');
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
    item.removeAttribute("data-cloak");
    return item;
  };
  var loadItems = async (page) => {
    if (page < 1 || page > totPages)
      return;
    const newsData = await fetchNewsDatabase(
      `http://metro-info.edwardxwliu.cn:5000/search?page=${page}&per_page=${perPage}`
    );
    if (!newsData) {
      window.location.replace("/");
      return;
    }
    const itemTemplate = document.querySelector('[data-element="news-item"]');
    if (!itemTemplate)
      return;
    const itemList = itemTemplate.parentElement;
    const newsItems = newsData.map((data) => createNewsItem(data, itemTemplate));
    if (oldItems) {
      oldItems.map((child) => itemList.removeChild(child));
    }
    itemList.append(...newsItems);
    oldItems = newsItems;
    handleNavButtons(page);
    currentPage = page;
  };
  function handleNavButtons(page) {
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
  var pageButActive = (pageIndex) => {
    const item = document.querySelector(`[page-nav-index="${pageIndex}"]`);
    item?.classList.add("page-index_active");
    if (item)
      item.disabled = true;
  };
  var pageButInactive = (pageIndex) => {
    const item = document.querySelector(`[page-nav-index="${pageIndex}"]`);
    item?.classList.remove("page-index_active");
    if (item)
      item.disabled = false;
  };
  var pageButRemove = (pageIndex) => {
    const item = document.querySelector(`[page-nav-index="${pageIndex}"]`);
    item?.remove();
  };
  var cleanPageIndex = (page) => {
    const pageIndexWrap = document.querySelector('[data-element="page-index-wrap"]');
    if (!pageIndexWrap)
      return;
    const st_i = pageIndexWrap.firstElementChild?.getAttribute("page-nav-index");
    const ed_i = pageIndexWrap.lastElementChild?.getAttribute("page-nav-index");
    if (st_i && ed_i) {
      for (let i = +st_i; i <= +ed_i; i++) {
        if (i !== page)
          pageButRemove(i);
      }
    }
  };
})();
//# sourceMappingURL=index.js.map
