import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StorySubmissionForm from '@/components/StorySubmissionForm';
import { ensureFirstPostExists, getPublishedPosts } from '@/lib/blog-repository';
import { formatPublicationDate } from '@/lib/blog-post-utils';
import { STORY_CATEGORIES } from '@/lib/story-categories';

export const dynamic = 'force-dynamic';

const storyCategoryCardStyles = [
  {
    className: 'bg-[linear-gradient(145deg,_#0f9aa1_0%,_#2ec4c7_45%,_#69be28_100%)]',
    titleClassName: 'text-white',
    descriptionClassName: 'text-[#f2fdff]',
  },
  {
    className: 'bg-[linear-gradient(145deg,_#0b7485_0%,_#0f9aa1_52%,_#2ec4c7_100%)]',
    titleClassName: 'text-white',
    descriptionClassName: 'text-[#f2fdff]',
  },
  {
    className: 'bg-[linear-gradient(145deg,_#2ec4c7_0%,_#7cd157_62%,_#69be28_100%)]',
    titleClassName: 'text-[#002244]',
    descriptionClassName: 'text-[#0a3b25]',
  },
  {
    className: 'bg-[linear-gradient(145deg,_#002244_0%,_#1f5f7a_58%,_#2ec4c7_100%)]',
    titleClassName: 'text-white',
    descriptionClassName: 'text-[#e8fbff]',
  },
  {
    className: 'bg-[linear-gradient(145deg,_#f4c94c_0%,_#f59a2d_55%,_#0f9aa1_100%)]',
    titleClassName: 'text-[#002244]',
    descriptionClassName: 'text-[#3b2c00]',
  },
  {
    className: 'bg-[linear-gradient(145deg,_#69be28_0%,_#0f9aa1_50%,_#002244_100%)]',
    titleClassName: 'text-white',
    descriptionClassName: 'text-[#f2fdff]',
  },
  {
    className: 'bg-[linear-gradient(145deg,_#1f5f7a_0%,_#0f9aa1_55%,_#f4c94c_100%)]',
    titleClassName: 'text-white',
    descriptionClassName: 'text-[#fef7df]',
  },
  {
    className: 'bg-[linear-gradient(145deg,_#002244_0%,_#0f9aa1_48%,_#69be28_82%,_#f4c94c_100%)]',
    titleClassName: 'text-white',
    descriptionClassName: 'text-[#fff8e8]',
  },
];

export default async function BlogPage() {
  let posts = [];

  try {
    await ensureFirstPostExists();
  } catch {
    // Keep going so existing published posts still render even if seed write fails.
  }

  try {
    posts = await getPublishedPosts();
  } catch {
    posts = [];
  }

  return (
    <>
      <Header />

      <section className="bg-gradient-to-r from-seattle-green to-green-700 py-16 text-white">
        <div className="container-custom mx-auto max-w-[1080px]">
          <h1 className="heading-xl mb-4">Stories from Our Community</h1>
          <p className="max-w-3xl text-[1.3rem] text-green-100">
            Real people. Real experiences. Real impact.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-12" id="share-your-story">
        <div className="container-custom mx-auto max-w-[1080px]">
          <h2 className="text-[2.05rem] font-bold text-[#002244] sm:text-[2.45rem]">Every Cleanup Has a Story.</h2>
          <div className="mt-4 max-w-5xl space-y-4 text-[1.12rem] leading-8 text-[#1f5f7a]">
            <p>
              Whether you’re an individual volunteer, family, school, business, nonprofit, neighborhood group, sponsor, partner, or event organizer, your experiences can encourage someone else.
            </p>
            <p>Some stories celebrate people.</p>
            <p>Some celebrate partnerships.</p>
            <p>Some simply remind us why kindness matters.</p>
            <p>We’d love to hear yours.</p>
          </div>

          <div className="mt-4">
            <StorySubmissionForm />
          </div>
        </div>
      </section>

      <section className="py-4 sm:py-5" id="latest-stories">
        <div className="container-custom mx-auto max-w-[1080px]">
          <h2 className="text-[2.05rem] font-bold text-[#002244] sm:text-[2.45rem]">Latest Stories</h2>

          {posts.length === 0 ? (
            <div className="mt-6 mx-auto max-w-3xl rounded-2xl border border-[#0f9aa1]/20 bg-white px-6 py-10 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-[#002244]">No published posts yet.</h2>
              <p className="mt-3 text-base leading-relaxed text-[#1f5f7a]">
                New stories will appear here as soon as they are published.
              </p>
            </div>
          ) : (
            <div className="mt-7 mx-auto flex max-w-[800px] flex-col gap-6">
              {posts.map((post) => (
                <article key={post.id} className="overflow-hidden rounded-3xl border border-[#0f9aa1]/20 bg-white shadow-[0_20px_52px_-32px_rgba(0,64,84,0.55)]">
                  {post.featuredImageUrl ? (
                    <img
                      src={post.featuredImageUrl}
                      alt={post.title}
                      className="h-56 w-full object-cover"
                    />
                  ) : null}
                  <div className="px-7 py-7 sm:px-8 sm:py-8">
                    <p className="inline-flex rounded-full bg-[#eaf8f9] px-3 py-1 text-xs font-semibold text-[#0f9aa1]">
                      {post.category}
                    </p>
                    <h3 className="mt-3 text-[2rem] font-bold leading-tight text-[#002244]">{post.title}</h3>
                    <p className="mt-2 text-base font-medium text-[#1f5f7a]">
                      {formatPublicationDate(post.publishedAt)} • By {post.author}
                    </p>
                    <p className="mt-4 text-[1.1rem] leading-8 text-[#123e56]">{post.previewText}</p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-5 inline-flex text-[1.02rem] font-semibold text-[#0f9aa1] transition hover:text-[#0b8188] hover:underline"
                    >
                      Read Story →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden py-8 sm:py-10">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(15,154,161,0.16),_transparent_55%),radial-gradient(circle_at_bottom_right,_rgba(28,140,84,0.12),_transparent_45%)]" />
        <div className="container-custom mx-auto max-w-[1080px]">
          <h2 className="text-[2.05rem] font-bold text-[#002244] sm:text-[2.45rem]">Story Categories</h2>
          <p className="mt-2 max-w-4xl text-[1.08rem] text-[#1f5f7a]">
            Discover the people, partnerships, and moments shaping a cleaner Seattle.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STORY_CATEGORIES.map((category, index) => {
              const cardStyle = storyCategoryCardStyles[index % storyCategoryCardStyles.length];

              return (
              <article
                key={category.key}
                className={`group rounded-3xl border border-white/20 p-5 shadow-[0_18px_45px_-28px_rgba(0,64,84,0.45)] transition hover:-translate-y-1 hover:shadow-[0_26px_58px_-30px_rgba(0,64,84,0.5)] ${cardStyle.className}`}
              >
                <p className="text-3xl" aria-hidden="true">{category.icon}</p>
                <h3 className={`mt-3 text-xl font-bold ${cardStyle.titleClassName}`}>{category.title}</h3>
                <p className={`mt-2 text-sm leading-7 ${cardStyle.descriptionClassName}`}>{category.description}</p>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
