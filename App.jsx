import React, { useState } from 'react';
import { Shield, Users, Trophy, MessageSquare, Key, Swords, Beer, Scroll } from 'lucide-react';

export default function App() {
  const [pseudo, setPseudo] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pseudo.trim()) {
      setStatus('recherche');
      setTimeout(() => {
        setStatus('valide');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 font-serif selection:bg-amber-700 selection:text-amber-100">
      {/* Hero Banner */}
      <div className="relative bg-black h-80 flex items-center justify-center border-b-4 border-amber-600 bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1597200381847-30ec200eeb9a?q=80&w=1200")' }}>
        <div className="text-center px-4">
          <div className="flex justify-center mb-3">
            <Beer className="w-16 h-16 text-amber-500 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-wider text-amber-500 drop-shadow-md uppercase">
            La Taverne d'Arcane Frontier
          </h1>
          <p className="mt-2 text-stone-400 text-lg md:text-xl max-w-xl mx-auto italic font-sans">
            Chopes de bière, ragoûts chauds et légendes de serveurs. Installe-toi, voyageur.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column - Registration */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-stone-800/80 border-2 border-stone-700 rounded-lg p-6 md:p-8 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-stone-700 pb-4">
              <Scroll className="w-8 h-8 text-amber-500" />
              <h2 className="text-2xl font-bold text-amber-500 uppercase tracking-wide">Le Registre des Aventuriers</h2>
            </div>
            
            <p className="text-stone-300 mb-6 font-sans leading-relaxed">
              Inscris ton pseudo Minecraft ci-dessous pour annoncer ton arrivée dans la taverne et débloquer tes accès au serveur Arcane Frontier.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <div>
                <label className="block text-sm font-semibold text-stone-400 mb-2 uppercase tracking-wider">
                  Pseudo Minecraft exact
                </label>
                <input
                  type="text"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  placeholder="Ex: Notch"
                  className="w-full bg-stone-950 border border-stone-700 rounded px-4 py-3 text-stone-100 focus:outline-none focus:border-amber-500 transition-colors placeholder-stone-600 text-lg"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status === 'recherche'}
                className="w-full bg-amber-600 hover:bg-amber-700 text-stone-950 font-bold uppercase py-3 rounded tracking-wider transition-colors shadow-lg shadow-amber-900/20 disabled:opacity-50 text-lg font-serif"
              >
                {status === 'recherche' ? 'Vérification dans le grimoire...' : 'S\'inscrire sur le registre'}
              </button>
            </form>

            {/* Status Feedback */}
            {status === 'valide' && (
              <div className="mt-6 bg-emerald-950/40 border border-emerald-500/30 rounded p-4 text-emerald-400 font-sans flex items-start gap-3 animate-fade-in">
                <Shield className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Bienvenue, {pseudo} !</strong>
                  Ton entrée a été gravée dans la pierre. Tu as désormais accès aux salons de la Taverne.
                </div>
              </div>
            )}
          </div>

          {/* Lore / Rules Section */}
          <div className="bg-stone-800/50 border border-stone-700/50 rounded-lg p-6 font-sans text-stone-400 text-sm space-y-3">
            <h3 className="font-serif text-stone-200 uppercase tracking-wider font-bold mb-2 flex items-center gap-2">
              <Swords className="w-4 h-4 text-amber-600" /> Les Lois de la Choppe
            </h3>
            <p>1. Laisse tes armes à l'entrée. Les bagarres se règlent dans l'arène, pas près du comptoir.</p>
            <p>2. Respecte le tavernier et les autres clients. Les insultes gâchent l'hydromel.</p>
          </div>
        </div>

        {/* Sidebar - Info widgets */}
        <div className="space-y-6">
          {/* Server Info */}
          <div className="bg-stone-800/80 border-2 border-stone-700 rounded-lg p-6 shadow-xl text-center">
            <h3 className="text-amber-500 font-bold uppercase tracking-wider mb-4 border-b border-stone-700 pb-2">
              Statut de la Taverne
            </h3>
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-sans font-bold text-lg mb-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></span>
              PORTES OUVERTES
            </div>
            <p className="text-xs text-stone-400 font-sans">IP: play.arcanefrontier.fr</p>
          </div>

          {/* Quick Stats */}
          <div className="bg-stone-800/80 border-2 border-stone-700 rounded-lg p-6 shadow-xl space-y-4">
            <h3 className="text-stone-300 font-bold uppercase tracking-wider border-b border-stone-700 pb-2 flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-amber-500" /> Comptoir des Légendes
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center font-sans">
              <div className="bg-stone-900/50 p-3 rounded border border-stone-700/30">
                <div className="text-2xl font-bold text-amber-500">142</div>
                <div className="text-xs text-stone-400 uppercase tracking-tight mt-1">Inscrits</div>
              </div>
              <div className="bg-stone-900/50 p-3 rounded border border-stone-700/30">
                <div className="text-2xl font-bold text-amber-500">12</div>
                <div className="text-xs text-stone-400 uppercase tracking-tight mt-1">En ligne</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
