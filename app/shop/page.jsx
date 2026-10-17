import Image from 'next/image';
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
      id: 'signature-hat',
      category: 'Adult & Unisex',
      group: 'Signature Collection',
      name: 'Legacy Donor T-Shirt',
      description: 'Recognizes extraordinary generosity and a lasting commitment to cleaner, stronger communities.',
      imageSrc: '/shop-optimized/product-01.webp',
      imageWidth: 640,
      imageHeight: 960,
      imageContainerClass: 'h-full w-full p-2',
      imageClass: 'scale-[1.1]',
      imagePlaceholder: 'ADD OFFICIAL LEGACY DONOR T-SHIRT IMAGE',
      imageStyle: 'bg-[linear-gradient(145deg,_#1f5f7a_0%,_#0f9aa1_55%,_#f4c94c_100%)]',
        productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/the-official-pick-it-up-seattle-legacy-donor-embroidered-t-shirt',
    },
    {
      id: 'official-pick-it-up-seattle-hat',
      category: 'Accessories',
      group: 'Signature Collection',
      name: 'Pick It Up Seattle Hat',
      description: 'The official flagship hat representing one simple action that improves every neighborhood.',
      imageSrc: '/shop-optimized/product-02.webp',
      imageWidth: 640,
      imageHeight: 960,
      imageContainerClass: '!mx-0 h-full w-full p-0',
      imageClass: 'scale-[1.25]',
      imagePlaceholder: 'Add official-pick-it-up-seattle-hat image',
      imageStyle: 'bg-[linear-gradient(145deg,_#002244_0%,_#0f9aa1_48%,_#69be28_82%,_#f4c94c_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/official-pick-it-up-seattle-signature-hat',
    },
    {
      id: 'dont-be-trashy-tee',
      category: 'Adult & Unisex',
      group: 'Signature Collection',
      name: 'Don’t Be Trashy Tee',
      price: '$29.95',
      description: 'Bring a little humor to doing something good. The Don’t Be Trashy Tee puts a playful spin on the Pick It Up Seattle message while encouraging others to leave the city a little better than they found it.',
      descriptionSpacer: true,
      imageSrc: '/shop-optimized/product-03.webp',
      imageWidth: 960,
      imageHeight: 960,
      imageContainerClass: 'h-full w-full p-2',
      imageClass: 'scale-[1.1]',
      imagePlaceholder: 'Add dont-be-trashy-tee image',
      imageStyle: 'bg-[linear-gradient(145deg,_#0f9aa1_0%,_#2ec4c7_45%,_#69be28_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/dont-be-trashy-tee',
    },
    {
      id: 'mess-master-tee',
      category: 'Adult & Unisex',
      group: 'Signature Collection',
      name: 'Mess Master Tee',
      description: 'Bring a little attitude to doing something good. The Mess Master Tee celebrates the people who aren’t afraid to tackle the mess and leave every place a little better than they found it. Playful, bold, and unmistakably Pick It Up Seattle.',
      imageSrc: '/shop-optimized/product-04.webp',
      imageWidth: 640,
      imageHeight: 960,
      imageContainerClass: 'h-full w-full p-2',
      imageClass: 'scale-x-[1.52] scale-y-[1.4]',
      imagePlaceholder: 'Add mess-master-tee image',
      imageStyle: 'bg-[linear-gradient(145deg,_#0f9aa1_0%,_#2ec4c7_45%,_#69be28_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/mess-master-unisex-tee',
    },
    {
      id: 'one-person-one-piece-one-better-seattle-youth-tee',
      category: 'Youth',
      group: 'Signature Collection',
      name: 'One Better Seattle Youth Tee',
      description: 'Our core PIUS message in a simple tee for kids and small adults who want to be part of the movement.',
      imageSrc: '/shop-optimized/product-05.webp',
      imageWidth: 960,
      imageHeight: 720,
      imageContainerClass: 'h-full w-full p-2',
      imageClass: 'scale-[1.1]',
      imagePlaceholder: 'Add one-person-one-piece-one-better-seattle-youth-tee image',
      imageStyle: 'bg-[linear-gradient(145deg,_#0f9aa1_0%,_#2ec4c7_45%,_#69be28_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/official-pick-it-up-seattle-one-person-one-piece-one-better-seattle-youth-tee',
    },
    {
      id: 'captain-can-litter-hero-tee',
      category: 'Youth',
      group: 'Signature Collection',
      name: 'Captain Can — Little Litter Hero Tee',
      description: `Meet Captain Can — the little trash can with a big mission!

This fun kids’ T-shirt features Captain Can from Captain Can and the Messy Block, part of the Pick It Up Seattle children’s series. It’s a cheerful reminder that even the smallest litter hero can make a big difference.

Perfect for young readers, neighborhood helpers, cleanup days, school activities, or any kid who wants to help make their community a little cleaner and brighter.

One person. One piece. One better city.

Every shirt helps support the Pick It Up Seattle mission of inspiring people of all ages to leave every place better than they found it.`,
      imageSrc: '/shop-optimized/product-06.webp',
      imageWidth: 960,
      imageHeight: 720,
      imageContainerClass: 'h-full w-full p-2',
      imageClass: 'scale-[1.1]',
      imagePlaceholder: 'Add captain-can-litter-hero-tee image',
      imageStyle: 'bg-[linear-gradient(145deg,_#0f9aa1_0%,_#2ec4c7_45%,_#69be28_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/captain-can-litter-hero-tee',
    },
    {
      id: 'captain-can-little-hero-toddler-t-shirt',
      category: 'Youth',
      group: 'Signature Collection',
      name: 'Captain Can Little Hero Toddler T-Shirt',
      description: `Little heroes can make a big difference! Featuring Captain Can, this cheerful toddler T-shirt celebrates kindness, community pride, and learning to leave every place a little better than you found it. It’s a fun choice for everyday adventures, neighborhood walks, and little helpers who are ready to pick it up!

All proceeds support Pick It Up Seattle’s work to make it easier—and more fun—for people to help make their communities cleaner and more beautiful.

One person. One piece. One better city.`,
      imageSrc: '/shop-optimized/product-07.webp',
      imageWidth: 960,
      imageHeight: 960,
      imageContainerClass: 'h-full w-full p-2',
      imageClass: 'scale-[1.1]',
      imagePlaceholder: 'Add captain-can-little-hero-toddler-t-shirt image',
      imageStyle: 'bg-[linear-gradient(145deg,_#0f9aa1_0%,_#2ec4c7_45%,_#69be28_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/bella-canvas-toddler-t-shirt',
    },
    {
      id: 'one-person-one-piece-one-better-seattle-adult-tee',
      category: 'Adult & Unisex',
      group: 'Signature Collection',
      name: 'One Better Seattle Adult Tee',
      description: 'Wear the Pick It Up Seattle message wherever you go—and inspire someone else to do the same.',
      imageSrc: '/shop-optimized/product-08.webp',
      imageWidth: 960,
      imageHeight: 720,
      imageContainerClass: 'h-full w-full p-2',
      imageClass: 'scale-[1.1]',
      imagePlaceholder: 'Add one-person-one-piece-one-better-seattle-adult-tee image',
      imageStyle: 'bg-[linear-gradient(145deg,_#0f9aa1_0%,_#2ec4c7_45%,_#69be28_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/official-pick-it-up-seattle-adult-one-better-seattle-tee',
    },
    {
      id: 'one-person-one-piece-one-better-seattle-unisex-hoodie',
      category: 'Adult & Unisex',
      group: 'Signature Collection',
      name: 'One Person. One Piece. One Better Seattle. Unisex Hoodie',
      description: 'Stay warm while wearing the Pick It Up Seattle message. A comfortable, practical zip-up hoodie with the PIUS logo on the back and “One person. One piece. One Better Seattle.” on the sleeve.',
      imageSrc: '/shop-optimized/product-09.webp',
      imageWidth: 960,
      imageHeight: 720,
      imageContainerClass: 'h-full w-full p-2',
      imageClass: 'scale-[1.1]',
      imagePlaceholder: 'Add one-person-one-piece-one-better-seattle-unisex-hoodie image',
      imageStyle: 'bg-[linear-gradient(145deg,_#0f9aa1_0%,_#2ec4c7_45%,_#69be28_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/official-pick-it-up-seattle-one-person-one-piece-one-better-seattle-unisex-hoodie',
    },
    {
      id: 'one-person-one-piece-one-better-seattle-unisex-tee',
      category: 'Adult & Unisex',
      group: 'Signature Collection',
      name: 'One Person. One Piece. One Better Seattle. Unisex Tee',
      description: 'A refined take on the Pick It Up Seattle message, this tee pairs everyday comfort with a more elevated feel. Perfect for neighborhood walks, volunteer days, community events, or simply carrying the message wherever you go.',
      imageSrc: '/shop-optimized/product-10.webp',
      imageWidth: 960,
      imageHeight: 720,
      imageContainerClass: 'h-full w-full p-2',
      imageClass: 'scale-[1.1]',
      imagePlaceholder: 'Add one-person-one-piece-one-better-seattle-unisex-tee image',
      imageStyle: 'bg-[linear-gradient(145deg,_#0f9aa1_0%,_#2ec4c7_45%,_#69be28_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/official-pick-it-up-seattle-one-person-one-piece-one-better-seattle-unisex-t-shirt',
    },
    {
      id: 'mess-master-unisex-tee',
      category: 'Adult & Unisex',
      group: 'Signature Collection',
      name: 'Mess Master Unisex Tee',
      description: 'Bring a little attitude to doing something good. The Mess Master Unisex Tee celebrates the people who aren’t afraid to tackle the mess and leave every place a little better than they found it. Playful, bold, and unmistakably Pick It Up Seattle.',
      imageSrc: '/shop-optimized/product-11.webp',
      imageWidth: 960,
      imageHeight: 720,
      imageContainerClass: 'h-full w-full p-2',
      imageClass: 'scale-[1.1]',
      imagePlaceholder: 'Add mess-master-unisex-tee image',
      imageStyle: 'bg-[linear-gradient(145deg,_#0f9aa1_0%,_#2ec4c7_45%,_#69be28_100%)]',
      productUrl: 'https://pick-it-up-seattle-shop.fourthwall.com/products/mess-master-unisex-black-tee',
    },
    {
      id: 'single-litter-grabber', category: 'Tools', group: 'Adult & Family Tools',
      name: 'Single Litter Grabber',
      description: 'A folding 32-inch grabber for everyday litter pickup. The listing describes a precision grip for small items, including coins. Check the reach and grip before choosing for a child.',
      affiliate: true, productImageUrl: 'https://m.media-amazon.com/images/I/61hb+1YlFpL._SL1500_.jpg', productUrl: 'https://amzn.to/4yqreD2',
    },
    {
      id: 'two-pack-litter-grabbers', category: 'Tools', group: 'Adult & Family Tools',
      name: 'Litter Grabbers — 2-Pack',
      description: 'Two grabbers for a pair of helpers or a family cleanup. Review the product dimensions to choose a comfortable fit for each person.',
      affiliate: true, productImageUrl: 'https://m.media-amazon.com/images/I/51Xnz9wcM9L._SL1500_.jpg', productUrl: 'https://amzn.to/3VQStt2',
    },
    {
      id: 'eight-pack-litter-grabbers', category: 'Tools', group: 'Adult & Family Tools',
      name: 'Group Cleanup Grabbers — 8-Pack',
      description: 'An eight-pack for organizing a group cleanup, with a grabber for each helper. Check the listing for sizes and what is included.',
      affiliate: true, productImageUrl: 'https://m.media-amazon.com/images/I/712c0oaM7RL._AC_SL1500_.jpg', productUrl: 'https://amzn.to/4i58wL8',
    },
    {
      id: 'adult-cleanup-gloves', category: 'Tools', group: 'Adult Tools',
      name: 'Adult Cleanup Gloves',
      description: 'Gloves for adult cleanup helpers. Review the available sizes, materials, and care instructions on Amazon before choosing your pair.',
      affiliate: true, productImageUrl: 'https://m.media-amazon.com/images/I/91knZI4THCL._AC_SL1500_.jpg', productUrl: 'https://amzn.to/4BdK3Mi',
    },
    {
      id: 'kids-cleanup-gloves-single', category: 'Tools', group: 'Kids Tools',
      name: 'Kids Cleanup Gloves — Single Pair',
      description: 'For parents and caregivers choosing gloves for a young helper. Check the size chart and product details for a comfortable fit. Adult supervision is required during cleanup.',
      affiliate: true, productImageUrl: 'https://m.media-amazon.com/images/I/81eqY1n-9EL._AC_SL1500_.jpg', productUrl: 'https://amzn.to/4jW5ify',
    },
    {
      id: 'kids-cleanup-gloves-four-pack', category: 'Tools', group: 'Kids Tools',
      name: 'Kids Cleanup Gloves — 4-Pack',
      description: 'A four-pack of children’s gloves, with size options available in the listing. Parents and caregivers should check sizing. Cut-resistant does not mean cut-proof; children should never handle sharp or hazardous litter.',
      affiliate: true, productImageUrl: 'https://m.media-amazon.com/images/I/91Imb9rIy2S._AC_SL1500_.jpg', productUrl: 'https://amzn.to/4i3AlTY',
    },
  ];

  const productCategories = ['Adult & Unisex', 'Youth', 'Accessories', 'Tools'];

  return (
    <>
      <Header prefetchLinks={false} />

      {/* Hero */}
      <section className="bg-[linear-gradient(115deg,_#002244_0%,_#0f9aa1_54%,_#69be28_100%)] py-16 text-white sm:py-20">
        <div className="container-custom">
          <h1 className={`${balooDisplay.className} mb-2 text-center text-[2.8rem] font-extrabold leading-[0.92] tracking-[-0.015em] text-[#fffaf0] sm:text-[3.9rem]`}>
            Wear the Movement!
          </h1>

          <p className="mx-auto mb-5 mt-4 max-w-4xl text-center text-xl leading-[1.85] text-[#fff8e8] sm:text-2xl">
            Pick It Up Seattle is a <span className="font-bold">501(c)(3) nonprofit</span>. Every purchase supports our mission to help create cleaner, more beautiful communities.
          </p>

          <div className="mb-5 flex justify-center" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#2ec4c7]" fill="currentColor">
              <path d="M12 21.35C11.56 21.35 11.13 21.2 10.79 20.91C9.51 19.86 8.31 18.89 7.24 18.03C4.11 15.5 2 13.8 2 10.5C2 7.91 4.01 6 6.6 6C8.1 6 9.54 6.69 10.5 7.84C11.46 6.69 12.9 6 14.4 6C16.99 6 19 7.91 19 10.5C19 13.8 16.89 15.5 13.76 18.03C12.69 18.89 11.49 19.86 10.21 20.91C9.87 21.2 9.44 21.35 9 21.35H12Z" />
            </svg>
          </div>

          <p className="mx-auto max-w-4xl text-center text-xl leading-[1.85] text-[#fff8e8] sm:text-2xl">
            <span className="block">Every purchase helps spread a simple message.</span>
            <span className="block font-bold tracking-[0.02em] sm:whitespace-nowrap">One person. One piece. One better city.</span>
            <span className="block">Thank you for supporting Pick It Up Seattle.</span>
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

          {productCategories.map((category) => (
            <div key={category} id={category === 'Tools' ? 'tools' : category === 'Youth' ? 'kids' : undefined} className="mb-12 scroll-mt-24 last:mb-0">
              <h2 className={`${balooDisplay.className} mb-6 text-2xl font-extrabold text-[#002b49] sm:text-3xl`}>
                {category}
              </h2>

              {category === 'Tools' && (
                <div className="mb-6 rounded-2xl border border-[#0f9aa1]/20 bg-[#fffaf0] p-5 text-[#35566f]">
                  <p className="font-bold">Cleanup tools for adults and families, plus kids’ gloves selected by parents and caregivers.</p>
                  <p className="mt-2 text-sm leading-relaxed">Amazon affiliate links: As an Amazon Associate I earn from qualifying purchases. Prices, sizes, and availability are shown on Amazon. Purchases and delivery are handled by Amazon and its sellers.</p>
                  <p className="mt-2 text-sm leading-relaxed">Choose equipment that fits. Supervise young helpers and leave needles, broken glass, chemicals, and other hazardous litter to trained adults.</p>
                </div>
              )}
              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-4">
                {products
                  .filter((product) => product.category === category)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#0f9aa1]/20 bg-white shadow-[0_14px_30px_rgba(0,43,73,0.12)] transition hover:shadow-[0_18px_40px_rgba(0,43,73,0.16)]"
                    >
                      <div className={`${product.imageStyle ?? 'bg-[linear-gradient(145deg,_#0f9aa1_0%,_#2ec4c7_45%,_#69be28_100%)]'} relative flex h-56 items-center justify-center`}>
                        {product.productImageUrl ? (
                          <a href={product.productUrl} target="_blank" rel="sponsored noopener noreferrer" aria-label={`View ${product.name} on Amazon`} className="flex h-full w-full items-center justify-center bg-white p-4">
                            {/* Use the original remote product photo without cropping or caching it. */}
                            <img src={product.productImageUrl} alt={product.name} width={280} height={192} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="h-full w-full object-contain" />
                          </a>
                        ) : product.imageSrc ? (
                          <div className={`mx-4 flex items-center justify-center ${product.imageContainerClass ?? 'h-[88%] w-[88%] p-3'}`}>
                            <Image
                              src={product.imageSrc}
                              width={product.imageWidth}
                              height={product.imageHeight}
                              sizes={product.imageWidth < product.imageHeight ? "240px" : "(min-width: 1280px) 280px, 360px"}
                              loading="lazy"
                              decoding="async"
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
                            {product.affiliate ? 'Available on Amazon' : 'Official'}
                          </p>
                          <h2 className={`${balooDisplay.className} text-center text-[1.45rem] font-bold leading-tight text-[#002b49]`}>
                            {product.name}
                          </h2>
                          <p className="mt-3 text-[0.98rem] leading-7 text-[#516b7d] sm:text-[1.04rem] whitespace-pre-line">
                            {product.description}
                            {product.descriptionSpacer ? <><br /><br /></> : null}
                          </p>
                        </div>

                        <div className="mt-auto pt-2">
                          <a
                            href={product.productUrl}
                            rel={product.affiliate ? 'sponsored noopener noreferrer' : undefined}
                            target={product.affiliate ? '_blank' : undefined}
                            className="btn-primary w-full rounded-xl px-5 py-3 text-center text-sm font-extrabold sm:text-base"
                          >
                            {product.affiliate ? 'View on Amazon' : 'Shop Now'}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer prefetchLinks={false} />
    </>
  );
}
