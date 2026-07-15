import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Shop() {
  const products = [
    {
      id: 'logo-tshirt',
      name: 'Pick It Up Logo T-Shirt',
      price: '$18.00',
      image: '👕',
      description: 'Comfortable cotton t-shirt with our iconic green leaf logo',
    },
    {
      id: 'trucker-hat',
      name: 'Pick It Up Trucker Hat',
      price: '$22.00',
      image: '🧢',
      description: 'Classic mesh back trucker hat, perfect for cleanup days',
    },
    {
      id: 'water-bottle',
      name: 'Stainless Steel Water Bottle',
      price: '$28.00',
      image: '💧',
      description: '16oz insulated bottle keeps drinks cold all day long',
    },
    {
      id: 'sticker-pack',
      name: 'Sticker Pack (5 pack)',
      price: '$8.00',
      image: '🎫',
      description: 'Die-cut vinyl stickers featuring our logo and fun designs',
    },
    {
      id: 'volunteer-hoodie',
      name: 'Volunteer Hoodie',
      price: '$45.00',
      image: '🧥',
      description: 'Warm and comfortable hoodie for those cool Seattle mornings',
    },
    {
      id: 'tote-bag',
      name: 'Canvas Tote Bag',
      price: '$24.00',
      image: '👜',
      description: 'Reusable canvas bag for carrying your cleanup supplies',
    },
    {
      id: 'socks',
      name: 'Funny Cleanup Crew Socks',
      price: '$12.00',
      image: '🧦',
      description: 'Cozy socks with fun cleanup-themed designs',
    },
    {
      id: 'phone-case',
      name: 'Phone Case',
      price: '$15.00',
      image: '📱',
      description: 'Durable phone case with our Pick It Up logo',
    },
  ];

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-seattle-green to-green-700 text-white py-16">
        <div className="container-custom">
          <h1 className="heading-xl mb-4">Pick It Up Shop</h1>
          <p className="text-lg text-green-100">
            Show your support with Pick It Up Seattle merchandise
          </p>
        </div>
      </section>

      {/* Info Banner */}
      <section className="bg-blue-50 border-l-4 border-seattle-blue p-4 text-center">
        <p className="text-gray-700">
          <strong>100% of proceeds support our mission</strong> to keep Seattle clean and beautiful.
        </p>
      </section>

      {/* Products */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="bg-gradient-to-r from-seattle-green to-green-600 h-40 flex items-center justify-center">
                  <span className="text-6xl">{product.image}</span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-seattle-green">{product.price}</span>
                    <button className="btn-primary py-2 px-4 text-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Orders */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Need Custom Merchandise?</h2>
          <p className="text-gray-600 mb-6">
            Looking for bulk orders or custom designs for your group? We\' d love to help!
          </p>
          <Link href="/contact" className="btn-secondary">
            Get in Touch
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container-custom max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop FAQ</h2>
          <div className="space-y-4">
            <details className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <summary className="font-bold text-seattle-green">What\' s your shipping policy?</summary>
              <p className="text-gray-700 mt-2">
                We ship orders within 5 business days to addresses in the US. Free shipping on orders
                over $50!
              </p>
            </details>
            <details className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <summary className="font-bold text-seattle-green">Do you ship internationally?</summary>
              <p className="text-gray-700 mt-2">
                Currently, we only ship within the US. Contact us for international inquiries.
              </p>
            </details>
            <details className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <summary className="font-bold text-seattle-green">What\' s your return policy?</summary>
              <p className="text-gray-700 mt-2">
                We offer 30-day returns on all merchandise. Items must be unworn and in original
                condition.
              </p>
            </details>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
