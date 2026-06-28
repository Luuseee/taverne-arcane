import React, { useState } from 'react';
import { Shield, Users, Trophy, Key, Swords, Beer, Scroll, Plus, RotateCw, Check, Minus, Youtube, MapPin, Trash2, ChevronDown, ChevronUp, RefreshCw, Package, HelpCircle } from 'lucide-react';

export default function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [userPseudo, setUserPseudo] = useState('');
  const [activeTab, setActiveTab] = useState('projets');
  
  // --- ÉTATS TROUVAILLES ---
  const [trouvailles, setTrouvailles] = useState([]);
  const [lieuNom, setLieuNom] = useState('');
  const [coordX, setCoordX] = useState('');
  const [coordY, setCoordY] = useState('');
  const [coordZ, setCoordZ] = useState('');
  
  const [itemName, setItemName] = useState('');
  const [itemRarity, setItemRarity] = useState('Epic');
  const [itemLocation, setItemLocation] = useState('');

  // --- ÉTATS GUIDE & IA ---
  const [guides, setGuides] = useState([]);
  const [guideTitle, setGuideTitle] = useState('');
  const [guideUrl, setGuideUrl] = useState('');
  
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // --- ÉTATS RAIDS ---
  const [raids, setRaids] = useState([]);
  const [newRaidName, setNewRaidName] = useState('');
  const [newRaidDate, setNewRaidDate] = useState('');

  // --- ÉTATS PROJETS ---
  const [expandedCategories, setExpandedCategories] = useState({
    machinery: true,
    magic: false,
  });

  const [projectData, setProjectData] = useState({
    machinery: [
      { id: 'fer', name: 'Fer', current: 0, max: 45, by: '' },
      { id: 'cuivre', name: 'Cuivre', current: 0, max: 18, by: '' },
      { id: 'zinc', name: 'Zinc', current: 0, max: 18, by: '' },
      { id: 'or', name: 'Or', current: 0, max: 3, by: '' },
      { id: 'andesite', name: 'Andésite', current: 0, max: 40, by: '' },
      { id: 'quartz', name: 'Quartz (Arcane common)', current: 0, max: 6, by: '' },
      { id: 'redstone', name: 'Redstone', current: 0, max: 50, by: '' },
    ],
    magic: [
      { id: 'source_gem', name: 'Source Gems (Ars Nouveau)', current: 0, max: 64, by: '' },
      { id: 'void_crystal', name: 'Cristaux du Néant', current: 0, max: 16, by: '' },
      { id: 'apotheosis_orb', name: 'Orbe de Modification POE', current: 0, max: 5, by: '' },
    ]
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (userPseudo.trim()) setIsRegistered(true);
  };

  const updateQuantity = (category, id, amount, setAbsolute = false) => {
    setProjectData({
      ...projectData,
      [category]: projectData[category].map(res => {
        if (res.id === id) {
          let nextValue = setAbsolute ? amount : res.current + amount;
          if (nextValue > res.max) nextValue = res.max;
          if (nextValue < 0) nextValue = 0;
          return { ...res, current: nextValue, by: nextValue > 0 ? userPseudo : res.by };
        }
        return res;
      })
    });
  };

  const toggleCategory = (cat) => {
    setExpandedCategories({ ...expandedCategories, [cat]: !expandedCategories[cat] });
  };

  const handleAddTrouvaille = (e) => {
    e.preventDefault();
    if (lieuNom.trim()) {
      setTrouvailles([...trouvailles, {
        id: Date.now(),
        type: 'lieu',
        name: lieuNom,
        coords: `X: ${coordX || '?'} | Y: ${coordY || '?'} | Z: ${coordZ || '?'}`,
        by: userPseudo,
        rarity: 'Structure'
      }]);
      setLieuNom(''); setCoordX(''); setCoordY(''); setCoordZ('');
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (itemName.trim()) {
      setTrouvailles([...trouvailles, {
        id: Date.now(),
        type: 'item',
        name: itemName,
        coords: itemLocation ? `Lieu: ${itemLocation}` : 'Loot Aléatoire',
        by: userPseudo,
        rarity: itemRarity
      }]);
      setItemName(''); setItemLocation('');
    }
  };

  const handleAddGuide = (e) => {
    e.preventDefault();
    if (guideTitle.trim() && guideUrl.trim()) {
      setGuides([...guides, {
        id: Date.now(),
        title: guideTitle,
        url: guideUrl,
        by: userPseudo
      }]);
      setGuideTitle(''); setGuideUrl('');
    }
  };

  const handleAddRaid = (e) => {
    e.preventDefault();
    if (newRaidName.trim()) {
      setRaids([...raids, {
        id: Date.now(),
        name: newRaidName,
        date: newRaidDate || 'À définir',
        status: 'En préparation'
      }]);
      setNewRaidName(''); setNewRaidDate('');
    }
  };

  const askExpertAI = (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    
    setTimeout(() => {
      const query = aiQuery.toLowerCase();
      let response = "Je n'ai pas trouvé cette info spécifique dans mes grimoires KubeJS. Rappel : Project Arcane Frontier possède 500+ quêtes axées sur 115 boss uniques. Le Nether et l'End sont supprimés et fusionnés dans la 'Voidsent Forest' du monde normal.";
      
      if (query.includes('voidsent') || query.includes('forest') || query.includes('nether') || query.includes('end')) {
        response = "🌲 [Voidsent Forest] : C'est le biome sur-mesure de l'Overworld qui remplace le Nether et l'End. C'est ici que tu trouveras les forteresses, les minerais d'Ender et les portails de boss majeurs. Attention aux monstres modifiés (+30% de vitesse d'IA).";
      } else if (query.includes('orb') || query.includes('apotheosis') || query.includes('equipement') || query.includes('poe')) {
        response = "🔮 [Système d'Équipement] : Inspiré de PoE (Path of Exile). Apotheosis a été entièrement modifié. Tu dois appliquer directement des Orbes spécifiques sur tes armes et armures pour leur ajouter des affixes de statistiques sans passer par les menus complexes.";
      } else if (query.includes('create') || query.includes('xp') || query.includes('brass')) {
        response = "⚙️ [Progression Create] : Pour fabriquer du Laiton (Brass), les recettes KubeJS bloquent l'accès tant que tu n'as pas capturé de Blaze dans un Blaze Burner. Les Blaze Burners se trouvent principalement dans les structures de la Voidsent Forest.";
      } else if (query.includes('classe') || query.includes('competence')) {
        response = "⚔️ [Classes & Skills] : Le pack propose plus de 250 capacités réparties sur plusieurs arbres de compétences (Guerrier, Ranger, Mage). Tu peux débloquer plusieurs sous-classes mais l'XP de compétence requiert des loots de boss.";
      }
      setAiResponse(response);
      setIsAiLoading(false);
    }, 800);
  };

  // On crée une grille fixe de 54 cases pour simuler le double coffre (6 lignes de 9 cases)
  const chestSlots = Array.from({ length: 54 }, (_, index) => trouvailles[index] || null);

  return (
    <div className="min-h-screen bg-[#0b0f14] text-[#94a3b8] font-sans antialiased">
      
      {/* ÉCRAN INSCRIPTION */}
      {!isRegistered ? (
        <div className="min-h-screen bg-stone-900 text-stone-100 font-serif flex flex-col justify-between" style={{ backgroundImage: 'linear-gradient(rgba(11,15,20,0.9), rgba(11,15,20,0.95)), url("https://images.unsplash.com/photo-1597200381847-30ec200eeb9a?q=80&w=1200")' }}>
          <div className="text-center py-20 px-4">
            <Beer className="w-16 h-16 text-amber-500 animate-pulse mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider text-amber-500 uppercase">La Taverne d'Arcane Frontier</h1>
            <p className="mt-2 text-stone-400 text-sm max-w-xl mx-auto italic font-sans">Enregistre ton nom pour débloquer les cartes et coffres de la guilde.</p>
          </div>
          <div className="max-w-md w-full mx-auto px-4 pb-32">
            <div className="bg-[#111722] border-2 border-stone-800 rounded-lg p-6 shadow-2xl">
              <form onSubmit={handleLogin} className="space-y-4 font-sans">
                <div>
                  <label className="block text-xs font-bold text-stone-400 mb-2 uppercase tracking-wider">Pseudo Minecraft exact</label>
                  <input type="text" value={userPseudo} onChange={(e) => setUserPseudo(e.target.value)} placeholder="Ex: Velkhana" className="w-full bg-stone-950 border border-stone-800 rounded px-4 py-3 text-stone-100 focus:outline-none focus:border-amber-500 placeholder-stone-700" required />
                </div>
                <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-stone-950 font-bold uppercase py-3 rounded tracking-wider transition-colors font-serif">Entrer dans la taverne</button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* HEADER */}
          <header className="border-b border-stone-800 bg-[#0f141c] sticky top-0 z-50 px-4 lg:px-8 py-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Beer className="w-6 h-6 text-amber-500" />
                <div>
                  <h1 className="text-xl font-bold tracking-wider text-stone-100 uppercase font-serif">La Taverne d'Arcane Frontier</h1>
                  <p className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Serveur Commu • Expert RPG Pack</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded px-3 py-1.5 text-xs text-amber-400 font-bold font-mono">
                <Swords className="w-3.5 h-3.5" /> {userPseudo}
              </div>
            </div>
          </header>

          {/* TABS */}
          <div className="bg-[#0f141c] border-b border-stone-800/60 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto flex gap-1">
              {[
                { id: 'projets', label: 'Projets', icon: Swords },
                { id: 'trouvailles', label: 'Trouvailles', icon: Scroll },
                { id: 'raids', label: 'Raids', icon: Shield },
                { id: 'guide', label: 'Guide & IA Grimoire', icon: Trophy },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium tracking-wide uppercase transition relative ${activeTab === tab.id ? 'text-amber-500 font-bold' : 'text-stone-500 hover:text-stone-300'}`}>
                    <Icon className="w-4 h-4" /> <span className="hidden sm:inline">{tab.label}</span>
                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></div>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN CONTAINER */}
          <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
            
            {/* TAB: PROJETS */}
            {activeTab === 'projets' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-stone-100 uppercase tracking-wide">Gestion des Chantiers</h2>
                  <p className="text-sm text-stone-500 mt-1">Déplie les catégories et ajuste tes récoltes d'un coup grâce aux outils de farm rapide.</p>
                </div>

                <div className="bg-[#111722] border border-stone-800/80 rounded-lg overflow-hidden shadow-xl">
                  <button onClick={() => toggleCategory('machinery')} className="w-full px-5 py-4 bg-[#141b29] flex items-center justify-between border-b border-stone-800/60 text-stone-200 hover:bg-[#182133] transition">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-amber-500" />
                      <span className="font-serif font-bold uppercase tracking-wider text-sm">Chantier Tech : Machine à XP (Create)</span>
                    </div>
                    {expandedCategories.machinery ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedCategories.machinery && (
                    <div className="divide-y divide-stone-800/40">
                      {projectData.machinery.map((res) => (
                        <div key={res.id} className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0e131d]/60">
                          <div>
                            <span className="font-medium text-stone-300">{res.name}</span>
                            {res.by && <span className="text-[10px] text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 rounded font-mono ml-2">Modifié par {res.by}</span>}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 justify-end">
                            <button onClick={() => updateQuantity('machinery', res.id, -10)} className="px-2 py-1 bg-stone-900 border border-stone-800 text-xs text-stone-400 hover:text-white rounded">-10</button>
                            <button onClick={() => updateQuantity('machinery', res.id, -1)} className="p-1 bg-stone-900 border border-stone-800 text-stone-400 hover:text-white rounded"><Minus className="w-3.5 h-3.5" /></button>
                            <div className="px-4 py-1 text-sm font-bold font-mono bg-stone-950 border border-stone-850 rounded text-center min-w-[70px]">{res.current}/{res.max}</div>
                            <button onClick={() => updateQuantity('machinery', res.id, 1)} className="p-1 bg-stone-900 border border-stone-800 text-stone-400 hover:text-white rounded"><Plus className="w-3.5 h-3.5" /></button>
                            <button onClick={() => updateQuantity('machinery', res.id, 10)} className="px-2 py-1 bg-stone-900 border border-stone-800 text-xs text-stone-400 hover:text-white rounded">+10</button>
                            <button onClick={() => updateQuantity('machinery', res.id, res.max, true)} className="p-1 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded hover:bg-emerald-900"><Check className="w-3.5 h-3.5" /></button>
                            <button onClick={() => updateQuantity('machinery', res.id, 0, true)} title="Remettre à zéro" className="p-1 bg-red-950/40 border border-red-900/40 text-red-400 hover:bg-red-900 rounded ml-2"><RefreshCw className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-[#111722] border border-stone-800/80 rounded-lg overflow-hidden shadow-xl">
                  <button onClick={() => toggleCategory('magic')} className="w-full px-5 py-4 bg-[#141b29] flex items-center justify-between border-b border-stone-800/60 text-stone-200 hover:bg-[#182133] transition">
                    <div className="flex items-center gap-3">
                      <Key className="w-5 h-5 text-purple-400" />
                      <span className="font-serif font-bold uppercase tracking-wider text-sm">Chantier Arcane : Objets & Runes de Progression</span>
                    </div>
                    {expandedCategories.magic ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedCategories.magic && (
                    <div className="divide-y divide-stone-800/40">
                      {projectData.magic.map((res) => (
                        <div key={res.id} className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0e131d]/60">
                          <div>
                            <span className="font-medium text-stone-300">{res.name}</span>
                            {res.by && <span className="text-[10px] text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 rounded font-mono ml-2">Modifié par {res.by}</span>}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 justify-end">
                            <button onClick={() => updateQuantity('magic', res.id, -10)} className="px-2 py-1 bg-stone-900 border border-stone-800 text-xs text-stone-400 hover:text-white rounded">-10</button>
                            <button onClick={() => updateQuantity('magic', res.id, -1)} className="p-1 bg-stone-900 border border-stone-800 text-stone-400 hover:text-white rounded"><Minus className="w-3.5 h-3.5" /></button>
                            <div className="px-4 py-1 text-sm font-bold font-mono bg-stone-950 border border-stone-850 rounded text-center min-w-[70px]">{res.current}/{res.max}</div>
                            <button onClick={() => updateQuantity('magic', res.id, 1)} className="p-1 bg-stone-900 border border-stone-800 text-stone-400 hover:text-white rounded"><Plus className="w-3.5 h-3.5" /></button>
                            <button onClick={() => updateQuantity('magic', res.id, 10)} className="px-2 py-1 bg-stone-900 border border-stone-800 text-xs text-stone-400 hover:text-white rounded">+10</button>
                            <button onClick={() => updateQuantity('magic', res.id, res.max, true)} className="p-1 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded"><Check className="w-3.5 h-3.5" /></button>
                            <button onClick={() => updateQuantity('magic', res.id, 0, true)} title="Remettre à zéro" className="p-1 bg-red-950/40 border border-red-900/40 text-red-400 hover:bg-red-900 rounded ml-2"><RefreshCw className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: TROUVAILLES (FORMULAIRES + DOUBLE COFFRE INTERFACE) */}
            {activeTab === 'trouvailles' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-stone-100 uppercase tracking-wide">Registre des Découvertes</h2>
                  <p className="text-sm text-stone-500 mt-1">Renseigne tes explorations en haut, elles s'ajouteront directement dans les slots du double coffre communautaire.</p>
                </div>

                {/* FORMULAIRES EN LIGNE TOUT EN HAUT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Formulaire Lieu */}
                  <div className="bg-[#111722] border border-stone-800 rounded-lg p-4 shadow-md">
                    <h4 className="font-serif font-bold text-stone-200 text-xs uppercase tracking-wider mb-3 border-b border-stone-800 pb-2 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-500" /> Enregistrer un Lieu / Structure</h4>
                    <form onSubmit={handleAddTrouvaille} className="space-y-3">
                      <input type="text" value={lieuNom} onChange={(e) => setLieuNom(e.target.value)} placeholder="Ex: Cité des Enders Corrompus" className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-stone-200 text-xs focus:border-amber-500 focus:outline-none" required />
                      <div className="grid grid-cols-3 gap-1">
                        <input type="text" value={coordX} onChange={(e) => setCoordX(e.target.value)} placeholder="X" className="bg-stone-950 border border-stone-800 rounded p-2 text-stone-200 text-xs text-center focus:border-amber-500 focus:outline-none" />
                        <input type="text" value={coordY} onChange={(e) => setCoordY(e.target.value)} placeholder="Y" className="bg-stone-950 border border-stone-800 rounded p-2 text-stone-200 text-xs text-center focus:border-amber-500 focus:outline-none" />
                        <input type="text" value={coordZ} onChange={(e) => setCoordZ(e.target.value)} placeholder="Z" className="bg-stone-950 border border-stone-800 rounded p-2 text-stone-200 text-xs text-center focus:border-amber-500 focus:outline-none" />
                      </div>
                      <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-stone-950 font-bold py-1.5 rounded text-xs uppercase font-serif tracking-wide">Déposer le Lieu</button>
                    </form>
                  </div>

                  {/* Formulaire Item */}
                  <div className="bg-[#111722] border border-stone-800 rounded-lg p-4 shadow-md">
                    <h4 className="font-serif font-bold text-stone-200 text-xs uppercase tracking-wider mb-3 border-b border-stone-800 pb-2 flex items-center gap-1.5"><Package className="w-3.5 h-3.5 text-purple-400" /> Enregistrer un Loot Rare</h4>
                    <form onSubmit={handleAddItem} className="space-y-3">
                      <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Ex: Épée de l'Éclipse Mythique" className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-stone-200 text-xs focus:border-amber-500 focus:outline-none" required />
                      <div className="grid grid-cols-2 gap-2">
                        <select value={itemRarity} onChange={(e) => setItemRarity(e.target.value)} className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-stone-200 text-xs focus:border-amber-500 focus:outline-none">
                          <option value="Rare">Rare (Bleu)</option>
                          <option value="Epic">Épique (Violet)</option>
                          <option value="Legendary">Mythique (Or)</option>
                        </select>
                        <input type="text" value={itemLocation} onChange={(e) => setItemLocation(e.target.value)} placeholder="Où ? (Ex: Donjon Nether)" className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-stone-200 text-xs focus:border-amber-500 focus:outline-none" />
                      </div>
                      <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-1.5 rounded text-xs uppercase font-serif tracking-wide">Déposer le Butin</button>
                    </form>
                  </div>
                </div>

                {/* DOUBLE COFFRE MINECRAFT STYLE */}
                <div className="bg-[#c6c6c6] border-4 border-t-[#f0f0f0] border-l-[#f0f0f0] border-b-[#555555] border-r-[#555555] p-4 shadow-2xl rounded max-w-4xl mx-auto">
                  
                  {/* Titre du Coffre style Minecraft GUI */}
                  <div className="text-[#373737] font-mono text-sm font-bold uppercase tracking-wide mb-3 px-1 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#373737]" /> Double Coffre
                  </div>

                  {/* Grille des 54 Slots (6x9) */}
                  <div className="grid grid-cols-9 gap-1 bg-[#8b8b8b] p-1.5 border-2 border-b-[#f0f0f0] border-r-[#f0f0f0] border-t-[#555555] border-l-[#555555]">
                    {chestSlots.map((slot, index) => (
                      <div 
                        key={index} 
                        className="aspect-square bg-[#8b8b8b] border-2 border-t-[#555555] border-l-[#555555] border-b-[#f0f0f0] border-r-[#f0f0f0] relative group flex items-center justify-center p-1 hover:bg-[#9c9c9c] transition-colors"
                      >
                        {slot ? (
                          <>
                            {/* Visuel abrégé de l'item dans le slot */}
                            <div className={`w-full h-full rounded flex items-center justify-center font-mono font-bold text-[10px] uppercase shadow-inner cursor-help select-none ${slot.type === 'item' ? 'bg-purple-900/30 text-purple-300 border border-purple-700/40' : 'bg-amber-900/30 text-amber-300 border border-amber-700/40'}`}>
                              {slot.type === 'item' ? '✨' : '🗺️'}
                            </div>

                            {/* Tooltip complet au survol (façon infobulle Minecraft) */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 bg-[#100416]/95 border-2 border-[#2e0766] p-2.5 rounded text-xs min-w-[200px] shadow-2xl font-mono text-stone-200 pointer-events-none">
                              <div className={`font-bold text-sm ${slot.rarity === 'Legendary' ? 'text-[#ffaa00]' : slot.rarity === 'Epic' ? 'text-[#b800b8]' : slot.rarity === 'Rare' ? 'text-[#55ffff]' : 'text-[#55ff55]'}`}>
                                {slot.name}
                              </div>
                              <div className="text-gray-400 text-[11px] mt-1">{slot.coords}</div>
                              <div className="text-gray-500 text-[10px] mt-2 border-t border-purple-900/40 pt-1">Ajouté par : {slot.by}</div>
                              
                              <div className="text-red-400 text-[9px] mt-1 animate-pulse italic">Clic sur la croix rouge pour jeter l'item</div>
                            </div>

                            {/* Petit bouton de suppression discret sur l'item */}
                            <button 
                              onClick={() => setTrouvailles(trouvailles.filter(item => item.id !== slot.id))}
                              className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-700 text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 items-center justify-center hidden group-hover:flex z-10 shadow"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          // Case vide
                          <div className="w-full h-full opacity-0"></div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Petit texte explicatif en bas du coffre */}
                  <div className="text-right text-[10px] text-stone-600 font-mono mt-2 uppercase px-1">
                    Inventaire : 54 Emplacements Larges
                  </div>
                </div>

              </div>
            )}

            {/* TAB: RAIDS */}
            {activeTab === 'raids' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-stone-100 uppercase tracking-wide">Table des Raids</h2>
                  <p className="text-sm text-stone-500 mt-1">Gère les rendez-vous communautaires pour tomber les 115 boss infernaux du serveur.</p>
                </div>
                <form onSubmit={handleAddRaid} className="bg-[#111722] border border-stone-800/80 rounded-lg p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Objectif / Boss</label>
                    <input type="text" value={newRaidName} onChange={(e) => setNewRaidName(e.target.value)} placeholder="Ex: Ignis le Flamboyant" className="w-full bg-stone-950 border border-stone-800 rounded p-2.5 text-stone-100 text-sm focus:border-amber-500 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Date / Heure prévue</label>
                    <input type="text" value={newRaidDate} onChange={(e) => setNewRaidDate(e.target.value)} placeholder="Ex: Dimanche à 18h" className="w-full bg-stone-950 border border-stone-800 rounded p-2.5 text-stone-100 text-sm focus:border-amber-500 focus:outline-none" />
                  </div>
                  <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-stone-950 font-bold py-2.5 rounded text-sm uppercase tracking-wider font-serif">Déclarer la guerre</button>
                </form>
                <div className="bg-[#111722] border border-stone-800/80 rounded-lg overflow-hidden">
                  {raids.length === 0 ? <p className="p-5 text-sm text-stone-600 italic">Aucun raid prévu face aux forces corrompues.</p> : (
                    <div className="divide-y divide-stone-800/40">
                      {raids.map(raid => (
                        <div key={raid.id} className="p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-amber-500" />
                            <div>
                              <span className="font-bold text-stone-200 block">{raid.name}</span>
                              <span className="text-xs text-stone-500">Rendez-vous : {raid.date}</span>
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

            {/* TAB: GUIDE & IA */}
            {activeTab === 'guide' && (
              <div className="space-y-8">
                <div className="bg-[#131322] border border-purple-900/60 rounded-lg p-5 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-5"><HelpCircle className="w-32 h-32 text-purple-400" /></div>
                  <div className="flex items-center gap-2 mb-4 border-b border-purple-900/40 pb-3">
                    <Key className="w-6 h-6 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
                    <div>
                      <h3 className="font-serif font-bold text-stone-100 uppercase tracking-wider text-base">Grimoire Omniscient IA - Arcane Frontier</h3>
                      <p className="text-xs text-purple-400">Indexé sur 270+ mods, scripts KubeJS et modifications d'expertises RPG.</p>
                    </div>
                  </div>
                  <form onSubmit={askExpertAI} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase mb-1.5">Quelle est ton interrogation, voyageur ?</label>
                      <div className="flex gap-2">
                        <input type="text" value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} placeholder="Ex: Comment fonctionne le système PoE d'objets ? Où est le Nether ?" className="flex-1 bg-stone-950 border border-purple-900/40 rounded p-2.5 text-stone-200 text-sm focus:border-purple-500 focus:outline-none placeholder-stone-700" />
                        <button type="submit" disabled={isAiLoading} className="bg-purple-700 hover:bg-purple-600 disabled:bg-purple-950 text-white font-bold px-5 rounded text-xs uppercase font-serif tracking-wider shrink-0">
                          {isAiLoading ? 'Analyse...' : 'Consulter'}
                        </button>
                      </div>
                    </div>
                  </form>
                  {aiResponse && <div className="mt-4 bg-[#090912] border border-purple-950 p-4 rounded text-sm text-stone-300 font-sans leading-relaxed shadow-inner">{aiResponse}</div>}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-stone-100 uppercase tracking-wide">Vidéolithothèque de la Communauté</h3>
                    <p className="text-sm text-stone-500 mt-1">Partagez les tutoriels cruciaux trouvés sur le net pour automatiser le serveur.</p>
                  </div>
                  <form onSubmit={handleAddGuide} className="bg-[#111722] border border-stone-800/80 rounded-lg p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Titre du guide / Sujet</label>
                      <input type="text" value={guideTitle} onChange={(e) => setGuideTitle(e.target.value)} placeholder="Ex: Tuto Brass Automation - Create" className="w-full bg-stone-950 border border-stone-800 rounded p-2.5 text-stone-100 text-sm focus:border-amber-500 focus:outline-none" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Lien YouTube complet</label>
                      <input type="url" value={guideUrl} onChange={(e) => setGuideUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full bg-stone-950 border border-stone-800 rounded p-2.5 text-stone-100 text-sm focus:border-amber-500 focus:outline-none" required />
                    </div>
                    <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-stone-950 font-bold py-2.5 rounded text-sm uppercase tracking-wider font-serif flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Relayer la vidéo</button>
                  </form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {guides.length === 0 ? <p className="text-sm text-stone-600 italic">Aucune archive vidéo enregistrée pour l'instant.</p> : (
                      guides.map((g) => (
                        <div key={g.id} className="bg-[#111722] border border-stone-800/80 rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 rounded bg-red-500/10 text-red-500 border border-red-500/20"><Youtube className="w-5 h-5" /></div>
                            <div className="overflow-hidden">
                              <h4 className="font-bold text-stone-200 truncate">{g.title}</h4>
                              <a href={g.url} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-500 hover:underline truncate block mt-0.5">{g.url}</a>
                              <span className="text-[10px] text-stone-500 block mt-1 font-mono">Archivé par {g.by}</span>
                            </div>
                          </div>
                          <button onClick={() => setGuides(guides.filter(item => item.id !== g.id))} className="text-stone-600 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

          </main>
        </>
      )}
    </div>
  );
}
