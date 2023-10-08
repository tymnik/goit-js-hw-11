import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const API_KEY = '39819981-fb7a960ba48529567676f3c81';

export let page = 1;

export async function loadImages() {
  try {
    const searchInput = document.getElementById('searchQuery').value;
    const queryParams = `?key=${API_KEY}&q=${encodeURIComponent(
      searchInput
    )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
    const requestUrl = URL + queryParams;
    const response = await axios.get(requestUrl);
    checkResponse(response);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
}

export function checkResponse(response) {
  if (response.status === 200) {
    const data = response.data;
  } else {
    throw new Error('Network response was not ok');
  }
}