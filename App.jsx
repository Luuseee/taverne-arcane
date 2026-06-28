import React, { useState } from 'react';
import { Shield, Users, Trophy, MessageSquare, Key, Swords, Beer, Scroll, Plus, RotateCw, Check, Minus, Youtube, Link, Trash2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('projets');
  const [userPseudo, setUserPseudo] = useState('aky');
  const [isEditingPseudo, setIsEditingPseudo] = useState(false);
  const [tempPseudo, setTempPseudo] = useState('aky');
  
  // Onglet Trouvailles : Liens YouTube et partages
  const [trouvailles, setTrouvailles] = useState([
    { id: 1, title: "Tuto Create : Usine à fer optimisée", url: "https://youtube.com/watch?v=dQw4w9WgXcQ", type: "youtube" }
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Onglet Raids
  const [raids, setRaids] = useState([
    { id: 1, name: "Le Dragon de l'End", status: "En préparation", date: "Samedi soir" },
    { id: 2, name: "Raid de la Forteresse de Néant", status: "Terminé", date: "Passé" }
  ]);

  // État pour les ressources de la Machine à XP (Projets)
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

  const handleSavePseudo = (e) => {
    e.preventDefault();
    if (tempPseudo.trim()) {
      setUserPseudo(tempPseudo);
      setIsEditingPseudo(false);
    }
  };

  const handleAddTrouvaille = (e) => {
    e.preventDefault();
    if (newTitle.trim() && newUrl.trim()) {
      const isYoutube = newUrl.includes('youtube.com') || newUrl.includes('youtu.be');
      setTrouvailles([...trouvailles, {
        id: Date.now(),
        title: newTitle,
        url: newUrl,
        type: isYoutube ? 'youtube' : 'link'
      }]);
      setNewTitle('');
      setNewUrl('');
    }
  };

  const handleDeleteTrouvaille = (id) => {
    setTrouvailles(trouvailles.filter(t => t.id !== id));
  };

  const totalCurrent = resources.reduce((acc, res) => acc + res.current, 0);
  const totalMax = resources.reduce((acc, res) => acc + res.max, 0);
  const globalProgress = Math.round((totalCurrent / totalMax) * 100);

  return (
    <div className="min-h-screen bg-[#0b0f14] text-[#94a3b8] font-sans antialiased selection:bg-amber-700 selection:text-amber-100">
      
      {/* Header */}
      <header className="border-b border-stone-800 bg-[#0f141c] sticky top-0 z-50 px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 p-2 rounded border border-amber-500/20">
              <Beer className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-stone-100 uppercase font-serif">
                La Taverne d'Arcane Frontier
              </h1>
              <p className="text-xs uppercase tracking-widest text-stone-500 font-semibold flex items-center gap-1">
                Project <span className="text-stone-400">•</span> Arcane Frontier
              </p>
            </div>
          </div>

          {/* Pseudo magique modifiable */}
          <div className="flex items-center gap-2">
            {isEditingPseudo ? (
              <form onSubmit={handleSavePseudo} className="flex items-center gap-1">
                <input 
                  type="text" 
                  value={tempPseudo} 
                  onChange={(e) => setTempPseudo(e.target.value)}
                  className="bg-stone-900 border border-amber-500/50 rounded px-2 py-1 text-xs text-stone-100 focus:outline-none"
                  maxLength={16}
                  autoFocus
                />
                <button type="submit" className="bg-amber-600 text-stone-950 p-1 rounded hover:bg-amber-500"><Check className="w-3.5 h-3.5" /></button>
              </form>
            ) : (
              <div 
                onClick={() => { setTempPseudo(userPseudo); setIsEditingPseudo(true); }}
                className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded px-3 py-1.5 text-xs text-amber-400 font-bold cursor-pointer hover:bg-amber-500/20 transition"
                title="Clique pour changer ton pseudo"
              >
                <Swords className="w-3.5 h-3.5" /> Aventurier : {userPseudo}
              </div>
            )}
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
                {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        
        {/* ONGLET PROJETS */}
        {activeTab === 'projets' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-100 uppercase tracking-wide">Projets de Farm</h2>
              <p className="text-sm text-stone-500 mt-1">Santé à toi, {userPseudo}. Ajuste les stocks récoltés pour la communauté.</p>
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
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="font-medium text-stone-300">{res.name}</span>
                      {res.by && <span className="text-[10px] text-cyan-400 bg-cyan-950/20 px-1.5 py-0.5 rounded font-mono"> par {res.by}</span>}
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

        {/* ONGLET TROUVAILLES (YouTube & Liens) */}
        {activeTab === 'trouvailles' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-100 uppercase tracking-wide">Trouvailles & Partages</h2>
              <p className="text-sm text-stone-500 mt-1">Partage des vidéos YouTube de builds, de machines Create ou des plans intéressants.</p>
            </div>

            {/* Formulaire d'ajout */}
            <form onSubmit={handleAddTrouvaille} className="bg-[#111722] border border-stone-800/80 rounded-lg p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Titre de la trouvaille</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Tuto ferme à Enderman ultra simple"
                  className="w-full bg-stone-950 border border-stone-800 rounded p-2.5 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Lien (URL YouTube ou autre)</label>
                <input 
                  type="url" 
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-stone-950 border border-stone-800 rounded p-2.5 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-stone-950 font-bold py-2.5 rounded text-sm uppercase tracking-wider flex items-center justify-center gap-2 font-serif">
                <Plus className="w-4 h-4" /> Ajouter au grimoire
              </button>
            </form>

            {/* Liste des trouvailles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trouvailles.map((t) => (
                <div key={t.id} className="bg-[#111722] border border-stone-800/80 rounded-lg p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-2 rounded shrink-0 ${t.type === 'youtube' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                      {t.type === 'youtube' ? <Youtube className="w-5 h-5" /> : <Link className="w-5 h-5" />}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-stone-200 truncate text-sm md:text-base">{t.title}</h4>
                      <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-500 hover:underline truncate block mt-0.5">{t.url}</a>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteTrouvaille(t.id)} className="text-stone-600 hover:text-red-400 p-2 transition shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ONGLET RAIDS */}
        {activeTab === 'raids' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-100 uppercase tracking-wide">Tableau des Raids & Expéditions</h2>
              <p className="text-sm text-stone-500 mt-1">Préparez vos armes. Voici les expéditions communautaires de la taverne.</p>
            </div>

            <div className="bg-[#111722] border border-stone-800/80 rounded-lg overflow-hidden">
              <div className="divide-y divide-stone-800/40">
                {raids.map(raid => (
                  <div key={raid.id} className="p-4 flex items-center justify-between gap-4 bg-[#111722]">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-amber-500" />
                      <div>
                        <span className="font-bold text-stone-200 block">{raid.name}</span>
                        <span className="text-xs text-stone-500">Planifié pour : {raid.date}</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded font-bold border ${raid.status === 'Terminé' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-800/30' : 'bg-amber-950/30 text-amber-400 border-amber-800/30'}`}>
                      {raid.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ONGLET GUIDE */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-100 uppercase tracking-wide">Le Guide de l'Explorateur</h2>
              <p className="text-sm text-stone-500 mt-1">Les parchemins sacrés pour bien débuter sur Arcane Frontier.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#111722] border border-stone-800/80 rounded-lg p-5 space-y-3">
                <h3 className="font-serif text-amber-500 font-bold uppercase tracking-wider border-b border-stone-800 pb-2">📜 Commandes Utiles</h3>
                <p className="text-sm text-stone-300 font-mono bg-stone-950 p-2 rounded">/spawn - Retourner au camp de base</p>
                <p className="text-sm text-stone-300 font-mono bg-stone-950 p-2 rounded">/home [nom] - Téléportation à votre lit</p>
                <p className="text-sm text-stone-300 font-mono bg-stone-950 p-2 rounded">/tpa [pseudo] - Demande de téléportation</p>
              </div>

              <div className="bg-[#111722] border border-stone-800/80 rounded-lg p-5 space-y-3">
                <h3 className="font-serif text-amber-500 font-bold uppercase tracking-wider border-b border-stone-800 pb-2">⚔️ Règles de Bonne Conduite</h3>
                <p className="text-sm text-stone-300">1. Pas de grief ni de vol dans les zones communautaires.</p>
                <p className="text-sm text-stone-300">2. Enregistrez vos projets de farm majeurs sur cet outil pour éviter les doublons.</p>
                <p className="text-sm text-stone-300">3. Partagez l'hydromel au comptoir de la taverne !</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
