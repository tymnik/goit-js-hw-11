import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { page, loadImages, checkResponse } from './pixabay-api';

import { loadMoreButton, toggleLoadMoreButton } from './load-btn';

document.addEventListener('DOMContentLoaded', async () => {
  const gallery = document.querySelector('.gallery');

  toggleLoadMoreButton(false);

  function createGallery(data) {
    if (data.hits && data.hits.length > 0) {
      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      data.hits.forEach(image => {
        const photoCard = document.createElement('div');
        photoCard.classList.add('photo-card');

        const imageElement = document.createElement('a');
        imageElement.href = image.largeImageURL;
        imageElement.classList.add('simplelightbox');

        const imageThumbnail = document.createElement('img');
        imageThumbnail.src = image.webformatURL;
        imageThumbnail.alt = image.tags;
        imageThumbnail.loading = 'lazy';

        imageElement.appendChild(imageThumbnail);

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('info');

        const infoItems = ['Likes', 'Views', 'Comments', 'Downloads'];
        infoItems.forEach(item => {
          const infoItem = document.createElement('p');
          infoItem.classList.add('info-item');
          infoItem.innerHTML = `<b>${item}:</b> ${image[item.toLowerCase()]}`;
          infoDiv.appendChild(infoItem);
        });

        photoCard.appendChild(imageElement);
        photoCard.appendChild(infoDiv);

        gallery.appendChild(photoCard);
      });

      const options = {
        captionsData: 'alt',
        captionDelay: 250,
      };

      new SimpleLightbox('.gallery a', options);
    } else {
      Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results.`
      );
      toggleLoadMoreButton(false);
    }
  }

  loadMoreButton.addEventListener('click', async () => {
    page++;
    const data = await loadImages();
    createGallery(data);
    switchToggleLoadButton(data, gallery);
  });

  document
    .getElementById('search-form')
    .addEventListener('submit', async function (evt) {
      evt.preventDefault();
      page = 1;
      toggleLoadMoreButton(false);
      gallery.innerHTML = '';

      const data = await loadImages();
      createGallery(data);
      switchToggleLoadButton(data, gallery);
    });
});

function switchToggleLoadButton(data, gallery) {
  if (page * 40 < data.totalHits) {
    toggleLoadMoreButton(true);
    const { height: cardHeight } =
      gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } else {
    toggleLoadMoreButton(false);
  }
}
