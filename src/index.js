import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const URL = 'https://pixabay.com/api/';
const API_KEY = '39819981-fb7a960ba48529567676f3c81';

const gallery = document.querySelector('.gallery');
const options = {
  captionsData: 'alt',
  captionDelay: 250,
};

new SimpleLightbox('.gallery a', options);

// let infScroll = new InfiniteScroll(gallery, {
//   path: '.pagination__next',
//   append: '.post',
//   history: false,
// });

const loadMoreButton = document.querySelector('.load-more');
let page = 1;

function toggleLoadMoreButton(show) {
  if (show) {
    loadMoreButton.style.display = 'block';
  } else {
    loadMoreButton.style.display = 'none';
  }
}

async function loadImages() {
  try {
    const searchInput = document.getElementById('searchQuery').value;

    const queryParams = `?key=${API_KEY}&q=${encodeURIComponent(
      searchInput
    )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

    const requestUrl = URL + queryParams;

    const response = await axios.get(requestUrl);

    if (response.status === 200) {
      const data = response.data;
      if (data.hits && data.hits.length > 0) {
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

        page++;

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
          Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
        }
      }
    } else {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

loadMoreButton.addEventListener('click', loadImages);

document
  .getElementById('search-form')
  .addEventListener('submit', async function (evt) {
    evt.preventDefault();
    page = 1;
    toggleLoadMoreButton(false);
    gallery.innerHTML = '';

    loadImages();
  });
