/** @typedef {import('@sveltejs/kit').Handle} Handle */

/** 
 * @param {{ [key: string]: string }} proxy
 * @returns Handle
 */
export function proxyHandle(proxy) {
  return async function ({ event, resolve }) {
    const { pathname } = event.url;

    /**
     * Do not use hooks on the health endpoint, or the components pages
     */
    const matchingProxy = Object.keys(proxy).find((proxyPath) => pathname.match(proxyPath));
    if (matchingProxy) {
      const proxyTarget = proxy[matchingProxy];

      const resp = await fetch(`${proxyTarget}${pathname}`, {
        headers: event.request.headers,
      });

      const responseHeaders = Object.fromEntries(resp.headers.entries());
      delete responseHeaders['content-encoding'];

      return new Response(await resp.text(), {
        headers: responseHeaders,
      });
    }

    const response = await resolve(event);
    return response;
  };
}
