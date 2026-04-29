import { getOrigin } from '@examples/utils/getOrigin';

export const BASE_URL = '';
export const ORIGIN_URL = getOrigin();
export const WORKER_URL = `${ORIGIN_URL}${
  BASE_URL ? `/${BASE_URL}` : ''
}/mockServiceWorker.js`;
