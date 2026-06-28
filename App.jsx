import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Beer, Hammer, Plus, Minus, Trash2, Check, Sparkles, 
  ChevronDown, ChevronUp, Package, FolderPlus, CheckCircle2, Clock
} from 'lucide-react';

// Configuration d'accès Supabase
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
  const [isRegistered, setIsRegistered] = useState(() => localStorage.getItem('taverne_registered') === 'true');
  const [userPseudo, setUserPseudo] = useState(() => localStorage.getItem('taverne_pseudo') || '');
  const [loading, setLoading] = useState(true);
  
  // Liste des projets/chantiers majeurs
  const [projets, setProjets] = useState([]);
  
  // États de saisie
  const [newProjetName, setNewProjetName] = useState('');
  const [newProjetDesc, setNewProjetDesc] = useState('');
  const [expandedProjet, setExpandedProjet] = useState(null);

  // Formulaire d'ajout de ressource pour un projet spécifique
  const [resName, setResName] = useState('');
  const [resMax, setResMax] = useState(64);

  // Chargement des données
  useEffect(() => {
    async function loadProjets() {
      if (!isRegistered) return;
      setLoading(true);
      try {
        // Lecture de la table projets_state
        const { data } = await supabase.from('projets_state').select('*');
        if (data) {
          // On reconstruit l'arbre : chaque ligne Supabase qui possède un format spécial ou standard
          // Pour être 100% compatible avec ta structure sans planter, on décode les projets.
          const formatted = data.map(item => {
            let itemsList = [];
            try {
              // Si on a stocké les ressources dans le champ description/category au format JSON
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
      } catch (err) {
        console.error("Erreur de récupération :", err);
      }
      setLoading(false);
    }
    loadProjets();
  }, [isRegistered]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const clean = userPseudo.trim();
    if (!clean) return;
    localStorage.setItem('taverne_registered', 'true');
    localStorage.setItem('taverne_pseudo', clean);
    setIsRegistered(true);
  };

  // 1. CRÉER UN NOUVEAU CHANTIER GLOBAL
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

    // UI Optimiste
    setProjets(prev => [newProjObj, ...prev]);
    setExpandedProjet(tempId);
    setNewProjetName('');
    setNewProjetDesc('');

    // Sauvegarde Supabase (on détourne 'category' pour stocker les ressources en JSON textuel)
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

  // Sychronisation globale d'un projet vers Supabase
  const syncProjetToCloud = async (updatedProjet) => {
    await supabase.from('projets_state').update({
      name: updatedProjet.name,
      category: JSON.stringify(updatedProjet.resources),
      current: updatedProjet.status === 'Terminé' ? 999 : 0,
      by: updatedProjet.desc
    }).eq('id', updatedProjet.id);
  };

  // 2. AJOUTER UNE RESSOURCE À UN CHANTIER
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

  // 3. AJUSTER QUANTITÉ D'UNE RESSOURCE
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

  // 4. SUPPRIMER UNE RESSOURCE D'UN CHANTIER
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

  // 5. PASSER LE PROJET EN "FINISH / CONSTRUIT"
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

  // 6. SUPPRIMER UN PROJET ENTIER
  const handleDeleteProjet = async (projetId) => {
    if(!confirm("Supprimer définitivement ce chantier et toutes ses ressources ?")) return;
    setProjets(prev => prev.filter(p => p.id !== projetId));
    await supabase.from('projets_state').delete().eq('id', projetId);
  };

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-[#0c0806] text-[#e3d5c8] flex flex-col items-center justify-center p-4">
        <div className="bg-[#160f0c] p-8 rounded-xl border border-[#3c291e] text-center max-w-md w-full space-y-4">
          <Beer className="w-10 h-10 text-[#e58219] mx-auto" />
          <h2 className="text-xl font-serif font-bold text-white uppercase">Chantiers de la Guilde</h2>
          <form onSubmit={handleRegister} className="space-y-3">
            <input type="text" value={userPseudo} onChange={e => setUserPseudo(e.target.value)} placeholder="Votre pseudo Minecraft" className="w-full bg-[#070504] border border-[#443024] rounded-lg p-2.5 text-center text-sm text-white focus:outline-none" required />
            <button type="submit" className="w-full bg-[#e58219] text-stone-950 font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider">Entrer</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080504] text-stone-300 font-sans">
      {/* BARRE HAUTE */}
      <header className="bg-[#120d0a] border-b border-[#2a1d14] p-4 flex justify-between items-center px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Hammer className="text-[#e58219] w-5 h-5" />
          <span className="font-serif font-black text-stone-100 uppercase tracking-wider text-xs">Arcane Frontier — Gestion des Chantiers</span>
        </div>
        <span className="bg-[#e58219]/10 text-[#e58219] border border-[#e58219]/30 px-3 py-1 rounded text-xs font-mono font-bold">👤 {userPseudo}</span>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* BLOC : CRÉER UN NOUVEAU CHANTIER GLOBAL */}
        <form onSubmit={handleCreateProjet} className="bg-[#120d0a] border border-[#352318] rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-500 font-serif">
            <FolderPlus className="w-4 h-4" /> Ouvrir un nouveau chantier de construction
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="text" value={newProjetName} onChange={e => setNewProjetName(e.target.value)} placeholder="Nom du chantier (Ex: Gare Centrale, Tour de Magie...)" className="flex-1 bg-[#070504] border border-[#3c291d] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#e58219]" required />
            <input type="text" value={newProjetDesc} onChange={e => setNewProjetDesc(e.target.value)} placeholder="Description rapide / Objectif..." className="sm:w-1/3 bg-[#070504] border border-[#3c291d] rounded-lg p-2 text-xs text-white focus:outline-none" />
            <button type="submit" className="bg-[#e58219] hover:bg-[#c97213] text-stone-950 font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider transition-colors">Créer le Projet</button>
          </div>
        </form>

        {/* LISTE DES PROJETS */}
        {loading ? (
          <div className="text-center py-12 text-xs font-mono text-stone-500 animate-pulse">Synchronisation des chantiers en cours...</div>
        ) : (
          <div className="space-y-4">
            {projets.length === 0 ? (
              <div className="text-center py-12 bg-[#120d0a] rounded-xl border border-dashed border-stone-800 text-stone-600 font-serif italic text-xs">Aucun chantier planifié. Créez-en un juste au-dessus !</div>
            ) : (
              projets.map((p) => {
                const isExpanded = expandedProjet === p.id;
                const isFinished = p.status === 'Terminé';

                return (
                  <div key={p.id} className={`bg-[#120d0a] border rounded-xl overflow-hidden shadow-md transition-all ${isFinished ? 'border-emerald-950/60 opacity-85' : 'border-[#2a1d14]'}`}>
                    
                    {/* ENTÊTE DU PROJET */}
                    <div className="p-4 bg-[#18110d] flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none" onClick={() => setExpandedProjet(isExpanded ? null : p.id)}>
                      <div className="flex items-center gap-3">
                        <div onClick={(e) => { e.stopPropagation(); handleToggleProjetStatus(p.id); }} className={`p-1 rounded-full border transition-colors ${isFinished ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400' : 'bg-stone-950 border-stone-700 text-stone-500 hover:text-amber-500'}`} title={isFinished ? "Marquer comme en cours" : "Marquer comme construit/fini"}>
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
                        {/* Bouton de Suppression du Projet */}
                        <button onClick={() => handleDeleteProjet(p.id)} className="text-stone-600 hover:text-red-400 p-1.5 rounded transition-colors" title="Supprimer tout le projet">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {/* Flèche d'ouverture */}
                        <div onClick={() => setExpandedProjet(isExpanded ? null : p.id)} className="text-stone-500 hover:text-stone-300 p-1 bg-[#0c0806] rounded border border-stone-800">
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>

                    {/* SOUS-PANEL : COMPOSANTS & MATÉRIAUX DU PROJET */}
                    {isExpanded && (
                      <div className="p-4 border-t border-[#231810] bg-[#0d0907] space-y-4 animate-fadeIn">
                        
                        {/* ZONE D'AJOUT RAPIDE D'UNE RESSOURCE */}
                        {!isFinished && (
                          <div className="bg-[#120d0a] border border-[#2b1c12] p-3 rounded-lg space-y-3">
                            <div className="text-[10px] font-bold font-mono uppercase text-stone-500 tracking-wider flex items-center gap-1">
                              <Package className="w-3 h-3 text-amber-500" /> Raccourcis d'ajout de ressources pour ce chantier :
                            </div>
                            
                            {/* Boutons Rapides */}
                            <div className="flex flex-wrap gap-1">
                              {QUICK_MATERIALS.map((mat, idx) => (
                                <button key={idx} onClick={() => handleAddResource(p.id, mat.name, mat.max)} className="bg-[#070504] hover:bg-[#1a120e] text-stone-300 text-[11px] px-2 py-1 rounded border border-[#312015] font-medium transition-all">
                                  + {mat.name} ({mat.max})
                                </button>
                              ))}
                            </div>

                            {/* Formulaire ressource sur-mesure */}
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

                        {/* LISTE DES RESSOURCES REQUISES */}
                        <div className="space-y-2">
                          <div className="text-[10px] uppercase font-bold text-stone-500 font-mono tracking-wider">
                            Matériaux requis ({p.resources.length}) :
                          </div>

                          {p.resources.length === 0 ? (
                            <p className="text-[11px] text-stone-600 italic pl-1">Aucune ressource assignée à ce chantier pour le moment.</p>
                          ) : (
                            <div className="space-y-2 divide-y divide-[#1e130c]/40">
                              {p.resources.map((r) => {
                                const pct = Math.min(Math.round((r.current / r.max) * 100), 100);
                                const rDone = r.current >= r.max;

                                return (
                                  <div key={r.id} className="pt-2 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                    {/* Infos de la ressource */}
                                    <div className="sm:w-1/4">
                                      <span className={`font-medium ${rDone ? 'text-emerald-500 line-through' : 'text-stone-300'}`}>{r.name}</span>
                                    </div>

                                    {/* Jauge de la ressource */}
                                    <div className="flex-1 space-y-0.5">
                                      <div className="flex justify-between text-[10px] font-mono font-bold text-stone-500">
                                        <span>{pct}% complété</span>
                                        <span className="text-stone-400">{r.current} / {r.max}</span>
                                      </div>
                                      <div className="w-full bg-[#070504] h-1.5 rounded-full border border-[#21160e]">
                                        <div className={`h-full rounded-full transition-all ${rDone ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${pct}%` }}></div>
                                      </div>
                                    </div>

                                    {/* Actions +/- */}
                                    {!isFinished && (
                                      <div className="flex items-center gap-1.5 font-mono justify-end">
                                        <div className="bg-[#070504] border border-[#21160e] rounded p-0.5 flex items-center">
                                          <button onClick={() => handleUpdateResQty(p.id, r.id, -10)} className="px-1 py-0.2 text-[9px] text-stone-500 hover:text-stone-200">-10</button>
                                          <button onClick={() => handleUpdateResQty(p.id, r.id, -1)} className="px-1.5 py-0.2 text-[11px] text-stone-500 hover:text-stone-200">-</button>
                                          <button onClick={() => handleUpdateResQty(p.id, r.id, 1)} className="px-1.5 py-0.2 text-[11px] text-stone-500 hover:text-stone-200">+</button>
                                          <button onClick={() => handleUpdateResQty(p.id, r.id, 10)} className="px-1 py-0.2 text-[9px] text-stone-500 hover:text-stone-200">+10</button>
                                        </div>
                                        <button onClick={() => handleUpdateResQty(p.id, r.id, r.max)} className="p-1 text-emerald-500 bg-emerald-950/40 rounded hover:bg-emerald-900 transition-colors" title="Remplir au max"><Check className="w-3 h-3" /></button>
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
        )}

      </main>
    </div>
  );
}
