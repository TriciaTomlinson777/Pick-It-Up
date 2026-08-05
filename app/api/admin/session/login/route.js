import { createAdminLoginResponse } from '@/lib/admin-request';

export async function POST(request) {
  try {
    const body = await request.json();
    const username = String(body?.username || '').trim();
    const password = String(body?.password || '').trim();

    if (!username || !password) {
      return Response.json({ error: 'Username and password are required.' }, { status: 400 });
    }

    return createAdminLoginResponse(username, password);
  } catch {
    return Response.json({ error: 'Unable to process login request.' }, { status: 400 });
  }
}
