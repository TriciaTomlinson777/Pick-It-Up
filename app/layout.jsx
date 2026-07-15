import './globals.css';

export const metadata = {
  title: 'Pick It Up Seattle - Community Cleanup Movement',
  description:
    'A community movement making it easy and fun to leave Seattle better than we found it.',
  keywords:
    'Seattle, cleanup, community, environmental, volunteer, sustainable',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#fdf8eb] text-[#0f2b45]">
        <div className="page-shell">
          {children}
        </div>
      </body>
    </html>
  );
}
