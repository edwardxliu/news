"use strict";(()=>{var u=(e,t=!0)=>e.cloneNode(t);async function d(e){try{let t=await fetch(e);return t.ok?await t.json():[]}catch{return[]}}var m=1,b=1,S=10,x=[],r=1,E=0,f=10,l=Math.floor(f/2),w=null,y="wechat";window.Webflow||(window.Webflow=[]);window.Webflow.push(async()=>{let e=await d(`http://localhost:5000/stat?key=${y}&per_page=${S}`);r=e[0].tot_pages,E=e[0].tot_items,c(m),I(),setInterval(D,5e3)});async function D(){if(b===1){let e=await d(`http://localhost:5000/stat?key=${y}&per_page=${S}`),t=e[0].tot_items;t!==E&&(E=t,r=e[0].tot_pages,c(b))}}function I(){let e=document.querySelector('[data-element="next-page"]'),t=document.querySelector('[data-element="previous-page"]');e&&e.addEventListener("click",()=>{c(m+1)}),t&&t.addEventListener("click",()=>{c(m-1)})}var _=(e,t)=>{let n=u(t);return n&&(n.textContent=e.toString(),n.setAttribute("page-nav-index",e.toString())),n.addEventListener("click",()=>{w||(w=window.setTimeout(()=>{w=null,n.disabled||c(e)},500))}),n},p=async(e,t)=>{let n=document.querySelector('[data-element="page-index"]');if(!n)return;let a=n.parentElement;n.remove(),n.classList.remove("page-index_active");for(let o=e;o<=t;o++)a.append(_(o,n))},k=({title:e,pic_url:t,url:n,p_date:a,content:o},s)=>{let i=u(s);i.href=n;let L=i.querySelector('[data-element="news-title"]'),h=i.querySelector('[data-element="news-preview'),T=i.querySelector('[data-element="news-date"]'),N=i.querySelector('[data-element="news-img-preview"]');return L&&(L.textContent=e),h&&(h.textContent=o),T&&(T.textContent=a),N&&(N.src=t),i.removeAttribute("data-cloak"),i},c=async e=>{if(b=e,e<1||e>r)return;let t=await d(`http://localhost:5000/search?key=${y}&page=${e}&per_page=${S}`);if(!t){window.location.replace("/");return}let n=document.querySelector('[data-element="news-item"]');if(!n)return;let a=n.parentElement,o=t.map(s=>k(s,n));x&&x.map(s=>a.removeChild(s)),n.remove(),a.append(...o),x=o,M(e),m=e};function M(e){r>1&&(B(e),r<=f?p(1,r):e+l>r?p(r-f+1,r):e<=l?p(1,f):e>l&&p(e-l,e+l)),g(e),e!==m&&v(m),e===1?g(0):v(0),e===r?g(-1):v(-1)}var g=e=>{let t=document.querySelector(`[page-nav-index="${e}"]`);t?.classList.add("page-index_active"),t&&(t.disabled=!0)},v=e=>{let t=document.querySelector(`[page-nav-index="${e}"]`);t?.classList.remove("page-index_active"),t&&(t.disabled=!1)},H=e=>{document.querySelector(`[page-nav-index="${e}"]`)?.remove()},B=e=>{let t=document.querySelector('[data-element="page-index-wrap"]');if(!t)return;let n=t.firstElementChild?.getAttribute("page-nav-index"),a=t.lastElementChild?.getAttribute("page-nav-index");if(n&&a)for(let o=+n;o<=+a;o++)o!==e&&H(o)};})();
