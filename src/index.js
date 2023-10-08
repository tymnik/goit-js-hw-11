import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { page, loadImages, checkResponse } from './pixabay-api';

import { loadMoreButton, toggleLoadMoreButton } from './load-btn';

const gallery = document.querySelector('.gallery');
let currentPage = 1;

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

document
  .getElementById('search-form')
  .addEventListener('submit', async function (evt) {
    evt.preventDefault();
    currentPage = 1;
    toggleLoadMoreButton(false);
    gallery.innerHTML = '';

    const data = await loadImages(currentPage);
    createGallery(data);
    switchToggleLoadButton(data, currentPage);
  });

loadMoreButton.addEventListener('click', async () => {
  currentPage++;
  const data = await loadImages(currentPage);
  createGallery(data);
  switchToggleLoadButton(data, currentPage);
});

function switchToggleLoadButton(data, currentPage) {
  const imagesPerPage = 40;
  const totalImagesLoaded = currentPage * imagesPerPage;
  if (totalImagesLoaded < data.totalHits) {
    toggleLoadMoreButton(true);
  } else {
    toggleLoadMoreButton(false);
  }
}
