"use strict";(()=>{var p=(e,t=!0)=>e.cloneNode(t);async function f(e){try{let t=await fetch(e);return t.ok?await t.json():[]}catch{return[]}}function x(){window.scrollTo({top:0,behavior:"smooth"})}function q(){let e=document.querySelector('[data-element="search-input-side"]'),t=document.querySelector('[data-element="search-form-side"]');t&&t.addEventListener("submit",n=>{if(n.preventDefault(),!e)return;let o=e.value;window.location.href=`/search.html?query=${encodeURIComponent(o)}`})}var y=1,E=[],m=1,g=10,l=Math.floor(g/2),S=null,k=10,a=1,L=0,c;async function H(e){c=e,q();let t=await f(`http://metro-info.edwardxwliu.cn:5000/stat?key=${c}&per_page=${k}`);a=t[0].tot_pages,L=t[0].tot_items,d(m),j(),setInterval(W,5e3)}var _=(e,{type:t,title:n,pic_url:o,url:r,p_date:s,org:B,preview:v,content:b},$)=>{let i=p($),C=document.querySelector('[data-element="main-wraper"]'),D=i.querySelector('[data-element="news-type"]'),I=i.querySelector('[data-element="news-title"]'),N=i.querySelector('[data-element="news-preview'),M=i.querySelector('[data-element="news-date"]'),u=i.querySelector('[data-element="news-img-preview"]');if(i.href=r,D&&(D.textContent=t||B),I&&(I.textContent=n),N&&(!v&&!b&&(b=n),N.textContent=v||b.slice(0,200)),M&&(M.textContent=s),u)switch(e){case"gzdt":u.src=o||"http://qn.edwardxwliu.cn/%E7%88%AC%E8%99%AB/gzdt.jpg";break;case"fgw":u.src=o||"http://qn.edwardxwliu.cn/%E7%88%AC%E8%99%AB/fgw.jpg";break;default:u.src=o;break}return i.removeAttribute("data-cloak"),C?.removeAttribute("data-cloak"),i},d=async e=>{if(y=e,e<1||e>a)return;let t=await f(`http://metro-info.edwardxwliu.cn:5000/search?key=${c}&page=${e}&per_page=${k}`);if(!t){window.location.replace("/");return}let n=document.querySelector('[data-element="news-item"]');if(!n)return;let o=n.parentElement,r=t.map(s=>_(c,s,n));E&&E.map(s=>o.removeChild(s)),n.remove(),o.append(...r),E=r,F(e),m=e},A=(e,t)=>{let n=p(t);return n&&(n.textContent=e.toString(),n.setAttribute("page-nav-index",e.toString())),n.addEventListener("click",()=>{S||(S=window.setTimeout(()=>{S=null,n.disabled||(d(e),x())},500))}),n},w=async(e,t)=>{let n=document.querySelector('[data-element="page-index"]');if(!n)return;let o=n.parentElement;n.remove(),n.classList.remove("page-index_active");for(let r=e;r<=t;r++)o.append(A(r,n))};function F(e){a>1&&(V(e),a<=g?w(1,a):e+l>a?w(a-g+1,a):e<=l?w(1,g):e>l&&w(e-l,e+l)),h(e),e!==m&&T(m),e===1?h(0):T(0),e===a?h(-1):T(-1)}var h=e=>{let t=document.querySelector(`[page-nav-index="${e}"]`);t?.classList.add("page-index_active"),t&&(t.disabled=!0)},T=e=>{let t=document.querySelector(`[page-nav-index="${e}"]`);t?.classList.remove("page-index_active"),t&&(t.disabled=!1)},P=e=>{document.querySelector(`[page-nav-index="${e}"]`)?.remove()},V=e=>{let t=document.querySelector('[data-element="page-index-wrap"]');if(!t)return;let n=t.firstElementChild?.getAttribute("page-nav-index"),o=t.lastElementChild?.getAttribute("page-nav-index");if(n&&o)for(let r=+n;r<=+o;r++)r!==e&&P(r)};function j(){let e=document.querySelector('[data-element="next-page"]'),t=document.querySelector('[data-element="previous-page"]');e&&e.addEventListener("click",()=>{d(m+1),x()}),t&&t.addEventListener("click",()=>{d(m-1),x()})}async function W(){if(y===1){let e=await f(`http://metro-info.edwardxwliu.cn:5000/stat?key=${c}&per_page=${k}`),t=e[0].tot_items;t!==L&&(L=t,a=e[0].tot_pages,d(y))}}var z="wechat";window.Webflow||(window.Webflow=[]);window.Webflow.push(async()=>{H(z)});})();
