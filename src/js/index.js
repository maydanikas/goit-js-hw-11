import { Notify } from 'notiflix';
import { PixabayApi } from './fetch';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('#search-form');
const inputEl = document.querySelector('.search-input');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const footerEl = document.querySelector('.footer');
let lightbox = null;

const pixabayApi = new PixabayApi();

////////////////rendering/////////////////////

const gallerItemRender = data => {
  // loadMoreBtn.classList.remove('is-hidden');
  footerEl.classList.remove('is-hidden');
  loadMoreBtn.classList.remove('is-hidden');

  return data
    .map(elem => {
      return `
      <div class="photo-card">
  <a href="${elem.largeImageURL}">
  <img src="${elem.webformatURL}" alt="${elem.tags}" loading="lazy" class="gallery-item" />
  
  <div class="info">
    <p class="info-item">
      <span class="item-title"><b>Likes</b></span>
      <span class="item-data">${elem.likes}</span>
    </p>
    <p class="info-item">
      <span class="item-title"><b>Views</b></span>
      <span class="item-data">${elem.views}</span>
    </p>
    <p class="info-item">
      <span class="item-title"><b>Comments</b></span>
      <span class="item-data">${elem.comments}</span>
    </p>
    <p class="info-item">
      <span class="item-title"><b>Downloads</b></span>
      <span class="item-data">${elem.downloads}</span>
    </p>
  </div>
</a>

</div>
      `;
    })
    .join('');
};

////////////////server requests//////////////////////
const onSearchSubmit = async event => {
  event.preventDefault();

  const { target: formEl } = event;

  galleryEl.innerHTML = '';
  pixabayApi.query = formEl.searchQuery.value;
  pixabayApi.page = 1;
  if (!pixabayApi.query) {
    loadMoreBtn.classList.add('is-hidden');
    footerEl.classList.add('is-hidden');
    return;
  }

  try {
    const response = await pixabayApi.fetchFotosQuery();
    const { data } = response;
    const totalHits = Math.round(data.totalHits / pixabayApi.per_page);
    // console.log(data);
    console.log(totalHits);

    if (data.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      galleryEl.innerHTML = '';
      loadMoreBtn.classList.add('is-hidden');
      footerEl.classList.add('is-hidden');

      return;
    }
    if (data.hits.length === 0) {
      galleryEl.innerHTML = '';
      loadMoreBtn.classList.add('is-hidden');
      return;
    }

    Notify.success(
      `Hooray! We found ${data.total} images by "${pixabayApi.query}" request`
    );

    galleryEl.insertAdjacentHTML('beforeend', gallerItemRender(data.hits));
    lightbox = new SimpleLightbox('.photo-card a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
    if (totalHits <= 1) {
      // console.log(loadMoreBtn.classList.contains('is-hidden'));
      loadMoreBtn.classList.add('is-hidden');
    }
  } catch (error) {
    Notify.failure(error);
  }
};
/////////////////

const onLoadMoreBtnClick = async event => {
  pixabayApi.page += 1;

  try {
    const response = await pixabayApi.fetchFotosQuery();
    const { data } = response;
    const totalHits = Math.ceil(data.totalHits / pixabayApi.per_page);

    galleryEl.insertAdjacentHTML('beforeend', gallerItemRender(data.hits));
    lightbox.refresh();

    if (pixabayApi.page === totalHits) {
      loadMoreBtn.classList.add('is-hidden');
    }
  } catch (error) {
    failure(error);
  }
};

searchFormEl.addEventListener('submit', onSearchSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
