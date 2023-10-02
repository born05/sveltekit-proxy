/** @typedef {import('@sveltejs/kit').Handle} Handle */

/**
 * @param {{ [key: string]: string }} proxy
 * @param {{ debug?: boolean; changeOrigin?: boolean }=} options
 * @returns Handle
 */
export function proxyHandle(proxy, options = { changeOrigin: true }) {
  return async function ({ event, resolve }) {
    const { pathname } = event.url;

    /**
     * Find first matching path
     */
    const matchingProxy = Object.keys(proxy).find((proxyPath) =>
      pathname.match(proxyPath),
    );
    if (matchingProxy) {
      const proxyTarget = proxy[matchingProxy];

      /**
       * Collect request headers
       */
      const requestHeaders = {
        accept: event.request.headers.get('accept'),
        'user-agent': event.request.headers.get('user-agent'),
        'accept-encoding': event.request.headers.get('user-agent'),
        'accept-language': event.request.headers.get('user-agent'),
        cookie: event.request.headers.get('cookie'),
      };
      if (options && !options.changeOrigin) {
        requestHeaders.host = event.request.headers.get('host');
      }

      if (options && options.debug) {
        console.debug(`Proxy: ${proxyTarget}${pathname}`, requestHeaders);
      }

      /**
       * Fetch data from remote server
       */
      const resp = await fetch(`${proxyTarget}${pathname}`, {
        headers: requestHeaders,
      });

      /**
       * Clean up response headers
       */
      const responseHeaders = Object.fromEntries(resp.headers.entries());
      delete responseHeaders['content-encoding'];

      if (options && options.debug) {
        console.debug(
          `Proxy response (${resp.status}) headers:`,
          responseHeaders,
        );
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
