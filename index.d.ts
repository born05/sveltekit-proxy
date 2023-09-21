import type { Handle } from '@sveltejs/kit';

export function proxyHandle(proxy: { [key: string]: string }): Handle;
