import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Beer, Hammer, Scroll, Shield, Trophy, 
  Plus, Minus, Trash2, Check, Sparkles, 
  MapPin, Package, RefreshCw, ChevronRight,
  ChevronDown, ChevronUp, FolderPlus, CheckCircle2
} from 'lucide-react';

// ==========================================
// CONFIGURATION DE LA CONNEXION CLOUD (SUPABASE)
// ==========================================
const SUPABASE_URL = "https://pdndmtktluaggvupgsej.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_I_zL7n0t8G-BO4jFUr4FBA_qpLWH90B";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// LISTE DES RACCOURCIS MATÉRIAUX (BOUTONS RAPIDES)
// ==========================================
const QUICK_MATERIALS = [
  { name: "Plaques d'Acier", max: 64 },
  { name: "Tuyaux en Fluide", max: 32 },
  { name: "Source Gems", max: 64 },
  { name: "Source Jars", max: 16 },
  { name: "Blocs d'Andésite", max: 128 },
  { name: "Obsidienne", max: 64 }
];

export default function App() {
  // ==========================================
  // ÉTATS DE CONNEXION / SÉCURITÉ / NAVIGATION
  // ==========================================
  const [isRegistered, setIsRegistered] = useState(false);
  const [userPseudo, setUserPseudo] = useState(() => localStorage.getItem('taverne_pseudo') || '');
  const [activeTab, setActiveTab] = useState('chantiers');
  const [loading, setLoading] = useState(true);
  
  // ==========================================
  // STOCKS DE DONNÉES SYNCHRONISÉES (TABLES)
  // ==========================================
  const [projets, setProjets] = useState([]);
  const [trouvailles, setTrouvailles] = useState([]);
  const [raids, setRaids] = useState([]);
  const [guides, setGuides] = useState([]);

  // ==========================================
  // ÉTATS DES FORMULAIRES (SAISIES UTILISATEUR)
  // ==========================================
  // Onglet 1 : Chantiers
  const [newProjetName, setNewProjetName] = useState('');
  const [newProjetDesc, setNewProjetDesc] = useState('');
  const [expandedProjet, setExpandedProjet] = useState(null);
  const [resName, setResName] = useState('');
  const [resMax, setResMax] = useState(64);

  // Onglet 2 : Coffres & Structures
  const [lieuNom, setLieuNom] = useState('');
  const [coordX, setCoordX] = useState(''); 
  const [coordY, setCoordY] = useState(''); 
  const [coordZ, setCoordZ] = useState('');
  const [itemName, setItemName] = useState(''); 
  const [itemRarity, setItemRarity] = useState('Epic'); 
  const [itemLocation, setItemLocation] = useState('');

  // Onglet 3 : Raids
  const [newRaidName, setNewRaidName] = useState(''); 
  const [newRaidDate, setNewRaidDate] = useState('');

  // Onglet 4 : Guides
  const [guideTitle, setGuideTitle] = useState(''); 
  const [guideUrl, setGuideUrl] = useState('');

  // ==========================================
  // CHARGEMENT GLOBAL DES TABLES DEPUIS LE CLOUD
  // ==========================================
  async function loadData() {
    setLoading(true);
    try {
      // 1. Récupération des projets de construction
      const { data: cData, error: cErr } = await supabase
        .from('projets_state')
        .select('*')
        .order('id', { ascending: false });
        
      if (cErr) console.error("Erreur Table Projets:", cErr);
      
      if (cData) {
        const formatted = cData.map(item => {
          let itemsList = [];
          try {
            if (item.category && item.category.startsWith('[{')) {
              itemsList = JSON.parse(item.category);
            }
          } catch (e) { 
            itemsList = []; 
          }

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

      // 2. Récupération du Double Coffre Commun / Trouver
      const { data: tData } = await supabase.from('trouvailles').select('*');
      if (tData) setTrouvailles(tData);

      // 3. Récupération des Raids programmés
      const { data: rData } = await supabase.from('raids').select('*');
      if (rData) setRaids(rData);

      // 4. Récupération de la bibliothèque de Guides
      const { data: gData } = await supabase.from('guides').select('*');
      if (gData) setGuides(gData);

    } catch (err) {
      console.error("Erreur critique de synchronisation database :", err);
    }
    setLoading(false);
  }

  // Déclencheur automatique dès que le pseudo est validé
  useEffect(() => {
    if (isRegistered) {
      loadData();
    }
  }, [isRegistered]);

  // ==========================================
  // GESTION DU SYSTÈME DE COMPTE ET TAVERNE
  // ==========================================
  const handleRegister = async (e) => {
    e.preventDefault();
    const clean = userPseudo.trim();
    if (!clean) return;

    localStorage.setItem('taverne_registered', 'true');
    localStorage.setItem('taverne_pseudo', clean);
    
    // Ajout à la table des aventuriers en tâche de fond
    await supabase.from('aventuriers').insert([{ pseudo: clean }], { ignoreDuplicates: true });
    setIsRegistered(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsRegistered(false);
    setUserPseudo('');
  };

  // ==========================================
  // INTERACTION DIRECTE TABLE : PROJETS_STATE
  // ==========================================
  
  // Envoi des modifications d'un projet existant vers Supabase
  const syncProjetToCloud = async (updatedProjet) => {
    try {
      await supabase.from('projets_state').update({
        name: updatedProjet.name,
        category: JSON.stringify(updatedProjet.resources),
        current: updatedProjet.status === 'Terminé' ? 999 : 0,
        max: 100, 
        by: updatedProjet.desc
      }).eq('id', updatedProjet.id);
    } catch (err) {
      console.error("Échec de la mise à jour cloud du projet :", err);
    }
  };

  // Action : Créer un nouveau projet vierge
  const handleCreateProjet = async (e) => {
    e.preventDefault();
    if (!newProjetName.trim()) return;

    const descText = newProjetDesc.trim() || "Pas de description";
    const nameText = newProjetName.trim();

    // Envoi sécurisé à Supabase
    const { data, error } = await supabase.from('projets_state').insert([{
      name: nameText,
      category: JSON.stringify([]), 
      current: 0,
      max: 100,
      by: descText
    }]).select();

    if (error) {
      console.error("Erreur de création Supabase :", error);
      alert("Erreur de liaison Cloud : le projet n'a pas pu s'enregistrer.");
      return;
    }

    if (data && data[0]) {
      const createdProj = {
        id: data[0].id,
        name: data[0].name,
        desc: data[0].by,
        status: "En Cours",
        resources: [],
        createdBy: userPseudo
      };
      
      setProjets(prev => [createdProj, ...prev]);
      setExpandedProjet(data[0].id);
      setNewProjetName('');
      setNewProjetDesc('');
    }
  };

  // Action : Ajouter un matériau requis dans un chantier
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

  // Action : Ajuster la quantité récoltée (+1, -1, +10, -10)
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

  // Action : Enlever un matériau d'un projet
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

  // Action : Basculer un projet entre "En cours" et "Terminé (Construit)"
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

  // Action : Supprimer définitivement un chantier
  const handleDeleteProjet = async (projetId) => {
    if(!confirm("Supprimer définitivement ce chantier et toutes ses ressources ?")) return;
    setProjets(prev => prev.filter(p => p.id !== projetId));
    await supabase.from('projets_state').delete().eq('id', projetId);
  };

  // ==========================================
  // INTERACTION DIRECTE TABLE : TROUVAILLES (COFFRES)
  // ==========================================
  const handleAddTrouvaille = async (e) => {
    e.preventDefault();
    if (!lieuNom.trim()) return;
    const newLieu = { id: Date.now(), type: 'lieu', name: lieuNom, coords: `X: ${coordX||'?'} | Y: ${coordY||'?'} | Z: ${coordZ||'?'}`, by: userPseudo, rarity: 'Structure' };
    setTrouvailles(p => [...p, newLieu]); 
    setLieuNom(''); setCoordX(''); setCoordY(''); setCoordZ('');
    await supabase.from('trouvailles').insert([newLieu]);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    const newItem = { id: Date.now(), type: 'item', name: itemName, coords: itemLocation ? `Rangement: ${itemLocation}` : 'Loot Aléatoire', by: userPseudo, rarity: itemRarity };
    setTrouvailles(p => [...p, newItem]); 
    setItemName(''); setItemLocation('');
    await supabase.from('trouvailles').insert([newItem]);
  };

  const handleDeleteTrouvaille = async (id) => {
    setTrouvailles(p => p.filter(x => x.id !== id));
    await supabase.from('trouvailles').delete().eq('id', id);
  };

  // ==========================================
  // INTERACTION DIRECTE TABLE : RAIDS & BOSS
  // ==========================================
  const handleAddRaid = async (e) => {
    e.preventDefault();
    if (!newRaidName.trim()) return;
    const newRaid = { id: Date.now(), name: newRaidName, date: newRaidDate || 'À définir', status: 'En préparation' };
    setRaids(p => [...p, newRaid]); 
    setNewRaidName(''); setNewRaidDate('');
    await supabase.from('raids').insert([newRaid]);
  };

  const handleDeleteRaid = async (id) => {
    setRaids(p => p.filter(x => x.id !== id));
    await supabase.from('raids').delete().eq('id', id);
  };

  // ==========================================
  // INTERACTION DIRECTE TABLE : GUIDES (BIBLIOTHÈQUE)
  // ==========================================
  const handleAddGuide = async (e) => {
    e.preventDefault();
    if (!guideTitle.trim() || !guideUrl.trim()) return;
    const newGuide = { id: Date.now(), title: guideTitle, url: guideUrl, by: userPseudo };
    setGuides(p => [...p, newGuide]); 
    setGuideTitle(''); setGuideUrl('');
    await supabase.from('guides').insert([newGuide]);
  };

  const handleDeleteGuide = async (id) => {
    setGuides(p => p.filter(x => x.id !== id));
    await supabase.from('guides').delete().eq('id', id);
  };

  // Génération de la grille virtuelle fixe à 54 slots (Format Double Coffre Minecraft)
  const doubleChestSlots = Array.from({ length: 54 }, (_, i) => trouvailles[i] || null);

  // ==========================================
  // RENDU VISUEL INTERFACE D'IDENTIFICATION (TAVERNE)
  // ==========================================
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

  // ==========================================
  // RENDU VISUEL DU PANEL PRINCIPAL DE LA GUILDE
  // ==========================================
  return (
    <div className="min-h-screen bg-[#090605] text-stone-300 font-sans antialiased">
      
      {/* SECTION HAUTE : HEADER GLOBAL */}
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

      {/* SECTION CENTRE : MENU DES ONGLETS */}
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

      {/* SECTION BASSE : AFFICHAGE DU CONTENU DYNAMIQUE */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {loading ? (
          <div className="text-center py-24 text-xs font-mono text-[#e58219] uppercase tracking-widest flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Synchronisation magique des tables de guilde...
          </div>
        ) : (
          <>
            {/* CONTENU ONGLET 1 : CHANTIERS & SUIVI DES MATÉRIAUX */}
            {activeTab === 'chantiers' && (
              <div className="space-y-6">
                
                {/* Formulaire de création de chantier */}
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

                {/* Listing interactif des chantiers */}
                <div className="space-y-4">
                  {projets.length === 0 ? (
                    <div className="text-center py-12 bg-[#120d0a] rounded-xl border border-dashed border-stone-800 text-stone-600 font-serif italic text-xs">Aucun projet de construction planifié. Créez-en un ci-dessus !</div>
                  ) : (
                    projets.map((p) => {
                      const isExpanded = expandedProjet === p.id;
                      const isFinished = p.status === 'Terminé';

                      return (
                        <div key={p.id} className={`bg-[#120d0a] border rounded-xl overflow-hidden shadow-md transition-all ${isFinished ? 'border-emerald-950/60 opacity-80' : 'border-[#2a1d14]'}`}>
                          
                          {/* Barre d'en-tête cliquable du projet */}
                          <div className="p-4 bg-[#18110d] flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none" onClick={() => setExpandedProjet(isExpanded ? null : p.id)}>
                            <div className="flex items-center gap-3">
                              <div onClick={(e) => { e.stopPropagation(); handleToggleProjetStatus(p.id); }} className={`p-1 rounded-full border transition-colors ${isFinished ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400' : 'bg-stone-950 border-stone-700 text-stone-500 hover:text-amber-500'}`} title={isFinished ? "Remettre en cours" : "Marquer comme construit"}>
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
                              <button onClick={() => handleDeleteProjet(p.id)} className="text-stone-600 hover:text-red-400 p-1.5 rounded transition-colors" title="Supprimer le projet">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <div className="text-stone-500 p-1 bg-[#0c0806] rounded border border-stone-800">
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </div>
                            </div>
                          </div>

                          {/* Tiroir d'administration des ressources internes */}
                          {isExpanded && (
                            <div className="p-4 border-t border-[#231810] bg-[#0d0907] space-y-4">
                              {!isFinished && (
                                <div className="bg-[#120d0a] border border-[#2b1c12] p-3 rounded-lg space-y-3">
                                  <div className="text-[10px] font-bold font-mono uppercase text-stone-500 tracking-wider flex items-center gap-1">
                                    <Package className="w-3 h-3 text-[#e58219]" /> Raccourcis d'ajout de ressources :
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {QUICK_MATERIALS.map((mat, idx) => (
                                      <button key={idx} onClick={() => handleAddResource(p.id, mat.name, mat.max)} className="bg-[#070504] hover:bg-[#1a120e] text-stone-300 text-[11px] px-2 py-1 rounded border border-[#312015] font-medium transition-all">
                                        + {mat.name} ({mat.max})
                                      </button>
                                    ))}
                                  </div>
                                  <div className="pt-2 border-t border-[#1f140d] flex items-center gap-2 text-xs">
                                    <input type="text" value={resName} onChange={e => setResName(e.target.value)} placeholder="Matériau spécifique personnalisé..." className="flex-1 bg-[#070504] border border-[#312015] rounded p-1.5 text-white focus:outline-none" />
                                    <div className="flex items-center gap-1 text-stone-500">
                                      <span>Qté:</span>
                                      <input type="number" value={resMax} onChange={e => setResMax(e.target.value)} className="w-14 bg-[#070504] border border-[#312015] rounded p-1.5 text-center text-white" />
                                    </div>
                                    <button type="button" onClick={() => handleAddResource(p.id, resName, resMax)} className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-3 py-1.5 rounded text-[11px] uppercase tracking-wide">Ajouter</button>
                                  </div>
                                </div>
                              )}

                              <div className="space-y-2">
                                <span className="text-[10px] uppercase font-bold text-stone-500 font-mono tracking-wider">Progression des composants requis ({p.resources.length}) :</span>
                                {p.resources.length === 0 ? (
                                  <p className="text-[11px] text-stone-600 italic pl-1">Aucun matériau configuré.</p>
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
                                              <span>{pct}% récolté</span>
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

            {/* CONTENU ONGLET 2 : DOUBLE COFFRE INTERACTIF MC */}
            {activeTab === 'coffres' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <form onSubmit={handleAddTrouvaille} className="bg-[#120d0a] border border-[#2b1c13] p-4 rounded-xl space-y-3 text-xs">
                    <h4 className="font-serif font-bold text-[#e58219] uppercase border-b border-[#241810] pb-2 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Enregistrer des coordonnées</h4>
                    <input type="text" value={lieuNom} onChange={e => setLieuNom(e.target.value)} placeholder="Ex: Monument Sous-Marin, Ruine..." className="w-full bg-[#070504] border border-[#38261c] rounded-lg p-2 text-white focus:outline-none" required />
                    <div className="grid grid-cols-3 gap-2 text-center font-mono">
                      <input type="text" value={coordX} onChange={e => setCoordX(e.target.value)} placeholder="X" className="bg-[#070504] border border-[#38261c] rounded p-2 text-white" />
                      <input type="text" value={coordY} onChange={e => setCoordY(e.target.value)} placeholder="Y" className="bg-[#070504] border border-[#38261c] rounded p-2 text-white" />
                      <input type="text" value={coordZ} onChange={e => setCoordZ(e.target.value)} placeholder="Z" className="bg-[#070504] border border-[#38261c] rounded p-2 text-white" />
                    </div>
                    <button type="submit" className="w-full bg-[#e58219] text-stone-950 font-bold py-2 rounded-lg font-serif uppercase tracking-wider">Ajouter la carte</button>
                  </form>

                  <form onSubmit={handleAddItem} className="bg-[#120d0a] border border-[#2b1c13] p-4 rounded-xl space-y-3 text-xs">
                    <h4 className="font-serif font-bold text-purple-400 uppercase border-b border-[#241810] pb-2 flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Déclarer un Butin Mythique / Item</h4>
                    <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} placeholder="Ex: Crâne de Wither, Disque..." className="w-full bg-[#070504] border border-[#38261c] rounded-lg p-2 text-white focus:outline-none" required />
                    <div className="grid grid-cols-2 gap-2">
                      <select value={itemRarity} onChange={e => setItemRarity(e.target.value)} className="bg-[#070504] border border-[#38261c] rounded-lg p-2 text-stone-200">
                        <option value="Rare">Rare 🟦</option>
                        <option value="Epic">Épique 🟪</option>
                        <option value="Legendary">Mythique 🟧</option>
                      </select>
                      <input type="text" value={itemLocation} onChange={e => setItemLocation(e.target.value)} placeholder="Emplacement ou N° de coffre" className="bg-[#070504] border border-[#38261c] rounded-lg p-2 text-white" />
                    </div>
                    <button type="submit" className="w-full bg-purple-700 text-white font-bold py-2 rounded-lg font-serif uppercase tracking-wider hover:bg-purple-600">Mettre en Coffre</button>
                  </form>
                </div>

                {/* Grille Double Coffre d'aspect rétro */}
                <div className="bg-[#bababa] border-4 border-t-[#eaeaea] border-l-[#eaeaea] border-b-[#444] border-r-[#444] p-4 rounded max-w-4xl mx-auto shadow-2xl">
                  <div className="text-[#2b2b2b] font-mono text-xs font-black uppercase mb-3 flex items-center justify-between">
                    <span>🧰 Vue Double Coffre Commun (Synchro Cloud)</span>
                  </div>
                  <div className="grid grid-cols-9 gap-1 bg-[#808080] p-1.5 border-2 border-t-[#333] border-l-[#333] border-b-[#fff] border-r-[#fff]">
                    {doubleChestSlots.map((slot, idx) => (
                      <div key={idx} className="aspect-square bg-[#8c8c8c] border-2 border-t-[#404040] border-l-[#404040] border-b-[#e0e0e0] border-r-[#e0e0e0] relative group flex items-center justify-center hover:bg-[#a1a1a1] transition-all p-1">
                        {slot ? (
                          <>
                            <span className="text-base select-none">{slot.type === 'item' ? '💎' : '🗺️'}</span>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 bg-[#130b18]/95 border border-purple-900 rounded-lg p-2.5 shadow-2xl text-[11px] font-mono min-w-[190px] text-stone-200">
                              <div className="font-bold text-amber-400">{slot.name}</div>
                              <div className="text-stone-400 mt-0.5">{slot.coords}</div>
                              <div className="text-[9px] text-stone-500 border-t border-purple-900/40 pt-1 mt-1">Trouvé par: {slot.by}</div>
                            </div>
                            <button onClick={() => handleDeleteTrouvaille(slot.id)} className="absolute -top-1 -right-1 bg-red-700 hover:bg-red-600 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white/20">✕</button>
                          </>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CONTENU ONGLET 3 : PLANIFICATION DES RAIDS */}
            {activeTab === 'raids' && (
              <div className="space-y-4 text-xs">
                <form onSubmit={handleAddRaid} className="bg-[#120d0a] border border-[#2b1c13] p-4 rounded-xl flex flex-col sm:flex-row items-end gap-3">
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Cible / Boss de Raid</label>
                    <input type="text" value={newRaidName} onChange={e => setNewRaidName(e.target.value)} placeholder="Ex: Wither, Dragon, Boss Custom..." className="w-full bg-[#070504] border border-[#38261c] rounded-lg p-2 text-white" required />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Date & Horaire de l'assaut</label>
                    <input type="text" value={newRaidDate} onChange={e => setNewRaidDate(e.target.value)} placeholder="Ex: Vendredi soir à 21h" className="w-full bg-[#070504] border border-[#38261c] rounded-lg p-2 text-white" />
                  </div>
                  <button type="submit" className="bg-[#e58219] hover:bg-[#cd7211] text-stone-950 font-serif font-bold py-2 px-5 rounded-lg uppercase tracking-wide h-9">Planifier</button>
                </form>

                <div className="bg-[#120d0a] border border-[#2b1c13] rounded-xl divide-y divide-[#241810] overflow-hidden">
                  {raids.length === 0 ? (
                    <p className="p-5 text-stone-600 italic font-serif">Aucun assaut militaire de guilde programmé pour le moment.</p>
                  ) : (
                    raids.map(r => (
                      <div key={r.id} className="p-4 flex items-center justify-between hover:bg-[#16100d] transition-colors">
                        <div>
                          <span className="font-serif font-bold text-stone-200 text-sm block">{r.name}</span>
                          <span className="text-stone-500 font-mono text-[11px]">Planification : {r.date}</span>
                        </div>
                        <button onClick={() => handleDeleteRaid(r.id)} className="text-stone-700 hover:text-red-400 p-2 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* CONTENU ONGLET 4 : BIBLIOTHÈQUE ET ARCHIVES */}
            {activeTab === 'guides' && (
              <div className="space-y-6 text-xs">
                <form onSubmit={handleAddGuide} className="bg-[#120d0a] border border-[#2b1c13] p-4 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Nom du Guide / Grimoire</label>
                    <input type="text" value={guideTitle} onChange={e => setGuideTitle(e.target.value)} placeholder="Ex: Guide Create, Wiki Forge..." className="w-full bg-[#070504] border border-[#38261c] rounded-lg p-2 text-white" required />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Lien Web complet (URL)</label>
                    <input type="url" value={guideUrl} onChange={e => setGuideUrl(e.target.value)} placeholder="https://..." className="w-full bg-[#070504] border border-[#38261c] rounded-lg p-2 text-white" required />
                  </div>
                  <button type="submit" className="bg-[#e58219] text-stone-950 font-serif font-bold py-2 rounded-lg uppercase tracking-wider">Partager</button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {guides.length === 0 ? (
                    <p className="col-span-2 text-center text-stone-600 italic font-serif py-4">La bibliothèque est vide.</p>
                  ) : (
                    guides.map((g) => (
                      <div key={g.id} className="bg-[#120d0a] border border-[#2b1c13] p-4 rounded-xl flex items-center justify-between hover:border-[#3e2a1d] transition-all">
                        <div className="space-y-1 truncate mr-2">
                          <h5 className="font-bold text-stone-200 text-sm font-serif truncate">{g.title}</h5>
                          <a href={g.url} target="_blank" rel="noreferrer" className="text-amber-500 hover:underline text-[11px] font-mono flex items-center gap-0.5 truncate">
                            <ChevronRight className="w-3 h-3 flex-shrink-0" /> Ouvrir l'archive externe
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
