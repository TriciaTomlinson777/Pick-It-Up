import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ensureFirstPostExists,
  getPublishedPostBySlug,
  getPublishedPosts,
  normalizeBodyParagraphs,
} from '@/lib/blog-repository';
import { formatPublicationDate } from '@/lib/blog-post-utils';

export const dynamic = 'force-dynamic';
const FIRST_POST_SLUG = 'what-i-didnt-expect-when-i-started-picking-up-litter';

function getAdjacentPosts(posts, currentSlug) {
  const index = posts.findIndex((post) => post.slug === currentSlug);
  if (index === -1) {
    return { previousPost: null, nextPost: null };
  }

  return {
    previousPost: posts[index + 1] || null,
    nextPost: posts[index - 1] || null,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;

  let post = null;
  let publishedPosts = [];

  try {
    await ensureFirstPostExists();
  } catch {
    // Keep going so published/fallback stories can still render if seed write fails.
  }

  try {
    post = await getPublishedPostBySlug(slug);
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }

  try {
    publishedPosts = await getPublishedPosts();
  } catch {
    publishedPosts = [post];
  }

  const paragraphs = normalizeBodyParagraphs(post.body);
  const { previousPost, nextPost } = getAdjacentPosts(publishedPosts, post.slug);
  const isFirstPost = post.slug === FIRST_POST_SLUG;

  return (
    <>
      <Header />

      <section className="bg-gradient-to-r from-seattle-green to-green-700 py-12 text-white sm:py-14">
        <div className="container-custom">
          <Link href="/blog" className="inline-flex text-sm font-semibold text-green-100 transition hover:text-white hover:underline">
            ← Back to Stories
          </Link>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-custom">
          <article className="mx-auto max-w-3xl rounded-2xl border border-[#0f9aa1]/18 bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10">
            <h1 className="text-4xl font-bold leading-tight text-[#002244] sm:text-5xl">{post.title}</h1>
            <p className="mt-3 inline-flex rounded-full bg-[#eaf8f9] px-3 py-1 text-xs font-semibold text-[#0f9aa1]">
              {post.category}
            </p>
            {isFirstPost ? (
              <div className="mt-3 space-y-1.5 text-[#1f5f7a]">
                <p className="text-[1.1rem] leading-tight [font-family:var(--font-baloo-2),'Trebuchet_MS','Segoe_UI',sans-serif]">
                  By Tricia Tomlinson
                </p>
                <p className="text-sm">Founder, Pick It Up Seattle</p>
                <p className="text-sm">Every movement starts with one person choosing to make a difference.</p>
              </div>
            ) : (
              <p className="mt-3 text-sm font-semibold text-[#1f5f7a]">
                {formatPublicationDate(post.publishedAt)} • By {post.author}
              </p>
            )}

            {post.featuredImageUrl ? (
              <img
                src={post.featuredImageUrl}
                alt={post.title}
                className="mt-6 h-64 w-full rounded-xl object-cover sm:h-80"
              />
            ) : null}

            <div className="mt-8 space-y-6 text-[1.14rem] leading-[1.88] text-[#123e56]">
              {paragraphs.map((paragraph, index) => (
                <p key={`paragraph-${index}`}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 rounded-xl border border-[#0f9aa1]/22 bg-[#f3fbfc] px-5 py-5 text-[#123e56]">
              <p className="text-[1.06rem] leading-8">Have you discovered something while cleaning up your community?</p>
              <p className="mt-3 text-[1.06rem] leading-8">We’d love to hear your story.</p>
              <Link href="/events?view=join#join-cleanup" className="mt-4 inline-flex text-[1.04rem] font-semibold text-[#0f9aa1] transition hover:text-[#0b8188] hover:underline">
                Join a Cleanup →
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#0f9aa1]/20 pt-6 text-sm font-semibold text-[#0f9aa1]">
              {previousPost ? (
                <Link href={`/blog/${previousPost.slug}`} className="transition hover:text-[#0b8188] hover:underline">
                  ← Previous Story
                </Link>
              ) : <span />}

              {nextPost ? (
                <Link href={`/blog/${nextPost.slug}`} className="transition hover:text-[#0b8188] hover:underline">
                  Next Story →
                </Link>
              ) : null}
            </div>
          </article>
        </div>
      </section>

      <Footer />
    </>
  );
}
