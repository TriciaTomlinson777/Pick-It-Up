import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Blog() {
  const posts = [
    {
      id: 'july-impact',
      title: 'July Impact: 500 Volunteers, 2 Tons of Trash',
      date: 'July 15, 2024',
      author: 'Sarah Johnson',
      excerpt:
        'A month of incredible community action across Seattle neighborhoods. Here\' s what we accomplished together.',
      image: '📊',
    },
    {
      id: 'green-lake-story',
      title: 'The Green Lake Transformation',
      date: 'July 10, 2024',
      author: 'Marcus Chen',
      excerpt:
        'How volunteers have completely transformed the areas around Green Lake over the past three months.',
      image: '🌳',
    },
    {
      id: 'volunteer-spotlight',
      title: 'Volunteer Spotlight: Meet Jamie',
      date: 'July 5, 2024',
      author: 'Elena Rodriguez',
      excerpt:
        'Jamie has been with us since day one and has become an inspiring leader in the Pick It Up community.',
      image: '⭐',
    },
    {
      id: 'marine-litter',
      title: 'Understanding Marine Litter',
      date: 'June 28, 2024',
      author: 'James Park',
      excerpt:
        'Why our beach cleanups are so important and how you can help protect our marine ecosystems.',
      image: '🌊',
    },
    {
      id: 'team-building',
      title: 'Corporate Cleanup: Great Team Building',
      date: 'June 20, 2024',
      author: 'Sarah Johnson',
      excerpt:
        'How local companies are using our cleanup events as team building activities with real impact.',
      image: '🤝',
    },
    {
      id: 'sustainability-tips',
      title: 'Simple Sustainability Tips for Daily Life',
      date: 'June 15, 2024',
      author: 'Elena Rodriguez',
      excerpt:
        'Beyond cleanup day: ways to reduce your environmental impact and live more sustainably in Seattle.',
      image: '♻️',
    },
  ];

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-seattle-green to-green-700 text-white py-16">
        <div className="container-custom">
          <h1 className="heading-xl mb-4">Blog</h1>
          <p className="text-lg text-green-100">
            Stories, updates, and insights from Pick It Up Seattle
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="bg-gradient-to-r from-seattle-green to-green-600 h-32 flex items-center justify-center">
                  <span className="text-5xl">{post.image}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <time className="text-sm text-gray-500">{post.date}</time>
                    <span className="text-sm text-gray-500">By {post.author}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 hover:text-seattle-green transition">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-seattle-green font-semibold hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-6">
            Get weekly updates about upcoming events and impact stories delivered to your inbox
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-seattle-green"
              required
            />
            <button className="btn-primary" type="submit">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
