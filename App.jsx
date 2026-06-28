import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Beer, Hammer, Scroll, Shield, Trophy, 
  Plus, Minus, Trash2, Check, Sparkles, 
  MapPin, Package, RefreshCw, ChevronRight,
  ChevronDown, ChevronUp, FolderPlus, CheckCircle2
} from 'lucide-react';

// Configuration d'accès Supabase (Production)
const SUPABASE_URL = "https://pdndmtktluaggvupgsej.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_I_zL7n0t8G-BO4jFUr4FBA_qpLWH90B";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Matériaux fréquents pour l'ajout ultra-rapide dans un projet
const QUICK_MATERIALS = [
  { name: "Plaques d'Acier", max: 64 },
  { name: "Tuyaux en Fluide", max: 32 },
  { name: "Source Gems", max: 64 },
  { name: "Source Jars", max: 16 },
  { name: "Blocs d'Andésite", max: 128 },
  { name: "Obsidienne", max: 64 }
];

export default function App() {
  // Changement ici : On force la reconnexon au chargement pour afficher l'onglet pseudo systématiquement
  const [isRegistered, setIsRegistered] = useState(false);
  const [userPseudo, setUserPseudo] = useState(() => localStorage.getItem('taverne_pseudo') || '');
  
  // Navigation & Chargement
  const [activeTab, setActiveTab] = useState('chantiers');
  const [loading, setLoading] = useState(true);
  
  // Données centralisées
  const [projets, setProjets] = useState([]);
  const [trouvailles, setTrouvailles] = useState([]);
  const [raids, setRaids] = useState([]);
  const [guides, setGuides] = useState([]);

  // États de saisie - Onglet Chantiers (Nouveau Système Structuré)
  const [newProjetName, setNewProjetName] = useState('');
  const [newProjetDesc, setNewProjetDesc] = useState('');
  const [expandedProjet, setExpandedProjet] = useState(null);
  const [resName, setResName] = useState('');
  const [resMax, setResMax] = useState(64);

  // Formulaires secondaires (Coffres, Raids, Guides)
  const [lieuNom, setLieuNom] = useState('');
  const [coordX, setCoordX] = useState(''); const [coordY, setCoordY] = useState(''); const [coordZ, setCoordZ] = useState('');
  const [itemName, setItemName] = useState(''); const [itemRarity, setItemRarity] = useState('Epic'); const [itemLocation, setItemLocation] = useState('');
  const [newRaidName, setNewRaidName] = useState(''); const [newRaidDate, setNewRaidDate] = useState('');
  const [guideTitle, setGuideTitle] = useState(''); const [guideUrl, setGuideUrl] = useState('');

  // Récupération globale initiale
  useEffect(() => {
    async function loadData() {
      if (!isRegistered) return;
      setLoading(true);
      try {
        // Chargement et formatage des projets
        const { data: cData } = await supabase.from('projets_state').select('*');
        if (cData) {
          const formatted = cData.map(item => {
            let itemsList = [];
            try {
              if (item.category && item.category.startsWith('[{')) {
                itemsList = JSON.parse(item.category);
              }
            } catch (e) { itemsList = []; }

            return {
              id: item.id,
              name: item.name,
              desc: item.by && !item.by.includes('_') ? item.by : "Aucune description",
              status: item.current === 999 ? 'Terminé' : 'En Cours',
              resources: itemsList,
              createdBy: item.by || 'Inconnu'
            };
          });
          setProjets(formatted);
        }

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
     LOGIQUE EXCLUSIVE : SYSTÈME PROJETS/CHANTIERS
     ========================================== */
  const syncProjetToCloud = async (updatedProjet) => {
    await supabase.from('projets_state').update({
      name: updatedProjet.name,
      category: JSON.stringify(updatedProjet.resources),
      current: updatedProjet.status === 'Terminé' ? 999 : 0,
      by: updatedProjet.desc
    }).eq('id', updatedProjet.id);
  };

  const handleCreateProjet = async (e) => {
    e.preventDefault();
    if (!newProjetName.trim()) return;

    const tempId = Date.now();
    const newProjObj = {
      id: tempId,
      name: newProjetName.trim(),
      desc: newProjetDesc.trim() || "Pas de description",
      status: "En Cours",
      resources: [],
      createdBy: userPseudo
    };

    setProjets(prev => [newProjObj, ...prev]);
    setExpandedProjet(tempId);
    setNewProjetName('');
    setNewProjetDesc('');

    const { data } = await supabase.from('projets_state').insert([{
      name: newProjObj.name,
      category: JSON.stringify([]),
      current: 0,
      max: 100,
      by: newProjObj.desc
    }]).select();

    if (data && data[0]) {
      setProjets(prev => prev.map(p => p.id === tempId ? { ...p, id: data[0].id } : p));
      setExpandedProjet(data[0].id);
    }
  };

  const handleAddResource = (projetId, name, maxQty) => {
    if (!name.trim()) return;

    setProjets(prev => prev.map(p => {
      if (p.id === projetId) {
        const newRes = {
          id: Date.now() + Math.random(),
          name: name.trim(),
          current: 0,
          max: parseInt(maxQty) || 64
        };
        const updated = { ...p, resources: [...p.resources, newRes] };
        syncProjetToCloud(updated);
        return updated;
      }
      return p;
    }));
    setResName('');
  };

  const handleUpdateResQty = (projetId, resId, delta) => {
    setProjets(prev => prev.map(p => {
      if (p.id === projetId) {
        const updatedResources = p.resources.map(r => {
          if (r.id === resId) {
            let newVal = r.current + delta;
            if (newVal > r.max) newVal = r.max;
            if (newVal < 0) newVal = 0;
            return { ...r, current: newVal };
          }
          return r;
        });
        const updated = { ...p, resources: updatedResources };
        syncProjetToCloud(updated);
        return updated;
      }
      return p;
    }));
  };

  const handleDeleteResource = (projetId, resId) => {
    setProjets(prev => prev.map(p => {
      if (p.id === projetId) {
        const updated = { ...p, resources: p.resources.filter(r => r.id !== resId) };
        syncProjetToCloud(updated);
        return updated;
      }
      return p;
    }));
  };

  const handleToggleProjetStatus = (projetId) => {
    setProjets(prev => prev.map(p => {
      if (p.id === projetId) {
        const nextStatus = p.status === 'Terminé' ? 'En Cours' : 'Terminé';
        const updated = { ...p, status: nextStatus };
        syncProjetToCloud(updated);
        return updated;
      }
      return p;
    }));
  };

  const handleDeleteProjet = async (projetId) => {
    if(!confirm("Supprimer définitivement ce chantier et toutes ses ressources ?")) return;
    setProjets(prev => prev.filter(p => p.id !== projetId));
    await supabase.from('projets_state').delete().eq('id', projetId);
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

  const doubleChestSlots = Array.from({ length: 54 }, (_, i) => trouvailles[i] || null);

  // ÉCRAN INITIAL DE REQUÊTE PSEUDO (LA TAVERNE)
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

  return (
    <div className="min-h-screen bg-[#090605] text-stone-300 font-sans antialiased">
      
      {/* HEADER DE LA GUILDE */}
      <header className="bg-[#120d0a] border-b border-[#291b12] px-4 lg:px-8 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Hammer className="text-[#e58219] w-6 h-6" />
            <div>
              <h1 className="text-sm font-black text-stone-100 uppercase tracking-wider font-serif">Arcane Frontier — Panel de Guilde</h1>
              <p className="text-[10px] text-stone-500 font-mono font-bold uppercase tracking-widest">Base de données globale en direct</p>
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

      {/* NAVIGATION INTERNE (4 ONGLETS) */}
      <div className="bg-[#120d0a] border-b border-[#291b12]/60 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex space-x-1 py-1">
          {[
            { id: 'chantiers', label: 'Chantiers & Projets', icon: Hammer },
            { id: 'coffres', label: 'Double Coffre Commun', icon: Scroll },
            { id: 'raids', label: 'Raids & Boss', icon: Shield },
            { id: 'guides', label: 'Bibliothèque', icon: Trophy },
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${isSelected ? 'bg-[#e58219] text-stone-950 font-black' : 'text-stone-500 hover:text-stone-300 hover:bg-[#1a130f]'}`}>
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RENDER PRINCIPAL DE L'ONGLET ACTIF */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {loading ? (
          <div className="text-center py-24 text-xs font-mono text-[#e58219] uppercase tracking-widest flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Synchronisation magique des tables de guilde...
          </div>
        ) : (
          <>
            {/* ONGLET 1 : CHANTIERS PARFAITS (HIÉRARCHIQUES) */}
            {activeTab === 'chantiers' && (
              <div className="space-y-6 animate-fadeIn">
                
                <form onSubmit={handleCreateProjet} className="bg-[#120d0a] border border-[#352318] rounded-xl p-4 shadow-lg space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#e58219] font-serif">
                    <FolderPlus className="w-4 h-4" /> Ouvrir un nouveau chantier de construction majeur
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input type="text" value={newProjetName} onChange={e => setNewProjetName(e.target.value)} placeholder="Nom du chantier (Ex: Gare Centrale, Tour des Mages...)" className="flex-1 bg-[#070504] border border-[#3c291d] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#e58219]" required />
                    <input type="text" value={newProjetDesc} onChange={e => setNewProjetDesc(e.target.value)} placeholder="Description ou objectif de zone..." className="sm:w-1/3 bg-[#070504] border border-[#3c291d] rounded-lg p-2 text-xs text-white focus:outline-none" />
                    <button type="submit" className="bg-[#e58219] hover:bg-[#c97213] text-stone-950 font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider transition-colors">Créer le Projet</button>
                  </div>
                </form>

                <div className="space-y-4">
                  {projets.length === 0 ? (
                    <div className="text-center py-12 bg-[#120d0a] rounded-xl border border-dashed border-stone-800 text-stone-600 font-serif italic text-xs">Aucun projet de construction planifié. Créez-en un ci-dessus !</div>
                  ) : (
                    projets.map((p) => {
                      const isExpanded = expandedProjet === p.id;
                      const isFinished = p.status === 'Terminé';

                      return (
                        <div key={p.id} className={`bg-[#120d0a] border rounded-xl overflow-hidden shadow-md transition-all ${isFinished ? 'border-emerald-950/60 opacity-80' : 'border-[#2a1d14]'}`}>
                          
                          <div className="p-4 bg-[#18110d] flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none" onClick={() => setExpandedProjet(isExpanded ? null : p.id)}>
                            <div className="flex items-center gap-3">
                              <div onClick={(e) => { e.stopPropagation(); handleToggleProjetStatus(p.id); }} className={`p-1 rounded-full border transition-colors ${isFinished ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400' : 'bg-stone-950 border-stone-700 text-stone-500 hover:text-amber-500'}`} title={isFinished ? "Remettre en cours" : "Marquer comme construit/fini"}>
                                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                              </div>
                              <div>
                                <h3 className={`font-serif font-bold text-sm tracking-wide flex items-center gap-2 ${isFinished ? 'text-emerald-400 line-through' : 'text-stone-100'}`}>
                                  {p.name}
                                  {isFinished && <span className="bg-emerald-500/10 text-emerald-400 font-sans text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/20 uppercase tracking-widest">Construit ✅</span>}
                                </h3>
                                <p className="text-[11px] text-stone-500">{p.desc}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                              <button onClick={() => handleDeleteProjet(p.id)} className="text-stone-600 hover:text-red-400 p-1.5 rounded transition-colors" title="Supprimer tout le projet">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <div onClick={() => setExpandedProjet(isExpanded ? null : p.id)} className="text-stone-500 hover:text-stone-300 p-1 bg-[#0c0806] rounded border border-stone-800">
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </div>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="p-4 border-t border-[#231810] bg-[#0d0907] space-y-4">
                              {!isFinished && (
                                <div className="bg-[#120d0a] border border-[#2b1c12] p-3 rounded-lg space-y-3">
                                  <div className="text-[10px] font-bold font-mono uppercase text-stone-500 tracking-wider flex items-center gap-1">
                                    <Package className="w-3 h-3 text-[#e58219]" /> Raccourcis d'ajout rapide de ressources pour ce projet :
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {QUICK_MATERIALS.map((mat, idx) => (
                                      <button key={idx} onClick={() => handleAddResource(p.id, mat.name, mat.max)} className="bg-[#070504] hover:bg-[#1a120e] text-stone-300 text-[11px] px-2 py-1 rounded border border-[#312015] font-medium transition-all">
                                        + {mat.name} ({mat.max})
                                      </button>
                                    ))}
                                  </div>
                                  <div className="pt-2 border-t border-[#1f140d] flex items-center gap-2 text-xs">
                                    <input type="text" value={resName} onChange={e => setResName(e.target.value)} placeholder="Autre matériau spécifique..." className="flex-1 bg-[#070504] border border-[#312015] rounded p-1.5 text-white focus:outline-none" />
                                    <div className="flex items-center gap-1 text-stone-500">
                                      <span>Qté:</span>
                                      <input type="number" value={resMax} onChange={e => setResMax(e.target.value)} className="w-14 bg-[#070504] border border-[#312015] rounded p-1.5 text-center text-white" />
                                    </div>
                                    <button type="button" onClick={() => handleAddResource(p.id, resName, resMax)} className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-3 py-1.5 rounded text-[11px] uppercase tracking-wide">Ajouter</button>
                                  </div>
                                </div>
                              )}

                              <div className="space-y-2">
                                <span className="text-[10px] uppercase font-bold text-stone-500 font-mono tracking-wider">Matériaux requis ({p.resources.length}) :</span>
                                {p.resources.length === 0 ? (
                                  <p className="text-[11px] text-stone-600 italic pl-1">Aucune ressource assignée à ce chantier pour le moment.</p>
                                ) : (
                                  <div className="space-y-2 divide-y divide-[#1e130c]/40">
                                    {p.resources.map((r) => {
                                      const pct = Math.min(Math.round((r.current / r.max) * 100), 100);
                                      const rDone = r.current >= r.max;

                                      return (
                                        <div key={r.id} className="pt-2 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                          <div className="sm:w-1/4">
                                            <span className={`font-medium ${rDone ? 'text-emerald-500 line-through' : 'text-stone-300'}`}>{r.name}</span>
                                          </div>
                                          <div className="flex-1 space-y-0.5">
                                            <div className="flex justify-between text-[10px] font-mono font-bold text-stone-500">
                                              <span>{pct}% complété</span>
                                              <span className="text-stone-400">{r.current} / {r.max}</span>
                                            </div>
                                            <div className="w-full bg-[#070504] h-1.5 rounded-full border border-[#21160e]">
                                              <div className={`h-full rounded-full transition-all ${rDone ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${pct}%` }}></div>
                                            </div>
                                          </div>

                                          {!isFinished && (
                                            <div className="flex items-center gap-1.5 font-mono justify-end">
                                              <div className="bg-[#070504] border border-[#21160e] rounded p-0.5 flex items-center">
                                                <button onClick={() => handleUpdateResQty(p.id, r.id, -10)} className="px-1 py-0.2 text-[9px] text-stone-500 hover:text-stone-200">-10</button>
                                                <button onClick={() => handleUpdateResQty(p.id, r.id, -1)} className="px-1.5 py-0.2 text-[11px] text-stone-500 hover:text-stone-200">-</button>
                                                <button onClick={() => handleUpdateResQty(p.id, r.id, 1)} className="px-1.5 py-0.2 text-[11px] text-stone-500 hover:text-stone-200">+</button>
                                                <button onClick={() => handleUpdateResQty(p.id, r.id, 10)} className="px-1 py-0.2 text-[9px] text-stone-500 hover:text-stone-200">+10</button>
                                              </div>
                                              <button onClick={() => handleUpdateResQty(p.id, r.id, r.max)} className="p-1 text-emerald-500 bg-emerald-950/40 rounded hover:bg-emerald-900 transition-colors"><Check className="w-3 h-3" /></button>
                                              <button onClick={() => handleDeleteResource(p.id, r.id)} className="p-1 text-stone-700 hover:text-red-400 rounded transition-colors"><Trash2 className="w-3 h-3" /></button>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* ONGLET 2 : DOUBLE COFFRE COMMUN */}
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
                    <span>🧰 Vue Double Coffre Commun (Synchro Cloud)</span>
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

            {/* ONGLET 3 : RAIDS & BOSS */}
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
