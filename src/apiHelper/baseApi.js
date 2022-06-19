import axios from 'axios';
import { baseUrl } from './baseUrl';

export const baseApi= axios.create({
  baseURL: `${baseUrl}`
});

