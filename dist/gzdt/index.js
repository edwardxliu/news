"use strict";(()=>{var c=(e,t=!0)=>e.cloneNode(t);async function u(e){try{let t=await fetch(e);return t.ok?await t.json():[]}catch{return[]}}function d(){window.scrollTo({top:0,behavior:"smooth"})}function y(){let e=document.querySelector('[data-element="search-input-side"]'),t=document.querySelector('[data-element="search-form-side"]');t&&t.addEventListener("submit",o=>{if(o.preventDefault(),!e)return;let r=e.value;window.location.href=`/search?query=${encodeURIComponent(r)}`})}var m=1,b=1,T=30,x=[],a=1,S=0,p=10,s=Math.floor(p/2),w=null,h="gzdt";window.Webflow||(window.Webflow=[]);window.Webflow.push(async()=>{y();let e=await u(`http://metro-info.edwardxwliu.cn:5000/stat?key=${h}&per_page=${T}`);a=e[0].tot_pages,S=e[0].tot_items,l(m),D(),setInterval(L,5e3)});async function L(){if(b===1){let e=await u(`http://metro-info.edwardxwliu.cn:5000/stat?key=${h}&per_page=${T}`),t=e[0].tot_items;t!==S&&(S=t,a=e[0].tot_pages,l(b))}}function D(){let e=document.querySelector('[data-element="next-page"]'),t=document.querySelector('[data-element="previous-page"]');e&&e.addEventListener("click",()=>{l(m+1),d()}),t&&t.addEventListener("click",()=>{l(m-1),d()})}var N=(e,t)=>{let o=c(t);return o&&(o.textContent=e.toString(),o.setAttribute("page-nav-index",e.toString())),o.addEventListener("click",()=>{w||(w=window.setTimeout(()=>{w=null,o.disabled||(l(e),d())},500))}),o},f=async(e,t)=>{let o=document.querySelector('[data-element="page-index"]');if(!o)return;let r=o.parentElement;o.remove(),o.classList.remove("page-index_active");for(let n=e;n<=t;n++)r.append(N(n,o))},I=({title:e,url:t,p_date:o},r)=>{let n=c(r),i=n.querySelector('[data-element="news-title"]'),E=n.querySelector('[data-element="news-date"]');return i&&(i.textContent=e,i.href=t),E&&(E.textContent=o),n.removeAttribute("data-cloak"),n},l=async e=>{if(b=e,e<1||e>a)return;let t=await u(`http://metro-info.edwardxwliu.cn:5000/search?key=${h}&page=${e}&per_page=${T}`);if(!t){window.location.replace("/");return}let o=document.querySelector('[data-element="news-item"]');if(!o)return;let r=o.parentElement,n=t.map(i=>I(i,o));x&&x.map(i=>r.removeChild(i)),o.remove(),r.append(...n),x=n,_(e),m=e};function _(e){a>1&&(H(e),a<=p?f(1,a):e+s>a?f(a-p+1,a):e<=s?f(1,p):e>s&&f(e-s,e+s)),v(e),e!==m&&g(m),e===1?v(0):g(0),e===a?v(-1):g(-1)}var v=e=>{let t=document.querySelector(`[page-nav-index="${e}"]`);t?.classList.add("page-index_active"),t&&(t.disabled=!0)},g=e=>{let t=document.querySelector(`[page-nav-index="${e}"]`);t?.classList.remove("page-index_active"),t&&(t.disabled=!1)},M=e=>{document.querySelector(`[page-nav-index="${e}"]`)?.remove()},H=e=>{let t=document.querySelector('[data-element="page-index-wrap"]');if(!t)return;let o=t.firstElementChild?.getAttribute("page-nav-index"),r=t.lastElementChild?.getAttribute("page-nav-index");if(o&&r)for(let n=+o;n<=+r;n++)n!==e&&M(n)};})();
