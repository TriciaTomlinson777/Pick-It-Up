import { createStorySubmission, uploadSubmissionImages } from '@/lib/blog-repository';
import { parseStorySubmissionFormData } from '@/lib/blog-submission-form';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const { postInput, uploadedPhotos } = await parseStorySubmissionFormData(formData);

    const photoUploads = uploadedPhotos.length > 0
      ? await uploadSubmissionImages(uploadedPhotos)
      : [];

    const story = await createStorySubmission(postInput, photoUploads);
    return Response.json({ ok: true, storyId: story.id });
  } catch (error) {
    return Response.json({ error: error.message || 'Unable to submit story.' }, { status: 400 });
  }
}
