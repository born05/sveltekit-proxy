# SvelteKit Proxy

A simple way to proxy paths from SvelteKit to a different server.

Install:
```
npm i @born05/sveltekit-proxy
```

Example usage:
```ts
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { proxyHandle } from './proxy';

const svelteHandle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  return response;
};

export const handle = sequence(
  proxyHandle({
    '^/robots.txt': env.SERVER_API_HOST,
    '^/(nl|en)/sitemap.(xml|xsl)': env.SERVER_API_HOST,
    '^/(nl|en)/sitemaps-.*': env.SERVER_API_HOST,
  }),
  svelteHandle,
);
```
