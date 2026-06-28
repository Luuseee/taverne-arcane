import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Beer, Hammer, Shield, Trash2, Check, CheckCircle2, FolderPlus, Package,
  MapPin, RefreshCw, ChevronDown, ChevronUp, ChevronRight,
  BookOpen, LayoutDashboard, Star, Copy,
  Wifi, WifiOff, Search, X, Skull,
  Users, TrendingUp, Sparkles, Server,
  Bell, Moon, Sun, Megaphone, Award, Crown, User
} from 'lucide-react';

// ── Supabase ──────────────────────────────────────────────────────────────
const SUPABASE_URL  = "https://pdndmtktluaggvupgsej.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkbmRtdGt0bHVhZ2d2dXBnc2VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2Mzk5MjEsImV4cCI6MjA5ODIxNTkyMX0.qQT9lrd2hMH1JUD_tm9Odef1B9mMdlFXYNvjXquTm50";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Constantes ────────────────────────────────────────────────────────────
const GUILD_MASTERS = ['Luuse', 'Admin'];
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

const CATEGORIES  = ['Fermes','Base & Déco','Stuff & Équipement','Exploration','Donjon & Boss','Autre'];
const CAT_COLORS  = {
  'Fermes':              'bg-green-900/60  text-green-300  border-green-700/60',
  'Base & Déco':         'bg-amber-900/60  text-amber-300  border-amber-700/60',
  'Stuff & Équipement':  'bg-purple-900/60 text-purple-300 border-purple-700/60',
  'Exploration':         'bg-blue-900/60   text-blue-300   border-blue-700/60',
  'Donjon & Boss':       'bg-red-900/60    text-red-300    border-red-700/60',
  'Autre':               'bg-stone-800/80  text-stone-300  border-stone-600/60',
};
const DIMENSIONS  = ['Surface','Voidsent Forest','Aquamirae','Cave'];
const COORD_TYPES = ['Donjon','Ressource','Base','Boss','Structure'];
const WORLD_TIERS = ['I','II','III','IV','V'];
const QUICK_MATS  = [
  { name:"Plaques d'Acier", max:64 },
  { name:"Tuyaux en Fluide", max:32 },
  { name:"Source Gems", max:64 },
  { name:"Source Jars", max:16 },
  { name:"Blocs d'Andésite", max:128 },
  { name:"Obsidienne", max:64 },
];

const RANKS = [
  { min:0,  label:'Recrue',           color:'text-stone-400',  badge:'🪓' },
  { min:1,  label:'Aventurier',       color:'text-green-400',  badge:'⚔️' },
  { min:3,  label:'Chasseur',         color:'text-blue-400',   badge:'🏹' },
  { min:6,  label:'Vétéran',          color:'text-purple-400', badge:'🛡️' },
  { min:10, label:"Maître d'Arcane",  color:'text-amber-400',  badge:'💎' },
];

const AUTH_PARTICLES = [
  {w:5,l:8,  dur:7,  dl:0   },{w:3,l:17, dur:9,  dl:1.2},{w:6,l:25, dur:6,  dl:2  },
  {w:4,l:33, dur:8,  dl:0.5 },{w:3,l:42, dur:7,  dl:3  },{w:5,l:50, dur:9,  dl:1  },
  {w:4,l:58, dur:6,  dl:2.5 },{w:6,l:67, dur:8,  dl:0.8},{w:3,l:75, dur:7,  dl:1.5},
  {w:5,l:83, dur:9,  dl:0   },{w:4,l:90, dur:6,  dl:2  },{w:3,l:96, dur:8,  dl:1.8},
];
const PART_COLS = ['#e58219','#c96f12','#f59e0b'];

const DAILY_TIPS = [
  "Ne bois jamais d'eau brute — tu attrapes des maladies et ta température chute",
  "Vérifie EMI avant de crafter — plus de 1000 recettes ont été modifiées dans ce pack",
  "Un mob tué par l'environnement (lave, chute, feu) ne donne aucun XP",
  "La faim descend vite : mange avant d'attaquer un donjon ou une grotte profonde",
  "Les gemmes Apotheosis se sockettent dans les items via l'enclume runique",
  "Bois de l'eau purifiée (bouillir dans une marmite) — jamais l'eau des rivières",
  "La température descend la nuit et dans les grottes — porte une armure isolante",
  "Create : andésite alliée → laiton (brass) → précision mécanique. Respecte l'ordre",
  "Iron's Spells : commence par l'École du Feu pour les dégâts de zone en early game",
  "L'Obliterator génère des clones immortels — identifie le vrai par son ombre différente",
  "Ignis lance des météores en rafale : reste en mouvement constant pendant le combat",
  "Les dragons supercharged ont 3 phases — prépare des potions de résistance au feu",
  "La Voidsent Forest est l'endgame — n'y va pas sans full stuff T4 minimum",
  "Sophisticated Backpacks : ajoute un upgrade de tri auto pour gérer ton inventaire",
  "Les Blights corrompent les biomes progressivement — neutralise-les avant qu'ils s'étendent",
  "Les Event Moons renforcent tous les mobs — évite les donjons pendant ces nuits",
  "L'Apotheosis Reforge permet de re-roller les affixes des items légendaires",
  "Create : les Mechanical Arms remplacent les tapis roulants pour les tâches complexes",
  "Consulte l'onglet Chantiers avant de farmer des ressources pour éviter les doublons",
  "Les gemmes Apotheosis combinées en Geode donnent des bonus de set passif très puissants",
];

// ── Guide intégré (11 sections) ───────────────────────────────────────────
const GUIDE = [
  { title:"Démarrage & Survie", icon:"🏕️", content:[
    { t:'tip',  text:"Priorité absolue Jour 1 : construis un abri AVANT la nuit. Les mobs nocturnes sont bien plus dangereux que vanilla." },
    { t:'h',    text:"Les 3 Jauges de Survie" },
    { t:'list', items:["🍖 Faim : descend plus vite que vanilla. Mange régulièrement, surtout après le combat.","💧 Soif : descend en permanence. Ne bois JAMAIS d'eau brute (rivière, lac) — infections garanties.","🌡️ Température : descend la nuit, dans les grottes et sous la pluie. Monte dans les zones arides."]},
    { t:'warn', text:"Boire de l'eau brute cause maladies et chute de température. Fais bouillir l'eau dans une marmite ou utilise des potions d'eau purifiée." },
    { t:'h',    text:"Premiers Craftings Essentiels" },
    { t:'list', items:["Vérifie EMI (touche E) AVANT de crafter — les recettes sont massivement modifiées","Couverture en laine → combat la perte de chaleur la nuit","Marmite + eau de source → eau purifiée buvable","Ne mange jamais cru : malus de faim supplémentaire","Toujours avoir de la nourriture cuite × 20 avant d'explorer"]},
    { t:'info', text:"Le pack désactive le Nether et l'End classiques. L'endgame se déroule dans la Voidsent Forest, une dimension alternative accessible en mid-game." },
  ]},
  { title:"Particularités du Pack", icon:"⚗️", content:[
    { t:'info', text:"Project: Arcane Frontier est un pack expert RPG sur Minecraft 1.20.1 Forge (~280 mods). Tu mourras souvent au début — c'est normal et voulu." },
    { t:'h',    text:"Différences Majeures vs Vanilla" },
    { t:'list', items:["🚫 Nether & End supprimés — aucun portail Nether standard ne fonctionne","🌌 Voidsent Forest : la dimension d'endgame, remplace Nether/End comme zone finale","🔧 1000+ recettes modifiées — toujours checker EMI/JEI avant de crafter","⚔️ Better Combat : combat directionnel, chaque arme a un arc d'impact différent","🌙 Event Moons : nuits spéciales où tous les mobs sont renforcés"]},
    { t:'warn', text:"Ne tente JAMAIS d'ouvrir un portail Nether vanilla — la dimension est remplacée par d'autres zones du pack." },
    { t:'h',    text:"World Tiers (Système de Progression)" },
    { t:'list', items:["Tier I : départ, mobs normaux, loot basique","Tier II : mobs améliorés, premiers affixes intéressants","Tier III : mobs dangereux, bons affixes, donjons difficiles","Tier IV : pré-endgame, Voidsent Forest accessible","Tier V : endgame complet, mobs max level, boss ultimes"]},
    { t:'h',    text:"Events Spéciaux" },
    { t:'list', items:["🌙 Event Moons : tous les mobs +50% HP et dégâts pendant la nuit lunaire","☣️ Blights : corruption de biome qui s'étend — neutralise-les rapidement","🐉 Dragon Events : apparitions aléatoires de dragons sur la carte","⚡ Boss Invasions : boss de raid qui attaquent les bases non protégées"]},
  ]},
  { title:"Combat (Better Combat)", icon:"⚔️", content:[
    { t:'tip',  text:"Better Combat change les règles fondamentales : chaque arme a un arc d'attaque unique. Positionne-toi en conséquence — le spam-click est pénalisé." },
    { t:'h',    text:"Armes et leurs Arcs d'Attaque" },
    { t:'list', items:["Épées : attaque horizontale large (efficace contre plusieurs mobs côte à côte)","Haches : attaque verticale puissante (meilleure contre un seul ennemi fort)","Marteaux : frappe au sol avec zone d'effet, repousse les mobs","Dagues : rapides, courte portée, excellent backstab (dégâts × 1.5 en dos)","Lances/Pioches : longue portée, attaque directe en ligne"]},
    { t:'warn', text:"PIÈGE : spam-clicker comme en vanilla ne fonctionne plus. Le cooldown pénalise les clicks trop rapides — laisse la barre se recharger." },
    { t:'h',    text:"Conseils Tactiques" },
    { t:'list', items:["La parade (touche de bloc) réduit les dégâts et crée une fenêtre de contre","Les attaques de dos font significativement plus de dégâts — contourne les gros mobs","Combo optimal : attaque légère × 3 puis attaque lourde","Changer d'arme selon le type de mob (armure physique vs magique)","Utiliser l'environnement : repousser les mobs dans le vide ou la lave"]},
    { t:'info', text:"Les affixes Apotheosis comme 'Leeching' ou 'Berserking' changent radicalement le style de jeu. Adapte tes tactiques à tes affixes." },
  ]},
  { title:"Minage", icon:"⛏️", content:[
    { t:'warn', text:"Les grottes profondes sont DANGEREUSES : température qui chute, mobs spéciaux du pack, structures pièges. Prépare-toi sérieusement." },
    { t:'h',    text:"Préparation au Mining" },
    { t:'list', items:["Eau purifiée × 10 minimum avant chaque session","Armure avec résistance au froid pour les couches profondes","Torches × 64+ et équipement de survie complet","Potions de résistance et régénération","Pickaxe Fortune III minimum pour le late game"]},
    { t:'h',    text:"Distribution des Minerais (Modifiée)" },
    { t:'list', items:["Fer : Y=0–60 (similaire vanilla)","Or : Y=-32 à -64 (plus profond qu'en vanilla)","Diamant : Y=-64 à -80 (zones extrêmement profondes)","Minerais de mods : checker EMI pour la distribution exacte","Astuce : strip-mine en Y=-57 ET Y=-80 pour couvrir les deux paliers"]},
    { t:'tip',  text:"Construis une station de minage avec Create (Mechanical Drill + convoyeur) pour automatiser l'extraction et doubler le rendement via le Millstone." },
  ]},
  { title:"Fermes à XP", icon:"⭐", content:[
    { t:'tip',  text:"L'XP est CRITIQUE : enchanting, reforge Apotheosis, niveaux de magie Iron's Spells. Build une ferme XP tôt dans ta progression." },
    { t:'warn', text:"RÈGLE ABSOLUE : les mobs tués par l'environnement (lave, chute, feu, piston) ne donnent AUCUN XP. Le coup de grâce doit venir du joueur." },
    { t:'h',    text:"Meilleures Sources d'XP Early" },
    { t:'list', items:["Ferme à Zombies/Squelettes : spawn dans le noir, kill zone accessible","Spawner naturel en grotte : rapide à setup, bon rendement","Donjons explorés activement : XP + loot (mais risque élevé)","Mobs rares (affixes Apotheosis) : 3–5× plus d'XP par kill"]},
    { t:'h',    text:"Apotheosis Spawner Upgrades" },
    { t:'list', items:["Les spawners peuvent être modifiés avec Apotheosis","Spawn Amplifier : augmente le taux et nombre de spawns","Mob Soul : change le type de mob d'un spawner","Les spawners upgradés sont les meilleures fermes XP du pack","Looting III sur ton arme double presque le rendement XP"]},
  ]},
  { title:"Apotheosis & Affixes", icon:"💎", content:[
    { t:'tip',  text:"Apotheosis est LE mod de progression d'équipement du pack. Maîtriser ses mécaniques te donne un avantage décisif sur tous les combats difficiles." },
    { t:'h',    text:"Système d'Affixes" },
    { t:'list', items:["Les items peuvent avoir 0 à 4 affixes selon leur rareté","Rareté : Commun < Uncommon < Rare < Epic < Legendary < Mythic","Offensifs : +dégâts, lifesteal, poison, feu, foudre...","Défensifs : +armure, réduction des dégâts, thorns, regen...","Utilitaires : vitesse, saut, régénération, fortune..."]},
    { t:'h',    text:"Le Système de Reforge" },
    { t:'list', items:["Anvil de Reforge (Apotheosis) : re-roll les affixes d'un item","Coût : lapis lazuli × N selon la rareté de l'item","Peut réduire la rareté si malchanceux — risque calculé","Un item Mythic avec bons affixes est souvent meilleur qu'un Legendary rerollé"]},
    { t:'h',    text:"Gemmes & Socketing" },
    { t:'list', items:["Les gemmes s'insèrent dans les sockets via l'enclume runique","Gemmes offensives : Ruby (feu), Emerald (dégâts), Topaz (foudre)","Gemmes défensives : Diamond (armure), Pearl (résistance)","Les Geodes combinent plusieurs gemmes pour des effets de set","Priorité : socket tes armes AVANT tes armures en early game"]},
    { t:'warn', text:"Ne détruisez pas un item Legendary avec de bons affixes pour en espérer un autre — les légendaires sont rares. Reforge-le à la place." },
  ]},
  { title:"Magie (Iron's Spells)", icon:"🔮", content:[
    { t:'tip',  text:"Iron's Spells offre 9 écoles de magie. Spécialise-toi dans 2–3 maximum pour être vraiment efficace plutôt que de tout débloquer." },
    { t:'h',    text:"Les 9 Écoles de Magie" },
    { t:'list', items:["🔥 Fire Magic : dégâts de zone, boules de feu. Meilleure école DPS en AoE early","❄️ Ice Magic : ralentir, geler, contrôle de foule. Très utile contre les boss mobiles","⚡ Lightning Magic : dégâts rapides en ligne, arcs électriques. Bon DPS mono-cible","🌿 Nature Magic : soins, invocations, buffs. Indispensable pour le rôle support","💀 Blood Magic : sacrifice HP pour la puissance. Risqué mais très fort en late game","🌑 Void/Dark Magic : debuffs, malédictions, dégâts sur la durée","✨ Holy/Light Magic : soins puissants, +dégâts aux undead, buffs d'armure","🌀 Ender Magic : téléportation, manipulation de l'espace, mobilité","💪 Augment Magic : renforce les autres écoles, buffs personnels passifs"]},
    { t:'warn', text:"La Mana est limitée ! N'utilise pas tes sorts puissants en début de donjon — garde-les pour les boss." },
    { t:'h',    text:"Démarrage Magie" },
    { t:'list', items:["Trouver un Spellbook (loot de donjon ou craft avancé)","Équiper un Focus Item dans la main off pour +puissance des sorts","Les sorts consomment de la Mana (régén naturelle lente)","Priorité early : 1 sort offensif + 1 sort de mobilité","Les Mana Potions sont très précieuses — farm les ingrédients"]},
  ]},
  { title:"Sacs (Sophisticated)", icon:"🎒", content:[
    { t:'tip',  text:"Sophisticated Backpacks est INDISPENSABLE pour gérer l'inventaire massif d'un pack avec ~280 mods. Investis dedans dès que possible." },
    { t:'h',    text:"Progression des Sacs" },
    { t:'list', items:["Leather Backpack : +18 slots, portable sur le dos","Iron Backpack : +36 slots + 3 emplacements d'upgrades","Gold Backpack : +54 slots + 6 upgrades","Diamond Backpack : +72 slots + 9 upgrades","Netherite Backpack : +90 slots + 12 upgrades (endgame)"]},
    { t:'h',    text:"Upgrades Essentiels" },
    { t:'list', items:["Pickup Upgrade : auto-collecte les items au sol selon filtre configuré","Filter Upgrade : contrôle quels items entrent dans le sac","Sorting Upgrade : trie automatiquement le contenu du sac","Crafting Upgrade : crafting directement dans le sac (sans établi séparé)","Feeding Upgrade : mange automatiquement depuis le sac quand la faim descend","Smelting Upgrade : fond les minerais automatiquement lors de la collecte"]},
    { t:'warn', text:"Ne mets jamais ton sac principal dans un autre sac (boucle infinie) — risque de lag serveur ou crash client." },
  ]},
  { title:"Create", icon:"⚙️", content:[
    { t:'tip',  text:"Create est le mod d'automatisation central du pack. La progression Andésite → Laiton → Précision est OBLIGATOIRE pour progresser vers l'endgame." },
    { t:'h',    text:"Progression Create (3 Phases)" },
    { t:'list', items:["Phase 1 — Andésite : premiers mécanismes, roues à eau, moulins basiques","Phase 2 — Laiton (Brass) : Mixer, Deployer, Intelligence Mécanique, automatisation complexe","Phase 3 — Précision : Trains, Contraptions avancées, automatisation totale"]},
    { t:'h',    text:"Machines Clés" },
    { t:'list', items:["Millstone : broyer des matériaux en poudre (ore doubling early game)","Mechanical Press : estamper des plaques, comprimer des blocs","Mixer : mélanger fluides et solides (indispensable pour craft le laiton)","Depot + Mechanical Arm : bras robotique pour déplacer et assembler","Basin : contenant pour les recettes liquides et mélanges","Encased Fan : souffler/aspirer/filtrer/chauffer des items"]},
    { t:'warn', text:"ATTENTION aux Stress Units : dépasser la capacité de tes sources stoppe TOUT le réseau. Surveille le ratio avec le Network Analyzer." },
  ]},
  { title:"Boss & Dangers", icon:"💀", content:[
    { t:'warn', text:"TOUS les boss de ce pack sont significativement plus dangereux que dans leurs mods d'origine. Prépare-toi sérieusement avant chaque tentative." },
    { t:'h',    text:"Boss Notables" },
    { t:'list', items:["⚡ Obliterator : génère des clones immortels. Identifie le vrai par son ombre. Tue les clones EN DERNIER ou ils se régénèrent","☄️ Ignis : invoque des météores constants. Reste en mouvement. Couvre-toi contre les chutes","🐉 Dragons Supercharged : 3 phases (normal → chargé → fury). Potions feu OBLIGATOIRES","💀 Lich (Apotheosis) : invoque des serviteurs, immunité aux sorts en phase 2","🕷️ Spiders of Arachne : venin multi-stacks, grille de toiles ralentissante"]},
    { t:'h',    text:"Checklist Avant un Boss" },
    { t:'list', items:["Potions de Régénération II × 5 minimum","Potions de Résistance au Feu (pour les boss de feu/dragons)","Nourriture haute saturation × 20","Eau purifiée × 10","Équipement réparé avec bons affixes et gemmes sockettées","Un plan d'évacuation si ça tourne mal"]},
    { t:'tip',  text:"Pour l'Obliterator : focus les clones UN PAR UN. Ne tue jamais deux clones simultanément. Laisse le vrai pour la toute fin du combat." },
  ]},
  { title:"Performance & Conseils", icon:"🖥️", content:[
    { t:'h',    text:"Optimisation FPS" },
    { t:'list', items:["Render distance : 6–8 chunks maximum recommandé pour ~280 mods","Désactive les ombres dynamiques en début de partie si FPS < 30","Sodium/Rubidium (inclus) : ajuste les paramètres dans Video Settings","Réduis les particules : Options → Video Settings → Particles → Minimal","Entity Culling (inclus) : améliore significativement les FPS avec beaucoup d'entités"]},
    { t:'h',    text:"Mémoire RAM Java" },
    { t:'list', items:["Minimum : 8 Go alloués à Java (en dessous = crashes fréquents)","Recommandé : 10–12 Go pour les sessions longues","N'alloue pas plus de 16 Go (les pauses du GC deviennent problématiques)","Utilise les flags JVM optimisés (Aikar's Flags) dans ton launcher"]},
    { t:'warn', text:"Si le serveur lag : identifie quelle machine Create surconsomme avec le Network Analyzer et optimise ou déconnecte temporairement." },
    { t:'tip',  text:"Bookmark cette app sur ton téléphone pour consulter le guide et les coordonnées sans alt-tab depuis Minecraft." },
  ]},
];

// ── Utilitaires ───────────────────────────────────────────────────────────
function parseCategory(raw) {
  if (!raw) return { cat:'Autre', resources:[] };
  const SEP = '|||';
  const idx = raw.indexOf(SEP);
  if (idx !== -1) {
    const cat = raw.substring(0, idx) || 'Autre';
    try { return { cat, resources: JSON.parse(raw.substring(idx + SEP.length)) }; }
    catch { return { cat, resources:[] }; }
  }
  if (raw.startsWith('[')) {
    try { return { cat:'Autre', resources: JSON.parse(raw) }; }
    catch {}
  }
  return { cat: raw, resources:[] };
}
function encodeCategory(cat, resources) { return `${cat}|||${JSON.stringify(resources)}`; }

function playBell() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [[880,0],[660,0.15],[440,0.3]].forEach(([freq,t]) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + t);
      osc.frequency.exponentialRampToValueAtTime(freq*0.5, ctx.currentTime + t + 0.9);
      gain.gain.setValueAtTime(0.22, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 1.2);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 1.2);
    });
  } catch {}
}

// ── Composant Guide Content ───────────────────────────────────────────────
function GuideBlock({ block }) {
  if (block.t === 'tip')  return <div className="border-l-4 border-amber-500 bg-amber-900/20 px-4 py-2.5 rounded-r text-amber-200 text-xs leading-relaxed">💡 {block.text}</div>;
  if (block.t === 'warn') return <div className="border-l-4 border-red-500 bg-red-900/20 px-4 py-2.5 rounded-r text-red-300 text-xs leading-relaxed font-semibold">⚠️ {block.text}</div>;
  if (block.t === 'info') return <div className="border-l-4 border-blue-500 bg-blue-900/20 px-4 py-2.5 rounded-r text-blue-200 text-xs leading-relaxed">ℹ️ {block.text}</div>;
  if (block.t === 'h')    return <h4 className="text-stone-100 font-bold font-serif text-sm mt-4 mb-1 flex items-center gap-1"><ChevronRight className="w-3.5 h-3.5 text-amber-500"/>{block.text}</h4>;
  if (block.t === 'list') return <ul className="space-y-1.5 pl-2">{block.items.map((it,i)=><li key={i} className="text-xs text-stone-300 flex gap-2"><span className="text-amber-600 mt-0.5">•</span><span>{it}</span></li>)}</ul>;
  return null;
}

// ── App principal ─────────────────────────────────────────────────────────
export default function App() {
  const [isRegistered, setIsRegistered] = useState(() =>
    !!(localStorage.getItem('taverne_pseudo') && localStorage.getItem('taverne_registered'))
  );
  const [userPseudo, setUserPseudo] = useState(() => localStorage.getItem('taverne_pseudo') || '');

  const [activeTab,  setActiveTab]  = useState('dashboard');
  const [syncing,    setSyncing]    = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [toast,      setToast]      = useState(null);
  const syncingRef = useRef(false);

  // ── Données cloud ──
  const [projets,     setProjets]     = useState([]);
  const [coordonnees, setCoordonnees] = useState([]);
  const [raids,       setRaids]       = useState([]);
  const [trophees,    setTrophees]    = useState([]);
  const [aventuriers, setAventuriers] = useState([]);
  const [annonces,    setAnnonces]    = useState([]);
  const [serverStatus,setServerStatus]= useState(null);

  // ── Formulaires Chantiers ──
  const [newProjetName, setNewProjetName] = useState('');
  const [newProjetCat,  setNewProjetCat]  = useState('Autre');
  const [expandedProjet,setExpandedProjet]= useState(null);
  const [resName, setResName] = useState('');
  const [resMax,  setResMax]  = useState(64);
  const [filterCat,      setFilterCat]      = useState('Tous');
  const [hideCompleted,  setHideCompleted]  = useState(false);

  // ── Formulaires Coordonnées ──
  const [coordNom,  setCoordNom]  = useState('');
  const [coordX,    setCoordX]    = useState('');
  const [coordY,    setCoordY]    = useState('');
  const [coordZ,    setCoordZ]    = useState('');
  const [coordDim,  setCoordDim]  = useState('Surface');
  const [coordType, setCoordType] = useState('Structure');
  const [coordNote, setCoordNote] = useState('');
  const [filterDim,  setFilterDim]  = useState('Tous');
  const [filterCType,setFilterCType]= useState('Tous');

  // ── Formulaires Raids ──
  const [newRaidName, setNewRaidName] = useState('');
  const [newRaidDate, setNewRaidDate] = useState('');

  // ── Formulaires Trophées ──
  const [tropheeBoss, setTropheeBoss] = useState('');
  const [tropheeTier, setTropheeTier] = useState('I');

  // ── Guide ──
  const [activeSection, setActiveSection] = useState(0);
  const [guideSearch,   setGuideSearch]   = useState('');

  // ── Annonces (GM) ──
  const [newAnnonce,    setNewAnnonce]    = useState('');
  const [annonceUrgent, setAnnonceUrgent] = useState(false);

  // ── Nouvelles features ──
  const [moonMode,    setMoonMode]    = useState(() => localStorage.getItem('taverne_moon') === 'true');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [shaking,       setShaking]       = useState(false);
  const [titleClicks,   setTitleClicks]   = useState(0);
  const [skullClicks,   setSkullClicks]   = useState(0);

  const prevCountsRef = useRef({ trophees: -1, raids: -1, annonces: -1 });
  const eggTimerRef   = useRef(null);
  const skullTimerRef = useRef(null);
  const notifRef      = useRef(null);

  // ── Computed ──
  const isGM = GUILD_MASTERS.includes(userPseudo);
  const myProjets  = projets.filter(p => p.createdBy === userPseudo);
  const myTrophees = trophees.filter(t => t.killed_by === userPseudo);
  const totalActivity = myProjets.length + myTrophees.length;
  const guildRank = isGM
    ? { label:'Maître de Guilde', color:'text-amber-400', badge:'👑' }
    : ([...RANKS].reverse().find(r => totalActivity >= r.min) || RANKS[0]);

  // ── Toast helper ──
  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2600);
  }

  // ── Effets ───────────────────────────────────────────────────────────────

  // Persist moon mode
  useEffect(() => { localStorage.setItem('taverne_moon', moonMode); }, [moonMode]);

  // Notifications tracking
  useEffect(() => {
    if (prevCountsRef.current.trophees === -1) {
      prevCountsRef.current = { trophees: trophees.length, raids: raids.length, annonces: annonces.length };
      return;
    }
    const notifs = [];
    if (trophees.length > prevCountsRef.current.trophees) {
      const n = trophees.length - prevCountsRef.current.trophees;
      notifs.push({ id: Date.now(), msg: `${n} nouveau${n>1?'x':''} trophée${n>1?'s':''} décroché${n>1?'s':''} !`, icon:'💀' });
    }
    if (raids.length > prevCountsRef.current.raids && raids[0]) {
      notifs.push({ id: Date.now()+1, msg: `Nouveau raid planifié : ${raids[0].name}`, icon:'⚔️' });
    }
    if (annonces.length > prevCountsRef.current.annonces && annonces[0]) {
      notifs.push({ id: Date.now()+2, msg: annonces[0].message, icon:'📢' });
    }
    if (notifs.length) {
      setNotifications(prev => [...notifs, ...prev].slice(0, 10));
      setUnreadCount(prev => prev + notifs.length);
      if (notifs.some(n => n.icon === '💀')) playBell();
    }
    prevCountsRef.current = { trophees: trophees.length, raids: raids.length, annonces: annonces.length };
  }, [trophees.length, raids.length, annonces.length]);

  // Konami code easter egg
  useEffect(() => {
    let prog = 0;
    const h = (e) => {
      prog = (e.key === KONAMI[prog]) ? prog + 1 : (e.key === KONAMI[0] ? 1 : 0);
      if (prog === KONAMI.length) {
        prog = 0;
        triggerScreenShake();
        showToast('🐉 CHEAT CODE : Dragons Supercharged invoqués ! (dans ta tête)', 'error');
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // Close notif panel on outside click
  useEffect(() => {
    const h = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Auto-sync
  useEffect(() => {
    if (!isRegistered) return;
    loadData();
    const interval = setInterval(loadData, 20000);
    return () => clearInterval(interval);
  }, [isRegistered]);

  // ── Easter eggs ──────────────────────────────────────────────────────────
  function triggerScreenShake() {
    setShaking(true);
    setTimeout(() => setShaking(false), 950);
  }

  function handleTitleClick() {
    clearTimeout(eggTimerRef.current);
    setTitleClicks(prev => {
      const next = prev + 1;
      if (next >= 5) {
        triggerScreenShake();
        showToast("💀 L'Obliterator approche... identifie son ombre !", 'error');
        return 0;
      }
      return next;
    });
    eggTimerRef.current = setTimeout(() => setTitleClicks(0), 2000);
  }

  function handleSkullClick() {
    clearTimeout(skullTimerRef.current);
    setSkullClicks(prev => {
      const next = prev + 1;
      if (next >= 3) {
        triggerScreenShake();
        showToast("☠️ L'écho des boss vaincus résonne dans la taverne !", 'error');
        return 0;
      }
      return next;
    });
    skullTimerRef.current = setTimeout(() => setSkullClicks(0), 1500);
  }

  // ── Chargement des données ────────────────────────────────────────────────
  async function loadData() {
    if (syncingRef.current) return;
    syncingRef.current = true;
    setSyncing(true);
    try {
      const { data: cData, error: cErr } = await supabase
        .from('projets_state').select('*').order('id', { ascending: false });
      if (cErr) console.error('projets_state:', cErr);
      if (cData) {
        setProjets(cData.map(item => {
          const { cat, resources } = parseCategory(item.category);
          return { id: item.id, name: item.name, cat, status: item.current === 999 ? 'Terminé' : 'En Cours', resources, createdBy: item.by || 'Inconnu' };
        }));
      }

      const { data: tData } = await supabase.from('trouvailles').select('*').order('id', { ascending: false });
      if (tData) {
        setCoordonnees(tData
          .filter(t => t.type && t.type.startsWith('coord_'))
          .map(t => {
            let parsed = {};
            try { parsed = JSON.parse(t.coords || '{}'); } catch {}
            return { id: t.id, name: t.name, x: parsed.x||'?', y: parsed.y||'?', z: parsed.z||'?', dim: t.type.replace('coord_',''), type: t.rarity || 'Structure', by: t.by, note: parsed.note||'' };
          }));
      }

      const { data: rData } = await supabase.from('raids').select('*').order('id', { ascending: false });
      if (rData) setRaids(rData);

      try {
        const { data: trData } = await supabase.from('trophees').select('*').order('id', { ascending: false });
        if (trData) setTrophees(trData);
      } catch {}

      const { data: aData } = await supabase.from('aventuriers').select('*').order('id', { ascending: false }).limit(20);
      if (aData) setAventuriers(aData);

      try {
        const { data: anData } = await supabase.from('annonces').select('*').order('id', { ascending: false }).limit(5);
        if (anData) setAnnonces(anData);
      } catch { setAnnonces([]); }

      try {
        const { data: ssData, error: ssErr } = await supabase.from('serveur_status').select('online').limit(1);
        if (!ssErr && ssData && ssData.length > 0) setServerStatus(ssData[0].online);
        else if (ssErr) setServerStatus(null);
      } catch { setServerStatus(null); }

    } catch (err) {
      console.error('Erreur critique sync:', err);
    }
    setSyncing(false);
    setLoading(false);
    syncingRef.current = false;
  }

  // ── Login ────────────────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    const clean = userPseudo.trim();
    if (!clean) return;
    localStorage.setItem('taverne_registered', 'true');
    localStorage.setItem('taverne_pseudo', clean);
    await supabase.from('aventuriers').insert([{ pseudo: clean }], { ignoreDuplicates: true });
    setIsRegistered(true);
  };

  const handleLogout = () => { localStorage.clear(); setIsRegistered(false); setUserPseudo(''); };

  // ── Statut serveur ──────────────────────────────────────────────────────
  const handleToggleServer = async () => {
    const next = serverStatus === null ? true : !serverStatus;
    setServerStatus(next);
    try { await supabase.from('serveur_status').upsert([{ id:1, online:next }], { onConflict:'id' }); }
    catch {}
  };

  // ── Annonces ─────────────────────────────────────────────────────────────
  const handleAddAnnonce = async (e) => {
    e.preventDefault();
    if (!newAnnonce.trim() || !isGM) return;
    const a = { message: newAnnonce.trim(), by: userPseudo, urgent: annonceUrgent };
    try {
      const { data, error } = await supabase.from('annonces').insert([a]).select().single();
      if (!error && data) setAnnonces(prev => [data, ...prev]);
      else setAnnonces(prev => [{ ...a, id: Date.now() }, ...prev]);
    } catch {
      setAnnonces(prev => [{ ...a, id: Date.now() }, ...prev]);
    }
    setNewAnnonce(''); setAnnonceUrgent(false);
  };

  const handleDeleteAnnonce = async (id) => {
    setAnnonces(prev => prev.filter(a => a.id !== id));
    try { await supabase.from('annonces').delete().eq('id', id); } catch {}
  };

  // ── Projets ──────────────────────────────────────────────────────────────
  const handleCreateProjet = async (e) => {
    e.preventDefault();
    if (!newProjetName.trim()) return;
    const { error } = await supabase.from('projets_state').insert([{
      name: newProjetName.trim(), category: encodeCategory(newProjetCat, []),
      current: 0, max: 100, by: userPseudo,
    }]);
    if (error) { showToast('Erreur Supabase : ' + error.message, 'error'); return; }
    setNewProjetName(''); setNewProjetCat('Autre');
    await loadData();
  };

  const syncProjetToCloud = async (p) => {
    try {
      await supabase.from('projets_state').update({
        name: p.name, category: encodeCategory(p.cat || 'Autre', p.resources),
        current: p.status === 'Terminé' ? 999 : 0, max: 100, by: p.createdBy,
      }).eq('id', p.id);
    } catch (err) { console.error('Sync projet:', err); }
  };

  const handleAddResource = (projetId, name, maxQty) => {
    if (!name.trim()) return;
    setProjets(prev => prev.map(p => {
      if (p.id !== projetId) return p;
      const newRes = { id: Date.now() + Math.random(), name: name.trim(), current: 0, max: parseInt(maxQty)||64 };
      const updated = { ...p, resources: [...p.resources, newRes] };
      syncProjetToCloud(updated);
      return updated;
    }));
    setResName('');
  };

  const handleUpdateResQty = (projetId, resId, delta) => {
    setProjets(prev => prev.map(p => {
      if (p.id !== projetId) return p;
      const wasAllDone = p.resources.length > 0 && p.resources.every(r => r.current >= r.max);
      const updRes = p.resources.map(r => {
        if (r.id !== resId) return r;
        return { ...r, current: Math.max(0, Math.min(r.max, r.current + delta)) };
      });
      const isNowAllDone = updRes.length > 0 && updRes.every(r => r.current >= r.max);
      if (!wasAllDone && isNowAllDone) { playBell(); triggerScreenShake(); showToast('🎉 Toutes les ressources rassemblées !'); }
      const updated = { ...p, resources: updRes };
      syncProjetToCloud(updated);
      return updated;
    }));
  };

  const handleDeleteResource = (projetId, resId) => {
    setProjets(prev => prev.map(p => {
      if (p.id !== projetId) return p;
      const updated = { ...p, resources: p.resources.filter(r => r.id !== resId) };
      syncProjetToCloud(updated);
      return updated;
    }));
  };

  const handleToggleProjetStatus = (projetId) => {
    setProjets(prev => prev.map(p => {
      if (p.id !== projetId) return p;
      const updated = { ...p, status: p.status === 'Terminé' ? 'En Cours' : 'Terminé' };
      if (updated.status === 'Terminé') { playBell(); showToast('✅ Chantier marqué terminé !'); }
      syncProjetToCloud(updated);
      return updated;
    }));
  };

  const handleDeleteProjet = async (projetId) => {
    if (!confirm('Supprimer définitivement ce chantier ?')) return;
    setProjets(prev => prev.filter(p => p.id !== projetId));
    await supabase.from('projets_state').delete().eq('id', projetId);
  };

  // ── Coordonnées ──────────────────────────────────────────────────────────
  const handleAddCoord = async (e) => {
    e.preventDefault();
    if (!coordNom.trim()) return;
    const entry = {
      type: `coord_${coordDim}`, name: coordNom.trim(),
      coords: JSON.stringify({ x: coordX, y: coordY, z: coordZ, note: coordNote }),
      by: userPseudo, rarity: coordType,
    };
    await supabase.from('trouvailles').insert([entry]);
    setCoordNom(''); setCoordX(''); setCoordY(''); setCoordZ(''); setCoordNote('');
    await loadData();
    showToast('📍 Coordonnées enregistrées !');
  };

  const handleDeleteCoord = async (id) => {
    setCoordonnees(prev => prev.filter(c => c.id !== id));
    await supabase.from('trouvailles').delete().eq('id', id);
  };

  const copyCoords = (c) => {
    navigator.clipboard.writeText(`${c.name} — X: ${c.x} Y: ${c.y} Z: ${c.z} [${c.dim}]`);
    showToast('📋 Coordonnées copiées !');
  };

  // ── Raids ─────────────────────────────────────────────────────────────────
  const handleAddRaid = async (e) => {
    e.preventDefault();
    if (!newRaidName.trim()) return;
    const r = { id: Date.now(), name: newRaidName, date: newRaidDate || 'À définir', status: 'En préparation' };
    setRaids(prev => [r, ...prev]);
    setNewRaidName(''); setNewRaidDate('');
    await supabase.from('raids').insert([r]);
    showToast('⚔️ Raid planifié !');
  };

  const handleDeleteRaid = async (id) => {
    setRaids(prev => prev.filter(r => r.id !== id));
    await supabase.from('raids').delete().eq('id', id);
  };

  // ── Trophées ──────────────────────────────────────────────────────────────
  const handleAddTrophee = async (e) => {
    e.preventDefault();
    if (!tropheeBoss.trim()) return;
    const t = { boss: tropheeBoss.trim(), killed_by: userPseudo, date: new Date().toLocaleDateString('fr-FR'), tier: tropheeTier };
    try {
      const { error } = await supabase.from('trophees').insert([t]);
      if (!error) setTrophees(prev => [{ ...t, id: Date.now() }, ...prev]);
      else setTrophees(prev => [{ ...t, id: Date.now() }, ...prev]);
    } catch {
      setTrophees(prev => [{ ...t, id: Date.now() }, ...prev]);
    }
    setTropheeBoss('');
    playBell();
    showToast('💀 Boss terrassé ! Gloire éternelle !');
  };

  // ── Dashboard helpers ─────────────────────────────────────────────────────
  const totalProjets   = projets.length;
  const enCours        = projets.filter(p => p.status !== 'Terminé').length;
  const termines       = projets.filter(p => p.status === 'Terminé').length;
  const globalProgress = totalProjets === 0 ? 0 : Math.round(
    projets.reduce((acc, p) => {
      if (p.status === 'Terminé') return acc + 100;
      if (!p.resources.length) return acc;
      return acc + (p.resources.reduce((a,r) => a + Math.min(r.current/r.max,1), 0) / p.resources.length) * 100;
    }, 0) / totalProjets
  );
  const todayTip  = DAILY_TIPS[new Date().getDate() % DAILY_TIPS.length];
  const lastRaid  = raids[0];
  const lastCoord = coordonnees[0];

  const projetsFiltres = projets
    .filter(p => filterCat === 'Tous' || p.cat === filterCat)
    .filter(p => !hideCompleted || p.status !== 'Terminé');

  const coordsFiltrees = coordonnees
    .filter(c => filterDim === 'Tous' || c.dim === filterDim)
    .filter(c => filterCType === 'Tous' || c.type === filterCType);

  const guideSectionsFiltered = GUIDE.filter(s =>
    !guideSearch.trim() || s.title.toLowerCase().includes(guideSearch.toLowerCase()) ||
    s.content.some(b => (b.text||'').toLowerCase().includes(guideSearch.toLowerCase()) || (b.items||[]).some(i => i.toLowerCase().includes(guideSearch.toLowerCase())))
  );

  // ── ÉCRAN DE CONNEXION ───────────────────────────────────────────────────
  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-[#0d0907] text-[#e7dbcf] flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{ backgroundImage:'radial-gradient(circle at center,#1c130e 0%,#0d0907 100%)' }}>
        {AUTH_PARTICLES.map((p, i) => (
          <div key={i} className="particle" style={{
            width: p.w + 'px', height: p.w + 'px',
            left: p.l + '%', bottom: '-10px',
            background: PART_COLS[i % 3],
            animationDuration: p.dur + 's',
            animationDelay: p.dl + 's',
          }}/>
        ))}
        <div className="bg-[#150e0b]/90 backdrop-blur-sm p-8 rounded-xl border border-[#38261c] shadow-2xl max-w-md w-full text-center space-y-6 relative z-10">
          <div className="inline-flex p-3 bg-[#e58219]/10 rounded-full border border-[#e58219]/20">
            <Beer className="w-10 h-10 text-[#e58219]"/>
          </div>
          <div>
            <h2 className="text-2xl font-serif font-black text-white uppercase tracking-wider">Taverne d'Arcane Frontier</h2>
            <p className="text-xs text-stone-400 mt-1">Identifiez-vous pour accéder aux registres de la guilde.</p>
          </div>
          <form onSubmit={handleRegister} className="space-y-3">
            <input type="text" value={userPseudo} onChange={e=>setUserPseudo(e.target.value)}
              placeholder="Votre pseudo Minecraft exact"
              className="w-full bg-[#0a0605] border border-[#3e2a1e] rounded-lg p-3 text-sm text-white text-center focus:outline-none focus:border-[#e58219] font-medium" required/>
            <button type="submit" className="w-full bg-[#e58219] hover:bg-[#c96f12] text-stone-950 font-serif font-bold p-3 rounded-lg text-xs uppercase tracking-widest transition-all">
              S'installer à la table
            </button>
          </form>
          <div className="text-[10px] text-stone-500 font-mono pt-2 border-t border-[#271a13]">Synchro Cloud — Supabase Engine</div>
        </div>
      </div>
    );
  }

  // ── PANEL PRINCIPAL ──────────────────────────────────────────────────────
  const TABS = [
    { id:'dashboard',   label:'Tableau de Bord', icon:LayoutDashboard },
    { id:'chantiers',   label:'Chantiers',        icon:Hammer },
    { id:'coordonnees', label:'Coordonnées',      icon:MapPin },
    { id:'raids',       label:'Raids & Boss',     icon:Shield },
    { id:'guides',      label:'Guide',            icon:BookOpen },
    { id:'profil',      label:'Profil',           icon:User },
  ];

  return (
    <div className={`min-h-screen text-stone-300 font-sans antialiased ${shaking ? 'screen-shake' : ''}`}
      style={{ backgroundColor: moonMode ? '#02040f' : '#090605' }}>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[200] px-4 py-3 rounded-lg border text-sm font-bold shadow-2xl transition-all ${toast.type==='error' ? 'bg-red-950 border-red-700 text-red-200' : 'bg-[#1c3022] border-emerald-700 text-emerald-300'}`}>
          {toast.msg}
        </div>
      )}

      {/* Moon Night banner */}
      {moonMode && (
        <div className="bg-indigo-950/90 border-b border-indigo-700/50 px-4 py-1.5 text-center">
          <span className="text-[11px] font-bold font-mono uppercase tracking-widest text-indigo-300">
            🌙 NUIT DE LUNE ACTIVE — Tous les mobs sont renforcés. Évitez les donjons !
          </span>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-[#291b12] px-4 lg:px-8 py-3 sticky top-0 z-50"
        style={{ backgroundColor: moonMode ? '#060910' : '#120d0a' }}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Hammer className="text-[#e58219] w-5 h-5"/>
            <div>
              <h1 onClick={handleTitleClick} className="text-sm font-black text-stone-100 uppercase tracking-wider font-serif cursor-default select-none"
                title="Arcane Frontier — Panel de Guilde">
                Arcane Frontier — Panel de Guilde
              </h1>
              <p className="text-[10px] text-stone-500 font-mono uppercase tracking-widest">Base de données globale</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {/* Statut serveur */}
            <button onClick={handleToggleServer} title="Basculer le statut serveur"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-mono font-bold text-[11px] transition-all ${serverStatus === true ? 'bg-emerald-900/40 border-emerald-700 text-emerald-400' : serverStatus === false ? 'bg-red-900/40 border-red-700 text-red-400' : 'bg-stone-900/40 border-stone-700 text-stone-500'}`}>
              {serverStatus === true ? <Wifi className="w-3.5 h-3.5"/> : serverStatus === false ? <WifiOff className="w-3.5 h-3.5"/> : <Server className="w-3.5 h-3.5"/>}
              {serverStatus === true ? 'En ligne' : serverStatus === false ? 'Hors ligne' : 'Statut inconnu'}
            </button>

            {/* Moon mode toggle */}
            <button onClick={() => setMoonMode(m => !m)} title={moonMode ? 'Désactiver la Nuit de Lune' : 'Activer la Nuit de Lune'}
              className={`flex items-center justify-center w-8 h-8 rounded-lg border font-mono font-bold text-[11px] transition-all ${moonMode ? 'bg-indigo-900/50 border-indigo-600 text-indigo-300' : 'bg-[#1a130f] border-[#352018] text-stone-400 hover:text-amber-400'}`}>
              {moonMode ? <Moon className="w-3.5 h-3.5"/> : <Sun className="w-3.5 h-3.5"/>}
            </button>

            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => { setNotifOpen(o => !o); setUnreadCount(0); }}
                className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#1a130f] border border-[#352018] text-stone-400 hover:text-amber-400 transition-colors">
                <Bell className="w-3.5 h-3.5"/>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {Math.min(unreadCount, 9)}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute top-10 right-0 w-72 bg-[#1a130f] border border-[#352018] rounded-xl shadow-2xl z-[100] overflow-hidden">
                  <div className="px-3 py-2 border-b border-[#2a1d14] flex items-center justify-between">
                    <span className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">Notifications</span>
                    {notifications.length > 0 && (
                      <button onClick={() => setNotifications([])} className="text-[10px] text-stone-600 hover:text-stone-400">Tout effacer</button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div className="px-3 py-4 text-xs text-stone-600 italic text-center">Aucune nouvelle notification.</div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto divide-y divide-[#1e140c]">
                      {notifications.map(n => (
                        <div key={n.id} className="px-3 py-2.5 flex items-start gap-2 hover:bg-[#110c09] transition-colors">
                          <span className="text-base flex-shrink-0">{n.icon}</span>
                          <p className="text-[11px] text-stone-300 leading-relaxed">{n.msg}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sync */}
            <button onClick={loadData} disabled={syncing} title="Synchroniser"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1a130f] border border-[#352018] text-stone-400 hover:text-amber-400 transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`}/>
              <span className="font-mono text-[11px]">Sync</span>
            </button>

            <div className={`border rounded-lg px-2.5 py-1.5 font-bold font-mono text-[11px] flex items-center gap-1.5 ${isGM ? 'bg-amber-900/20 border-amber-600/40 text-amber-400' : 'bg-[#e58219]/10 border-[#e58219]/30 text-[#e58219]'}`}>
              {isGM ? <Crown className="w-3 h-3"/> : null}
              {userPseudo}
            </div>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-400 font-mono text-[11px] underline">Changer</button>
          </div>
        </div>
      </header>

      {/* Announcement ticker */}
      {annonces.length > 0 && (
        <div className={`border-b overflow-hidden py-1.5 ${annonces.some(a=>a.urgent) ? 'bg-red-950/40 border-red-800/40' : 'bg-amber-900/20 border-amber-800/30'}`}>
          <div className="flex items-center gap-3 px-4">
            <Megaphone className={`w-3.5 h-3.5 flex-shrink-0 ${annonces.some(a=>a.urgent) ? 'text-red-400' : 'text-amber-400'}`}/>
            <div className="overflow-hidden flex-1">
              <div className="marquee-track text-xs font-medium" style={{ color: annonces.some(a=>a.urgent) ? '#fca5a5' : '#fde68a' }}>
                {annonces.map((a, i) => (
                  <span key={a.id}>
                    {a.urgent ? '⚠️ ' : '📢 '}{a.message}
                    <span className="opacity-50 mx-2">— {a.by}</span>
                    {i < annonces.length - 1 ? <span className="mx-4 opacity-30">✦</span> : null}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onglets */}
      <div className="border-b border-[#291b12]/60 px-4 lg:px-8 overflow-x-auto"
        style={{ backgroundColor: moonMode ? '#060910' : '#120d0a' }}>
        <div className="max-w-7xl mx-auto flex space-x-1 py-1 min-w-max">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const sel = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap ${sel ? 'bg-[#e58219] text-stone-950 font-black' : 'text-stone-500 hover:text-stone-300 hover:bg-[#1a130f]'}`}>
                <Icon className="w-3.5 h-3.5"/>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {loading ? (
          <div className="text-center py-24 space-y-4">
            <div className="text-xs font-mono text-[#e58219] uppercase tracking-widest flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin"/> Synchronisation des tables de guilde...
            </div>
            <div className="max-w-xs mx-auto h-1 bg-[#1a130f] rounded-full overflow-hidden">
              <div className="loading-bar h-full bg-gradient-to-r from-amber-700 to-amber-400 rounded-full"/>
            </div>
          </div>
        ) : (

        /* ═══════════════════════════════════════════════════════
           TABLEAU DE BORD
        ═══════════════════════════════════════════════════════ */
        activeTab === 'dashboard' && (
          <div className="tab-fade space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label:'Projets en cours',   value: enCours,          color:'text-amber-400',   bg:'from-amber-900/20' },
                { label:'Projets terminés',   value: termines,         color:'text-emerald-400', bg:'from-emerald-900/20' },
                { label:'Coordonnées',         value: coordonnees.length, color:'text-blue-400',  bg:'from-blue-900/20' },
                { label:'Trophées décrochés', value: trophees.length,  color:'text-purple-400',  bg:'from-purple-900/20' },
              ].map((s,i) => (
                <div key={i} className={`bg-gradient-to-b ${s.bg} to-transparent bg-[#120d0a] border border-[#2a1d14] rounded-xl p-4 text-center`}>
                  <div className={`text-3xl font-black font-serif ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] text-stone-500 uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Progression globale */}
            <div className="bg-[#120d0a] border border-[#2a1d14] rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-amber-500"/> Progression globale de la guilde</span>
                <span className="text-amber-400 font-black font-mono">{globalProgress}%</span>
              </div>
              <div className="w-full bg-[#070504] h-3 rounded-full border border-[#21160e] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all" style={{width:`${globalProgress}%`}}/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Aventuriers */}
              <div className="bg-[#120d0a] border border-[#2a1d14] rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-amber-500"/> Aventuriers de la guilde</h3>
                {aventuriers.length === 0 ? <p className="text-stone-600 text-xs italic">Aucun aventurier enregistré.</p> : (
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(aventuriers.map(a => a.pseudo))].map((p,i) => (
                      <span key={i} className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border ${GUILD_MASTERS.includes(p) ? 'bg-amber-900/30 border-amber-600/40 text-amber-300' : 'bg-[#1a130f] border-[#352018] text-stone-300'}`}>
                        {GUILD_MASTERS.includes(p) ? '👑' : '👤'} {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Dernières activités */}
              <div className="bg-[#120d0a] border border-[#2a1d14] rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-500"/> Dernières Activités</h3>
                <div className="space-y-2 text-xs">
                  {lastRaid ? (
                    <div className="flex items-center gap-2 text-stone-300">
                      <Shield className="w-3.5 h-3.5 text-red-400 flex-shrink-0"/>
                      <span><span className="text-stone-500">Dernier raid :</span> <strong>{lastRaid.name}</strong> — {lastRaid.date}</span>
                    </div>
                  ) : <div className="text-stone-600 italic">Aucun raid planifié.</div>}
                  {lastCoord ? (
                    <div className="flex items-center gap-2 text-stone-300">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0"/>
                      <span><span className="text-stone-500">Dernière coord :</span> <strong>{lastCoord.name}</strong> ({lastCoord.dim})</span>
                    </div>
                  ) : <div className="text-stone-600 italic">Aucune coordonnée enregistrée.</div>}
                  {trophees[0] && (
                    <div className="flex items-center gap-2 text-stone-300">
                      <Skull className="w-3.5 h-3.5 text-red-400 flex-shrink-0"/>
                      <span><span className="text-stone-500">Dernier trophée :</span> <strong>{trophees[0].boss}</strong> par {trophees[0].killed_by}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Conseil du jour */}
            <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-4 flex gap-3 items-start">
              <Star className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"/>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-1">Conseil du Jour</div>
                <p className="text-amber-100 text-sm font-medium">{todayTip}</p>
              </div>
            </div>

            {/* Gestion annonces (GM seulement) */}
            {isGM && (
              <div className="bg-[#120d0a] border border-amber-900/40 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5"/> Annonces de Guilde <span className="text-stone-600 font-normal normal-case">(Maître de Guilde)</span>
                </h3>
                <form onSubmit={handleAddAnnonce} className="flex flex-col sm:flex-row gap-2">
                  <input type="text" value={newAnnonce} onChange={e=>setNewAnnonce(e.target.value)}
                    placeholder="Message d'annonce pour tous les aventuriers..."
                    className="flex-1 bg-[#070504] border border-[#3c291d] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-600"/>
                  <label className="flex items-center gap-1.5 text-xs text-stone-400 cursor-pointer select-none">
                    <input type="checkbox" checked={annonceUrgent} onChange={e=>setAnnonceUrgent(e.target.checked)} className="rounded"/>
                    <span>⚠️ Urgent</span>
                  </label>
                  <button type="submit" className="bg-amber-700 hover:bg-amber-600 text-stone-950 font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider">
                    Publier
                  </button>
                </form>
                {annonces.length > 0 && (
                  <div className="space-y-1.5">
                    {annonces.map(a => (
                      <div key={a.id} className="flex items-center justify-between gap-2 text-xs bg-[#0d0907] rounded-lg p-2.5 border border-[#2a1d14]">
                        <span className="text-stone-300">{a.urgent && '⚠️ '}{a.message} <span className="text-stone-600">— {a.by}</span></span>
                        <button onClick={() => handleDeleteAnnonce(a.id)} className="text-stone-600 hover:text-red-400 flex-shrink-0"><X className="w-3.5 h-3.5"/></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Chantiers actifs (aperçu) */}
            {enCours > 0 && (
              <div className="bg-[#120d0a] border border-[#2a1d14] rounded-xl p-4 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5"><Hammer className="w-3.5 h-3.5 text-amber-500"/> Chantiers Actifs</h3>
                <div className="space-y-2">
                  {projets.filter(p => p.status !== 'Terminé').slice(0,5).map(p => {
                    const pct = !p.resources.length ? 0 : Math.round(p.resources.reduce((a,r)=>a+Math.min(r.current/r.max,1),0)/p.resources.length*100);
                    return (
                      <div key={p.id} className="flex items-center gap-3 text-xs">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex-shrink-0 ${CAT_COLORS[p.cat]||CAT_COLORS['Autre']}`}>{p.cat}</span>
                        <span className="text-stone-300 truncate flex-1">{p.name}</span>
                        <span className="text-stone-500 font-mono flex-shrink-0">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )
        )}

        {/* ═══════════════════════════════════════════════════════
            CHANTIERS
        ═══════════════════════════════════════════════════════ */}
        {!loading && activeTab === 'chantiers' && (
          <div className="tab-fade space-y-5">
            <form onSubmit={handleCreateProjet} className="bg-[#120d0a] border border-[#352318] rounded-xl p-4 shadow-lg space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#e58219] font-serif">
                <FolderPlus className="w-4 h-4"/> Ouvrir un nouveau chantier
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" value={newProjetName} onChange={e=>setNewProjetName(e.target.value)}
                  placeholder="Nom du chantier (Ex: Gare Centrale...)"
                  className="flex-1 bg-[#070504] border border-[#3c291d] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#e58219]" required/>
                <select value={newProjetCat} onChange={e=>setNewProjetCat(e.target.value)}
                  className="bg-[#070504] border border-[#3c291d] rounded-lg p-2 text-xs text-stone-200 focus:outline-none">
                  {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                <button type="submit" className="bg-[#e58219] hover:bg-[#c97213] text-stone-950 font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider transition-colors">
                  Créer
                </button>
              </div>
            </form>

            <div className="flex flex-wrap gap-2 items-center">
              {['Tous', ...CATEGORIES].map(cat => (
                <button key={cat} onClick={()=>setFilterCat(cat)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${filterCat===cat ? (CAT_COLORS[cat]||'bg-stone-700 text-stone-200 border-stone-500') + ' ring-1 ring-offset-1 ring-offset-[#090605] ring-amber-500' : 'bg-stone-900 text-stone-500 border-stone-700 hover:border-stone-500'}`}>
                  {cat}
                </button>
              ))}
              <button onClick={()=>setHideCompleted(h=>!h)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ml-auto ${hideCompleted ? 'bg-emerald-900/50 text-emerald-300 border-emerald-700' : 'bg-stone-900 text-stone-500 border-stone-700'}`}>
                {hideCompleted ? '✓ Terminés masqués' : 'Masquer terminés'}
              </button>
            </div>

            <div className="space-y-3">
              {projetsFiltres.length === 0 ? (
                <div className="text-center py-12 bg-[#120d0a] rounded-xl border border-dashed border-stone-800 text-stone-600 font-serif italic text-xs">Aucun projet correspondant aux filtres.</div>
              ) : projetsFiltres.map(p => {
                const isExpanded = expandedProjet === p.id;
                const isFinished = p.status === 'Terminé';
                const allResDone = p.resources.length > 0 && p.resources.every(r => r.current >= r.max);
                return (
                  <div key={p.id} className={`bg-[#120d0a] border rounded-xl overflow-hidden shadow-md transition-all ${isFinished ? 'border-emerald-950/60 opacity-80' : 'border-[#2a1d14]'}`}>
                    <div className="p-4 bg-[#18110d] flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none" onClick={()=>setExpandedProjet(isExpanded?null:p.id)}>
                      <div className="flex items-center gap-3">
                        <div onClick={ev=>{ev.stopPropagation();handleToggleProjetStatus(p.id);}}
                          className={`p-1 rounded-full border transition-colors cursor-pointer ${isFinished?'bg-emerald-950/80 border-emerald-500 text-emerald-400':'bg-stone-950 border-stone-700 text-stone-500 hover:text-amber-500'}`}>
                          <CheckCircle2 className="w-4 h-4 stroke-[2.5]"/>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`font-serif font-bold text-sm tracking-wide ${isFinished?'text-emerald-400 line-through':'text-stone-100'}`}>{p.name}</h3>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${CAT_COLORS[p.cat]||CAT_COLORS['Autre']}`}>{p.cat}</span>
                            {isFinished && <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase">Construit ✅</span>}
                            {allResDone && !isFinished && <span className="bg-amber-500/10 text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-500/20 uppercase">Ressources ✓</span>}
                          </div>
                          <p className="text-[11px] text-stone-500">Par {p.createdBy} · {p.resources.length} ressource{p.resources.length!==1?'s':''}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onClick={ev=>ev.stopPropagation()}>
                        <button onClick={()=>handleDeleteProjet(p.id)} className="text-stone-600 hover:text-red-400 p-1.5 rounded transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                        <div className="text-stone-500 p-1 bg-[#0c0806] rounded border border-stone-800">
                          {isExpanded?<ChevronUp className="w-3.5 h-3.5"/>:<ChevronDown className="w-3.5 h-3.5"/>}
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 border-t border-[#231810] bg-[#0d0907] space-y-4">
                        {!isFinished && (
                          <div className="bg-[#120d0a] border border-[#2b1c12] p-3 rounded-lg space-y-3">
                            <div className="text-[10px] font-bold font-mono uppercase text-stone-500 tracking-wider flex items-center gap-1">
                              <Package className="w-3 h-3 text-[#e58219]"/> Raccourcis matériaux :
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {QUICK_MATS.map((m,i)=>(
                                <button key={i} onClick={()=>handleAddResource(p.id,m.name,m.max)}
                                  className="bg-[#070504] hover:bg-[#1a120e] text-stone-300 text-[11px] px-2 py-1 rounded border border-[#312015] transition-all">
                                  + {m.name} ({m.max})
                                </button>
                              ))}
                            </div>
                            <div className="pt-2 border-t border-[#1f140d] flex items-center gap-2 text-xs">
                              <input type="text" value={resName} onChange={e=>setResName(e.target.value)} placeholder="Matériau personnalisé..."
                                className="flex-1 bg-[#070504] border border-[#312015] rounded p-1.5 text-white focus:outline-none"/>
                              <input type="number" value={resMax} onChange={e=>setResMax(e.target.value)}
                                className="w-14 bg-[#070504] border border-[#312015] rounded p-1.5 text-center text-white"/>
                              <button type="button" onClick={()=>handleAddResource(p.id,resName,resMax)}
                                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-3 py-1.5 rounded text-[11px] uppercase">Ajouter</button>
                            </div>
                          </div>
                        )}
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold text-stone-500 font-mono tracking-wider">Ressources ({p.resources.length}) :</span>
                          {p.resources.length === 0 ? <p className="text-[11px] text-stone-600 italic pl-1">Aucun matériau configuré.</p> : (
                            <div className="space-y-2 divide-y divide-[#1e130c]/40">
                              {p.resources.map(r => {
                                const pct = Math.min(Math.round((r.current/r.max)*100),100);
                                const rDone = r.current >= r.max;
                                return (
                                  <div key={r.id} className="pt-2 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                    <div className="sm:w-1/4"><span className={`font-medium ${rDone?'text-emerald-500 line-through':'text-stone-300'}`}>{r.name}</span></div>
                                    <div className="flex-1 space-y-0.5">
                                      <div className="flex justify-between text-[10px] font-mono font-bold text-stone-500">
                                        <span>{pct}%</span><span>{r.current}/{r.max}</span>
                                      </div>
                                      <div className="w-full bg-[#070504] h-1.5 rounded-full border border-[#21160e]">
                                        <div className={`h-full rounded-full transition-all ${rDone?'bg-emerald-500':'bg-amber-500'}`} style={{width:`${pct}%`}}/>
                                      </div>
                                    </div>
                                    {!isFinished && (
                                      <div className="flex items-center gap-1.5 font-mono justify-end">
                                        <div className="bg-[#070504] border border-[#21160e] rounded p-0.5 flex items-center">
                                          <button onClick={()=>handleUpdateResQty(p.id,r.id,-10)} className="px-1 text-[9px] text-stone-500 hover:text-stone-200">-10</button>
                                          <button onClick={()=>handleUpdateResQty(p.id,r.id,-1)}  className="px-1.5 text-[11px] text-stone-500 hover:text-stone-200">-</button>
                                          <button onClick={()=>handleUpdateResQty(p.id,r.id,1)}   className="px-1.5 text-[11px] text-stone-500 hover:text-stone-200">+</button>
                                          <button onClick={()=>handleUpdateResQty(p.id,r.id,10)}  className="px-1 text-[9px] text-stone-500 hover:text-stone-200">+10</button>
                                        </div>
                                        <button onClick={()=>handleUpdateResQty(p.id,r.id,r.max)} className="p-1 text-emerald-500 bg-emerald-950/40 rounded hover:bg-emerald-900 transition-colors"><Check className="w-3 h-3"/></button>
                                        <button onClick={()=>handleDeleteResource(p.id,r.id)} className="p-1 text-stone-700 hover:text-red-400 rounded transition-colors"><Trash2 className="w-3 h-3"/></button>
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
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            COORDONNÉES
        ═══════════════════════════════════════════════════════ */}
        {!loading && activeTab === 'coordonnees' && (
          <div className="tab-fade space-y-5">
            <form onSubmit={handleAddCoord} className="bg-[#120d0a] border border-[#2b1c13] p-4 rounded-xl space-y-3 text-xs">
              <h4 className="font-serif font-bold text-[#e58219] uppercase border-b border-[#241810] pb-2 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> Enregistrer un lieu</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" value={coordNom} onChange={e=>setCoordNom(e.target.value)} placeholder="Nom du lieu..."
                  className="flex-1 bg-[#070504] border border-[#38261c] rounded-lg p-2 text-white focus:outline-none" required/>
                <select value={coordDim} onChange={e=>setCoordDim(e.target.value)} className="bg-[#070504] border border-[#38261c] rounded-lg p-2 text-stone-200">
                  {DIMENSIONS.map(d=><option key={d} value={d}>{d}</option>)}
                </select>
                <select value={coordType} onChange={e=>setCoordType(e.target.value)} className="bg-[#070504] border border-[#38261c] rounded-lg p-2 text-stone-200">
                  {COORD_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono">
                {[['X',coordX,setCoordX],['Y',coordY,setCoordY],['Z',coordZ,setCoordZ]].map(([lbl,val,set])=>(
                  <div key={lbl}>
                    <label className="text-[10px] text-stone-500 uppercase font-bold block mb-0.5">{lbl}</label>
                    <input type="text" value={val} onChange={e=>set(e.target.value)} placeholder={lbl}
                      className="w-full bg-[#070504] border border-[#38261c] rounded p-2 text-white text-center"/>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={coordNote} onChange={e=>setCoordNote(e.target.value)} placeholder="Note optionnelle..."
                  className="flex-1 bg-[#070504] border border-[#38261c] rounded-lg p-2 text-white"/>
                <button type="submit" className="bg-[#e58219] text-stone-950 font-bold py-2 px-5 rounded-lg font-serif uppercase tracking-wider">Ajouter</button>
              </div>
            </form>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] text-stone-500 uppercase font-bold">Dim :</span>
              {['Tous',...DIMENSIONS].map(d=>(
                <button key={d} onClick={()=>setFilterDim(d)}
                  className={`text-[11px] px-2.5 py-1 rounded border font-bold transition-all ${filterDim===d?'bg-blue-900/50 text-blue-300 border-blue-700':'bg-stone-900 text-stone-500 border-stone-700'}`}>{d}</button>
              ))}
              <span className="text-[10px] text-stone-500 uppercase font-bold ml-3">Type :</span>
              {['Tous',...COORD_TYPES].map(t=>(
                <button key={t} onClick={()=>setFilterCType(t)}
                  className={`text-[11px] px-2.5 py-1 rounded border font-bold transition-all ${filterCType===t?'bg-amber-900/50 text-amber-300 border-amber-700':'bg-stone-900 text-stone-500 border-stone-700'}`}>{t}</button>
              ))}
            </div>

            <div className="space-y-2">
              {coordsFiltrees.length === 0 ? (
                <div className="text-center py-12 bg-[#120d0a] rounded-xl border border-dashed border-stone-800 text-stone-600 font-serif italic text-xs">Aucune coordonnée enregistrée.</div>
              ) : coordsFiltrees.map(c => {
                const dimColors = { 'Surface':'text-green-400 bg-green-900/30 border-green-700/50', 'Voidsent Forest':'text-purple-400 bg-purple-900/30 border-purple-700/50', 'Aquamirae':'text-blue-400 bg-blue-900/30 border-blue-700/50', 'Cave':'text-stone-400 bg-stone-800/50 border-stone-600/50' };
                const typeIcons = { Donjon:'⚔️', Ressource:'⛏️', Base:'🏠', Boss:'💀', Structure:'🗺️' };
                return (
                  <div key={c.id} className="bg-[#120d0a] border border-[#2a1d14] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 hover:border-[#3e2a1d] transition-all text-xs">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-lg">{typeIcons[c.type]||'📍'}</span>
                      <div className="min-w-0">
                        <div className="font-bold text-stone-100 truncate">{c.name}</div>
                        <div className="text-stone-500 font-mono">X: {c.x} · Y: {c.y} · Z: {c.z}</div>
                        {c.note && <div className="text-stone-600 italic truncate">{c.note}</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${dimColors[c.dim]||''}`}>{c.dim}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-amber-900/30 text-amber-400 border-amber-700/50">{c.type}</span>
                      <span className="text-[10px] text-stone-600">par {c.by}</span>
                      <button onClick={()=>copyCoords(c)} title="Copier les coordonnées"
                        className="p-1.5 text-stone-500 hover:text-amber-400 bg-[#0c0806] rounded border border-stone-800 hover:border-amber-700 transition-all">
                        <Copy className="w-3.5 h-3.5"/>
                      </button>
                      <button onClick={()=>handleDeleteCoord(c.id)} className="p-1.5 text-stone-700 hover:text-red-400 rounded transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            RAIDS & BOSS + MUR DES TROPHÉES
        ═══════════════════════════════════════════════════════ */}
        {!loading && activeTab === 'raids' && (
          <div className="tab-fade space-y-6 text-xs">
            <form onSubmit={handleAddRaid} className="bg-[#120d0a] border border-[#2b1c13] p-4 rounded-xl flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 w-full">
                <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Cible / Boss</label>
                <input type="text" value={newRaidName} onChange={e=>setNewRaidName(e.target.value)}
                  placeholder="Ex: Wither, Dragon, Obliterator..."
                  className="w-full bg-[#070504] border border-[#38261c] rounded-lg p-2 text-white" required/>
              </div>
              <div className="flex-1 w-full">
                <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Date & Horaire</label>
                <input type="text" value={newRaidDate} onChange={e=>setNewRaidDate(e.target.value)}
                  placeholder="Ex: Vendredi 21h"
                  className="w-full bg-[#070504] border border-[#38261c] rounded-lg p-2 text-white"/>
              </div>
              <button type="submit" className="bg-[#e58219] hover:bg-[#cd7211] text-stone-950 font-serif font-bold py-2 px-5 rounded-lg uppercase tracking-wide h-9">Planifier</button>
            </form>

            <div className="bg-[#120d0a] border border-[#2b1c13] rounded-xl divide-y divide-[#241810] overflow-hidden">
              {raids.length === 0 ? (
                <p className="p-5 text-stone-600 italic font-serif">Aucun assaut militaire programmé.</p>
              ) : raids.map(r=>(
                <div key={r.id} className="p-4 flex items-center justify-between hover:bg-[#16100d] transition-colors">
                  <div>
                    <span className="font-serif font-bold text-stone-200 text-sm block">{r.name}</span>
                    <span className="text-stone-500 font-mono text-[11px]">{r.date}</span>
                  </div>
                  <button onClick={()=>handleDeleteRaid(r.id)} className="text-stone-700 hover:text-red-400 p-2 transition-colors"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
            </div>

            {/* Mur des Trophées */}
            <div className="space-y-4">
              <h3 onClick={handleSkullClick} className="text-sm font-black font-serif uppercase tracking-wider text-stone-200 flex items-center gap-2 cursor-default select-none" title="Cliquez 3 fois...">
                <Skull className="w-5 h-5 text-red-400"/> Mur des Trophées
              </h3>
              <form onSubmit={handleAddTrophee} className="bg-[#120d0a] border border-[#2b1c13] p-4 rounded-xl flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Boss Vaincu</label>
                  <input type="text" value={tropheeBoss} onChange={e=>setTropheeBoss(e.target.value)}
                    placeholder="Ex: Obliterator, Ignis, Dragon..."
                    className="w-full bg-[#070504] border border-[#38261c] rounded-lg p-2 text-white" required/>
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">World Tier</label>
                  <select value={tropheeTier} onChange={e=>setTropheeTier(e.target.value)}
                    className="bg-[#070504] border border-[#38261c] rounded-lg p-2 text-stone-200">
                    {WORLD_TIERS.map(t=><option key={t} value={t}>Tier {t}</option>)}
                  </select>
                </div>
                <button type="submit" className="bg-red-800 hover:bg-red-700 text-white font-serif font-bold py-2 px-5 rounded-lg uppercase tracking-wide h-9">Déclarer le Kill</button>
              </form>

              {trophees.length === 0 ? (
                <div className="text-center py-10 bg-[#120d0a] rounded-xl border border-dashed border-stone-800 text-stone-600 font-serif italic text-xs">
                  Le Mur des Trophées est vide. Soyez les premiers à graver votre victoire !
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {trophees.map((tr,i)=>(
                    <div key={tr.id||i} className="bg-[#120d0a] border border-red-900/60 rounded-xl p-4 text-center space-y-2 hover:border-red-700/80 hover:bg-red-950/20 transition-all group cursor-default">
                      <div className="text-3xl group-hover:scale-110 transition-transform">💀</div>
                      <div className="font-serif font-black text-red-300 text-sm leading-tight">{tr.boss}</div>
                      <div className="text-[10px] text-stone-500 font-mono">Vaincu par<br/><span className="text-stone-300 font-bold">{tr.killed_by}</span></div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-[10px] bg-red-900/40 text-red-300 border border-red-700/50 px-2 py-0.5 rounded font-bold">Tier {tr.tier}</span>
                        {tr.date && <span className="text-[10px] text-stone-600 font-mono">{tr.date}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            GUIDE INTÉGRÉ
        ═══════════════════════════════════════════════════════ */}
        {!loading && activeTab === 'guides' && (
          <div className="tab-fade flex flex-col md:flex-row gap-4" style={{minHeight:'70vh'}}>
            <aside className="md:w-56 flex-shrink-0 space-y-1">
              <div className="relative mb-3">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500"/>
                <input type="text" value={guideSearch} onChange={e=>{setGuideSearch(e.target.value);}}
                  placeholder="Rechercher dans le guide..."
                  className="w-full bg-[#0d0907] border border-[#2b1c13] rounded-lg py-2 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-amber-600"/>
                {guideSearch && <button onClick={()=>setGuideSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"><X className="w-3.5 h-3.5"/></button>}
              </div>
              {(guideSearch ? guideSectionsFiltered : GUIDE).map((s,i)=>{
                const realIdx = GUIDE.indexOf(s);
                return (
                  <button key={i} onClick={()=>{setActiveSection(realIdx); setGuideSearch('');}}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${activeSection===realIdx?'bg-amber-900/50 text-amber-200 border border-amber-700/60':'text-stone-400 hover:text-stone-200 hover:bg-[#1a130f]'}`}>
                    <span>{s.icon}</span>
                    <span className="leading-tight">{s.title}</span>
                  </button>
                );
              })}
              {guideSearch && guideSectionsFiltered.length === 0 && (
                <p className="text-stone-600 text-xs italic px-3 py-2">Aucun résultat.</p>
              )}
            </aside>
            <div className="flex-1 bg-[#120d0a] border border-[#2a1d14] rounded-xl p-5 space-y-3 overflow-y-auto">
              <h2 className="text-lg font-black font-serif text-stone-100 flex items-center gap-2 pb-2 border-b border-[#241810]">
                <span>{GUIDE[activeSection].icon}</span>
                <span>{GUIDE[activeSection].title}</span>
              </h2>
              <div className="space-y-3">
                {GUIDE[activeSection].content.map((block,i)=>(
                  <GuideBlock key={i} block={block}/>
                ))}
              </div>
              <div className="flex justify-between pt-4 border-t border-[#1e130c]">
                <button disabled={activeSection===0} onClick={()=>setActiveSection(s=>s-1)}
                  className="text-xs text-stone-500 hover:text-stone-300 disabled:opacity-30 flex items-center gap-1">
                  ← {activeSection > 0 ? GUIDE[activeSection-1].title : ''}
                </button>
                <button disabled={activeSection===GUIDE.length-1} onClick={()=>setActiveSection(s=>s+1)}
                  className="text-xs text-stone-500 hover:text-stone-300 disabled:opacity-30 flex items-center gap-1">
                  {activeSection < GUIDE.length-1 ? GUIDE[activeSection+1].title : ''} →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            PROFIL AVENTURIER
        ═══════════════════════════════════════════════════════ */}
        {!loading && activeTab === 'profil' && (
          <div className="tab-fade space-y-5">
            {/* Card principale */}
            <div className="bg-[#120d0a] border border-[#2a1d14] rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-stone-950 font-serif border-4 flex-shrink-0 ${isGM ? 'bg-gradient-to-br from-amber-400 to-amber-700 border-amber-500' : 'bg-gradient-to-br from-amber-600 to-amber-900 border-amber-700/50'}`}>
                {userPseudo.charAt(0).toUpperCase()}
              </div>
              <div className="text-center sm:text-left space-y-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                  <h2 className="text-xl font-black font-serif text-white">{userPseudo}</h2>
                  {isGM && <Crown className="w-5 h-5 text-amber-400" title="Maître de Guilde"/>}
                </div>
                <p className={`font-bold text-sm ${guildRank.color}`}>{guildRank.badge} {guildRank.label}</p>
                <p className="text-stone-500 text-xs">Aventurier d'Arcane Frontier · Synchro Cloud active</p>
              </div>
              {isGM && (
                <div className="sm:ml-auto">
                  <div className="bg-amber-900/30 border border-amber-700/40 rounded-xl px-4 py-3 text-center">
                    <Crown className="w-6 h-6 text-amber-400 mx-auto mb-1"/>
                    <p className="text-[10px] text-amber-300 font-bold uppercase tracking-widest">Maître de Guilde</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">Accès aux annonces</p>
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label:'Mes Chantiers',    value: myProjets.length,  color:'text-amber-400',   icon:'🔨' },
                { label:'Mes Trophées',     value: myTrophees.length, color:'text-red-400',     icon:'💀' },
                { label:'Raids planifiés',  value: raids.length,      color:'text-purple-400',  icon:'⚔️' },
                { label:'Activité totale',  value: totalActivity,     color:'text-emerald-400', icon:'⭐' },
              ].map((s,i) => (
                <div key={i} className="bg-[#120d0a] border border-[#2a1d14] rounded-xl p-4 text-center space-y-1">
                  <div className="text-2xl">{s.icon}</div>
                  <div className={`text-2xl font-black font-serif ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] text-stone-500 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Rang progression */}
            <div className="bg-[#120d0a] border border-[#2a1d14] rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500"/> Progression des Rangs
              </h3>
              <div className="flex flex-wrap gap-2">
                {RANKS.map(r => {
                  const achieved = totalActivity >= r.min;
                  const current = guildRank.label === r.label && !isGM;
                  return (
                    <div key={r.label} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-all ${achieved ? current ? 'bg-amber-900/40 border-amber-600/60 text-amber-300 font-bold' : 'bg-stone-900/60 border-stone-700 text-stone-400' : 'border-stone-800/40 text-stone-700 opacity-50'}`}>
                      <span>{r.badge}</span>
                      <span className="font-medium">{r.label}</span>
                      <span className="text-[10px] opacity-60">({r.min}+)</span>
                      {current && <span className="text-[9px] bg-amber-600 text-stone-950 font-black px-1 rounded">ACTIF</span>}
                      {achieved && !current && <span className="text-emerald-500">✓</span>}
                    </div>
                  );
                })}
                {isGM && (
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs bg-amber-900/40 border-amber-600/60 text-amber-300 font-bold">
                    <span>👑</span>
                    <span className="font-medium">Maître de Guilde</span>
                    <span className="text-[9px] bg-amber-600 text-stone-950 font-black px-1 rounded">ACTIF</span>
                  </div>
                )}
              </div>
            </div>

            {/* Mes trophées */}
            {myTrophees.length > 0 && (
              <div className="bg-[#120d0a] border border-[#2a1d14] rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                  <Skull className="w-3.5 h-3.5 text-red-400"/> Mes Boss Vaincus
                </h3>
                <div className="flex flex-wrap gap-2">
                  {myTrophees.map((tr, i) => (
                    <div key={tr.id||i} className="flex items-center gap-2 bg-red-950/30 border border-red-800/40 rounded-lg px-3 py-2 text-xs">
                      <span>💀</span>
                      <span className="text-red-300 font-bold">{tr.boss}</span>
                      <span className="text-[10px] text-red-500/70 bg-red-900/30 border border-red-700/30 px-1.5 py-0.5 rounded font-mono">T{tr.tier}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mes projets */}
            {myProjets.length > 0 && (
              <div className="bg-[#120d0a] border border-[#2a1d14] rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                  <Hammer className="w-3.5 h-3.5 text-amber-500"/> Mes Chantiers
                </h3>
                <div className="space-y-2">
                  {myProjets.map(p => {
                    const pct = p.status === 'Terminé' ? 100 : (!p.resources.length ? 0 : Math.round(p.resources.reduce((a,r)=>a+Math.min(r.current/r.max,1),0)/p.resources.length*100));
                    return (
                      <div key={p.id} className="flex items-center gap-3 text-xs">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex-shrink-0 ${CAT_COLORS[p.cat]||CAT_COLORS['Autre']}`}>{p.cat}</span>
                        <span className={`flex-1 truncate ${p.status === 'Terminé' ? 'text-emerald-400 line-through' : 'text-stone-300'}`}>{p.name}</span>
                        <div className="w-16 h-1.5 bg-[#070504] rounded-full flex-shrink-0">
                          <div className={`h-full rounded-full ${p.status === 'Terminé' ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{width:`${pct}%`}}/>
                        </div>
                        <span className="text-stone-500 font-mono flex-shrink-0">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Easter egg hint */}
            <div className="text-center text-[10px] text-stone-700 font-mono pt-2">
              ↑ ↑ ↓ ↓ ← → ← → B A — <span className="italic">pour les courageux</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
