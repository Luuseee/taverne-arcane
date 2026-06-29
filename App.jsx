import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Beer, Hammer, Shield, Trash2, Check, CheckCircle2, FolderPlus, Package,
  MapPin, RefreshCw, ChevronDown, ChevronUp, ChevronRight,
  BookOpen, LayoutDashboard, Star, Copy,
  Wifi, WifiOff, Search, X, Skull,
  Users, TrendingUp, Sparkles, Server,
  Bell, Moon, Sun, Megaphone, Award, Crown, User, Gamepad2
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

// ── Guide intégré (12 sections — niveau Wikipedia) ───────────────────────
const GUIDE = [
  { title:"Démarrage & Survie Complète", icon:"🏕️", content:[
    { t:'warn', text:"Ne creusez JAMAIS le sol du spawn — risque de tomber dans une cave et mourir sans équipement." },
    { t:'h',    text:"Premières 5 Minutes Critiques" },
    { t:'list', items:["Regardez autour immédiatement, identifiez le biome (détermine la température de départ)","Ramassez du bois ×32 minimum avant tout autre action","Craftez un établi en première priorité absolue","Outils bois PUIS pierre immédiatement — ne restez JAMAIS en outils bois","Trouvez une source d'eau sûre avant de vous installer"] },
    { t:'h',    text:"Système de Soif — Jauge Bleue" },
    { t:'info', text:"Jauge bleue sous la faim — se vide en 10-15 min (temps normal), 5 min en désert ou à proximité de lave. L'eau brute de rivière cause nausée 30s + 2 dégâts directs." },
    { t:'list', items:["✅ Eau bouillie : seau d'eau + four (méthode principale)","✅ Eau purifiée : seau + filtre à eau (plus rapide)","✅ Jus de fruits : pommes ou baies directement dans le crafting","✅ Lait de vache — Potions de soin (hydratent aussi)","❌ Eau brute (rivière/lac) : nausée 30s + 2 dégâts — JAMAIS","❌ Eau de swamp : nausée + poison simultané"] },
    { t:'recipe', text:"🔧 Filtre à eau : Gravier + Sable + Charbon en colonne verticale 3×1. Gourde : Cuir ×3 + Ficelle ×2 en forme de U (indispensable pour stocker l'eau purifiée)." },
    { t:'h',    text:"Système de Température — Barre Colorée" },
    { t:'info', text:"Barre colorée en haut à droite, de -40°C à +80°C. Surveille-la en PERMANENCE — elle peut te tuer en quelques dizaines de secondes." },
    { t:'list', items:["❄️ Taïga : -15°C | Toundra : -25°C | Montagnes : -20°C | Nuit universelle : -10°C","🔥 Désert : +35°C | Lave à proximité : +20°C (stack avec biome chaud)","Froid extrême → Slowness III puis Mining Fatigue II puis dégâts de gel continus","Chaud extrême → Weakness II puis dégâts de surchauffe progressifs"] },
    { t:'h',    text:"Régulation de Température" },
    { t:'list', items:["Contre le froid → feu de camp à proximité, armure en Cuir (fourrure), torche tenue en main, soupe chaude","Contre le chaud → armure légère, eau à proximité, ombre (arbre/abri), altitude élevée (vent)"] },
    { t:'h',    text:"Crafts Prioritaires Jour 1" },
    { t:'recipe', text:"🔧 Gourde : Cuir ×3 + Ficelle ×2 (U) | Filtre à eau : Gravier + Sable + Charbon (colonne) | Sac de couchage : Laine ×3 + Cuir ×2 | Couverture : Laine ×4 | Thermomètre : Fer ×1 + Redstone ×1 + Verre ×1" },
    { t:'h',    text:"Abri d'Urgence — Standards Minimaux" },
    { t:'warn', text:"Minimum 5×5×3 blocs. Porte en FER dès que possible — les mobs enfoncent les portes en bois. Torches PARTOUT (dans chaque coin) : spawn dans le noir possible même à l'intérieur." },
    { t:'h',    text:"Alimentation — Priorités" },
    { t:'warn', text:"Viande crue = nausée SYSTÉMATIQUE. Cuire ABSOLUMENT TOUT avant de manger. Farmers Delight permet des repas avec buffs durables (objectif semaine 1)." },
    { t:'list', items:["1. Pain (Blé ×3) — facile à produire, sans risque","2. Steak (Bœuf cuit) — très haute saturation","3. Poulet Rôti — bon rapport farm/saturation","4. Recettes Farmers Delight — buffs permanents dès semaine 1"] },
  ]},

  { title:"Minage Niveau Expert", icon:"⛏️", content:[
    { t:'warn', text:"Ne descendez JAMAIS en mine sans : seau d'eau (pockets de lave), eau purifiée ×10, armure complète. Les caves d'Alex contiennent des boss surprises." },
    { t:'h',    text:"Carte Complète des Minerais — Minecraft 1.20.1 Forge" },
    { t:'toptier', text:"⭐ Diamant : pic absolu Y-59, zone optimale Y-64 à Y-54. JAMAIS au-dessus de Y-50. Fortune III sur la pioche — obligatoire." },
    { t:'list', items:["Fer : pic Y15 (triangle), Y232 en surface/grottes, éviter Y0-Y10 (trop de lave)","Cuivre : pic Y48, commun Y0-Y96","Or : pic Y-16, Badlands ×4 bonus de spawn, Y256 dans les Badlands","Diamant : pic Y-59, zone optimale Y-64 à Y-54 (jamais au-dessus de Y-50)","Redstone : pic Y-59, zone Y-64 à Y-32","Lapis : pic Y0, zone Y-32 à Y64","Émeraude : pic Y-16, UNIQUEMENT dans les montagnes (Stony/Jagged/Frozen Peaks)","Anciens Débris : Y15 Nether (inaccessible dans ce pack)"] },
    { t:'h',    text:"Minerais Exclusifs du Modpack" },
    { t:'list', items:["Nickel : pic Y20, Y-10 à Y40, gris métallique → acier et alliages","Aluminium : pic Y64 (surface!), Y32 à Y96, argenté brillant → Mekanism et Create","Quartz : pic Y30, Y10 à Y60, blanc translucide → Create (non-Nether)","Zinc : pic Y15, Y-5 à Y30, grisâtre → OBLIGATOIRE pour Brass Create","Osmium : pic Y-20, Y-40 à Y10, bleu-gris → Mekanism","Argent : pic Y15, Y-10 à Y30 → bijoux Curios et magie","Plomb : pic Y-10, Y-30 à Y10, gris foncé → batteries et protection radiation"] },
    { t:'h',    text:"Techniques de Minage Optimales" },
    { t:'list', items:["Branches optimisées : tunnel 1×2 central + branches 1×2 tous les 3 blocs = couverture maximale sans overlap","Strip mining Y-59 : rangées 1×2 avec espacement 3 entre chaque (optimal diamants)","Grotte mining : suivre les grottes naturelles = plus rapide mais dangereux (mid-game)","Quarry Create : automatique, lent à setup mais passif et rentable endgame"] },
    { t:'recipe', text:"🔧 Vein Miner : enchantement sur pioche (livre en donjon ou Apotheosis). Activer avec touche V tenue pendant le minage → mine TOUT le filon d'un coup. Consomme énormément de durabilité — avoir Mending absolument." },
    { t:'h',    text:"Priorité d'Enchantements Pioche (dans l'ordre)" },
    { t:'toptier', text:"⭐ Ordre optimal : 1. Efficacité V (vitesse) → 2. Fortune III (×2-4 minerais) OU Toucher de Soie → 3. Solidité III → 4. Mending (réparation auto XP) → 5. Vein Miner → 6. Aqua Affinity (sous l'eau)" },
    { t:'h',    text:"Outils Spéciaux" },
    { t:'list', items:["Pioche en Aluminium : légère, rapide, parfaite pour le minage quotidien","Pioche en Osmium : très durable, lente, pour les longues sessions","Excavator Create : mine 3×3 automatiquement en rotation — idéal pour grands chantiers"] },
    { t:'warn', text:"Dangers du minage : pockets de lave (toujours un seau d'eau), caves d'Alex (mobs surprises), chutes dans le vide, suffocation (ne jamais creuser le bloc directement au-dessus de sa tête)." },
  ]},

  { title:"Combat Exhaustif — Better Combat", icon:"⚔️", content:[
    { t:'tip',  text:"Better Combat change tout : chaque arme a une animation 3D unique, une géométrie d'attaque, et un timing de combo. Le spam-click est pénalisé — respectez les timings." },
    { t:'h',    text:"Toutes les Armes et leurs Mécaniques" },
    { t:'list', items:["⚔️ Épée courte : arc 120° horizontal, portée 2.5 blocs, combo 3 coups (rapide-rapide-fort), DPS élevé mono-cible","🗡️ Longsword : arc 140°, portée 3 blocs, combo 2 coups (fort-fort), plus lente mais gros dégâts","🔱 Lance/Spear : ligne directe 180°, portée 4.5 blocs (PLUS LONGUE DU JEU), 1 coup fort — parfaite pour garder la distance","🔨 Masse : AoE 360°, portée 2 blocs, très lente, ignore 20% de défense — idéale contre armures lourdes","🗡️ Dagues : arc 90°, portée 1.5 blocs, DUAL WIELD natif (clic droit = main gauche), combo 4 coups ultra-rapide + saignement auto","🪓 Hache : arc 100°, portée 2.5 blocs, désactive les boucliers 3s, fort dégât unique","🔨 Grand Marteau : AoE 360° énorme, portée 2 blocs, extrêmement lente, stun au sol 0.5s — pour boss","⚰️ Faux/Scythe : AoE 360°, portée 3.5 blocs, récolte plantes en attaquant, excellent en agriculture-combat","⚔️ Katana : combo 5 coups très rapide, arc 110°, saignement sur critique — requires timing précis","🔱 Trident : portée 3 blocs, lance (Loyauté III pour retour), AoE en eau, électrise sous pluie avec Channeling"] },
    { t:'h',    text:"Mécaniques Avancées de Combat" },
    { t:'list', items:["Parry : bloquer au timing parfait → stun ennemi 1.5s + 0 dégât reçu","Sprint Attack : sprint + attaque → knockback ×2","Crouch Attack : shift + attaque → attaque basse (touche mobs baissés)","Jump Attack : attaque pendant saut → dégâts +50%"] },
    { t:'info', text:"Stamina : barre orange sous la vie. Chaque attaque coûte 10-20 stamina selon l'arme. Se régénère en 2s sans attaque. À 0 = attaques -50% dégâts." },
    { t:'h',    text:"Slots Curios — Détail Complet" },
    { t:'list', items:["Tête : casque magique, amulette vision nocturne, couronne de stats","Cou/Amulette : bonus vita (+4-20 PV max), colliers mana (+50-200), médaillons protection","Dos : cape de vol (Elytra alternative), cape magique, second sac à dos (Traveler's Backpack)","Torse/Ceinture : porte-outil (accès rapide 4-8 outils), baudrier de potions","Mains/Gant : anneaux ×2 (bonus variés — vitesse, dégâts, résistance, mana)","Jambes/Charme : bonus passifs (régénération, résistance à la chute)","Pieds/Chaussure : talismans (vitesse, triple saut, chute ralentie)"] },
    { t:'h',    text:"Potions de Combat Essentielles" },
    { t:'toptier', text:"⭐ Kit boss : Force II (dégâts +20%) + Résistance II (-20% dégâts reçus) + Vitesse II (+40% mouvement) + Régénération II + Absorption IV (4 cœurs bonus absorbables). Toujours tout boire AVANT l'engagement." },
    { t:'h',    text:"Enchantements Armes — Référence Complète" },
    { t:'list', items:["Sharpness V : +12.5 dégâts (tous types de mobs)","Smite V : +20.5 dégâts vs morts-vivants","Bane of Arthropods V : +20.5 dégâts vs arthropodes (araignées)","Fire Aspect II : feu 4 secondes sur l'ennemi","Knockback II : recul ×3","Looting III : loot ×3-4","Sweeping Edge III : AoE +75% efficacité","Unbreaking III : durabilité ×4","Mending : réparation automatique via XP collecté"] },
    { t:'h',    text:"Enchantements Armure — Référence Complète" },
    { t:'list', items:["Protection IV : -16% tous dégâts","Fire Protection IV : -32% dégâts feu","Blast Protection IV : -32% dégâts explosion","Projectile Protection IV : -32% dégâts projectiles","Feather Falling IV : -48% dégâts chutes (PRIORITÉ sur bottes)","Thorns III : renvoie 45% dégâts aux attaquants","Depth Strider III : vitesse en eau ×3","Frost Walker II : crée de la glace sous les pieds en eau","Soul Speed III : vitesse ×2 sur soul sand","Swift Sneak III : vitesse accroupi ×3"] },
    { t:'h',    text:"Stratégies Avancées" },
    { t:'list', items:["Kiting : reculer entre les attaques avec lance/arc — empêche la riposte","Stagger lock : enchaîner parfaitement les attaques pour empêcher la riposte adverse","Room clearing : masse en AoE → finir à l'épée les survivants","Cheese spots : hauteur hors portée des mobs au sol (4 blocs minimum)"] },
  ]},

  { title:"Apotheosis Niveau Maître", icon:"💎", content:[
    { t:'tip',  text:"Apotheosis est le système de progression d'équipement central. Maîtriser les raretés, affixes et gemmes te donnera un avantage décisif sur TOUS les combats." },
    { t:'h',    text:"Système de Raretés — Référence Complète" },
    { t:'list', items:["Ordinary (gris) : 0 affix — reforge avec Mundane Stone (cobblestone broyée)","Common (blanc) : 1 affix mineur — reforge avec Mundane Stone","Uncommon (vert) : 2 affixes mineurs — reforge avec Smooth Stone","Rare (bleu) : 1 majeur + 2 mineurs — reforge avec Infused Stone (stone + lapis + redstone au mixer)","Epic (violet) : 2 majeurs + 2 mineurs — reforge avec Prismatic Web (boss araignée de cave)","Mythic (rouge) : 3 majeurs + 2 mineurs — reforge avec Dimensional Shard (donjons profonds)","Legendary (doré) : 3 majeurs + 3 mineurs + stats de base boostées — reforge avec Cosmic Crystal (boss endgame)"] },
    { t:'recipe', text:"🔧 Reforging Table : Bois ×4 + Fer ×2 + Grindstone ×1. Usage : objet + matériau rareté cible + Sigil of Rebirth (ou Gem Dust ×8) → clic → consomme 5-50 niveaux XP selon rareté → affixes aléatoires. Répéter jusqu'aux affixes souhaités." },
    { t:'recipe', text:"🔧 Sigil of Rebirth : Blaze Powder ×4 + Diamond ×1 + Nether Star fragment. Salvaging Table : Bois ×4 + Fer ×4 → détruire objet = récupérer matériau rareté + Gem Dust proportionnel." },
    { t:'h',    text:"Toutes les Gemmes et leurs Effets" },
    { t:'list', items:["Citrine (jaune) — arme : +dégâts physiques 5-15% | armure : +résistance physique","Ruby (rouge) — arme : +dégâts feu 10-20% | armure : +résistance feu 15-25%","Sapphire (bleu) — arme : +spell power 10-20% | armure : +mana max 50-150","Emerald (vert) — arme : soin 2-5% dégâts infligés | armure : soin 1-3% dégâts subis","Amethyst (violet) — arme : +vitesse attaque 5-10% | armure : +vitesse mouvement 5-15%","Topaz (orange) — arme : +XP dropped 10-30% | armure : +XP gained 5-15%","Onyx (noir) — arme : +critiques 5-15% et +dégâts crit 15-30% | armure : +évasion 3-8%","Pearl (blanc) — arme : +dégâts magiques 10-20% | armure : +résistance magique 10-20%","Voidstone (violet sombre) — arme : ignore 5-15% armure | armure : absorption passive 2-8%"] },
    { t:'info', text:"Sockets par rareté : Common 0, Uncommon 1, Rare 2, Epic 3, Mythic 4, Legendary 5. Comment socketter : clic droit avec la gemme sur l'objet (les sockets sont des ronds gris visibles sur l'item)." },
    { t:'h',    text:"Tous les Affixes Majeurs Offensifs" },
    { t:'list', items:["Execute : dégâts +50-150% contre ennemis sous 25% PV","Volatile : explosion AoE au kill (8-20 dégâts zone)","Leeching : vol de vie 3-8% des dégâts infligés","Grievous : saignement 2-6/s pendant 5s","Thunderstruck : foudre aléatoire au hit (10% chance)","Converging : projectiles supplémentaires ×1-3","Recurrent : réduction cooldown sorts 5-20%","Accelerating : vitesse attaque +2-8% par hit pendant 3s (stack ×5 max)"] },
    { t:'h',    text:"Tous les Affixes Majeurs Défensifs" },
    { t:'list', items:["Rebounding : renvoie 10-30% des dégâts reçus","Adaptable : réduit le dernier type de dégât reçu de 5-15%","Blessed : régénération passive 0.5-2 PV/s","Indestructible : durabilité infinie sur l'objet","Warding : bouclier magique 5-20 PV toutes les 30s","Chilling : ralentit l'attaquant 1-3s au hit reçu (25% chance)"] },
    { t:'h',    text:"World Tiers — Progression de Difficulté" },
    { t:'list', items:["Tier 0 : défaut, loot Ordinary-Uncommon","Tier 1 : CTRL+T, +25% difficulté, loot jusqu'à Rare","Tier 2 : +50% difficulté, loot jusqu'à Epic (débloquer avec stuff Rare+)","Tier 3 : +100% difficulté, loot jusqu'à Mythic (débloquer avec stuff Epic+)","Tier 4 : +200% difficulté, loot jusqu'à Legendary (débloquer avec stuff Mythic+)"] },
    { t:'toptier', text:"⭐ Apotheosis Enchanting avancé : Bibliothèque infinie (Bookshelf + Arcane Crystal) sans limite de niveau. Anvil amélioré = répare sans pénalité, combine sans limite. Table enchantement niveau 100+ = 15+ bibliothèques magiques en cercle." },
  ]},

  { title:"Iron's Spells — Niveau Archimage", icon:"🔮", content:[
    { t:'tip',  text:"Iron's Spells offre 9 écoles complètes avec des dizaines de sorts. Spécialise-toi dans 2-3 écoles max pour être vraiment efficace. La gestion de mana est l'art principal." },
    { t:'h',    text:"EVOCATION — Destruction à Distance" },
    { t:'list', items:["Fireball : boule de feu directe, 12-30 dégâts, cooldown 3s","Chain Lightning : foudre rebondissante ×3-5 cibles, 8-20 dégâts/cible","Arcane Barrage : projectiles magiques rapides ×3-6, 5-12 dégâts chacun","Flamethrower : cône de feu continu 3-8 dégâts/s (drain mana très rapide)","Meteor : météore du ciel après 2s délai, 30-80 dégâts AoE","Magma Bomb : explosion lave AoE, 20-50 dégâts + lava pool permanent"] },
    { t:'h',    text:"CONJURATION — Invocations" },
    { t:'list', items:["Summon Vex : invoque 1-3 vex combattants pendant 60s (très efficace)","Summon Wolves : 1-4 loups permanents jusqu'à mort","Raise Dead : réanime cadavre ennemi récent comme allié 30s","Conjure Sword : épée magique flottante qui attaque automatiquement","Planar Binding : dimension pocket temporaire pour stocker mobs capturés"] },
    { t:'h',    text:"EVOKER — Contrôle de Foule" },
    { t:'list', items:["Slow : ralentit cible -60% vitesse 5-15s","Blindness : aveugle cible 3-8s","Hex : maudit cible → reçoit +25-50% dégâts 10s","Silence : empêche les capacités 3-8s","Confusion : cible attaque aléatoirement 5-10s"] },
    { t:'h',    text:"PALADIN — Soin et Protection" },
    { t:'list', items:["Healing Circle : soin AoE 5-20 PV/s pendant 5-10s autour du lanceur","Divine Shield : bouclier absorbant 20-100 dégâts pendant 10s","Holy Lance : projectile sacré 15-40 dégâts, bonus ×2 vs morts-vivants","Smite : frappe divine 30-80 dégâts + stun 1s","Aura of Purity : immunité aux debuffs 5-15s en permanence"] },
    { t:'h',    text:"BARD — Soutien d'Équipe" },
    { t:'list', items:["Haste Aura : vitesse attaque +20-40% pour tous alliés proches 15s","Resistance Aura : dégâts reçus -15-30% tous alliés 15s","Strength Aura : dégâts +15-30% tous alliés 15s","Song of Recall : téléporte tous les alliés proches au lanceur","Battle Hymn : tous les alliés régénèrent 2-5 PV/s pendant 20s"] },
    { t:'h',    text:"DRUID — Nature" },
    { t:'list', items:["Summon Wolf Pack : 3-6 loups sauvages temporaires 30s","Thornwall : mur d'épines 3-5 blocs, blesse qui passe 5-15 dégâts","Entangle : racines immobilisent cible 3-8s","Nature's Grasp : zone ralentissante d'herbes 10s","Verdant Bloom : régénère l'environnement + soin passif 2-4 PV/s 20s"] },
    { t:'h',    text:"NECROMANCER — Maîtrise de la Mort" },
    { t:'list', items:["Army of the Dead : invoque 3-8 squelettes/zombies pendant 60s","Soul Harvest : absorbe l'âme d'un mort récent → +10-30% prochain sort","Bone Spear : lance d'os perforante 20-50 dégâts, pénètre plusieurs mobs","Death Mark : marque cible — meurt dans les 10s si PV < 15%","Lich Form : transformation 15s — immunité complète + sorts renforcés ×2"] },
    { t:'h',    text:"HEXBLADE — Assassinat" },
    { t:'list', items:["Mark of Death : prochain coup = critique garanti ×3 dégâts","Curse of Weakness : cible inflige -30-50% dégâts 10s","Shadow Step : téléportation instantanée derrière la cible","Void Tendrils : tire la cible vers toi + ralentissement","Nether Grasp : pull à distance + dégâts 10-25"] },
    { t:'h',    text:"BLOOD — Vampirisme" },
    { t:'list', items:["Blood Slash : drain vie 10-30 dégâts + soin 50% des dégâts infligés","Sanguine Step : dash rapide + saignement aux ennemis traversés","Leech : vol de vie passif +3-8% tous dégâts pendant 15s","Blood Pact : échange 30% PV max contre +50% dégâts sorts 20s","Crimson Veil : intouchable 2-3s au coût de 30% PV actuels"] },
    { t:'h',    text:"Progression des Grimoires" },
    { t:'list', items:["Niv 1 — Flimsy Journal : 5 slots sorts, Mana 100, Regen 2/s","Niv 2 — Worn Notebook : 10 slots, Mana 150, Regen 3/s","Niv 3 — Leather Journal : 15 slots, Mana 200, Regen 5/s","Niv 4 — Arcane Journal : 20 slots, Mana 300, Regen 8/s","Niv 5 — Mystic Tome : 25 slots, Mana 500, Regen 12/s"] },
    { t:'recipe', text:"🔧 Flimsy Journal : Papier ×3 + Plume ×1 + Encre ×1. Inscription Table : Bois ×4 + Fer ×2 + Plume ×2 + Encre ×2." },
    { t:'h',    text:"Sources de Sorts" },
    { t:'list', items:["Wizard Towers : bibliothèque au sommet (sorts communs tous disponibles)","Coffres de donjons : 5-10% chance par coffre","Trading mage villageois : émeraudes (prix variable)","Crafting : parchemin vierge + matériaux spécifiques du sort","Boss drops : sorts rares/uniques exclusifs"] },
    { t:'h',    text:"Builds Optimaux" },
    { t:'toptier', text:"⭐ Pure Mage : Mystic Tome complet, armure tisserande Mythic, 500+ mana, Spell Power 200+, Evocation + Blood + Necromancer." },
    { t:'list', items:["Support/Healer : Paladin + Bard full, auras permanentes, Healing Circle toujours rechargé","Mêlée Soutien : Mirror Image actif, Summon Vex permanent, 1 sort de soin, reste épée","Hexblade Assassin : Shadow Step + Mark of Death + Blood Slash + Void Tendrils"] },
  ]},

  { title:"Create — Encyclopédie Complète", icon:"⚙️", content:[
    { t:'tip',  text:"Create est le mod d'automatisation central. Respectez la progression : Bases mécaniques → Brass → Automatisation complète. Chaque étape est un prérequis." },
    { t:'h',    text:"ÉTAPE 1 — Bases Mécaniques" },
    { t:'list', items:["Shaft : transmission de rotation sur un axe","Cogwheel petit : rapport 1:1 de transmission","Large Cogwheel : rapport 2:1 (divise RPM par 2, double le couple)","Gearbox : change la direction de rotation à 90°","Encased Chain Drive : transmission longue distance sans perte de RPM","Clutch : on/off mécanique (coupe la rotation)","Gearshift : inverse la direction de rotation"] },
    { t:'h',    text:"ÉTAPE 2 — Sources de Rotation" },
    { t:'list', items:["Waterwheel : 16 RPM, besoin d'eau coulante adjacente, simple à installer","Large Waterwheel : 24 RPM, plus de couple, meilleur early game","Hand Crank : manuel 32 RPM tant que tourné — pour tests uniquement","Windmill Bearing + Voiles : 4-128 RPM selon nombre de voiles (8-32 optimal), bloquer = stop","Furnace Engine : sur four/blast furnace actif, 16 RPM base + bonus selon carburant"] },
    { t:'h',    text:"ÉTAPE 3 — Traitement Basique" },
    { t:'list', items:["Mechanical Press : presse vers le bas sur Basin → fabrique sheets/crushed ores","Basin : réceptacle de traitement pour Press et Mixer","Mechanical Mixer : tourne dans Basin → mélange/fond/chauffe les matériaux","Millstone : broie minerais et grains (ore doubling early game)","Fan : pousse/tire items, chauffe (lave en dessous), refroidit (eau), lave (eau + savon)"] },
    { t:'h',    text:"ÉTAPE 4 — Brass / Laiton (ÉTAPE CLÉ)" },
    { t:'warn', text:"Le Brass (Laiton) débloque TOUTE l'automatisation intelligente. C'est le passage obligatoire du milieu de jeu — priorité absolue." },
    { t:'recipe', text:"🔧 Brass au Mixer : Copper Ingot ×1 + Zinc Ingot ×1 → Brass Ingot ×1 (nécessite chaleur Blaze). Blaze Burner : Blaze Rod ×1 + Fer ×3 → capturer flamme de Blaze (sous-sol Battle Tower)." },
    { t:'list', items:["Trouver le spawner de Blaze au sous-sol d'une Battle Tower","Tenir le Blaze Burner et approcher une flamme de Blaze pour la capturer","Placer le Blaze Burner sous le Basin avec le Mixer actif","Alternative : Heated Mixer avec Lava Tank en dessous (moins efficace)"] },
    { t:'h',    text:"ÉTAPE 5 — Composants Brass (Automatisation Intelligente)" },
    { t:'list', items:["Brass Funnel : filtre items par type (configurable par clic droit)","Brass Tunnel : distribue items sur belt selon règles personnalisables","Deployer : bras mécanique qui 'utilise' items sur des blocs","Mechanical Arm : transporte items entre machines, rayon 5 blocs, filtrable","Portable Storage Interface : accède à l'inventaire d'un véhicule en mouvement"] },
    { t:'h',    text:"ÉTAPE 6 — Crafting Mécanique" },
    { t:'recipe', text:"🔧 Precision Mechanism : Gold Ingot + Gold Sheet + Clock + Large Cogwheel + Cogwheel dans Mechanical Crafters — composant requis pour trains et machines avancées." },
    { t:'list', items:["Mechanical Crafters : réseau formant une grille de craft mécanique alimentée en rotation","Séquencer la disposition pour la recette voulue, connecter via Shafts","Precision Mechanism requis pour trains, contraptions, automatisation avancée"] },
    { t:'h',    text:"ÉTAPE 7 — Transport Avancé" },
    { t:'list', items:["Belts : transport horizontal/incliné, vitesse proportionnelle aux RPM","Chutes : vertical vers le bas, passif (aucune rotation nécessaire)","Elevators : vertical vers le haut (nécessite rotation)","Contraption : structure entière sur minecart = mobile, mine en avançant"] },
    { t:'h',    text:"ÉTAPE 8 — Stockage et Tri" },
    { t:'list', items:["Vault : grand stockage 1-4 blocs, jusqu'à 32 stacks par bloc","Chest + Funnel filtré : tri automatique par type d'item","Linked Controller : accès à distance à un inventaire"] },
    { t:'h',    text:"Schéma Ferme XP Automatique" },
    { t:'list', items:["1. Spawner dans cage (Silk Touch ou naturel)","2. Système de dégâts auto (Deployer + épée OU Fan + lave à distance OU chute 22 blocs)","3. Items tombent sur Belt vers Vault","4. XP flotte vers joueur AFK dans la zone","5. Enchanteresse alimentée en livres automatiquement via bras"] },
    { t:'toptier', text:"⭐ Calcul RPM optimal : Broyeur/Moulin = 64+ RPM | Press = 32+ RPM | Mixer = 64+ RPM | Drill = 128+ RPM. En dessous = underperformance. Vérifier la jauge de stress (rouge = manque de couple → ajouter sources)." },
  ]},

  { title:"Sophisticated Backpacks — Master", icon:"🎒", content:[
    { t:'tip',  text:"Sophisticated Backpacks est INDISPENSABLE dans un pack de 280 mods. Investis dedans dès que possible — un bon sac change radicalement le confort de jeu." },
    { t:'h',    text:"Paliers Complets — Stats Exactes" },
    { t:'list', items:["Cuir : 18 slots, 1 upgrade, 1 tank slot — Craft : Cuir ×7 en U","Cuivre : 27 slots, 2 upgrades, 2 tanks","Fer : 36 slots, 3 upgrades, 3 tanks","Or : 45 slots, 4 upgrades, 4 tanks","Diamant : 54 slots, 5 upgrades, 5 tanks","Netherite : 63 slots, 6 upgrades, 6 tanks"] },
    { t:'recipe', text:"🔧 Upgrade de Tier : sac actuel + métal ×6 + Tier Upgrade (métal ×4 + Planche ×4 + Fer ×1). Ex: Cuir→Cuivre = sac Cuir + Cuivre ×6 + Tier Upgrade Cuivre." },
    { t:'h',    text:"Guide Complet de Tous les Upgrades" },
    { t:'list', items:["Stack Upgrade Niv 1/2/3 : ×2/×4/×8 items par case (empilable ×2 dans un seul sac)","Filter Upgrade : whitelist/blacklist items, NBT matching, tag matching","Void Upgrade : détruit items en excès — ATTENTION sans filtre strict = perte garantie","Feeding Upgrade : mange automatiquement quand faim < 14 (configurable par item)","Magnet Upgrade : attire items au sol rayon 4-8 blocs (whitelist configurable)","Refilling Upgrade : remplace outil cassé depuis le sac automatiquement","Tank Upgrade : stocke 4000-16000 mB de liquide (configurable)","Compacting Upgrade : 9 items → 1 bloc automatiquement (ex: 9 fer → bloc fer)","Pickup Upgrade : ramasse SEULEMENT les items en whitelist","Crafting Upgrade : interface de craft directement dans le sac","Smelting Upgrade : fond items à la volée dans le sac (lent)","Smoking Upgrade : cuisine aliments à la volée","Blast Upgrade : blast furnace dans le sac pour minerais"] },
    { t:'warn', text:"Ne JAMAIS activer Void Upgrade sans filtre strict configuré — vous perdrez définitivement des items précieux sans aucun avertissement." },
    { t:'h',    text:"Builds Optimaux" },
    { t:'toptier', text:"⭐ Sac Mineur (Diamant+) : Stack ×2 (fer, cobble, minerais communs) + Filter (minerais précieux only) + Void (cobble excess) + Magnet. Gestion inventaire mine entièrement automatique." },
    { t:'list', items:["Sac Combattant (Fer+) : Feeding (steak/pain) + Refilling (épée/arc remplacement) + Magnet + Stack (flèches/potions)","Sac Fermier (Or+) : Compacting (tout en blocs) + Stack ×2 + Void (herbe/dirt) + Pickup (récoltes only)","Sac Mage (Diamant+) : Tank (mana potion) + Feeding + Stack (matériaux magie) + Filter (sorts/grimoires only)"] },
    { t:'info', text:"Accéder aux upgrades : Shift+Clic droit sur le sac → onglet engrenage à droite → slots upgrades. Touche B (défaut) pour ouvrir sans tenir le sac en main." },
  ]},

  { title:"Boss — Stratégies Complètes", icon:"💀", content:[
    { t:'warn', text:"TOUS les boss sont significativement plus dangereux que dans leurs mods d'origine. Kit minimum : armure Epic Protection IV + arme Epic + 20 potions de soin." },
    { t:'h',    text:"OBLITERATOR — Boss de Fin de Zone" },
    { t:'list', items:["PV : 800-1200 selon World Tier","Phase 1 (100-60% PV) : mêlée lourde 30-50 dégâts, charge ligne droite, 2-4 clones à 80% PV","⚠️ Les clones sont IMMORTELS (dégâts reçus = 0) — l'original a une légère aura dorée","Phase 2 (60-30% PV) : vitesse +50%, 4-8 clones supplémentaires, projectiles d'énergie 20-35 dégâts","Phase 3 (<30% PV) : berserk total, tous les clones actifs, projectiles rapides"] },
    { t:'toptier', text:"⭐ Stratégie Obliterator : Mirror Image OBLIGATOIRE (les clones attaquent vos leurres). Summon Vex pour cibler automatiquement l'original. Focus l'original UNIQUEMENT — ne jamais perdre de temps sur les clones. Healing Circle en phase 3." },
    { t:'h',    text:"IGNIS — Boss de Feu Volcanique" },
    { t:'list', items:["PV : 600-900, immunisé au feu et à la lave","Phase 1 : mêlée de feu 25-40 dégâts, lance boules de feu 15-25 dégâts","Phase 2 (<50% PV) : météores après 3-6s délai (zone rouge au sol → FUIR), aura feu 5 dégâts/s à <5 blocs"] },
    { t:'toptier', text:"⭐ Stratégie Ignis : Fire Resistance OBLIGATOIRE (potion 8 min). Rester à distance (arc/sorts). Surveiller le SOL en permanence en phase 2. Freeze (Iron's Spells) interrompt les météores." },
    { t:'h',    text:"DRAGONS SUPERCHARGED — Cristaux et Phases" },
    { t:'list', items:["PV : 1000-2000, aura dégâts magiques 15-30/s dans rayon 8 blocs","Capacités aléatoires : Foudre (sol toutes les 5s), Acide (-10% défense/hit), Poison (zone 20s), Glace (gèle 2s)","Cristaux de regen : chaque cristal actif = +5 PV/s au dragon"] },
    { t:'warn', text:"DÉTRUIRE TOUS LES CRISTAUX EN PREMIER avant d'engager le dragon — flèches ou sorts à distance. C'est la priorité absolue." },
    { t:'toptier', text:"⭐ Stratégie Dragon : armure Blast + Projectile Protection, mouvement constant, sorts de contrôle (Freeze/Slow), arc Infinity pour phase aérienne." },
    { t:'h',    text:"LICH — Nécromancien Téléporteur" },
    { t:'list', items:["PV : 500-700, téléporte toutes les 8s aléatoirement","Phase 1 : projectiles d'os 10-20 dégâts, invoque squelettes ×3-6","Phase 2 (<50% PV) : squelettes wither (25 dégâts + wither), Soul Storm (zone noire 30 dégâts/s)"] },
    { t:'toptier', text:"⭐ Stratégie Lich : AoE permanent pour les squelettes (masse/faux ou sorts AoE). Immunité Wither (potion ou armure). Ne pas rester à portée mêlée (téléportation = risque encerclement)." },
    { t:'h',    text:"ROYAL GUARDIAN — Armure Impénétrable" },
    { t:'list', items:["PV : 700-1000, défense 80% (quasi-impénétrable)","Charge dévastatrice : 60-100 dégâts si touché (animation élan 1.5s → esquiver LATÉRALEMENT)","Attaque bouclier : renvoie au loin | Frappe sol : AoE 3 blocs 40 dégâts"] },
    { t:'toptier', text:"⭐ Stratégie Royal Guardian : masse ou hache (ignore la défense), attaquer dans le dos (+30% dégâts), esquiver LATÉRALEMENT (jamais en face), potions de force obligatoires." },
    { t:'h',    text:"EVENT MOONS — Nuits Spéciales" },
    { t:'list', items:["Bloodmoon (rouge) : toutes les 7-14 nuits aléatoirement, mobs ×5 spawn, agressivité max → SE BARRICADER","Blue Moon (bleue) : rare, loot qualité +2 raretés, mobs légèrement plus forts → exploiter pour Epic/Mythic","Harvest Moon (orange) : ressources naturelles ×2, aucun danger → idéal pour farm bois/nourriture"] },
    { t:'h',    text:"BLIGHTS — Mobs Améliorés Aléatoires" },
    { t:'list', items:["Aura rouge = force | Aura bleue = vitesse | Aura verte = régénération | Aura violette = résistance","Stats : PV ×2-4, Dégâts ×1.5-3, Vitesse ×1.2-2 | Drops : toujours qualité supérieure","Stratégie : rouge → kiter | bleu → stagger lock | vert → dégâts max (outpace regen) | violet → sorts perçants"] },
    { t:'warn', text:"Fuir sans honte si pas prêt — un Blight peut one-shot en early game. Revenez préparé." },
  ]},

  { title:"Exploration Complète", icon:"🗺️", content:[
    { t:'tip',  text:"L'exploration est la source principale de loot, sorts et matériaux rares. Chaque structure a ses spécificités — lisez ce guide AVANT de vous y aventurer." },
    { t:'h',    text:"BATTLE TOWERS — Structure et Loot" },
    { t:'list', items:["Structure : tour de pierre 5-7 étages (25-40 blocs hauteur), entourée de spawns de mobs","Étage 1 : zombies/squelettes + coffre Ordinary/Common","Étage 2 : mobs armés + coffre Common/Uncommon","Étage 3 : mobs Elite + coffre Uncommon/Rare","Étage 4 : mobs Blight + coffre Rare/Epic","Étage 5 : boss de tour + coffre Epic/Mythic","⭐ Sous-sol : spawner de Blaze — SOURCE CRITIQUE pour le Blaze Burner Create"] },
    { t:'warn', text:"Ne DÉTRUISEZ PAS le spawner de Blaze — capturez la flamme avec le Blaze Burner. C'est la source principale de chaleur Create si le Nether est inaccessible." },
    { t:'list', items:["Approche : arriver par les côtés, éliminer les mobs extérieurs d'abord, monter étage par étage","Loot notable : armures jusqu'à Epic, sorts Iron's Spells rares, matériaux Apotheosis, livres enchantement"] },
    { t:'h',    text:"WIZARD TOWERS — Sorts et Magie" },
    { t:'list', items:["Structure : tour bleue/violette 4-6 étages + 2-4 mages gardiens (Fireball + Chain Lightning + Mirror Image)","Bibliothèque complète au sommet : tous les sorts communs disponibles","Loot unique : Arcane Journal (grimoire tier 4), sorts exclusifs (Meteor, Lich Form), Prismatic Web (Epic reforge)"] },
    { t:'h',    text:"AQUAMIRAE — Zones Sous-Marines Profondes" },
    { t:'list', items:["Structures à Y-40 à Y-60 dans les océans profonds","Prérequis : potion Respiration (ou enchantement Respiration III + Aqua Affinity)","Catfish Géant : 400 PV, morsure 40 dégâts, lent","Anglerfish : 200 PV, rapide, leurre lumineux, paralysie 3s","Crab Géant : armure naturelle, pinces 35 dégâts, faiblesse = attaquer le dessous","Dangers : pression eau (descente trop rapide), visibilité quasi-nulle, courants déstabilisants","Loot exclusif : Coraux Magiques, Perles Abyssales, Armure des Profondeurs, sorts aquatiques"] },
    { t:'h',    text:"ALEX'S CAVES — Par Type de Grotte" },
    { t:'list', items:["Abyssal Chasm : cristaux lumineux, mobs aveugles mais sensibles au son → se déplacer doucement","Primordial Caves : dinosaures miniatures, fossiles craftables, préhistorique","Toxic Caves : air toxique → potion résistance poison OBLIGATOIRE, matériaux chimiques","Magnetic Caves : fer flottant, boussole inutile, abondance en fer","Crystal Caverns : cristaux colorés immenses, mobs cristallins, très lumineux","Infested Caves : araignées géantes, toiles, NE PAS MARCHER SUR LES ŒUFS au sol"] },
    { t:'h',    text:"VOIDSENT FOREST — Zone Endgame" },
    { t:'warn', text:"Accessible uniquement après World Tier 3. Mobs niveau 80-120 en permanence. Ne pas y entrer sans armure Epic complète Protection IV + 30 potions." },
    { t:'list', items:["Biome sombre, arbres noirs 30-50 blocs, brume violette -20% visibilité","Mobs drop exclusivement Epic/Mythic/Legendary","Boss : Void Wraith (immunité physique → sorts obligatoires), Shadow Drake (invisible phase 2), Arcane Colossus (absorbe sorts → utiliser physique)","Ressources : Void Crystal (craft Legendary), Arcane Dust (sorts légendaires), Shadowwood (construction endgame)","Préparation minimale : armure Epic P.IV complète, arme Epic+, grimoire 20+ sorts, waystone à l'entrée"] },
  ]},

  { title:"Autres Mods — Encyclopédie", icon:"📚", content:[
    { t:'h',    text:"CURIOS API — Slots et Équipement Détaillé" },
    { t:'list', items:["Tête : casques magiques, lunettes vision nocturne, couronnes de stats","Cou : amulettes de vie (+4-20 PV max), colliers mana (+50-200), médaillons protection","Dos : capes (Elytra alternatif, vol magique), second sac à dos (Traveler's Backpack)","Ceinture : porte-outils (accès rapide 4-8 outils), baudriers de potions","Mains : anneaux ×2 (bonus variés — vitesse, dégâts, résistance, mana)","Jambes : charmes (régénération passive, résistance à la chute)","Pieds : talismans (vitesse, triple saut, chute ralentie)"] },
    { t:'h',    text:"ALEX'S MOBS — Mobs Importants et Utilité" },
    { t:'list', items:["Mimicube : ressemble à un cube inerte → items aléatoires au kill (parfois très rares)","Endergrade : scarabée end-like → cristaux de téléportation au kill","Warped Toad : engloutit et téléporte aléatoirement — DANGER en donjon","Bison : cuir premium ×6-12, viande premium, laine si shearé","Skelewag : squelette rapide avec dague, très dangereux en groupe","Raccoon : vole des items dans l'inventaire si trop proche — garder ses distances","Capuchin : singe domesticable (noix), peut équiper des arcs et tirer"] },
    { t:'h',    text:"FARMERS DELIGHT — Recettes et Buffs Durables" },
    { t:'list', items:["Stuffed Pumpkin : Citrouille + viande ×4 + légumes ×2 → Resistance II 10min + saturation haute","Honey Glazed Ham : Jambon + Miel ×4 → Strength I 8min","Roast Chicken : Poulet + herbes ×3 → Regeneration I 5min","Vegetable Soup : Légumes ×5 + bol → saturation haute (pas de buff mais très efficace)","Fish Stew : Poisson ×2 + légumes + bol → Water Breathing 3min","Melon Juice : Melon ×4 + bol → Fire Resistance 2min"] },
    { t:'recipe', text:"🔧 Cooking Pot : chaudron sur feu → ingrédients + bol = repas auto. Skillet : sur feu, cuisson rapide single item. Cutting Board : découper viandes en portions." },
    { t:'h',    text:"SERENE SEASONS — Gestion des Saisons" },
    { t:'list', items:["Printemps : températures douces, cultures vite, mobs neutres","Été : chaleur +15°C, cultures max vitesse, sécheresse possible","Automne : température neutre, feuilles colorées, mobs légèrement plus actifs la nuit","Hiver : froid -20°C, neige partout, cultures STOPPÉES — stocker en automne"] },
    { t:'warn', text:"Hiver : préparez en automne vos stocks de nourriture ×3 et matériaux de chauffage. Les cultures ne poussent plus du tout en hiver." },
    { t:'h',    text:"JADE — Configuration Optimale" },
    { t:'list', items:["Touche H pour ouvrir la config JADE","Activer : PV des mobs, information bloc, drops aperçu, progrès de minage","Désactiver si encombré : redstone info, fluid info (sauf si besoin spécifique)"] },
    { t:'h',    text:"WAYSTONES — Réseau de Téléportation" },
    { t:'list', items:["Trouver dans les villages (toujours à l'entrée du village) — activer par clic droit","Toutes les Waystones activées accessibles depuis n'importe quelle Waystone","Coût téléportation : court = 0 XP, long = 1-5 niveaux selon distance","Warp Stone : item one-use vers n'importe quelle Waystone (craft ou drop boss)","Global Waystone : visible par tous les joueurs du serveur automatiquement"] },
    { t:'recipe', text:"🔧 Waystone craft : Marble ×6 + Ether Dust ×2 + Ender Pearl ×1 (vérifier dans EMI — recette potentiellement modifiée)." },
  ]},

  { title:"Progression Roadmap", icon:"📋", content:[
    { t:'tip',  text:"Suivez cette roadmap dans l'ordre — chaque phase débloque la suivante. Brûler les étapes = mort garantie dans les zones endgame." },
    { t:'h',    text:"PHASE 1 — Les Premiers Pas (Jours 1-3)" },
    { t:'list', items:["✅ Outils pierre puis fer","✅ Abri sécurisé (porte en fer, torches partout)","✅ Eau purifiée en stock ×20","✅ Livre de quêtes ouvert et suivi","✅ Sac Cuir crafté et porté","✅ Température maîtrisée (thermomètre actif)","⭐ Bonus : premier donjon vidé, Flimsy Journal + 2 sorts, armure cuir complète"] },
    { t:'warn', text:"Erreurs à éviter Phase 1 : aller sous terre sans eau, négliger la température, ignorer le livre de quêtes." },
    { t:'h',    text:"PHASE 2 — L'Établissement (Jours 4-10)" },
    { t:'list', items:["✅ Armure fer complète + outils fer enchantés","✅ Sac Cuivre avec Stack Upgrade","✅ Sorts de base (Mirror Image EN PRIORITÉ)","✅ Première Battle Tower vidée (Blaze spawner capturé)","✅ Premiers diamants trouvés","⭐ Bonus : Create basique actif, affixes Rare, réseau Waystones, cuisine Farmers Delight"] },
    { t:'h',    text:"PHASE 3 — La Puissance (Semaines 2-3)" },
    { t:'list', items:["✅ Create Brass débloqué (Blaze Burner actif)","✅ Armure diamant complète","✅ Sac Fer avec 3 upgrades","✅ World Tier 1 → 2","✅ Grimoire 10+ sorts","✅ Reforges Rare sur arme principale","⭐ Bonus : ferme XP auto Create, armure Epic en cours, premier dragon tué"] },
    { t:'h',    text:"PHASE 4 — La Maîtrise (Mois 1)" },
    { t:'list', items:["✅ Armure Epic complète","✅ Arme Mythic","✅ Create full automatisé (fermes multiples)","✅ Sac Diamant 5 upgrades","✅ World Tier 3","✅ Grimoire 20 sorts","✅ Tous les Curios slots remplis","⭐ Bonus : première pièce Legendary, Voidsent Forest explorée"] },
    { t:'h',    text:"PHASE 5 — L'Endgame" },
    { t:'toptier', text:"⭐ Objectifs finaux : armure Legendary complète, armes Legendary avec affixes parfaits, World Tier max, Voidsent Forest maîtrisée, TOUS les boss vaincus, grimoire 25 sorts complet, Create empire total, sac Netherite optimisé." },
  ]},

  { title:"Performance & Technique", icon:"🖥️", content:[
    { t:'tip',  text:"Bien configurer Java et les paramètres graphiques est indispensable pour jouer confortablement avec 280 mods simultanément." },
    { t:'h',    text:"Configuration RAM Optimale" },
    { t:'list', items:["Minimum : 6 Go alloués à Java","Recommandé : 8 Go pour les sessions normales","Optimal : 10 Go pour les sessions longues","Maximum utile : 10 Go — au-delà est contre-productif (GC pauses plus longues et fréquentes)"] },
    { t:'recipe', text:"🔧 Configurer RAM : Launcher → Installations → Modifier → JVM Args → remplacer -Xmx2G par -Xmx8G" },
    { t:'h',    text:"Paramètres Graphiques Prioritaires à Baisser" },
    { t:'list', items:["Render Distance : 8-10 chunks maximum (jamais plus avec ce pack)","Entity Distance : 75%","Smooth Lighting : désactiver","Dynamic Lights : désactiver si < 60 FPS","Particles : minimal","Sky et Clouds : désactiver si nécessaire"] },
    { t:'h',    text:"Mods d'Optimisation Compatibles" },
    { t:'list', items:["✅ Embeddium : remplacement Sodium pour Forge (recommandé)","✅ Rubidium : alternative à Embeddium","✅ Oculus : shaders compatibles Forge","✅ Entity Culling : ne render pas les entités hors champ"] },
    { t:'warn', text:"NE PAS AJOUTER : Sodium (Fabric uniquement, incompatible Forge), OptiFine (conflits multiples avec les mods du pack)." },
    { t:'h',    text:"Commandes Serveur Utiles" },
    { t:'list', items:["/forge tps → TPS du serveur (optimal = 20)","/kill @e[type=minecraft:item,r=50] → nettoyer items au sol","/time set day → passer la nuit","/weather clear → désactiver la pluie"] },
    { t:'h',    text:"Backups et Version" },
    { t:'list', items:["Copier le dossier saves/nom_monde régulièrement","Backup AVANT chaque MAJ du pack (incompatibilités possibles)","Version serveur = exactement même version que client CurseForge"] },
    { t:'toptier', text:"⭐ JVM Args avancés : -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 (ajouter après -Xmx8G dans les JVM arguments du launcher)." },
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
  if (block.t === 'tip')    return <div className="border-l-4 border-amber-500 bg-amber-950/30 px-4 py-2.5 rounded-r text-amber-200 text-xs leading-relaxed">💡 {block.text}</div>;
  if (block.t === 'warn')   return <div className="border-l-4 border-red-500 bg-red-950/30 px-4 py-2.5 rounded-r text-red-200 text-xs leading-relaxed font-semibold">⚠️ {block.text}</div>;
  if (block.t === 'info')   return <div className="border-l-4 border-blue-500 bg-blue-950/30 px-4 py-2.5 rounded-r text-blue-200 text-xs leading-relaxed">ℹ️ {block.text}</div>;
  if (block.t === 'recipe') return <div className="border-l-4 border-green-500 bg-green-950/30 px-4 py-2.5 rounded-r text-green-200 text-xs leading-relaxed">{block.text}</div>;
  if (block.t === 'toptier')return <div className="border-l-4 border-purple-500 bg-purple-950/30 px-4 py-2.5 rounded-r text-purple-200 text-xs leading-relaxed font-semibold">{block.text}</div>;
  if (block.t === 'h')      return <h4 className="text-stone-100 font-bold font-serif text-sm mt-4 mb-1 flex items-center gap-1"><ChevronRight className="w-3.5 h-3.5 text-amber-500"/>{block.text}</h4>;
  if (block.t === 'list')   return <ul className="space-y-1.5 pl-2">{block.items.map((it,i)=><li key={i} className="text-xs text-stone-300 flex gap-2"><span className="text-amber-600 mt-0.5">•</span><span>{it}</span></li>)}</ul>;
  return null;
}

// ── Spider-Chat Clicker v3 — données ─────────────────────────────────────
/*
  SQL — Supabase Dashboard › SQL Editor:
  CREATE TABLE IF NOT EXISTS clicker_scores (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    pseudo      text UNIQUE NOT NULL,
    crystaux    bigint DEFAULT 0,
    cps         integer DEFAULT 0,
    niveau      integer DEFAULT 1,
    prestige    integer DEFAULT 0,
    badge_emoji text DEFAULT '🌱',
    badge_name  text DEFAULT 'Graine d''Arcane',
    citation    text DEFAULT '',
    total_clics bigint DEFAULT 0,
    updated_at  timestamptz DEFAULT now()
  );
  ALTER TABLE clicker_scores ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "read all" ON clicker_scores FOR SELECT USING (true);
  CREATE POLICY "upsert own" ON clicker_scores FOR ALL USING (true) WITH CHECK (true);
*/

const BADGES = [
  { min:1,   emoji:'🌱', name:'Graine d\'Arcane',      color:'text-stone-400',   border:'border-stone-600'   },
  { min:5,   emoji:'⚔️',  name:'Écuyer',                color:'text-amber-700',   border:'border-amber-800'   },
  { min:10,  emoji:'🗡️',  name:'Aventurier',            color:'text-amber-500',   border:'border-amber-700'   },
  { min:15,  emoji:'🏹',  name:'Chasseur',              color:'text-slate-300',   border:'border-slate-500'   },
  { min:20,  emoji:'🛡️',  name:'Guerrier',              color:'text-slate-200',   border:'border-slate-400'   },
  { min:25,  emoji:'💎',  name:'Vétéran',               color:'text-blue-300',    border:'border-blue-500'    },
  { min:30,  emoji:'🔮',  name:'Mage',                  color:'text-purple-300',  border:'border-purple-500'  },
  { min:40,  emoji:'⚡',  name:'Foudre',                color:'text-violet-300',  border:'border-violet-400'  },
  { min:50,  emoji:'🌟',  name:'Champion',              color:'text-yellow-300',  border:'border-yellow-500', pulse:true },
  { min:60,  emoji:'👑',  name:'Maître',                color:'text-amber-300',   border:'border-amber-400',  pulse:true },
  { min:70,  emoji:'🔱',  name:'Grand Maître',          color:'text-amber-200',   border:'border-amber-300',  pulse:true },
  { min:80,  emoji:'🌌',  name:'Archimage',             color:'text-cyan-200',    border:'border-cyan-400',   rainbow:true },
  { min:90,  emoji:'☄️',  name:'Dieu Arcanique',        color:'text-white',       border:'border-white',      rainbow:true },
  { min:95,  emoji:'💀',  name:'Démon Transcendant',    color:'text-purple-200',  border:'border-purple-300', rainbow:true },
  { min:100, emoji:'🐱‍👤', name:'Spider-Chat Suprême',  color:'text-yellow-100',  border:'border-yellow-300', rainbow:true, divine:true },
];

const CLICKER_UPGRADES = [
  { id:'griffe',      name:'Griffe du Chat',      icon:'🐾', desc:'+1 /clic',          cost:25,       clickAdd:1,    cps:0     },
  { id:'familier',    name:'Familier Arcanique',  icon:'🐱', desc:'+3 /clic',          cost:100,      clickAdd:3,    cps:0     },
  { id:'toile',       name:'Toile Magique',        icon:'🕷️', desc:'+1/sec',            cost:150,      clickAdd:0,    cps:1     },
  { id:'potion',      name:'Potion de Mana',       icon:'⚗️', desc:'+8 /clic',          cost:400,      clickAdd:8,    cps:0     },
  { id:'portail',     name:'Portail Arcanique',    icon:'🌀', desc:'+10/sec',           cost:800,      clickAdd:0,    cps:10    },
  { id:'grimoire',    name:'Grimoire Ancien',      icon:'📚', desc:'+20 /clic',         cost:2000,     clickAdd:20,   cps:0     },
  { id:'armee',       name:'Armée de Chats',       icon:'⚔️', desc:'+50/sec',           cost:4000,     clickAdd:0,    cps:50    },
  { id:'cristal',     name:'Cristal de Puissance', icon:'💎', desc:'+50 /clic',         cost:8000,     clickAdd:50,   cps:0     },
  { id:'legendaire',  name:'Chat Légendaire',      icon:'👑', desc:'+250/sec',          cost:20000,    clickAdd:0,    cps:250   },
  { id:'nexus',       name:'Nexus Arcanique',      icon:'🔮', desc:'+1 000/sec',        cost:50000,    clickAdd:0,    cps:1000  },
  { id:'dimension',   name:'Dimension du Chat',    icon:'🌌', desc:'+200 /clic',        cost:100000,   clickAdd:200,  cps:0     },
  { id:'singularite', name:'Singularité Féline',   icon:'⭐', desc:'+5 000/sec',        cost:300000,   clickAdd:0,    cps:5000  },
  { id:'void',        name:'Œil de Void',          icon:'👁️', desc:'+1 000 /clic',      cost:600000,   clickAdd:1000, cps:0     },
  { id:'dieu',        name:'Dieu Chat',            icon:'🐾', desc:'+25 000/sec',       cost:1500000,  clickAdd:0,    cps:25000 },
  { id:'transcendance',name:'Transcendance',       icon:'✨', desc:'+5 000/clic +100k/s',cost:10000000,clickAdd:5000, cps:100000},
];

const LEVEL_TITLES = [
  { min:1,   title:'Novice'        },
  { min:5,   title:'Apprenti'      },
  { min:10,  title:'Aventurier'    },
  { min:20,  title:'Guerrier'      },
  { min:30,  title:'Champion'      },
  { min:40,  title:'Maître'        },
  { min:50,  title:'Grand Maître'  },
  { min:60,  title:'Archimage'     },
  { min:75,  title:'Légende'       },
  { min:90,  title:'Dieu Arcanique'},
  { min:100, title:'TRANSCENDANCE' },
];

const ACHIEVEMENTS = [
  { id:'first_click', name:'Premier Pas',       icon:'👶', desc:'Premier clic',           check:s => s.totalClicks >= 1       },
  { id:'click_100',   name:'Centurion',          icon:'💯', desc:'100 clics',              check:s => s.totalClicks >= 100     },
  { id:'click_1k',    name:'Mille Clics',        icon:'🖱️', desc:'1 000 clics',            check:s => s.totalClicks >= 1000    },
  { id:'click_10k',   name:'Obsessionnel',       icon:'🌀', desc:'10 000 clics',           check:s => s.totalClicks >= 10000   },
  { id:'c_1k',        name:'Collecteur',         icon:'💎', desc:'1 000 crystaux gagnés',  check:s => s.allTime >= 1000        },
  { id:'c_10k',       name:'Trésorier',          icon:'💰', desc:'10 000 crystaux',        check:s => s.allTime >= 10000       },
  { id:'c_100k',      name:'Riche',              icon:'💎', desc:'100 000 crystaux',       check:s => s.allTime >= 100000      },
  { id:'c_1m',        name:'Millionnaire',       icon:'👑', desc:'1 000 000 crystaux',     check:s => s.allTime >= 1000000     },
  { id:'c_100m',      name:'Milliardaire',       icon:'🌟', desc:'100 millions de crystaux',check:s => s.allTime >= 100000000  },
  { id:'up_1',        name:'Acheteur',           icon:'🛒', desc:'Premier upgrade',        check:s => s.upgradeCount >= 1      },
  { id:'up_5',        name:'Collectionneur',     icon:'📦', desc:'5 upgrades achetés',     check:s => s.upgradeCount >= 5      },
  { id:'up_15',       name:'Arsenal Complet',    icon:'✅', desc:'Tous les upgrades',      check:s => s.upgradeCount >= 15     },
  { id:'lv_10',       name:'Niveau 10',          icon:'🎯', desc:'Atteins le niveau 10',   check:s => s.level >= 10            },
  { id:'lv_50',       name:'Mi-chemin',          icon:'⚡', desc:'Atteins le niveau 50',   check:s => s.level >= 50            },
  { id:'lv_100',      name:'Maximum !',          icon:'🌟', desc:'Niveau 100 atteint',     check:s => s.level >= 100           },
  { id:'crit_1',      name:'Chanceux',           icon:'⚡', desc:'Premier coup critique',  check:s => s.critCount >= 1         },
  { id:'crit_100',    name:'Foudre',             icon:'⚡', desc:'100 coups critiques',    check:s => s.critCount >= 100       },
  { id:'combo_5',     name:'Combo x5',           icon:'🔥', desc:'Atteins combo ×5',       check:s => s.maxCombo >= 5          },
  { id:'combo_10',    name:'Frénésie',           icon:'🌪️', desc:'Atteins combo ×10',      check:s => s.maxCombo >= 10         },
  { id:'event_1',     name:'Événement Arcanique',icon:'⭐', desc:'Survie un Arcane Event', check:s => s.eventCount >= 1        },
  { id:'prestige_1',  name:'Renaissance',        icon:'♾️', desc:'Premier prestige',       check:s => s.prestige >= 1          },
  { id:'prestige_5',  name:'Ascension',          icon:'🌠', desc:'5 prestiges',            check:s => s.prestige >= 5          },
  { id:'cps_1k',      name:'Usine',              icon:'⚙️', desc:'1 000 crystaux/sec',     check:s => s.cps >= 1000            },
  { id:'nocturne',    name:'Noctambule',         icon:'🌙', desc:'Joue après minuit',      check:s => s.lateNight              },
  { id:'spider_egg',  name:'Easter Egg',         icon:'🕷️', desc:'Tape S-P-I-D-E-R',      check:s => s.foundSpider            },
];

const PowerLevelCtx = React.createContext(1);

// ── Helpers Clicker ───────────────────────────────────────────────────────
function fmt(n) {
  n = Math.floor(n);
  if (n >= 1e12) return (n/1e12).toFixed(1)+'T';
  if (n >= 1e9)  return (n/1e9).toFixed(1)+'B';
  if (n >= 1e6)  return (n/1e6).toFixed(1)+'M';
  if (n >= 1e3)  return (n/1e3).toFixed(1)+'K';
  return n.toString();
}

const CAT_SKINS = [
  { id:'default', emoji:'',    name:'Classique',   rarity:'common',    weight:50, color:'#6ee7b7' },
  { id:'pirate',  emoji:'🏴‍☠️', name:'Pirate',      rarity:'rare',      weight:25, color:'#60a5fa' },
  { id:'mage',    emoji:'🧙',  name:'Mage Arcane', rarity:'epic',      weight:15, color:'#c084fc' },
  { id:'robot',   emoji:'🤖',  name:'Cyber-Chat',  rarity:'legendary', weight:8,  color:'#fbbf24' },
  { id:'dragon',  emoji:'🐉',  name:'Dragon Divin',rarity:'divine',    weight:2,  color:'#f97316' },
];

function genDailyQuests() {
  const d = new Date().getDate(), m = new Date().getMonth();
  const seed = d + m*31;
  const pool = [
    { type:'clicks',   target: 300+seed*5,        reward:1500, desc:`Cliquer ${(300+seed*5).toLocaleString('fr-FR')} fois` },
    { type:'crystals', target: 2000+seed*80,       reward:2000, desc:`Gagner ${fmt(2000+seed*80)} crystaux` },
    { type:'crits',    target: 5+Math.floor(seed/8),reward:1200,desc:`Faire ${5+Math.floor(seed/8)} critiques` },
    { type:'combo10',  target: 1,                  reward:3000, desc:'Atteindre combo ×10' },
    { type:'upgrades', target: 1+Math.floor(seed/15),reward:1800,desc:`Acheter ${1+Math.floor(seed/15)} upgrade(s)` },
    { type:'event',    target: 1,                  reward:5000, desc:'Survivre un Événement Arcanique' },
  ];
  const idxs = [(seed*7)%pool.length, (seed*13+2)%pool.length, (seed*17+5)%pool.length];
  const unique = [...new Set(idxs)];
  while (unique.length < 3) { let n=(unique[unique.length-1]+1)%pool.length; if(!unique.includes(n)) unique.push(n); }
  return unique.slice(0,3).map((i,idx) => ({ ...pool[i], id:`q${idx}`, progress:0, done:false }));
}

// ── ProfileDrawer amélioré ────────────────────────────────────────────────
function ProfileDrawer({ pseudo, onClose }) {
  const [data, setData] = useState(null);
  const [reactions, setReactions] = useState({ '👍':0, '❤️':0, '🔥':0, '⚔️':0 });
  const [myReaction, setMyReaction] = useState(null);

  useEffect(() => {
    supabase.from('clicker_scores').select('*').eq('pseudo', pseudo).single()
      .then(({ data: d }) => setData(d));
  }, [pseudo]);

  const badge = data ? ([...BADGES].reverse().find(b => (data.niveau||1) >= b.min) ?? BADGES[0]) : null;

  const inferredAchs = data ? ACHIEVEMENTS.filter(a => {
    const s = { totalClicks:data.total_clics||0, allTime:data.crystaux||0, upgradeCount:15, level:data.niveau||1, critCount:99, maxCombo:10, prestige:data.prestige||0, eventCount:1, lateNight:false, foundSpider:false, hasTrans:data.niveau>=50, cps:data.cps||0 };
    return a.check(s);
  }) : [];

  function handleReact(emoji) {
    if (myReaction === emoji) {
      setMyReaction(null); setReactions(r => ({...r,[emoji]:Math.max(0,r[emoji]-1)}));
    } else {
      if (myReaction) setReactions(r => ({...r,[myReaction]:Math.max(0,r[myReaction]-1)}));
      setMyReaction(emoji); setReactions(r => ({...r,[emoji]:r[emoji]+1}));
    }
  }

  return (
    <div className="fixed inset-0 z-[500] flex items-start justify-end" onClick={onClose}>
      <div className="portal-open mt-16 mr-2 w-80 bg-[#120d0a]/98 border border-[#3a2a1c] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-amber-900/40 to-red-900/30 p-5 border-b border-[#2a1d14] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-600 to-amber-900 border-2 border-amber-500/50 flex items-center justify-center text-2xl font-black text-stone-950 font-serif">
              {pseudo.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-white text-base font-serif truncate">{pseudo}</div>
              {badge && <div className={`text-xs font-bold ${badge.color} ${badge.rainbow?'rainbow-text':''}`}>{badge.emoji} {badge.name}</div>}
            </div>
            <button onClick={onClose} className="text-stone-600 hover:text-stone-300 text-lg leading-none">✕</button>
          </div>
          {data?.citation && <p className="mt-3 text-[11px] text-stone-400 italic border-l-2 border-amber-700/50 pl-2">"{data.citation}"</p>}
        </div>
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {data ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label:'Niveau',   value: data.niveau||1,                  color:'text-amber-400' },
                  { label:'Prestige', value: data.prestige>0?`★×${data.prestige}`:'—', color:'text-yellow-300' },
                  { label:'Crystaux', value: fmt(data.crystaux||0),           color:'text-blue-300' },
                  { label:'CPS',      value: fmt(data.cps||0),                color:'text-purple-300' },
                  { label:'Clics',    value: fmt(data.total_clics||0),        color:'text-stone-300' },
                  { label:'Actif',    value: data.updated_at ? new Date(data.updated_at).toLocaleDateString('fr-FR') : '—', color:'text-stone-500' },
                ].map(s => (
                  <div key={s.label} className="bg-[#0d0907] border border-[#211610] rounded-lg p-2.5 text-center">
                    <div className={`text-sm font-black font-mono ${s.color}`}>{s.value}</div>
                    <div className="text-[9px] text-stone-600 uppercase tracking-wider mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[10px] text-stone-500 uppercase tracking-wider mb-2 font-mono">Réactions</div>
                <div className="flex gap-2">
                  {['👍','❤️','🔥','⚔️'].map(emoji => (
                    <button key={emoji} onClick={() => handleReact(emoji)}
                      className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-sm transition-all ${myReaction===emoji?'bg-amber-900/50 border-amber-600':'bg-[#0d0907] border-[#211610] hover:border-[#3a2a1c]'}`}>
                      {emoji}{reactions[emoji]>0 && <span className="text-[9px] text-stone-400 font-mono">{reactions[emoji]}</span>}
                    </button>
                  ))}
                </div>
              </div>
              {inferredAchs.length > 0 && (
                <div>
                  <div className="text-[10px] text-stone-500 uppercase tracking-wider mb-2 font-mono">Succès visibles ({inferredAchs.length})</div>
                  <div className="flex flex-wrap gap-1">
                    {inferredAchs.slice(0,12).map(a => (
                      <div key={a.id} title={a.desc} className="flex items-center gap-1 bg-emerald-900/20 border border-emerald-700/40 rounded-lg px-2 py-1 text-[10px] text-emerald-300 font-bold">
                        {a.icon} {a.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-stone-600 text-xs py-4 font-mono">Chargement…</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── SpiderChatClicker v4 ─ Ultra-Dopamine ────────────────────────────────
function SpiderChatClicker({ userPseudo }) {
  const load = (k, def) => { try { return JSON.parse(localStorage.getItem(k) ?? 'null') ?? def; } catch { return def; } };

  // ── Core state ──
  const [crystals,    setCrystals]    = useState(() => load('sc_crystals', 0));
  const [allTime,     setAllTime]     = useState(() => load('sc_alltime',  0));
  const [purchased,   setPurchased]   = useState(() => load('sc_upgrades', {}));
  const [prestige,    setPrestige]    = useState(() => load('sc_prestige', 0));
  const [totalClicks, setTotalClicks] = useState(() => load('sc_clicks',   0));
  const [critCount,   setCritCount]   = useState(() => load('sc_crits',    0));
  const [eventCount,  setEventCount]  = useState(() => load('sc_events',   0));
  const [citation,    setCitation]    = useState(() => load('sc_citation',  ''));
  const [editCit,     setEditCit]     = useState(false);
  const [maxCombo,    setMaxCombo]    = useState(() => load('sc_maxcombo', 1));
  const [foundSpider, setFoundSpider] = useState(() => load('sc_spider',   false));
  const [streak,      setStreak]      = useState(() => load('sc_streak',   0));

  // ── UI state ──
  const [flyParticles,  setFlyParticles]  = useState([]);
  const [floatNums,     setFloatNums]     = useState([]);
  const [shockwaves,    setShockwaves]    = useState([]);
  const [clicking,      setClicking]      = useState(false);
  const [milestone,     setMilestone]     = useState(null);
  const [critFlash,     setCritFlash]     = useState(false);
  const [megaFlash,     setMegaFlash]     = useState(false);
  const [levelUpAnim,   setLevelUpAnim]   = useState(null);
  const [combo,         setCombo]         = useState(1);
  const [comboKey,      setComboKey]      = useState(0);
  const [arcanicEvent,  setArcanicEvent]  = useState(null);
  const [eventLeft,     setEventLeft]     = useState(0);
  const [achievements,  setAchievements]  = useState(() => new Set(load('sc_achievements', [])));
  const [achToast,      setAchToast]      = useState(null);
  const [spiderEgg,     setSpiderEgg]     = useState(false);
  const [activeView,    setActiveView]    = useState('clicker');
  const [leaderboard,   setLeaderboard]   = useState([]);
  const [myRank,        setMyRank]        = useState(null);
  const [lbTab,         setLbTab]         = useState('crystaux');
  const [lbLoading,     setLbLoading]     = useState(false);
  const [profilePseudo, setProfilePseudo] = useState(null);
  const [idleMsg,       setIdleMsg]       = useState(null);
  const [clickSpeed,    setClickSpeed]    = useState(0);
  const [cpsHistory,    setCpsHistory]    = useState([]);
  const [heatLevel,     setHeatLevel]     = useState(0);

  // ── MEGA CLIC ──
  const [megaCharge, setMegaCharge] = useState(0);
  const [megaReady,  setMegaReady]  = useState(false);
  const [megaFiring, setMegaFiring] = useState(false);

  // ── Gacha / skins ──
  const [gachaBoxes,    setGachaBoxes]    = useState(() => load('sc_gboxes', 0));
  const [unlockedSkins, setUnlockedSkins] = useState(() => load('sc_skins',  ['default']));
  const [activeSkin,    setActiveSkin]    = useState(() => load('sc_skin',   'default'));
  const [gachaResult,   setGachaResult]   = useState(null);
  const [showGacha,     setShowGacha]     = useState(false);

  // ── Daily quests ──
  const [dailyQuests, setDailyQuests] = useState(() => {
    const today = new Date().toDateString();
    const d = load('sc_ddate', ''); const q = load('sc_dquests', null);
    if (d === today && q) return q;
    return genDailyQuests();
  });

  // ── Refs ──
  const lastClickRef    = useRef(0);
  const comboTimerRef   = useRef(null);
  const seenMsRef       = useRef(new Set(load('sc_milestones', [])));
  const seenAchRef      = useRef(new Set(load('sc_achievements', [])));
  const nextEventRef    = useRef(load('sc_nextevent', Date.now() + 5*60*1000));
  const spiderKeyRef    = useRef('');
  const prevLevelRef    = useRef(null);
  const clickBtnRef     = useRef(null);
  const clickTimesRef   = useRef([]);
  const gachaThreshRef  = useRef(load('sc_gthresh', 500));
  const cpsHistRef      = useRef([]);

  // ── Derived ──
  const prestigeMult     = Math.pow(2, prestige);
  const totalClickAdd    = CLICKER_UPGRADES.reduce((a, u) => a + (purchased[u.id]||0)*u.clickAdd, 0);
  const cps              = CLICKER_UPGRADES.reduce((a, u) => a + (purchased[u.id]||0)*u.cps, 0) * prestigeMult;
  const evMult           = arcanicEvent ? 10 : 1;
  const streakMult       = 1 + Math.min(streak * 0.02, 0.5);
  const crystalsPerClick = (1 + totalClickAdd) * prestigeMult * combo * evMult * streakMult;
  const level            = Math.min(100, Math.floor(Math.sqrt(Math.max(0, allTime) / 1000)) + 1);
  const levelTitle       = ([...LEVEL_TITLES].reverse().find(t => level >= t.min) ?? LEVEL_TITLES[0]).title;
  const badge            = [...BADGES].reverse().find(b => level >= b.min) ?? BADGES[0];
  const upgradeCount     = Object.values(purchased).reduce((a,v) => a+(v>0?1:0), 0);
  const lateNight        = new Date().getHours() < 4;
  const hasTrans         = (purchased['transcendance']||0) > 0;
  const nextLevelAt      = Math.pow(level,2)*1000;
  const prevLevelAt      = level>1 ? Math.pow(level-1,2)*1000 : 0;
  const levelPct         = level>=100 ? 100 : Math.min(100, ((allTime-prevLevelAt)/(nextLevelAt-prevLevelAt))*100);
  const stats = { totalClicks, allTime, upgradeCount, level, critCount, maxCombo, prestige, eventCount, lateNight, foundSpider, hasTrans, cps };
  const skinData = CAT_SKINS.find(s => s.id === activeSkin) || CAT_SKINS[0];
  const auraColor = clickSpeed>=8?'#ffffff':clickSpeed>=6?'#ef4444':clickSpeed>=4?'#f97316':clickSpeed>=2?'#fbbf24':'#dc2626';
  const maxCpsH = Math.max(1, ...cpsHistory);
  const sparkPts = cpsHistory.map((v,i) => `${(i/Math.max(cpsHistory.length-1,1))*100},${100-(v/maxCpsH)*100}`).join(' ');

  // ── Idle bonus + streak on mount ──
  useEffect(() => {
    const lastSave = load('sc_lastsave', null);
    const savedCps = load('sc_cps_snapshot', 0);
    if (lastSave && savedCps > 0) {
      const elapsed = Math.min((Date.now()-lastSave)/1000, 3600);
      if (elapsed > 60) {
        const bonus = Math.floor(savedCps * elapsed * 0.5);
        if (bonus > 0) {
          setCrystals(c => c+bonus); setAllTime(t => t+bonus);
          setIdleMsg({ bonus, elapsed: Math.floor(elapsed) });
          setTimeout(() => setIdleMsg(null), 4000);
        }
      }
    }
    const today = new Date().toDateString();
    const lastDate = load('sc_lastdate', '');
    const yesterday = new Date(Date.now()-86400000).toDateString();
    if (lastDate !== today) {
      setStreak(lastDate===yesterday ? s=>s+1 : 1);
      localStorage.setItem('sc_lastdate', today);
    }
    const d = load('sc_ddate','');
    if (d !== today) {
      const nq = genDailyQuests();
      setDailyQuests(nq);
      localStorage.setItem('sc_ddate', today);
      localStorage.setItem('sc_dquests', JSON.stringify(nq));
    }
  }, []);

  // ── Level up detection ──
  useEffect(() => {
    if (prevLevelRef.current === null) { prevLevelRef.current = level; return; }
    if (level > prevLevelRef.current) {
      setLevelUpAnim({ level, title: levelTitle });
      playLevelUp();
      setTimeout(() => setLevelUpAnim(null), 2300);
      window.dispatchEvent(new CustomEvent('powerlevel', { detail: level }));
    }
    prevLevelRef.current = level;
  }, [level]);

  // ── Persistence ──
  useEffect(() => {
    localStorage.setItem('sc_crystals',     JSON.stringify(Math.floor(crystals)));
    localStorage.setItem('sc_alltime',      JSON.stringify(Math.floor(allTime)));
    localStorage.setItem('sc_upgrades',     JSON.stringify(purchased));
    localStorage.setItem('sc_prestige',     JSON.stringify(prestige));
    localStorage.setItem('sc_clicks',       JSON.stringify(totalClicks));
    localStorage.setItem('sc_crits',        JSON.stringify(critCount));
    localStorage.setItem('sc_events',       JSON.stringify(eventCount));
    localStorage.setItem('sc_maxcombo',     JSON.stringify(maxCombo));
    localStorage.setItem('sc_level',        JSON.stringify(level));
    localStorage.setItem('sc_citation',     JSON.stringify(citation));
    localStorage.setItem('sc_spider',       JSON.stringify(foundSpider));
    localStorage.setItem('sc_achievements', JSON.stringify([...achievements]));
    localStorage.setItem('sc_streak',       JSON.stringify(streak));
    localStorage.setItem('sc_gboxes',       JSON.stringify(gachaBoxes));
    localStorage.setItem('sc_skins',        JSON.stringify(unlockedSkins));
    localStorage.setItem('sc_skin',         JSON.stringify(activeSkin));
    localStorage.setItem('sc_gthresh',      JSON.stringify(gachaThreshRef.current));
    localStorage.setItem('sc_dquests',      JSON.stringify(dailyQuests));
    localStorage.setItem('sc_lastsave',     JSON.stringify(Date.now()));
    localStorage.setItem('sc_cps_snapshot', JSON.stringify(Math.round(cps*evMult)));
  }, [crystals, allTime, purchased, prestige, totalClicks, critCount, eventCount, maxCombo, level, citation, foundSpider, achievements, streak, gachaBoxes, unlockedSkins, activeSkin, dailyQuests, cps, evMult]);

  // ── CPS tick ──
  useEffect(() => {
    if (cps === 0) return;
    const id = setInterval(() => {
      const gain = (cps*evMult)/20;
      setCrystals(c => c+gain); setAllTime(t => t+gain);
    }, 50);
    return () => clearInterval(id);
  }, [cps, evMult]);

  // ── CPS history sparkline ──
  useEffect(() => {
    const id = setInterval(() => {
      const v = Math.round(cps*evMult);
      cpsHistRef.current = [...cpsHistRef.current, v].slice(-20);
      setCpsHistory([...cpsHistRef.current]);
    }, 1000);
    return () => clearInterval(id);
  }, [cps, evMult]);

  // ── Click speed tracking ──
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      clickTimesRef.current = clickTimesRef.current.filter(t => now-t < 1000);
      const spd = clickTimesRef.current.length;
      setClickSpeed(spd);
      setHeatLevel(Math.min(1, spd/10));
    }, 100);
    return () => clearInterval(id);
  }, []);

  // ── MEGA CLIC charge ──
  useEffect(() => {
    if (megaReady || megaFiring) return;
    const id = setInterval(() => {
      setMegaCharge(c => {
        const next = Math.min(100, c + 100/300); // fills in 30s (100 ticks of 100ms)
        if (next >= 100) { setMegaReady(true); return 100; }
        return next;
      });
    }, 100);
    return () => clearInterval(id);
  }, [megaReady, megaFiring]);

  // ── Arcanic Event ──
  useEffect(() => {
    const id = setInterval(() => {
      if (!arcanicEvent && Date.now() >= nextEventRef.current) {
        const end = Date.now()+30000;
        setArcanicEvent({ end }); setEventCount(e => e+1);
        nextEventRef.current = Date.now()+5*60*1000;
        localStorage.setItem('sc_nextevent', JSON.stringify(nextEventRef.current));
        setMilestone({ msg:'⭐ ÉVÉNEMENT ARCANIQUE ! ×10 gains pendant 30s !', color:'text-yellow-300' });
        setTimeout(() => setMilestone(null), 3200);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [arcanicEvent]);

  useEffect(() => {
    if (!arcanicEvent) return;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((arcanicEvent.end-Date.now())/1000));
      setEventLeft(left);
      if (left <= 0) { setArcanicEvent(null); nextEventRef.current = Date.now()+5*60*1000; }
    }, 200);
    return () => clearInterval(id);
  }, [arcanicEvent]);

  // ── Gacha threshold ──
  useEffect(() => {
    if (allTime >= gachaThreshRef.current) {
      gachaThreshRef.current += 500;
      setGachaBoxes(b => b+1);
    }
  }, [Math.floor(allTime/500)]);

  // ── Milestones + achievements + quests ──
  useEffect(() => {
    const milestones = [
      { at:1000,    msg:"✨ Le Chat Arcanique s'éveille !",          color:'text-amber-300' },
      { at:10000,   msg:"🕷️ La Toile Cosmique se tisse...",         color:'text-purple-300' },
      { at:100000,  msg:"👑 Le Seigneur des Chats est né !",          color:'text-yellow-300' },
      { at:1000000, msg:"🌌 L'Arcane Chat transcende la réalité !",  color:'text-blue-300' },
      { at:1e9,     msg:"🌟 MILLIARD — DIEU ARCANIQUE !",            color:'text-white' },
    ];
    const found = milestones.find(m => allTime>=m.at && !seenMsRef.current.has(m.at));
    if (found) {
      seenMsRef.current.add(found.at);
      localStorage.setItem('sc_milestones', JSON.stringify([...seenMsRef.current]));
      setMilestone(found); setTimeout(() => setMilestone(null), 3200);
    }
    ACHIEVEMENTS.forEach(ach => {
      if (!seenAchRef.current.has(ach.id) && ach.check(stats)) {
        seenAchRef.current.add(ach.id);
        setAchievements(prev => new Set([...prev, ach.id]));
        setAchToast(ach); setTimeout(() => setAchToast(null), 3500);
      }
    });
    // Update daily quests progress
    setDailyQuests(qs => qs.map(q => {
      if (q.done) return q;
      let progress = q.progress;
      if (q.type==='clicks')   progress = totalClicks;
      if (q.type==='crystals') progress = Math.floor(allTime);
      if (q.type==='crits')    progress = critCount;
      if (q.type==='combo10')  progress = maxCombo>=10?1:0;
      if (q.type==='upgrades') progress = upgradeCount;
      if (q.type==='event')    progress = eventCount;
      const done = progress >= q.target;
      if (done && !q.done) {
        setCrystals(c => c+q.reward); setAllTime(t => t+q.reward);
        setMilestone({ msg:`✅ Quête accomplie ! +${fmt(q.reward)} crystaux !`, color:'text-emerald-300' });
        setTimeout(() => setMilestone(null), 3200);
      }
      return { ...q, progress: Math.min(progress, q.target), done };
    }));
  }, [Math.floor(allTime/10), totalClicks, upgradeCount, level, critCount, maxCombo, prestige, eventCount, foundSpider]);

  // ── Supabase leaderboard ──
  async function fetchLb() {
    setLbLoading(true);
    const col = { crystaux:'crystaux', cps:'cps', niveau:'niveau', clics:'total_clics' }[lbTab] || 'crystaux';
    const { data } = await supabase.from('clicker_scores')
      .select('pseudo,crystaux,cps,niveau,prestige,badge_emoji,badge_name,total_clics')
      .order(col, { ascending:false }).limit(10);
    setLeaderboard(data || []);
    if (userPseudo) {
      const myVal = lbTab==='crystaux'?Math.floor(allTime):lbTab==='cps'?Math.round(cps):lbTab==='niveau'?level:totalClicks;
      const { count } = await supabase.from('clicker_scores').select('*',{count:'exact',head:true}).gt(col, myVal);
      setMyRank((count??0)+1);
    }
    setLbLoading(false);
  }
  useEffect(() => { if (activeView==='leaderboard') fetchLb(); }, [activeView, lbTab]);
  useEffect(() => {
    if (activeView!=='leaderboard') return;
    const id = setInterval(fetchLb, 30000); return () => clearInterval(id);
  }, [activeView, lbTab]);

  function syncScore() {
    if (!userPseudo) return;
    supabase.from('clicker_scores').upsert({
      pseudo: userPseudo, crystaux: Math.floor(allTime), cps: Math.round(cps),
      niveau: level, prestige, badge_emoji: badge.emoji, badge_name: badge.name,
      citation, total_clics: totalClicks, updated_at: new Date().toISOString(),
    }, { onConflict: 'pseudo' });
  }
  useEffect(() => { const id = setInterval(syncScore, 30000); return () => clearInterval(id); }, [allTime, cps, level, prestige, citation]);

  // ── SPIDER easter egg ──
  useEffect(() => {
    const onKey = e => {
      const tag = document.activeElement?.tagName;
      if (tag==='INPUT'||tag==='TEXTAREA') return;
      spiderKeyRef.current = (spiderKeyRef.current+e.key.toUpperCase()).slice(-6);
      if (spiderKeyRef.current==='SPIDER') {
        setSpiderEgg(true); setFoundSpider(true); spiderKeyRef.current='';
        setTimeout(() => setSpiderEgg(false), 3000);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ── Sounds ──
  function playClick(isCrit, isMega) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (isMega) {
        [261,329,392,523,659,784].forEach((f,i) => {
          const o=ctx.createOscillator(), g=ctx.createGain();
          o.connect(g); g.connect(ctx.destination); o.type='square'; o.frequency.value=f;
          g.gain.setValueAtTime(0.25, ctx.currentTime+i*0.04);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+i*0.04+0.9);
          o.start(ctx.currentTime+i*0.04); o.stop(ctx.currentTime+i*0.04+0.95);
        }); return;
      }
      const osc=ctx.createOscillator(), g=ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.type=isCrit?'square':'sine';
      osc.frequency.setValueAtTime(isCrit?660:880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(isCrit?2200:1320, ctx.currentTime+0.1);
      g.gain.setValueAtTime(0.15, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.22);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime+0.25);
      if (combo>1) {
        const co=ctx.createOscillator(), cg=ctx.createGain();
        co.connect(cg); cg.connect(ctx.destination); co.type='triangle';
        co.frequency.value=440+(combo-1)*80;
        cg.gain.setValueAtTime(0.08, ctx.currentTime+0.06);
        cg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.28);
        co.start(ctx.currentTime+0.06); co.stop(ctx.currentTime+0.3);
      }
    } catch {}
  }
  function playLevelUp() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [523,659,784,1047].forEach((f,i) => {
        const o=ctx.createOscillator(), g=ctx.createGain();
        o.connect(g); g.connect(ctx.destination); o.type='triangle'; o.frequency.value=f;
        g.gain.setValueAtTime(0.18, ctx.currentTime+i*0.12);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+i*0.12+0.3);
        o.start(ctx.currentTime+i*0.12); o.stop(ctx.currentTime+i*0.12+0.32);
      });
    } catch {}
  }
  function playUpgrade() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [440,554,659].forEach((f,i) => {
        const o=ctx.createOscillator(), g=ctx.createGain();
        o.connect(g); g.connect(ctx.destination); o.type='sine'; o.frequency.value=f;
        g.gain.setValueAtTime(0.2, ctx.currentTime+i*0.08);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+i*0.08+0.3);
        o.start(ctx.currentTime+i*0.08); o.stop(ctx.currentTime+i*0.08+0.35);
      });
    } catch {}
  }

  // ── Main click handler ──
  function handleClick() {
    const now = Date.now();
    clickTimesRef.current.push(now);
    const since = now - lastClickRef.current;
    let newCombo = since<800 ? Math.min(10, combo+(since<300?1:0)) : 1;
    setCombo(newCombo); setComboKey(k=>k+1);
    if (newCombo>maxCombo) setMaxCombo(newCombo);
    lastClickRef.current = now;
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => setCombo(1), 1500);

    const isCrit = Math.random()<0.10;
    if (isCrit) { setCritCount(c=>c+1); setCritFlash(true); setTimeout(()=>setCritFlash(false),400); }
    const gain = crystalsPerClick*(isCrit?5:1);
    setCrystals(c=>c+gain); setAllTime(t=>t+gain); setTotalClicks(c=>c+1);
    setClicking(true); setTimeout(()=>setClicking(false),120);
    playClick(isCrit, false);

    // Particles (15-30)
    const count = isCrit ? 25 : Math.min(28, 12+newCombo*2);
    const syms = isCrit ? ['⭐','✨','💥','⚡','🌟','💎'] : ['💎','✨','💠','🔮','⚡'];
    const newP = Array.from({length:count}, () => ({
      id: Date.now()+Math.random(),
      dx: (Math.random()-0.5)*180, dy: (Math.random()-0.5)*80-50,
      sym: syms[Math.floor(Math.random()*syms.length)],
      size: 0.65+Math.random()*0.9,
    }));
    setFlyParticles(p => [...p.slice(-30), ...newP]);
    newP.forEach(np => setTimeout(()=>setFlyParticles(p=>p.filter(x=>x.id!==np.id)), 720));

    // Floating number
    const numId = Date.now()+Math.random();
    const numStr = isCrit ? `💥 CRITIQUE ×5!` : `+${fmt(gain)}`;
    const numColor = isCrit ? '#fbbf24' : newCombo>=5 ? '#f97316' : '#60a5fa';
    setFloatNums(n=>[...n,{id:numId,text:numStr,color:numColor,x:(Math.random()-0.5)*60,big:isCrit}]);
    setTimeout(()=>setFloatNums(n=>n.filter(x=>x.id!==numId)), 950);

    // Shockwave
    const swId = Date.now()+Math.random();
    setShockwaves(s=>[...s,{id:swId,size:isCrit?200:130}]);
    setTimeout(()=>setShockwaves(s=>s.filter(x=>x.id!==swId)), 520);
  }

  // ── MEGA CLIC handler ──
  function handleMegaClick() {
    if (!megaReady||megaFiring) return;
    setMegaFiring(true); setMegaReady(false); setMegaFlash(true);
    const gain = crystalsPerClick*100;
    setCrystals(c=>c+gain); setAllTime(t=>t+gain); setTotalClicks(c=>c+1);
    playClick(false, true);
    const megaP = Array.from({length:40}, () => ({
      id:Date.now()+Math.random(), dx:(Math.random()-0.5)*300, dy:(Math.random()-0.5)*140-60,
      sym:['⭐','✨','💥','💎','🌟','⚡','🔥','👑'][Math.floor(Math.random()*8)],
      size:1+Math.random(),
    }));
    setFlyParticles(p=>[...p.slice(-20),...megaP]);
    megaP.forEach(np=>setTimeout(()=>setFlyParticles(p=>p.filter(x=>x.id!==np.id)),1000));
    const mid=Date.now();
    setFloatNums(n=>[...n,{id:mid,text:`🌟 MEGA ×100 — +${fmt(gain)}!`,color:'#fbbf24',x:0,big:true}]);
    setTimeout(()=>setFloatNums(n=>n.filter(x=>x.id!==mid)),1600);
    setTimeout(()=>{setMegaFlash(false);setMegaFiring(false);setMegaCharge(0);},650);
  }

  // ── Buy upgrade ──
  function buyUpgrade(u) {
    const count = purchased[u.id]||0;
    const cost = Math.floor(u.cost*Math.pow(1.15,count));
    if (crystals<cost) return;
    setCrystals(c=>c-cost); setPurchased(p=>({...p,[u.id]:count+1}));
    playUpgrade();
    setMilestone({msg:`🔨 ${u.name} lvl ${count+1} acheté !`,color:'text-amber-300'});
    setTimeout(()=>setMilestone(null),1800);
  }

  // ── Prestige ──
  function handlePrestige() {
    if (level<100) return;
    if (!confirm(`Prestige ${prestige+1} : Reset crystaux & upgrades contre ×${Math.pow(2,prestige+1)} permanent. Confirmer ?`)) return;
    setPrestige(p=>p+1); setCrystals(0); setPurchased({}); setCombo(1);
    setMegaCharge(0); setMegaReady(false); playLevelUp();
  }

  // ── Gacha open ──
  function openGacha() {
    if (gachaBoxes<=0) return;
    setGachaBoxes(b=>b-1);
    const total = CAT_SKINS.reduce((a,s)=>a+s.weight,0);
    let rand = Math.random()*total, skin=CAT_SKINS[0];
    for (const s of CAT_SKINS) { rand-=s.weight; if(rand<=0){skin=s;break;} }
    setGachaResult(skin);
    if (!unlockedSkins.includes(skin.id)) setUnlockedSkins(prev=>[...prev,skin.id]);
    setShowGacha(true); setTimeout(()=>{setShowGacha(false);setGachaResult(null);},3500);
  }

  // ── Reset ──
  function resetGame() {
    if (!confirm('Reset TOTAL ? Même le prestige sera effacé.')) return;
    setCrystals(0);setAllTime(0);setPurchased({});setPrestige(0);setTotalClicks(0);
    setCritCount(0);setEventCount(0);setMaxCombo(1);setAchievements(new Set());
    setCombo(1);setFoundSpider(false);setStreak(0);setGachaBoxes(0);
    setUnlockedSkins(['default']);setActiveSkin('default');setMegaCharge(0);setMegaReady(false);
    seenMsRef.current=new Set(); seenAchRef.current=new Set();
    ['sc_crystals','sc_alltime','sc_upgrades','sc_prestige','sc_clicks','sc_crits',
     'sc_events','sc_maxcombo','sc_level','sc_milestones','sc_achievements','sc_citation',
     'sc_nextevent','sc_spider','sc_streak','sc_gboxes','sc_skins','sc_skin','sc_gthresh',
     'sc_ddate','sc_dquests','sc_lastsave','sc_lastdate','sc_cps_snapshot'].forEach(k=>localStorage.removeItem(k));
  }

  // ── Render ──
  return (
    <div className="tab-fade space-y-4 cursor-crystal relative">
      {/* Aurora background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" style={{zIndex:0}}>
        <div className="aurora-bg aurora-1" style={{opacity:Math.min(0.15,level*0.002)}}/>
        <div className="aurora-bg aurora-2" style={{opacity:Math.min(0.12,level*0.0015)}}/>
        {level>=30&&<div className="aurora-bg aurora-3" style={{opacity:Math.min(0.1,(level-30)*0.003)}}/>}
      </div>

      <div className="relative" style={{zIndex:1}}>

      {/* Overlays */}
      {levelUpAnim&&(
        <div className="level-up-anim z-[9000]">
          <div className="bg-[#1a0f0a]/95 border-2 border-amber-400 rounded-2xl px-10 py-6 text-center shadow-2xl shadow-amber-900/60">
            <div className="text-4xl mb-2">⬆️</div>
            <div className="text-3xl font-black font-serif text-amber-300">NIVEAU {levelUpAnim.level}</div>
            <div className="text-sm text-amber-500 font-bold uppercase tracking-widest mt-1">{levelUpAnim.title}</div>
          </div>
        </div>
      )}
      {critFlash&&<div className="crit-flash-overlay"/>}
      {megaFlash&&<div className="fixed inset-0 z-[8500] pointer-events-none" style={{background:'radial-gradient(circle at center,rgba(251,191,36,0.45) 0%,transparent 65%)',animation:'critFlashAnim 0.5s ease-out forwards'}}/>}
      {spiderEgg&&(
        <div className="spider-egg">
          <div className="text-center bg-[#1a0f0a]/95 border-2 border-red-500 rounded-2xl p-6 shadow-2xl">
            <img src="https://i.imgur.com/GM7RDI9.jpeg" alt="" className="w-40 h-40 rounded-full mx-auto mb-3 border-4 border-red-600 object-cover"/>
            <div className="text-2xl font-black text-red-400 font-serif">SPIDER-CHAT RÉVÉLÉ !</div>
            <div className="text-xs text-stone-400 mt-1 font-mono">Easter Egg débloqué 🕷️</div>
          </div>
        </div>
      )}
      {showGacha&&gachaResult&&(
        <div className="gacha-reveal">
          <div className="text-center bg-[#0d0a1a]/98 border-2 rounded-2xl p-8 shadow-2xl min-w-[220px]"
            style={{borderColor:gachaResult.color}}>
            <div className="text-6xl mb-3">{gachaResult.emoji||'🐱'}</div>
            <div className="text-xl font-black font-serif mb-1" style={{color:gachaResult.color}}>
              {gachaResult.rarity.toUpperCase()}
            </div>
            <div className="text-base font-bold text-white">{gachaResult.name}</div>
            <div className="text-xs text-stone-500 mt-2 font-mono">Skin chat débloqué !</div>
          </div>
        </div>
      )}
      {idleMsg&&(
        <div className="idle-bonus">
          <div className="bg-[#0d1a12]/95 border border-emerald-600/60 rounded-2xl px-8 py-4 text-center shadow-2xl">
            <div className="text-emerald-300 font-black text-sm font-serif">💤 Bonus d'absence !</div>
            <div className="text-emerald-400 font-black text-lg font-mono">+{fmt(idleMsg.bonus)} crystaux</div>
            <div className="text-stone-500 text-xs">{idleMsg.elapsed}s hors-ligne · 50% CPS</div>
          </div>
        </div>
      )}
      {milestone&&(
        <div className="milestone-banner fixed top-20 left-1/2 z-[300] bg-[#1a0f0a]/95 border border-amber-500/70 rounded-2xl px-8 py-3 text-center shadow-2xl shadow-amber-900/40 pointer-events-none">
          <p className={`text-sm font-black font-serif ${milestone.color}`}>{milestone.msg}</p>
        </div>
      )}
      {achToast&&(
        <div className="milestone-banner fixed top-36 left-1/2 z-[300] bg-[#0d1a12]/95 border border-emerald-500/70 rounded-2xl px-8 py-3 text-center shadow-2xl pointer-events-none">
          <p className="text-sm font-black font-serif text-emerald-300">{achToast.icon} Succès : {achToast.name}</p>
          <p className="text-[10px] text-emerald-600 mt-0.5">{achToast.desc}</p>
        </div>
      )}
      {profilePseudo&&<ProfileDrawer pseudo={profilePseudo} onClose={()=>setProfilePseudo(null)}/>}

      {/* Header */}
      <div className="bg-[#120d0a] border border-[#2a1d14] rounded-xl p-4 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className={`text-2xl ${badge.pulse?'badge-pulse':''} ${badge.rainbow?'rainbow-text':''}`}>{badge.emoji}</div>
          <div>
            <div className={`text-sm font-black ${badge.color} ${badge.rainbow?'rainbow-text':''}`}>{badge.name}</div>
            <div className="text-[10px] text-stone-500 font-mono">Niv.{level} · {levelTitle}{prestige>0?` · ${'★'.repeat(prestige)} Prestige`:''}{streak>0?` · 🔥${streak}j`:''}</div>
          </div>
        </div>
        <div className="flex-1 min-w-[120px] max-w-[200px]">
          <div className="flex justify-between text-[9px] text-stone-600 font-mono mb-1"><span>Niv.{level}</span>{level<100&&<span>Niv.{level+1}</span>}</div>
          <div className="h-1.5 bg-[#211610] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500" style={{width:level>=100?'100%':`${levelPct}%`}}/>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {arcanicEvent&&(
            <div className="flex items-center gap-1.5 bg-yellow-900/40 border border-yellow-600/60 rounded-lg px-2.5 py-1.5">
              <span className="text-yellow-300 text-xs font-black">⭐×10</span>
              <span className="text-yellow-500 text-[10px] font-mono">{eventLeft}s</span>
            </div>
          )}
          {gachaBoxes>0&&(
            <button onClick={openGacha} className="flex items-center gap-1 bg-purple-900/40 border border-purple-600/60 rounded-lg px-2.5 py-1.5 badge-pulse">
              <span className="text-purple-300 text-xs font-black">📦×{gachaBoxes}</span>
            </button>
          )}
          <div className="flex gap-1">
            {[{v:'clicker',l:'🐱'},{v:'leaderboard',l:'🏆'},{v:'achievements',l:'🎖️'},{v:'quests',l:'📋'}].map(({v,l})=>(
              <button key={v} onClick={()=>setActiveView(v)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${activeView===v?'bg-amber-900/50 border-amber-600/50 text-amber-300':'bg-[#0d0907] border-[#211610] text-stone-600 hover:text-stone-400'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CLICKER VIEW ── */}
      {activeView==='clicker'&&(
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Click zone */}
          <div className="lg:col-span-2 bg-[#120d0a] border border-[#2a1d14] rounded-2xl p-5 flex flex-col items-center gap-4">
            {/* Counter */}
            <div className="text-center space-y-1 w-full">
              <div className="text-5xl font-black font-serif text-amber-400 tabular-nums leading-none odometer-num">{fmt(crystals)}</div>
              <div className="text-xs text-stone-600 font-mono">{Math.floor(crystals).toLocaleString('fr-FR')} Arcane Crystals</div>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {cps>0&&<div className="text-xs text-purple-400 font-mono">+{fmt(cps*evMult)} /sec</div>}
                {streak>0&&<div className="text-xs text-orange-400 font-mono">🔥 Streak {streak}j (+{Math.round(streakMult*100-100)}%)</div>}
              </div>
              {cpsHistory.length>2&&(
                <div className="mx-auto w-32 h-8 opacity-70">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline points={sparkPts} fill="none" stroke="#7c3aed" strokeWidth="4" opacity="0.9"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Combo */}
            {combo>1&&(
              <div key={comboKey} className="combo-pop bg-orange-900/60 border border-orange-500/60 rounded-full px-4 py-1">
                <span className="text-sm font-black text-orange-300">×{combo} COMBO !</span>
              </div>
            )}

            {/* Click area */}
            <div className="relative flex flex-col items-center gap-3" ref={clickBtnRef}>
              {/* Floating numbers */}
              {floatNums.map(fn=>(
                <div key={fn.id} className="float-num" style={{color:fn.color,fontSize:fn.big?'0.95rem':'0.8rem',left:`calc(50% + ${fn.x}px)`,fontWeight:900}}>
                  {fn.text}
                </div>
              ))}
              {/* Particles */}
              {flyParticles.map(p=>(
                <span key={p.id} className="fly-crystal" style={{'--dx':p.dx+'px','--dy':p.dy+'px',fontSize:(p.size||1)+'rem'}}>{p.sym}</span>
              ))}
              {/* Shockwaves */}
              {shockwaves.map(sw=>(
                <div key={sw.id} className="shockwave" style={{width:sw.size,height:sw.size,border:'3px solid rgba(251,191,36,0.85)'}}/>
              ))}
              <button onClick={handleClick}
                className={`relative w-44 h-44 rounded-full border-4 flex items-center justify-center select-none overflow-hidden ${clicking?'scale-90':'scale-100'} ${badge.divine?'divine-glow':''} ${badge.rainbow?'rainbow-border':''}`}
                style={{background:'radial-gradient(circle at 35% 35%,#dc2626 0%,#7f1d1d 55%,#3b0000 100%)',boxShadow:`0 0 ${20+clickSpeed*8}px ${auraColor}80, inset 0 0 20px rgba(0,0,0,0.5)`,borderColor:auraColor,transition:'box-shadow 0.25s,border-color 0.25s,transform 0.1s'}}>
                <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 100 100">
                  {[0,30,60,90,120,150].map(a=><line key={a} x1="50" y1="50" x2={50+50*Math.cos(a*Math.PI/180)} y2={50+50*Math.sin(a*Math.PI/180)} stroke="white" strokeWidth="0.8"/>)}
                  {[12,22,32,42].map(r=><circle key={r} cx="50" cy="50" r={r} fill="none" stroke="white" strokeWidth="0.7"/>)}
                </svg>
                <img src="https://i.imgur.com/GM7RDI9.jpeg" alt="Spider-Chat" className="relative z-10 rounded-full object-cover" style={{width:200,height:200,pointerEvents:'none'}}/>
                {skinData.id!=='default'&&<div className="absolute bottom-2 right-2 z-20 text-2xl">{skinData.emoji}</div>}
                {heatLevel>0.6&&Array.from({length:3}).map((_,i)=>(
                  <div key={i} className="vapor-drop" style={{width:4+i*2,height:4+i*2,left:`${28+i*22}%`,animationDelay:`${i*0.35}s`}}/>
                ))}
              </button>
              <div className="text-center space-y-0.5">
                <div className="text-[10px] text-stone-500 font-mono">+{fmt(crystalsPerClick)} /clic{combo>1?` ×${combo} COMBO`:''}{arcanicEvent?' ⭐×10':''}</div>
                <div className="text-[9px] text-stone-700 font-mono">10% crit ×5 · Tape SPIDER!</div>
                {clickSpeed>0&&<div className="text-[9px] font-mono font-bold" style={{color:auraColor}}>⚡ {clickSpeed} clics/sec</div>}
              </div>
            </div>

            {/* MEGA CLIC bar */}
            <div className="w-full max-w-sm space-y-1">
              <div className="flex justify-between text-[9px] text-stone-500 font-mono">
                <span>MEGA CLIC ×100</span>
                <span className={megaReady?'text-amber-400 font-black':''}>
                  {megaReady?'✅ PRÊT — Cliquer !':megaFiring?'💥 FIRING…':`${Math.round(megaCharge)}%`}
                </span>
              </div>
              <div className={`relative h-3.5 bg-[#0a0705] rounded-full border border-[#21160e] overflow-hidden ${megaReady?'cursor-pointer':''}`}
                onClick={megaReady?handleMegaClick:undefined}>
                <div className={`h-full rounded-full ${megaReady?'mega-ready':'mega-bar'}`}
                  style={{width:megaReady?'100%':`${megaCharge}%`,transition:megaReady?'none':'width 0.1s linear'}}/>
                {megaReady&&<div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white drop-shadow">⚡ MEGA CLIC — ×100 !</div>}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
              {[
                {label:'/clic',value:fmt(crystalsPerClick),color:'text-amber-400'},
                {label:'/sec', value:fmt(cps*evMult),      color:'text-purple-400'},
                {label:'total',value:fmt(allTime),          color:'text-stone-300'},
                {label:'clics',value:totalClicks.toLocaleString('fr-FR'),color:'text-blue-400'},
              ].map(s=>(
                <div key={s.label} className="bg-[#0d0907] border border-[#211610] rounded-lg p-2 text-center">
                  <div className={`text-xs font-black font-mono ${s.color} tabular-nums`}>{s.value}</div>
                  <div className="text-[8px] text-stone-700 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Gacha + skins */}
            {(gachaBoxes>0||unlockedSkins.length>1)&&(
              <div className="w-full max-w-sm space-y-2">
                {gachaBoxes>0&&(
                  <button onClick={openGacha} className="w-full bg-purple-900/40 border border-purple-600/60 hover:bg-purple-900/60 rounded-xl py-2.5 flex items-center justify-center gap-2 badge-pulse transition-all">
                    <span className="text-lg">📦</span>
                    <span className="text-sm font-black text-purple-300">Ouvrir Boîte Arcanide ({gachaBoxes})</span>
                  </button>
                )}
                {unlockedSkins.length>1&&(
                  <div className="flex gap-1 flex-wrap">
                    {CAT_SKINS.filter(s=>unlockedSkins.includes(s.id)).map(s=>(
                      <button key={s.id} onClick={()=>setActiveSkin(s.id)}
                        className={`px-2 py-1 rounded-lg text-xs border transition-all ${activeSkin===s.id?'bg-amber-900/50 border-amber-600 text-amber-300':'bg-[#0d0907] border-[#211610] text-stone-500 hover:text-stone-300'}`}>
                        {s.emoji||'🐱'} {s.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Citation */}
            <div className="w-full max-w-sm">
              {editCit?(
                <input maxLength={100} value={citation} onChange={e=>setCitation(e.target.value)}
                  className="w-full bg-[#0a0605] border border-[#3e2a1e] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-700 font-mono"
                  placeholder="Votre citation (100 chars)"
                  onBlur={()=>{setEditCit(false);syncScore();}} autoFocus/>
              ):(
                <button onClick={()=>setEditCit(true)} className="w-full text-center text-[10px] text-stone-600 hover:text-stone-400 italic border border-dashed border-[#211610] hover:border-[#3a2a1c] rounded-lg py-2 px-3 transition-all">
                  {citation||'✏️ Ajouter une citation…'}
                </button>
              )}
            </div>

            {/* Prestige */}
            {level>=100&&(
              <button onClick={handlePrestige} className="w-full max-w-sm divine-glow bg-gradient-to-r from-amber-900/60 to-yellow-900/60 border border-amber-400/60 rounded-xl py-3 font-black text-amber-300 text-sm font-serif uppercase tracking-wider">
                ✨ PRESTIGE {prestige+1} — ×{Math.pow(2,prestige+1)} permanent
              </button>
            )}
            <button onClick={resetGame} className="text-[8px] text-stone-800 hover:text-red-700 transition-colors font-mono underline">Réinitialiser</button>
          </div>

          {/* Upgrades */}
          <div className="bg-[#120d0a] border border-[#2a1d14] rounded-2xl p-3 flex flex-col gap-2 overflow-y-auto max-h-[680px]">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-500 flex items-center gap-1.5 px-1 sticky top-0 bg-[#120d0a] py-1 z-10">
              <Sparkles className="w-3 h-3 text-amber-500"/> Améliorations ({upgradeCount}/15)
            </h3>
            {CLICKER_UPGRADES.map(u=>{
              const count=purchased[u.id]||0;
              const cost=Math.floor(u.cost*Math.pow(1.15,count));
              const can=crystals>=cost;
              const roi=u.cps>0?(cost/(u.cps*prestigeMult)).toFixed(0)+'s':null;
              return (
                <button key={u.id} onClick={()=>buyUpgrade(u)} disabled={!can}
                  data-tip={roi?`ROI: ${roi}`:undefined}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all ${can?'upgrade-avail bg-amber-900/20 border-amber-700/40 hover:bg-amber-900/30':'bg-[#0a0705] border-[#1c1108] opacity-40 cursor-not-allowed'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base leading-none">{u.icon}</span>
                      <span className="text-[11px] font-bold text-stone-300">{u.name}</span>
                    </div>
                    {count>0&&<span className="text-[9px] bg-amber-900/70 text-amber-300 border border-amber-700/50 px-1.5 py-0.5 rounded font-mono">×{count}</span>}
                  </div>
                  <div className="text-[9px] text-stone-600 mt-0.5">{u.desc}</div>
                  <div className={`text-[10px] font-black font-mono mt-1 ${can?'text-amber-400':'text-stone-700'}`}>💎 {fmt(cost)}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── LEADERBOARD VIEW ── */}
      {activeView==='leaderboard'&&(
        <div className="bg-[#120d0a] border border-[#2a1d14] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black font-serif text-stone-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500"/> Classement Global
            </h3>
            <button onClick={fetchLb} className="text-[10px] text-stone-600 hover:text-stone-400 font-mono flex items-center gap-1">
              <RefreshCw className="w-3 h-3"/> Refresh
            </button>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {[{k:'crystaux',l:'💎 Crystaux'},{k:'cps',l:'⚡ CPS'},{k:'niveau',l:'⬆️ Niveau'},{k:'clics',l:'🖱️ Clics'}].map(({k,l})=>(
              <button key={k} onClick={()=>setLbTab(k)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${lbTab===k?'bg-amber-900/40 border-amber-600/50 text-amber-300':'bg-[#0d0907] border-[#211610] text-stone-600'}`}>{l}</button>
            ))}
          </div>
          {lbLoading?(
            <div className="text-center text-stone-600 text-xs py-6 font-mono">Chargement…</div>
          ):leaderboard.length===0?(
            <div className="text-center text-stone-600 text-xs py-6 font-mono">Aucune entrée — joue pour apparaître !</div>
          ):(
            <div className="space-y-2">
              {/* Podium top 3 */}
              {leaderboard.length>=3&&(
                <div className="flex justify-center items-end gap-4 pb-3">
                  {[{pos:1,idx:0,h:'h-16'},{pos:0,idx:1,h:'h-20'},{pos:2,idx:2,h:'h-12'}].map(({pos,idx,h})=>{
                    const row=leaderboard[pos];if(!row)return null;
                    const medals=['🥇','🥈','🥉'];const isMe=row.pseudo===userPseudo;
                    return(
                      <div key={pos} className="flex flex-col items-center gap-1">
                        <div className="text-2xl">{row.badge_emoji}</div>
                        <button onClick={()=>setProfilePseudo(row.pseudo)} className={`text-[10px] font-bold ${isMe?'text-amber-300':'text-stone-300'} hover:underline`}>{row.pseudo.slice(0,8)}</button>
                        <div className={`w-12 ${h} rounded-t-lg flex items-end justify-center pb-1 text-xl`}
                          style={{background:pos===1?'linear-gradient(#fbbf24,#92400e)':pos===0?'linear-gradient(#94a3b8,#475569)':'linear-gradient(#cd7c2f,#78350f)'}}>
                          {medals[pos]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {leaderboard.map((row,i)=>{
                const isMe=row.pseudo===userPseudo;
                const medal=['🥇','🥈','🥉'][i]||`#${i+1}`;
                const val=lbTab==='crystaux'?row.crystaux:lbTab==='cps'?row.cps:lbTab==='niveau'?row.niveau:row.total_clics;
                return(
                  <div key={row.pseudo} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${isMe?'bg-amber-900/25 border-amber-600/50':'bg-[#0d0907] border-[#211610] hover:border-[#3a2a1c]'}`}>
                    <span className="text-sm w-6 text-center">{medal}</span>
                    <span className="text-base">{row.badge_emoji}</span>
                    <button onClick={()=>setProfilePseudo(row.pseudo)} className="flex-1 text-left">
                      <span className={`text-xs font-bold ${isMe?'text-amber-300':'text-stone-300'} hover:underline`}>{row.pseudo}</span>
                      {row.prestige>0&&<span className="ml-1 text-[9px] text-yellow-400">{'★'.repeat(Math.min(row.prestige,5))}</span>}
                    </button>
                    <div className="text-right">
                      <div className="text-xs font-black font-mono text-amber-400">{fmt(val||0)}</div>
                      <div className="text-[9px] text-stone-600">Niv.{row.niveau||1}</div>
                    </div>
                  </div>
                );
              })}
              {/* Rang hors top 10 */}
              {userPseudo&&myRank&&myRank>10&&(
                <div className="pt-2 border-t border-[#211610]">
                  <div className="text-[9px] text-stone-600 font-mono text-center mb-1">Votre position</div>
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-amber-900/20 border-amber-700/40">
                    <span className="text-sm w-6 text-center font-black text-amber-400">#{myRank}</span>
                    <span className="text-base">{badge.emoji}</span>
                    <span className="flex-1 text-xs font-bold text-amber-300">{userPseudo}</span>
                    <span className="text-xs font-black font-mono text-amber-400">{fmt(allTime)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
          {userPseudo&&(
            <div className="text-center pt-2 border-t border-[#211610]">
              <button onClick={syncScore} className="text-[10px] text-amber-700 hover:text-amber-500 font-mono underline">Synchro mon score maintenant</button>
            </div>
          )}
        </div>
      )}

      {/* ── ACHIEVEMENTS VIEW ── */}
      {activeView==='achievements'&&(
        <div className="bg-[#120d0a] border border-[#2a1d14] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-black font-serif text-stone-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500"/> Succès ({achievements.size}/{ACHIEVEMENTS.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ACHIEVEMENTS.map(a=>{
              const done=achievements.has(a.id);
              return(
                <div key={a.id} className={`p-3 rounded-xl border text-center transition-all ${done?'bg-emerald-900/20 border-emerald-700/50':'bg-[#0a0705] border-[#1c1108] opacity-50'}`}>
                  <div className="text-xl mb-1">{a.icon}</div>
                  <div className={`text-[10px] font-bold ${done?'text-emerald-300':'text-stone-600'}`}>{a.name}</div>
                  <div className="text-[9px] text-stone-700 mt-0.5">{a.desc}</div>
                  {done&&<div className="text-[8px] text-emerald-600 mt-1">✓ Débloqué</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── DAILY QUESTS VIEW ── */}
      {activeView==='quests'&&(
        <div className="bg-[#120d0a] border border-[#2a1d14] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black font-serif text-stone-100">📋 Quêtes Journalières</h3>
            <div className="text-[10px] text-orange-400 font-mono font-bold">🔥 {streak} jours de suite</div>
          </div>
          <div className="text-[10px] text-stone-600 font-mono">Reset à minuit · {Math.ceil((new Date().setHours(23,59,59,999)-Date.now())/3600000)}h restantes</div>
          <div className="space-y-3">
            {dailyQuests.map(q=>{
              const pct=Math.min(100,(q.progress/q.target)*100);
              return(
                <div key={q.id} className={`p-4 rounded-xl border ${q.done?'bg-emerald-900/20 border-emerald-700/50':'bg-[#0d0907] border-[#211610]'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold ${q.done?'text-emerald-300':'text-stone-300'}`}>{q.done?'✅ ':''}{q.desc}</span>
                    <span className="text-[10px] text-amber-400 font-mono font-black">+{fmt(q.reward)} 💎</span>
                  </div>
                  <div className="w-full bg-[#0a0705] h-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${q.done?'bg-emerald-500':'bg-amber-500'}`} style={{width:`${pct}%`}}/>
                  </div>
                  <div className="text-[9px] text-stone-600 font-mono mt-1">{q.progress.toLocaleString('fr-FR')} / {q.target.toLocaleString('fr-FR')}</div>
                </div>
              );
            })}
          </div>
          <div className="bg-[#0d0907] border border-[#211610] rounded-xl p-3 text-center space-y-1">
            <div className="text-[10px] text-stone-500 font-mono">Bonus streak actuel</div>
            <div className="text-base font-black text-orange-400">🔥 ×{streakMult.toFixed(2)} sur tous les gains</div>
            <div className="text-[9px] text-stone-600 font-mono">+2% par jour consécutif · max +50%</div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}

// ── App principal ─────────────────────────────────────────────────────────
export default function App() {
  const [isRegistered, setIsRegistered] = useState(() =>
    !!(localStorage.getItem('taverne_pseudo') && localStorage.getItem('taverne_registered'))
  );
  const [userPseudo, setUserPseudo] = useState(() => localStorage.getItem('taverne_pseudo') || '');
  const [powerLevel, setPowerLevel] = useState(() => {
    try { return parseInt(localStorage.getItem('sc_level') || '1'); } catch { return 1; }
  });
  useEffect(() => {
    const handler = e => setPowerLevel(e.detail);
    window.addEventListener('powerlevel', handler);
    return () => window.removeEventListener('powerlevel', handler);
  }, []);

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
  const [activeSection,  setActiveSection]  = useState(0);
  const [guideSearch,    setGuideSearch]    = useState('');
  const [readSections,   setReadSections]   = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('taverne_guide_read') || '[]')); } catch { return new Set(); }
  });
  const [copyDone,       setCopyDone]       = useState(false);

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
  const handleRegister = async (e, overridePseudo) => {
    if (e && e.preventDefault) e.preventDefault();
    const clean = (overridePseudo || userPseudo).trim();
    if (!clean) return;
    localStorage.setItem('taverne_registered', 'true');
    localStorage.setItem('taverne_pseudo', clean);
    // Update pseudo history (max 5)
    try {
      const hist = JSON.parse(localStorage.getItem('taverne_historique') || '[]');
      const level = parseInt(localStorage.getItem('sc_level') || '1');
      const allTime = parseInt(localStorage.getItem('sc_alltime') || '0');
      const existing = hist.find(h => h.pseudo === clean);
      const entry = { pseudo: clean, level, crystals: allTime, lastSeen: new Date().toISOString().slice(0,10) };
      const filtered = hist.filter(h => h.pseudo !== clean);
      localStorage.setItem('taverne_historique', JSON.stringify([entry, ...filtered].slice(0, 5)));
    } catch {}
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

  const guideQ = guideSearch.trim().toLowerCase();
  const guideSectionsFiltered = GUIDE.filter(s =>
    !guideQ || s.title.toLowerCase().includes(guideQ) ||
    s.content.some(b =>
      (b.text||'').toLowerCase().includes(guideQ) ||
      (b.items||[]).some(it => it.toLowerCase().includes(guideQ))
    )
  );

  function guideWordCount(section) {
    return section.content.reduce((acc, b) => {
      const t = (b.text||'') + (b.items||[]).join(' ') + (b.text ? '' : '');
      return acc + t.split(/\s+/).filter(Boolean).length;
    }, 0);
  }

  function markRead(idx) {
    setReadSections(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      localStorage.setItem('taverne_guide_read', JSON.stringify([...next]));
      return next;
    });
  }

  function copySection(idx) {
    const s = GUIDE[idx];
    const lines = [`# ${s.icon} ${s.title}`, ''];
    s.content.forEach(b => {
      if (b.t === 'h')    lines.push(`\n## ${b.text}`);
      else if (b.text)    lines.push(b.text);
      else if (b.items)   b.items.forEach(it => lines.push(`• ${it}`));
    });
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 1800);
    });
  }

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
        <div className="bg-[#150e0b]/90 backdrop-blur-sm p-8 rounded-xl border border-[#38261c] shadow-2xl max-w-md w-full text-center space-y-5 relative z-10">
          <div className="inline-flex p-3 bg-[#e58219]/10 rounded-full border border-[#e58219]/20">
            <Beer className="w-10 h-10 text-[#e58219]"/>
          </div>
          <div>
            <h2 className="text-2xl font-serif font-black text-white uppercase tracking-wider">Taverne d'Arcane Frontier</h2>
            <p className="text-xs text-stone-400 mt-1">Identifiez-vous pour accéder aux registres de la guilde.</p>
          </div>

          {/* Historique pseudos */}
          {(() => {
            try {
              const hist = JSON.parse(localStorage.getItem('taverne_historique') || '[]');
              if (hist.length === 0) return null;
              return (
                <div className="text-left space-y-2">
                  <div className="text-[10px] text-stone-600 uppercase tracking-widest font-mono">Retour rapide</div>
                  {hist.map(h => {
                    const badge = [...BADGES].reverse().find(b => (h.level||1) >= b.min) ?? BADGES[0];
                    return (
                      <button key={h.pseudo} onClick={() => handleRegister(null, h.pseudo)}
                        className="w-full flex items-center gap-3 bg-[#0a0605] border border-[#2a1d14] hover:border-[#4a3020] rounded-lg px-4 py-2.5 transition-all group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-sm font-black text-stone-950 font-serif flex-shrink-0">
                          {h.pseudo.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-bold text-stone-200 group-hover:text-white">{h.pseudo}</div>
                          <div className="text-[9px] text-stone-600 font-mono">{badge.emoji} Niv.{h.level||1} · {(h.crystals||0).toLocaleString('fr-FR')} crystaux</div>
                        </div>
                        <span className="text-[9px] text-stone-700 group-hover:text-amber-600 font-mono">{h.lastSeen}</span>
                      </button>
                    );
                  })}
                  <div className="text-[9px] text-stone-700 text-center font-mono pt-1">— ou nouveau personnage —</div>
                </div>
              );
            } catch { return null; }
          })()}

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
    { id:'minijeux',    label:'Mini-Jeux',        icon:Gamepad2 },
    { id:'profil',      label:'Profil',           icon:User },
  ];

  const powerClass = powerLevel >= 100 ? 'power-100' : powerLevel >= 90 ? 'power-90' : powerLevel >= 75 ? 'power-75' : powerLevel >= 60 ? 'power-60' : powerLevel >= 50 ? 'power-50' : powerLevel >= 30 ? 'power-30' : powerLevel >= 20 ? 'power-20' : powerLevel >= 10 ? 'power-10' : '';

  return (
    <PowerLevelCtx.Provider value={powerLevel}>
    <div className={`min-h-screen text-stone-300 font-sans antialiased ${shaking ? 'screen-shake' : ''} ${powerClass}`}
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
            GUIDE INTÉGRÉ — NIVEAU WIKIPEDIA
        ═══════════════════════════════════════════════════════ */}
        {!loading && activeTab === 'guides' && (
          <div className="tab-fade flex flex-col md:flex-row gap-4" style={{minHeight:'70vh'}}>

            {/* Sidebar */}
            <aside className="md:w-60 flex-shrink-0 space-y-1">
              {/* Barre de recherche */}
              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500"/>
                <input type="text" value={guideSearch} onChange={e=>setGuideSearch(e.target.value)}
                  placeholder="Rechercher dans le guide..."
                  className="w-full bg-[#0d0907] border border-[#2b1c13] rounded-lg py-2 pl-8 pr-8 text-xs text-white focus:outline-none focus:border-amber-600"/>
                {guideSearch && <button onClick={()=>setGuideSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"><X className="w-3.5 h-3.5"/></button>}
              </div>

              {/* Progression globale sections lues */}
              <div className="px-1 pb-2">
                <div className="flex justify-between text-[10px] text-stone-500 mb-1">
                  <span className="uppercase tracking-wider">Sections lues</span>
                  <span className="font-mono text-amber-500">{readSections.size}/{GUIDE.length}</span>
                </div>
                <div className="w-full bg-[#0d0907] h-1.5 rounded-full overflow-hidden border border-[#211610]">
                  <div className="h-full bg-gradient-to-r from-amber-700 to-amber-400 rounded-full transition-all"
                    style={{width:`${Math.round(readSections.size/GUIDE.length*100)}%`}}/>
                </div>
              </div>

              {/* Liste des sections */}
              {(guideSearch ? guideSectionsFiltered : GUIDE).map((s,i)=>{
                const realIdx = GUIDE.indexOf(s);
                const isRead = readSections.has(realIdx);
                return (
                  <button key={i} onClick={()=>{setActiveSection(realIdx); setGuideSearch('');}}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${activeSection===realIdx?'bg-amber-900/50 text-amber-200 border border-amber-700/60':'text-stone-400 hover:text-stone-200 hover:bg-[#1a130f]'}`}>
                    <span className="flex-shrink-0">{s.icon}</span>
                    <span className="leading-tight flex-1">{s.title}</span>
                    {isRead && <span className="text-emerald-500 flex-shrink-0 text-[10px]">✓</span>}
                  </button>
                );
              })}
              {guideSearch && guideSectionsFiltered.length === 0 && (
                <p className="text-stone-600 text-xs italic px-3 py-2">Aucun résultat.</p>
              )}
            </aside>

            {/* Contenu principal */}
            <div className="flex-1 bg-[#120d0a] border border-[#2a1d14] rounded-xl overflow-hidden flex flex-col">

              {/* En-tête section */}
              <div className="px-5 pt-5 pb-3 border-b border-[#241810] flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black font-serif text-stone-100 flex items-center gap-2">
                    <span>{GUIDE[activeSection].icon}</span>
                    <span>{GUIDE[activeSection].title}</span>
                    {readSections.has(activeSection) && <span className="text-emerald-400 text-sm">✓</span>}
                  </h2>
                  <p className="text-[10px] text-stone-600 font-mono mt-0.5">
                    ~{guideWordCount(GUIDE[activeSection])} mots · Section {activeSection+1}/{GUIDE.length}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={()=>copySection(activeSection)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1a130f] border border-[#352018] text-stone-400 hover:text-stone-200 text-[11px] font-medium transition-colors">
                    <Copy className="w-3 h-3"/>
                    {copyDone ? 'Copié !' : 'Copier'}
                  </button>
                  <button onClick={()=>markRead(activeSection)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${readSections.has(activeSection)?'bg-emerald-900/40 border-emerald-700/60 text-emerald-300':'bg-[#1a130f] border-[#352018] text-stone-400 hover:text-stone-200'}`}>
                    <CheckCircle2 className="w-3 h-3"/>
                    {readSections.has(activeSection) ? 'Lu ✓' : 'Marquer lu'}
                  </button>
                </div>
              </div>

              {/* Corps */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {GUIDE[activeSection].content.map((block,i)=>(
                  <GuideBlock key={i} block={block}/>
                ))}
              </div>

              {/* Navigation bas */}
              <div className="px-5 py-3 border-t border-[#1e130c] flex justify-between items-center">
                <button disabled={activeSection===0} onClick={()=>{setActiveSection(s=>s-1); markRead(activeSection);}}
                  className="text-xs text-stone-500 hover:text-stone-300 disabled:opacity-30 flex items-center gap-1">
                  ← {activeSection > 0 ? GUIDE[activeSection-1].title : ''}
                </button>
                <span className="text-[10px] text-stone-700 font-mono">{activeSection+1}/{GUIDE.length}</span>
                <button disabled={activeSection===GUIDE.length-1} onClick={()=>{markRead(activeSection); setActiveSection(s=>s+1);}}
                  className="text-xs text-stone-500 hover:text-stone-300 disabled:opacity-30 flex items-center gap-1">
                  {activeSection < GUIDE.length-1 ? GUIDE[activeSection+1].title : ''} →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            MINI-JEUX
        ═══════════════════════════════════════════════════════ */}
        {!loading && activeTab === 'minijeux' && (
          <div className="tab-fade">
            <div className="mb-5">
              <h2 className="text-lg font-black font-serif text-stone-100 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-amber-500"/> Mini-Jeux
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">Spider-Chat Clicker v3 — Badges · Leaderboard · Prestige · Succès</p>
            </div>
            <SpiderChatClicker userPseudo={userPseudo} />
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
    </PowerLevelCtx.Provider>
  );
}
