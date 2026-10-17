import { redirect } from 'next/navigation';

export default function CaptainCanReaderRedirect() {
  redirect('/kids-corner/read?book=captain-can');
}
