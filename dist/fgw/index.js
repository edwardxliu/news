"use strict";(()=>{var u=(e,t=!0)=>e.cloneNode(t);async function d(e){try{let t=await fetch(e);return t.ok?await t.json():[]}catch{return[]}}var m=1,E=1,y=10,w=[],r=1,S=0,p=10,l=Math.floor(p/2),v=null,T="fgw";window.Webflow||(window.Webflow=[]);window.Webflow.push(async()=>{let e=await d(`https://metro-info.edwardxwliu.cn:5000/stat?key=${T}&per_page=${y}`);r=e[0].tot_pages,S=e[0].tot_items,c(m),_(),setInterval(M,5e3)});async function M(){if(E===1){let e=await d(`https://metro-info.edwardxwliu.cn:5000/stat?key=${T}&per_page=${y}`),t=e[0].tot_items;t!==S&&(S=t,r=e[0].tot_pages,c(E))}}function _(){let e=document.querySelector('[data-element="next-page"]'),t=document.querySelector('[data-element="previous-page"]');e&&e.addEventListener("click",()=>{c(m+1)}),t&&t.addEventListener("click",()=>{c(m-1)})}var H=(e,t)=>{let n=u(t);return n&&(n.textContent=e.toString(),n.setAttribute("page-nav-index",e.toString())),n.addEventListener("click",()=>{v||(v=window.setTimeout(()=>{v=null,n.disabled||c(e)},500))}),n},f=async(e,t)=>{let n=document.querySelector('[data-element="page-index"]');if(!n)return;let a=n.parentElement;n.remove(),n.classList.remove("page-index_active");for(let o=e;o<=t;o++)a.append(H(o,n))},k=({type:e,title:t,url:n,preview:a,p_date:o,org:s},I)=>{let i=u(I),L=i.querySelector('[data-element="news-type"]'),x=i.querySelector('[data-element="news-title"]'),D=i.querySelector('[data-element="news-preview'),h=i.querySelector('[data-element="news-org"]'),N=i.querySelector('[data-element="news-date"]');return L&&(L.textContent=e),x&&(x.textContent=t,x.href=n),D&&(D.textContent=a),h&&(h.textContent=s),N&&(N.textContent=o),i.removeAttribute("data-cloak"),i},c=async e=>{if(E=e,e<1||e>r)return;let t=await d(`https://metro-info.edwardxwliu.cn:5000/search?key=${T}&page=${e}&per_page=${y}`);if(!t){window.location.replace("/");return}let n=document.querySelector('[data-element="news-item"]');if(!n)return;let a=n.parentElement,o=t.map(s=>k(s,n));w&&w.map(s=>a.removeChild(s)),n.remove(),a.append(...o),w=o,B(e),m=e};function B(e){r>1&&($(e),r<=p?f(1,r):e+l>r?f(r-p+1,r):e<=l?f(1,p):e>l&&f(e-l,e+l)),g(e),e!==m&&b(m),e===1?g(0):b(0),e===r?g(-1):b(-1)}var g=e=>{let t=document.querySelector(`[page-nav-index="${e}"]`);t?.classList.add("page-index_active"),t&&(t.disabled=!0)},b=e=>{let t=document.querySelector(`[page-nav-index="${e}"]`);t?.classList.remove("page-index_active"),t&&(t.disabled=!1)},q=e=>{document.querySelector(`[page-nav-index="${e}"]`)?.remove()},$=e=>{let t=document.querySelector('[data-element="page-index-wrap"]');if(!t)return;let n=t.firstElementChild?.getAttribute("page-nav-index"),a=t.lastElementChild?.getAttribute("page-nav-index");if(n&&a)for(let o=+n;o<=+a;o++)o!==e&&q(o)};})();
