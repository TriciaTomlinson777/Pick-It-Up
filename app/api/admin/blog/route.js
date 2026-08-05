import {
  createPost,
  ensureFirstPostExists,
  getAdminPosts,
  uploadFeaturedImage,
} from '@/lib/blog-repository';
import { getVerifiedAdminSession, requireAdminApiSession } from '@/lib/admin-request';
import { parsePostFormData } from '@/lib/blog-admin-form';

export async function GET() {
  const session = await getVerifiedAdminSession();
  const unauthorizedResponse = requireAdminApiSession(session);
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  await ensureFirstPostExists();
  const posts = await getAdminPosts();
  return Response.json({ posts });
}

export async function POST(request) {
  const session = await getVerifiedAdminSession();
  const unauthorizedResponse = requireAdminApiSession(session);
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const formData = await request.formData();
    const { postInput, uploadedImage } = await parsePostFormData(formData);

    if (uploadedImage) {
      const image = await uploadFeaturedImage(uploadedImage);
      postInput.featuredImageUrl = image.featuredImageUrl;
      postInput.featuredImagePath = image.featuredImagePath;
    }

    const post = await createPost(postInput);
    return Response.json({ post });
  } catch (error) {
    return Response.json({ error: error.message || 'Failed to create post.' }, { status: 400 });
  }
}
