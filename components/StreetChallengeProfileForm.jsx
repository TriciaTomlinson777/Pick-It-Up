'use client';

import { useEffect, useRef, useState } from 'react';
import { createParticipantBrowserClient } from '@/lib/supabase/participant-browser';

const PRESET_AVATARS = [
  { id: 'purple-lady', label: 'Purple Lady', src: '/Purple%20lady.png' },
  { id: 'blue-hat-boy', label: 'Blue Hat Boy', src: '/Blue%20Hat.png' },
  { id: 'blonde-girl', label: 'Blonde Girl', src: '/Blonde%20Girl.png' },
  { id: 'captain-can', label: 'Captain Can', src: '/Captain%20Can%20(1).png' },
  { id: 'mess-monster', label: 'Mess Monster', src: '/Mess%20Monster.png' },
  { id: 'blue-boy', label: 'Blue Boy', src: '/Blue%20Boy.png' },
  { id: 'dog', label: 'Dog', src: '/Dog.png' },
  { id: 'mia', label: 'Mia', src: '/Mia.png' },
];

function AvatarMark({ avatar, size = 'large' }) {
  const preset = PRESET_AVATARS.find((item) => item.id === avatar?.preset);
  const className = size === 'small' ? 'h-14 w-14' : 'h-28 w-28';

  if (avatar?.kind === 'upload' && (avatar.url || avatar.previewUrl)) {
    return <img src={avatar.url || avatar.previewUrl} alt="Uploaded profile picture" className={`${className} rounded-full object-cover`} />;
  }

  if (preset?.src) {
    return <img src={preset.src} alt={`${preset.label} avatar`} className={`${className} rounded-full object-contain`} />;
  }

  return (
    <div
      className={`${className} overflow-hidden rounded-full border-4 border-white shadow-[0_5px_0_rgba(0,34,68,0.12)]`}
      style={{ backgroundColor: preset?.background || '#dff3f1' }}
      aria-label={preset ? `${preset.label} Litter Hero avatar` : 'Default Pick It Up Seattle avatar'}
    >
      <img src="/pick-it-up-seattle-logo.png" alt="Default Pick It Up Seattle avatar" className="h-full w-full object-contain p-2" />
    </div>
  );
}

function CropEditor({ file, onCancel, onComplete }) {
  const [imageUrl, setImageUrl] = useState('');
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const imageRef = useRef(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function createCroppedImage() {
    const image = imageRef.current;
    if (!image) return;
    const canvas = document.createElement('canvas');
    const outputSize = 512;
    canvas.width = outputSize;
    canvas.height = outputSize;
    const context = canvas.getContext('2d');
    const sourceSize = Math.min(image.naturalWidth, image.naturalHeight) / zoom;
    const sourceX = (image.naturalWidth - sourceSize) * (position.x / 100);
    const sourceY = (image.naturalHeight - sourceSize) * (position.y / 100);
    context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, outputSize, outputSize);
    canvas.toBlob((blob) => {
      if (blob) onComplete(new File([blob], 'participant-avatar.jpg', { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.88);
  }

  return (
    <div className="space-y-4 border-t border-[#002244]/10 pt-5">
      <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-full border-8 border-white bg-[#dff3f1] shadow-[0_10px_24px_rgba(0,43,73,0.16)]">
        {imageUrl ? <img ref={imageRef} src={imageUrl} alt="Crop preview" className="h-full w-full object-cover" style={{ objectPosition: `${position.x}% ${position.y}%`, transform: `scale(${zoom})` }} /> : null}
      </div>
      <label className="block text-sm font-semibold text-[#002244]">
        Zoom
        <input className="mt-2 w-full accent-[#0f9aa1]" type="range" min="1" max="3" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
      </label>
      <label className="block text-sm font-semibold text-[#002244]">
        Horizontal position
        <input className="mt-2 w-full accent-[#0f9aa1]" type="range" min="0" max="100" value={position.x} onChange={(event) => setPosition({ ...position, x: Number(event.target.value) })} />
      </label>
      <label className="block text-sm font-semibold text-[#002244]">
        Vertical position
        <input className="mt-2 w-full accent-[#0f9aa1]" type="range" min="0" max="100" value={position.y} onChange={(event) => setPosition({ ...position, y: Number(event.target.value) })} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={onCancel} className="rounded-lg border border-[#002244]/20 px-4 py-3 font-semibold text-[#1f5f7a]">Cancel</button>
        <button type="button" onClick={createCroppedImage} className="rounded-lg bg-[#0f9aa1] px-4 py-3 font-semibold text-white">Use this picture</button>
      </div>
    </div>
  );
}

export default function StreetChallengeProfileForm({ userId, email, initialDisplayName, initialAvatar }) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [avatar, setAvatar] = useState(initialAvatar);
  const [cropFile, setCropFile] = useState(null);
  const [avatarMessage, setAvatarMessage] = useState('');
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function saveAvatar(nextAvatar, file = null) {
    setAvatarMessage('');
    setIsSavingAvatar(true);
    try {
      const formData = new FormData();
      formData.set('kind', nextAvatar.kind);
      if (nextAvatar.preset) formData.set('preset', nextAvatar.preset);
      if (file) formData.set('file', file);
      const response = await fetch('/api/street-challenge/profile/avatar', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save your profile picture.');
      setAvatar({
        ...nextAvatar,
        path: data.path || '',
        moderationStatus: data.moderationStatus || 'approved',
        previewUrl: file ? URL.createObjectURL(file) : '',
      });
      setCropFile(null);
      setAvatarMessage(data.moderationStatus === 'pending_review' ? 'Your picture is saved and will appear after a safety review.' : 'Profile picture saved.');
    } catch (error) {
      setAvatarMessage(error.message);
    } finally {
      setIsSavingAvatar(false);
    }
  }

  function chooseFile(event) {
    const file = event.target.files?.[0];
    if (file) setCropFile(file);
    event.target.value = '';
  }

  async function saveProfile(event) {
    event.preventDefault();
    const normalizedName = displayName.trim();
    if (!normalizedName || normalizedName.length > 80) {
      setMessage('Enter a display name of 80 characters or fewer.');
      return;
    }

    setMessage('');
    setIsSaving(true);
    const supabase = createParticipantBrowserClient();
    const { error } = await supabase
      .from('participant_profiles')
      .update({ display_name: normalizedName })
      .eq('id', userId);

    setIsSaving(false);
    setMessage(error ? 'Unable to save your display name.' : 'Display name saved.');
  }

  async function signOut() {
    const supabase = createParticipantBrowserClient();
    await supabase.auth.signOut();
    window.location.assign('/street-challenge');
  }

  return (
    <div className="mt-7 space-y-6">
      <div className="border-l-4 border-[#0f9aa1] bg-[#eef9fc] px-4 py-3">
        <p className="text-xs font-bold uppercase text-[#1f5f7a]">Signed in as</p>
        <p className="mt-1 break-all text-sm font-semibold text-[#002244]">{email}</p>
      </div>

      <form className="space-y-4" onSubmit={saveProfile}>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-[#002244]">Display name</span>
          <input
            name="displayName"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            required
            maxLength={80}
            autoComplete="nickname"
            className="w-full rounded-lg border border-[#002244]/20 bg-white px-4 py-3 text-[#002244] outline-none focus:border-[#0f9aa1] focus:ring-2 focus:ring-[#0f9aa1]/20"
          />
        </label>

        {message ? <p className="text-sm font-semibold text-[#1f5f7a]">{message}</p> : null}

        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-lg bg-[#69be28] px-5 py-3 font-semibold text-[#002244] hover:bg-[#79ca38] disabled:opacity-65"
        >
          {isSaving ? 'Saving...' : 'Save display name'}
        </button>
      </form>

      <section className="space-y-4 border-t border-[#002244]/10 pt-6" aria-labelledby="avatar-heading">
        <div>
          <h2 id="avatar-heading" className="text-xl font-bold text-[#002244]">Your profile picture</h2>
          <p className="mt-2 text-sm leading-6 text-[#1f5f7a]">Your avatar may appear publicly in Street Challenge rankings and activity.</p>
        </div>
        <div className="flex items-center gap-4">
          <AvatarMark avatar={avatar} />
          <p className="text-sm font-semibold text-[#1f5f7a]">Pick a cheerful avatar, or add a picture that feels like you.</p>
        </div>
        {cropFile ? <CropEditor file={cropFile} onCancel={() => setCropFile(null)} onComplete={(file) => saveAvatar({ kind: 'upload', preset: '' }, file)} /> : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PRESET_AVATARS.map((preset) => (
                <button key={preset.id} type="button" aria-label={`Choose ${preset.label} avatar`} disabled={isSavingAvatar} onClick={() => saveAvatar({ kind: 'preset', preset: preset.id })} className="flex aspect-square items-center justify-center rounded-lg border border-[#002244]/15 bg-white p-1.5 hover:border-[#0f9aa1] disabled:opacity-60">
                  <AvatarMark avatar={{ kind: 'preset', preset: preset.id }} size="small" />
                </button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="cursor-pointer rounded-lg bg-[#f59a2d] px-4 py-3 text-center font-semibold text-white hover:bg-[#ea8718]">
                Take a new picture
                <input className="sr-only" type="file" accept="image/*" capture="user" onChange={chooseFile} />
              </label>
              <label className="cursor-pointer rounded-lg border-2 border-[#0f9aa1] px-4 py-3 text-center font-semibold text-[#0f7f85] hover:bg-[#eef9fc]">
                Upload a picture
                <input className="sr-only" type="file" accept="image/*" onChange={chooseFile} />
              </label>
            </div>
            <button type="button" disabled={isSavingAvatar} onClick={() => saveAvatar({ kind: 'default', preset: '' })} className="w-full text-sm font-semibold text-[#1f5f7a] underline underline-offset-4">Skip for now</button>
          </div>
        )}
        {isSavingAvatar ? <p className="text-sm font-semibold text-[#1f5f7a]">Saving profile picture...</p> : null}
        {avatarMessage ? <p className="text-sm font-semibold text-[#1f5f7a]">{avatarMessage}</p> : null}
      </section>

      <button
        type="button"
        onClick={signOut}
        className="w-full border-t border-[#002244]/12 pt-5 text-sm font-semibold text-[#1f5f7a] hover:text-[#002244]"
      >
        Sign out
      </button>
    </div>
  );
}