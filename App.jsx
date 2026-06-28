import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Shield, Users, Trophy, Swords, Beer, Scroll, Plus, RefreshCw, Check, Minus, MapPin, Trash2, ChevronDown, ChevronUp, Package } from 'lucide-react';

const SUPABASE_URL = "https://pdndmtktluaggvupgsej.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_I_zL7n0t8G-BO4jFUr4FBA_qpLWH90B";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App() {
  const [isRegistered, setIsRegistered] = useState(() => localStorage.getItem('taverne_registered') === 'true');
  const [userPseudo, setUserPseudo] = useState(() => localStorage.getItem('taverne_pseudo') || '');
  
  const [activeTab, setActiveTab] = useState('projets');
  const [loading, setLoading] = useState(true);
  const [loginMessage, setLoginMessage] = useState('');
  
  const [trouvailles, setTrouvailles] = useState([]);
  const [guides, setGuides] = useState([]);
  const [raids, setRaids] = useState([]);
  const [chantiers, setChantiers] = useState([]); // Liste à plat des chantiers dynamiques
  const [totalInscrits, setTotalInscrits] = useState(0);

  // Formulaire d'ajout de chantier personnalisé
  const [newChantierName, setNewChantierName] = useState('');
  const [newChantierCategory, setNewChantierCategory] = useState('machinery');
  const [newChantierMax, setNewChantierMax] = useState(64);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      const { count } = await supabase.from('aventuriers').select('*', { count: 'exact', head: true });
      if (count !== null) setTotalInscrits(count);

      // Chargement des chantiers dynamiques
      const { data: projData } = await supabase.from('projets_state').select('*');
      if (projData) setChantiers(projData);

      const { data: trvData } = await supabase.from('trouvailles').select('*');
      if (trvData) setTrouvailles(trvData);

      const { data: rdData } = await supabase.from('raids').select('*');
      if (rdData) setRaids(rdData);

      const { data: gdData } = await supabase.from('guides').select('*');
      if (gdData) setGuides(gdData);

      setLoading(false);
    }
    fetchData();
  }, [isRegistered]);

  useEffect(() => {
    localStorage.setItem('taverne_registered', isRegistered);
    localStorage.setItem('taverne_pseudo', userPseudo);
  }, [isRegistered, userPseudo]);

  const [lieuNom, setLieuNom] = useState('');
  const [coordX, setCoordX] = useState('');
  const [coordY, setCoordY] = useState('');
  const [coordZ, setCoordZ] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemRarity, setItemRarity] = useState('Epic');
  const [itemLocation, setItemLocation] = useState('');
  const [guideTitle, setGuideTitle] = useState('');
  const [guideUrl, setGuideUrl] = useState('');
  const [newRaidName, setNewRaidName] = useState('');
  const [newRaidDate, setNewRaidDate] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const [expandedCategories, setExpandedCategories] = useState({ machinery: true, magic: true });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!userPseudo.trim()) return;
    await supabase.from('aventuriers').insert([{ pseudo: userPseudo.trim() }], { ignoreDuplicates: false });
    setLoginMessage(`Bienvenue, ${userPseudo} ! Ton entrée a été gravée dans la pierre.`);
    setTimeout(() => { setIsRegistered(true); }, 1500);
  };

  // AJOUTER UN NOUVEAU CHANTIER
  const handleAddChantier = async (e) => {
    e.preventDefault();
    if (!newChantierName.trim()) return;

    const newChantier = {
      category: newChantierCategory,
      name: newChantierName.trim(),
      current: 0,
      max: parseInt(newChantierMax) || 64,
      by: userPseudo
    };

    // Insertion BDD
    const { data, error } = await supabase.from('projets_state').insert([newChantier]).select();
    if (data) {
      setChantiers([...chantiers, data[0]]);
      setNewChantierName('');
    }
  };

  // SUPPRIMER UN CHANTIER
  const handleDeleteChantier = async (id) => {
    setChantiers(chantiers.filter(c => c.id !== id));
    await supabase.from('projets_state').delete().eq('id', id);
  };

  // MODIFIER QUANTITÉ
  const updateQuantity = async (id, amount, setAbsolute = false) => {
    const updatedChantiers = chantiers.map(c => {
      if (c.id === id) {
        let nextValue = setAbsolute ? amount : c.current + amount;
        if (nextValue > c.max) nextValue = c.max;
        if (nextValue < 0) nextValue = 0;
        return { ...c, current: nextValue, by: nextValue > 0 ? userPseudo : c.by };
      }
      return c;
    });
    setChantiers(updatedChantiers);

    const target = updatedChantiers.find(c => c.id === id);
    if (target) {
      await supabase.from('projets_state').update({ current: target.current, by: target.by }).eq('id', id);
    }
  };

  const handleAddTrouvaille = async (e) => {
    e.preventDefault();
    if (lieuNom.trim()) {
      const newLieu = { id: Date.now(), type: 'lieu', name: lieuNom, coords: `X: ${coordX || '?'} | Y: ${coordY || '?'} | Z: ${coordZ || '?'}`, by: userPseudo, rarity: 'Structure' };
      setTrouvailles([...trouvailles, newLieu]);
      setLieuNom(''); setCoordX(''); setCoordY(''); setCoordZ('');
      await supabase.from('trouvailles').insert([newLieu]);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (itemName.trim()) {
      const newItem = { id: Date.now(), type: 'item', name: itemName, coords: itemLocation ? `Lieu: ${itemLocation}` : 'Loot Aléatoire', by: userPseudo, rarity: itemRarity };
      setTrouvailles([...trouvailles, newItem]);
      setItemName(''); setItemLocation('');
      await supabase.from('trouvailles').insert([newItem]);
    }
  };

  const handleDeleteTrouvaille = async (id) => {
    setTrouvailles(trouvailles.filter(item => item.id !== id));
    await supabase.from('trouvailles').delete().eq('id', id);
  };

  const handleAddRaid = async (e) => {
    e.preventDefault();
    if (newRaidName.trim()) {
      const newRaid = { id: Date.now(), name: newRaidName, date: newRaidDate || 'À définir', status: 'En préparation' };
      setRaids([...raids, newRaid]);
      setNewRaidName(''); setNewRaidDate('');
      await supabase.from('raids').insert([newRaid]);
    }
  };

  const handleDeleteRaid = async (id) => {
    setRaids(raids.filter(r => r.id !== id));
    await supabase.from('raids').delete().eq('id', id);
  };

  const handleAddGuide = async (e) => {
    e.preventDefault();
    if (guideTitle.trim() && guideUrl.trim()) {
      const newGuide = { id: Date.now(), title: guideTitle, url: guideUrl, by: userPseudo };
      setGuides([...guides, newGuide]);
      setGuideTitle(''); setGuideUrl('');
      await supabase.from('guides').insert([newGuide]);
    }
  };

  const handleDeleteGuide = async (id) => {
    setGuides(guides.filter(g => g.id !== id));
    await supabase.from('guides').delete().eq('id', id);
  };

  const askExpertAI = (e) => {
    e.preventDefault();
    const query = aiQuery.toLowerCase();
    if (!query.trim()) return;
    if (query.includes('voidsent')) {
      setAiResponse("🌲 [Voidsent Forest] : Biome personnalisé de l'Overworld remplaçant le Nether et l'End.");
    } else if (query.includes('create')) {
      setAiResponse("⚙️ [Progression Create] : Bloqué tant que vous n'avez pas capturé un Blaze.");
    } else {
      setAiResponse("🔮 Grimoire : Aucune information magique trouvée pour cette requête.");
    }
  };

  const chestSlots = Array.from({ length: 54 }, (_, idx) => trouvailles[idx] || null);

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-[#18120f] text-[#d4c5b9] font-serif flex flex-col justify-between" style={{ backgroundImage: 'linear-gradient(rgba(20, 14, 10, 0.92), rgba(12, 8, 6, 0.97)), url("https://images.unsplash.com/photo-1597200381847-30ec200eeb9a?q=80&w=1200")' }}>
        <div className="text-center py-12 px-4 border-b border-[#e58219]/20 bg-[#120c09]">
          <Beer className="w-12 h-12 text-[#e58219] mx-auto mb-3" />
          <h1 className="text-3xl md:text-5xl font-black tracking-wider text-[#e58219] uppercase">La Taverne d'Arcane Frontier</h1>
          <p className="mt-2 text-stone-400 text-xs italic font-sans max-w-lg mx-auto">Chopes de bière, ragoûts chauds et légendes de serveurs. Installe-toi, voyageur.</p>
        </div>

        <div className="max-w-5xl w-full mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-sans items-start">
          <div className="md:col-span-2 bg-[#1c1410] border border-[#30221a] rounded p-6 shadow-xl">
            <h3 className="text-[#e58219] font-serif font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">📜 Le Registre des Aventuriers</h3>
            <p className="text-xs text-stone-400 mb-4">Inscris ton pseudo Minecraft ci-dessous pour annoncer ton arrivée dans la taverne.</p>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Pseudo Minecraft Exact</label>
                <input type="text" value={userPseudo} onChange={(e) => setUserPseudo(e.target.value)} placeholder="Ex: Velkhana" className="w-full bg-[#110b08] border border-[#3a2920] rounded px-3 py-2 text-stone-200 text-sm focus:outline-none focus:border-[#e58219]" required />
              </div>
              <button type="submit" className="w-full bg-[#d9720b] hover:bg-[#b85f07] text-stone-950 font-bold font-serif text-xs uppercase py-2.5 rounded tracking-widest transition-colors">S'inscrire sur le registre</button>
            </form>
            {loginMessage && <div className="mt-4 bg-[#0d1c12] border border-emerald-900/50 p-3 rounded text-xs text-emerald-400 font-medium">🛡️ {loginMessage}</div>}
          </div>
          <div className="space-y-4">
            <div className="bg-[#1c1410] border border-[#30221a] rounded p-4 text-center">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">Statut de la Taverne</span>
              <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Portes Ouvertes</span>
            </div>
            <div className="bg-[#1c1410] border border-[#30221a] rounded p-4">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block text-center mb-3">⚔️ Comptoir des Légendes</span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-[#110b08] p-2 rounded border border-[#2a1d17]"><span className="block text-xl font-bold text-[#e58219] font-mono">{totalInscrits}</span><span className="text-[9px] text-stone-500 uppercase">Inscrits</span></div>
                <div className="bg-[#110b08] p-2 rounded border border-[#2a1d17]"><span className="block text-xl font-bold text-emerald-500 font-mono">12</span><span className="text-[9px] text-stone-500 uppercase">En Ligne</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0a08] text-[#94a3b8] font-sans antialiased">
      <header className="border-b border-[#291a12] bg-[#140f0c] sticky top-0 z-50 px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Beer className="w-6 h-6 text-[#e58219]" />
            <div>
              <h1 className="text-lg font-bold tracking-wider text-stone-200 uppercase font-serif">La Taverne d'Arcane Frontier</h1>
              <p className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold font-mono">Serveur Connecté via Supabase</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-[#e58219]/10 border border-[#e58219]/30 rounded px-3 py-1 text-xs text-[#e58219] font-bold font-mono"><Users className="w-3.5 h-3.5" /> {userPseudo}</div>
            <button onClick={() => setIsRegistered(false)} className="text-xs text-stone-600 hover:text-stone-400 underline font-mono">Changer de compte</button>
          </div>
        </div>
      </header>

      <div className="bg-[#140f0c] border-b border-[#291a12]/60 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex gap-1">
          {[
            { id: 'projets', label: 'Chantiers', icon: Swords },
            { id: 'trouvailles', label: 'Double Coffre', icon: Scroll },
            { id: 'raids', label: 'Raids & Boss', icon: Shield },
            { id: 'guide', label: 'Grimoire & Aide', icon: Trophy },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-xs font-medium tracking-wide uppercase transition relative ${activeTab === tab.id ? 'text-[#e58219] font-bold' : 'text-stone-500 hover:text-stone-300'}`}>
                <Icon className="w-3.5 h-3.5" /> <span>{tab.label}</span>
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e58219]"></div>}
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-20 font-mono text-[#e58219] animate-pulse flex items-center justify-center gap-2 text-xs uppercase tracking-widest"><RefreshCw className="w-4 h-4 animate-spin" /> Synchronisation Cloud Supabase...</div>
        ) : (
          <>
            {activeTab === 'projets' && (
              <div className="space-y-6">
                {/* FORMULAIRE POUR AJOUTER UN CHANTIER DYNAMIQUE */}
                <form onSubmit={handleAddChantier} className="bg-[#140f0c] border border-[#3e2b1f] rounded p-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs items-end">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">🔨 Nom du nouveau chantier / ressource</label>
                    <input type="text" value={newChantierName} onChange={(e) => setNewChantierName(e.target.value)} placeholder="Ex: Quartz du Néant, Plaques de fer..." className="w-full bg-[#070504] border border-[#3a2920] rounded p-2 text-stone-100 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Catégorie</label>
                    <select value={newChantierCategory} onChange={(e) => setNewChantierCategory(e.target.value)} className="w-full bg-[#070504] border border-[#3a2920] rounded p-2 text-stone-300">
                      <option value="machinery">⚙️ Technologie (Create)</option>
                      <option value="magic">🔮 Magie (Ars Nouveau)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Objectif Max</label>
                    <input type="number" value={newChantierMax} onChange={(e) => setNewChantierMax(e.target.value)} className="w-full bg-[#070504] border border-[#3a2920] rounded p-2 text-stone-100" />
                  </div>
                  <button type="submit" className="md:col-span-4 bg-emerald-700 hover:bg-emerald-600 text-white font-serif font-bold py-2 rounded uppercase tracking-wider transition-colors">Créer le chantier partagé</button>
                </form>

                {/* AFFICHAGE DES SECTIONS */}
                {['machinery', 'magic'].map((cat) => (
                  <div key={cat} className="bg-[#140f0c] border border-[#2e2017] rounded overflow-hidden shadow-xl">
                    <button onClick={() => setExpandedCategories({ ...expandedCategories, [cat]: !expandedCategories[cat] })} className="w-full px-4 py-3 bg-[#1b1410] flex items-center justify-between border-b border-[#2e2017] text-stone-200 hover:bg-[#211914] transition">
                      <span className="font-serif font-bold uppercase tracking-wider text-xs text-[#e58219]">
                        {cat === 'machinery' ? '⚙️ Chantier Technologique (Create XP)' : '🔮 Progression Magique (Ars Nouveau)'}
                      </span>
                      {expandedCategories[cat] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {expandedCategories[cat] && (
                      <div className="divide-y divide-[#2e2017]/40 bg-[#0f0a08]">
                        {chantiers.filter(c => c.category === cat).length === 0 ? (
                          <p className="p-4 text-stone-600 italic text-xs">Aucun chantier dans cette catégorie. Utilisez le formulaire ci-dessus !</p>
                        ) : (
                          chantiers.filter(c => c.category === cat).map((res) => (
                            <div key={res.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-3">
                                <button onClick={() => handleDeleteChantier(res.id)} className="text-stone-700 hover:text-red-500 p-1 rounded transition-colors" title="Supprimer ce chantier"><Trash2 className="w-3.5 h-3.5" /></button>
                                <div>
                                  <span className="font-medium text-stone-300 font-serif">{res.name}</span>
                                  {res.by && <span className="text-[9px] text-amber-500 bg-amber-950/30 px-1.5 py-0.5 rounded font-mono ml-2">Modifié par {res.by}</span>}
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 justify-end font-mono">
                                <button onClick={() => updateQuantity(res.id, -10)} className="px-1.5 py-0.5 bg-[#140f0c] border border-[#302118] text-stone-400 hover:text-white rounded">-10</button>
                                <button onClick={() => updateQuantity(res.id, -1)} className="p-1 bg-[#140f0c] border border-[#302118] text-stone-400 hover:text-white rounded"><Minus className="w-3 h-3" /></button>
                                <div className="px-3 py-0.5 font-bold bg-[#070504] border border-[#2c1d15] rounded min-w-[65px] text-center text-[#e58219]">{res.current}/{res.max}</div>
                                <button onClick={() => updateQuantity(res.id, 1)} className="p-1 bg-[#140f0c] border border-[#302118] text-stone-400 hover:text-white rounded"><Plus className="w-3 h-3" /></button>
                                <button onClick={() => updateQuantity(res.id, 10)} className="px-1.5 py-0.5 bg-[#140f0c] border border-[#302118] text-stone-400 hover:text-white rounded">+10</button>
                                <button onClick={() => updateQuantity(res.id, res.max, true)} className="p-1 bg-emerald-950/80 text-emerald-400 border border-emerald-900 rounded"><Check className="w-3 h-3" /></button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'trouvailles' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <form onSubmit={handleAddTrouvaille} className="bg-[#140f0c] border border-[#2e2017] rounded p-4 space-y-2.5 text-xs">
                    <h4 className="font-serif font-bold text-[#e58219] uppercase border-b border-[#2e2017] pb-1.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Enregistrer une Structure</h4>
                    <input type="text" value={lieuNom} onChange={(e) => setLieuNom(e.target.value)} placeholder="Donjon, Village..." className="w-full bg-[#070504] border border-[#3a2920] rounded p-2 text-stone-200 focus:outline-none" required />
                    <div className="grid grid-cols-3 gap-1.5 font-mono">
                      <input type="text" value={coordX} onChange={(e) => setCoordX(e.target.value)} placeholder="X" className="bg-[#070504] border border-[#3a2920] rounded p-2 text-center" />
                      <input type="text" value={coordY} onChange={(e) => setCoordY(e.target.value)} placeholder="Y" className="bg-[#070504] border border-[#3a2920] rounded p-2 text-center" />
                      <input type="text" value={coordZ} onChange={(e) => setCoordZ(e.target.value)} placeholder="Z" className="bg-[#070504] border border-[#3a2920] rounded p-2 text-center" />
                    </div>
                    <button type="submit" className="w-full bg-[#d9720b] text-stone-950 font-serif font-bold py-1.5 rounded uppercase">Inscrire sur la carte</button>
                  </form>
                  <form onSubmit={handleAddItem} className="bg-[#140f0c] border border-[#2e2017] rounded p-4 space-y-2.5 text-xs">
                    <h4 className="font-serif font-bold text-purple-400 uppercase border-b border-[#2e2017] pb-1.5 flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Déposer un Butin Unique</h4>
                    <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Nom du loot..." className="w-full bg-[#070504] border border-[#3a2920] rounded p-2 text-stone-200 focus:outline-none" required />
                    <div className="grid grid-cols-2 gap-2">
                      <select value={itemRarity} onChange={(e) => setItemRarity(e.target.value)} className="bg-[#070504] border border-[#3a2920] rounded p-2 text-stone-300">
                        <option value="Rare">Rare</option>
                        <option value="Epic">Épique</option>
                        <option value="Legendary">Mythique</option>
                      </select>
                      <input type="text" value={itemLocation} onChange={(e) => setItemLocation(e.target.value)} placeholder="Lieu/Coffre" className="bg-[#070504] border border-[#3a2920] rounded p-2" />
                    </div>
                    <button type="submit" className="w-full bg-purple-700 text-white font-serif font-bold py-1.5 rounded uppercase">Mettre en coffre</button>
                  </form>
                </div>
                <div className="bg-[#c6c6c6] border-4 border-t-[#f0f0f0] border-l-[#f0f0f0] border-b-[#555555] border-r-[#555555] p-3 shadow-2xl rounded max-w-4xl mx-auto">
                  <div className="text-[#373737] font-mono text-xs font-bold uppercase mb-2">🧰 Double Coffre de Guilde (Serveur Synchro)</div>
                  <div className="grid grid-cols-9 gap-1 bg-[#8b8b8b] p-1 border-2 border-b-[#f0f0f0] border-r-[#f0f0f0] border-t-[#555555] border-l-[#555555]">
                    {chestSlots.map((slot, idx) => (
                      <div key={idx} className="aspect-square bg-[#8b8b8b] border-2 border-t-[#555555] border-l-[#555555] border-b-[#f0f0f0] border-r-[#f0f0f0] relative group flex items-center justify-center p-0.5 hover:bg-[#9c9c9c] cursor-help">
                        {slot ? (
                          <>
                            <div className="w-full h-full rounded flex items-center justify-center text-xs">{slot.type === 'item' ? '💎' : '🗺️'}</div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 bg-[#140b1a]/95 border-2 border-[#451683] p-2 rounded text-[11px] min-w-[180px] font-mono text-stone-200">
                              <div className="font-bold text-amber-400 text-xs">{slot.name}</div>
                              <div>{slot.coords}</div>
                            </div>
                            <button onClick={() => handleDeleteTrouvaille(slot.id)} className="absolute -top-1 -right-1 bg-red-700 text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">✕</button>
                          </>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'raids' && (
              <div className="space-y-4 text-xs">
                <form onSubmit={handleAddRaid} className="bg-[#140f0c] border border-[#2e2017] rounded p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <input type="text" value={newRaidName} onChange={(e) => setNewRaidName(e.target.value)} placeholder="Ex: Ender Dragon" className="w-full bg-[#070504] border border-[#3a2920] rounded p-2" required />
                  <input type="text" value={newRaidDate} onChange={(e) => setNewRaidDate(e.target.value)} placeholder="Ex: Vendredi 21h" className="w-full bg-[#070504] border border-[#3a2920] rounded p-2" />
                  <button type="submit" className="bg-[#d9720b] text-stone-950 font-bold py-2 rounded uppercase font-serif">Planifier</button>
                </form>
                <div className="bg-[#140f0c] border border-[#2e2017] rounded divide-y divide-[#2e2017]/40">
                  {raids.map(r => (
                    <div key={r.id} className="p-3.5 flex items-center justify-between">
                      <div><span className="font-bold font-serif text-stone-200 block">{r.name}</span><span className="text-stone-500">Date : {r.date}</span></div>
                      <button onClick={() => handleDeleteRaid(r.id)} className="text-stone-700 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'guide' && (
              <div className="space-y-6 text-xs">
                <div className="bg-[#150f1c] border border-purple-950 rounded p-4 space-y-3">
                  <h3 className="font-serif font-bold text-purple-400 uppercase tracking-wide flex items-center gap-2">🔮 Grimoire IA d'Arcane</h3>
                  <form onSubmit={askExpertAI} className="flex gap-2">
                    <input type="text" value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} placeholder="Ex: Comment avancer..." className="flex-1 bg-[#09060c] border border-purple-900/40 rounded p-2 text-stone-200" />
                    <button type="submit" className="bg-purple-800 text-purple-100 px-4 font-bold rounded font-serif uppercase">Consulter</button>
                  </form>
                  {aiResponse && <div className="p-3 bg-[#09060c] border border-purple-950 rounded text-stone-300 font-mono">{aiResponse}</div>}
                </div>
                <div className="space-y-3">
                  <form onSubmit={handleAddGuide} className="bg-[#140f0c] border border-[#2e2017] rounded p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    <input type="text" value={guideTitle} onChange={(e) => setGuideTitle(e.target.value)} placeholder="Titre..." className="bg-[#070504] border border-[#3a2920] rounded p-2" required />
                    <input type="url" value={guideUrl} onChange={(e) => setGuideUrl(e.target.value)} placeholder="Lien..." className="bg-[#070504] border border-[#3a2920] rounded p-2" required />
                    <button type="submit" className="bg-[#d9720b] text-stone-950 font-bold py-2 rounded font-serif uppercase">Ajouter</button>
                  </form>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {guides.map((g) => (
                      <div key={g.id} className="bg-[#140f0c] border border-[#2e2017] rounded p-3 flex items-center justify-between">
                        <div><h5 className="font-bold text-stone-300 font-serif">{g.title}</h5><a href={g.url} target="_blank" rel="noreferrer" className="text-amber-600 hover:underline">{g.url}</a></div>
                        <button onClick={() => handleDeleteGuide(g.id)} className="text-stone-700 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
