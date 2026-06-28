import React, { useState } from 'react';
import { Shield, Users, Trophy, MessageSquare, Key, Swords, Beer, Scroll, Plus, RotateCw, Check, Minus, Youtube, MapPin, Trash2 } from 'lucide-react';

export default function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [userPseudo, setUserPseudo] = useState('');
  const [activeTab, setActiveTab] = useState('projets');
  
  // Onglet Trouvailles (Lieux découverts avec Coordonnées)
  const [trouvailles, setTrouvailles] = useState([]);
  const [lieuNom, setLieuNom] = useState('');
  const [coordX, setCoordX] = useState('');
  const [coordY, setCoordY] = useState('');
  const [coordZ, setCoordZ] = useState('');

  // Onglet Guide (Liens YouTube partagés par la commu)
  const [guides, setGuides] = useState([]);
  const [guideTitle, setGuideTitle] = useState('');
  const [guideUrl, setGuideUrl] = useState('');

  // Onglet Raids
  const [raids, setRaids] = useState([]);
  const [newRaidName, setNewRaidName] = useState('');
  const [newRaidDate, setNewRaidDate] = useState('');

  // État pour les ressources de la Machine à XP (Projets)
  const [resources, setResources] = useState([
    { id: 'fer', name: 'Fer', current: 0, max: 45, by: '' },
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

  // Connexion de base
  const handleLogin = (e) => {
    e.preventDefault();
    if (userPseudo.trim()) {
      setIsRegistered(true);
    }
  };

  // Gestion du farm
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

  // Ajouter un lieu (Trouvailles)
  const handleAddTrouvaille = (e) => {
    e.preventDefault();
    if (lieuNom.trim()) {
      setTrouvailles([...trouvailles, {
        id: Date.now(),
        name: lieuNom,
        x: coordX || '?',
        y: coordY || '?',
        z: coordZ || '?',
        by: userPseudo
      }]);
      setLieuNom('');
      setCoordX('');
      setCoordY('');
      setCoordZ('');
    }
  };

  // Ajouter un tuto YouTube (Guide)
  const handleAddGuide = (e) => {
    e.preventDefault();
    if (guideTitle.trim() && guideUrl.trim()) {
      setGuides([...guides, {
        id: Date.now(),
        title: guideTitle,
        url: guideUrl,
        by: userPseudo
      }]);
      setGuideTitle('');
      setGuideUrl('');
    }
  };

  // Ajouter un Raid
  const handleAddRaid = (e) => {
    e.preventDefault();
    if (newRaidName.trim()) {
      setRaids([...raids, {
        id: Date.now(),
        name: newRaidName,
        date: newRaidDate || 'À définir',
        status: 'En préparation'
      }]);
      setNewRaidName('');
      setNewRaidDate('');
    }
  };

  const totalCurrent = resources.reduce((acc, res) => acc + res.current, 0);
  const totalMax = resources.reduce((acc, res) => acc + res.max, 0);
  const globalProgress = Math.round((totalCurrent / totalMax) * 100) || 0;

  // --- ECRAN D'INSCRIPTION INITIAL ---
  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 font-serif flex flex-col justify-between">
        <div className="relative bg-black h-80 flex items-center justify-center border-b-4 border-amber-600 bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1597200381847-30ec200eeb9a?q=80&w=1200")' }}>
          <div className="text-center px-4">
            <div className="flex justify-center mb-3"><Beer className="w-16 h-16 text-amber-500 animate-pulse" /></div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-wider text-amber-500 uppercase">La Taverne d'Arcane Frontier</h1>
            <p className="mt-2 text-stone-400 text-lg max-w-xl mx-auto italic font-sans">Chopes de bière, ragoûts chauds et légendes de serveurs. Installe-toi, voyageur.</p>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto px-4 py-12 flex-1 flex flex-col justify-center">
          <div className="bg-stone-800/80 border-2 border-stone-700 rounded-lg p-6 md:p-8 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-stone-700 pb-4">
              <Scroll className="w-8 h-8 text-amber-500" />
              <h2 className="text-2xl font-bold text-amber-500 uppercase tracking-wide">Le Registre</h2>
            </div>
            <form onSubmit={handleLogin} className="space-y-4 font-sans">
              <div>
                <label className="block text-sm font-semibold text-stone-400 mb-2 uppercase tracking-wider">Pseudo Minecraft exact</label>
                <input
                  type="text"
                  value={userPseudo}
                  onChange={(e) => setUserPseudo(e.target.value)}
                  placeholder="Ex: Notch"
                  className="w-full bg-stone-950 border border-stone-700 rounded px-4 py-3 text-stone-100 focus:outline-none focus:border-amber-500 placeholder-stone-600 text-lg"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-stone-950 font-bold uppercase py-3 rounded tracking-wider transition-colors text-lg font-serif">
                S'inscrire sur le registre
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD PRINCIPAL ---
  return (
    <div className="min-h-screen bg-[#0b0f14] text-[#94a3b8] font-sans antialiased">
      
      {/* Header */}
      <header className="border-b border-stone-800 bg-[#0f141c] sticky top-0 z-50 px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Beer className="w-6 h-6 text-amber-500" />
            <div>
              <h1 className="text-xl font-bold tracking-wider text-stone-100 uppercase font-serif">La Taverne d'Arcane Frontier</h1>
              <p className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Project • Arcane Frontier</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium tracking-wide uppercase transition relative ${isActive ? 'text-amber-500 font-bold' : 'text-stone-500 hover:text-stone-300'}`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
                {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        
        {/* PROJETS */}
        {activeTab === 'projets' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-100 uppercase tracking-wide">Projets</h2>
              <p className="text-sm text-stone-500 mt-1">Suis les quantités farmées. Ton nom s'inscrit sur le dernier ajout.</p>
            </div>

            <div className="bg-[#111722] border border-stone-800/80 rounded-lg shadow-xl overflow-hidden">
              <div className="p-5 border-b border-stone-800/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold font-serif text-stone-200 tracking-wide uppercase">Machine à XP (Create)</h3>
                  <span className="bg-cyan-950/40 text-cyan-400 border border-cyan-800/40 text-[10px] font-bold uppercase px-2 py-0.5 rounded">Fermes</span>
                </div>
              </div>

              <div className="px-5 py-3 bg-[#0d121b] border-b border-stone-800/40">
                <p className="text-sm text-stone-400 italic">Ferme à XP automatisée. Goulot : le brass (besoin d'un blaze pour le Blaze Burner).</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 bg-stone-900 rounded-full h-1.5 overflow-hidden border border-stone-800/40">
                    <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${globalProgress}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-amber-500">{globalProgress}%</span>
                </div>
              </div>

              <div className="divide-y divide-stone-800/40">
                {resources.map((res) => (
                  <div key={res.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#131a26]/40 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-stone-700 rounded-full"></div>
                      <span className="font-medium text-stone-300">{res.name}</span>
                      {res.by && <span className="text-[10px] text-cyan-400 bg-cyan-950/20 px-1.5 py-0.5 rounded font-mono"> • {res.by}</span>}
                    </div>

                    <div className="flex items-center gap-6 justify-end">
                      <div className="flex items-center bg-stone-950/60 border border-stone-800/80 rounded overflow-hidden">
                        <button onClick={() => handleDecrement(res.id)} className="px-2.5 py-1.5 hover:bg-stone-900 text-stone-500"><Minus className="w-3.5 h-3.5" /></button>
                        <div className="px-4 text-sm font-bold font-mono text-stone-200 min-w-[65px] text-center">{res.current}/{res.max}</div>
                        <button onClick={() => handleIncrement(res.id)} className="px-2.5 py-1.5 hover:bg-stone-900 text-stone-500"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                      <button onClick={() => handleComplete(res.id)} className={`p-1.5 rounded border transition ${res.current === res.max ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'border-stone-800/80 text-stone-600'}`}><Check className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TROUVAILLES (Lieux & Coordonnées) */}
        {activeTab === 'trouvailles' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-100 uppercase tracking-wide">Trouvailles</h2>
              <p className="text-sm text-stone-500 mt-1">Indiquez les structures, biomes ou donjons importants découverts avec leurs coordonnées.</p>
            </div>

            <form onSubmit={handleAddTrouvaille} className="bg-[#111722] border border-stone-800/80 rounded-lg p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Structure / Lieu trouvé</label>
                  <input type="text" value={lieuNom} onChange={(e) => setLieuNom(e.target.value)} placeholder="Ex: Forteresse du Nether, Monument" className="w-full bg-stone-950 border border-stone-800 rounded p-2.5 text-stone-100 text-sm focus:border-amber-500 focus:outline-none" required />
                </div>
                <div className="grid grid-cols-3 gap-2 md:col-span-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-400 mb-2">X</label>
                    <input type="text" value={coordX} onChange={(e) => setCoordX(e.target.value)} placeholder="142" className="w-full bg-stone-950 border border-stone-800 rounded p-2.5 text-stone-100 text-sm text-center focus:border-amber-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Y</label>
                    <input type="text" value={coordY} onChange={(e) => setCoordY(e.target.value)} placeholder="64" className="w-full bg-stone-950 border border-stone-800 rounded p-2.5 text-stone-100 text-sm text-center focus:border-amber-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Z</label>
                    <input type="text" value={coordZ} onChange={(e) => setCoordZ(e.target.value)} placeholder="-850" className="w-full bg-stone-950 border border-stone-800 rounded p-2.5 text-stone-100 text-sm text-center focus:border-amber-500 focus:outline-none" />
                  </div>
                </div>
              </div>
              <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-stone-950 font-bold py-2.5 px-6 rounded text-sm uppercase tracking-wider font-serif flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Enregistrer le lieu
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trouvailles.length === 0 ? (
                <p className="text-sm text-stone-600 italic">Aucune trouvaille partagée pour le moment.</p>
              ) : (
                trouvailles.map((t) => (
                  <div key={t.id} className="bg-[#111722] border border-stone-800/80 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20"><MapPin className="w-5 h-5" /></div>
                      <div>
                        <h4 className="font-bold text-stone-200">{t.name}</h4>
                        <p className="text-xs font-mono text-amber-500 mt-1">Coords : X: {t.x} | Y: {t.y} | Z: {t.z}</p>
                        <span className="text-[10px] text-stone-500 block mt-1">Découvert par {t.by}</span>
                      </div>
                    </div>
                    <button onClick={() => setTrouvailles(trouvailles.filter(item => item.id !== t.id))} className="text-stone-600 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* RAIDS */}
        {activeTab === 'raids' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-100 uppercase tracking-wide">Raids</h2>
              <p className="text-sm text-stone-500 mt-1">Organisez les expéditions communautaires contre les boss du serveur.</p>
            </div>

            <form onSubmit={handleAddRaid} className="bg-[#111722] border border-stone-800/80 rounded-lg p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Objectif / Boss</label>
                <input type="text" value={newRaidName} onChange={(e) => setNewRaidName(e.target.value)} placeholder="Ex: L'Ender Dragon" className="w-full bg-stone-950 border border-stone-800 rounded p-2.5 text-stone-100 text-sm focus:border-amber-500 focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Date / Heure prévue</label>
                <input type="text" value={newRaidDate} onChange={(e) => setNewRaidDate(e.target.value)} placeholder="Ex: Samedi à 21h" className="w-full bg-stone-950 border border-stone-800 rounded p-2.5 text-stone-100 text-sm focus:border-amber-500 focus:outline-none" />
              </div>
              <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-stone-950 font-bold py-2.5 rounded text-sm uppercase tracking-wider font-serif">Planifier</button>
            </form>

            <div className="bg-[#111722] border border-stone-800/80 rounded-lg overflow-hidden">
              {raids.length === 0 ? (
                <p className="p-5 text-sm text-stone-600 italic">Aucun raid de planifié.</p>
              ) : (
                <div className="divide-y divide-stone-800/40">
                  {raids.map(raid => (
                    <div key={raid.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-amber-500" />
                        <div>
                          <span className="font-bold text-stone-200 block">{raid.name}</span>
                          <span className="text-xs text-stone-500">Planifié : {raid.date}</span>
                        </div>
                      </div>
                      <button onClick={() => setRaids(raids.filter(r => r.id !== raid.id))} className="text-stone-600 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* GUIDE (YouTube) */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-100 uppercase tracking-wide">Guide</h2>
              <p className="text-sm text-stone-500 mt-1">Ajoutez et consultez les tutoriels YouTube indispensables pour maîtriser le serveur.</p>
            </div>

            <form onSubmit={handleAddGuide} className="bg-[#111722] border border-stone-800/80 rounded-lg p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Nom du guide / Sujet</label>
                <input type="text" value={guideTitle} onChange={(e) => setGuideTitle(e.target.value)} placeholder="Ex: Débuter avec Create, Gérer l'énergie" className="w-full bg-stone-950 border border-stone-800 rounded p-2.5 text-stone-100 text-sm focus:border-amber-500 focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Lien YouTube complet</label>
                <input type="url" value={guideUrl} onChange={(e) => setGuideUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full bg-stone-950 border border-stone-800 rounded p-2.5 text-stone-100 text-sm focus:border-amber-500 focus:outline-none" required />
              </div>
              <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-stone-950 font-bold py-2.5 rounded text-sm uppercase tracking-wider font-serif flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Partager la vidéo
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guides.length === 0 ? (
                <p className="text-sm text-stone-600 italic">Aucun guide partagé.</p>
              ) : (
                guides.map((g) => (
                  <div key={g.id} className="bg-[#111722] border border-stone-800/80 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 rounded bg-red-500/10 text-red-500 border border-red-500/20"><Youtube className="w-5 h-5" /></div>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-stone-200 truncate">{g.title}</h4>
                        <a href={g.url} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-500 hover:underline truncate block mt-0.5">{g.url}</a>
                        <span className="text-[10px] text-stone-500 block mt-1">Partagé par {g.by}</span>
                      </div>
                    </div>
                    <button onClick={() => setGuides(guides.filter(item => item.id !== g.id))} className="text-stone-600 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
