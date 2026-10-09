'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const navy = '#002244';
const green = '#69be28';
const button = 'rounded-xl bg-[#69be28] px-6 py-3 font-bold text-[#002244] disabled:opacity-40';

export default function ChallengePreview() {
  const [joined, setJoined] = useState(false);
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [kind, setKind] = useState('Litter');
  const [files, setFiles] = useState({ before: null, after: null });
  const [urls, setUrls] = useState({});
  const [caption, setCaption] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [screening, setScreening] = useState('pass');
  useEffect(() => {
    const next = {};
    for (const side of ['before', 'after']) if (files[side]) next[side] = URL.createObjectURL(files[side]);
    setUrls(next);
    return () => Object.values(next).forEach(URL.revokeObjectURL);
  }, [files]);
  function choose(side, file) {
    setError('');
    if (file && (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024)) {
      setError('Choose a JPG, PNG, or WebP photo under 5 MB.'); return;
    }
    setFiles(current => ({ ...current, [side]: file || null }));
    setResult(null);
  }
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      const hash = async file => {
        const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
        return Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, '0')).join('');
      };
      const [before, after] = await Promise.all([hash(files.before), hash(files.after)]);
      if (before === after) { setError('These are the same photo. Choose a different after photo.'); return; }
      setResult({ status: screening, caption, kind, street, name });
    } catch { setError('Unable to read those photos. Please choose them again.'); }
    finally { setBusy(false); }
  }
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#e7f6f4_0%,#fff4ce_70%,#ffffff_100%)] px-4 py-10 text-[#002244]">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 rounded-xl border border-[#0f9aa1]/25 bg-white p-4 text-sm leading-6">
          <strong>Private pilot walkthrough</strong> · Try the steps before we connect the game.
          Photos stay in this browser tab. Email verification, AI screening, public publishing, and points are not active in this preview.
        </div>
        <header className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-[#0f9aa1]">One person. One piece. One better place.</p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Your street. Your difference.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-[#1f5f7a]">A little care adds up. Join as an individual, show your cleanup, and cheer each other on.</p>
        </header>
        <ol className="mb-8 grid grid-cols-3 gap-3 text-sm font-bold" aria-label="Challenge steps">
          {['Join', 'Show the difference', 'See your status'].map((step, index) => <li key={step} aria-current={index === (result ? 2 : joined ? 1 : 0) ? 'step' : undefined} className={`rounded-xl p-3 ${index <= (result ? 2 : joined ? 1 : 0) ? 'bg-[#002244] text-white' : 'bg-white text-[#1f5f7a]'}`}>{index + 1}. {step}</li>)}
        </ol>
        {!joined ? <form onSubmit={event => { event.preventDefault(); setJoined(true); }} className="rounded-2xl border-t-4 border-[#69be28] bg-white p-6 shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold">Join your Street Challenge</h2>
          <p className="mt-3 text-[#1f5f7a]">Use a display name you are happy to share. Your email will stay private.</p>
          <div className="my-6 grid gap-5 sm:grid-cols-2">
            <label className="font-semibold">Display name<input required maxLength={40} value={name} onChange={event => setName(event.target.value)} placeholder="Your Litter Hero name" className="mt-2 block w-full rounded-lg border border-[#1f5f7a]/40 p-3" /></label>
            <label className="font-semibold">Street or neighborhood<input required maxLength={80} value={street} onChange={event => setStreet(event.target.value)} placeholder="A public area, not your home address" className="mt-2 block w-full rounded-lg border border-[#1f5f7a]/40 p-3" /></label>
          </div>
          <p className="mb-5 rounded-lg bg-[#fff4ce] p-4 text-sm leading-6">Start small and stay safe. Wear gloves, avoid traffic and sharp objects, and get permission before removing weeds or graffiti.</p>
          <button className={button}>Try joining the challenge →</button>
        </form> : <section className="rounded-2xl border-t-4 border-[#69be28] bg-white p-6 shadow-lg sm:p-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3"><div><p className="font-bold text-[#0f9aa1]">Welcome, {name}!</p><h2 className="mt-2 text-2xl font-bold">{result ? 'Your cleanup status' : 'Show the difference'}</h2><p className="mt-2 text-[#1f5f7a]">{street} · Individual participant</p></div><button type="button" onClick={() => { setJoined(false); setResult(null); }} className="text-sm font-semibold underline">Edit entry</button></div>
          {!result ? <form onSubmit={submit}>
            <label className="block font-semibold">What did you improve?<select value={kind} onChange={event => setKind(event.target.value)} className="my-2 block w-full rounded-lg border p-3"><option>Litter</option><option>Weeds</option><option>Graffiti</option></select></label>
            <p className="mb-5 text-sm leading-6 text-[#1f5f7a]">Take the before photo first, then the after photo from a similar angle. Avoid faces, license plates, and private information.</p>
            <div className="grid gap-5 sm:grid-cols-2">{['before', 'after'].map(side => <label key={side} className="rounded-xl border-2 border-dashed border-[#0f9aa1]/40 bg-[#e7f6f4]/40 p-4 font-bold"><span className="capitalize">{side} photo</span>{urls[side] ? <img src={urls[side]} alt={`${side} cleanup preview`} className="my-3 h-48 w-full rounded-lg object-cover" /> : <div className="my-3 flex h-40 items-center justify-center rounded-lg bg-white text-sm font-normal text-[#1f5f7a]">{side === 'before' ? 'The place before you begin' : 'The difference you made'}</div>}<input required type="file" accept="image/jpeg,image/png,image/webp" onChange={event => choose(side, event.target.files?.[0])} className="block w-full text-sm font-normal" /></label>)}</div>
            <label className="my-5 block font-semibold">Tell us what changed<textarea value={caption} required maxLength={500} onChange={event => setCaption(event.target.value)} placeholder="A few words about your cleanup…" className="mt-2 block min-h-24 w-full rounded-lg border p-3" /></label>
            <fieldset className="mb-5 rounded-lg bg-[#fff4ce] p-4"><legend className="font-semibold">Preview a screening outcome</legend><p className="mb-2 text-sm">This choice demonstrates the next step; it does not analyze your photos.</p><label className="mr-5 inline-flex gap-2"><input type="radio" name="screening" checked={screening === 'pass'} onChange={() => setScreening('pass')} />Pass</label><label className="inline-flex gap-2"><input type="radio" name="screening" checked={screening === 'flag'} onChange={() => setScreening('flag')} />Flag for review</label></fieldset>
            {error && <p role="alert" className="mb-4 font-semibold text-red-700">{error}</p>}
            <button disabled={busy || !files.before || !files.after} className={button}>{busy ? 'Checking photo files…' : 'Preview submission →'}</button>
          </form> : <div aria-live="polite">
            <div className={`rounded-xl p-5 ${result.status === 'pass' ? 'bg-[#e7f6f4]' : 'bg-[#fff4ce]'}`}><p className="text-xl font-bold">{result.status === 'pass' ? 'Passed screening — ready to share' : 'Flagged — awaiting review'}</p><p className="mt-2 leading-6">{result.status === 'pass' ? 'In the connected game, this pair will appear in the community gallery automatically. Eligible points follow the game checks.' : 'In the connected game, only flagged photos enter the admin queue. This pair stays private and earns no points until approved.'}</p><p className="mt-3 text-sm font-semibold">Preview only · Nothing has been uploaded or published.</p></div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">{['before', 'after'].map(side => <figure key={side}><img src={urls[side]} alt={`${side} cleanup`} className="h-52 w-full rounded-xl object-cover" /><figcaption className="mt-2 font-bold capitalize">{side}</figcaption></figure>)}</div>
            <p className="mt-4 font-semibold">{result.name} · {result.kind} · {result.street}</p><p className="mt-2 text-[#1f5f7a]">{result.caption}</p>
            <p className="mt-6 text-lg font-bold text-[#0f9aa1]">What you did matters more than winning.</p>
            <button className={`${button} mt-5`} onClick={() => { setResult(null); setFiles({before:null,after:null}); setCaption(''); }}>Try another cleanup</button>
          </div>}
        </section>}
        <footer className="mt-8 text-sm text-[#1f5f7a]"><Link href="/street-challenge" className="underline">Back to Street Challenge</Link></footer>
      </div>
    </main>
  );
}
