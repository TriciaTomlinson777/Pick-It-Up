import {
  applyAdminPostAction,
  getAdminPostById,
  unpublishPost,
  updatePost,
  uploadFeaturedImage,
} from '@/lib/blog-repository';
import { revalidatePath } from 'next/cache';
import { getVerifiedAdminSession, requireAdminApiSession } from '@/lib/admin-request';
import { parsePostFormData } from '@/lib/blog-admin-form';

function revalidatePublicBlogPaths(post) {
  revalidatePath('/blog');
  if (post?.slug) {
    revalidatePath(`/blog/${post.slug}`);
  }
}

export async function GET(_, context) {
  const session = await getVerifiedAdminSession();
  const unauthorizedResponse = requireAdminApiSession(session);
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const params = await context.params;
  const post = await getAdminPostById(params.id);
  if (!post) {
    return Response.json({ error: 'Post not found.' }, { status: 404 });
  }

  return Response.json({ post });
}

export async function PATCH(request, context) {
  const session = await getVerifiedAdminSession();
  const unauthorizedResponse = requireAdminApiSession(session);
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const params = await context.params;
  const id = params.id;

  try {
    const formData = await request.formData();
    const action = String(formData.get('action') || '').trim().toLowerCase();

    if (action === 'unpublish') {
      const post = await unpublishPost(id);
      if (!post) {
        return Response.json({ error: 'Post not found.' }, { status: 404 });
      }

      revalidatePublicBlogPaths(post);

      return Response.json({ post });
    }

    if (['approve', 'reject', 'archive', 'restore', 'feature', 'unfeature', 'mark_pending_review'].includes(action)) {
      const post = await applyAdminPostAction(id, action, {
        publishedAt: String(formData.get('publishedAt') || '').trim(),
        rejectionReason: String(formData.get('rejectionReason') || '').trim(),
      });

      if (!post) {
        return Response.json({ error: 'Post not found.' }, { status: 404 });
      }

      revalidatePublicBlogPaths(post);

      return Response.json({ post });
    }

    const existing = await getAdminPostById(id);
    if (!existing) {
      return Response.json({ error: 'Post not found.' }, { status: 404 });
    }

    const { postInput, uploadedImage, removeFeaturedImage } = await parsePostFormData(formData);

    if (uploadedImage) {
      const image = await uploadFeaturedImage(uploadedImage);
      postInput.featuredImageUrl = image.featuredImageUrl;
      postInput.featuredImagePath = image.featuredImagePath;
    } else if (removeFeaturedImage) {
      postInput.featuredImageUrl = '';
      postInput.featuredImagePath = '';
    } else {
      postInput.featuredImageUrl = existing.featuredImageUrl || '';
      postInput.featuredImagePath = existing.featuredImagePath || '';
    }

    const post = await updatePost(id, postInput);
    if (!post) {
      return Response.json({ error: 'Post not found.' }, { status: 404 });
    }

    revalidatePublicBlogPaths(post);

    return Response.json({ post });
  } catch (error) {
    return Response.json({ error: error.message || 'Failed to update post.' }, { status: 400 });
  }
}
