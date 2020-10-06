import {CloudInitOptions, User, Users} from './options';
import { Router } from './router';
import ubuntuhbs from './ubuntu.cloudinit.hbs';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleUbuntuRequest(request: Request) {
  const options = new CloudInitOptions(Users.fromENV());
  return new Response(
    ubuntuhbs(options, {
      allowProtoMethodsByDefault: true,
      allowProtoPropertiesByDefault: true,
    }),
    {
      headers: {'content-type': 'text/plain'},
    }
  );
}

async function handleRequest(request: Request) {
  const r = new Router();
  r.get('/ubuntu', handleUbuntuRequest);
  const res = await r.route(request);
  return res;
}
