"use client";

import { useEffect, useState } from 'react';
import { Poppins } from 'next/font/google';
const poppinsHero = Poppins({ subsets: ['latin'], weight: ['400'] });
// One approved landscape photo per state for the Together landing page.
const IMAGINE_SLIDES = [
  { src: '/together/washington-sunset.jpg', state: 'Washington', objectPosition: '50% 48%' },
  { src: '/together/arizona-sunset.jpg', state: 'Arizona', objectPosition: '50% 50%' },
];
const IMAGINE_SLIDE_FADE_MS = 2500;

export default function TogetherImagine() {
  const [imagineSlideIndex, setImagineSlideIndex] = useState(0);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;
    const timer = window.setInterval(() => setImagineSlideIndex((index) => (index + 1) % IMAGINE_SLIDES.length), 6000);
    return () => window.clearInterval(timer);
  }, []);
  return <div className="relative">
        <section className="relative overflow-hidden border-b border-[#0f9aa1]/30 bg-[linear-gradient(135deg,_#fdf7e8_0%,_#d3f1f4_38%,_#d7f0c7_100%)] pb-0 pt-0 sm:pb-10 sm:pt-7">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-[radial-gradient(circle_at_15%_0%,rgba(183,225,237,0.34),transparent_42%),radial-gradient(circle_at_88%_0%,rgba(106,190,224,0.28),transparent_46%)] sm:h-28 sm:bg-[radial-gradient(circle_at_15%_0%,rgba(229,111,90,0.22),transparent_38%),radial-gradient(circle_at_88%_0%,rgba(15,154,161,0.2),transparent_42%)]" aria-hidden="true" />

          <div className="relative">
            <svg
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-9 w-full text-[#cdeaf2]/95 sm:h-20 sm:text-[#fdf7e8]/95"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M0,80L60,74.7C120,69,240,59,360,53.3C480,48,600,48,720,58.7C840,69,960,91,1080,96C1200,101,1320,91,1380,85.3L1440,80L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
              />
            </svg>

            <div className="relative h-[240px] w-full sm:min-h-[30rem] lg:min-h-[36rem]">
              <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
                {IMAGINE_SLIDES.map((slide, slideIndex) => {
                  const isActiveSlide = slideIndex === imagineSlideIndex;

                  return (
                    <div
                      key={`imagine-slide-${slideIndex}`}
                      className={`absolute inset-0 h-full w-full transition-opacity ease-in-out motion-reduce:transition-none ${isActiveSlide ? 'opacity-100' : 'opacity-0'}`}
                      style={{ transitionDuration: `${IMAGINE_SLIDE_FADE_MS}ms` }}
                    >
                      {slide?.src ? (
                        <img
                          src={slide.src}
                          alt=""
                          aria-hidden="true"
                          className="h-full w-full object-cover object-center"
                          style={{ objectPosition: slide.objectPosition }}
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
              <div
                className={`absolute inset-0 bg-[linear-gradient(180deg,rgba(255,252,245,0.12)_0%,rgba(255,252,245,0.08)_38%,rgba(255,252,245,0.12)_100%)] transition-opacity ease-in-out motion-reduce:transition-none ${imagineSlideIndex === 1 ? 'opacity-0' : 'opacity-100'}`}
                style={{ transitionDuration: `${IMAGINE_SLIDE_FADE_MS}ms` }}
                aria-hidden="true"
              />
              <div
                className={`absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(244,201,76,0.1),transparent_36%),radial-gradient(circle_at_80%_15%,rgba(46,196,199,0.12),transparent_40%)] transition-opacity ease-in-out motion-reduce:transition-none ${imagineSlideIndex === 1 ? 'opacity-0' : 'opacity-100'}`}
                style={{ transitionDuration: `${IMAGINE_SLIDE_FADE_MS}ms` }}
                aria-hidden="true"
              />

              <div className="absolute inset-0 z-20 flex items-center justify-center px-4 text-center sm:container-custom sm:relative sm:min-h-[30rem] sm:px-0 sm:py-16 lg:min-h-[36rem] lg:py-20">
                <div className="mx-auto max-w-4xl">
                  <h2 className={`${poppinsHero.className} mx-auto max-w-3xl text-left text-[2.6rem] font-normal tracking-[0.02em] text-[#fff9ea] [text-shadow:0_6px_20px_rgba(0,34,68,0.55)] sm:text-[4.1rem] lg:text-[5.3rem]`}>
                    Imagine...
                  </h2>
                  <p className="mx-auto mt-3 max-w-3xl text-left text-base leading-relaxed text-[#fff7ea] [text-shadow:0_4px_16px_rgba(0,34,68,0.5)] sm:mt-5 sm:text-2xl lg:text-[1.85rem]">
                    A world where every person leaves every place a little better than they found it.
                  </p>
                </div>
              </div>

              <svg
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 w-full text-[#d7eef5]/95 sm:hidden"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M0,80L60,74.7C120,69,240,59,360,53.3C480,48,600,48,720,58.7C840,69,960,91,1080,96C1200,101,1320,91,1380,85.3L1440,80L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
                />
              </svg>
            </div>
          </div>
        </section>

  </div>;
}
