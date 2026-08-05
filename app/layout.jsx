import './globals.css';
import { Baloo_2 } from 'next/font/google';

const balooDisplay = Baloo_2({
  subsets: ['latin'],
  variable: '--font-baloo-2',
});

export const metadata = {
  title: 'Pick It Up Seattle - Community Cleanup Movement',
  description:
    'A community movement making it easy and fun to leave Seattle better than we found it.',
  keywords:
    'Seattle, cleanup, community, environmental, volunteer, sustainable',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={balooDisplay.variable}>
      <body className="bg-[#f4efda] text-[#002b49]">
        <div className="page-shell">
          {children}
        </div>
      </body>
    </html>
  );
}
