import { createAdminLogoutResponse } from '@/lib/admin-request';

export async function POST() {
  return createAdminLogoutResponse();
}
