import axios from 'axios';

export class PixabayApi {
  static BASE_URL = 'https://pixabay.com/api';
  static API_KEY = '20384794-83e69bb7b069cf96029b0d4c8';

  constructor() {
    this.query = null;
    this.page = 1;
  }

  fetchFotosQuery() {
    const searchParams = {
      params: {
        q: this.query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: 40,
        key: PixabayApi.API_KEY,
        page: this.page,
      },
    };

    return axios.get(`${PixabayApi.BASE_URL}`, searchParams);
  }
}
