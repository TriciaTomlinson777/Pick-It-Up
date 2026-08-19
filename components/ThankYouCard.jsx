export default function ThankYouCard({ note, photoUrl = '', className = '' }) {
  if (!note) {
    return null;
  }

  const getNoteTilt = () => {
    const safeNote = String(note || '');
    const checksum = Array.from(safeNote).reduce((total, character) => total + character.charCodeAt(0), 0);
    const tiltOptions = [-1.4, -0.9, 0.7, 1.2];
    return tiltOptions[checksum % tiltOptions.length];
  };

  const noteTilt = getNoteTilt();

  return (
    <article className={`mb-6 break-inside-avoid rounded-[1.4rem] border border-[#0f9aa1]/28 bg-white/90 p-5 shadow-[0_16px_34px_rgba(0,43,73,0.12)] ${className}`.trim()}>
      {photoUrl ? (
        <div className="overflow-hidden rounded-xl border border-[#002b49]/10 bg-[#f7fbfc] p-2">
          <img
            src={photoUrl}
            alt="Thank you submission photo"
            className="h-auto w-full rounded-lg object-contain"
          />
        </div>
      ) : null}

      <div className={`relative ${photoUrl ? '-mt-5 px-2' : 'mt-1 px-1'}`}>
        <div
          className="relative rounded-[1rem] border border-[#ccbc96]/70 px-4 pb-4 pt-5 text-left shadow-[0_8px_20px_rgba(61,46,22,0.16)]"
          style={{
            backgroundColor: '#fff8e9',
            backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.58), rgba(255,255,255,0.2)), repeating-linear-gradient(to bottom, rgba(158,126,76,0.14), rgba(158,126,76,0.14) 1px, transparent 1px, transparent 34px)',
            transform: `rotate(${noteTilt}deg)`,
            transformOrigin: 'top center',
          }}
        >
          <span
            aria-hidden="true"
            className="absolute -top-2.5 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border border-[#9a7e55]/55 bg-[radial-gradient(circle_at_30%_30%,_#fff2d0_0%,_#d6b07a_62%,_#b78755_100%)] shadow-[0_2px_5px_rgba(0,0,0,0.18)]"
          />

          <p
            className="whitespace-pre-wrap break-words text-[17px] leading-8 text-[#33455a]"
            style={{ fontFamily: '"Patrick Hand", "Segoe Print", "Bradley Hand", "Comic Sans MS", cursive' }}
          >
            {note}
          </p>
        </div>
      </div>

      {photoUrl ? (
        <p className="px-1 pt-3 text-center text-xs font-medium leading-4 text-[#1f5f7a] sm:text-sm">
          Tag us on Instagram: @PickItUpSeattle
        </p>
      ) : null}
    </article>
  );
}
