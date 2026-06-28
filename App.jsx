import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Shield, Users, Trophy, Swords, Beer, Scroll, Plus, RefreshCw, Check, Minus, MapPin, Trash2, ChevronDown, ChevronUp, Package, Sparkles } from 'lucide-react';

// Configuration de tes accès Supabase
const SUPABASE_URL = "https://pdndmtktluaggvupgsej.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_I_zL7n0t8G-BO4jFUr4FBA_qpLWH90B";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App() {
  // Gestion de la page d'accueil et du pseudo
  const [isRegistered, setIsRegistered] = useState(() => localStorage.getItem('taverne_registered') === 'true');
  const [userPseudo, setUserPseudo] = useState(() => localStorage.getItem('taverne_pseudo') || '');
  
  const [activeTab, setActiveTab] = useState('projets');
  const [loading, setLoading] = useState(true);
  const [loginMessage, setLoginMessage] = useState('');
  
  const [trouvailles, setTrouvailles] = useState([]);
  const [guides, setGuides] = useState([]);
  const [raids, setRaids] = useState([]);
  const [chantiers, setChantiers] = useState([]); 
  const [totalInscrits, setTotalInscrits] = useState(0);

  // Formulaire d'ajout de chantier personnalisé
  const [newChantierName, setNewChantierName] = useState('');
  const [newChantierCategory, setNewChantierCategory] = useState('machinery');
  const [newChantierMax, setNewChantierMax] = useState(64);

  // États des formulaires
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
  const [aiLoading, setAiLoading] = useState(false);

  const [expandedCategories, setExpandedCategories] = useState({ machinery: true, magic: true });

  // Chargement des données globales
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { count } = await supabase.from('aventuriers').select('*', { count: 'exact', head: true });
        if (count !== null) setTotalInscrits(count);

        const { data: projData } = await supabase.from('projets_state').select('*');
        if (projData) setChantiers(projData);

        const { data: trvData } = await supabase.from('trouvailles').select('*');
        if (trvData) setTrouvailles(trvData);

        const { data: rdData } = await supabase.from('raids').select('*');
        if (rdData) setRaids(rdData);

        const { data: gdData } = await supabase.from('guides').select('*');
        if (gdData) setGuides(gdData);
      } catch (err) {
        console.error("Erreur de synchronisation :", err);
      }
      setLoading(false);
    }
    fetchData();
  }, [isRegistered]);

  // Sauvegarde persistante de la session
  useEffect(() => {
    localStorage.setItem('taverne_registered', isRegistered);
    localStorage.setItem('taverne_pseudo', userPseudo);
  }, [isRegistered, userPseudo]);

  // Connexion / Inscription à la Taverne
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!userPseudo.trim()) return;

    const cleanPseudo = userPseudo.trim();
    await supabase.from('aventuriers').insert([{ pseudo: cleanPseudo }], { ignoreDuplicates: true });
    
    setLoginMessage(`Bienvenue, ${cleanPseudo} ! Ton nom est gravé dans le registre.`);
    setTimeout(() => { 
      setIsRegistered(true); 
    }, 1200);
  };

  // Déconnexion / Revenir à l'accueil du pseudo
  const handleLogout = () => {
    setIsRegistered(false);
    setUserPseudo('');
    localStorage.removeItem('taverne_registered');
    localStorage.removeItem('taverne_pseudo');
  };

  // Création d'un chantier personnalisé
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

    const { data, error } = await supabase.from('projets_state').insert([newChantier]).select();
    if (data) {
      setChantiers([...chantiers, data[0]]);
      setNewChantierName('');
    }
  };

  // Suppression d'un chantier
  const handleDeleteChantier = async (id) => {
    setChantiers(chantiers.filter(c => c.id !== id));
    await supabase.from('projets_state').delete().eq('id', id);
  };

  // Ajustement ou validation d'un chantier (Marquer comme fini / validé)
  const updateQuantity = async (id, amount, isFinishedAction = false) => {
    const updatedChantiers = chantiers.map(c => {
      if (c.id === id) {
        let nextValue = isFinishedAction ? c.max : c.current + amount;
        if (nextValue > c.max) nextValue = c.max;
        if (nextValue < 0) nextValue = 0;
        return { ...c, current: nextValue, by: userPseudo };
      }
      return c;
    });
    setChantiers(updatedChantiers);

    const target = updatedChantiers.find(c => c.id === id);
    if (target) {
      await supabase.from('projets_state').update({ current: target.current, by: target.by }).eq('id', id);
    }
  };

  // Gestion du grimoire d'aide IA intégrée
  const askExpertAI = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResponse('');

    const query = aiQuery.toLowerCase();
    
    // Système de réponses simulé enrichi pour Minecraft / Create / Ars Nouveau
    setTimeout(() => {
      if (query.includes('create') || query.includes('machinery') || query.includes('machine')) {
        setAiResponse("⚙️ [Grimoire Create] : Pour automatiser la récolte d'Andésite, assemblez un Mechanical Drill connecté à une source de rotation (Water Wheel). N'oubliez pas que pour débloquer les crafts avancés, la capture d'un Blaze dans le Nether reste l'étape prioritaire pour alimenter vos Blaze Burners !");
      } else if (query.includes('ars') || query.includes('nouveau') || query.includes('magie') || query.includes('source')) {
        setAiResponse("🔮 [Grimoire Ars Nouveau] : Les Source Gems s'obtiennent en condensant de la Source pure. Placez un Source Jar à côté d'un Agronomic Sourcelink et faites pousser des cultures tout autour. Les familiers comme le Starbuncle peuvent automatiser le transport de vos objets magiques !");
      } else if (query.includes('voidsent') || query.includes('foret')) {
        setAiResponse("🌲 [Légende d'Arcane] : La Voidsent Forest est une zone hostile de l'Overworld aux propriétés distordues. Les monstres y sont plus coriaces, mais les minéraux et coffres antiques cachés au pied de ses arbres noirs en valent largement la peine.");
      } else if (query.includes('boss') || query.includes('raid')) {
        setAiResponse("⚔️ [Conseil de Guerre] : Avant de lancer un assaut planifié, assurez-vous d'avoir équipé l'ensemble de votre guilde d'armures enchantées via Apotheosis. Prévoyez des parchemins de soin d'Ars Nouveau pour assister vos compagnons au front.");
      } else {
        setAiResponse(`📜 Le grimoire s'illumine... "Voyageur, ta question sur '${aiQuery}' nécessite de fouiller nos parchemins secrets. Essaye de me questionner spécifiquement sur 'Create', la 'Magie', un 'Boss' ou la 'Voidsent Forest' pour obtenir les plans exacts !"`);
      }
      setAiLoading(false);
    }, 800);
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

  const chestSlots = Array.from({ length: 54 }, (_, idx) => trouvailles[idx] || null);

  // ÉCRAN 1 : ACCUEIL ET INSCRIPTION DU PSEUDO (Style exact de ton image_189d60.jpg)
  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-[#18120f] text-[#d4c5b9] font-serif flex flex-col justify-between" style={{ backgroundImage: 'linear-gradient(rgba(20, 14, 10, 0.94), rgba(12, 8, 6, 0.98)), url("https://images.unsplash.com/photo-1597200381847-30ec200eeb9a?q=80&w=1200")' }}>
        <div className="text-center py-12 px-4 border-b border-[#e58219]/20 bg-[#120c09]">
          <Beer className="w-12 h-12 text-[#e58219] mx-auto mb-3" />
          <h1 className="text-3xl md:text-5xl font-black tracking-wider text-[#e58219] uppercase">La Taverne d'Arcane Frontier</h1>
          <p className="mt-2 text-stone-400 text-xs italic font-sans max-w-lg mx-auto">Chopes d'hydromel, ragoûts chauds et registres partagés. Installe-toi, voyageur.</p>
        </div>

        <div className="max-w-5xl w-full mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-sans items-start">
          <div className="md:col-span-2 bg-[#1c1410] border border-[#30221a] rounded p-6 shadow-xl">
            <h3 className="text-[#e58219] font-serif font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">📜 Le Registre des Aventuriers</h3>
            <p className="text-xs text-stone-400 mb-4">Indique ton pseudo Minecraft exact pour accéder aux chantiers de la guilde, au double coffre synchronisé et au grimoire magique.</p>
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Pseudo Minecraft</label>
                <input type="text" value={userPseudo} onChange={(e) => setUserPseudo(e.target.value)} placeholder="Ex: Velkhana" className="w-full bg-[#110b08] border border-[#3a2920] rounded px-3 py-2 text-stone-200 text-sm focus:outline-none focus:border-[#e58219]" required />
              </div>
              <button type="submit" className="w-full bg-[#d9720b] hover:bg-[#b85f07] text-stone-950 font-bold font-serif text-xs uppercase py-2.5 rounded tracking-widest transition-colors">Entrer dans la Taverne</button>
            </form>

            {loginMessage && (
              <div className="mt-4 bg-[#0d1c12] border border-emerald-900/50 p-3 rounded text-xs text-emerald-400 font-medium animate-pulse">
                🛡️ {loginMessage}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-[#1c1410] border border-[#30221a] rounded p-4 text-center">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">Statut du Serveur</span>
              <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Portes Ouvertes</span>
              <span className="block text-[10px] text-stone-600 mt-1 font-mono">play.arcanefrontier.fr</span>
            </div>
            <div className="bg-[#1c1410] border border-[#30221a] rounded p-4">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block text-center mb-3">⚔️ Comptoir des Légendes</span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-[#110b08] p-2 rounded border border-[#2a1d17]">
                  <span className="block text-xl font-bold text-[#e58219] font-mono">{totalInscrits}</span>
                  <span className="text-[9px] text-stone-500 uppercase">Inscrits</span>
                </div>
                <div className="bg-[#110b08] p-2 rounded border border-[#2a1d17]">
                  <span className="block text-xl font-bold text-emerald-500 font-mono">Connecté</span>
                  <span className="text-[9px] text-stone-500 uppercase">Supabase Cloud</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl w-full mx-auto px-4 pb-8 font-sans text-center text-stone-600 text-[11px]">
          Taverne de Guilde connectée à une base de données globale en temps réel.
        </div>
      </div>
    );
  }

  // ÉCRAN 2 : PANNEAU DES CHANTIERS ET INTERFACE COMPLET
  return (
    <div className="min-h-screen bg-[#0e0a08] text-[#94a3b8] font-sans antialiased">
      <header className="border-b border-[#291a12] bg-[#140f0c] sticky top-0 z-50 px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Beer className="w-6 h-6 text-[#e58219]" />
            <div>
              <h1 className="text-lg font-bold tracking-wider text-stone-200 uppercase font-serif">La Taverne d'Arcane Frontier</h1>
              <p className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold font-mono">Base Synchro Supabase</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-[#e58219]/10 border border-[#e58219]/30 rounded px-3 py-1 text-xs text-[#e58219] font-bold font-mono">
              <Users className="w-3.5 h-3.5" /> {userPseudo}
            </div>
            <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-400 underline font-mono transition-colors">Se déconnecter (Changer de pseudo)</button>
          </div>
        </div>
      </header>

      {/* ONGLETS DE NAVIGATION */}
      <div className="bg-[#140f0c] border-b border-[#291a12]/60 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex gap-1">
          {[
            { id: 'projets', label: 'Chantiers de Guilde', icon: Swords },
            { id: 'trouvailles', label: 'Double Coffre', icon: Scroll },
            { id: 'raids', label: 'Raids & Boss', icon: Shield },
            { id: 'guide', label: 'Grimoire d\'Aide', icon: Trophy },
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
          <div className="text-center py-20 font-mono text-[#e58219] animate-pulse flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
            <RefreshCw className="w-4 h-4 animate-spin" /> Alignement des astres avec Supabase...
          </div>
        ) : (
          <>
            {/* COMPOSANT CHANTIERS */}
            {activeTab === 'projets' && (
              <div className="space-y-6">
                {/* AJOUTER UN CHANTIER CUSTOM */}
                <form onSubmit={handleAddChantier} className="bg-[#140f0c] border border-[#3e2b1f] rounded p-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs items-end shadow-lg">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">🔨 Ouvrir un nouveau chantier / Objectif</label>
                    <input type="text" value={newChantierName} onChange={(e) => setNewChantierName(e.target.value)} placeholder="Ex: Coffres de plaques d'Acier, Autel d'Invocation..." className="w-full bg-[#070504] border border-[#3a2920] rounded p-2 text-stone-100 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Voie d'évolution</label>
                    <select value={newChantierCategory} onChange={(e) => setNewChantierCategory(e.target.value)} className="w-full bg-[#070504] border border-[#3a2920] rounded p-2 text-stone-300">
                      <option value="machinery">⚙️ Technologie (Create)</option>
                      <option value="magic">🔮 Magie (Ars Nouveau)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Ressources requises</label>
                    <input type="number" value={newChantierMax} onChange={(e) => setNewChantierMax(e.target.value)} className="w-full bg-[#070504] border border-[#3a2920] rounded p-2 text-stone-100 focus:outline-none" />
                  </div>
                  <button type="submit" className="md:col-span-4 bg-amber-700 hover:bg-amber-600 text-stone-950 font-serif font-bold py-2 rounded uppercase tracking-wider transition-colors">Graver ce chantier commun</button>
                </form>

                {/* LES LISTES DE CHANTIERS */}
                {['machinery', 'magic'].map((cat) => (
                  <div key={cat} className="bg-[#140f0c] border border-[#2e2017] rounded overflow-hidden shadow-2xl">
                    <button onClick={() => setExpandedCategories({ ...expandedCategories, [cat]: !expandedCategories[cat] })} className="w-full px-4 py-3 bg-[#1b1410] flex items-center justify-between border-b border-[#2e2017] text-stone-200 hover:bg-[#211914] transition">
                      <span className="font-serif font-bold uppercase tracking-wider text-xs text-[#e58219]">
                        {cat === 'machinery' ? '⚙️ Chantiers d\'Ingénierie Technologique (Create)' : '🔮 Chantiers des Hautes Sphères Magiques (Ars Nouveau)'}
                      </span>
                      {expandedCategories[cat] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {expandedCategories[cat] && (
                      <div className="divide-y divide-[#2e2017]/40 bg-[#0f0a08]">
                        {chantiers.filter(c => c.category === cat).length === 0 ? (
                          <p className="p-4 text-stone-600 italic text-xs">Aucun chantier actif. Utilisez le formulaire ci-dessus pour lancer la guilde !</p>
                        ) : (
                          chantiers.filter(c => c.category === cat).map((res) => {
                            const isFinished = res.current >= res.max;
                            return (
                              <div key={res.id} className={`p-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs transition-colors ${isFinished ? 'bg-emerald-950/10 border-l-2 border-emerald-600' : ''}`}>
                                <div className="flex items-center gap-3">
                                  {/* BOUTON SUPPRIMER LE CHANTIER */}
                                  <button onClick={() => handleDeleteChantier(res.id)} className="text-stone-700 hover:text-red-500 p-1 rounded transition-colors" title="Supprimer définitivement ce chantier">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                  <div>
                                    <span className={`font-medium font-serif ${isFinished ? 'text-emerald-400 line-through' : 'text-stone-300'}`}>{res.name}</span>
                                    {isFinished && <span className="ml-2 text-[9px] uppercase tracking-wider font-bold text-emerald-500 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-900/40">Validé / Fini</span>}
                                    {res.by && !isFinished && <span className="text-[9px] text-amber-500 bg-amber-950/30 px-1.5 py-0.5 rounded font-mono ml-2">Soutenu par {res.by}</span>}
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-1.5 justify-end font-mono">
                                  <button onClick={() => updateQuantity(res.id, -10)} className="px-1.5 py-0.5 bg-[#140f0c] border border-[#302118] text-stone-400 hover:text-white rounded">-10</button>
                                  <button onClick={() => updateQuantity(res.id, -1)} className="p-1 bg-[#140f0c] border border-[#302118] text-stone-400 hover:text-white rounded"><Minus className="w-3 h-3" /></button>
                                  
                                  <div className={`px-3 py-0.5 font-bold border rounded min-w-[75px] text-center ${isFinished ? 'bg-[#05140b] border-emerald-800 text-emerald-400' : 'bg-[#070504] border-[#2c1d15] text-[#e58219]'}`}>
                                    {res.current}/{res.max}
                                  </div>
                                  
                                  <button onClick={() => updateQuantity(res.id, 1)} className="p-1 bg-[#140f0c] border border-[#302118] text-stone-400 hover:text-white rounded"><Plus className="w-3 h-3" /></button>
                                  <button onClick={() => updateQuantity(res.id, 10)} className="px-1.5 py-0.5 bg-[#140f0c] border border-[#302118] text-stone-400 hover:text-white rounded">+10</button>
                                  
                                  {/* BOUTON TOUT VALIDER / MARQUER COMME FINI */}
                                  <button onClick={() => updateQuantity(res.id, 0, true)} className="p-1 bg-emerald-950 text-emerald-400 border border-emerald-850 hover:bg-emerald-900 rounded transition-all" title="Marquer immédiatement comme complété">
                                    <Check className="w-3.5 h-3.5 font-bold" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* COFFRES */}
            {activeTab === 'trouvailles' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <form onSubmit={handleAddTrouvaille} className="bg-[#140f0c] border border-[#2e2017] rounded p-4 space-y-2.5 text-xs">
                    <h4 className="font-serif font-bold text-[#e58219] uppercase border-b border-[#2e2017] pb-1.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Enregistrer une Structure</h4>
                    <input type="text" value={lieuNom} onChange={(e) => setLieuNom(e.target.value)} placeholder="Donjon Maudit, Village Abandonné..." className="w-full bg-[#070504] border border-[#3a2920] rounded p-2 text-stone-200 focus:outline-none" required />
                    <div className="grid grid-cols-3 gap-1.5 font-mono">
                      <input type="text" value={coordX} onChange={(e) => setCoordX(e.target.value)} placeholder="X" className="bg-[#070504] border border-[#3a2920] rounded p-2 text-center" />
                      <input type="text" value={coordY} onChange={(e) => setCoordY(e.target.value)} placeholder="Y" className="bg-[#070504] border border-[#3a2920] rounded p-2 text-center" />
                      <input type="text" value={coordZ} onChange={(e) => setCoordZ(e.target.value)} placeholder="Z" className="bg-[#070504] border border-[#3a2920] rounded p-2 text-center" />
                    </div>
                    <button type="submit" className="w-full bg-[#d9720b] text-stone-950 font-serif font-bold py-1.5 rounded uppercase">Consigner le lieu</button>
                  </form>
                  <form onSubmit={handleAddItem} className="bg-[#140f0c] border border-[#2e2017] rounded p-4 space-y-2.5 text-xs">
                    <h4 className="font-serif font-bold text-purple-400 uppercase border-b border-[#2e2017] pb-1.5 flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Déposer un Artefact / Loot</h4>
                    <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Nom de l'arme ou composant rare..." className="w-full bg-[#070504] border border-[#3a2920] rounded p-2 text-stone-200 focus:outline-none" required />
                    <div className="grid grid-cols-2 gap-2">
                      <select value={itemRarity} onChange={(e) => setItemRarity(e.target.value)} className="bg-[#070504] border border-[#3a2920] rounded p-2 text-stone-300 focus:outline-none">
                        <option value="Rare">Rare 🟦</option>
                        <option value="Epic">Épique 🟪</option>
                        <option value="Legendary">Mythique 🟧</option>
                      </select>
                      <input type="text" value={itemLocation} onChange={(e) => setItemLocation(e.target.value)} placeholder="Coffre n° / Rangé" className="bg-[#070504] border border-[#3a2920] rounded p-2" />
                    </div>
                    <button type="submit" className="w-full bg-purple-700 text-white font-serif font-bold py-1.5 rounded uppercase">Stocker en base</button>
                  </form>
                </div>

                <div className="bg-[#c6c6c6] border-4 border-t-[#f0f0f0] border-l-[#f0f0f0] border-b-[#555555] border-r-[#555555] p-3 shadow-2xl rounded max-w-4xl mx-auto">
                  <div className="text-[#373737] font-mono text-xs font-bold uppercase mb-2">🧰 Double Coffre Commun (Synchro Cloud)</div>
                  <div className="grid grid-cols-9 gap-1 bg-[#8b8b8b] p-1 border-2 border-b-[#f0f0f0] border-r-[#f0f0f0] border-t-[#555555] border-l-[#555555]">
                    {chestSlots.map((slot, idx) => (
                      <div key={idx} className="aspect-square bg-[#8b8b8b] border-2 border-t-[#555555] border-l-[#555555] border-b-[#f0f0f0] border-r-[#f0f0f0] relative group flex items-center justify-center p-0.5 hover:bg-[#9c9c9c] cursor-help">
                        {slot ? (
                          <>
                            <div className="w-full h-full rounded flex items-center justify-center text-xs select-none">{slot.type === 'item' ? '💎' : '🗺️'}</div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 bg-[#140b1a]/95 border-2 border-[#451683] p-2 rounded text-[11px] min-w-[185px] font-mono text-stone-200 shadow-xl">
                              <div className="font-bold text-amber-400 text-xs">{slot.name}</div>
                              <div className="text-stone-400 text-[10px]">{slot.coords}</div>
                              <div className="text-stone-500 text-[9px] mt-1 pt-1 border-t border-purple-900/30">Déposé par: {slot.by}</div>
                            </div>
                            <button onClick={() => handleDeleteTrouvaille(slot.id)} className="absolute -top-1 -right-1 bg-red-700 hover:bg-red-600 text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center border border-white/20 shadow">✕</button>
                          </>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* RAIDS */}
            {activeTab === 'raids' && (
              <div className="space-y-4 text-xs">
                <form onSubmit={handleAddRaid} className="bg-[#140f0c] border border-[#2e2017] rounded p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <input type="text" value={newRaidName} onChange={(e) => setNewRaidName(e.target.value)} placeholder="Ex: Ender Dragon, Léviathan..." className="w-full bg-[#070504] border border-[#3a2920] rounded p-2" required />
                  <input type="text" value={newRaidDate} onChange={(e) => setNewRaidDate(e.target.value)} placeholder="Ex: Samedi soir à 21h" className="w-full bg-[#070504] border border-[#3a2920] rounded p-2" />
                  <button type="submit" className="bg-[#d9720b] text-stone-950 font-bold py-2 rounded uppercase font-serif tracking-wide">Planifier la Chasse</button>
                </form>
                <div className="bg-[#140f0c] border border-[#2e2017] rounded divide-y divide-[#2e2017]/40">
                  {raids.length === 0 ? (
                    <p className="p-4 text-stone-600 italic font-serif">Aucune expédition militaire programmée sur le tableau.</p>
                  ) : (
                    raids.map(r => (
                      <div key={r.id} className="p-3.5 flex items-center justify-between">
                        <div><span className="font-bold font-serif text-stone-200 block text-sm">{r.name}</span><span className="text-stone-500 font-mono">Départ : {r.date}</span></div>
                        <button onClick={() => handleDeleteRaid(r.id)} className="text-stone-700 hover:text-red-400 transition-colors p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* GRIMOIRE IA D'AIDE ET GUIDES */}
            {activeTab === 'guide' && (
              <div className="space-y-6 text-xs">
                {/* INTERACTION IA RE-DÉVELOPPÉE */}
                <div className="bg-[#150f1c] border border-purple-950 rounded p-4 space-y-3 shadow-xl">
                  <h3 className="font-serif font-bold text-purple-400 uppercase tracking-wide flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-purple-400" /> Grimoire Magique d'Arcane Frontier
                  </h3>
                  <p className="text-stone-400 text-[11px]">Interroge les esprits de la Taverne sur la progression des mods du serveur (Create, Ars Nouveau, Expéditions).</p>
                  
                  <form onSubmit={askExpertAI} className="flex gap-2">
                    <input type="text" value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} placeholder="Ex: Comment automatiser avec Create ? Comment avoir de la Source ?" className="flex-1 bg-[#09060c] border border-purple-900/40 rounded p-2 text-stone-200 focus:outline-none focus:border-purple-600" />
                    <button type="submit" disabled={aiLoading} className="bg-purple-800 hover:bg-purple-700 text-purple-100 px-4 font-bold rounded font-serif uppercase tracking-wider flex items-center gap-1">
                      {aiLoading ? 'Fouille...' : 'Consulter'}
                    </button>
                  </form>
                  
                  {aiResponse && (
                    <div className="p-3 bg-[#0a060d] border border-purple-900/60 rounded text-stone-300 font-mono leading-relaxed bg-opacity-80">
                      {aiResponse}
                    </div>
                  )}
                </div>

                {/* LIENS PARTAGÉS */}
                <div className="space-y-3">
                  <form onSubmit={handleAddGuide} className="bg-[#140f0c] border border-[#2e2017] rounded p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    <input type="text" value={guideTitle} onChange={(e) => setGuideTitle(e.target.value)} placeholder="Titre de la vidéo ou doc..." className="bg-[#070504] border border-[#3a2920] rounded p-2" required />
                    <input type="url" value={guideUrl} onChange={(e) => setGuideUrl(e.target.value)} placeholder="Lien URL complet..." className="bg-[#070504] border border-[#3a2920] rounded p-2" required />
                    <button type="submit" className="bg-[#d9720b] text-stone-950 font-bold py-2 rounded font-serif uppercase">Partager</button>
                  </form>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {guides.map((g) => (
                      <div key={g.id} className="bg-[#140f0c] border border-[#2e2017] rounded p-3 flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-stone-300 font-serif">{g.title}</h5>
                          <a href={g.url} target="_blank" rel="noreferrer" className="text-amber-600 hover:underline font-mono text-[10px] truncate max-w-[200px] block">{g.url}</a>
                        </div>
                        <button onClick={() => handleDeleteGuide(g.id)} className="text-stone-700 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
