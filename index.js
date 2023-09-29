/** @typedef {import('@sveltejs/kit').Handle} Handle */

/** 
 * @param {{ [key: string]: string }} proxy
 * @param {{ debug?: boolean }=} options
 * @returns Handle
 */
export function proxyHandle(proxy, options = {}) {
  return async function ({ event, resolve }) {
    const { pathname } = event.url;

    /**
     * Find first matching path
     */
    const matchingProxy = Object.keys(proxy).find((proxyPath) => pathname.match(proxyPath));
    if (matchingProxy) {
      const proxyTarget = proxy[matchingProxy];

      if (options && options.debug) {
        console.debug(`Proxy: ${proxyTarget}${pathname}`, event.request.headers);
      }

      /**
       * Fetch data from remote server
       */
      const resp = await fetch(`${proxyTarget}${pathname}`, {
        headers: {
          host: event.request.headers.get('host'),
          connection: event.request.headers.get('connection'),
          accept: event.request.headers.get('accept'),
          'user-agent': event.request.headers.get('user-agent'),
          'accept-encoding': event.request.headers.get('user-agent'),
          'accept-language': event.request.headers.get('user-agent'),
          cookie: event.request.headers.get('cookie'),
        },
      });

      /**
       * Clean up response headers
       */
      const responseHeaders = Object.fromEntries(resp.headers.entries());
      delete responseHeaders['content-encoding'];

      if (options && options.debug) {
        console.debug(`Proxy response (${resp.status}) headers:`, responseHeaders);
      }

      /**
       * Return response from remote server
       */
      return new Response(await resp.text(), {
        headers: responseHeaders,
      });
    }

    /**
     * Proceed without proxy
     */
    const response = await resolve(event);
    return response;
  };
}
