import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useSound } from '@/hooks/useSound';
import { FaUpload, FaTimes, FaTrophy } from 'react-icons/fa';

export const Mission3_SpaceMission = ({ onComplete }) => {
  const { user } = useAuth();
  const [phase,     setPhase]    = useState('instructions'); 
  const [preview,   setPreview]  = useState(null);
  const [uploading, setUploading]= useState(false);
  const [learning,  setLearning] = useState('');
  const fileRef = useRef(null);
  const { playClick, playSuccess, playUnlock } = useSound();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    playUnlock();
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Please login to upload your creation!");
      return;
    }

    setUploading(true);
    let publicUrl = null;

    try {
      const file = fileRef.current?.files?.[0];
      if (!file) throw new Error("No file selected");

      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `halloffame_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('mission_uploads')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('mission_uploads')
        .getPublicUrl(filePath);

      publicUrl = data.publicUrl;
      
      // Pass the learning text as well
      onComplete({ image_url: publicUrl, learning: learning });
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Have you created the 'mission_uploads' bucket in Supabase? Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8 overflow-hidden touch-none selection:bg-transparent"
         style={{ background: 'radial-gradient(100% 100% at 50% 0%, rgba(139,92,246,0.15) 0%, #050814 100%)' }}>
      
      <div className="w-full max-w-xl flex items-center justify-between mb-8 px-2">
        <div className="flex flex-col">
          <span className="text-secondary-text text-[10px] font-black uppercase tracking-widest pl-1">Final Mission</span>
          <div className="w-32 h-2.5 rounded-full bg-white/10 mt-1 overflow-hidden">
            <div className="h-full bg-violet-500 transition-all duration-500" style={{ width: phase === 'upload' ? '100%' : '50%' }} />
          </div>
        </div>
        <button onClick={() => window.location.reload()} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">✕</button>
      </div>

      {phase === 'instructions' ? (
        <div className="w-full max-w-xl animate-in zoom-in-95 duration-400">
          <div className="text-center mb-10 text-[120px] leading-none drop-shadow-2xl animate-pulse">🚀</div>
          
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-8 mb-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px]" />
            <h2 className="font-heading text-4xl sm:text-5xl font-black text-white mb-8 tracking-tight relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-600">Space Mission</h2>
            
            <div className="space-y-4 relative z-10">
              {[
                { emoji: '🌟', title: '1. Your best work', desc: 'Draw your absolute favorite thing from this week.' },
                { emoji: '✍️', title: '2. Tell us', desc: 'Write down what you loved learning.' },
                { emoji: '🏆', title: '3. Claim victory', desc: 'Upload to finish your 5-day journey!' }
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-5 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-yellow-500/30 transition-colors">
                  <div className="text-4xl w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center shrink-0">{step.emoji}</div>
                  <div>
                    <h3 className="font-heading font-black text-xl text-violet-400 tracking-wide">{step.title}</h3>
                    <p className="text-secondary-text font-ui">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => { playClick(); setPhase('upload'); }}
            className="w-full py-6 rounded-full font-heading font-black text-white text-2xl tracking-widest uppercase transition-all hover:scale-[1.02] shadow-[0_15px_30px_rgba(251,191,36,0.3)] relative overflow-hidden group border border-white/20"
            style={{ background: 'linear-gradient(135deg, #fbbf24, #a855f7)' }}
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            <span className="relative z-10 text-shadow-sm flex items-center justify-center gap-2">I'M READY FOR SPACE! 🚀</span>
          </button>
        </div>
      ) : (
        <div className="w-full max-w-xl animate-in slide-in-from-right-8 duration-400 flex flex-col items-center">
          
          <div className="text-center mb-6">
            <h2 className="font-heading text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight">Space Discovery</h2>
            <p className="text-secondary-text font-ui">Take a photo of your space find!</p>
          </div>

          <div 
            onClick={() => { if (!preview) { playClick(); fileRef.current?.click(); } }}
            className={`w-full max-w-sm bg-white p-4 pb-10 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-6 transition-all duration-300 ${!preview ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
          >
            <div className={`w-full aspect-square bg-[#ececec] overflow-hidden border border-black/10 relative flex flex-col items-center justify-center ${preview ? '' : 'group'}`}>
              
              {preview ? (
                <>
                  <img src={preview} alt="Masterpiece" className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent mix-blend-overlay pointer-events-none" />
                  <button
                    onClick={(e) => { e.stopPropagation(); playClick(); setPreview(null); }}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-20 border-2 border-white"
                  >
                    <FaTimes size={16} />
                  </button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 text-3xl mb-3 group-hover:scale-110 group-hover:bg-violet-500/20 transition-all border-2 border-violet-500/20 border-dashed">
                    <FaUpload />
                  </div>
                  <p className="font-heading font-black text-lg text-gray-400 uppercase tracking-widest">Tap to Photo</p>
                </>
              )}
            </div>
            
            <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
              <p className="font-marker text-xl text-violet-500 opacity-80 transform -rotate-1">My Space Find!</p>
            </div>
          </div>
          
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          <div className="w-full mb-6">
            <p className="text-white/50 font-ui text-sm mb-2 text-center">What did you find? (optional)</p>
            <textarea
              value={learning}
              onChange={(e) => setLearning(e.target.value)}
              placeholder="A round ball like the moon, something shiny like a star..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 resize-none h-24"
            />
          </div>


          <button
            onClick={() => { playSuccess(); handleSubmit(); }}
            disabled={!preview || uploading}
            className="w-full py-5 rounded-full font-heading font-black text-white text-2xl tracking-widest uppercase transition-all duration-300 disabled:opacity-30 disabled:scale-100 hover:scale-[1.02] shadow-[0_15px_30px_rgba(139,92,246,0.4)] relative border border-white/20 group overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-6 h-6 rounded-full border-[4px] border-white/30 border-t-white animate-spin" /> UPLOADING...
              </span>
            ) : (
              <>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex flex-col items-center justify-center gap-1">
                  <span>LAUNCH INTO SPACE! 🚀</span>
                </span>
              </>
            )}
          </button>
        </div>
      )}
      
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap'); .font-marker { font-family: 'Permanent Marker', cursive; }`}</style>
    </div>
  );
};
