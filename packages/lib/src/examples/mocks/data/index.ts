import { animals } from './animals';
import { products } from './products';
import { videos } from './videos';

export const data = {
  products: products(30),
  videos: videos(100),
  animals,
};
