'use client';

import { useEffect, useRef, useState } from 'react';
import { createParticipantBrowserClient } from '@/lib/supabase/participant-browser';

const PRESET_AVATARS = [
  { id: 'maya', label: 'Maya', background: '#f4c94c', skin: '#9a5b3b', hair: '#002244', hairStyle: 'curly', shirt: '#0f9aa1', glasses: true },
  { id: 'jordan', label: 'Jordan', background: '#bdeff0', skin: '#d9956c', hair: '#6b3d2e', hairStyle: 'short', shirt: '#69be28', glasses: false },
  { id: 'riley', label: 'Riley', background: '#ffd0b4', skin: '#f1bd91', hair: '#ef7f2d', hairStyle: 'bob', shirt: '#002244', glasses: true },
  { id: 'sam', label: 'Sam', background: '#b9e6a0', skin: '#6e3f2c', hair: '#1a1715', hairStyle: 'locs', shirt: '#f4c94c', glasses: false },
  { id: 'alex', label: 'Alex', background: '#dff3f1', skin: '#bd7650', hair: '#002244', hairStyle: 'wave', shirt: '#ef7f2d', glasses: false },
  { id: 'taylor', label: 'Taylor', background: '#f4c94c', skin: '#f0c29b', hair: '#7b4b2a', hairStyle: 'ponytail', shirt: '#69be28', glasses: true },
  { id: 'casey', label: 'Casey', background: '#bdeff0', skin: '#8a5037', hair: '#2b1b16', hairStyle: 'buzz', shirt: '#0f9aa1', glasses: false },
  { id: 'devon', label: 'Devon', background: '#ffd0b4', skin: '#d18b62', hair: '#4c2a20', hairStyle: 'curly', shirt: '#002244', glasses: false },
];

function AvatarMark({ avatar, size = 'large' }) {
  const preset = PRESET_AVATARS.find((item) => item.id === avatar?.preset);
  const className = size === 'small' ? 'h-14 w-14' : 'h-28 w-28';

  if (avatar?.kind === 'upload' && (avatar.url || avatar.previewUrl)) {
    return <img src={avatar.url || avatar.previewUrl} alt="Uploaded profile picture" className={`${className} rounded-full object-cover`} />;
  }

  const isSmall = size === 'small';
  return (
    <div
      className={`${className} overflow-hidden rounded-full border-4 border-white shadow-[0_5px_0_rgba(0,34,68,0.12)]`}
      style={{ backgroundColor: preset?.background || '#dff3f1' }}
      aria-label={preset ? `${preset.label} Litter Hero avatar` : 'Default Pick It Up Seattle avatar'}
    >
      <svg viewBox="0 0 100 100" role="img" aria-hidden="true" className="h-full w-full">
        <path d="M18 100c2-22 16-31 32-31s30 9 32 31" fill={preset?.shirt || '#0f9aa1'} />
        <path d="M34 60c1-8 31-8 32 0v13c-8 7-24 7-32 0z" fill={preset?.skin || '#9a5b3b'} />
        <ellipse cx="50" cy="44" rx="25" ry="27" fill={preset?.skin || '#9a5b3b'} />
        {preset?.hairStyle === 'curly' ? <path d="M25 42c-7-23 14-35 29-27 17-7 27 13 20 29l-9-10c-7 6-22 7-34 1z" fill={preset.hair} /> : null}
        {preset?.hairStyle === 'short' ? <path d="M25 42c-2-22 12-31 27-29 14 1 22 12 20 29l-8-9c-10 4-25 3-39 9z" fill={preset.hair} /> : null}
        {preset?.hairStyle === 'bob' ? <path d="M24 51c-9-28 5-40 27-39 22 1 29 17 22 41l-9-8c-12 6-25 5-40 6z" fill={preset.hair} /> : null}
        {preset?.hairStyle === 'locs' ? <path d="M23 49c-5-22 10-37 28-37 20 0 29 18 23 38l-8-8-4-16c-10 7-21 8-32 4z" fill={preset.hair} /> : null}
        {preset?.hairStyle === 'wave' ? <path d="M25 44c-5-19 10-32 27-31 18 0 27 13 22 30l-9-9c-9 5-24 5-40 10z" fill={preset.hair} /> : null}
        {preset?.hairStyle === 'ponytail' ? <path d="M27 47c-6-21 8-35 25-35 19 0 28 15 22 34l-8-9c-11 5-24 5-39 10z" fill={preset.hair} /> : null}
        {preset?.hairStyle === 'buzz' ? <path d="M27 42c-1-17 10-27 24-27 15 0 23 10 22 27l-8-8c-10 4-23 4-38 8z" fill={preset.hair} /> : null}
        <circle cx="40" cy="45" r="3" fill="#002244" />
        <circle cx="60" cy="45" r="3" fill="#002244" />
        <path d="M43 56c5 4 9 4 14 0" fill="none" stroke="#002244" strokeLinecap="round" strokeWidth="2.5" />
        {preset?.glasses ? <path d="M32 44h15m6 0h15M47 44h6" fill="none" stroke="#002244" strokeWidth="2" /> : null}
        <path d="M42 76h16l-8 9z" fill="#f4c94c" />
        <path d="M40 84l10-7 10 7" fill="none" stroke="#fffaf0" strokeWidth="2" />
        {isSmall ? null : <circle cx="86" cy="17" r="7" fill="#f59a2d" />}
      </svg>
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
                <button key={preset.id} type="button" disabled={isSavingAvatar} onClick={() => saveAvatar({ kind: 'preset', preset: preset.id })} className="flex flex-col items-center gap-2 rounded-lg border border-[#002244]/15 p-2 text-xs font-semibold text-[#002244] hover:border-[#0f9aa1] disabled:opacity-60">
                  <AvatarMark avatar={{ kind: 'preset', preset: preset.id }} size="small" />
                  {preset.label}
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