import { Id } from '@interfaces';
import { createRandomProduct } from '@examples/mocks/fakers';

export const products = (quantity: number) =>
  Array(quantity)
    .fill(null)
    .map((_, i) => {
      const product = createRandomProduct();
      return {
        id: (i + 1) as Id,
        name: product.name,
        price: i + 1,
      };
    });
