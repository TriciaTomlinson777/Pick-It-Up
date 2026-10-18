import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Street Challenge Test | Pick It Up Together',
  robots: { index: false, follow: false },
};

export default function StreetChallengeTestPage() {
  redirect('/street-challenge-preview/index.html');
}
