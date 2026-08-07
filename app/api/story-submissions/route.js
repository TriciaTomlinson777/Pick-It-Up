import { createStorySubmission, uploadSubmissionImages } from '@/lib/blog-repository';
import { parseStorySubmissionFormData } from '@/lib/blog-submission-form';
import { getConfiguredFormDestinationEmail, sendMailMessage } from '@/lib/form-mailer';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const { postInput, uploadedPhotos } = await parseStorySubmissionFormData(formData);

    const photoUploads = uploadedPhotos.length > 0
      ? await uploadSubmissionImages(uploadedPhotos)
      : [];

    const story = await createStorySubmission(postInput, photoUploads);

    // Email is best-effort; a send failure must not affect the submission response
    try {
      const destination = getConfiguredFormDestinationEmail();
      if (destination) {
        const photoLines = Array.isArray(story.submissionPhotoUrls) && story.submissionPhotoUrls.length > 0
          ? [
              '',
              `Photos (${story.submissionPhotoUrls.length}):`,
              ...story.submissionPhotoUrls.map((url, i) => `  ${i + 1}. ${url}`),
            ]
          : [];

        await sendMailMessage({
          to: destination,
          subject: `New Blog Story Submission: ${story.title}`,
          text: [
            'A new blog story has been submitted and is awaiting review in Blog Admin.',
            '',
            `Title:    ${story.title}`,
            `Author:   ${story.author}`,
            `Category: ${story.category}`,
            `Status:   Pending Review`,
            ...photoLines,
          ].join('\n'),
        });
      }
    } catch (emailError) {
      console.error('Story submitted, but notification email failed:', emailError);
    }

    return Response.json({ ok: true, storyId: story.id });
  } catch (error) {
    return Response.json({ error: error.message || 'Unable to submit story.' }, { status: 400 });
  }
}
