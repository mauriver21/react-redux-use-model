import { HttpResponse, http } from 'msw';

export const mswHandler = [
  http.get('/msw', async () => {
    return HttpResponse.json(
      {
        now: new Date().getTime(),
      },
      { status: 200 },
    );
  }),
];
