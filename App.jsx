import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Flame, RefreshCw, Plus, X, Check, Minus, Trash2, BookOpen, Hammer, Sparkles, Swords,
  Search, Pin, Compass, Pickaxe, Gauge, FlaskConical, Wand2, Backpack, Cog, Skull, Settings, ShieldHalf,
} from "lucide-react";

const C = {
  bg: "#0c0e13", panel: "#14171f", panel2: "#1b1f29", line: "#2a2f3b",
  ink: "#e8e3d6", mut: "#8b91a0", faint: "#5c626f",
  teal: "#4fd6c2", amber: "#e6ad4c", purple: "#a98bdb", red: "#d66a52", green: "#6fbf73",
};
const F = {
  disp: "'Cinzel', Georgia, serif",
  body: "'Spectral', Georgia, serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Spectral:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;600&display=swap');
* { box-sizing: border-box; }
.tav-root { background:
  radial-gradient(900px 500px at 80% -10%, rgba(79,214,194,.07), transparent 60%),
  radial-gradient(700px 500px at 10% 110%, rgba(230,173,76,.06), transparent 60%),
  ${C.bg}; }
.tav-btn { transition: transform .12s ease, background .15s ease, border-color .15s ease, color .15s ease; }
.tav-btn:hover { transform: translateY(-1px); }
.tav-card { transition: border-color .15s ease, background .15s ease; }
.tav-row:hover { background: rgba(255,255,255,.025); }
.tav-tab { transition: color .15s ease, border-color .15s ease; }
.gnav button { transition: background .15s ease, color .15s ease, border-color .15s ease; }
input, textarea, button, select { font-family: inherit; }
::placeholder { color: ${C.faint}; }
@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 1s linear infinite; }
.guide-wrap { display: flex; gap: 22px; align-items: flex-start; }
.guide-nav { width: 232px; flex-shrink: 0; display: flex; flex-direction: column; gap: 4px; position: sticky; top: 12px; }
.guide-body { flex: 1; min-width: 0; }
@media (max-width: 720px) {
  .guide-wrap { flex-direction: column; }
  .guide-nav { width: 100%; flex-direction: row; overflow-x: auto; position: static; padding-bottom: 4px; }
  .guide-nav button { white-space: nowrap; }
}
@media (prefers-reduced-motion: reduce){ .tav-btn,.tav-card,.tav-tab,.gnav button{ transition:none; } .spin{ animation:none; } }
`;

const hasStore = typeof window !== "undefined" && window.storage;
const mem = {};
async function sGet(k, shared = true) {
  if (!hasStore) return k in mem ? mem[k] : null;
  try { const r = await window.storage.get(k, shared); return r ? r.value : null; } catch { return null; }
}
async function sSet(k, v, shared = true) {
  if (!hasStore) { mem[k] = v; return; }
  try { await window.storage.set(k, v, shared); } catch (e) { console.error(e); }
}
const getJSON = async (k, s = true) => { const v = await sGet(k, s); try { return v ? JSON.parse(v) : null; } catch { return null; } };
const setJSON = (k, val, s = true) => sSet(k, JSON.stringify(val), s);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const CATS = [
  { k: "ferme", label: "Fermes", col: C.teal },
  { k: "base", label: "Base & déco", col: C.amber },
  { k: "stuff", label: "Stuff & équipement", col: C.purple },
  { k: "explo", label: "Exploration", col: C.red },
  { k: "autre", label: "Autre", col: C.mut },
];
const catOf = (k) => CATS.find((c) => c.k === k) || CATS[4];
const TAGS = [
  { k: "avancee", label: "Avancée", col: C.amber },
  { k: "boss", label: "Boss", col: C.red },
  { k: "spot", label: "Spot", col: C.teal },
  { k: "loot", label: "Loot", col: C.purple },
  { k: "info", label: "Info", col: C.mut },
];
const tagOf = (k) => TAGS.find((t) => t.k === k);

const parseMat = (line) => {
  const m = line.match(/^(\d+)\s+(.*)/);
  if (m) return { id: uid(), label: m[2].trim(), needed: parseInt(m[1], 10), got: 0, by: null };
  return { id: uid(), label: line.trim(), needed: 1, got: 0, by: null };
};
const SEED_PROJECTS = [{
  id: uid(), name: "Machine à XP (Create)", category: "ferme",
  desc: "Ferme à XP automatisée. Goulot : le brass (besoin d'un blaze pour le Blaze Burner).",
  created: Date.now(),
  mats: ["45 Fer", "18 Cuivre", "18 Zinc", "3 Or", "40 Andésite", "6 Quartz", "50 Redstone",
    "40 Bois (bûches)", "4 Varech séché", "1 Verre", "1 Charbon", "3 Bâtons",
    "1 Blaze → Blaze Burner", "1 Seau de lave", "1 Seau d'eau"].map(parseMat),
}];

const GUIDE = [
  { id: "demarrage", title: "Démarrage & survie", icon: Compass, blocks: [
    { p: "Ce pack est punitif. L'objectif des premières heures n'est PAS de miner du fer, c'est de ne pas mourir." },
    { h: "Checklist première session" },
    { list: ["Ouvre le livre de quêtes — il guide la progression voulue par l'auteur.",
      "Repère tes 3 jauges : faim, soif, température.",
      "Trouve de l'eau potable (purifiée / bouillie — l'eau brute peut rendre malade).",
      "Mange et bois avant que les jauges soient vides.",
      "Surveille la température : surchauffe près de la lave/désert, hypothermie en neige.",
      "Construis un abri avant la première nuit."] },
    { tip: "Ne creuse jamais droit vers le bas : chute, lave, ou un mob qui t'attend." },
  ] },
  { id: "pack", title: "Particularités du pack", icon: Sparkles, blocks: [
    { p: "Le pack change des règles fondamentales de Minecraft. À intégrer avant tout." },
    { list: ["Le Nether et l'End sont supprimés → tout l'endgame est dans la Voidsent Forest, un biome de surface.",
      "1000+ recettes modifiées : ne présume rien, vérifie dans EMI/JEI.",
      "Event moons : certaines nuits deviennent des marées de monstres dangereux.",
      "Blights : variantes de mobs surpuissantes.",
      "World gen retravaillée : grottes d'Alex's Caves, abysses d'Aquamirae, battle towers."] },
    { tip: "Réflexe permanent : ouvre EMI sur le moindre objet pour voir sa recette réelle." },
  ] },
  { id: "combat", title: "Combat (Better Combat)", icon: Swords, blocks: [
    { p: "Le combat est directionnel. Le spam clic-gauche ne fonctionne plus." },
    { list: ["Chaque arme a une géométrie : épée (arc moyen), lance (ligne, longue portée), masse (AoE lente), dagues (rapides, courtes).",
      "Recule entre les coups — certains mobs ont +30 % de vitesse d'IA.",
      "Un mob à la fois : se faire encercler = mort.",
      "Porte une panoplie complète pour débloquer les bonus de set.",
      "Équipe artefacts et curios dans leurs slots dédiés."] },
  ] },
  { id: "minage", title: "Minage", icon: Pickaxe, blocks: [
    { p: "Pas de 3×3 au début : c'est un gouffre à durabilité et à temps." },
    { h: "Minage en branches" },
    { list: ["Couloir principal de 1 large × 2 haut.",
      "Branches d'1 bloc tous les 3 blocs (2 blocs de pierre entre chaque).",
      "Torche tous les 6-8 blocs pour bloquer les spawns."] },
    { h: "Profondeurs (base 1.20.1)" },
    { list: ["Fer : ~Y15 (et grottes).", "Diamant / redstone : ~Y-59.", "Or : ~Y-16.",
      "Nickel, quartz et aluminium ont été rendus beaucoup plus fréquents."] },
    { tip: "Cherche un vein-miner : Options → Commandes, tape « vein ». S'il existe, c'est ta vraie vitesse." },
  ] },
  { id: "xp", title: "Fermes à XP", icon: Gauge, blocks: [
    { p: "Plusieurs méthodes selon ton avancement." },
    { list: ["Sans rien : le four (cuisson/fonte = XP) + le livre de quêtes.",
      "Spawner trouvé : enferme-le sur place, fais une chambre d'abattage où TU portes le coup fatal.",
      "Tour à mobs : gros chantier en hauteur, rendement moyen dans ce pack (spawn durci).",
      "Machine Create : automatisable (voir l'onglet Projets)."] },
    { tip: "Un mob tué par l'environnement (chute, lave) ne donne aucune XP — c'est toi qui dois l'achever." },
  ] },
  { id: "apotheosis", title: "Apotheosis (affixes)", icon: FlaskConical, blocks: [
    { p: "Système d'affixes et de gemmes : un des piliers de la puissance dans le pack." },
    { list: ["Reforge à la Reforging Table : objet + matériau de rareté + carburant (Sigil of Rebirth / gem dust) + XP → affixes aléatoires.",
      "Salvaging Table : casse du loot à affixes pour récupérer des matériaux de rareté.",
      "Gemmes : se sertissent dans les sockets (clic droit), bonus selon le type d'objet.",
      "World Tiers (CTRL+T) : montent la difficulté ET la qualité du loot."] },
    { tip: "Garde les matériaux de haute rareté pour une pièce que tu comptes vraiment garder. Reforger consomme des niveaux d'XP." },
  ] },
  { id: "magie", title: "Magie (Iron's Spells)", icon: Wand2, blocks: [
    { p: "9 écoles de magie. Les sorts s'inscrivent dans un grimoire et coûtent du mana." },
    { h: "Build mêlée" },
    { list: ["Privilégie le soutien (Summon Vex, Mirror Image) plutôt que le dégât pur.",
      "Mirror Image : des leurres que les ennemis attaquent à ta place — top survie, ne dépend pas de la puissance magique.",
      "Évite les nukes à distance : avec peu de spell power, ton épée fait mieux."] },
    { h: "Bases" },
    { list: ["Grimoire de départ : Flimsy Journal (5 slots).",
      "Inscription Table pour lier les scrolls au grimoire.",
      "Explore les Wizard Towers près des villages dès le début."] },
  ] },
  { id: "backpack", title: "Sacs (Sophisticated)", icon: Backpack, blocks: [
    { p: "Sophisticated Backpacks — deux façons distinctes d'agrandir." },
    { list: ["Paliers (cuir → cuivre → fer → or → diamant → netherite) : sac + Tier Upgrade dans la grille → plus de slots, contenu conservé.",
      "Stack Upgrades : à placer dans les slots d'amélioration du sac → plus d'objets par case (idéal pour stocker en masse)."] },
    { tip: "Recettes possiblement modifiées : vérifie les upgrades dans EMI." },
  ] },
  { id: "create", title: "Create", icon: Cog, blocks: [
    { p: "Automatisation mécanique. Deux paliers : andésite (basique) et brass/laiton (intelligent : filtrer, déplacer)." },
    { list: ["Andesite Alloy (andésite + pépite de fer) : la base, fabricable à la main.",
      "Brass (cuivre + zinc) : à mixer sur un Blaze Burner chauffé → il faut un blaze. Nether supprimé = c'est le vrai goulot.",
      "Precision Mechanism & Brass Hands : via Mechanical Crafters."] },
    { tip: "Pour les quantités exactes d'un montage, utilise l'arbre de recettes d'EMI." },
  ] },
  { id: "boss", title: "Boss", icon: Skull, blocks: [
    { p: "60+ boss, chacun avec une capacité unique. Ce ne sont pas de simples sacs à PV." },
    { list: ["Obliterator : invoque des clones immortels à chaque changement de phase.",
      "Ignis : fait pleuvoir des météores.",
      "Dragons : pouvoirs « supercharged ».",
      "Certains ont +30 % de vitesse d'IA — anticipe au lieu de réagir."] },
    { tip: "Avant un boss : potions, nourriture qui régénère, panoplie complète, artefacts, et une route de fuite." },
  ] },
  { id: "perf", title: "Performance & confort", icon: Settings, blocks: [
    { list: ["Alloue 6-8 Go de RAM (pas plus : trop de RAM peut empirer les saccades).",
      "Ne rajoute pas de mods d'optimisation au hasard (risque de crash).",
      "Sauvegarde tes configs avant chaque MAJ du pack (les mondes ne sont pas toujours compatibles).",
      "En serveur : prends le Server Pack de la même version exacte que le client."] },
  ] },
];

const btnGhost = { background: "transparent", color: C.mut, border: `1px solid ${C.line}`, borderRadius: 8, padding: "7px 11px", cursor: "pointer", display: "flex", gap: 6, alignItems: "center", fontFamily: F.mono, fontSize: 12 };
const btnSolid = (col) => ({ background: col, color: "#0c0e13", border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", display: "flex", gap: 6, alignItems: "center", fontFamily: F.disp, fontWeight: 600, fontSize: 13 });
const inputStyle = { background: C.bg, color: C.ink, border: `1px solid ${C.line}`, borderRadius: 8, padding: "10px 12px", fontFamily: F.body, fontSize: 15, width: "100%", outline: "none" };
const ctrlBtn = { background: C.bg, border: `1px solid ${C.line}`, color: C.mut, borderRadius: 6, width: 26, height: 26, display: "grid", placeItems: "center", cursor: "pointer" };

export default function App() {
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [guild, setGuild] = useState("La Taverne d'Arcane Frontier");
  const [members, setMembers] = useState([]);
  const [tab, setTab] = useState("projets");
  const [projects, setProjects] = useState([]);
  const [findings, setFindings] = useState([]);
  const [raids, setRaids] = useState([]);
  const [syncing, setSyncing] = useState(false);

  const refresh = useCallback(async () => {
    setSyncing(true);
    const [p, f, r, g, mb] = await Promise.all([
      getJSON("af2_projects"), getJSON("af2_findings"), getJSON("af2_raids"), getJSON("af2_guild"), getJSON("af2_members"),
    ]);
    if (p) setProjects(p); if (f) setFindings(f); if (r) setRaids(r); if (g) setGuild(g); if (mb) setMembers(mb);
    setSyncing(false);
  }, []);

  useEffect(() => {
    (async () => {
      const local = await sGet("af2_myname", false);
      if (local) setName(local);
      let p = await getJSON("af2_projects");
      if (!p) { p = SEED_PROJECTS; await setJSON("af2_projects", p); }
      setProjects(p);
      setFindings((await getJSON("af2_findings")) || []);
      setRaids((await getJSON("af2_raids")) || []);
      setGuild((await getJSON("af2_guild")) || "La Taverne d'Arcane Frontier");
      setMembers((await getJSON("af2_members")) || []);
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!ready || !name) return;
    (async () => {
      const list = (await getJSON("af2_members")) || [];
      if (!list.includes(name)) { const next = [...list, name]; setMembers(next); setJSON("af2_members", next); }
    })();
  }, [ready, name]);

  useEffect(() => {
    if (!ready) return;
    const i = setInterval(refresh, 25000);
    return () => clearInterval(i);
  }, [ready, refresh]);

  const saveProjects = (n) => { setProjects(n); setJSON("af2_projects", n); };
  const saveFindings = (n) => { setFindings(n); setJSON("af2_findings", n); };
  const saveRaids = (n) => { setRaids(n); setJSON("af2_raids", n); };
  const saveGuild = (g) => { setGuild(g); setJSON("af2_guild", g); };

  if (!ready) return (
    <div className="tav-root" style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: C.mut, fontFamily: F.body }}>
      <style>{STYLE}</style>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}><RefreshCw size={18} className="spin" /> Ouverture de la taverne…</div>
    </div>
  );
  if (!name) return <NameGate value={nameInput} setValue={setNameInput} onSet={(n) => { const v = n.trim(); if (!v) return; setName(v); sSet("af2_myname", v, false); }} />;

  const tabs = [
    { id: "projets", label: "Projets", icon: Hammer },
    { id: "trouvailles", label: "Trouvailles", icon: Sparkles },
    { id: "raids", label: "Raids", icon: Swords },
    { id: "guide", label: "Guide", icon: BookOpen },
  ];

  return (
    <div className="tav-root" style={{ minHeight: "100vh", color: C.ink, fontFamily: F.body }}>
      <style>{STYLE}</style>
      {!hasStore && (
        <div style={{ background: "rgba(214,106,82,.14)", color: C.red, padding: "8px 16px", fontFamily: F.mono, fontSize: 12, textAlign: "center", borderBottom: `1px solid ${C.line}` }}>
          Aperçu local — le partage entre potes s'active une fois l'appli partagée/hébergée.
        </div>
      )}
      <header style={{ borderBottom: `1px solid ${C.line}`, padding: "18px 20px", display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", minWidth: 0 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, display: "grid", placeItems: "center", border: `1px solid ${C.line}`, background: "radial-gradient(circle at 50% 40%, rgba(79,214,194,.18), transparent 70%)", flexShrink: 0 }}><Flame size={22} color={C.amber} /></div>
          <div style={{ minWidth: 0 }}>
            <input value={guild} onChange={(e) => saveGuild(e.target.value)} style={{ background: "transparent", border: "none", color: C.ink, fontFamily: F.disp, fontWeight: 700, fontSize: 20, letterSpacing: ".5px", width: "100%", outline: "none", padding: 0 }} />
            <div style={{ fontFamily: F.mono, fontSize: 11, color: C.faint, letterSpacing: "1.5px", textTransform: "uppercase" }}>Project · Arcane Frontier</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div title={members.join(", ")} style={{ fontFamily: F.mono, fontSize: 12, color: C.mut, border: `1px solid ${C.line}`, borderRadius: 999, padding: "6px 12px", display: "flex", gap: 6, alignItems: "center" }}><ShieldHalf size={13} /> {members.length}</div>
          <button className="tav-btn" onClick={refresh} style={btnGhost}><RefreshCw size={15} className={syncing ? "spin" : ""} /> {syncing ? "Sync…" : "Sync"}</button>
          <div style={{ fontFamily: F.mono, fontSize: 12, color: C.teal, border: `1px solid ${C.line}`, borderRadius: 999, padding: "6px 12px" }}>⚔ {name}</div>
        </div>
      </header>
      <nav style={{ borderBottom: `1px solid ${C.line}`, padding: "0 20px", display: "flex", gap: 6, maxWidth: 1000, margin: "0 auto", overflowX: "auto" }}>
        {tabs.map((t) => {
          const on = tab === t.id; const Ic = t.icon;
          return <button key={t.id} className="tav-tab" onClick={() => setTab(t.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "14px 14px 12px", display: "flex", gap: 7, alignItems: "center", color: on ? C.amber : C.mut, borderBottom: `2px solid ${on ? C.amber : "transparent"}`, fontFamily: F.disp, fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}><Ic size={15} /> {t.label}</button>;
        })}
      </nav>
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "22px 20px 64px" }}>
        {tab === "projets" && <Projects projects={projects} save={saveProjects} me={name} />}
        {tab === "trouvailles" && <Findings findings={findings} save={saveFindings} me={name} />}
        {tab === "raids" && <Raids raids={raids} save={saveRaids} me={name} />}
        {tab === "guide" && <Guide />}
      </main>
    </div>
  );
}

function NameGate({ value, setValue, onSet }) {
  return (
    <div className="tav-root" style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: C.ink, fontFamily: F.body, padding: 20 }}>
      <style>{STYLE}</style>
      <div style={{ maxWidth: 380, width: "100%", textAlign: "center" }}>
        <div style={{ display: "grid", placeItems: "center", marginBottom: 16 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, display: "grid", placeItems: "center", border: `1px solid ${C.line}`, background: "radial-gradient(circle at 50% 40%, rgba(79,214,194,.18), transparent 70%)" }}><Flame size={24} color={C.amber} /></div>
        </div>
        <h1 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "0 0 6px" }}>Entre dans la taverne</h1>
        <p style={{ color: C.mut, margin: "0 0 22px", fontSize: 15 }}>Choisis ton nom d'aventurier. Tes potes verront qui farme quoi.</p>
        <input autoFocus value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSet(value)} placeholder="Ton pseudo Minecraft" style={{ ...inputStyle, textAlign: "center", marginBottom: 12 }} />
        <button className="tav-btn" onClick={() => onSet(value)} style={{ ...btnSolid(C.amber), width: "100%", justifyContent: "center" }}>Franchir la porte</button>
      </div>
    </div>
  );
}

function SectionHead({ title, sub, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
      <div><h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 22, margin: 0 }}>{title}</h2>{sub && <p style={{ color: C.mut, margin: "4px 0 0", fontSize: 14 }}>{sub}</p>}</div>
      {action}
    </div>
  );
}
const Empty = ({ children }) => <div style={{ border: `1px dashed ${C.line}`, borderRadius: 12, padding: "34px 20px", textAlign: "center", color: C.mut, fontSize: 15 }}>{children}</div>;
const Pill = ({ active, col, onClick, children }) => (
  <button className="tav-btn gnav" onClick={onClick} style={{ border: `1px solid ${active ? col : C.line}`, background: active ? col : "transparent", color: active ? "#0c0e13" : C.mut, borderRadius: 999, padding: "6px 12px", cursor: "pointer", fontFamily: F.mono, fontSize: 12, whiteSpace: "nowrap" }}>{children}</button>
);

function Projects({ projects, save, me }) {
  const [adding, setAdding] = useState(false);
  const [n, setN] = useState(""); const [d, setD] = useState(""); const [m, setM] = useState(""); const [cat, setCat] = useState("ferme");
  const [filter, setFilter] = useState("all"); const [hideDone, setHideDone] = useState(false);

  const add = () => {
    if (!n.trim()) return;
    const mats = m.split("\n").map((s) => s.trim()).filter(Boolean).map(parseMat);
    save([{ id: uid(), name: n.trim(), desc: d.trim(), category: cat, created: Date.now(), mats }, ...projects]);
    setN(""); setD(""); setM(""); setCat("ferme"); setAdding(false);
  };
  const upd = (pid, fn) => save(projects.map((p) => (p.id === pid ? fn(p) : p)));
  const setGot = (pid, mid, val) => upd(pid, (p) => ({ ...p, mats: p.mats.map((x) => x.id === mid ? { ...x, got: Math.max(0, Math.min(x.needed, val)), by: me } : x) }));
  const del = (pid) => save(projects.filter((p) => p.id !== pid));

  const prog = (p) => { const need = p.mats.reduce((a, x) => a + x.needed, 0); const got = p.mats.reduce((a, x) => a + Math.min(x.got, x.needed), 0); return { need, got, pct: need ? Math.round((got / need) * 100) : 0 }; };
  const shown = projects.filter((p) => (filter === "all" || p.category === filter) && (!hideDone || prog(p).pct < 100));

  return (
    <div>
      <SectionHead title="Projets" sub="Suis les quantités farmées. Ton nom s'inscrit sur le dernier ajout."
        action={<button className="tav-btn" onClick={() => setAdding((v) => !v)} style={btnSolid(C.teal)}><Plus size={15} /> Projet</button>} />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18, alignItems: "center" }}>
        <Pill active={filter === "all"} col={C.ink} onClick={() => setFilter("all")}>Tous ({projects.length})</Pill>
        {CATS.map((c) => { const cnt = projects.filter((p) => p.category === c.k).length; if (!cnt) return null; return <Pill key={c.k} active={filter === c.k} col={c.col} onClick={() => setFilter(c.k)}>{c.label} ({cnt})</Pill>; })}
        <span style={{ flex: 1 }} />
        <Pill active={hideDone} col={C.green} onClick={() => setHideDone((v) => !v)}>Masquer terminés</Pill>
      </div>

      {adding && (
        <div className="tav-card" style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, marginBottom: 18, background: C.panel }}>
          <input value={n} onChange={(e) => setN(e.target.value)} placeholder="Nom du projet" style={{ ...inputStyle, marginBottom: 10 }} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>{CATS.map((c) => <Pill key={c.k} active={cat === c.k} col={c.col} onClick={() => setCat(c.k)}>{c.label}</Pill>)}</div>
          <input value={d} onChange={(e) => setD(e.target.value)} placeholder="Description (optionnel)" style={{ ...inputStyle, marginBottom: 10 }} />
          <textarea value={m} onChange={(e) => setM(e.target.value)} placeholder={"Un matériau par ligne. Mets la quantité devant :\n64 Fer\n32 Or\nBlaze Burner"} rows={4} style={{ ...inputStyle, resize: "vertical", marginBottom: 10 }} />
          <div style={{ display: "flex", gap: 8 }}><button className="tav-btn" onClick={add} style={btnSolid(C.amber)}>Créer</button><button className="tav-btn" onClick={() => setAdding(false)} style={btnGhost}>Annuler</button></div>
        </div>
      )}

      {shown.length === 0 ? <Empty>Aucun projet ici. Lance le premier chantier de la guilde.</Empty> :
        <div style={{ display: "grid", gap: 16 }}>
          {shown.map((p) => {
            const { pct } = prog(p); const ct = catOf(p.category);
            return (
              <div key={p.id} className="tav-card" style={{ border: `1px solid ${C.line}`, borderRadius: 12, background: C.panel, overflow: "hidden" }}>
                <div style={{ padding: "16px 16px 12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <h3 style={{ fontFamily: F.disp, fontWeight: 600, fontSize: 18, margin: 0 }}>{p.name}</h3>
                      <span style={{ fontFamily: F.mono, fontSize: 10, color: ct.col, border: `1px solid ${ct.col}`, borderRadius: 999, padding: "2px 8px", textTransform: "uppercase", letterSpacing: ".5px" }}>{ct.label}</span>
                    </div>
                    <button className="tav-btn" onClick={() => del(p.id)} style={{ ...btnGhost, padding: 6, border: "none", color: C.faint }} title="Supprimer"><Trash2 size={15} /></button>
                  </div>
                  {p.desc && <p style={{ color: C.mut, margin: "6px 0 0", fontSize: 14 }}>{p.desc}</p>}
                  <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1, height: 7, background: C.bg, borderRadius: 999, overflow: "hidden", border: `1px solid ${C.line}` }}><div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.teal}, ${C.amber})`, transition: "width .3s ease" }} /></div>
                    <span style={{ fontFamily: F.mono, fontSize: 12, color: pct === 100 ? C.green : C.amber }}>{pct}%</span>
                  </div>
                </div>
                <div style={{ borderTop: `1px solid ${C.line}` }}>
                  {p.mats.map((x) => {
                    const done = x.got >= x.needed;
                    return (
                      <div key={x.id} className="tav-row" style={{ borderBottom: `1px solid ${C.line}`, padding: "9px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${done ? C.green : C.faint}`, background: done ? C.green : "transparent", display: "grid", placeItems: "center", flexShrink: 0 }}>{done && <Check size={12} color="#0c0e13" strokeWidth={3} />}</span>
                        <span style={{ flex: 1, fontSize: 15, color: done ? C.mut : C.ink, textDecoration: done ? "line-through" : "none" }}>{x.label}{x.by && <span style={{ fontFamily: F.mono, fontSize: 10, color: C.teal, marginLeft: 8 }}>· {x.by}</span>}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <button className="tav-btn" onClick={() => setGot(p.id, x.id, x.got - 1)} style={ctrlBtn}><Minus size={13} /></button>
                          <span style={{ fontFamily: F.mono, fontSize: 13, color: done ? C.green : C.ink, minWidth: 54, textAlign: "center" }}>{x.got}/{x.needed}</span>
                          <button className="tav-btn" onClick={() => setGot(p.id, x.id, done ? 0 : x.needed)} style={{ ...ctrlBtn, color: done ? C.faint : C.green, marginLeft: 4 }} title={done ? "Réinitialiser" : "Tout cocher"}><Check size={14} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>}
    </div>
  );
}

function Findings({ findings, save, me }) {
  const [txt, setTxt] = useState(""); const [tag, setTag] = useState("info"); const [filter, setFilter] = useState("all");
  const post = () => { if (!txt.trim()) return; save([{ id: uid(), text: txt.trim(), author: me, ts: Date.now(), tag, pin: false }, ...findings]); setTxt(""); };
  const del = (id) => save(findings.filter((f) => f.id !== id));
  const togglePin = (id) => save(findings.map((f) => f.id === id ? { ...f, pin: !f.pin } : f));
  const shown = findings.filter((f) => filter === "all" || f.tag === filter).slice().sort((a, b) => (b.pin ? 1 : 0) - (a.pin ? 1 : 0) || b.ts - a.ts);
  return (
    <div>
      <SectionHead title="Trouvailles & avancées" sub="Un spot rare, un boss tombé, une avancée majeure — partage-le." />
      <div className="tav-card" style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: 14, marginBottom: 18, background: C.panel }}>
        <textarea value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="Quoi de neuf, aventurier ?" rows={2} style={{ ...inputStyle, resize: "vertical", marginBottom: 10 }} />
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {TAGS.map((t) => <Pill key={t.k} active={tag === t.k} col={t.col} onClick={() => setTag(t.k)}>{t.label}</Pill>)}
          <span style={{ flex: 1 }} />
          <button className="tav-btn" onClick={post} style={btnSolid(C.purple)}><Sparkles size={15} /> Publier</button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <Pill active={filter === "all"} col={C.ink} onClick={() => setFilter("all")}>Tout</Pill>
        {TAGS.map((t) => <Pill key={t.k} active={filter === t.k} col={t.col} onClick={() => setFilter(t.k)}>{t.label}</Pill>)}
      </div>
      {shown.length === 0 ? <Empty>Le tableau est vide. Sois le premier à graver une trouvaille.</Empty> :
        <div style={{ display: "grid", gap: 12 }}>
          {shown.map((f) => { const tg = tagOf(f.tag) || TAGS[4]; return (
            <div key={f.id} className="tav-card" style={{ border: `1px solid ${f.pin ? C.amber : C.line}`, borderLeft: `3px solid ${tg.col}`, borderRadius: 10, padding: "12px 14px", background: C.panel }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontFamily: F.mono, fontSize: 10, color: tg.col, border: `1px solid ${tg.col}`, borderRadius: 999, padding: "2px 7px", textTransform: "uppercase" }}>{tg.label}</span>
                  <span style={{ fontFamily: F.mono, fontSize: 12, color: C.purple }}>{f.author}</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontFamily: F.mono, fontSize: 11, color: C.faint }}>{fmt(f.ts)}</span>
                  <button className="tav-btn" onClick={() => togglePin(f.id)} style={{ background: "none", border: "none", cursor: "pointer", color: f.pin ? C.amber : C.faint, padding: 0 }} title="Épingler"><Pin size={14} /></button>
                  <button className="tav-btn" onClick={() => del(f.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.faint, padding: 0 }}><X size={14} /></button>
                </div>
              </div>
              <p style={{ margin: "8px 0 0", fontSize: 15, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{f.text}</p>
            </div>
          ); })}
        </div>}
    </div>
  );
}

const STATUSES = [{ k: "in", label: "Présent", col: C.green }, { k: "maybe", label: "Peut-être", col: C.amber }, { k: "out", label: "Absent", col: C.red }];
function Raids({ raids, save, me }) {
  const [adding, setAdding] = useState(false); const [t, setT] = useState(""); const [w, setW] = useState(""); const [d, setD] = useState("");
  const add = () => { if (!t.trim()) return; save([{ id: uid(), title: t.trim(), when: w.trim(), desc: d.trim(), rsvp: {} }, ...raids]); setT(""); setW(""); setD(""); setAdding(false); };
  const setStatus = (id, k) => save(raids.map((r) => r.id !== id ? r : { ...r, rsvp: { ...r.rsvp, [me]: r.rsvp[me] === k ? undefined : k } }));
  const del = (id) => save(raids.filter((r) => r.id !== id));
  return (
    <div>
      <SectionHead title="Raids & objectifs" sub="Propose une sortie, chacun dit s'il est de la partie."
        action={<button className="tav-btn" onClick={() => setAdding((v) => !v)} style={btnSolid(C.red)}><Plus size={15} /> Raid</button>} />
      {adding && (
        <div className="tav-card" style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, marginBottom: 18, background: C.panel }}>
          <input value={t} onChange={(e) => setT(e.target.value)} placeholder="Objectif (ex. Donjon Voidsent)" style={{ ...inputStyle, marginBottom: 10 }} />
          <input value={w} onChange={(e) => setW} placeholder="Quand ? (ex. Samedi 21h)" style={{ ...inputStyle, marginBottom: 10 }} />
          <textarea value={d} onChange={(e) => setD(e.target.value)} placeholder="Détails (stuff requis, point de RDV…)" rows={3} style={{ ...inputStyle, resize: "vertical", marginBottom: 10 }} />
          <div style={{ display: "flex", gap: 8 }}><button className="tav-btn" onClick={add} style={btnSolid(C.amber)}>Lancer l'appel</button><button className="tav-btn" onClick={() => setAdding(false)} style={btnGhost}>Annuler</button></div>
        </div>
      )}
      {raids.length === 0 ? <Empty>Aucun raid prévu. Sonne le cor et rassemble la guilde.</Empty> :
        <div style={{ display: "grid", gap: 16 }}>
          {raids.map((r) => { const my = r.rsvp[me]; return (
            <div key={r.id} className="tav-card" style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, background: C.panel }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                <div><h3 style={{ fontFamily: F.disp, fontWeight: 600, fontSize: 18, margin: 0 }}>{r.title}</h3>{r.when && <div style={{ fontFamily: F.mono, fontSize: 12, color: C.amber, marginTop: 4 }}>🕯 {r.when}</div>}</div>
                <button className="tav-btn" onClick={() => del(r.id)} style={{ ...btnGhost, padding: 6, border: "none", color: C.faint }}><Trash2 size={15} /></button>
              </div>
              {r.desc && <p style={{ color: C.mut, margin: "10px 0 0", fontSize: 14, whiteSpace: "pre-wrap" }}>{r.desc}</p>}
              <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>{STATUSES.map((s) => <button key={s.k} className="tav-btn" onClick={() => setStatus(r.id, s.k)} style={{ border: `1px solid ${my === s.k ? s.col : C.line}`, background: my === s.k ? s.col : "transparent", color: my === s.k ? "#0c0e13" : C.mut, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontFamily: F.disp, fontWeight: 600, fontSize: 13 }}>{s.label}</button>)}</div>
              <div style={{ marginTop: 12, display: "grid", gap: 4 }}>{STATUSES.map((s) => { const who = Object.entries(r.rsvp).filter(([, v]) => v === s.k).map(([k]) => k); if (!who.length) return null; return <div key={s.k} style={{ fontSize: 13, color: C.mut }}><span style={{ color: s.col, fontFamily: F.mono, fontSize: 12 }}>{s.label} ({who.length}) :</span> {who.join(", ")}</div>; })}</div>
            </div>
          ); })}
        </div>}
    </div>
  );
}

function Guide() {
  const [active, setActive] = useState(GUIDE[0].id);
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim()) return GUIDE;
    const s = q.toLowerCase();
    return GUIDE.filter((g) => (g.title + " " + g.blocks.map((b) => b.p || b.h || b.tip || (b.list ? b.list.join(" ") : "")).join(" ")).toLowerCase().includes(s));
  }, [q]);
  useEffect(() => { if (filtered.length && !filtered.find((g) => g.id === active)) setActive(filtered[0].id); }, [filtered, active]);
  const sec = GUIDE.find((g) => g.id === active);

  return (
    <div>
      <SectionHead title="Guide du modpack" sub="Navigue par section. L'essentiel pour ne pas mourir bêtement." />
      <div style={{ position: "relative", marginBottom: 18, maxWidth: 360 }}>
        <Search size={15} color={C.faint} style={{ position: "absolute", left: 12, top: 12 }} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher dans le guide…" style={{ ...inputStyle, paddingLeft: 34 }} />
      </div>
      <div className="guide-wrap">
        <div className="guide-nav">
          {filtered.map((g) => { const on = g.id === active; const Ic = g.icon; return (
            <button key={g.id} onClick={() => setActive(g.id)} style={{ display: "flex", gap: 9, alignItems: "center", textAlign: "left", background: on ? C.panel2 : "transparent", border: `1px solid ${on ? C.line : "transparent"}`, color: on ? C.amber : C.mut, borderRadius: 9, padding: "10px 12px", cursor: "pointer", fontFamily: F.disp, fontWeight: 600, fontSize: 13.5 }}><Ic size={15} /> {g.title}</button>
          ); })}
          {filtered.length === 0 && <div style={{ color: C.faint, fontSize: 13, padding: 10 }}>Rien trouvé.</div>}
        </div>
        <div className="guide-body">
          {sec && (
            <div className="tav-card" style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: "20px 22px", background: C.panel }}>
              <div style={{ display: "flex", gap: 11, alignItems: "center", marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${C.line}` }}>
                <sec.icon size={20} color={C.teal} />
                <h3 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 20, margin: 0 }}>{sec.title}</h3>
              </div>
              {sec.blocks.map((b, i) => {
                if (b.h) return <h4 key={i} style={{ fontFamily: F.disp, fontWeight: 600, fontSize: 15, color: C.amber, margin: "18px 0 8px" }}>{b.h}</h4>;
                if (b.p) return <p key={i} style={{ margin: "0 0 12px", fontSize: 15.5, lineHeight: 1.6, color: C.ink }}>{b.p}</p>;
                if (b.tip) return <div key={i} style={{ borderLeft: `3px solid ${C.amber}`, background: "rgba(230,173,76,.08)", borderRadius: "0 8px 8px 0", padding: "10px 14px", margin: "8px 0 4px", fontSize: 14.5, color: C.ink }}>💡 {b.tip}</div>;
                if (b.list) return <ul key={i} style={{ margin: "0 0 8px", paddingLeft: 0, listStyle: "none", display: "grid", gap: 8 }}>{b.list.map((it, j) => <li key={j} style={{ display: "flex", gap: 10, fontSize: 15, lineHeight: 1.5, color: C.ink }}><span style={{ color: C.teal, flexShrink: 0 }}>◆</span><span>{it}</span></li>)}</ul>;
                return null;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function fmt(ts) { try { return new Date(ts).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); } catch { return ""; } }
