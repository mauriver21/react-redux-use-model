const e=`import { getOrigin } from '@utils/getOrigin';

export const BASE_URL = process.env.VITE_BASE_URL;
export const ORIGIN_URL = getOrigin();
export const WORKER_URL = \`\${ORIGIN_URL}\${
  BASE_URL ? \`/\${BASE_URL}\` : ''
}/mockServiceWorker.js\`;

export const NPM_URL = 'https://www.npmjs.com/package/react-redux-use-model';
export const GITHUB_URL = 'https://github.com/mauriver21/react-redux-use-model';
`;export{e as default};
