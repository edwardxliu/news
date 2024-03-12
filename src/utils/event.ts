export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

export function directToSearch() {
  const searchInputSide = document.querySelector<HTMLInputElement>(
    '[data-element="search-input-side"]'
  );
  const searchFormSide = document.querySelector<HTMLFormElement>(
    '[data-element="search-form-side"]'
  );
  if (!searchFormSide) return;
  searchFormSide.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!searchInputSide) return;
    const inputVal = searchInputSide.value;
    window.location.href = `/search?query=${encodeURIComponent(inputVal)}`;
  });
}
