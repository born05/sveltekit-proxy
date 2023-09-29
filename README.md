# SvelteKit Proxy

A simple way to proxy paths from SvelteKit to a different server.

Install:

```
npm i -D @born05/sveltekit-proxy
```

Example usage:

```ts
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { proxyHandle } from '@born05/sveltekit-proxy';

const svelteHandle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  return response;
};

export const handle = sequence(
  proxyHandle({
    '^/robots.txt': 'http://different-server.example.com',
    '^/(nl|en)/sitemap.(xml|xsl)': 'http://different-server.example.com',
    '^/(nl|en)/sitemaps-.*': 'http://different-server.example.com',
  }),
  svelteHandle,
);
```
