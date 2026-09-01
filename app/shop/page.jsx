import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Baloo_2 } from 'next/font/google';

const balooDisplay = Baloo_2({
  subsets: ['latin'],
  weight: ['700', '800'],
});

export default function Shop() {
  const products = [
    {
      id: 'official-volunteer-tshirt',
      group: 'Volunteer Collection',
      name: 'Volunteer T-Shirt',
      description: 'The official everyday volunteer tee made to represent clean neighborhoods and civic pride.',
      imageSrc: '/04ece613-7146-427c-a279-4d99082dea46.png',
      imageContainerClass: 'h-full w-full p-2',
      imageClass: 'scale-[1.9]',
      imagePlaceholder: 'Add official-volunteer-tshirt image',
      imageStyle: 'bg-[linear-gradient(145deg,_#0f9aa1_0%,_#2ec4c7_45%,_#69be28_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/official-pick-it-up-seattle-volunteer-t-shirt',
    },
    {
      id: 'volunteer-hat',
      group: 'Volunteer Collection',
      name: 'Volunteer Hat',
      description: 'A durable hat for cleanup days, neighborhood walks, and everyday support of the mission.',
      imageSrc: '/c113d976-3d6e-41f5-a5ef-f445dda426a1.png',
      imageContainerClass: '!mx-0 h-full w-full p-0',
      imageClass: 'scale-[1.25]',
      imagePlaceholder: 'Add volunteer-hat image',
      imageStyle: 'bg-[linear-gradient(145deg,_#0b7485_0%,_#0f9aa1_52%,_#2ec4c7_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/official-pick-it-up-seattle-volunteer-hat',
    },
    {
      id: 'youth-volunteer-tshirt',
      group: 'Volunteer Collection',
      name: 'Youth Volunteer T-Shirt',
      description: 'Youth-sized volunteer apparel to help younger supporters join and champion cleaner streets.',
      imageSrc: '/a6932f9c-3ed1-4d05-a979-b997ef77c8fb.png',
      imageContainerClass: 'h-full w-full p-2',
      imageClass: 'scale-[2]',
      imagePlaceholder: 'Add youth-volunteer-tshirt image',
      imageStyle: 'bg-[linear-gradient(145deg,_#2ec4c7_0%,_#7cd157_62%,_#69be28_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/official-pick-it-up-seattle-youth-volunteer-t-shirt',
    },
    {
      id: 'donor-hat',
      group: 'Supporter Collection',
      name: 'Donor Hat',
      description: 'A supporter favorite that celebrates your contribution to local cleanup momentum.',
      imageSrc: '/b88c9a4a-cfc5-4d0b-939e-44ab7f12ef1c.png',
      imageContainerClass: '!mx-0 h-full w-full p-0',
      imageClass: 'scale-[1.25]',
      imagePlaceholder: 'Add donor-hat image',
      imageStyle: 'bg-[linear-gradient(145deg,_#002244_0%,_#1f5f7a_58%,_#2ec4c7_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/official-pick-it-up-seattle-donor-embroidered-hat',
    },
    {
      id: 'founding-donor-hat',
      group: 'Supporter Collection',
      name: 'Founding Donor Hat',
      description: 'Commemorates early supporters who helped establish the Pick It Up Seattle movement.',
      imageSrc: '/0ca8b89b-b0a2-485c-82f0-588ebcc71f32.png',
      imageContainerClass: '!mx-0 h-full w-full p-0',
      imageClass: 'scale-[1.25]',
      imagePlaceholder: 'Add founding-donor-hat image',
      imageStyle: 'bg-[linear-gradient(145deg,_#f4c94c_0%,_#f59a2d_55%,_#0f9aa1_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/official-pick-it-up-seattle-founding-donor-embroidered-hat',
    },
    {
      id: 'legacy-donor-hat',
      group: 'Supporter Collection',
      name: 'Legacy Donor Hat',
      description: 'Honors ongoing donors building a lasting legacy of stewardship across Seattle neighborhoods.',
      imageSrc: '/67b309ac-e1ed-48f6-9ebd-2d15c709ad9d.png',
      imageContainerClass: '!mx-0 h-full w-full p-0',
      imageClass: 'scale-[1.25]',
      imagePlaceholder: 'Add legacy-donor-hat image',
      imageStyle: 'bg-[linear-gradient(145deg,_#69be28_0%,_#0f9aa1_50%,_#002244_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/official-pick-it-up-seattle-legacy-donor-embroidered-hat',
    },
    {
      id: 'signature-hat',
      group: 'Signature Collection',
      name: 'Legacy Donor T-Shirt',
      description: 'Recognizes extraordinary generosity and a lasting commitment to cleaner, stronger communities.',
      imageSrc: '/e449992a-5074-4a93-b6a2-4ba4d4660da6.png',
      imageContainerClass: 'h-full w-full p-2',
      imageClass: 'scale-[1.1]',
      imagePlaceholder: 'ADD OFFICIAL LEGACY DONOR T-SHIRT IMAGE',
      imageStyle: 'bg-[linear-gradient(145deg,_#1f5f7a_0%,_#0f9aa1_55%,_#f4c94c_100%)]',
        productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/the-official-pick-t-p-seattle-legacy-donor-embroidered-t-shirt',
    },
    {
      id: 'official-pick-it-up-seattle-hat',
      group: 'Signature Collection',
      name: 'Pick It Up Seattle Hat',
      description: 'The official flagship hat representing one simple action that improves every neighborhood.',
      imageSrc: '/a38aa86c-5e88-4e34-8422-c29491c1bb30.png',
      imageContainerClass: '!mx-0 h-full w-full p-0',
      imageClass: 'scale-[1.25]',
      imagePlaceholder: 'Add official-pick-it-up-seattle-hat image',
      imageStyle: 'bg-[linear-gradient(145deg,_#002244_0%,_#0f9aa1_48%,_#69be28_82%,_#f4c94c_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/official-pick-it-up-seattle-signature-hat',
    },
    {
      id: 'dont-be-trashy-tee',
      group: 'Signature Collection',
      name: 'Don’t Be Trashy Tee',
      price: '$29.95',
      description: 'Bring a little humor to doing something good. The Don’t Be Trashy Tee puts a playful spin on the Pick It Up Seattle message while encouraging others to leave the city a little better than they found it.',
      descriptionSpacer: true,
      imageSrc: "/Don't be Trashy Tee.png",
      imageContainerClass: 'h-full w-full p-2',
      imageClass: 'scale-[1.1]',
      imagePlaceholder: 'Add dont-be-trashy-tee image',
      imageStyle: 'bg-[linear-gradient(145deg,_#0f9aa1_0%,_#2ec4c7_45%,_#69be28_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/dont-be-trashy-te',
    },
    {
      id: 'mess-master-tee',
      group: 'Signature Collection',
      name: 'Mess Master Tee',
      description: 'Bring a little attitude to doing something good. The Mess Master Tee celebrates the people who aren’t afraid to tackle the mess and leave Seattle a little better than they found it. Playful, bold, and unmistakably Pick It Up Seattle.',
      imageSrc: '/Mess Master tee.png',
      imageContainerClass: 'h-full w-full p-2',
      imageClass: 'scale-x-[1.52] scale-y-[1.4]',
      imagePlaceholder: 'Add mess-master-tee image',
      imageStyle: 'bg-[linear-gradient(145deg,_#0f9aa1_0%,_#2ec4c7_45%,_#69be28_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/mess-master-tee',
    },
    {
      id: 'one-person-one-piece-one-better-seattle-youth-tee',
      group: 'Signature Collection',
      name: 'One Better Seattle Youth Tee',
      description: 'Our core PIUS message in a simple tee for kids and small adults who want to be part of the movement.',
      imageSrc: '/One person Youth Tee.png',
      imageContainerClass: 'h-full w-full p-2',
      imageClass: 'scale-[1.1]',
      imagePlaceholder: 'Add one-person-one-piece-one-better-seattle-youth-tee image',
      imageStyle: 'bg-[linear-gradient(145deg,_#0f9aa1_0%,_#2ec4c7_45%,_#69be28_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/official-pick-it-up-seattle-one-person-one-piece-one-better-seattle-youth-tee',
    },
    {
      id: 'one-person-one-piece-one-better-seattle-adult-tee',
      group: 'Signature Collection',
      name: 'One Better Seattle Adult Tee',
      description: 'Wear the Pick It Up Seattle message wherever you go—and inspire someone else to do the same.',
      imageSrc: '/One person Adult Tee.png',
      imageContainerClass: 'h-full w-full p-2',
      imageClass: 'scale-[1.1]',
      imagePlaceholder: 'Add one-person-one-piece-one-better-seattle-adult-tee image',
      imageStyle: 'bg-[linear-gradient(145deg,_#0f9aa1_0%,_#2ec4c7_45%,_#69be28_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/official-pick-it-up-seattle-adult-one-better-seattle-tee',
    },
    {
      id: 'one-person-one-piece-one-better-seattle-unisex-hoodie',
      group: 'Signature Collection',
      name: 'One Person. One Piece. One Better Seattle. Unisex Hoodie',
      description: 'Stay warm while wearing the Pick It Up Seattle message. A comfortable, practical zip-up hoodie with the PIUS logo on the back and “One person. One piece. One Better Seattle.” on the sleeve.',
      imageSrc: '/One person Unisex Hoodie.png',
      imageContainerClass: 'h-full w-full p-2',
      imageClass: 'scale-[1.1]',
      imagePlaceholder: 'Add one-person-one-piece-one-better-seattle-unisex-hoodie image',
      imageStyle: 'bg-[linear-gradient(145deg,_#0f9aa1_0%,_#2ec4c7_45%,_#69be28_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/official-pick-it-up-seattle-one-person-one-piece-one-better-seattle-unisex-hoodie',
    },
  ];

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-[linear-gradient(115deg,_#002244_0%,_#0f9aa1_54%,_#69be28_100%)] py-16 text-white sm:py-20">
        <div className="container-custom">
          <h1 className={`${balooDisplay.className} mb-2 text-[2.8rem] font-extrabold leading-[0.92] tracking-[-0.015em] text-[#fffaf0] sm:text-[3.9rem]`}>
            Wear the Movement!
          </h1>

          <div className="mb-5 flex justify-center" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#2ec4c7]" fill="currentColor">
              <path d="M12 21.35C11.56 21.35 11.13 21.2 10.79 20.91C9.51 19.86 8.31 18.89 7.24 18.03C4.11 15.5 2 13.8 2 10.5C2 7.91 4.01 6 6.6 6C8.1 6 9.54 6.69 10.5 7.84C11.46 6.69 12.9 6 14.4 6C16.99 6 19 7.91 19 10.5C19 13.8 16.89 15.5 13.76 18.03C12.69 18.89 11.49 19.86 10.21 20.91C9.87 21.2 9.44 21.35 9 21.35H12Z" />
            </svg>
          </div>

          <p className="mx-auto max-w-4xl text-center text-xl leading-[1.85] text-[#fff8e8] sm:text-2xl">
            Every purchase helps spread a simple message: <span className="font-bold uppercase tracking-[0.02em]">ONE PERSON. ONE PIECE. ONE BETTER CITY.</span> Thank you for supporting Pick It Up Seattle.
          </p>
        </div>
      </section>

      {/* Product Cards */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container-custom">
          <div className="mb-8 rounded-2xl border border-[#0f9aa1]/20 bg-[linear-gradient(180deg,_#ffffff_0%,_#fffaf0_100%)] p-5 shadow-[0_14px_30px_rgba(0,43,73,0.08)] sm:p-6">
            <p className="text-xl font-bold text-[#ef7f2d] sm:text-2xl">Collection Groups</p>
            <p className="mt-3 text-base font-bold leading-relaxed text-[#35566f] sm:text-lg">
              <span className="text-[#0f9aa1]">Volunteer Collection</span>, <span className="text-[#69be28]">Supporter Collection</span>, and <span className="text-[#f4c94c]">Signature Collection</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#0f9aa1]/20 bg-white shadow-[0_14px_30px_rgba(0,43,73,0.12)] transition hover:shadow-[0_18px_40px_rgba(0,43,73,0.16)]"
              >
                <div className={`${product.imageStyle} relative flex h-56 items-center justify-center`}>
                  {product.imageSrc ? (
                    <div className={`mx-4 flex items-center justify-center ${product.imageContainerClass ?? 'h-[88%] w-[88%] p-3'}`}>
                      <img
                        src={product.imageSrc}
                        alt={`${product.name} product image`}
                        className={`h-full w-full object-contain object-center ${product.imageClass ?? ''}`}
                      />
                    </div>
                  ) : product.hidePlaceholder ? (
                    <div className="h-[88%] w-[88%]" aria-hidden="true" />
                  ) : (
                    <div className="mx-4 rounded-xl border border-white/55 bg-white/22 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-white sm:text-sm">
                      Image Placeholder: {product.imagePlaceholder}
                    </div>
                  )}
                </div>

                <div className="flex h-full flex-col p-6">
                  <p className={`${balooDisplay.className} text-center text-xs font-bold uppercase tracking-[0.18em] text-[#0f9aa1]`}>
                    {product.group}
                  </p>
                  <div className="mt-2 min-h-[12rem]">
                    <p className={`${balooDisplay.className} text-center text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[#1f5f7a]`}>
                      Official
                    </p>
                    <h2 className={`${balooDisplay.className} text-center text-[1.45rem] font-bold leading-tight text-[#002b49]`}>
                      {product.name}
                    </h2>
                    <p className="mt-3 text-[0.98rem] leading-7 text-[#516b7d] sm:text-[1.04rem]">
                      {product.description}
                      {product.descriptionSpacer ? <><br /><br /></> : null}
                    </p>
                  </div>

                  <div className="mt-auto pt-2">
                    <a
                      href={product.productUrl}
                      className="btn-primary w-full rounded-xl px-5 py-3 text-center text-sm font-extrabold sm:text-base"
                    >
                      Shop Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
