const { useState, useEffect, useRef } = React;
const el = React.createElement;

// ---- Supabase ----
const SUPABASE_URL = "https://pytwcfyblzcxwglfdgwy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5dHdjZnlibHpjeHdnbGZkZ3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTU4MDAsImV4cCI6MjA5NTYzMTgwMH0.DyJnpsw7e20Wb_NJtZtwnObT7LkN2t6FrrxcCKE5w1g";
const db = (window.supabase && window.supabase.createClient) ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// ----- icônes SVG inline -----
const PATHS = {
  "piggy-bank":'<path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h0"/>',
  "coins":'<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>',
  "house":'<path d="M3 9.5 12 3l9 6.5"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
  "repeat":'<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  "zap":'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  "target":'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  "plus":'<path d="M5 12h14"/><path d="M12 5v14"/>',
  "x":'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  "trash-2":'<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  "chevron-left":'<path d="m15 18-6-6 6-6"/>',
  "chevron-right":'<path d="m9 18 6-6-6-6"/>',
  "rotate-ccw":'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  "arrow-right":'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  "download":'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  "upload":'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  "bar-chart":'<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>',
  "edit-2":'<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
  "check":'<polyline points="20 6 9 17 4 12"/>',
  "moon":'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  "sun":'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  "contrast":'<circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 0 0 20Z"/>',
  "clock":'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  "wallet":'<path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5"/><path d="M18 12a1 1 0 0 0 0 2h3v-2Z"/>',
  "log-out": '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
  "users": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  "calculator":'<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="8" x2="8" y1="14" y2="14"/><line x1="12" x2="12" y1="14" y2="14"/><line x1="16" x2="16" y1="14" y2="14"/><line x1="8" x2="8" y1="18" y2="18"/><line x1="12" x2="12" y1="18" y2="18"/><line x1="16" x2="16" y1="18" y2="18"/>',
  "percent":'<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  "car":'<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  "calendar":'<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
  "file-text":'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/>',
  "scale":'<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
  "settings": '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
};
function Icon({ name, size = 16, color = "currentColor", style }) {
  return el("span", { style: { display: "inline-flex", ...style },
    dangerouslySetInnerHTML: { __html:
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${PATHS[name]||""}</svg>` } });
}

// ----------------------------------------------------------------------------
const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const STORAGE_KEY = "budget-foyer-pwa-v1";
const fmt = (n) => new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR"}).format(n||0);
const monthKey = (y,m) => `${y}-${String(m+1).padStart(2,"0")}`;
const uid = () => Math.random().toString(36).slice(2,10);
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));

// ----- projection patrimoniale -----
const monthlyRate = (annual) => Math.pow(1+(annual||0)/100, 1/12) - 1;
// nombre de mois pour atteindre l'objectif (null si jamais)
function monthsToGoal(current,monthly,goal,rm){
  if(current>=goal) return 0;
  if(monthly<=0 && rm<=0) return null;
  var bal=current, m=0;
  while(bal<goal && m<1200){ bal=bal*(1+rm)+monthly; m++; }
  return bal>=goal ? m : null;
}
// série de soldes futurs sur n mois (mois 0 = aujourd'hui)
function projSeries(current,monthly,rm,n){
  var arr=[current], bal=current, i;
  for(i=1;i<=n;i++){ bal=bal*(1+rm)+monthly; arr.push(bal); }
  return arr;
}
const fmtMonthYear = (d) => MONTHS_FR[d.getMonth()]+" "+d.getFullYear();
const addMonths = (d,n) => new Date(d.getFullYear(), d.getMonth()+n, 1);

// ----- profils de risque (conseiller patrimonial) -----
const RISK = {
  prudent:   {label:"Prudent",   stock:25, ret:2.5, emo:6, color:"#1D8BCE", desc:"Sécurité avant tout, peu de fluctuations."},
  equilibre: {label:"Équilibré", stock:50, ret:4.5, emo:4, color:"#19A979", desc:"Équilibre entre sécurité et performance."},
  dynamique: {label:"Dynamique", stock:75, ret:7,   emo:3, color:"#E8743B", desc:"Recherche de performance, accepte le risque."},
};
const DEFAULT_PROFILE = {age:35, horizon:10, risk:"equilibre"};
function stockPct(risk,age){
  var base=(RISK[risk]||RISK.equilibre).stock;
  var adj=Math.max(0,(age||0)-40)*0.5;
  return clamp(Math.round(base-adj),10,85);
}
// allocation recommandée d'un patrimoine total
function recommendedAllocation(total,risk,age,monthlyExpenses){
  var r=RISK[risk]||RISK.equilibre;
  var emergency=Math.round((monthlyExpenses||0)*r.emo);
  var precaution=Math.min(total,emergency);
  var investable=Math.max(0,total-precaution);
  var sp=stockPct(risk,age);
  var dynamique=Math.round(investable*sp/100);
  var securise=Math.max(0,investable-dynamique);
  return {emergency:emergency,precaution:precaution,securise:securise,dynamique:dynamique,stockPct:sp};
}

const PRESET = {
  revenus: ["Salaire Juliette","Salaire Augustin","CAF"],
  fixed:   ["Loyer","Téléphone","Internet","Canal","Assurance","Sport"],
  variable:["Électricité","Essence","Nourriture","Voiture","Autoroute"],
  excep:   ["Disney","Autres","Parking"],
};
const SECTIONS = {
  revenus:  { title:"Revenus",                  icon:"coins",  accent:"#19A979", sign:"+" },
  fixed:    { title:"Dépenses fixes",           icon:"house",  accent:"#E8743B", sign:"−" },
  variable: { title:"Dépenses variables",       icon:"repeat", accent:"#F2B53C", sign:"−" },
  excep:    { title:"Dépenses exceptionnelles", icon:"zap",    accent:"#945ECF", sign:"−" },
};
const POT_PALETTE = ["#19A979","#1D8BCE","#E8743B","#945ECF","#13A4B4","#C8516C","#F2B53C","#6C8893"];
const POT_TYPES = {
  livret: {label:"Livret (A / LDDS / LEP)",  badge:"Livret", icon:"wallet",    hint:"Épargne liquide, défiscalisée",          plafond:22950,  color:"#1D8BCE"},
  pea:    {label:"PEA",                       badge:"PEA",    icon:"bar-chart", hint:"Actions, exonéré d'impôts après 5 ans",  plafond:150000, color:"#19A979"},
  av:     {label:"Assurance vie",             badge:"AV",     icon:"target",    hint:"Polyvalent, avantage fiscal après 8 ans", plafond:null,   color:"#945ECF"},
  immo:   {label:"Immobilier",                badge:"Immo",   icon:"house",     hint:"Résidence principale, locatif…",         plafond:null,   color:"#E8743B"},
  courant:{label:"Compte courant / liquidités",badge:"Courant",icon:"coins",    hint:"Cash disponible sur compte",             plafond:null,   color:"#F2B53C"},
  autre:  {label:"Autre / non catégorisé",    badge:"Autre",  icon:"piggy-bank",hint:"",                                      plafond:null,   color:"#6C8893"},
};
const THEME_KEY = "budget-foyer-theme";
const THEME_ORDER = ["auto","clair","sombre"];
const THEME_ATTR = {auto:"auto",clair:"light",sombre:"dark"};
const THEME_ICON = {auto:"contrast",clair:"sun",sombre:"moon"};
const SETTINGS_KEY = "budget-foyer-settings";
const PATRIMOINE_KEY = "budget-foyer-patrimoine";
const ECHEANCES_KEY = "budget-foyer-echeances";

function loadData(){ try{ const r=localStorage.getItem(STORAGE_KEY); return r?JSON.parse(r):null; }catch(e){return null;} }
function saveData(d){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }catch(e){console.error(e);} }
function loadTheme(){ try{ return localStorage.getItem(THEME_KEY)||"auto"; }catch(e){ return "auto"; } }
function loadSettings(){ try{ var r=localStorage.getItem(SETTINGS_KEY); return r?JSON.parse(r):{}; }catch(e){ return {}; } }
function saveSettings(s){ try{ localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); }catch(e){ console.error(e); } }

const blankMonth = () => ({
  revenus: PRESET.revenus.map(l=>({id:uid(),label:l,amount:0})),
  fixed:   PRESET.fixed.map(l=>({id:uid(),label:l,amount:0})),
  variable:PRESET.variable.map(l=>({id:uid(),label:l,amount:0})),
  excep:   PRESET.excep.map(l=>({id:uid(),label:l,amount:0})),
  deposits:[],
});

// ----------------------------------------------------------------------------
function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = function() {
    if (!email || !password) { setMsg("Email et mot de passe requis."); return; }
    setLoading(true); setMsg("");
    var p = mode === "login"
      ? db.auth.signInWithPassword({email: email, password: password})
      : db.auth.signUp({email: email, password: password});
    p.then(function(res) {
      setLoading(false);
      if (res.error) { setMsg(res.error.message); }
      else if (mode === "signup") { setMsg("Vérifie ton email pour confirmer, puis connecte-toi."); setMode("login"); }
    });
  };

  return el("div", {style:{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"24px 20px",background:"linear-gradient(180deg,var(--bg-top),var(--bg-bottom))"}},
    el("div", {style:{maxWidth:400,margin:"0 auto",width:"100%"}},
      el("div", {style:{display:"flex",justifyContent:"center",marginBottom:32}},
        el("div", {style:{width:72,height:72,borderRadius:22,background:"linear-gradient(135deg,#1D8BCE,#19A979)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 24px rgba(29,139,206,.4)"}},
          el(Icon,{name:"piggy-bank",size:36,color:"#fff"}))),
      el("h1",{style:{textAlign:"center",fontSize:26,fontWeight:800,letterSpacing:"-0.5px",margin:"0 0 6px",color:"var(--text)"}},"Budget du foyer"),
      el("p",{style:{textAlign:"center",fontSize:13.5,color:"var(--text-3)",margin:"0 0 32px"}},"Gérez votre budget à deux, en temps réel"),
      el("div",{style:{background:"var(--surface)",borderRadius:20,padding:22,boxShadow:"0 1px 4px rgba(0,0,0,.05)"}},
        el("div",{style:{display:"flex",background:"var(--surface-2)",borderRadius:12,padding:3,marginBottom:20}},
          ["login","signup"].map(function(m){
            var on=mode===m;
            return el("button",{key:m,onClick:function(){setMode(m);setMsg("");},
              style:{flex:1,padding:"9px 0",borderRadius:10,border:"none",background:on?"var(--surface)":"transparent",color:on?"var(--text)":"var(--text-3)",fontWeight:on?700:500,fontSize:14,cursor:"pointer",boxShadow:on?"0 1px 4px rgba(0,0,0,.08)":"none"}},
              m==="login"?"Connexion":"Créer un compte");
          })),
        el("div",{style:{marginBottom:14}},
          el("label",{style:{display:"block",fontSize:12.5,fontWeight:600,color:"var(--text-2)",marginBottom:6}},"Email"),
          el("input",{type:"email",inputMode:"email",value:email,style:{width:"100%",padding:"11px 13px",borderRadius:11,border:"1.5px solid var(--border-3)",fontSize:15,outline:"none",background:"var(--field-bg)",boxSizing:"border-box",color:"var(--text)"},placeholder:"exemple@gmail.com",
            onChange:function(e){setEmail(e.target.value);},onKeyDown:function(e){if(e.key==="Enter")submit();}})),
        el("div",{style:{marginBottom:20}},
          el("label",{style:{display:"block",fontSize:12.5,fontWeight:600,color:"var(--text-2)",marginBottom:6}},"Mot de passe"),
          el("input",{type:"password",value:password,style:{width:"100%",padding:"11px 13px",borderRadius:11,border:"1.5px solid var(--border-3)",fontSize:15,outline:"none",background:"var(--field-bg)",boxSizing:"border-box",color:"var(--text)"},placeholder:"••••••••",
            onChange:function(e){setPassword(e.target.value);},onKeyDown:function(e){if(e.key==="Enter")submit();}})),
        msg&&el("p",{style:{fontSize:13,color:msg.indexOf("Vérifie")>=0?"#19A979":"#C8516C",margin:"-8px 0 14px",textAlign:"center"}},msg),
        el("button",{style:{width:"100%",padding:14,borderRadius:13,border:"none",background:"linear-gradient(135deg,#1D8BCE,#19A979)",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 14px rgba(29,139,206,.35)",opacity:loading?0.6:1},onClick:submit},
          loading?"…":(mode==="login"?"Se connecter":"Créer mon compte")))));
}

function HouseholdScreen({onDone}) {
  const [mode, setMode] = useState("choice");
  const [name, setName] = useState("Mon foyer");
  const [code, setCode] = useState("");
  const [created, setCreated] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  var btnStyle = {width:"100%",padding:14,borderRadius:13,border:"none",background:"linear-gradient(135deg,#1D8BCE,#19A979)",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 14px rgba(29,139,206,.35)"};
  var backStyle = {width:"100%",padding:14,borderRadius:13,border:"none",background:"var(--surface-3)",color:"var(--text-2)",fontSize:15,fontWeight:700,cursor:"pointer"};
  var wrap = {minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"24px 20px",background:"linear-gradient(180deg,var(--bg-top),var(--bg-bottom))"};
  var card = {maxWidth:400,margin:"0 auto",width:"100%",background:"var(--surface)",borderRadius:20,padding:22,boxShadow:"0 1px 4px rgba(0,0,0,.05)"};
  var lbl = {display:"block",fontSize:12.5,fontWeight:600,color:"var(--text-2)",marginBottom:6};
  var inp = {width:"100%",padding:"11px 13px",borderRadius:11,border:"1.5px solid var(--border-3)",fontSize:15,outline:"none",background:"var(--field-bg)",boxSizing:"border-box",color:"var(--text)"};

  const create = function() {
    setLoading(true); setMsg("");
    db.rpc("create_household",{household_name:name}).then(function(res){
      setLoading(false);
      if(res.error){setMsg(res.error.message);}
      else{setCreated({householdId:res.data.id,inviteCode:res.data.invite_code});}
    });
  };
  const join = function() {
    setLoading(true); setMsg("");
    db.rpc("join_household_by_code",{code:code.trim().toUpperCase()}).then(function(res){
      setLoading(false);
      if(res.error){setMsg("Code invalide. Vérifie et réessaie.");}
      else{onDone(res.data.id);}
    });
  };

  if(created) return el("div",{style:wrap},
    el("div",{style:card},
      el("div",{style:{textAlign:"center",marginBottom:20}},
        el("div",{style:{fontSize:44,marginBottom:8}},"🎉"),
        el("h2",{style:{margin:0,fontSize:20,fontWeight:800}},"Foyer créé !"),
        el("p",{style:{fontSize:13.5,color:"var(--text-2)",margin:"8px 0 0"}},"Partage ce code avec ta conjointe")),
      el("div",{style:{background:"linear-gradient(135deg,#1D8BCE14,#19A97914)",borderRadius:16,padding:"20px 24px",textAlign:"center",marginBottom:20}},
        el("div",{style:{fontSize:11,fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:8}},"Code d'invitation"),
        el("div",{style:{fontSize:36,fontWeight:900,letterSpacing:"6px",color:"#1D8BCE",fontFamily:"monospace"}},created.inviteCode),
        el("div",{style:{fontSize:12,color:"var(--text-3)",marginTop:8}},"Valide indéfiniment · partage-le à ta conjointe")),
      el("button",{style:btnStyle,onClick:function(){onDone(created.householdId);}},
        "Commencer »")));

  if(mode==="choice") return el("div",{style:wrap},
    el("div",{style:{maxWidth:400,margin:"0 auto",width:"100%"}},
      el("div",{style:{textAlign:"center",marginBottom:32}},
        el("div",{style:{fontSize:44,marginBottom:12}},"🏠"),
        el("h2",{style:{margin:0,fontSize:22,fontWeight:800,color:"var(--text)"}},"Ton foyer"),
        el("p",{style:{fontSize:13.5,color:"var(--text-3)",margin:"8px 0 0"}},"Crée un foyer ou rejoins celui de ton partenaire")),
      el("div",{style:{display:"flex",flexDirection:"column",gap:12}},
        el("button",{style:{background:"var(--surface)",borderRadius:18,padding:20,cursor:"pointer",border:"1.5px solid #1D8BCE30",textAlign:"left",boxShadow:"0 1px 4px rgba(0,0,0,.05)"},onClick:function(){setMode("create");}},
          el("div",{style:{fontSize:18,marginBottom:4}},"✨ Créer un foyer"),
          el("div",{style:{fontSize:13,color:"var(--text-3)"}},"Tu génères un code d'invitation pour ton partenaire")),
        el("button",{style:{background:"var(--surface)",borderRadius:18,padding:20,cursor:"pointer",border:"1.5px solid #19A97930",textAlign:"left",boxShadow:"0 1px 4px rgba(0,0,0,.05)"},onClick:function(){setMode("join");}},
          el("div",{style:{fontSize:18,marginBottom:4}},"🔗 Rejoindre un foyer"),
          el("div",{style:{fontSize:13,color:"var(--text-3)"}},"Entre le code partagé par ton partenaire")))));

  if(mode==="create") return el("div",{style:wrap},
    el("div",{style:card},
      el("h2",{style:{margin:"0 0 20px",fontSize:20,fontWeight:800}},"Créer un foyer"),
      el("div",{style:{marginBottom:20}},
        el("label",{style:lbl},"Nom du foyer"),
        el("input",{value:name,style:inp,placeholder:"ex : Foyer Dupont",autoFocus:true,
          onChange:function(e){setName(e.target.value);},onKeyDown:function(e){if(e.key==="Enter")create();}})),
      msg&&el("p",{style:{fontSize:13,color:"#C8516C",margin:"-8px 0 14px"}},msg),
      el("div",{style:{display:"flex",gap:10}},
        el("button",{style:{...backStyle,flex:1},onClick:function(){setMode("choice");}},"Retour"),
        el("button",{style:{...btnStyle,flex:1,opacity:loading?0.6:1},onClick:create},loading?"…":"Créer"))));

  return el("div",{style:wrap},
    el("div",{style:card},
      el("h2",{style:{margin:"0 0 20px",fontSize:20,fontWeight:800}},"Rejoindre un foyer"),
      el("div",{style:{marginBottom:20}},
        el("label",{style:lbl},"Code d'invitation (6 lettres)"),
        el("input",{value:code,style:{...inp,textTransform:"uppercase",letterSpacing:"4px",fontSize:22,fontWeight:700,textAlign:"center",fontFamily:"monospace"},placeholder:"XXXXXX",maxLength:6,autoFocus:true,
          onChange:function(e){setCode(e.target.value.toUpperCase());},onKeyDown:function(e){if(e.key==="Enter")join();}})),
      msg&&el("p",{style:{fontSize:13,color:"#C8516C",margin:"-8px 0 14px"}},msg),
      el("div",{style:{display:"flex",gap:10}},
        el("button",{style:{...backStyle,flex:1},onClick:function(){setMode("choice");}},"Retour"),
        el("button",{style:{...btnStyle,background:"linear-gradient(135deg,#19A979,#13A4B4)",flex:1,opacity:(loading||code.length<6)?0.6:1},onClick:join},loading?"…":"Rejoindre"))));
}

// ----------------------------------------------------------------------------
function App(){
  const now = new Date();
  const [year,setYear]   = useState(now.getFullYear());
  const [month,setMonth] = useState(now.getMonth());
  const [months,setMonths] = useState({});
  const [pots,setPots]         = useState([]);
  const [projects,setProjects] = useState([]);
  const [loaded,setLoaded]     = useState(false);
  const [modal,setModal]       = useState(null);
  const [tab,setTab]           = useState("budget");
  const [theme,setTheme]       = useState(loadTheme());
  const [showPrevus,setShowPrevus] = useState(function(){ var s=loadSettings(); return s.showPrevus===true; });
  const [annualReturn,setAnnualReturn] = useState(3);
  const [advisorMode,setAdvisorMode]   = useState(true);
  const [profile,setProfile]           = useState(DEFAULT_PROFILE);
  const [user, setUser] = useState(null);
  const [householdId, setHouseholdId] = useState(null);
  const [authReady, setAuthReady] = useState(!db);
  const [householdCode, setHouseholdCode] = useState("");
  const syncTimer = useRef(null);
  const lastSyncRef = useRef(0);
  const syncingRef = useRef(false);

  useEffect(()=>{ const d=loadData(); if(d){ setMonths(d.months||{}); setPots(d.pots||[]); setProjects(d.projects||[]); if(d.settings){ if(typeof d.settings.annualReturn==="number") setAnnualReturn(d.settings.annualReturn); if(typeof d.settings.advisorMode==="boolean") setAdvisorMode(d.settings.advisorMode); if(d.settings.profile) setProfile(Object.assign({},DEFAULT_PROFILE,d.settings.profile)); } } setLoaded(true); },[]);
  useEffect(function(){
    if(!loaded) return;
    var payload={months:months,pots:pots,projects:projects,settings:{annualReturn:annualReturn,advisorMode:advisorMode,profile:profile}};
    saveData(payload);
    if(!householdId||!db||syncingRef.current) return;
    if(syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current=setTimeout(function(){
      lastSyncRef.current=Date.now();
      db.from("budget_data").upsert({household_id:householdId,data:payload,updated_at:new Date().toISOString()}).then(function(){});
    },1500);
  },[months,pots,projects,annualReturn,advisorMode,profile,loaded]);
  useEffect(()=>{ document.documentElement.setAttribute("data-theme",THEME_ATTR[theme]||"auto"); try{ localStorage.setItem(THEME_KEY,theme); }catch(e){} },[theme]);
  useEffect(function(){ saveSettings({showPrevus:showPrevus}); },[showPrevus]);
  useEffect(function(){
    if(!db) return;
    db.auth.getSession().then(function(res){
      var sess=res.data&&res.data.session;
      if(sess&&sess.user){
        setUser(sess.user);
        db.from("user_households").select("household_id, households(invite_code)")
          .eq("user_id",sess.user.id).single().then(function(hr){
            if(hr.data){setHouseholdId(hr.data.household_id);setHouseholdCode((hr.data.households&&hr.data.households.invite_code)||"");}
            setAuthReady(true);
          });
      } else { setAuthReady(true); }
    });
    var sub=db.auth.onAuthStateChange(function(event,sess){
      if(event==="SIGNED_OUT"){setUser(null);setHouseholdId(null);setHouseholdCode("");setLoaded(false);}
      if((event==="SIGNED_IN"||event==="TOKEN_REFRESHED")&&sess&&sess.user){
        setUser(sess.user);
        db.from("user_households").select("household_id, households(invite_code)")
          .eq("user_id",sess.user.id).single().then(function(hr){
            if(hr.data){setHouseholdId(hr.data.household_id);setHouseholdCode((hr.data.households&&hr.data.households.invite_code)||"");}
            setAuthReady(true);
          });
      }
    });
    return function(){if(sub.data&&sub.data.subscription)sub.data.subscription.unsubscribe();};
  },[]);
  useEffect(function(){
    if(!householdId||!db) return;
    syncingRef.current=true;
    db.from("budget_data").select("data").eq("household_id",householdId).single().then(function(res){
      if(res.data&&res.data.data){
        var d=res.data.data;
        if(d.months)setMonths(d.months);
        if(d.pots)setPots(d.pots);
        if(d.projects)setProjects(d.projects);
        if(d.settings){
          if(typeof d.settings.annualReturn==="number")setAnnualReturn(d.settings.annualReturn);
          if(typeof d.settings.advisorMode==="boolean")setAdvisorMode(d.settings.advisorMode);
          if(d.settings.profile)setProfile(Object.assign({},DEFAULT_PROFILE,d.settings.profile));
        }
      }
      syncingRef.current=false;
      setLoaded(true);
    });
  },[householdId]);
  useEffect(function(){
    if(!householdId||!db) return;
    var ch=db.channel("budget:"+householdId)
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"budget_data",filter:"household_id=eq."+householdId},function(payload){
        if(Date.now()-lastSyncRef.current<3000) return;
        var d=payload.new&&payload.new.data;
        if(!d) return;
        syncingRef.current=true;
        if(d.months)setMonths(d.months);
        if(d.pots)setPots(d.pots);
        if(d.projects)setProjects(d.projects);
        if(d.settings){
          if(typeof d.settings.annualReturn==="number")setAnnualReturn(d.settings.annualReturn);
          if(typeof d.settings.advisorMode==="boolean")setAdvisorMode(d.settings.advisorMode);
          if(d.settings.profile)setProfile(Object.assign({},DEFAULT_PROFILE,d.settings.profile));
        }
        setTimeout(function(){syncingRef.current=false;},500);
      })
      .subscribe();
    return function(){db.removeChannel(ch);};
  },[householdId]);
  const cycleTheme=function(){ setTheme(function(t){ var i=THEME_ORDER.indexOf(t); return THEME_ORDER[(i+1)%THEME_ORDER.length]; }); };

  const mk = monthKey(year,month);
  const data = months[mk] || blankMonth();
  const setMonthData=(fn)=>setMonths(prev=>{const cur=prev[mk]||blankMonth();return{...prev,[mk]:fn(cur)};});
  const sum=(arr)=>arr.reduce((s,x)=>s+(x.amount||0),0);

  const totalRevenus=sum(data.revenus), totalFixed=sum(data.fixed), totalVariable=sum(data.variable), totalExcep=sum(data.excep);
  const totalDep=totalFixed+totalVariable+totalExcep;
  const totalSaved=sum(data.deposits||[]);
  const reste=totalRevenus-totalDep;
  const nonAffecte=reste-totalSaved;
  const potDeposits=(id)=>Object.values(months).reduce((s,m)=>s+(m.deposits||[]).filter(d=>d.potId===id).reduce((a,d)=>a+d.amount,0),0);
  const potBalance=(id)=>{var p=pots.find(function(x){return x.id===id;});return (p&&p.startBalance||0)+potDeposits(id);};
  const avgMonthlySavings=()=>{var keys=Object.keys(months).sort();if(keys.length===0)return 0;var total=keys.reduce(function(s,k){return s+(months[k].deposits||[]).reduce(function(a,d){return a+d.amount;},0);},0);return total/keys.length;};
  const avgMonthlyExpenses=()=>{var keys=Object.keys(months);if(keys.length===0)return 0;var total=keys.reduce(function(s,k){var m=months[k];return s+sum(m.fixed||[])+sum(m.variable||[])+sum(m.excep||[]);},0);return total/keys.length;};
  const projectBalance=(proj)=>(proj.initialAmount||0)+(proj.linkedPotIds||[]).reduce(function(s,id){return s+potBalance(id);},0);

  const changeMonth=(d)=>{let m=month+d,y=year;if(m<0){m=11;y--;}else if(m>11){m=0;y++;}setMonth(m);setYear(y);};
  const setAmount=(k,id,a)=>setMonthData(c=>({...c,[k]:c[k].map(x=>x.id===id?{...x,amount:a}:x)}));
  const setReelAmount=(id,a)=>setMonthData(function(c){var r=Object.assign({},c.reel||{});r[id]=a;return Object.assign({},c,{reel:r});});
  const addLine=(k,l)=>setMonthData(c=>({...c,[k]:[...c[k],{id:uid(),label:l,amount:0}]}));
  const delLine=(k,id)=>setMonthData(c=>({...c,[k]:c[k].filter(x=>x.id!==id)}));
  const renameLine=(k,id,l)=>setMonthData(c=>({...c,[k]:c[k].map(x=>x.id===id?{...x,label:l}:x)}));
  const addPot=(p)=>setPots(prev=>[...prev,{...p,id:uid()}]);
  const delPot=(id)=>{setPots(prev=>prev.filter(p=>p.id!==id));setMonths(prev=>{const o={};Object.entries(prev).forEach(([k,v])=>o[k]={...v,deposits:(v.deposits||[]).filter(d=>d.potId!==id)});return o;});};
  const editPot=(id,upd)=>setPots(prev=>prev.map(p=>p.id===id?Object.assign({},p,upd):p));
  const addProject=(proj)=>setProjects(prev=>[...prev,Object.assign({},proj,{id:uid()})]);
  const delProject=(id)=>setProjects(prev=>prev.filter(p=>p.id!==id));
  const editProject=(id,upd)=>setProjects(prev=>prev.map(p=>p.id===id?Object.assign({},p,upd):p));
  const addDeposit=(id,a)=>setMonthData(c=>({...c,deposits:[...(c.deposits||[]),{id:uid(),potId:id,amount:a}]}));
  const addWithdrawal=(id,a,note)=>setMonthData(c=>({...c,deposits:[...(c.deposits||[]),{id:uid(),potId:id,amount:-Math.abs(a),note:note||""}]}));
  const addDeposits=(entries)=>setMonthData(function(c){var add=entries.filter(function(e){return e.amount>0;}).map(function(e){return {id:uid(),potId:e.potId,amount:e.amount};});return Object.assign({},c,{deposits:[...(c.deposits||[]),...add]});});
  const delDeposit=(id)=>setMonthData(c=>({...c,deposits:c.deposits.filter(d=>d.id!==id)}));
  const potHistory=function(id){var out=[];Object.keys(months).sort().forEach(function(k){var t=(months[k].deposits||[]).filter(function(d){return d.potId===id;}).reduce(function(a,d){return a+d.amount;},0);if(t!==0)out.push({key:k,total:t});});return out;};
  const copyPrev=()=>{const d=new Date(year,month-1,1);const pk=monthKey(d.getFullYear(),d.getMonth());const prev=months[pk];if(!prev)return;
    setMonthData(()=>({revenus:prev.revenus.map(x=>({...x,id:uid()})),fixed:prev.fixed.map(x=>({...x,id:uid()})),variable:prev.variable.map(x=>({...x,id:uid()})),excep:prev.excep.map(x=>({...x,id:uid(),amount:0})),deposits:[]}));};
  const resetMonth=()=>setMonthData(()=>blankMonth());

  const exportJSON=()=>{const blob=new Blob([JSON.stringify({months,pots,projects,settings:{annualReturn,advisorMode,profile}},null,2)],{type:"application/json"});const u=URL.createObjectURL(blob);const a=document.createElement("a");a.href=u;a.download=`budget-${mk}.json`;a.click();URL.revokeObjectURL(u);};
  const importJSON=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(d.months)setMonths(d.months);if(d.pots)setPots(d.pots);if(d.projects)setProjects(d.projects);if(d.settings){if(typeof d.settings.annualReturn==="number")setAnnualReturn(d.settings.annualReturn);if(typeof d.settings.advisorMode==="boolean")setAdvisorMode(d.settings.advisorMode);if(d.settings.profile)setProfile(Object.assign({},DEFAULT_PROFILE,d.settings.profile));}}catch(err){alert("Fichier invalide");}};r.readAsText(f);};

  if(!authReady) return el("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(180deg,var(--bg-top),var(--bg-bottom))",color:"var(--text-3)",fontSize:14}},"Chargement…");
  if(authReady&&!user&&db) return el(LoginScreen,null);
  if(authReady&&user&&!householdId&&db) return el(HouseholdScreen,{onDone:function(id){setHouseholdId(id);}});
  if(!loaded) return el("div",{style:{...S.app,alignItems:"center",justifyContent:"center",color:"var(--text-3)"}},"Synchronisation…");
  const restColor = nonAffecte>0?"#19A979":nonAffecte<0?"#C8516C":"#6C8893";

  return el("div",{style:S.app},
    // header
    el("header",{style:S.header},
      el("div",{style:{display:"flex",alignItems:"center",gap:12}},
        el("div",{style:S.logo},el(Icon,{name:"piggy-bank",size:22,color:"#fff"})),
        el("div",null,
          el("h1",{style:S.title},"Budget du foyer"),
          el("p",{style:S.subtitle},"Revenus − dépenses → épargne")))),

    // month nav
    el("div",{style:S.monthNav},
      el("button",{style:S.navBtn,onClick:()=>changeMonth(-1)},el(Icon,{name:"chevron-left",size:20})),
      el("span",{style:S.monthLabel},`${MONTHS_FR[month]} ${year}`),
      el("button",{style:S.navBtn,onClick:()=>changeMonth(1)},el(Icon,{name:"chevron-right",size:20}))),

    // ---- panneau d'onglet (clé = tab pour rejouer l'animation) ----
    el("div",{key:tab,className:"tab-panel",style:{display:"flex",flexDirection:"column",gap:14}},

    // ---- TAB BUDGET ----
    tab==="budget" && el(React.Fragment,null,
      el("div",{style:S.flowCard},
        flowRow("coins","#19A979","Revenus","+ "+fmt(totalRevenus),"#19A979"),
        flowRow("house","#E8743B","Dépenses fixes","− "+fmt(totalFixed),"#E8743B"),
        flowRow("repeat","#F2B53C","Dépenses variables","− "+fmt(totalVariable),"#F2B53C"),
        flowRow("zap","#945ECF","Dépenses except.","− "+fmt(totalExcep),"#945ECF"),
        totalSaved>0 && flowRow("piggy-bank","#1D8BCE","Épargné ce mois","− "+fmt(totalSaved),"#1D8BCE"),
        el("div",{style:S.flowDivider}),
        el("div",{style:{...S.resteBox,background:`linear-gradient(135deg,${restColor},${restColor}cc)`}},
          el("div",{style:S.resteLabel},el(Icon,{name:"piggy-bank",size:16,color:"#fff"})," ",nonAffecte>=0?"Non affecté":"Découvert prévu"),
          el("div",{style:S.resteVal},fmt(nonAffecte)),
          el("div",{style:S.resteFoot},`Disponible avant épargne : ${fmt(reste)}`),
          (nonAffecte>0 && pots.length>0) && el("button",{style:S.allocateBtn,onClick:()=>setModal({kind:"allocate"})},
            el(Icon,{name:"arrow-right",size:15,color:"#fff"})," Répartir dans mes cagnottes"))),

      el("div",{style:S.actionRow},
        el("button",{style:S.copyBtn,onClick:copyPrev},el(Icon,{name:"rotate-ccw",size:14})," Recopier le mois précédent"),
        el("button",{style:S.resetBtn,onClick:resetMonth},"Réinitialiser")),

      Object.entries(SECTIONS).map(([kind,cfg])=>el(FastBlock,{key:kind,kind,cfg,items:data[kind],
        reel:data.reel||{},showPrevus:showPrevus&&kind!=="revenus",
        onAmount:(id,v)=>setAmount(kind,id,v),onReel:(id,v)=>setReelAmount(id,v),onDel:id=>delLine(kind,id),onRename:(id,l)=>renameLine(kind,id,l),onAdd:l=>addLine(kind,l)}))),

    // ---- TAB ÉPARGNE (cagnottes) ----
    tab==="epargne" && el(React.Fragment,null,
      // Résumé épargne
      el(PatrimoineCard,{pots:pots,potBalance:potBalance,avgMonthly:avgMonthlySavings(),thisMonthSaved:totalSaved}),
      // Cagnottes
      el("div",{style:S.section},
        el("div",{style:S.sectionHead},
          el("span",{style:S.sectionTitle},el("span",{style:{color:"#1D8BCE",display:"flex"}},el(Icon,{name:"piggy-bank",size:16,color:"#1D8BCE"}))," Cagnottes"),
          el("button",{style:{...S.smallBtn,color:"#1D8BCE",background:"#1D8BCE14"},onClick:()=>setModal({kind:"newpot"})},el(Icon,{name:"plus",size:14,color:"#1D8BCE"})," Cagnotte")),
        pots.length===0 && el("p",{style:S.blockHint},"Crée une cagnotte. Tu peux indiquer un solde de départ si tu as déjà de l'épargne."),
        el("div",{style:S.potList}, pots.map(function(p){
          var bal=potBalance(p.id);
          var thisMonth=(data.deposits||[]).filter(function(d){return d.potId===p.id;}).reduce(function(a,d){return a+d.amount;},0);
          var pct=p.goal>0?Math.min(100,(bal/p.goal)*100):null;
          var pt=p.type&&POT_TYPES[p.type]?POT_TYPES[p.type]:null;
          return el("div",{key:p.id,style:S.potCard},
            el("div",{style:S.potTop},
              el("span",{style:{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}},
                el(Icon,{name:pt?pt.icon:"piggy-bank",size:16,color:p.color}),
                el("strong",{style:{fontSize:14}},p.label),
                pt&&el("span",{style:{fontSize:10,fontWeight:700,background:p.color+"22",color:p.color,borderRadius:6,padding:"2px 7px"}},pt.badge)),
              el("div",{style:{display:"flex",gap:4}},
                el("button",{style:S.delBtn,title:"Historique",onClick:function(){setModal({kind:"history",pot:p});}},el(Icon,{name:"clock",size:13})),
                el("button",{style:S.delBtn,title:"Modifier",onClick:function(){setModal({kind:"editpot",pot:p});}},el(Icon,{name:"edit-2",size:13})),
                el("button",{style:{...S.delBtn,color:"#C8516C"},title:"Supprimer",onClick:function(){setModal({kind:"confirmdel",potId:p.id,potLabel:p.label});}},el(Icon,{name:"trash-2",size:13})))),
            el("div",{style:S.potBalRow},el("span",{style:{fontSize:21,fontWeight:800,color:p.color,letterSpacing:"-0.5px"}},fmt(bal)),p.goal>0&&el("span",{style:S.potGoalTxt},"/ "+fmt(p.goal))),
            p.startBalance>0 && el("div",{style:{fontSize:11,color:"var(--text-4)",marginTop:2}},"dont "+fmt(p.startBalance)+" de départ"),
            (pt&&pt.plafond&&bal>=pt.plafond*0.9) && el("div",{style:{fontSize:11,color:"#E8743B",fontWeight:600,marginTop:4,display:"flex",alignItems:"center",gap:4}},el(Icon,{name:"zap",size:11,color:"#E8743B"}),"Plafond "+pt.badge+" bientôt atteint ("+fmt(pt.plafond)+")"),
            pct!==null && el(React.Fragment,null,
              el("div",{style:S.potBarTrack},el("div",{style:{...S.potBarFill,width:pct+"%",background:p.color}})),
              el("div",{style:S.potFoot},el("span",{style:{color:p.color,fontWeight:600}},pct.toFixed(0)+"%"),el("span",{style:{color:"var(--text-3)"}},bal>=p.goal?"Atteint 🎉":"reste "+fmt(p.goal-bal)))),
            thisMonth!==0 && el("div",{style:{...S.potMonthTag,color:thisMonth>0?"#19A979":"#C8516C"}},thisMonth>0?"+ "+fmt(thisMonth)+" ce mois":"− "+fmt(-thisMonth)+" retiré ce mois"),
            el(PotSparkline,{months:months,potId:p.id,year:year,month:month,color:p.color}),
            (function(){
              var potKeys=Object.keys(months).sort();
              var potTotalDep=potKeys.reduce(function(s,k){return s+(months[k].deposits||[]).filter(function(d){return d.potId===p.id;}).reduce(function(a,d){return a+d.amount;},0);},0);
              var potAvg=potKeys.length>0?Math.round(potTotalDep/potKeys.length):0;
              var mToGoal=(p.goal>0&&bal<p.goal&&potAvg>0)?monthsToGoal(bal,potAvg,p.goal,0):null;
              if(potAvg===0&&!mToGoal) return null;
              return el("div",{style:{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}},
                potAvg>0&&el("div",{style:{fontSize:11,color:"var(--text-3)",background:"var(--surface-3)",borderRadius:8,padding:"4px 9px"}},el("span",{style:{color:"var(--text-2)",fontWeight:600}},fmt(potAvg)),"/mois en moy."),
                mToGoal!=null&&el("div",{style:{fontSize:11,color:"var(--text-3)",background:p.color+"14",borderRadius:8,padding:"4px 9px"}},el("span",{style:{color:p.color,fontWeight:700}},mToGoal>0?"~"+mToGoal+" mois":"Atteint"),mToGoal>0?" pour finir":""));
            })(),
            el("div",{style:{display:"flex",gap:8,marginTop:10}},
              el("button",{style:{...S.depositBtn,marginTop:0,flex:1,color:p.color,borderColor:p.color+"40"},onClick:function(){setModal({kind:"deposit",potId:p.id,potLabel:p.label,color:p.color});}},el(Icon,{name:"plus",size:14,color:p.color})," Verser"),
              el("button",{style:{...S.depositBtn,marginTop:0,flex:1,color:"#C8516C",borderColor:"#C8516C40"},onClick:function(){setModal({kind:"withdraw",potId:p.id,potLabel:p.label,color:p.color,balance:bal});}},el(Icon,{name:"arrow-right",size:14,color:"#C8516C",style:{transform:"rotate(90deg)"}})," Retirer")));
        })),
        (data.deposits||[]).length>0 && el("div",{style:{marginTop:14}},
          el("div",{style:S.depHead},"Mouvements de "+MONTHS_FR[month]),
          data.deposits.map(function(d){
            var p=pots.find(function(x){return x.id===d.potId;});
            var isW=d.amount<0;
            var amtColor=isW?"#C8516C":((p&&p.color)||"var(--text-3)");
            return el("div",{key:d.id,style:{...S.itemRow,flexDirection:"column",alignItems:"stretch",gap:4}},
              el("div",{style:{display:"flex",alignItems:"center",gap:11}},
                el("span",{style:{...S.itemDot,background:(p&&p.color)||"var(--border-3)"}}),
                el("span",{style:S.lineLabel},(p&&p.label)||"Supprimée"),
                el("span",{style:{...S.itemAmount,color:amtColor}},isW?"− "+fmt(-d.amount):"+ "+fmt(d.amount)),
                el("button",{style:S.delBtn,onClick:function(){delDeposit(d.id);}},el(Icon,{name:"trash-2",size:13}))),
              d.note&&el("div",{style:{fontSize:11,color:"var(--text-3)",paddingLeft:20,fontStyle:"italic"}},d.note));
          })))),

    // ---- TAB PROJETS ----
    tab==="projets" && el(React.Fragment,null,
      el(ProjectionControls,{advisorMode:advisorMode,setAdvisorMode:setAdvisorMode,annualReturn:annualReturn,setAnnualReturn:setAnnualReturn}),
      advisorMode && el(ConseilCard,{profile:profile,pots:pots,potBalance:potBalance,total:pots.reduce(function(s,p){return s+potBalance(p.id);},0),monthlyExpenses:avgMonthlyExpenses(),annualReturn:annualReturn,setAnnualReturn:setAnnualReturn,onEditProfile:function(){setModal({kind:"profile"});}}),
      el("div",{style:S.section},
        el("div",{style:S.sectionHead},
          el("span",{style:S.sectionTitle},el("span",{style:{color:"#945ECF",display:"flex"}},el(Icon,{name:"target",size:16,color:"#945ECF"}))," Projets"),
          el("button",{style:{...S.smallBtn,color:"#945ECF",background:"#945ECF14"},onClick:()=>setModal({kind:"newproject"})},el(Icon,{name:"plus",size:14,color:"#945ECF"})," Projet")),
        projects.length===0 && el("p",{style:S.blockHint},"Crée un projet (ex : Apport maison) avec un objectif et des cagnottes rattachées."),
        el("div",{style:{display:"flex",flexDirection:"column",gap:14}}, projects.map(function(proj){
          return el(ProjectCard,{key:proj.id,proj:proj,balance:projectBalance(proj),pots:pots,
            avgMonthly:avgMonthlySavings(),annualReturn:annualReturn,advisorMode:advisorMode,
            onEdit:function(){setModal({kind:"editproject",proj:proj});},
            onDelete:function(){setModal({kind:"confirmdelproj",projId:proj.id,projLabel:proj.label});},
            onContribution:function(v){editProject(proj.id,{monthlyContribution:v});}});
        })))),

    // ---- TAB GRAPHIQUES ----
    tab==="graphiques" && el(React.Fragment,null,
      el(AnnualReview,{months:months,year:year}),
      el(Charts,{months,pots,year,month,mk})),

    // ---- TAB OUTILS ----
    tab==="outils" && el(OutilsScreen,null),

    // ---- TAB RÉGLAGES ----
    tab==="reglages" && el(SettingsScreen,{
      theme:theme,setTheme:setTheme,
      showPrevus:showPrevus,setShowPrevus:setShowPrevus,
      householdCode:householdCode,
      onSignOut:function(){if(db)db.auth.signOut();},
      onExport:exportJSON,
      onImport:importJSON,
      user:user,db:db
    })
    ), // fin du panneau d'onglet

    // ---- barre d'onglets en bas (style iOS) ----
    el("nav",{style:S.tabBar},
      [["budget","coins","Budget"],["epargne","piggy-bank","Épargne"],["projets","target","Projets"],["graphiques","bar-chart","Graphiques"],["outils","calculator","Outils"],["reglages","settings","Réglages"]].map(function(t){
        var id=t[0],icon=t[1],label=t[2];var on=tab===id;
        return el("button",{key:id,style:Object.assign({},S.tabBtn,on?S.tabActive:{}),onClick:function(){setTab(id);}},
          el("span",{style:{display:"flex",transform:on?"translateY(-1px) scale(1.06)":"none",transition:"transform .2s cubic-bezier(.22,.61,.36,1)"}},
            el(Icon,{name:icon,size:22,color:on?"#1D8BCE":"var(--text-3)"})),
          el("span",{style:{fontSize:10,fontWeight:on?700:500,letterSpacing:on?"-0.1px":0,transition:"font-weight .2s ease"}},label));
      })),

    // Modals
    (modal&&modal.kind==="newpot") && el(PotModal,{onClose:()=>setModal(null),onSave:p=>{addPot(p);setModal(null);}}),
    (modal&&modal.kind==="editpot") && el(PotModal,{initial:modal.pot,onClose:()=>setModal(null),onSave:upd=>{editPot(modal.pot.id,upd);setModal(null);}}),
    (modal&&modal.kind==="deposit") && el(DepositModal,{pot:modal,maxSuggest:nonAffecte,onClose:()=>setModal(null),onSave:a=>{addDeposit(modal.potId,a);setModal(null);}}),
    (modal&&modal.kind==="allocate") && el(AllocateModal,{pots:pots,available:nonAffecte,onClose:()=>setModal(null),onSave:function(entries){addDeposits(entries);setModal(null);}}),
    (modal&&modal.kind==="history") && el(HistoryModal,{pot:modal.pot,months:months,total:potBalance(modal.pot.id),onClose:()=>setModal(null)}),
    (modal&&modal.kind==="withdraw") && el(WithdrawModal,{pot:modal,onClose:()=>setModal(null),onSave:function(a,note){addWithdrawal(modal.potId,a,note);setModal(null);}}),
    (modal&&modal.kind==="confirmdel") && el(ConfirmModal,{
      title:"Supprimer la cagnotte",
      message:"Supprimer « "+modal.potLabel+" » et tous ses versements ?",
      onClose:()=>setModal(null),
      onConfirm:()=>{delPot(modal.potId);setModal(null);}}),
    (modal&&modal.kind==="newproject") && el(ProjectModal,{pots:pots,onClose:()=>setModal(null),onSave:function(p){addProject(p);setModal(null);}}),
    (modal&&modal.kind==="editproject") && el(ProjectModal,{initial:modal.proj,pots:pots,onClose:()=>setModal(null),onSave:function(upd){editProject(modal.proj.id,upd);setModal(null);}}),
    (modal&&modal.kind==="confirmdelproj") && el(ConfirmModal,{
      title:"Supprimer le projet",
      message:"Supprimer le projet « "+modal.projLabel+" » ?",
      onClose:()=>setModal(null),
      onConfirm:()=>{delProject(modal.projId);setModal(null);}}),
    (modal&&modal.kind==="profile") && el(ProfileModal,{initial:profile,onClose:()=>setModal(null),onSave:function(p){setProfile(p);setModal(null);}})
  );
}

// ---- Page Réglages ----
function SettingsScreen(props){
  var theme=props.theme, setTheme=props.setTheme;
  var showPrevus=props.showPrevus, setShowPrevus=props.setShowPrevus;
  var householdCode=props.householdCode, onSignOut=props.onSignOut;
  var onExport=props.onExport, onImport=props.onImport;
  var user=props.user, db=props.db;
  var sectionStyle={background:"var(--surface)",borderRadius:18,padding:"0 16px",boxShadow:"var(--shadow-card)",marginBottom:0};
  var rowStyle={display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom:"1px solid var(--border-2)"};
  var lastRowStyle={display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0"};
  var labelStyle={fontSize:15,color:"var(--text)",fontWeight:500};
  var sectionLabel={fontSize:12,fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:8,paddingLeft:4};
  return el("div",{style:{display:"flex",flexDirection:"column",gap:22}},
    el("h2",{style:{margin:0,fontSize:20,fontWeight:800}},"Réglages"),

    // Section Affichage
    el("div",null,
      el("div",{style:sectionLabel},"Affichage"),
      el("div",{style:sectionStyle},
        el("div",{style:lastRowStyle},
          el("span",{style:labelStyle},"Thème"),
          el("div",{style:{display:"flex",background:"var(--surface-2)",borderRadius:10,padding:3,gap:2}},
            THEME_ORDER.map(function(t){
              var on=theme===t;
              return el("button",{key:t,onClick:function(){setTheme(t);},
                style:{display:"flex",alignItems:"center",gap:5,padding:"7px 12px",borderRadius:8,border:"none",background:on?"var(--surface)":"transparent",
                  color:on?"var(--text)":"var(--text-3)",fontWeight:on?700:500,fontSize:13,cursor:"pointer",boxShadow:on?"0 1px 3px rgba(0,0,0,.1)":"none"}},
                el(Icon,{name:THEME_ICON[t],size:14}),
                t.charAt(0).toUpperCase()+t.slice(1));
            }))))),

    // Section Budget
    el("div",null,
      el("div",{style:sectionLabel},"Budget"),
      el("div",{style:sectionStyle},
        el("div",{style:lastRowStyle},
          el("div",null,
            el("div",{style:labelStyle},"Budget prévu vs réel"),
            el("div",{style:{fontSize:12,color:"var(--text-3)",marginTop:2}},"Saisis le montant réel dépensé à côté du prévu sur chaque ligne")),
          el(Switch,{on:showPrevus,color:"#1D8BCE",onToggle:function(){setShowPrevus(!showPrevus);}})))),

    // Section Foyer
    (user&&db) && el("div",null,
      el("div",{style:sectionLabel},"Foyer"),
      el("div",{style:sectionStyle},
        householdCode && el("div",{style:rowStyle},
          el("span",{style:labelStyle},"Code d'invitation"),
          el("button",{
            style:{fontSize:13,fontWeight:800,letterSpacing:"2px",fontFamily:"monospace",color:"#1D8BCE",background:"#1D8BCE14",border:"none",borderRadius:9,padding:"7px 14px",cursor:"pointer"},
            title:"Copier le code",
            onClick:function(){try{navigator.clipboard.writeText(householdCode);}catch(e){}}},
            householdCode+" 📋")),
        el("div",{style:lastRowStyle},
          el("span",{style:labelStyle},"Se déconnecter"),
          el("button",{
            style:{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:10,border:"none",background:"#C8516C18",color:"#C8516C",fontSize:13,fontWeight:700,cursor:"pointer"},
            onClick:onSignOut},
            el(Icon,{name:"log-out",size:14,color:"#C8516C"}),"Déconnexion")))),

    // Section Données
    el("div",null,
      el("div",{style:sectionLabel},"Données"),
      el("div",{style:sectionStyle},
        el("div",{style:rowStyle},
          el("span",{style:labelStyle},"Exporter les données"),
          el("button",{
            style:{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:10,border:"none",background:"#19A97918",color:"#19A979",fontSize:13,fontWeight:700,cursor:"pointer"},
            onClick:onExport},
            el(Icon,{name:"download",size:14,color:"#19A979"}),"Exporter JSON")),
        el("div",{style:lastRowStyle},
          el("span",{style:labelStyle},"Importer des données"),
          el("label",{
            style:{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:10,border:"none",background:"#1D8BCE18",color:"#1D8BCE",fontSize:13,fontWeight:700,cursor:"pointer"}},
            el(Icon,{name:"upload",size:14,color:"#1D8BCE"}),"Importer JSON",
            el("input",{type:"file",accept:"application/json",onChange:onImport,style:{display:"none"}}))))));
}

// ---- Graphiques ----
function Charts({months,pots,year,month,mk}){
  const data = months[mk];
  const sum=(arr)=>arr?arr.reduce((s,x)=>s+(x.amount||0),0):0;

  // Données répartition dépenses du mois courant
  const depCats = data ? [
    {label:"Fixes",     value:sum(data.fixed),    color:"#E8743B"},
    {label:"Variables", value:sum(data.variable), color:"#F2B53C"},
    {label:"Except.",   value:sum(data.excep),    color:"#945ECF"},
  ].filter(d=>d.value>0) : [];
  const totalDep = depCats.reduce((s,d)=>s+d.value,0);

  // 6 derniers mois pour bar chart
  const last6 = [];
  for(let i=5;i>=0;i--){
    const d=new Date(year,month-i,1);
    const k=monthKey(d.getFullYear(),d.getMonth());
    const m=months[k];
    last6.push({label:["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"][d.getMonth()],
      rev:sum(m&&m.revenus),dep:sum(m&&m.fixed)+sum(m&&m.variable)+sum(m&&m.excep)});
  }

  // Épargne cumulée
  const savingsCumul = [];
  let cumul=0;
  for(let i=5;i>=0;i--){
    const d=new Date(year,month-i,1);
    const k=monthKey(d.getFullYear(),d.getMonth());
    const m=months[k];
    cumul+=sum(m&&m.deposits);
    savingsCumul.push({label:["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"][d.getMonth()],value:cumul});
  }

  return el("div",{style:{display:"flex",flexDirection:"column",gap:14}},
    el(DonutChart,{data:depCats,total:totalDep,title:"Répartition des dépenses"}),
    el(BarChart,{data:last6,title:"Revenus vs Dépenses (6 mois)"}),
    el(LineChart,{data:savingsCumul,title:"Épargne cumulée (6 mois)"}));
}

function DonutChart({data,total,title}){
  if(total===0) return el("div",{style:{...S.section,color:"var(--text-4)",fontSize:13,textAlign:"center",padding:24}},title," — pas de données ce mois.");
  const cx=90,cy=90,r=64,stroke=20;
  let angle=-Math.PI/2;
  const slices=data.map(d=>{
    const a=(d.value/total)*2*Math.PI;
    const x1=cx+r*Math.cos(angle),y1=cy+r*Math.sin(angle);
    angle+=a;
    const x2=cx+r*Math.cos(angle),y2=cy+r*Math.sin(angle);
    const large=a>Math.PI?1:0;
    return {d:`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`,...d,pct:((d.value/total)*100).toFixed(0)};
  });
  return el("div",{style:S.section},
    el("div",{style:{...S.sectionHead,marginBottom:14}},el("span",{style:{...S.sectionTitle,fontSize:13}},title)),
    el("div",{style:{display:"flex",alignItems:"center",gap:20}},
      el("svg",{viewBox:"0 0 180 180",width:130,height:130,style:{flexShrink:0}},
        slices.map((s,i)=>el("path",{key:i,d:s.d,fill:s.color})),
        el("circle",{cx,cy,r:r-stroke,fill:"#fff"})),
      el("div",{style:{display:"flex",flexDirection:"column",gap:8}},
        slices.map((s,i)=>el("div",{key:i,style:{display:"flex",alignItems:"center",gap:8}},
          el("span",{style:{width:10,height:10,borderRadius:3,background:s.color,flexShrink:0}}),
          el("span",{style:{fontSize:12,color:"var(--text-2)"}},s.label),
          el("span",{style:{fontSize:12,fontWeight:700,color:s.color,marginLeft:"auto"}},s.pct+"%"))))));
}

function BarChart({data,title}){
  const maxVal=Math.max(...data.map(d=>Math.max(d.rev,d.dep)),1);
  const W=300,H=100,pad=4,barW=18,gap=4;
  const groupW=barW*2+gap+8;
  return el("div",{style:S.section},
    el("div",{style:{...S.sectionHead,marginBottom:10}},
      el("span",{style:{...S.sectionTitle,fontSize:13}},title),
      el("div",{style:{display:"flex",gap:10,fontSize:11}},
        el("span",{style:{display:"flex",alignItems:"center",gap:4}},el("span",{style:{width:8,height:8,background:"#19A979",borderRadius:2}}),"Revenus"),
        el("span",{style:{display:"flex",alignItems:"center",gap:4}},el("span",{style:{width:8,height:8,background:"#E8743B",borderRadius:2}}),"Dépenses"))),
    el("svg",{viewBox:`0 0 ${W} ${H+24}`,style:{width:"100%",overflow:"visible"}},
      data.map((d,i)=>{
        const x=pad+i*groupW;
        const rh=Math.max(2,(d.rev/maxVal)*H);
        const dh=Math.max(2,(d.dep/maxVal)*H);
        return el("g",{key:i},
          el("rect",{x,y:H-rh,width:barW,height:rh,rx:3,fill:"#19A979",opacity:.85}),
          el("rect",{x:x+barW+gap,y:H-dh,width:barW,height:dh,rx:3,fill:"#E8743B",opacity:.85}),
          el("text",{x:x+barW,y:H+16,textAnchor:"middle",fontSize:9,fill:"var(--text-3)"},d.label));
      })));
}

function LineChart({data,title}){
  const maxVal=Math.max(...data.map(d=>d.value),1);
  const W=300,H=80,pad=20;
  const pts=data.map((d,i)=>({
    x:pad+i*((W-pad*2)/(data.length-1||1)),
    y:H-(d.value/maxVal)*(H-10)+5,
    ...d}));
  const path=pts.map((p,i)=>(i===0?"M":"L")+p.x+","+p.y).join(" ");
  return el("div",{style:S.section},
    el("div",{style:{...S.sectionHead,marginBottom:10}},el("span",{style:{...S.sectionTitle,fontSize:13}},title)),
    el("svg",{viewBox:`0 0 ${W} ${H+24}`,style:{width:"100%",overflow:"visible"}},
      el("path",{d:path,fill:"none",stroke:"#1D8BCE",strokeWidth:2.5,strokeLinejoin:"round",strokeLinecap:"round"}),
      pts.map((p,i)=>el("g",{key:i},
        el("circle",{cx:p.x,cy:p.y,r:4,fill:"#1D8BCE"}),
        el("text",{x:p.x,y:p.y-8,textAnchor:"middle",fontSize:8.5,fill:"#1D8BCE",fontWeight:600},p.value>0?fmt(p.value).replace(/\s/g,""):""),
        el("text",{x:p.x,y:H+16,textAnchor:"middle",fontSize:9,fill:"var(--text-3)"},p.label)))));
}

// ---- Interrupteur style iOS ----
function Switch({on,onToggle,color}){
  return el("button",{onClick:onToggle,style:{width:46,height:28,borderRadius:14,border:"none",cursor:"pointer",padding:0,position:"relative",
      background:on?(color||"#19A979"):"var(--border-3)",transition:"background .2s"}},
    el("span",{style:{position:"absolute",top:3,left:on?21:3,width:22,height:22,borderRadius:"50%",background:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,.3)",transition:"left .2s"}}));
}

// ---- Sparkline par cagnotte ----
function PotSparkline({months,potId,year,month,color}){
  var ABBR=["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"];
  var bars=[];
  for(var i=5;i>=0;i--){
    var d=new Date(year,month-i,1);
    var k=monthKey(d.getFullYear(),d.getMonth());
    var m=months[k];
    var t=m?(m.deposits||[]).filter(function(dep){return dep.potId===potId;}).reduce(function(a,dep){return a+dep.amount;},0):0;
    bars.push({label:ABBR[d.getMonth()],value:t,current:i===0});
  }
  var maxVal=Math.max.apply(null,bars.map(function(b){return Math.abs(b.value);}));
  if(maxVal===0) return null;
  var W=200,H=40,barW=22,gap=Math.floor((W-barW*6)/7);
  return el("div",{style:{marginTop:12}},
    el("div",{style:{fontSize:10,color:"var(--text-4)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:5}},"Versements · 6 mois"),
    el("svg",{viewBox:"0 0 "+W+" "+(H+14),style:{width:"100%",overflow:"visible"}},
      bars.map(function(b,i){
        var x=gap+i*(barW+gap);
        var h=Math.max(2,(Math.abs(b.value)/maxVal)*(H-6));
        var fillColor=b.value<0?"#C8516C":(b.current?color:(color+"88"));
        return el("g",{key:i},
          el("rect",{x:x,y:H-h,width:barW,height:h,rx:3,fill:b.value>0?fillColor:"var(--border-3)",opacity:b.value>0?1:0.35}),
          b.value>0&&el("text",{x:x+barW/2,y:H-h-3,textAnchor:"middle",fontSize:7.5,fill:color,fontWeight:700},b.value>=1000?Math.round(b.value/100)/10+"k":b.value),
          el("text",{x:x+barW/2,y:H+12,textAnchor:"middle",fontSize:8,fill:"var(--text-4)"},b.label));
      })));
}

// ---- Résumé épargne ----
function PatrimoineCard({pots,potBalance,avgMonthly,thisMonthSaved}){
  var total=pots.reduce(function(s,p){return s+potBalance(p.id);},0);
  var parts=pots.map(function(p){return {label:p.label,color:p.color,val:potBalance(p.id)};}).filter(function(x){return x.val>0;});
  // regrouper par type de compte
  var byType={};
  pots.forEach(function(p){var t=p.type||"autre";if(!byType[t])byType[t]=0;byType[t]+=potBalance(p.id);});
  var typeKeys=Object.keys(byType).filter(function(k){return byType[k]>0;}).sort(function(a,b){return byType[b]-byType[a];});
  return el("div",{style:{...S.section,background:"linear-gradient(135deg,#1D8BCE,#13A4B4)",color:"#fff"}},
    el("div",{style:{fontSize:12,fontWeight:600,opacity:.9,display:"flex",alignItems:"center",gap:6}},el(Icon,{name:"wallet",size:15,color:"#fff"})," Patrimoine épargne"),
    el("div",{style:{fontSize:34,fontWeight:800,letterSpacing:"-1px",margin:"2px 0 14px"}},fmt(total)),
    el("div",{style:{display:"flex",gap:10,marginBottom:14}},
      el("div",{style:S.patStat},el("div",{style:S.patStatLabel},"Rythme moyen"),el("div",{style:S.patStatVal},fmt(avgMonthly)+" /mois")),
      el("div",{style:S.patStat},el("div",{style:S.patStatLabel},"Épargné ce mois"),el("div",{style:S.patStatVal},fmt(thisMonthSaved)))),
    parts.length>0 && el(React.Fragment,null,
      el("div",{style:{display:"flex",height:10,borderRadius:6,overflow:"hidden",marginBottom:10}},
        parts.map(function(x,i){return el("div",{key:i,style:{width:(x.val/total*100)+"%",background:x.color}});})),
      typeKeys.length>1 && el("div",{style:{display:"flex",flexDirection:"column",gap:5,marginTop:10,paddingTop:10,borderTop:"1px solid rgba(255,255,255,.2)"}},
        el("div",{style:{fontSize:10,fontWeight:700,opacity:.8,textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:2}},"Par type de compte"),
        typeKeys.map(function(k){
          var t=POT_TYPES[k]||POT_TYPES.autre;
          var v=byType[k];
          return el("div",{key:k,style:{display:"flex",alignItems:"center",gap:8}},
            el(Icon,{name:t.icon,size:12,color:"rgba(255,255,255,.8)"}),
            el("span",{style:{flex:1,fontSize:12,opacity:.95}},t.badge),
            el("div",{style:{height:5,borderRadius:3,background:"rgba(255,255,255,.35)",width:60,overflow:"hidden"}},
              el("div",{style:{height:"100%",borderRadius:3,background:"rgba(255,255,255,.9)",width:(v/total*100)+"%"}})),
            el("span",{style:{fontSize:12,fontWeight:700,minWidth:60,textAlign:"right"}},fmt(v)));
        }))));
}

// ---- Réglages de projection (onglet Projets) ----
function ProjectionControls({advisorMode,setAdvisorMode,annualReturn,setAnnualReturn}){
  return el("div",{style:S.section},
    el("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"}},
      el("span",{style:{display:"flex",alignItems:"center",gap:9}},
        el(Icon,{name:"bar-chart",size:16,color:"#945ECF"}),
        el("span",null,
          el("div",{style:{fontSize:14,fontWeight:700}},"Projection patrimoniale"),
          el("div",{style:{fontSize:11.5,color:"var(--text-3)",marginTop:1}},"Courbes, simulateur et conseils"))),
      el(Switch,{on:advisorMode,color:"#945ECF",onToggle:function(){setAdvisorMode(!advisorMode);}})),
    advisorMode && el("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:14,paddingTop:14,borderTop:"1px solid var(--border-2)"}},
      el("span",{style:{fontSize:12.5,fontWeight:600,color:"var(--text-2)"}},"Hypothèse de rendement annuel"),
      el("div",{style:{display:"flex",alignItems:"center",gap:6}},
        el("input",{type:"number",inputMode:"decimal",value:annualReturn,onChange:function(e){setAnnualReturn(parseFloat(e.target.value)||0);},onFocus:function(e){e.target.select();},
          style:{width:60,padding:"7px 9px",borderRadius:9,border:"1.5px solid var(--border-3)",background:"var(--field-bg)",color:"var(--text)",fontSize:15,fontWeight:700,textAlign:"right",outline:"none"}}),
        el("span",{style:{fontSize:15,fontWeight:700,color:"var(--text-2)"}},"%"))));
}

// ---- Conseil patrimonial : profil + répartition recommandée ----
function ConseilCard({profile,pots,potBalance,total,monthlyExpenses,annualReturn,setAnnualReturn,onEditProfile}){
  var r=RISK[profile.risk]||RISK.equilibre;
  var alloc=recommendedAllocation(total,profile.risk,profile.age,monthlyExpenses);
  var precautionPct=alloc.emergency>0?Math.min(100,(alloc.precaution/alloc.emergency)*100):100;
  var buckets=[
    {label:"Précaution",color:"#1D8BCE",val:alloc.precaution,hint:"livret / cash disponible"},
    {label:"Sécurisé",color:"#19A979",val:alloc.securise,hint:"fonds €, AV, obligations"},
    {label:"Dynamique",color:"#E8743B",val:alloc.dynamique,hint:"actions (PEA), immo"},
  ];
  var sumB=buckets.reduce(function(s,b){return s+b.val;},0)||1;
  // types de comptes déjà ouverts
  var typeSet={};
  pots.forEach(function(p){typeSet[p.type||"autre"]=true;});
  // tips contextuels
  var tips=[];
  if(total>0&&!typeSet.livret) tips.push({icon:"zap",color:"#1D8BCE",text:"Ouvre un Livret A : épargne défiscalisée et disponible immédiatement, idéal pour le matelas de précaution."});
  if(typeSet.livret&&pots.filter(function(p){return p.type==="livret";}).reduce(function(s,p){return s+potBalance(p.id);},0)>20000) tips.push({icon:"zap",color:"#E8743B",text:"Ton Livret A approche du plafond (22 950 €). Pense à ouvrir un LDDS ou à investir le surplus."});
  if(!typeSet.pea&&profile.horizon>=5&&r.stock>=50) tips.push({icon:"bar-chart",color:"#19A979",text:"Un PEA est adapté à ton profil (horizon "+profile.horizon+" ans). Actions défiscalisées après 5 ans, plafond 150 000 €."});
  if(!typeSet.av&&total>15000) tips.push({icon:"target",color:"#945ECF",text:"Une assurance vie apporte diversification et avantage fiscal après 8 ans. Adapté pour épargne moyen terme."});
  return el("div",{style:S.section},
    el("div",{style:S.sectionHead},
      el("span",{style:S.sectionTitle},el(Icon,{name:"target",size:16,color:r.color})," Conseil patrimonial"),
      el("button",{style:{...S.smallBtn,color:r.color,background:r.color+"18"},onClick:onEditProfile},el(Icon,{name:"edit-2",size:13})," Mon profil")),
    el("div",{style:{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"var(--text-2)",marginBottom:14}},
      el("span",{style:{fontWeight:700,color:r.color}},"Profil "+r.label),
      el("span",null,"· "+profile.age+" ans · horizon "+profile.horizon+" ans")),
    el("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",background:r.color+"12",borderRadius:11,padding:"10px 12px",marginBottom:14}},
      el("span",{style:{fontSize:12.5,color:"var(--text)"}},"Rendement attendu pour ce profil : ",el("strong",{style:{color:r.color}},r.ret+" %/an")),
      Math.abs(annualReturn-r.ret)>0.01 && el("button",{style:{border:"none",background:r.color,color:"#fff",borderRadius:8,padding:"6px 10px",fontSize:12,fontWeight:700,cursor:"pointer"},onClick:function(){setAnnualReturn(r.ret);}},"Appliquer")),
    el("div",{style:{fontSize:12,fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:8}},"Répartition recommandée"),
    total<=0 ? el("p",{style:S.blockHint},"Renseigne tes cagnottes pour voir la répartition conseillée de ton patrimoine.") :
    el(React.Fragment,null,
      el("div",{style:{display:"flex",height:12,borderRadius:6,overflow:"hidden",marginBottom:12}},
        buckets.map(function(b,i){return el("div",{key:i,style:{width:(b.val/sumB*100)+"%",background:b.color}});})),
      buckets.map(function(b,i){return el("div",{key:i,style:{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:i<2?"1px solid var(--border-2)":"none"}},
        el("span",{style:{width:10,height:10,borderRadius:3,background:b.color,flexShrink:0}}),
        el("span",{style:{flex:1}},el("div",{style:{fontSize:13.5,fontWeight:600}},b.label),el("div",{style:{fontSize:11,color:"var(--text-3)"}},b.hint)),
        el("span",{style:{textAlign:"right"}},el("div",{style:{fontWeight:800,fontSize:14,color:b.color}},fmt(b.val)),el("div",{style:{fontSize:11,color:"var(--text-3)"}},(b.val/sumB*100).toFixed(0)+"%")));})),
    alloc.emergency>0 && el("div",{style:{marginTop:12,fontSize:12,color:"var(--text-2)"}},
      el("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:4}},
        el("span",null,"Matelas de précaution ("+r.emo+" mois de dépenses)"),
        el("span",{style:{fontWeight:700,color:precautionPct>=100?"#19A979":"#E8743B"}},fmt(alloc.precaution)+" / "+fmt(alloc.emergency))),
      el("div",{style:S.potBarTrack},el("div",{style:{...S.potBarFill,width:precautionPct+"%",background:precautionPct>=100?"#19A979":"#E8743B"}})),
      precautionPct<100 && el("div",{style:{marginTop:6,fontSize:11.5,color:"#E8743B",fontWeight:600}},"Priorité : compléter ton épargne de précaution avant d'investir.")),
    tips.length>0 && el("div",{style:{marginTop:14,paddingTop:12,borderTop:"1px solid var(--border-2)",display:"flex",flexDirection:"column",gap:8}},
      el("div",{style:{fontSize:12,fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.5px"}},"À étudier"),
      tips.map(function(tip,i){return el("div",{key:i,style:{display:"flex",alignItems:"flex-start",gap:9,background:tip.color+"0f",borderRadius:10,padding:"9px 11px"}},
        el(Icon,{name:tip.icon,size:14,color:tip.color,style:{flexShrink:0,marginTop:1}}),
        el("span",{style:{fontSize:12,color:"var(--text)",lineHeight:1.45}},tip.text));})));
}

// ---- Bilan annuel ----
function AnnualReview({months,year}){
  var sum=function(arr){return arr?arr.reduce(function(s,x){return s+(x.amount||0);},0):0;};
  var saved=[],rev=0,dep=0,totalSaved=0,best={m:-1,v:-1},i;
  for(i=0;i<12;i++){
    var m=months[monthKey(year,i)];
    var sv=m?sum(m.deposits):0;
    saved.push(sv); totalSaved+=sv;
    if(m){ rev+=sum(m.revenus); dep+=sum(m.fixed)+sum(m.variable)+sum(m.excep); }
    if(sv>best.v){ best={m:i,v:sv}; }
  }
  var rate=rev>0?(totalSaved/rev)*100:0;
  var maxBar=Math.max.apply(null,saved.concat([1]));
  var hasData=totalSaved>0||rev>0||dep>0;
  return el("div",{style:S.section},
    el("div",{style:{...S.sectionHead,marginBottom:14}},el("span",{style:{...S.sectionTitle,fontSize:13}},"Bilan "+year)),
    !hasData ? el("p",{style:S.blockHint},"Pas encore de données pour "+year+".") :
    el(React.Fragment,null,
      el("div",{style:{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}},
        el("div",{style:S.bilanStat},el("div",{style:S.bilanLabel},"Épargné sur l'année"),el("div",{style:{...S.bilanVal,color:"#19A979"}},fmt(totalSaved))),
        el("div",{style:S.bilanStat},el("div",{style:S.bilanLabel},"Taux d'épargne"),el("div",{style:S.bilanVal},rate.toFixed(0)+" %"))),
      el("div",{style:{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}},
        el("div",{style:S.bilanStat},el("div",{style:S.bilanLabel},"Revenus"),el("div",{style:{...S.bilanVal,fontSize:15}},fmt(rev))),
        el("div",{style:S.bilanStat},el("div",{style:S.bilanLabel},"Dépenses"),el("div",{style:{...S.bilanVal,fontSize:15}},fmt(dep)))),
      best.v>0 && el("div",{style:{fontSize:12,color:"var(--text-2)",marginBottom:12}},"💪 Meilleur mois : ",el("strong",null,MONTHS_FR[best.m])," ("+fmt(best.v)+")"),
      // mini barres épargne par mois
      el("svg",{viewBox:"0 0 320 70",style:{width:"100%"}},
        saved.map(function(v,idx){
          var x=4+idx*26, h=Math.max(1,(v/maxBar)*54);
          return el("g",{key:idx},
            el("rect",{x:x,y:60-h,width:18,height:h,rx:3,fill:v>0?"#19A979":"var(--border-3)",opacity:v>0?0.9:0.5}),
            el("text",{x:x+9,y:68,textAnchor:"middle",fontSize:8,fill:"var(--text-4)"},["J","F","M","A","M","J","J","A","S","O","N","D"][idx]));
        }))));
}

// ---- Courbe de projection (sans / avec rendement) ----
function ProjectionChart({current,monthly,goal,annualReturn,color}){
  var rm=monthlyRate(annualReturn);
  var mRet=monthsToGoal(current,monthly,goal,rm);
  var mLin=monthsToGoal(current,monthly,goal,0);
  var reached=[mRet,mLin].filter(function(x){return x!=null;});
  var horizon=reached.length?clamp(Math.max.apply(null,reached)+6,12,360):120;
  var lin=projSeries(current,monthly,0,horizon);
  var ret=projSeries(current,monthly,rm,horizon);
  var maxY=Math.max(goal,lin[horizon],ret[horizon])*1.05||1;
  var W=300,H=120,padL=4,padB=18;
  var X=function(i){return padL+i*((W-padL*2)/horizon);};
  var Y=function(v){return (H-padB)-(v/maxY)*(H-padB-4);};
  var path=function(arr){return arr.map(function(v,i){return (i===0?"M":"L")+X(i).toFixed(1)+","+Y(v).toFixed(1);}).join(" ");};
  var goalY=Y(goal);
  // graduations années
  var ticks=[],yMax=Math.floor(horizon/12),yy;
  for(yy=0;yy<=yMax;yy++) ticks.push(yy*12);
  return el("svg",{viewBox:"0 0 "+W+" "+(H+4),style:{width:"100%",overflow:"visible",marginTop:10}},
    // ligne objectif
    el("line",{x1:padL,y1:goalY,x2:W-padL,y2:goalY,stroke:"var(--text-4)",strokeWidth:1,strokeDasharray:"3 3"}),
    el("text",{x:W-padL,y:goalY-4,textAnchor:"end",fontSize:8.5,fill:"var(--text-3)"},"objectif"),
    // courbe linéaire (gris)
    el("path",{d:path(lin),fill:"none",stroke:"var(--text-4)",strokeWidth:1.5,strokeDasharray:"4 3"}),
    // courbe avec rendement (couleur)
    el("path",{d:path(ret),fill:"none",stroke:color,strokeWidth:2.5,strokeLinejoin:"round"}),
    // repère atteinte (avec rendement)
    mRet!=null && el("circle",{cx:X(mRet),cy:goalY,r:4,fill:color}),
    // graduations années
    ticks.map(function(t,i){return el("text",{key:i,x:X(t),y:H+2,textAnchor:"middle",fontSize:8,fill:"var(--text-4)"},t===0?"":(t/12)+"a");}));
}

// ---- Carte projet (projection + simulateur + conseil) ----
function ProjectCard({proj,balance,pots,avgMonthly,annualReturn,advisorMode,onEdit,onDelete,onContribution}){
  var color=proj.color||"#945ECF";
  var goal=proj.goal||0;
  var remaining=Math.max(0,goal-balance);
  var pct=goal>0?Math.min(100,(balance/goal)*100):null;
  var done=goal>0&&balance>=goal;
  // épargne mensuelle prévue : valeur du projet, sinon moyenne globale
  var monthly=(typeof proj.monthlyContribution==="number"&&proj.monthlyContribution>0)?proj.monthlyContribution:Math.round(avgMonthly);
  var rm=monthlyRate(annualReturn);
  var mRet=monthsToGoal(balance,monthly,goal,rm);
  var mLin=monthsToGoal(balance,monthly,goal,0);
  var now=new Date();
  // date cible -> épargne nécessaire
  var reqMonthly=null,mLeft=null;
  if(proj.targetDate){
    var td=new Date(proj.targetDate);
    mLeft=(td.getFullYear()-now.getFullYear())*12+(td.getMonth()-now.getMonth());
    if(mLeft>0&&remaining>0){
      var f=rm>0?(Math.pow(1+rm,mLeft)-1)/rm:mLeft;
      var fv=balance*Math.pow(1+rm,mLeft);
      reqMonthly=Math.max(0,Math.ceil((goal-fv)/f));
    }
  }
  // conseil automatique
  var advice;
  if(done){ advice={icon:"check",color:"#19A979",text:"Objectif atteint 🎉 Bravo !"}; }
  else if(monthly<=0){ advice={icon:"zap",color:"#E8743B",text:"Ajoute une épargne mensuelle pour estimer la date d'atteinte."}; }
  else if(mRet!=null){
    var dRet=fmtMonthYear(addMonths(now,mRet));
    var txt="À "+fmt(monthly)+"/mois, objectif atteint vers "+dRet;
    if(mLin!=null&&mLin>mRet){ txt+=" — soit "+(mLin-mRet)+" mois plus tôt grâce au rendement."; }
    else { txt+="."; }
    advice={icon:"target",color:color,text:txt};
  } else { advice={icon:"zap",color:"#C8516C",text:"À ce rythme, l'objectif n'est pas atteignable. Augmente l'épargne mensuelle."}; }
  // alerte date cible
  var targetAlert=null;
  if(proj.targetDate&&reqMonthly!=null&&reqMonthly>monthly){
    targetAlert="Pour tenir "+fmtMonthYear(new Date(proj.targetDate))+", il faut "+fmt(reqMonthly)+"/mois (au lieu de "+fmt(monthly)+").";
  }
  var sliderMax=Math.max(500,Math.ceil((goal/12)/50)*50);
  return el("div",{style:S.projCard},
    el("div",{style:S.potTop},
      el("span",{style:{display:"flex",alignItems:"center",gap:9}},
        el("span",{style:{width:12,height:12,borderRadius:3,background:color,flexShrink:0}}),
        el("strong",{style:{fontSize:15}},proj.label)),
      el("div",{style:{display:"flex",gap:4}},
        el("button",{style:S.delBtn,title:"Modifier",onClick:onEdit},el(Icon,{name:"edit-2",size:13})),
        el("button",{style:{...S.delBtn,color:"#C8516C"},title:"Supprimer",onClick:onDelete},el(Icon,{name:"trash-2",size:13})))),
    el("div",{style:S.potBalRow},
      el("span",{style:{fontSize:24,fontWeight:800,color:color,letterSpacing:"-0.5px"}},fmt(balance)),
      goal>0&&el("span",{style:S.potGoalTxt},"/ "+fmt(goal))),
    pct!==null && el(React.Fragment,null,
      el("div",{style:S.potBarTrack},el("div",{style:{...S.potBarFill,width:pct+"%",background:color}})),
      el("div",{style:S.potFoot},
        el("span",{style:{color:color,fontWeight:600}},pct.toFixed(0)+"%"),
        el("span",{style:{color:"var(--text-3)"}},done?"Objectif atteint 🎉":"reste "+fmt(remaining)))),
    // ===== mode projection (advisor) =====
    advisorMode && goal>0 && !done && el(ProjectionChart,{current:balance,monthly:monthly,goal:goal,annualReturn:annualReturn,color:color}),
    advisorMode && el("div",{style:{display:"flex",gap:8,alignItems:"flex-start",background:advice.color+"14",borderRadius:11,padding:"10px 12px",marginTop:12}},
      el(Icon,{name:advice.icon,size:15,color:advice.color,style:{flexShrink:0,marginTop:1}}),
      el("span",{style:{fontSize:12.5,color:"var(--text)",lineHeight:1.4}},advice.text)),
    advisorMode && targetAlert && el("div",{style:{fontSize:12,color:"#C8516C",marginTop:8,fontWeight:600}},"⚠︎ "+targetAlert),
    advisorMode && !done && el("div",{style:{marginTop:14,paddingTop:12,borderTop:"1px dashed var(--border-2)"}},
      el("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}},
        el("span",{style:{fontSize:12.5,fontWeight:600,color:"var(--text-2)"}},"Simuler : épargne mensuelle"),
        el("span",{style:{fontSize:15,fontWeight:800,color:color}},fmt(monthly))),
      el("input",{type:"range",min:0,max:sliderMax,step:10,value:Math.min(monthly,sliderMax),
        onChange:function(e){onContribution(parseFloat(e.target.value)||0);},
        style:{width:"100%",accentColor:color}})),
    // ===== mode simple (advisor off) =====
    !advisorMode && !done && el("div",{style:S.projStats},
      mLin!=null && el("div",{style:S.projStat},
        el("span",{style:{color:"var(--text-3)",fontSize:11}},"Atteint vers"),
        el("span",{style:{fontWeight:700,fontSize:12}},fmtMonthYear(addMonths(now,mLin)))),
      reqMonthly!=null && el("div",{style:S.projStat},
        el("span",{style:{color:"var(--text-3)",fontSize:11}},"Nécessaire / mois"),
        el("span",{style:{fontWeight:700,fontSize:12,color:color}},fmt(reqMonthly)))),
    (proj.linkedPotIds||[]).length>0 && el("div",{style:{fontSize:11,color:"var(--text-3)",marginTop:10}},
      "Cagnottes : "+(proj.linkedPotIds||[]).map(function(id){var p=pots.find(function(x){return x.id===id;});return p?p.label:"?";}).join(", ")));
}

// ---- helpers ----
function flowRow(icon,color,label,val,valColor){
  return el("div",{style:S.flowRow},
    el("span",{style:S.flowLabel},el(Icon,{name:icon,size:14,color}),` ${label}`),
    el("span",{style:{...S.flowVal,color:valColor}},val));
}

function FastBlock({kind,cfg,items,reel,showPrevus,onAmount,onReel,onDel,onRename,onAdd}){
  const total=items.reduce((s,x)=>s+(x.amount||0),0);
  const totalReel=showPrevus?items.reduce(function(s,x){return s+(parseFloat((reel||{})[x.id])||0);},0):0;
  const [newLabel,setNewLabel]=useState("");
  const addNew=()=>{ if(!newLabel.trim())return; onAdd(newLabel.trim()); setNewLabel(""); };
  var diffTotal=totalReel-total;
  return el("div",{style:S.section},
    el("div",{style:S.sectionHead},
      el("span",{style:S.sectionTitle},el("span",{style:{color:cfg.accent,display:"flex"}},el(Icon,{name:cfg.icon,size:16,color:cfg.accent}))," "+cfg.title),
      el("span",{style:{...S.badge,background:cfg.accent+"1a",color:cfg.accent}},cfg.sign+" "+fmt(total))),
    showPrevus && el("div",{style:{display:"flex",justifyContent:"flex-end",gap:10,fontSize:12,color:"var(--text-3)",marginBottom:4}},
      el("span",null,"Prévu"),
      el("span",null,"Réel"),
      el("span",{style:{minWidth:60,textAlign:"right"}},"Écart")),
    el("div",{style:S.lineList}, items.map(function(it){
      var reelV=showPrevus?parseFloat((reel||{})[it.id])||0:0;
      var diff=reelV-it.amount;
      var diffColor=diff>0?"#C8516C":(diff<0?"#19A979":"var(--text-3)");
      return el("div",{key:it.id,style:{display:"flex",flexDirection:"column",gap:0}},
        el("div",{style:S.lineRow},
          el("span",{style:{...S.lineDot,background:cfg.accent}}),
          el("input",{style:S.lineLabelInput,value:it.label,onChange:function(e){onRename(it.id,e.target.value);},placeholder:"Libellé"}),
          showPrevus && el("div",{style:{display:"flex",alignItems:"center",gap:6}},
            el("div",{style:{...S.lineAmtWrap,borderColor:it.amount>0?cfg.accent+"55":"var(--border)"}},
              el("input",{type:"number",inputMode:"decimal",style:S.lineAmtInput,value:it.amount||"",placeholder:"0",
                onChange:function(e){onAmount(it.id,parseFloat(e.target.value)||0);},onFocus:function(e){e.target.select();}}),
              el("span",{style:S.eur},"€")),
            el("div",{style:{...S.lineAmtWrap,width:80,borderColor:"var(--border-2)"}},
              el("input",{type:"number",inputMode:"decimal",style:{...S.lineAmtInput,fontSize:12,color:"var(--text-3)"},value:reelV||"",placeholder:"réel",
                onChange:function(e){onReel(it.id,parseFloat(e.target.value)||0);},onFocus:function(e){e.target.select();}}),
              el("span",{style:{...S.eur,fontSize:11}},"€")),
            reelV>0 && el("span",{style:{fontSize:11,fontWeight:700,color:diffColor,minWidth:50,textAlign:"right"}},(diff>0?"+":"")+fmt(diff))),
          !showPrevus && el("div",{style:{...S.lineAmtWrap,borderColor:it.amount>0?cfg.accent+"55":"var(--border)"}},
            el("input",{type:"number",inputMode:"decimal",style:S.lineAmtInput,value:it.amount||"",placeholder:"0",
              onChange:function(e){onAmount(it.id,parseFloat(e.target.value)||0);},onFocus:function(e){e.target.select();}}),
            el("span",{style:S.eur},"€")),
          el("button",{style:S.lineDel,onClick:function(){onDel(it.id);}},el(Icon,{name:"x",size:15}))));
    })),
    showPrevus && totalReel>0 && el("div",{style:{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:700,padding:"8px 2px 0",borderTop:"1px dashed var(--border-2)",marginTop:6}},
      el("span",{style:{color:"var(--text-3)"}},"Totaux"),
      el("div",{style:{display:"flex",gap:10}},
        el("span",{style:{color:cfg.accent}},fmt(total)),
        el("span",{style:{color:"var(--text-3)"}},"/ "+fmt(totalReel)),
        el("span",{style:{color:diffTotal>0?"#C8516C":(diffTotal<0?"#19A979":"var(--text-3)")}},(diffTotal>0?"+":"")+fmt(diffTotal)))),
    el("div",{style:S.addLineRow},
      el(Icon,{name:"plus",size:15,color:"var(--text-4)"}),
      el("input",{style:S.addLineInput,value:newLabel,placeholder:"Ajouter une ligne…",onChange:function(e){setNewLabel(e.target.value);},onKeyDown:function(e){if(e.key==="Enter")addNew();}}),
      newLabel.trim() && el("button",{style:{...S.addLineBtn,color:cfg.accent},onClick:addNew},"Ajouter")));
}

function PotModal({initial,onClose,onSave}){
  const [label,setLabel]=useState((initial&&initial.label)||"");
  const [goal,setGoal]=useState((initial&&initial.goal>0)?String(initial.goal):"");
  const [startBalance,setStartBalance]=useState((initial&&initial.startBalance>0)?String(initial.startBalance):"");
  const [type,setType]=useState((initial&&initial.type)||"autre");
  const [color,setColor]=useState((initial&&initial.color)||(POT_TYPES[(initial&&initial.type)||"autre"].color)||POT_PALETTE[0]);
  const pickType=function(k){setType(k);setColor(POT_TYPES[k].color);};
  const submit=function(){if(!label)return;onSave({label,goal:parseFloat(goal)||0,startBalance:parseFloat(startBalance)||0,color,type});};
  return el(Modal,{title:initial?"Modifier la cagnotte":"Nouvelle cagnotte",onClose},
    el("div",{style:{marginBottom:14}},el("label",{style:S.fieldLabel},"Nom"),el("input",{value:label,autoFocus:true,placeholder:"ex : Livret A, PEA Fortuneo…",style:S.input,onChange:function(e){setLabel(e.target.value);}})),
    el("div",{style:{marginBottom:14}},
      el("label",{style:S.fieldLabel},"Type de compte"),
      el("div",{style:{display:"flex",flexDirection:"column",gap:6}},
        Object.keys(POT_TYPES).map(function(k){
          var t=POT_TYPES[k];var on=type===k;
          return el("button",{key:k,onClick:function(){pickType(k);},
            style:{display:"flex",alignItems:"center",gap:10,textAlign:"left",padding:"9px 12px",borderRadius:11,cursor:"pointer",border:on?("2px solid "+t.color):"1.5px solid var(--border)",background:on?t.color+"14":"var(--surface-2)"}},
            el(Icon,{name:t.icon,size:14,color:on?t.color:"var(--text-3)"}),
            el("span",null,
              el("div",{style:{fontSize:13,fontWeight:700,color:on?t.color:"var(--text)"}},t.label),
              t.hint&&el("div",{style:{fontSize:11,color:"var(--text-3)",marginTop:1}},t.hint+(t.plafond?" · plafond "+fmt(t.plafond):""))));}))),
    el("div",{style:{marginBottom:14}},el("label",{style:S.fieldLabel},"Solde de départ (€) — épargne déjà constituée"),el("input",{type:"number",inputMode:"decimal",value:startBalance,placeholder:"0",style:S.input,onChange:function(e){setStartBalance(e.target.value);}})),
    el("div",{style:{marginBottom:14}},el("label",{style:S.fieldLabel},"Objectif (€) — optionnel"),el("input",{type:"number",inputMode:"decimal",value:goal,placeholder:"Vide = cagnotte libre",style:S.input,onChange:function(e){setGoal(e.target.value);}})),
    el("div",{style:{marginBottom:18}},el("label",{style:S.fieldLabel},"Couleur"),el("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},POT_PALETTE.map(function(c){return el("button",{key:c,onClick:function(){setColor(c);},style:{width:30,height:30,borderRadius:8,background:c,border:color===c?"3px solid var(--text)":"2px solid var(--border)",cursor:"pointer"}});}))),
    el("button",{style:S.saveBtn,onClick:submit},initial?"Enregistrer":"Créer la cagnotte"));
}

function ProjectModal({initial,pots,onClose,onSave}){
  const [label,setLabel]=useState((initial&&initial.label)||"");
  const [goal,setGoal]=useState((initial&&initial.goal>0)?String(initial.goal):"");
  const [initialAmount,setInitialAmount]=useState((initial&&initial.initialAmount>0)?String(initial.initialAmount):"");
  const [monthlyContribution,setMonthlyContribution]=useState((initial&&initial.monthlyContribution>0)?String(initial.monthlyContribution):"");
  const [targetDate,setTargetDate]=useState((initial&&initial.targetDate)||"");
  const [color,setColor]=useState((initial&&initial.color)||"#945ECF");
  const [linkedPotIds,setLinkedPotIds]=useState((initial&&initial.linkedPotIds)||[]);
  const togglePot=function(id){setLinkedPotIds(function(prev){return prev.indexOf(id)>=0?prev.filter(function(x){return x!==id;}):[...prev,id];});};
  const submit=function(){if(!label)return;onSave({label,goal:parseFloat(goal)||0,initialAmount:parseFloat(initialAmount)||0,monthlyContribution:parseFloat(monthlyContribution)||0,targetDate:targetDate,color:color,linkedPotIds:linkedPotIds});};
  return el(Modal,{title:initial?"Modifier le projet":"Nouveau projet",onClose},
    el("div",{style:{marginBottom:14}},el("label",{style:S.fieldLabel},"Nom du projet"),el("input",{value:label,autoFocus:true,placeholder:"ex : Apport maison, Voyage…",style:S.input,onChange:function(e){setLabel(e.target.value);}})),
    el("div",{style:{marginBottom:14}},el("label",{style:S.fieldLabel},"Objectif total (€)"),el("input",{type:"number",inputMode:"decimal",value:goal,placeholder:"ex : 40000",style:S.input,onChange:function(e){setGoal(e.target.value);}})),
    el("div",{style:{marginBottom:14}},el("label",{style:S.fieldLabel},"Épargne déjà constituée (€)"),el("input",{type:"number",inputMode:"decimal",value:initialAmount,placeholder:"0",style:S.input,onChange:function(e){setInitialAmount(e.target.value);}})),
    el("div",{style:{marginBottom:14}},el("label",{style:S.fieldLabel},"Épargne mensuelle prévue (€) — optionnel"),el("input",{type:"number",inputMode:"decimal",value:monthlyContribution,placeholder:"Vide = rythme moyen",style:S.input,onChange:function(e){setMonthlyContribution(e.target.value);}})),
    el("div",{style:{marginBottom:14}},el("label",{style:S.fieldLabel},"Date cible (optionnel)"),el("input",{type:"month",value:targetDate,style:S.input,onChange:function(e){setTargetDate(e.target.value);}})),
    pots.length>0 && el("div",{style:{marginBottom:14}},
      el("label",{style:S.fieldLabel},"Cagnottes rattachées"),
      el("div",{style:{display:"flex",flexDirection:"column",gap:6}},pots.map(function(p){
        var checked=linkedPotIds.indexOf(p.id)>=0;
        return el("label",{key:p.id,style:{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:9,background:checked?p.color+"18":"var(--surface-2)",cursor:"pointer"}},
          el("input",{type:"checkbox",checked:checked,onChange:function(){togglePot(p.id);},style:{accentColor:p.color,width:16,height:16}}),
          el("span",{style:{fontSize:14,fontWeight:checked?700:400,color:checked?p.color:"var(--text-2)"}},p.label));
      }))),
    el("div",{style:{marginBottom:18}},el("label",{style:S.fieldLabel},"Couleur"),el("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},POT_PALETTE.map(function(c){return el("button",{key:c,onClick:function(){setColor(c);},style:{width:30,height:30,borderRadius:8,background:c,border:color===c?"3px solid var(--text)":"2px solid var(--border)",cursor:"pointer"}});}))),
    el("button",{style:S.saveBtn,onClick:submit},initial?"Enregistrer":"Créer le projet"));
}

function ProfileModal({initial,onClose,onSave}){
  const [age,setAge]=useState(String(initial.age||35));
  const [horizon,setHorizon]=useState(String(initial.horizon||10));
  const [risk,setRisk]=useState(initial.risk||"equilibre");
  const submit=function(){onSave({age:parseInt(age,10)||35,horizon:parseInt(horizon,10)||10,risk:risk});};
  return el(Modal,{title:"Mon profil investisseur",onClose},
    el("div",{style:{display:"flex",gap:12,marginBottom:14}},
      el("div",{style:{flex:1}},el("label",{style:S.fieldLabel},"Âge"),el("input",{type:"number",inputMode:"numeric",value:age,style:S.input,onChange:function(e){setAge(e.target.value);}})),
      el("div",{style:{flex:1}},el("label",{style:S.fieldLabel},"Horizon (ans)"),el("input",{type:"number",inputMode:"numeric",value:horizon,style:S.input,onChange:function(e){setHorizon(e.target.value);}}))),
    el("label",{style:S.fieldLabel},"Tolérance au risque"),
    el("div",{style:{display:"flex",flexDirection:"column",gap:8,marginBottom:18}},
      ["prudent","equilibre","dynamique"].map(function(k){
        var r=RISK[k];var on=risk===k;
        return el("button",{key:k,onClick:function(){setRisk(k);},style:{display:"flex",alignItems:"center",gap:11,textAlign:"left",padding:"11px 13px",borderRadius:12,cursor:"pointer",
            border:on?("2px solid "+r.color):"2px solid var(--border)",background:on?r.color+"14":"var(--surface-2)"}},
          el("span",{style:{width:14,height:14,borderRadius:"50%",flexShrink:0,border:on?("4px solid "+r.color):"2px solid var(--border-3)"}}),
          el("span",null,
            el("div",{style:{fontSize:14,fontWeight:700,color:on?r.color:"var(--text)"}},r.label+" · ~"+r.ret+" %/an"),
            el("div",{style:{fontSize:11.5,color:"var(--text-3)",marginTop:1}},r.desc)));
      })),
    el("button",{style:S.saveBtn,onClick:submit},"Enregistrer mon profil"));
}

function DepositModal({pot,maxSuggest,onClose,onSave}){
  const [amount,setAmount]=useState("");
  const submit=()=>{const a=parseFloat(amount);if(!a||a<=0)return;onSave(a);};
  return el(Modal,{title:`Verser dans « ${pot.potLabel} »`,onClose},
    maxSuggest>0 && el("button",{style:S.suggestBtn,onClick:()=>setAmount(String(Math.round(maxSuggest*100)/100))},el(Icon,{name:"arrow-right",size:14})," Verser tout le non-affecté ("+fmt(maxSuggest)+")"),
    el("div",{style:{margin:"14px 0 18px"}},el("label",{style:S.fieldLabel},"Montant (€)"),el("input",{type:"number",inputMode:"decimal",value:amount,autoFocus:true,placeholder:"0,00",style:S.input,onChange:e=>setAmount(e.target.value),onKeyDown:e=>e.key==="Enter"&&submit()})),
    el("button",{style:{...S.saveBtn,background:`linear-gradient(135deg,${pot.color},${pot.color}cc)`,boxShadow:`0 4px 14px ${pot.color}55`},onClick:submit},"Verser"));
}

function AllocateModal({pots,available,onClose,onSave}){
  const [amounts,setAmounts]=useState({});
  const set=function(id,v){setAmounts(function(prev){var n=Object.assign({},prev);n[id]=v;return n;});};
  const allocated=pots.reduce(function(s,p){return s+(parseFloat(amounts[p.id])||0);},0);
  const left=available-allocated;
  const submit=function(){if(left<-0.001)return;var entries=pots.map(function(p){return {potId:p.id,amount:parseFloat(amounts[p.id])||0};});onSave(entries);};
  return el(Modal,{title:"Répartir le non-affecté",onClose},
    el("p",{style:{fontSize:13,color:"var(--text-2)",margin:"0 0 14px"}},
      "Tu as "+fmt(available)+" non affecté ce mois. Répartis ce que tu veux dans tes cagnottes — ce qui reste demeure sur le compte courant (ton matelas)."),
    el("div",{style:{display:"flex",flexDirection:"column",gap:8,marginBottom:16}},pots.map(function(p){
      return el("div",{key:p.id,style:{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:11,background:"var(--surface-2)"}},
        el("span",{style:{width:10,height:10,borderRadius:"50%",background:p.color,flexShrink:0}}),
        el("span",{style:{flex:1,fontSize:14,fontWeight:600}},p.label),
        el("div",{style:{...S.lineAmtWrap,width:110}},
          el("input",{type:"number",inputMode:"decimal",style:S.lineAmtInput,placeholder:"0",value:amounts[p.id]||"",
            onChange:function(e){set(p.id,e.target.value);},onFocus:function(e){e.target.select();}}),
          el("span",{style:S.eur},"€")));
    })),
    el("div",{style:{display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:700,padding:"10px 2px",marginBottom:14,borderTop:"1px dashed var(--border-2)"}},
      el("span",{style:{color:"var(--text-2)"}},el(Icon,{name:"wallet",size:14})," Laissé sur le compte"),
      el("span",{style:{color:left<0?"#C8516C":"#19A979"}},fmt(left))),
    left<-0.001 && el("p",{style:{fontSize:12,color:"#C8516C",margin:"0 0 12px"}},"Tu répartis plus que le non-affecté disponible."),
    el("button",{style:{...S.saveBtn,opacity:(allocated<=0||left<-0.001)?0.5:1},onClick:submit},"Verser "+fmt(allocated)));
}

function HistoryModal({pot,months,total,onClose}){
  // reconstruct all entries with date, amount, note
  var entries=[];
  Object.keys(months).sort().forEach(function(k){
    (months[k].deposits||[]).filter(function(d){return d.potId===pot.id;}).forEach(function(d){
      entries.push({key:k,amount:d.amount,note:d.note||""});
    });
  });
  var hasEntries=entries.length>0;
  return el(Modal,{title:"Historique — "+pot.label,onClose},
    pot.startBalance>0 && el("div",{style:{...S.itemRow,borderBottom:"1px dashed var(--border-2)"}},
      el("span",{style:{...S.itemDot,background:pot.color}}),
      el("span",{style:S.lineLabel},"Solde de départ"),
      el("span",{style:{...S.itemAmount,color:"var(--text-2)"}},fmt(pot.startBalance))),
    !hasEntries && pot.startBalance<=0 && el("p",{style:S.blockHint},"Aucun mouvement pour l'instant."),
    entries.map(function(e,i){
      var parts=e.key.split("-");var mi=parseInt(parts[1],10)-1;
      var isW=e.amount<0;
      var amtColor=isW?"#C8516C":pot.color;
      return el("div",{key:i,style:{...S.itemRow,flexDirection:"column",alignItems:"stretch",gap:4,borderBottom:"1px solid var(--border-2)"}},
        el("div",{style:{display:"flex",alignItems:"center",gap:11}},
          el("span",{style:{...S.itemDot,background:amtColor}}),
          el("span",{style:S.lineLabel},MONTHS_FR[mi]+" "+parts[0]),
          el("span",{style:{...S.itemAmount,color:amtColor}},(isW?"− "+fmt(-e.amount):"+ "+fmt(e.amount)))),
        e.note&&el("div",{style:{fontSize:11,color:"var(--text-3)",paddingLeft:20,fontStyle:"italic"}},e.note));
    }),
    el("div",{style:{display:"flex",justifyContent:"space-between",fontSize:15,fontWeight:800,padding:"14px 2px 4px",marginTop:8,borderTop:"1px solid var(--border-2)"}},
      el("span",null,"Solde total"),
      el("span",{style:{color:total>=0?pot.color:"#C8516C"}},fmt(total))));
}

function WithdrawModal({pot,onClose,onSave}){
  const [amount,setAmount]=useState("");
  const [note,setNote]=useState("");
  const submit=function(){var a=parseFloat(amount);if(!a||a<=0)return;onSave(a,note.trim());};
  return el(Modal,{title:"Retirer de « "+pot.potLabel+" »",onClose},
    el("div",{style:{background:"#C8516C12",borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:12.5,color:"var(--text-2)"}},
      "Solde actuel : ",el("strong",{style:{color:pot.color}},fmt(pot.balance))),
    el("div",{style:{marginBottom:14}},
      el("label",{style:S.fieldLabel},"Montant retiré (€)"),
      el("input",{type:"number",inputMode:"decimal",value:amount,autoFocus:true,placeholder:"0,00",style:S.input,
        onChange:function(e){setAmount(e.target.value);},onKeyDown:function(e){if(e.key==="Enter"&&note)submit(); else if(e.key==="Enter"){}}})),
    el("div",{style:{marginBottom:18}},
      el("label",{style:S.fieldLabel},"Motif (optionnel — ex : Réparation voiture, Week-end à Paris…)"),
      el("input",{value:note,placeholder:"Pourquoi ce retrait ?",style:S.input,onChange:function(e){setNote(e.target.value);},onKeyDown:function(e){if(e.key==="Enter")submit();}})),
    parseFloat(amount)>pot.balance && el("p",{style:{fontSize:12,color:"#C8516C",margin:"-8px 0 12px"}},"⚠︎ Le montant dépasse le solde disponible."),
    el("button",{style:{...S.saveBtn,background:"linear-gradient(135deg,#C8516C,#e05575)",boxShadow:"0 4px 14px #C8516C44"},onClick:submit},"Confirmer le retrait"));
}

function ConfirmModal({title,message,onClose,onConfirm}){
  return el(Modal,{title,onClose},
    el("p",{style:{fontSize:14,color:"var(--text-2)",marginBottom:20}},message),
    el("div",{style:{display:"flex",gap:10}},
      el("button",{style:{...S.saveBtn,background:"var(--surface-3)",color:"var(--text-2)",boxShadow:"none",flex:1},onClick:onClose},"Annuler"),
      el("button",{style:{...S.saveBtn,background:"linear-gradient(135deg,#C8516C,#e05575)",boxShadow:"0 4px 14px #C8516C44",flex:1},onClick:onConfirm},"Supprimer")));
}

function Modal({title,children,onClose}){
  return el("div",{style:S.overlay,onClick:onClose},
    el("div",{style:S.modal,onClick:e=>e.stopPropagation()},
      el("div",{style:S.grabber}),
      el("div",{style:S.modalHead},el("h2",{style:S.modalTitle},title),el("button",{style:S.iconBtn,onClick:onClose},el(Icon,{name:"x",size:18}))),
      children));
}

// ============================================================================
// ---- OUTILS : simulateurs patrimoniaux ----
// ============================================================================
const IR_BRACKETS = [
  {upTo:11294, rate:0},
  {upTo:28797, rate:0.11},
  {upTo:82341, rate:0.30},
  {upTo:177106, rate:0.41},
  {upTo:Infinity, rate:0.45},
];
function irParts(situation, enfants){
  var base = situation==="couple" ? 2 : 1;
  var e = enfants||0;
  var ep = 0;
  if(e>=1) ep += 0.5;
  if(e>=2) ep += 0.5;
  if(e>=3) ep += (e-2)*1;
  return base + ep;
}
function irTaxOnQuotient(q){
  var tax=0, prev=0, i;
  for(i=0;i<IR_BRACKETS.length;i++){
    var b=IR_BRACKETS[i];
    if(q>prev){ tax += (Math.min(q,b.upTo)-prev)*b.rate; prev=b.upTo; }
    else break;
  }
  return tax;
}
function irMarginalRate(q){
  var i, r=0;
  for(i=0;i<IR_BRACKETS.length;i++){ if(q>(i===0?0:IR_BRACKETS[i-1].upTo)) r=IR_BRACKETS[i].rate; }
  return r;
}

function loanMonthly(P, annualRate, n){
  if(n<=0) return 0;
  var r = annualRate/100/12;
  if(r===0) return P/n;
  return P*r/(1-Math.pow(1+r,-n));
}
function loanCapacity(monthlyMax, annualRate, n){
  if(n<=0) return 0;
  var r = annualRate/100/12;
  if(r===0) return monthlyMax*n;
  return monthlyMax*(1-Math.pow(1+r,-n))/r;
}

function loadPatrimoine(){ try{ var r=localStorage.getItem(PATRIMOINE_KEY); return r?JSON.parse(r):null; }catch(e){ return null; } }
function loadEcheances(){ try{ var r=localStorage.getItem(ECHEANCES_KEY); return r?JSON.parse(r):null; }catch(e){ return null; } }
function defaultEcheances(){
  var y=new Date().getFullYear();
  return [
    {id:uid(),label:"Solde impôt sur le revenu",date:y+"-09-25",montant:0,paid:false},
    {id:uid(),label:"Taxe foncière",date:y+"-10-15",montant:0,paid:false},
    {id:uid(),label:"Taxe d'habitation résidence secondaire",date:y+"-11-15",montant:0,paid:false},
  ];
}

var TOOL_LINE = {display:"flex",alignItems:"center",gap:9,padding:"5px 0"};

function ToolBack({onBack}){
  return el("button",{onClick:onBack,style:{display:"flex",alignItems:"center",gap:4,border:"none",background:"transparent",color:"#1D8BCE",fontSize:15,fontWeight:600,cursor:"pointer",padding:"4px 0",marginBottom:4}},
    el(Icon,{name:"chevron-left",size:18,color:"#1D8BCE"}),"Outils");
}
function bigNumber(value,color){
  return el("div",{style:{fontSize:30,fontWeight:800,letterSpacing:"-0.5px",color:color||"var(--text)"}},value);
}

// ---- Simulateur 1 : Impôt sur le revenu ----
function IRSimulator({onBack}){
  const [revenu,setRevenu]=useState("");
  const [situation,setSituation]=useState("couple");
  const [enfants,setEnfants]=useState(0);
  var R=parseFloat(revenu)||0;
  var parts=irParts(situation,enfants);
  var quotient=parts>0?R/parts:0;
  var impot=Math.max(0,irTaxOnQuotient(quotient)*parts);
  var tauxMoyen=R>0?(impot/R)*100:0;
  var tauxMarginal=irMarginalRate(quotient)*100;
  var netMensuel=(R-impot)/12;
  return el("div",{style:{display:"flex",flexDirection:"column",gap:14}},
    el(ToolBack,{onBack:onBack}),
    el("h2",{style:{margin:0,fontSize:20,fontWeight:800}},"Impôt sur le revenu"),
    el("div",{style:S.section},
      el("label",{style:S.fieldLabel},"Revenu net imposable annuel du foyer (€)"),
      el("input",{type:"number",inputMode:"decimal",style:S.input,value:revenu,placeholder:"ex : 60000",onChange:function(e){setRevenu(e.target.value);}}),
      el("label",{style:Object.assign({},S.fieldLabel,{marginTop:14})},"Situation"),
      el("div",{style:{display:"flex",background:"var(--surface-2)",borderRadius:10,padding:3,gap:2}},
        [["celibataire","Célibataire"],["couple","Couple"]].map(function(o){
          var on=situation===o[0];
          return el("button",{key:o[0],onClick:function(){setSituation(o[0]);},
            style:{flex:1,padding:"9px 0",borderRadius:8,border:"none",background:on?"var(--surface)":"transparent",color:on?"var(--text)":"var(--text-3)",fontWeight:on?700:500,fontSize:14,cursor:"pointer"}},o[1]);
        })),
      el("label",{style:Object.assign({},S.fieldLabel,{marginTop:14})},"Nombre d'enfants à charge"),
      el("div",{style:{display:"flex",alignItems:"center",gap:12}},
        el("button",{onClick:function(){setEnfants(Math.max(0,enfants-1));},style:S.navBtn},el(Icon,{name:"chevron-left",size:18})),
        el("span",{style:{fontSize:18,fontWeight:700,minWidth:30,textAlign:"center"}},enfants),
        el("button",{onClick:function(){setEnfants(enfants+1);},style:S.navBtn},el(Icon,{name:"chevron-right",size:18})),
        el("span",{style:{fontSize:13,color:"var(--text-3)",marginLeft:8}},parts+" part"+(parts>1?"s":"")))),
    el("div",{style:S.section},
      el("div",{style:S.fieldLabel},"Impôt total estimé"),
      bigNumber(fmt(impot),"#C8516C"),
      el("div",{style:{display:"flex",gap:12,marginTop:14,flexWrap:"wrap"}},
        el("div",{style:S.bilanStat},el("div",{style:S.bilanLabel},"Taux moyen"),el("div",{style:S.bilanVal},tauxMoyen.toFixed(1)+" %")),
        el("div",{style:S.bilanStat},el("div",{style:S.bilanLabel},"Taux marginal"),el("div",{style:S.bilanVal},tauxMarginal.toFixed(0)+" %")),
        el("div",{style:S.bilanStat},el("div",{style:S.bilanLabel},"Net après impôt / mois"),el("div",{style:Object.assign({},S.bilanVal,{color:"#19A979"})},fmt(netMensuel)))),
      el("p",{style:{fontSize:11.5,color:"var(--text-4)",marginTop:14,marginBottom:0}},"Estimation indicative, hors réductions/crédits d'impôt et plafonnement du quotient familial.")));
}

// ---- Simulateur 2 : Prêt ----
function LoanSimulator({onBack}){
  const [montant,setMontant]=useState("");
  const [taux,setTaux]=useState("3.5");
  const [duree,setDuree]=useState("20");
  const [unit,setUnit]=useState("ans");
  const [assurance,setAssurance]=useState("");
  const [showTable,setShowTable]=useState(false);
  const [revMens,setRevMens]=useState("");
  const [chargesCr,setChargesCr]=useState("");

  var P=parseFloat(montant)||0;
  var tx=parseFloat(taux)||0;
  var n=unit==="ans"?(parseFloat(duree)||0)*12:(parseFloat(duree)||0);
  n=Math.round(n);
  var M=loanMonthly(P,tx,n);
  var assPct=parseFloat(assurance)||0;
  var assMens=P*assPct/100/12;
  var totalPaid=M*n;
  var cout=totalPaid-P;
  var coutAssur=cout+assMens*n;

  // amortissement annuel
  var rows=[];
  if(P>0&&n>0&&M>0){
    var r=tx/100/12, solde=P, yIndex=0;
    var maxYears=Math.ceil(n/12);
    for(var y=0;y<maxYears&&y<12;y++){
      var capRemb=0, interets=0;
      for(var mo=0;mo<12&&yIndex<n;mo++){
        var iMois=solde*r;
        var capMois=M-iMois;
        solde-=capMois;
        interets+=iMois; capRemb+=capMois; yIndex++;
      }
      if(solde<0) solde=0;
      rows.push({an:y+1,cap:capRemb,int:interets,reste:solde});
    }
  }

  var revM=parseFloat(revMens)||0;
  var chM=parseFloat(chargesCr)||0;
  var mensMax=Math.max(0,revM*0.35-chM);
  var capEmpr=loanCapacity(mensMax,tx,n);

  return el("div",{style:{display:"flex",flexDirection:"column",gap:14}},
    el(ToolBack,{onBack:onBack}),
    el("h2",{style:{margin:0,fontSize:20,fontWeight:800}},"Simulateur de prêt"),
    el("div",{style:S.section},
      el("label",{style:S.fieldLabel},"Montant emprunté (€)"),
      el("input",{type:"number",inputMode:"decimal",style:S.input,value:montant,placeholder:"ex : 200000",onChange:function(e){setMontant(e.target.value);}}),
      el("label",{style:Object.assign({},S.fieldLabel,{marginTop:14})},"Taux annuel (%)"),
      el("input",{type:"number",inputMode:"decimal",style:S.input,value:taux,onChange:function(e){setTaux(e.target.value);}}),
      el("label",{style:Object.assign({},S.fieldLabel,{marginTop:14})},"Durée"),
      el("div",{style:{display:"flex",gap:10}},
        el("input",{type:"number",inputMode:"decimal",style:Object.assign({},S.input,{flex:1}),value:duree,onChange:function(e){setDuree(e.target.value);}}),
        el("div",{style:{display:"flex",background:"var(--surface-2)",borderRadius:10,padding:3,gap:2}},
          [["ans","ans"],["mois","mois"]].map(function(o){
            var on=unit===o[0];
            return el("button",{key:o[0],onClick:function(){setUnit(o[0]);},
              style:{padding:"9px 14px",borderRadius:8,border:"none",background:on?"var(--surface)":"transparent",color:on?"var(--text)":"var(--text-3)",fontWeight:on?700:500,fontSize:14,cursor:"pointer"}},o[1]);
          }))),
      el("label",{style:Object.assign({},S.fieldLabel,{marginTop:14})},"Assurance (% annuel du capital, optionnel)"),
      el("input",{type:"number",inputMode:"decimal",style:S.input,value:assurance,placeholder:"ex : 0.36",onChange:function(e){setAssurance(e.target.value);}})),
    el("div",{style:S.section},
      el("div",{style:S.fieldLabel},"Mensualité (hors assurance)"),
      bigNumber(fmt(M),"#1D8BCE"),
      assMens>0&&el("div",{style:{fontSize:13,color:"var(--text-2)",marginTop:4}},"+ "+fmt(assMens)+" d'assurance = "+fmt(M+assMens)+" / mois"),
      el("div",{style:{display:"flex",gap:12,marginTop:14,flexWrap:"wrap"}},
        el("div",{style:S.bilanStat},el("div",{style:S.bilanLabel},"Coût du crédit"),el("div",{style:Object.assign({},S.bilanVal,{color:"#E8743B"})},fmt(cout))),
        el("div",{style:S.bilanStat},el("div",{style:S.bilanLabel},"Total avec assurance"),el("div",{style:S.bilanVal},fmt(coutAssur)))),
      rows.length>0&&el("button",{onClick:function(){setShowTable(!showTable);},style:Object.assign({},S.smallBtn,{color:"#1D8BCE",background:"#1D8BCE14",marginTop:14})},showTable?"Masquer l'amortissement":"Voir l'amortissement"),
      showTable&&el("div",{style:{marginTop:12,overflowX:"auto"}},
        el("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:12.5}},
          el("thead",null,el("tr",null,
            ["Année","Capital","Intérêts","Restant dû"].map(function(h){return el("th",{key:h,style:{textAlign:h==="Année"?"left":"right",padding:"6px 4px",color:"var(--text-3)",fontWeight:700,borderBottom:"1px solid var(--border-2)"}},h);}))),
          el("tbody",null,rows.map(function(rw){
            return el("tr",{key:rw.an},
              el("td",{style:{padding:"6px 4px",fontWeight:600}},rw.an),
              el("td",{style:{padding:"6px 4px",textAlign:"right"}},fmt(rw.cap)),
              el("td",{style:{padding:"6px 4px",textAlign:"right",color:"#E8743B"}},fmt(rw.int)),
              el("td",{style:{padding:"6px 4px",textAlign:"right",color:"var(--text-3)"}},fmt(rw.reste)));
          }))))),
    el("div",{style:S.section},
      el("div",{style:S.sectionTitle},el(Icon,{name:"scale",size:16,color:"#19A979"})," Capacité d'emprunt"),
      el("label",{style:Object.assign({},S.fieldLabel,{marginTop:12})},"Revenus mensuels du foyer (€)"),
      el("input",{type:"number",inputMode:"decimal",style:S.input,value:revMens,placeholder:"ex : 4500",onChange:function(e){setRevMens(e.target.value);}}),
      el("label",{style:Object.assign({},S.fieldLabel,{marginTop:14})},"Charges crédits existantes (€/mois)"),
      el("input",{type:"number",inputMode:"decimal",style:S.input,value:chargesCr,placeholder:"0",onChange:function(e){setChargesCr(e.target.value);}}),
      el("div",{style:{display:"flex",gap:12,marginTop:14,flexWrap:"wrap"}},
        el("div",{style:S.bilanStat},el("div",{style:S.bilanLabel},"Mensualité max (35 %)"),el("div",{style:S.bilanVal},fmt(mensMax))),
        el("div",{style:S.bilanStat},el("div",{style:S.bilanLabel},"Capital empruntable"),el("div",{style:Object.assign({},S.bilanVal,{color:"#19A979"})},fmt(capEmpr)))),
      el("p",{style:{fontSize:11.5,color:"var(--text-4)",marginTop:12,marginBottom:0}},"Pour le taux et la durée saisis ci-dessus.")));
}

// ---- Simulateur 3 : Bilan patrimonial ----
function BilanSimulator({onBack}){
  const [actifs,setActifs]=useState(function(){ var d=loadPatrimoine(); return d&&d.actifs?d.actifs:[]; });
  const [passifs,setPassifs]=useState(function(){ var d=loadPatrimoine(); return d&&d.passifs?d.passifs:[]; });
  useEffect(function(){ try{ localStorage.setItem(PATRIMOINE_KEY,JSON.stringify({actifs:actifs,passifs:passifs})); }catch(e){} },[actifs,passifs]);

  var nowY=new Date().getFullYear();
  function actifValue(a){
    var v=a.valeur||0;
    if(a.type==="voiture"&&a.decote>0&&a.annee){
      var years=Math.max(0,nowY-a.annee);
      v=v*Math.pow(1-a.decote/100,years);
    }
    return v;
  }
  var totalActifs=actifs.reduce(function(s,a){return s+actifValue(a);},0);
  var totalPassifs=passifs.reduce(function(s,p){return s+(p.montant||0);},0);
  var net=totalActifs-totalPassifs;

  var byType={};
  actifs.forEach(function(a){ var t=a.type||"autre"; byType[t]=(byType[t]||0)+actifValue(a); });

  function updA(id,upd){ setActifs(actifs.map(function(a){return a.id===id?Object.assign({},a,upd):a;})); }
  function updP(id,upd){ setPassifs(passifs.map(function(p){return p.id===id?Object.assign({},p,upd):p;})); }

  return el("div",{style:{display:"flex",flexDirection:"column",gap:14}},
    el(ToolBack,{onBack:onBack}),
    el("h2",{style:{margin:0,fontSize:20,fontWeight:800}},"Bilan patrimonial net"),
    el("div",{style:{background:"linear-gradient(135deg,#1D8BCE,#19A979)",borderRadius:18,padding:"18px 20px",color:"#fff"}},
      el("div",{style:{fontSize:13,fontWeight:600,opacity:.95}},"Patrimoine net"),
      el("div",{style:{fontSize:34,fontWeight:800,letterSpacing:"-1px",marginTop:2}},fmt(net)),
      el("div",{style:{display:"flex",gap:12,marginTop:12}},
        el("div",{style:S.patStat},el("div",{style:S.patStatLabel},"Actifs"),el("div",{style:S.patStatVal},fmt(totalActifs))),
        el("div",{style:S.patStat},el("div",{style:S.patStatLabel},"Passifs"),el("div",{style:S.patStatVal},fmt(totalPassifs))))),
    Object.keys(byType).length>0&&el("div",{style:S.section},
      el("div",{style:S.sectionTitle},"Répartition des actifs"),
      el("div",{style:{display:"flex",flexDirection:"column",gap:10,marginTop:12}},
        Object.keys(byType).map(function(t){
          var pt=POT_TYPES[t]||{label:t,color:"#6C8893"};
          var val=byType[t];
          var pct=totalActifs>0?(val/totalActifs)*100:0;
          return el("div",{key:t},
            el("div",{style:{display:"flex",justifyContent:"space-between",fontSize:12.5,marginBottom:4}},
              el("span",{style:{color:"var(--text-2)",fontWeight:600}},pt.label),
              el("span",{style:{color:"var(--text-3)"}},fmt(val)+" · "+pct.toFixed(0)+"%")),
            el("div",{style:S.potBarTrack},el("div",{style:Object.assign({},S.potBarFill,{width:pct+"%",background:pt.color})})));
        }))),
    el("div",{style:S.section},
      el("div",{style:S.sectionHead},
        el("span",{style:S.sectionTitle},el(Icon,{name:"coins",size:16,color:"#19A979"})," Actifs"),
        el("button",{style:Object.assign({},S.smallBtn,{color:"#19A979",background:"#19A97914"}),onClick:function(){setActifs(actifs.concat([{id:uid(),label:"",type:"livret",valeur:0}]));}},el(Icon,{name:"plus",size:14,color:"#19A979"})," Actif")),
      actifs.length===0&&el("p",{style:S.blockHint},"Ajoute tes actifs (livrets, PEA, immobilier, voiture…)."),
      actifs.map(function(a){
        return el("div",{key:a.id,style:{padding:"8px 0",borderBottom:"1px solid var(--border-2)"}},
          el("div",{style:TOOL_LINE},
            el("input",{style:S.lineLabelInput,value:a.label,placeholder:"Libellé",onChange:function(e){updA(a.id,{label:e.target.value});}}),
            el("div",{style:Object.assign({},S.lineAmtWrap,{width:110})},
              el("input",{type:"number",inputMode:"decimal",style:S.lineAmtInput,value:a.valeur||"",placeholder:"0",onChange:function(e){updA(a.id,{valeur:parseFloat(e.target.value)||0});}}),
              el("span",{style:S.eur},"€")),
            el("button",{style:S.lineDel,onClick:function(){setActifs(actifs.filter(function(x){return x.id!==a.id;}));}},el(Icon,{name:"trash-2",size:15}))),
          el("div",{style:{display:"flex",gap:8,alignItems:"center",marginTop:4,flexWrap:"wrap"}},
            el("select",{value:a.type,onChange:function(e){updA(a.id,{type:e.target.value});},style:{fontSize:12.5,padding:"5px 8px",borderRadius:8,border:"1px solid var(--border)",background:"var(--field-bg)",color:"var(--text)"}},
              ["livret","pea","av","immo","voiture","courant","autre"].map(function(tk){return el("option",{key:tk,value:tk},(POT_TYPES[tk]&&POT_TYPES[tk].badge)||(tk==="voiture"?"Voiture":tk));})),
            a.type==="voiture"&&el(React.Fragment,null,
              el("input",{type:"number",inputMode:"decimal",placeholder:"décote %/an",value:a.decote||"",onChange:function(e){updA(a.id,{decote:parseFloat(e.target.value)||0});},style:{width:90,fontSize:12,padding:"5px 8px",borderRadius:8,border:"1px solid var(--border)",background:"var(--field-bg)",color:"var(--text)"}}),
              el("input",{type:"number",inputMode:"numeric",placeholder:"année achat",value:a.annee||"",onChange:function(e){updA(a.id,{annee:parseInt(e.target.value)||0});},style:{width:90,fontSize:12,padding:"5px 8px",borderRadius:8,border:"1px solid var(--border)",background:"var(--field-bg)",color:"var(--text)"}}),
              (a.decote>0&&a.annee)&&el("span",{style:{fontSize:11.5,color:"var(--text-3)"}},"≈ "+fmt(actifValue(a))))));
      })),
    el("div",{style:S.section},
      el("div",{style:S.sectionHead},
        el("span",{style:S.sectionTitle},el(Icon,{name:"file-text",size:16,color:"#C8516C"})," Passifs"),
        el("button",{style:Object.assign({},S.smallBtn,{color:"#C8516C",background:"#C8516C14"}),onClick:function(){setPassifs(passifs.concat([{id:uid(),label:"",montant:0}]));}},el(Icon,{name:"plus",size:14,color:"#C8516C"})," Passif")),
      passifs.length===0&&el("p",{style:S.blockHint},"Ajoute tes dettes (crédit immo, prêt auto…)."),
      passifs.map(function(p){
        return el("div",{key:p.id,style:TOOL_LINE},
          el("input",{style:S.lineLabelInput,value:p.label,placeholder:"Libellé",onChange:function(e){updP(p.id,{label:e.target.value});}}),
          el("div",{style:Object.assign({},S.lineAmtWrap,{width:110})},
            el("input",{type:"number",inputMode:"decimal",style:S.lineAmtInput,value:p.montant||"",placeholder:"0",onChange:function(e){updP(p.id,{montant:parseFloat(e.target.value)||0});}}),
            el("span",{style:S.eur},"€")),
          el("button",{style:S.lineDel,onClick:function(){setPassifs(passifs.filter(function(x){return x.id!==p.id;}));}},el(Icon,{name:"trash-2",size:15})));
      })));
}

// ---- Simulateur 4 : Échéancier fiscal ----
function EcheancierSimulator({onBack}){
  const [list,setList]=useState(function(){ var d=loadEcheances(); return d&&d.length?d:defaultEcheances(); });
  useEffect(function(){ try{ localStorage.setItem(ECHEANCES_KEY,JSON.stringify(list)); }catch(e){} },[list]);

  var today=new Date(); today.setHours(0,0,0,0);
  var y=today.getFullYear();
  function upd(id,u){ setList(list.map(function(e){return e.id===id?Object.assign({},e,u):e;})); }
  var sorted=list.slice().sort(function(a,b){return (a.date||"").localeCompare(b.date||"");});
  var totalAvenir=list.reduce(function(s,e){
    if(e.paid) return s;
    var d=e.date?new Date(e.date):null;
    if(d&&d.getFullYear()===y) return s+(e.montant||0);
    return s;
  },0);
  function badge(e){
    if(e.paid) return {txt:"Payé",bg:"#19A97918",col:"#19A979"};
    if(!e.date) return null;
    var d=new Date(e.date); d.setHours(0,0,0,0);
    var diff=Math.round((d-today)/86400000);
    if(diff<0) return {txt:"En retard",bg:"#C8516C18",col:"#C8516C"};
    if(diff===0) return {txt:"Aujourd'hui",bg:"#E8743B18",col:"#E8743B"};
    return {txt:"dans "+diff+" j",bg:"#1D8BCE14",col:"#1D8BCE"};
  }
  function fmtDate(s){ if(!s) return ""; var p=s.split("-"); if(p.length!==3) return s; return p[2]+" "+MONTHS_FR[parseInt(p[1])-1]+" "+p[0]; }

  return el("div",{style:{display:"flex",flexDirection:"column",gap:14}},
    el(ToolBack,{onBack:onBack}),
    el("h2",{style:{margin:0,fontSize:20,fontWeight:800}},"Échéancier fiscal"),
    el("div",{style:S.section},
      el("div",{style:S.fieldLabel},"Total à venir cette année"),
      bigNumber(fmt(totalAvenir),"#E8743B")),
    el("div",{style:S.section},
      el("div",{style:S.sectionHead},
        el("span",{style:S.sectionTitle},el(Icon,{name:"calendar",size:16,color:"#1D8BCE"})," Échéances"),
        el("button",{style:Object.assign({},S.smallBtn,{color:"#1D8BCE",background:"#1D8BCE14"}),onClick:function(){setList(list.concat([{id:uid(),label:"",date:y+"-12-15",montant:0,paid:false}]));}},el(Icon,{name:"plus",size:14,color:"#1D8BCE"})," Échéance")),
      sorted.map(function(e){
        var b=badge(e);
        return el("div",{key:e.id,style:{padding:"10px 0",borderBottom:"1px solid var(--border-2)"}},
          el("div",{style:{display:"flex",alignItems:"center",gap:9}},
            el("input",{style:Object.assign({},S.lineLabelInput,e.paid?{textDecoration:"line-through",color:"var(--text-3)"}:{}),value:e.label,placeholder:"Libellé",onChange:function(ev){upd(e.id,{label:ev.target.value});}}),
            b&&el("span",{style:{fontSize:11,fontWeight:700,background:b.bg,color:b.col,borderRadius:8,padding:"3px 8px",whiteSpace:"nowrap"}},b.txt),
            el("button",{style:S.lineDel,onClick:function(){setList(list.filter(function(x){return x.id!==e.id;}));}},el(Icon,{name:"trash-2",size:15}))),
          el("div",{style:{display:"flex",gap:8,alignItems:"center",marginTop:6,flexWrap:"wrap"}},
            el("input",{type:"date",value:e.date||"",onChange:function(ev){upd(e.id,{date:ev.target.value});},style:{fontSize:12.5,padding:"6px 8px",borderRadius:8,border:"1px solid var(--border)",background:"var(--field-bg)",color:"var(--text)"}}),
            el("div",{style:Object.assign({},S.lineAmtWrap,{width:100})},
              el("input",{type:"number",inputMode:"decimal",style:S.lineAmtInput,value:e.montant||"",placeholder:"0",onChange:function(ev){upd(e.id,{montant:parseFloat(ev.target.value)||0});}}),
              el("span",{style:S.eur},"€")),
            el("button",{onClick:function(){upd(e.id,{paid:!e.paid});},style:{display:"flex",alignItems:"center",gap:5,fontSize:12.5,fontWeight:600,padding:"6px 10px",borderRadius:8,border:"none",cursor:"pointer",background:e.paid?"#19A97918":"var(--surface-2)",color:e.paid?"#19A979":"var(--text-2)"}},
              el(Icon,{name:"check",size:14,color:e.paid?"#19A979":"var(--text-3)"}),e.paid?"Payé":"Marquer payé")),
          el("div",{style:{fontSize:11.5,color:"var(--text-3)",marginTop:4}},fmtDate(e.date)));
      })));
}

// ---- Menu Outils ----
function OutilsScreen(){
  const [view,setView]=useState("menu");
  var back=function(){setView("menu");};
  if(view==="ir") return el(IRSimulator,{onBack:back});
  if(view==="pret") return el(LoanSimulator,{onBack:back});
  if(view==="bilan") return el(BilanSimulator,{onBack:back});
  if(view==="echeancier") return el(EcheancierSimulator,{onBack:back});
  var cards=[
    {id:"ir",icon:"percent",color:"#C8516C",title:"Impôt sur le revenu",sub:"Estime ton impôt 2025 (revenus 2024)"},
    {id:"pret",icon:"car",color:"#1D8BCE",title:"Simulateur de prêt",sub:"Mensualité, coût, capacité d'emprunt"},
    {id:"bilan",icon:"scale",color:"#19A979",title:"Bilan patrimonial net",sub:"Actifs − passifs = patrimoine net"},
    {id:"echeancier",icon:"calendar",color:"#E8743B",title:"Échéancier fiscal",sub:"Suivi des échéances de l'année"},
  ];
  return el("div",{style:{display:"flex",flexDirection:"column",gap:14}},
    el("h2",{style:{margin:0,fontSize:20,fontWeight:800}},"Outils"),
    el("p",{style:{margin:"-6px 0 4px",fontSize:13,color:"var(--text-3)"}},"Simulateurs patrimoniaux"),
    el("div",{style:{display:"flex",flexDirection:"column",gap:12}},
      cards.map(function(c){
        return el("button",{key:c.id,onClick:function(){setView(c.id);},
          style:{display:"flex",alignItems:"center",gap:14,textAlign:"left",background:"var(--surface)",borderRadius:18,padding:16,border:"none",boxShadow:"var(--shadow-card)",cursor:"pointer"}},
          el("div",{style:{width:46,height:46,borderRadius:13,background:c.color+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},el(Icon,{name:c.icon,size:22,color:c.color})),
          el("div",{style:{flex:1,minWidth:0}},
            el("div",{style:{fontSize:15.5,fontWeight:700,color:"var(--text)"}},c.title),
            el("div",{style:{fontSize:12.5,color:"var(--text-3)",marginTop:2}},c.sub)),
          el(Icon,{name:"chevron-right",size:18,color:"var(--text-3)"}));
      })));
}

// ----------------------------------------------------------------------------
const S = {
  app:{minHeight:"100vh",display:"flex",flexDirection:"column",gap:14,padding:"calc(16px + env(safe-area-inset-top)) 16px calc(96px + env(safe-area-inset-bottom))",maxWidth:560,margin:"0 auto",color:"var(--text)",background:"linear-gradient(180deg,var(--bg-top),var(--bg-bottom))"},
  header:{display:"flex",alignItems:"center",justifyContent:"space-between"},
  logo:{width:42,height:42,borderRadius:13,background:"linear-gradient(135deg,#1D8BCE,#19A979)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(29,139,206,.35)"},
  title:{margin:0,fontSize:26,fontWeight:800,letterSpacing:"-0.6px"},
  subtitle:{margin:0,fontSize:12,color:"var(--text-3)"},
  iconBtn:{width:38,height:38,borderRadius:10,border:"none",background:"var(--surface)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"var(--text-2)",boxShadow:"var(--shadow)"},
  tabBar:{position:"fixed",left:0,right:0,bottom:0,zIndex:90,display:"flex",justifyContent:"space-around",background:"var(--tabbar-bg)",WebkitBackdropFilter:"blur(20px)",backdropFilter:"blur(20px)",borderTop:"0.5px solid var(--tabbar-border)",padding:"8px 8px calc(8px + env(safe-area-inset-bottom))"},
  tabBtn:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,border:"none",background:"transparent",cursor:"pointer",padding:"4px 0",color:"var(--text-3)",maxWidth:120},
  tabActive:{color:"#1D8BCE"},
  monthNav:{display:"flex",alignItems:"center",justifyContent:"center",gap:18,background:"var(--surface)",borderRadius:14,padding:8,boxShadow:"var(--shadow)"},
  navBtn:{width:34,height:34,borderRadius:9,border:"none",background:"var(--surface-3)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-2)"},
  monthLabel:{fontWeight:700,fontSize:15,minWidth:150,textAlign:"center"},
  flowCard:{background:"var(--surface)",borderRadius:20,padding:18,boxShadow:"var(--shadow-card)"},
  flowRow:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0"},
  flowLabel:{display:"flex",alignItems:"center",gap:8,fontSize:14,color:"var(--text-2)",fontWeight:500},
  flowVal:{fontSize:16,fontWeight:700},
  flowDivider:{height:1,background:"var(--border-2)",margin:"10px 0 14px"},
  resteBox:{borderRadius:16,padding:"16px 18px",color:"#fff",animation:"pop .3s ease"},
  resteLabel:{display:"flex",alignItems:"center",gap:7,fontSize:13,fontWeight:600,opacity:.95},
  resteVal:{fontSize:32,fontWeight:800,marginTop:3,letterSpacing:"-1px"},
  resteFoot:{fontSize:12,marginTop:5,opacity:.92},
  allocateBtn:{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",marginTop:12,padding:"10px",borderRadius:11,border:"none",background:"rgba(255,255,255,.22)",color:"#fff",fontSize:13.5,fontWeight:700,cursor:"pointer"},
  actionRow:{display:"flex",gap:10},
  copyBtn:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,border:"none",background:"var(--surface)",color:"var(--text-2)",fontSize:13,fontWeight:600,cursor:"pointer",padding:"10px",borderRadius:12,boxShadow:"var(--shadow)"},
  resetBtn:{border:"none",background:"transparent",color:"var(--text-4)",fontSize:13,fontWeight:600,cursor:"pointer",padding:"10px 14px"},
  section:{background:"var(--surface)",borderRadius:18,padding:16,boxShadow:"var(--shadow-card)"},
  sectionHead:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10},
  sectionTitle:{display:"flex",alignItems:"center",gap:8,fontSize:14,fontWeight:700},
  badge:{fontSize:13,fontWeight:800,padding:"4px 11px",borderRadius:20},
  blockHint:{fontSize:12.5,color:"var(--text-4)",margin:"0 0 8px"},
  lineList:{display:"flex",flexDirection:"column"},
  lineRow:{display:"flex",alignItems:"center",gap:9,padding:"5px 0"},
  lineDot:{width:8,height:8,borderRadius:"50%",flexShrink:0},
  lineLabelInput:{flex:1,minWidth:0,border:"none",background:"transparent",fontSize:14,fontWeight:500,color:"var(--text)",outline:"none",padding:"6px 2px"},
  lineAmtWrap:{display:"flex",alignItems:"center",background:"var(--field-bg)",borderRadius:9,border:"1.5px solid var(--border)",padding:"0 9px",width:104,transition:"border-color .2s"},
  lineAmtInput:{width:"100%",border:"none",outline:"none",padding:"8px 0",fontSize:15,fontWeight:700,textAlign:"right",background:"transparent",color:"var(--text)"},
  eur:{fontSize:13,color:"var(--text-3)",marginLeft:3},
  lineDel:{border:"none",background:"transparent",color:"var(--del)",cursor:"pointer",padding:3,display:"flex",flexShrink:0},
  addLineRow:{display:"flex",alignItems:"center",gap:8,marginTop:6,paddingTop:10,borderTop:"1px dashed var(--border-2)"},
  addLineInput:{flex:1,border:"none",background:"transparent",fontSize:13.5,color:"var(--text-2)",outline:"none",padding:"6px 0"},
  addLineBtn:{border:"none",background:"transparent",fontSize:13,fontWeight:700,cursor:"pointer"},
  potList:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:12},
  potCard:{background:"var(--surface-2)",borderRadius:16,padding:14},
  potTop:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6},
  potBalRow:{display:"flex",alignItems:"baseline",gap:6},
  potGoalTxt:{fontSize:13,color:"var(--text-3)",fontWeight:500},
  potBarTrack:{height:7,background:"var(--track)",borderRadius:5,overflow:"hidden",marginTop:10},
  potBarFill:{height:"100%",borderRadius:5,transition:"width .4s ease"},
  potFoot:{display:"flex",justifyContent:"space-between",fontSize:12,marginTop:6},
  potMonthTag:{fontSize:11.5,color:"#19A979",fontWeight:600,marginTop:8},
  patStat:{flex:1,background:"rgba(255,255,255,.18)",borderRadius:11,padding:"9px 12px"},
  patStatLabel:{fontSize:10.5,opacity:.9,marginBottom:2},
  patStatVal:{fontSize:14,fontWeight:800},
  bilanStat:{flex:1,minWidth:120,background:"var(--surface-2)",borderRadius:12,padding:"10px 12px"},
  bilanLabel:{fontSize:11,color:"var(--text-3)",marginBottom:2},
  bilanVal:{fontSize:18,fontWeight:800},
  projCard:{background:"var(--surface-2)",borderRadius:18,padding:16,border:"1.5px solid var(--border)"},
  projStats:{display:"flex",gap:12,marginTop:12,flexWrap:"wrap"},
  projStat:{display:"flex",flexDirection:"column",gap:2,background:"var(--surface)",borderRadius:10,padding:"8px 12px",flex:1},
  depositBtn:{display:"flex",alignItems:"center",justifyContent:"center",gap:5,width:"100%",marginTop:10,padding:"9px",borderRadius:11,border:"1.5px solid",background:"var(--surface)",fontSize:13,fontWeight:600,cursor:"pointer"},
  depHead:{fontSize:12,fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:6},
  itemRow:{display:"flex",alignItems:"center",gap:11,padding:"10px 4px",borderBottom:"1px solid var(--border-2)"},
  itemDot:{width:9,height:9,borderRadius:"50%",flexShrink:0},
  lineLabel:{flex:1,fontSize:14,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},
  itemAmount:{fontSize:14.5,fontWeight:700,whiteSpace:"nowrap"},
  delBtn:{border:"none",background:"transparent",color:"var(--del)",cursor:"pointer",padding:4,display:"flex"},
  overlay:{position:"fixed",inset:0,background:"var(--overlay)",WebkitBackdropFilter:"blur(3px)",backdropFilter:"blur(3px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100,animation:"fadeIn .2s ease"},
  modal:{background:"var(--surface)",borderRadius:"24px 24px 0 0",padding:"12px 22px calc(22px + env(safe-area-inset-bottom))",width:"100%",maxWidth:480,maxHeight:"92vh",overflowY:"auto",animation:"slideUp .3s cubic-bezier(.22,.61,.36,1)"},
  grabber:{width:38,height:5,borderRadius:3,background:"var(--border-3)",margin:"0 auto 14px"},
  modalHead:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18},
  modalTitle:{margin:0,fontSize:18,fontWeight:800},
  fieldLabel:{display:"block",fontSize:12.5,fontWeight:600,color:"var(--text-2)",marginBottom:6},
  input:{width:"100%",padding:"11px 13px",borderRadius:11,border:"1.5px solid var(--border-3)",fontSize:15,outline:"none",background:"var(--field-bg)",boxSizing:"border-box",color:"var(--text)"},
  suggestBtn:{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",padding:"10px",borderRadius:11,border:"1.5px dashed var(--border-3)",background:"var(--surface-2)",color:"var(--text-2)",fontSize:13,fontWeight:600,cursor:"pointer"},
  saveBtn:{width:"100%",padding:14,borderRadius:13,border:"none",background:"linear-gradient(135deg,#1D8BCE,#19A979)",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 14px rgba(29,139,206,.35)"},
  smallBtn:{display:"flex",alignItems:"center",gap:4,border:"none",borderRadius:9,padding:"6px 12px",fontSize:13,fontWeight:600,cursor:"pointer"},
};

ReactDOM.createRoot(document.getElementById("root")).render(el(App));
