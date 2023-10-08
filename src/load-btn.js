export const loadMoreButton = document.querySelector('.load-more');

export function toggleLoadMoreButton(show) {
  if (show) {
    loadMoreButton.style.display = 'block';
  } else {
    loadMoreButton.style.display = 'none';
  }
}
