import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export function load() {
	throw redirect(307, base + '/tutorial/getting-started');
}
