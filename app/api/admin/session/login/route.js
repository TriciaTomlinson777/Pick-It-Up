import { createAdminLoginResponse } from '@/lib/admin-request';

// TEMPORARY diagnostic logging for live login troubleshooting; safe to remove once resolved.
const DIAG = '[admin-login-diag]';

export async function POST(request) {
  console.log(DIAG, 'login request received');
  try {
    const body = await request.json();
    const username = String(body?.username || '').trim();
    const password = String(body?.password || '').trim();

    if (!username || !password) {
      return Response.json({ error: 'Username and password are required.' }, { status: 400 });
    }

    return createAdminLoginResponse(username, password);
  } catch (error) {
    console.log(DIAG, 'caught error', error?.name, error?.message, error?.stack);
    return Response.json({ error: 'Unable to process login request.' }, { status: 400 });
  }
}
