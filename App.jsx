import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Beer, Users, Hammer, Scroll, Shield, Trophy, 
  Plus, Minus, Trash2, Check, Sparkles, Flame, 
  MapPin, Package, RefreshCw, Layers, ChevronRight 
} from 'lucide-react';

// Configuration d'accès Supabase (Production)
const SUPABASE_URL = "https://pdndmtktluaggvupgsej.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_I_zL7n0t8G-BO4jFUr4FBA_qpLWH90B";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Presets pour l'ajout en 1-Clic
const PRESETS_CREATE = [
  { name: "Plaques d'Acier", max: 64 },
  { name: "Tuyaux en Fluide", max: 32 },
  { name: "Mechanical Drills", max: 4 },
  { name: "Alternateurs d'Énergie", max: 8 },
  { name: "Blocs d'Andésite", max: 128 }
];

const PRESETS_ARS_NOUVEAU = [
  { name: "Source Gems", max: 64 },
  { name: "Source Jars", max: 16 },
  { name: "Agronomic Sourcelinks", max: 4 },
  { name: "Parchemins de Sortilège", max: 10 },
  { name: "Wilden Horns", max: 12 }
];

export default function App() {
  // Session utilisateur persistante
  const [isRegistered, setIsRegistered] = useState(() => localStorage.getItem('taverne_registered') === 'true');
  const [userPseudo, setUserPseudo] = useState(() => localStorage.getItem('taverne_pseudo') || '');
  
  // Navigation & Chargement
  const [activeTab, setActiveTab] = useState('chantiers');
  const [loading, setLoading] = useState(true);
  
  // Données centralisées
  const [chantiers, setChantiers] = useState([]);
  const [trouvailles, setTrouvailles] = useState([]);
  const [raids, setRaids] = useState([]);
  const [guides, setGuides] = useState([]);
  const [totalInscrits, setTotalInscrits] = useState(0);

  // Formulaire d'ajout personnalisé de secours
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('machinery');
  const [customMax, setCustomMax] = useState(64);

  // Formulaires secondaires (Coffres, Raids, Guides)
  const [lieuNom, setLieuNom] = useState('');
  const [coordX, setCoordX] = useState(''); const [coordY, setCoordY] = useState(''); const [coordZ, setCoordZ] = useState('');
  const [itemName, setItemName] = useState(''); const [itemRarity, setItemRarity] = useState('Epic'); const [itemLocation, setItemLocation] = useState('');
  const [newRaidName, setNewRaidName] = useState(''); const [newRaidDate, setNewRaidDate] = useState('');
  const [guideTitle, setGuideTitle] = useState(''); const [guideUrl, setGuideUrl] = useState('');

  // Récupération globale initiale
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { count } = await supabase.from('aventuriers').select('*', { count: 'exact', head: true });
        if (count !== null) setTotalInscrits(count);

        const { data: cData } = await supabase.from('projets_state').select('*');
        if (cData) setChantiers(cData);

        const { data: tData } = await supabase.from('trouvailles').select('*');
        if (tData) setTrouvailles(tData);

        const { data: rData } = await supabase.from('raids').select('*');
        if (rData) setRaids(rData);

        const { data: gData } = await supabase.from('guides').select('*');
        if (gData) setGuides(gData);
      } catch (err) {
        console.error("Erreur d'acquisition des tables Supabase :", err);
      }
      setLoading(false);
    }
    loadData();
  }, [isRegistered]);

  // Connexion de l'aventurier
  const handleRegister = async (e) => {
    e.preventDefault();
    const clean = userPseudo.trim();
    if (!clean) return;

    localStorage.setItem('taverne_registered', 'true');
    localStorage.setItem('taverne_pseudo', clean);
    await supabase.from('aventuriers').insert([{ pseudo: clean }], { ignoreDuplicates: true });
    setIsRegistered(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsRegistered(false);
    setUserPseudo('');
  };

  /* ==========================================
     LOGIQUE MÉTIER DE L'ONGLET CHANTIER (REFONDU)
     ========================================== */

  // Ajout instantané (Via preset ou via formulaire personnalisé)
  const handleCreateChantier = async (name, category, maxQty) => {
    const tempId = Date.now();
    const newChantier = {
      id: tempId,
      name: name,
      category: category,
      current: 0,
      max: parseInt(maxQty) || 64,
      by: userPseudo
    };

    // Injection visuelle instantanée (Optimistic UI)
    setChantiers(prev => [...prev, newChantier]);

    // Échange réseau asynchrone
    const { data } = await supabase.from('projets_state').insert([{
      name: newChantier.name,
      category: newChantier.category,
      current: newChantier.current,
      max: newChantier.max,
      by: newChantier.by
    }]).select();

    // Remplacement par le véritable ID incrémenté en base de données
    if (data && data[0]) {
      setChantiers(prev => prev.map(item => item.id === tempId ? data[0] : item));
    }
  };

  // Incrémentation et Décrémentation réactives
  const handleUpdateQuantity = async (id, step, forceComplete = false) => {
    let syncedObject = null;

    setChantiers(prev => prev.map(item => {
      if (item.id === id) {
        let targetValue = forceComplete ? item.max : item.current + step;
        if (targetValue > item.max) targetValue = item.max;
        if (targetValue < 0) targetValue = 0;
        syncedObject = { ...item, current: targetValue, by: userPseudo };
        return syncedObject;
      }
      return item;
    }));

    if (syncedObject) {
      await supabase.from('projets_state')
        .update({ current: syncedObject.current, by: userPseudo })
        .eq('id', id);
    }
  };

  // Suppression immédiate
  const handleDeleteChantier = async (id) => {
    setChantiers(prev => prev.filter(item => item.id !== id));
    await supabase.from('projets_state').delete().eq('id', id);
  };

  /* ==========================================
     LOGIQUE COFFRES, RAIDS & GUIDES SECONDAIRES
     ========================================== */
  const handleAddTrouvaille = async (e) => {
    e.preventDefault();
    if (!lieuNom.trim()) return;
    const newLieu = { id: Date.now(), type: 'lieu', name: lieuNom, coords: `X: ${coordX||'?'} | Y: ${coordY||'?'} | Z: ${coordZ||'?'}`, by: userPseudo, rarity: 'Structure' };
    setTrouvailles(p => [...p, newLieu]); setLieuNom(''); setCoordX(''); setCoordY(''); setCoordZ('');
    await supabase.from('trouvailles').insert([newLieu]);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    const newItem = { id: Date.now(), type: 'item', name: itemName, coords: itemLocation ? `Rangement: ${itemLocation}` : 'Loot Aléatoire', by: userPseudo, rarity: itemRarity };
    setTrouvailles(p => [...p, newItem]); setItemName(''); setItemLocation('');
    await supabase.from('trouvailles').insert([newItem]);
  };

  const handleDeleteTrouvaille = async (id) => {
    setTrouvailles(p => p.filter(x => x.id !== id));
    await supabase.from('trouvailles').delete().eq('id', id);
  };

  const handleAddRaid = async (e) => {
    e.preventDefault();
    if (!newRaidName.trim()) return;
    const newRaid = { id: Date.now(), name: newRaidName, date: newRaidDate || 'À définir', status: 'En préparation' };
    setRaids(p => [...p, newRaid]); setNewRaidName(''); setNewRaidDate('');
    await supabase.from('raids').insert([newRaid]);
  };

  const handleDeleteRaid = async (id) => {
    setRaids(p => p.filter(x => x.id !== id));
    await supabase.from('raids').delete().eq('id', id);
  };

  const handleAddGuide = async (e) => {
    e.preventDefault();
    if (!guideTitle.trim() || !guideUrl.trim()) return;
    const newGuide = { id: Date.now(), title: guideTitle, url: guideUrl, by: userPseudo };
    setGuides(p => [...p, newGuide]); setGuideTitle(''); setGuideUrl('');
    await supabase.from('guides').insert([newGuide]);
  };

  const handleDeleteGuide = async (id) => {
    setGuides(p => p.filter(x => x.id !== id));
    await supabase.from('guides').delete().eq('id', id);
  };

  // Matrice fixe pour le double coffre (54 slots)
  const doubleChestSlots = Array.from({ length: 54 }, (_, i) => trouvailles[i] || null);

  // VUE DE CONNEXION INITIALE
  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-[#0d0907] text-[#e7dbcf] flex flex-col items-center justify-center p-4" style={{ backgroundImage: 'radial-gradient(circle at center, #1c130e 0%, #0d0907 100%)' }}>
        <div className="bg-[#150e0b] p-8 rounded-xl border border-[#38261c] shadow-2xl max-w-md w-full text-center space-y-6">
          <div className="inline-flex p-3 bg-[#e58219]/10 rounded-full border border-[#e58219]/20">
            <Beer className="w-10 h-10 text-[#e58219]" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-black text-white uppercase tracking-wider">Taverne d'Arcane Frontier</h2>
            <p className="text-xs text-stone-400 mt-1">Identifiez-vous pour manipuler les registres et stocks communs de la guilde.</p>
          </div>
          <form onSubmit={handleRegister} className="space-y-3">
            <input type="text" value={userPseudo} onChange={e => setUserPseudo(e.target.value)} placeholder="Votre pseudo Minecraft exact" className="w-full bg-[#0a0605] border border-[#3e2a1e] rounded-lg p-3 text-sm text-white text-center focus:outline-none focus:border-[#e58219] font-medium" required />
            <button type="submit" className="w-full bg-[#e58219] hover:bg-[#c96f12] text-stone-950 font-serif font-bold p-3 rounded-lg text-xs uppercase tracking-widest transition-all">S'installer à la table</button>
          </form>
          <div className="text-[10px] text-stone-500 font-mono pt-2 border-t border-[#271a13]">Synchro Cloud — Supabase Realtime Engine</div>
        </div>
      </div>
    );
  }

  // INTERFACE STRUCTURÉE PRINCIPALE
  return (
    <div className="min-h-screen bg-[#090605] text-stone-300 font-sans antialiased">
      
      {/* HEADER PRINCIPAL */}
      <header className="bg-[#120d0a] border-b border-[#291b12] px-4 lg:px-8 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Hammer className="text-[#e58219] w-6 h-6" />
            <div>
              <h1 className="text-sm font-black text-stone-100 uppercase tracking-wider font-serif">Arcane Frontier — Panel de Guilde</h1>
              <p className="text-[10px] text-stone-500 font-mono font-bold uppercase tracking-widest">Base de données en direct</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="bg-[#e58219]/10 border border-[#e58219]/30 rounded-lg px-3 py-1.5 text-[#e58219] font-bold font-mono">
              👤 {userPseudo}
            </div>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-400 transition-colors underline font-mono text-[11px]">Changer de compte</button>
          </div>
        </div>
      </header>

      {/* NAVIGATION INTERNE */}
      <div className="bg-[#120d0a] border-b border-[#291b12]/60 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex space-x-1 py-1">
          {[
            { id: 'chantiers', label: 'Chantiers & Objectifs', icon: Hammer },
            { id: 'coffres', label: 'Double Coffre Commun', icon: Scroll },
            { id: 'raids', label: 'Raids & Boss', icon: Shield },
            { id: 'guides', label: 'Bibliothèque', icon: Trophy },
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${isSelected ? 'bg-[#e58219] text-stone-950 font-black' : 'text-stone-500 hover:text-stone-300 hover:bg-[#1a130f]'}`}>
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RECONSTRUCTION ET EXÉCUTION DE L'ONGLET SÉLECTIONNÉ */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {loading ? (
          <div className="text-center py-24 text-xs font-mono text-[#e58219] uppercase tracking-widest flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Restructuration des registres magiques...
          </div>
        ) : (
          <>
            {/* =======================================================
                ONGLET 1 : CHANTIERS (PERFAIT, SANS FORMULAIRE DE TROP)
                ======================================================= */}
            {activeTab === 'chantiers' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* ETAPE A : AJOUTS IMMÉDIATS EN UN CLIC (PRESETS) */}
                <div className="bg-[#120d0a] border border-[#332218] rounded-xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#241911] pb-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-200">Ajout instantané d'un objectif de récolte</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Presets Create */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">⚙️ Mod Create / Industrie</span>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESETS_CREATE.map((item, idx) => (
                          <button key={idx} onClick={() => handleCreateChantier(item.name, 'machinery', item.max)} className="bg-[#18110d] hover:bg-[#261b14] text-stone-300 text-xs py-1.5 px-3 rounded-lg border border-[#3a281e] transition-all flex items-center gap-1 active:scale-95">
                            <Plus className="w-3 h-3 text-amber-500 stroke-[3]" /> {item.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Presets Ars Nouveau */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">🔮 Mod Ars Nouveau / Magie</span>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESETS_ARS_NOUVEAU.map((item, idx) => (
                          <button key={idx} onClick={() => handleCreateChantier(item.name, 'magic', item.max)} className="bg-[#18110d] hover:bg-[#261b14] text-stone-300 text-xs py-1.5 px-3 rounded-lg border border-[#3a281e] transition-all flex items-center gap-1 active:scale-95">
                            <Plus className="w-3 h-3 text-purple-400 stroke-[3]" /> {item.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Formulaire de secours (Compact et discret) */}
                  <div className="pt-4 border-t border-[#241911] flex flex-wrap items-center gap-3 text-xs">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Hors preset :</span>
                    <input type="text" value={customName} onChange={e => setCustomName(e.target.value)} placeholder="Nom de l'objet personnalisé..." className="flex-1 min-w-[180px] bg-[#070504] border border-[#38261c] rounded-lg p-2 text-white focus:outline-none focus:border-[#e58219]" />
                    <select value={customCategory} onChange={e => setCustomCategory(e.target.value)} className="bg-[#070504] border border-[#38261c] rounded-lg p-2 text-stone-300 focus:outline-none cursor-pointer">
                      <option value="machinery">⚙️ Create</option>
                      <option value="magic">🔮 Magie</option>
                    </select>
                    <div className="flex items-center gap-1">
                      <span className="text-stone-500 text-[11px]">Max:</span>
                      <input type="number" value={customMax} onChange={e => setCustomMax(e.target.value)} className="w-16 bg-[#070504] border border-[#38261c] rounded-lg p-2 text-center text-white focus:outline-none" />
                    </div>
                    <button type="button" onClick={() => { if(customName.trim()) { handleCreateChantier(customName, customCategory, customMax); setCustomName(''); } }} className="bg-[#e58219] hover:bg-[#cd7211] text-stone-950 font-bold px-4 py-2 rounded-lg transition-colors uppercase text-[11px] tracking-wider">Créer</button>
                  </div>
                </div>

                {/* ETAPE B : LISTING DYNAMIQUE DES OBJECTIFS ACTIFS */}
                <div className="bg-[#120d0a] border border-[#2b1c13] rounded-xl overflow-hidden shadow-2xl">
                  <div className="bg-[#18110d] px-5 py-3.5 border-b border-[#2b1c13] flex justify-between items-center">
                    <span className="font-serif font-bold text-xs uppercase tracking-wider text-stone-200">Tableau de suivi des ressources de la Guilde</span>
                    <span className="bg-[#090605] text-[#e58219] px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border border-[#332218]">{chantiers.length} Actifs</span>
                  </div>

                  <div className="p-4 divide-y divide-[#241810] space-y-4">
                    {chantiers.length === 0 ? (
                      <div className="text-center py-12 text-stone-600 italic text-xs font-serif">Aucun objectif n'est renseigné sur le tableau. Utilisez les raccourcis d'ajout ci-dessus !</div>
                    ) : (
                      chantiers.map((item) => {
                        const percent = Math.min(Math.round((item.current / item.max) * 100), 100);
                        const isFinished = item.current >= item.max;

                        return (
                          <div key={item.id} className="pt-4 first:pt-0 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            
                            {/* Identifiants & Auteur */}
                            <div className="lg:w-1/3 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`font-serif font-bold text-sm tracking-wide ${isFinished ? 'text-emerald-400 line-through' : 'text-stone-100'}`}>{item.name}</span>
                                <span className="text-[10px] px-1.5 py-0.2 bg-[#090605] border border-[#24170f] rounded text-stone-400">
                                  {item.category === 'machinery' ? '⚙️ Create' : '🔮 Magie'}
                                </span>
                              </div>
                              <span className="text-[10px] text-stone-500 font-mono block">Dernier apport par : <b className="text-stone-400 font-sans">{item.by || 'Inconnu'}</b></span>
                            </div>

                            {/* Jauge de Progression Fluide */}
                            <div className="flex-1 space-y-1">
                              <div className="flex justify-between text-[10px] font-mono font-black">
                                <span className={isFinished ? "text-emerald-400" : "text-amber-500"}>{percent}% ATTEINT</span>
                                <span className="text-stone-400">{item.current} / {item.max}</span>
                              </div>
                              <div className="w-full bg-[#070504] h-2.5 rounded-full p-0.5 border border-[#261911]">
                                <div className={`h-full rounded-full transition-all duration-300 ${isFinished ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-amber-500'}`} style={{ width: `${percent}%` }}></div>
                              </div>
                            </div>

                            {/* Actions d'Ajustement Instantanées */}
                            <div className="flex items-center gap-1.5 font-mono justify-end">
                              <div className="bg-[#070504] border border-[#2b1c12] rounded-lg p-1 flex items-center space-x-1">
                                <button onClick={() => handleUpdateQuantity(item.id, -10)} className="px-2 py-0.5 text-[10px] text-stone-500 hover:text-stone-200 transition-colors rounded hover:bg-[#120d0a] font-bold">-10</button>
                                <button onClick={() => handleUpdateQuantity(item.id, -1)} className="p-1 text-stone-500 hover:text-stone-200 transition-colors rounded hover:bg-[#120d0a]"><Minus className="w-3 h-3" /></button>
                                <button onClick={() => handleUpdateQuantity(item.id, 1)} className="p-1 text-stone-500 hover:text-stone-200 transition-colors rounded hover:bg-[#120d0a]"><Plus className="w-3 h-3" /></button>
                                <button onClick={() => handleUpdateQuantity(item.id, 10)} className="px-2 py-0.5 text-[10px] text-stone-500 hover:text-stone-200 transition-colors rounded hover:bg-[#120d0a] font-bold">+10</button>
                              </div>
                              
                              {/* Validation Totale */}
                              <button onClick={() => handleUpdateQuantity(item.id, 0, true)} className="p-1.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 rounded-lg hover:bg-emerald-800 hover:text-white transition-all active:scale-90" title="Remplir instantanément à 100%">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </button>

                              {/* Destruction de la ligne */}
                              <button onClick={() => handleDeleteChantier(item.id)} className="p-1.5 text-stone-600 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-all" title="Retirer de l'affichage">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* ONGLET 2 : DOUBLE COFFRE */}
            {activeTab === 'coffres' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <form onSubmit={handleAddTrouvaille} className="bg-[#120d0a] border border-[#2b1c13] p-4 rounded-xl space-y-3 text-xs">
                    <h4 className="font-serif font-bold text-[#e58219] uppercase border-b border-[#241810] pb-2 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Marquer un lieu stratégique</h4>
                    <input type="text" value={lieuNom} onChange={e => setLieuNom(e.target.value)} placeholder="Ex: Cité Ancienne, Donjon de Glace..." className="w-full bg-[#070504] border border-[#38261c] rounded-lg p-2 text-white focus:outline-none" required />
                    <div className="grid grid-cols-3 gap-2 text-center font-mono">
                      <input type="text" value={coordX} onChange={e => setCoordX(e.target.value)} placeholder="X" className="bg-[#070504] border border-[#38261c] rounded p-2 text-white" />
                      <input type="text" value={coordY} onChange={e => setCoordY(e.target.value)} placeholder="Y" className="bg-[#070504] border border-[#38261c] rounded p-2 text-white" />
                      <input type="text" value={coordZ} onChange={e => setCoordZ(e.target.value)} placeholder="Z" className="bg-[#070504] border border-[#38261c] rounded p-2 text-white" />
                    </div>
                    <button type="submit" className="w-full bg-[#e58219] text-stone-950 font-bold py-2 rounded-lg font-serif uppercase tracking-wider">Consigner</button>
                  </form>

                  <form onSubmit={handleAddItem} className="bg-[#120d0a] border border-[#2b1c13] p-4 rounded-xl space-y-3 text-xs">
                    <h4 className="font-serif font-bold text-purple-400 uppercase border-b border-[#241810] pb-2 flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Déclarer un Butin / Relique</h4>
                    <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} placeholder="Ex: Épée Calamiteuse, Crâne de Wither..." className="w-full bg-[#070504] border border-[#38261c] rounded-lg p-2 text-white focus:outline-none" required />
                    <div className="grid grid-cols-2 gap-2">
                      <select value={itemRarity} onChange={e => setItemRarity(e.target.value)} className="bg-[#070504] border border-[#38261c] rounded-lg p-2 text-stone-200">
                        <option value="Rare">Rare 🟦</option>
                        <option value="Epic">Épique 🟪</option>
                        <option value="Legendary">Mythique 🟧</option>
                      </select>
                      <input type="text" value={itemLocation} onChange={e => setItemLocation(e.target.value)} placeholder="N° de Coffre ou Rangée" className="bg-[#070504] border border-[#38261c] rounded-lg p-2 text-white" />
                    </div>
                    <button type="submit" className="w-full bg-purple-700 text-white font-bold py-2 rounded-lg font-serif uppercase tracking-wider hover:bg-purple-600">Enregistrer</button>
                  </form>
                </div>

                <div className="bg-[#bababa] border-4 border-t-[#eaeaea] border-l-[#eaeaea] border-b-[#444] border-r-[#444] p-4 rounded max-w-4xl mx-auto shadow-2xl">
                  <div className="text-[#2b2b2b] font-mono text-xs font-black uppercase mb-3 flex items-center justify-between">
                    <span>🧰 Vue Double Coffre Commun (Synchro en temps réel)</span>
                    <span className="text-[10px] text-stone-600 font-sans font-normal">Survoler pour inspecter</span>
                  </div>
                  <div className="grid grid-cols-9 gap-1 bg-[#808080] p-1.5 border-2 border-t-[#333] border-l-[#333] border-b-[#fff] border-r-[#fff]">
                    {doubleChestSlots.map((slot, idx) => (
                      <div key={idx} className="aspect-square bg-[#8c8c8c] border-2 border-t-[#404040] border-l-[#404040] border-b-[#e0e0e0] border-r-[#e0e0e0] relative group flex items-center justify-center hover:bg-[#a1a1a1] transition-all cursor-help p-1">
                        {slot ? (
                          <>
                            <span className="text-base select-none">{slot.type === 'item' ? '💎' : '🗺️'}</span>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 bg-[#130b18]/95 border border-purple-900 rounded-lg p-2.5 shadow-2xl text-[11px] font-mono min-w-[190px] text-stone-200">
                              <div className="font-bold text-amber-400">{slot.name}</div>
                              <div className="text-stone-400 mt-0.5">{slot.coords}</div>
                              <div className="text-[9px] text-stone-500 border-t border-purple-900/40 pt-1 mt-1">Par: {slot.by}</div>
                            </div>
                            <button onClick={() => handleDeleteTrouvaille(slot.id)} className="absolute -top-1 -right-1 bg-red-700 hover:bg-red-600 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white/20 shadow">✕</button>
                          </>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ONGLET 3 : RAIDS */}
            {activeTab === 'raids' && (
              <div className="space-y-4 text-xs animate-fadeIn">
                <form onSubmit={handleAddRaid} className="bg-[#120d0a] border border-[#2b1c13] p-4 rounded-xl flex flex-col sm:flex-row items-end gap-3">
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Nom du Boss de Raid</label>
                    <input type="text" value={newRaidName} onChange={e => setNewRaidName(e.target.value)} placeholder="Ex: Ender Dragon, Léviathan..." className="w-full bg-[#070504] border border-[#38261c] rounded-lg p-2 text-white" required />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Date / Heure programmée</label>
                    <input type="text" value={newRaidDate} onChange={e => setNewRaidDate(e.target.value)} placeholder="Ex: Samedi soir à 21h00" className="w-full bg-[#070504] border border-[#38261c] rounded-lg p-2 text-white" />
                  </div>
                  <button type="submit" className="bg-[#e58219] hover:bg-[#cd7211] text-stone-950 font-serif font-bold py-2 px-5 rounded-lg uppercase tracking-wide h-9">Planifier</button>
                </form>

                <div className="bg-[#120d0a] border border-[#2b1c13] rounded-xl divide-y divide-[#241810] overflow-hidden">
                  {raids.length === 0 ? (
                    <p className="p-5 text-stone-600 italic font-serif">Aucun assaut militaire ou combat de boss n'est programmé.</p>
                  ) : (
                    raids.map(r => (
                      <div key={r.id} className="p-4 flex items-center justify-between hover:bg-[#16100d] transition-colors">
                        <div>
                          <span className="font-serif font-bold text-stone-200 text-sm block">{r.name}</span>
                          <span className="text-stone-500 font-mono text-[11px]">Départ planifié : {r.date}</span>
                        </div>
                        <button onClick={() => handleDeleteRaid(r.id)} className="text-stone-700 hover:text-red-400 p-2 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ONGLET 4 : BIBLIOTHÈQUE / GUIDES */}
            {activeTab === 'guides' && (
              <div className="space-y-6 text-xs animate-fadeIn">
                <form onSubmit={handleAddGuide} className="bg-[#120d0a] border border-[#2b1c13] p-4 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Nom du grimoire / vidéo</label>
                    <input type="text" value={guideTitle} onChange={e => setGuideTitle(e.target.value)} placeholder="Ex: Tuto automatisation Create..." className="w-full bg-[#070504] border border-[#38261c] rounded-lg p-2 text-white" required />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Adresse Internet (URL)</label>
                    <input type="url" value={guideUrl} onChange={e => setGuideUrl(e.target.value)} placeholder="https://..." className="w-full bg-[#070504] border border-[#38261c] rounded-lg p-2 text-white" required />
                  </div>
                  <button type="submit" className="bg-[#e58219] text-stone-950 font-serif font-bold py-2 rounded-lg uppercase tracking-wider">Partager l'archive</button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {guides.length === 0 ? (
                    <p className="col-span-2 text-center text-stone-600 italic font-serif py-4">Aucun guide partagé pour le moment.</p>
                  ) : (
                    guides.map((g) => (
                      <div key={g.id} className="bg-[#120d0a] border border-[#2b1c13] p-4 rounded-xl flex items-center justify-between hover:border-[#3e2a1d] transition-all">
                        <div className="space-y-1 truncate mr-2">
                          <h5 className="font-bold text-stone-200 text-sm font-serif truncate">{g.title}</h5>
                          <a href={g.url} target="_blank" rel="noreferrer" className="text-amber-500 hover:underline text-[11px] font-mono flex items-center gap-0.5 truncate">
                            <ChevronRight className="w-3 h-3 flex-shrink-0" /> Visiter le lien
                          </a>
                        </div>
                        <button onClick={() => handleDeleteGuide(g.id)} className="text-stone-700 hover:text-red-400 p-1.5 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
