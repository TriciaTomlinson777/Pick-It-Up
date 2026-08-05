import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-seattle-green to-green-700 text-white py-16">
        <div className="container-custom">
          <h1 className="heading-xl mb-4 text-[#1f5f7a]">About Pick It Up Seattle</h1>
          <p className="max-w-3xl text-[1.12rem] font-bold text-[#fffaf0] [text-shadow:0_2px_8px_rgba(0,34,68,0.34)] sm:text-[1.32rem] lg:text-[1.42rem]">
            Imagine a cleaner, more welcoming city built by ordinary people choosing one simple act of kindness.
          </p>
        </div>
      </section>

      {/* About Letter */}
      <section className="py-12 sm:py-16">
        <div className="container-custom">
          <div className="max-w-[820px] mx-auto">
            <div className="max-w-none space-y-5 text-left text-[1.1rem] font-medium leading-[1.66] text-slate-800 sm:text-[1.18rem] lg:text-[1.28rem]">
              <p>
                Imagine walking through your neighborhood, your city, a local park, or along
                Seattle&apos;s beautiful waterfront and seeing a cleaner, more welcoming city because
                thousands of ordinary people decided to do one simple thing...
              </p>
              <p className="text-center text-[#ef7f2d] text-[1.72rem] font-extrabold sm:text-[1.92rem]">
                Pick up one piece of litter.
              </p>
              <p className="text-center text-[1.16rem] font-bold text-[#0f9aa1] sm:text-[1.24rem]">Simple. Powerful. Contagious.</p>
              <p>
                That&apos;s how Pick It Up Seattle was born.
              </p>
              <p>
                We believe creating a cleaner city doesn&apos;t require waiting for someone else.
                It starts with everyday people making small choices that add up to extraordinary
                results.
              </p>
              <p className="text-center text-[#69be28] text-[1.72rem] font-extrabold sm:text-[1.92rem]">
                One Person. One Piece. One Cleaner City.
              </p>
              <p>
                Our mission is simple: <span className="font-semibold">To inspire people to leave every place a little better than they found it.</span>
              </p>
              <p>
                Whether you spend five minutes picking up litter during your morning walk or join
                a community cleanup with dozens of volunteers, every act of kindness matters.
                Together, those moments create cleaner, more vibrant cities, safer parks,
                healthier waterways, stronger neighborhoods, and a greater sense of community
                pride.
              </p>
              <div className="space-y-2">
                <p className="text-[1.16rem] font-extrabold text-[#f4c94c] sm:text-[1.24rem]">
                  But Pick It Up Seattle is about much more than litter.
                </p>
                <p>
                  It&apos;s about neighbors meeting neighbors.
                </p>
                <p>
                  It&apos;s about teaching children that caring for their community is something to be
                  proud of.
                </p>
                <p>
                  It&apos;s about businesses investing in the places they serve.
                </p>
                <p>
                  It&apos;s about discovering that one small act of kindness inspires another.
                </p>
                <p>
                  It&apos;s about proving that ordinary people can accomplish extraordinary things when
                  they work together.
                </p>
              </div>
              <p className="text-[1.16rem] font-extrabold text-[#ef7f2d] sm:text-[1.24rem]">
                This movement belongs to everyone.
              </p>
              <p>
                Whether you&apos;re eight or eighty, whether you clean up every day or once a year,
                whether you volunteer alone, with friends, your family, coworkers, your school, or
                your business, you are helping build something much bigger than a cleaner city.
              </p>
              <p className="text-[1.16rem] font-extrabold text-[#0f9aa1] sm:text-[1.24rem]">
                You&apos;re helping build a culture where people care.
              </p>
              <p>
                Every cleanup logged, every photo shared, every event organized, every volunteer
                welcomed, and every new community partnership reminds others that positive change
                is contagious.
              </p>
              <p>
                Every person who joins proves that one small act really can inspire another.
              </p>
              <h2 className="heading-lg mt-10 mb-2 text-center text-[#1f5f7a] sm:text-[2.9rem]">Seattle Is Just the Beginning</h2>
              <p>
                Seattle is where this movement begins&mdash;but we hope it doesn&apos;t end here.
              </p>
              <p>
                Our vision is to inspire communities across the country to create their own Pick It
                Up movements, bringing neighbors together to care for the places they call home.
              </p>
              <p>Imagine <span className="text-[#ef7f2d]">Phoenix.</span></p>
              <p>Imagine <span className="text-[#0f9aa1]">Los Angeles.</span></p>
              <p>Imagine <span className="text-[#69be28]">Chicago.</span></p>
              <p>Imagine <span className="text-[#f4c94c]">New York.</span></p>
              <p>Imagine thousands of communities connected by one simple idea.</p>
              <p className="text-center text-[#f4c94c] text-[1.72rem] font-extrabold sm:text-[1.92rem]">
                One Person. One Piece. One Cleaner Community.
              </p>
              <p>
                Because when enough people decide to care, there&apos;s no limit to what we can
                accomplish together.
              </p>
              <p>
                We believe that one day, picking up litter won&apos;t be seen as someone else&apos;s
                responsibility&mdash;it will simply be something neighbors do because they care.
              </p>
              <p>
                Imagine children growing up believing that caring for their city is simply part of
                being a good neighbor.
              </p>
              <p>
                Imagine businesses, schools, churches, nonprofits, and community groups all working
                together to leave their communities better than they found them.
              </p>
              <p>
                Imagine millions of people proving that real change doesn&apos;t begin with
                governments or organizations.
              </p>
              <p>It begins with one person making one simple choice.</p>
              <p>When that happens, we&apos;ll know this movement has succeeded.</p>
              <div className="mx-auto mt-2 inline-flex w-fit flex-col items-start text-left gap-1">
                <p className="m-0 text-[#69be28] text-[1.72rem] font-extrabold sm:text-[1.92rem]">The next piece is yours...</p>
                <p className="m-0">Welcome to Pick It Up Seattle.</p>
                <p className="m-0">Welcome to the movement.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
