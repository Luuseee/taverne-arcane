import React, { useState } from 'react';
import { Shield, Users, Trophy, MessageSquare, Key, Swords, Beer, Scroll, Plus, RotateCw, Check, Minus } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('projets');
  const [userPseudo, setUserPseudo] = useState('aky');
  
  // État pour les ressources de la Machine à XP
  const [resources, setResources] = useState([
    { id: 'fer', name: 'Fer', current: 0, max: 45, by: 'aky' },
    { id: 'cuivre', name: 'Cuivre', current: 0, max: 18, by: '' },
    { id: 'zinc', name: 'Zinc', current: 0, max: 18, by: '' },
    { id: 'or', name: 'Or', current: 0, max: 3, by: '' },
    { id: 'andesite', name: 'Andésite', current: 0, max: 40, by: '' },
    { id: 'quartz', name: 'Quartz', current: 0, max: 6, by: '' },
    { id: 'redstone', name: 'Redstone', current: 0, max: 50, by: '' },
    { id: 'bois', name: 'Bois (bûches)', current: 0, max: 40, by: '' },
    { id: 'varech', name: 'Varech séché', current: 0, max: 4, by: '' },
    { id: 'verre', name: 'Verre', current: 0, max: 1, by: '' },
  ]);

  const handleIncrement = (id) => {
    setResources(resources.map(res => {
      if (res.id === id && res.current < res.max) {
        return { ...res, current: res.current + 1, by: userPseudo };
      }
      return res;
    }));
  };

  const handleDecrement = (id) => {
    setResources(resources.map(res => {
      if (res.id === id && res.current > 0) {
        return { ...res, current: res.current - 1 };
      }
      return res;
    }));
  };

  const handleComplete = (id) => {
    setResources(resources.map(res => {
      if (res.id === id) {
        return { ...res, current: res.max, by: userPseudo };
      }
      return res;
    }));
  };

  // Calcul de la progression globale
  const totalCurrent = resources.reduce((acc, res) => acc + res.current, 0);
  const totalMax = resources.reduce((acc, res) => acc + res.max, 0);
  const globalProgress = Math.round((totalCurrent / totalMax) * 100);

  return (
    <div className="min-h-screen bg-[#0b0f14] text-[#94a3b8] font-sans antialiased selection:bg-amber-700 selection:text-amber-100">
      
      {/* Top Navigation / Header */}
      <header className="border-b border-stone-800 bg-[#0f141c] sticky top-0 z-50 px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 p-2 rounded border border-amber-500/20">
              <Beer className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-stone-100 uppercase font-serif">
                La Taverne d'Arcane Fron
              </h1>
              <p className="text-xs uppercase tracking-widest text-stone-500 font-semibold flex items-center gap-1">
                Project <span className="text-stone-400">•</span> Arcane Frontier
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-stone-800/40 border border-stone-700/60 rounded px-3 py-1.5 text-xs text-stone-400 font-semibold hover:bg-stone-800 transition">
              <Shield className="w-3.5 h-3.5 text-amber-500/80" /> 1
            </button>
            <button className="flex items-center gap-1.5 bg-stone-800/40 border border-stone-700/60 rounded px-3 py-1.5 text-xs text-stone-400 font-semibold hover:bg-stone-800 transition">
              <RotateCw className="w-3.5 h-3.5" /> Sync
            </button>
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded px-3 py-1.5 text-xs text-amber-400 font-bold">
              <Swords className="w-3.5 h-3.5" /> {userPseudo}
            </div>
          </div>
        </div>
      </header>

      {/* Tabs Menu */}
      <div className="bg-[#0f141c] border-b border-stone-800/60 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex gap-1">
          {[
            { id: 'projets', label: 'Projets', icon: Swords },
            { id: 'trouvailles', label: 'Trouvailles', icon: Scroll },
            { id: 'raids', label: 'Raids', icon: Shield },
            { id: 'guide', label: 'Guide', icon: Trophy },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium tracking-wide uppercase transition relative ${
                  isActive ? 'text-amber-500 font-bold' : 'text-stone-500 hover:text-stone-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {activeTab === 'projets' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-100 uppercase tracking-wide">Projets</h2>
              <p className="text-sm text-stone-500 mt-1">Suis les quantités farmées. Ton nom s'inscrit sur le dernier ajout.</p>
            </div>

            {/* Project Card */}
            <div className="bg-[#111722] border border-stone-800/80 rounded-lg shadow-xl overflow-hidden">
              <div className="p-5 border-b border-stone-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold font-serif text-stone-200 tracking-wide uppercase">
                    Machine à XP (Create)
                  </h3>
                  <span className="bg-cyan-950/40 text-cyan-400 border border-cyan-800/40 text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider">
                    Fermes
                  </span>
                </div>
                <button className="flex items-center gap-1.5 bg-[#1cd1a1]/10 hover:bg-[#1cd1a1]/20 border border-[#1cd1a1]/20 text-[#1cd1a1] font-bold text-xs uppercase px-3 py-1.5 rounded transition">
                  <Plus className="w-3.5 h-3.5" /> Projet
                </button>
              </div>

              <div className="px-5 py-3 bg-[#0d121b] border-b border-stone-800/40">
                <p className="text-sm text-stone-400 italic">
                  Ferme à XP automatisée. Goulot : le brass (besoin d'un blaze pour le Blaze Burner).
                </p>
                {/* Progress Bar */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 bg-stone-900 rounded-full h-1.5 overflow-hidden border border-stone-800/40">
                    <div 
                      className="bg-amber-500 h-full transition-all duration-300"
                      style={{ width: `${globalProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-amber-500 min-w-[24px] text-right">{globalProgress}%</span>
                </div>
              </div>

              {/* Resource List Table */}
              <div className="divide-y divide-stone-800/40">
                {resources.map((res) => (
                  <div key={res.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#131a26]/40 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-stone-700 rounded-full"></div>
                      <span className="font-medium text-stone-300 text-sm md:text-base">{res.name}</span>
                      {res.by && (
                        <span className="text-[10px] text-cyan-400 bg-cyan-950/20 px-1.5 py-0.5 rounded font-mono">
                          • {res.by}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="flex items-center bg-stone-950/60 border border-stone-800/80 rounded overflow-hidden">
                        <button 
                          onClick={() => handleDecrement(res.id)}
                          className="px-2.5 py-1.5 hover:bg-stone-900 text-stone-500 hover:text-stone-300 border-r border-stone-800/80 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <div className="px-4 text-sm font-bold font-mono text-stone-200 min-w-[65px] text-center">
                          {res.current}/{res.max}
                        </div>
                        <button 
                          onClick={() => handleIncrement(res.id)}
                          className="px-2.5 py-1.5 hover:bg-stone-900 text-stone-500 hover:text-stone-300 border-l border-stone-800/80 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button 
                        onClick={() => handleComplete(res.id)}
                        className={`p-1.5 rounded border transition ${
                          res.current === res.max 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                            : 'border-stone-800/80 text-stone-600 hover:text-stone-400 hover:bg-stone-900'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-[#0d121b] border-t border-stone-800/60 flex justify-end">
                <button className="text-xs font-semibold text-stone-500 hover:text-stone-400 tracking-wide uppercase">
                  Masquer terminés
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'projets' && (
          <div className="py-12 text-center bg-[#111722] border border-stone-800/80 rounded-lg p-8">
            <Scroll className="w-8 h-8 text-stone-600 mx-auto mb-3" />
            <p className="text-sm text-stone-500 font-serif uppercase tracking-wider">Cette section de la taverne est encore calme...</p>
          </div>
        )}
      </main>
    </div>
  );
}
