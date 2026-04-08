import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useSound } from '@/hooks/useSound';
import { FaUpload, FaTimes } from 'react-icons/fa';

export const Mission3_EmojiChallenge = ({ onComplete, onBack }) => {
  const { user } = useAuth();
  const [phase,     setPhase]    = useState('instructions');
  const [funniness, setFunniness]= useState(null);
  const [preview,   setPreview]  = useState(null);
  const [uploading, setUploading]= useState(false);
  const fileRef = useRef(null);
  const { playClick, playSuccess, playUnlock } = useSound();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    playUnlock();
  };

  const handleSubmit = async () => {
    if (!user) { alert('Please login to upload!'); return; }
    setUploading(true);
    try {
      const file = fileRef.current?.files?.[0];
      if (!file) throw new Error('No file selected');
      const ext  = file.name.split('.').pop() || 'png';
      const path = `${user.id}/emoji_${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('mission_uploads').upload(path, file, { cacheControl: '3600', upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from('mission_uploads').getPublicUrl(path);
      onComplete({ image_url: data.publicUrl, funniness });
    } catch (err) {
      console.error(err);
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const FUNNINESS = [
    { label: 'Super Funny 🤣',   value: 'super' },
    { label: 'A Little Funny 😄', value: 'little' },
    { label: 'Very Crazy 🤪',    value: 'crazy' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden touch-none selection:bg-transparent"
         style={{ background: 'radial-gradient(100% 100% at 50% 0%, rgba(59,130,246,0.15) 0%, #050814 100%)' }}>

      {/* Header */}
      <div className="w-full max-w-xl flex items-center justify-between mb-8 px-2">
        <div className="flex flex-col">
          <span className="text-secondary-text text-[10px] font-black uppercase tracking-widest pl-1">Creator Mission</span>
          <div className="w-32 h-2.5 rounded-full bg-white/10 mt-1 overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: phase === 'upload' ? '100%' : phase === 'rating' ? '65%' : '20%' }} />
          </div>
        </div>
        <button onClick={() => { if (onBack) onBack(); }} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">✕</button>
      </div>

      {/* Phase: Instructions */}
      {phase === 'instructions' && (
        <div className="w-full max-w-xl animate-in zoom-in-95 duration-400 text-center">
          <div className="text-[120px] leading-none mb-6 drop-shadow-2xl animate-bounce">😆</div>
          <h2 className="font-heading text-5xl font-black text-white mb-4 uppercase tracking-widest">Emoji Drawing</h2>
          <p className="text-secondary-text text-xl font-ui mb-10">Draw a funny emoji face on paper — as silly as you can make it!</p>
          <div className="space-y-3 text-left mb-10">
            {[
              { emoji: '✏️', step: '1. Get paper & pencil' },
              { emoji: '😆', step: '2. Draw the funniest emoji face you can!' },
              { emoji: '📸', step: '3. Take a photo and share it!' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-3xl">{s.emoji}</span>
                <span className="text-white font-ui font-bold text-lg">{s.step}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => { playClick(); setPhase('rating'); }}
            className="w-full py-6 rounded-full font-heading font-black text-white text-2xl tracking-widest uppercase hover:scale-[1.02] transition-all border border-white/20"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 15px 30px rgba(59,130,246,0.3)' }}
          >
            MY DRAWING IS READY! 🎨
          </button>
        </div>
      )}

      {/* Phase: Rating */}
      {phase === 'rating' && (
        <div className="w-full max-w-xl animate-in slide-in-from-right-8 duration-400 text-center">
          <div className="text-[100px] leading-none mb-6">😆</div>
          <h2 className="font-heading text-4xl font-black text-white mb-3 uppercase">How funny was it?</h2>
          <p className="text-secondary-text mb-8 font-ui">Pick how your emoji turned out!</p>
          <div className="space-y-4 mb-10">
            {FUNNINESS.map(f => (
              <button
                key={f.value}
                onClick={() => { playClick(); setFunniness(f.value); }}
                className={`w-full py-5 rounded-2xl font-heading font-black text-xl border-2 transition-all ${funniness === f.value ? 'scale-105 border-blue-400 text-white' : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white'}`}
                style={{ background: funniness === f.value ? 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))' : 'rgba(255,255,255,0.03)' }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => { playClick(); setPhase('upload'); }}
            disabled={!funniness}
            className="w-full py-6 rounded-full font-heading font-black text-white text-2xl tracking-widest uppercase hover:scale-[1.02] transition-all disabled:opacity-30 border border-white/20"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 15px 30px rgba(59,130,246,0.3)' }}
          >
            NEXT — UPLOAD PHOTO 📸
          </button>
        </div>
      )}

      {/* Phase: Upload */}
      {phase === 'upload' && (
        <div className="w-full max-w-xl animate-in slide-in-from-right-8 duration-400">
          <div className="text-center mb-8">
            <h2 className="font-heading text-4xl font-black text-white mb-2">Upload Your Emoji</h2>
            <p className="text-secondary-text font-ui">Take a photo of your funny drawing!</p>
          </div>

          <div
            onClick={() => { if (!preview) { playClick(); fileRef.current?.click(); } }}
            className={`w-full bg-white p-4 pb-12 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform -rotate-1 mb-10 transition-all relative ${!preview ? 'cursor-pointer hover:rotate-0 hover:scale-[1.02]' : ''}`}
          >
            <div className="w-full aspect-video bg-[#ececec] overflow-hidden border border-black/10 relative flex flex-col items-center justify-center">
              {preview ? (
                <>
                  <img src={preview} alt="Your emoji drawing" className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500" />
                  <button
                    onClick={(e) => { e.stopPropagation(); playClick(); setPreview(null); }}
                    className="absolute top-4 right-4 w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 z-20 border-2 border-white"
                  >
                    <FaTimes size={20} />
                  </button>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-4xl mb-4 border-2 border-blue-500/20 border-dashed">
                    <FaUpload />
                  </div>
                  <p className="font-heading font-black text-xl text-gray-400 uppercase tracking-widest">Tap to Photo</p>
                </>
              )}
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
              <p className="font-marker text-2xl text-gray-600 opacity-60 transform rotate-1">My Funny Emoji!</p>
            </div>
          </div>

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          <button
            onClick={() => { playSuccess(); handleSubmit(); }}
            disabled={!preview || uploading}
            className="w-full py-6 rounded-full font-heading font-black text-white text-2xl tracking-widest uppercase hover:scale-[1.02] transition-all disabled:opacity-30 border border-white/20 relative group overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 15px 30px rgba(59,130,246,0.4)' }}
          >
            {uploading
              ? <span className="flex items-center justify-center gap-3"><span className="w-6 h-6 rounded-full border-[4px] border-white/30 border-t-white animate-spin" /> UPLOADING...</span>
              : <><div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" /><span className="relative z-10">SHARE MY EMOJI! 😆</span></>
            }
          </button>
        </div>
      )}

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap'); .font-marker { font-family: 'Permanent Marker', cursive; }`}</style>
    </div>
  );
};
