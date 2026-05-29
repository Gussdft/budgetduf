const { useState, useEffect, useRef } = React;
const el = React.createElement;

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
const THEME_KEY = "budget-foyer-theme";
const THEME_ORDER = ["auto","clair","sombre"];
const THEME_ATTR = {auto:"auto",clair:"light",sombre:"dark"};
const THEME_ICON = {auto:"contrast",clair:"sun",sombre:"moon"};

function loadData(){ try{ const r=localStorage.getItem(STORAGE_KEY); return r?JSON.parse(r):null; }catch(e){return null;} }
function saveData(d){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }catch(e){console.error(e);} }
function loadTheme(){ try{ return localStorage.getItem(THEME_KEY)||"auto"; }catch(e){ return "auto"; } }

const blankMonth = () => ({
  revenus: PRESET.revenus.map(l=>({id:uid(),label:l,amount:0})),
  fixed:   PRESET.fixed.map(l=>({id:uid(),label:l,amount:0})),
  variable:PRESET.variable.map(l=>({id:uid(),label:l,amount:0})),
  excep:   PRESET.excep.map(l=>({id:uid(),label:l,amount:0})),
  deposits:[],
});

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

  useEffect(()=>{ const d=loadData(); if(d){ setMonths(d.months||{}); setPots(d.pots||[]); setProjects(d.projects||[]); } setLoaded(true); },[]);
  useEffect(()=>{ if(loaded) saveData({months,pots,projects}); },[months,pots,projects,loaded]);
  useEffect(()=>{ document.documentElement.setAttribute("data-theme",THEME_ATTR[theme]||"auto"); try{ localStorage.setItem(THEME_KEY,theme); }catch(e){} },[theme]);
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
  const projectBalance=(proj)=>(proj.initialAmount||0)+(proj.linkedPotIds||[]).reduce(function(s,id){return s+potBalance(id);},0);

  const changeMonth=(d)=>{let m=month+d,y=year;if(m<0){m=11;y--;}else if(m>11){m=0;y++;}setMonth(m);setYear(y);};
  const setAmount=(k,id,a)=>setMonthData(c=>({...c,[k]:c[k].map(x=>x.id===id?{...x,amount:a}:x)}));
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
  const addDeposits=(entries)=>setMonthData(function(c){var add=entries.filter(function(e){return e.amount>0;}).map(function(e){return {id:uid(),potId:e.potId,amount:e.amount};});return Object.assign({},c,{deposits:[...(c.deposits||[]),...add]});});
  const delDeposit=(id)=>setMonthData(c=>({...c,deposits:c.deposits.filter(d=>d.id!==id)}));
  const potHistory=function(id){var out=[];Object.keys(months).sort().forEach(function(k){var t=(months[k].deposits||[]).filter(function(d){return d.potId===id;}).reduce(function(a,d){return a+d.amount;},0);if(t!==0)out.push({key:k,total:t});});return out;};
  const copyPrev=()=>{const d=new Date(year,month-1,1);const pk=monthKey(d.getFullYear(),d.getMonth());const prev=months[pk];if(!prev)return;
    setMonthData(()=>({revenus:prev.revenus.map(x=>({...x,id:uid()})),fixed:prev.fixed.map(x=>({...x,id:uid()})),variable:prev.variable.map(x=>({...x,id:uid()})),excep:prev.excep.map(x=>({...x,id:uid(),amount:0})),deposits:[]}));};
  const resetMonth=()=>setMonthData(()=>blankMonth());

  const exportJSON=()=>{const blob=new Blob([JSON.stringify({months,pots},null,2)],{type:"application/json"});const u=URL.createObjectURL(blob);const a=document.createElement("a");a.href=u;a.download=`budget-${mk}.json`;a.click();URL.revokeObjectURL(u);};
  const importJSON=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(d.months)setMonths(d.months);if(d.pots)setPots(d.pots);if(d.projects)setProjects(d.projects);}catch(err){alert("Fichier invalide");}};r.readAsText(f);};

  if(!loaded) return el("div",{style:{...S.app,alignItems:"center",justifyContent:"center",color:"var(--text-3)"}},"Chargement…");
  const restColor = nonAffecte>0?"#19A979":nonAffecte<0?"#C8516C":"#6C8893";

  return el("div",{style:S.app},
    // header
    el("header",{style:S.header},
      el("div",{style:{display:"flex",alignItems:"center",gap:12}},
        el("div",{style:S.logo},el(Icon,{name:"piggy-bank",size:22,color:"#fff"})),
        el("div",null,
          el("h1",{style:S.title},"Budget du foyer"),
          el("p",{style:S.subtitle},"Revenus − dépenses → épargne"))),
      el("div",{style:{display:"flex",gap:8}},
        el("button",{style:S.iconBtn,onClick:cycleTheme,title:"Thème : "+theme},el(Icon,{name:THEME_ICON[theme],size:18})),
        el("button",{style:S.iconBtn,onClick:exportJSON,title:"Exporter"},el(Icon,{name:"download",size:18})),
        el("label",{style:{...S.iconBtn,cursor:"pointer"},title:"Importer"},
          el(Icon,{name:"upload",size:18}),
          el("input",{type:"file",accept:"application/json",onChange:importJSON,style:{display:"none"}})))),

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
        onAmount:(id,v)=>setAmount(kind,id,v),onDel:id=>delLine(kind,id),onRename:(id,l)=>renameLine(kind,id,l),onAdd:l=>addLine(kind,l)}))),

    // ---- TAB ÉPARGNE ----
    tab==="epargne" && el(React.Fragment,null,
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
          return el("div",{key:p.id,style:S.potCard},
            el("div",{style:S.potTop},
              el("span",{style:{display:"flex",alignItems:"center",gap:9}},el(Icon,{name:"piggy-bank",size:16,color:p.color}),el("strong",{style:{fontSize:14}},p.label)),
              el("div",{style:{display:"flex",gap:4}},
                el("button",{style:S.delBtn,title:"Historique",onClick:function(){setModal({kind:"history",pot:p});}},el(Icon,{name:"clock",size:13})),
                el("button",{style:S.delBtn,title:"Modifier",onClick:function(){setModal({kind:"editpot",pot:p});}},el(Icon,{name:"edit-2",size:13})),
                el("button",{style:{...S.delBtn,color:"#C8516C"},title:"Supprimer",onClick:function(){setModal({kind:"confirmdel",potId:p.id,potLabel:p.label});}},el(Icon,{name:"trash-2",size:13})))),
            el("div",{style:S.potBalRow},el("span",{style:{fontSize:21,fontWeight:800,color:p.color,letterSpacing:"-0.5px"}},fmt(bal)),p.goal>0&&el("span",{style:S.potGoalTxt},"/ "+fmt(p.goal))),
            p.startBalance>0 && el("div",{style:{fontSize:11,color:"var(--text-4)",marginTop:2}},"dont "+fmt(p.startBalance)+" de départ"),
            pct!==null && el(React.Fragment,null,
              el("div",{style:S.potBarTrack},el("div",{style:{...S.potBarFill,width:pct+"%",background:p.color}})),
              el("div",{style:S.potFoot},el("span",{style:{color:p.color,fontWeight:600}},pct.toFixed(0)+"%"),el("span",{style:{color:"var(--text-3)"}},bal>=p.goal?"Atteint 🎉":"reste "+fmt(p.goal-bal)))),
            thisMonth>0 && el("div",{style:S.potMonthTag},"+ "+fmt(thisMonth)+" ce mois"),
            el("button",{style:{...S.depositBtn,color:p.color,borderColor:p.color+"40"},onClick:function(){setModal({kind:"deposit",potId:p.id,potLabel:p.label,color:p.color});}},el(Icon,{name:"plus",size:14,color:p.color})," Verser ce mois"));
        })),
        (data.deposits||[]).length>0 && el("div",{style:{marginTop:14}},
          el("div",{style:S.depHead},"Versements de "+MONTHS_FR[month]),
          data.deposits.map(function(d){var p=pots.find(function(x){return x.id===d.potId;});return el("div",{key:d.id,style:S.itemRow},
            el("span",{style:{...S.itemDot,background:(p&&p.color)||"var(--border-3)"}}),
            el("span",{style:S.lineLabel},(p&&p.label)||"Supprimée"),
            el("span",{style:{...S.itemAmount,color:(p&&p.color)||"var(--text-3)"}},fmt(d.amount)),
            el("button",{style:S.delBtn,onClick:function(){delDeposit(d.id);}},el(Icon,{name:"trash-2",size:13})));}))),

      // Projets
      el("div",{style:S.section},
        el("div",{style:S.sectionHead},
          el("span",{style:S.sectionTitle},el("span",{style:{color:"#945ECF",display:"flex"}},el(Icon,{name:"target",size:16,color:"#945ECF"}))," Projets"),
          el("button",{style:{...S.smallBtn,color:"#945ECF",background:"#945ECF14"},onClick:()=>setModal({kind:"newproject"})},el(Icon,{name:"plus",size:14,color:"#945ECF"})," Projet")),
        projects.length===0 && el("p",{style:S.blockHint},"Crée un projet (ex : Apport maison) avec un objectif et des cagnottes rattachées."),
        el("div",{style:{display:"flex",flexDirection:"column",gap:12}}, projects.map(function(proj){
          var bal=projectBalance(proj);
          var goal=proj.goal||0;
          var pct=goal>0?Math.min(100,(bal/goal)*100):null;
          var avg=avgMonthlySavings();
          var remaining=goal-bal;
          var estMonths=avg>0&&remaining>0?Math.ceil(remaining/avg):null;
          var estDate=estMonths?new Date(now.getFullYear(),now.getMonth()+estMonths,1):null;
          var reqMonthly=null;
          if(proj.targetDate&&remaining>0){
            var td=new Date(proj.targetDate);
            var mLeft=(td.getFullYear()-now.getFullYear())*12+(td.getMonth()-now.getMonth());
            if(mLeft>0) reqMonthly=Math.ceil(remaining/mLeft);
          }
          return el("div",{key:proj.id,style:S.projCard},
            el("div",{style:S.potTop},
              el("span",{style:{display:"flex",alignItems:"center",gap:9}},
                el("span",{style:{width:12,height:12,borderRadius:3,background:proj.color||"#945ECF",flexShrink:0}}),
                el("strong",{style:{fontSize:15}},proj.label)),
              el("div",{style:{display:"flex",gap:4}},
                el("button",{style:S.delBtn,title:"Modifier",onClick:function(){setModal({kind:"editproject",proj:proj});}},el(Icon,{name:"edit-2",size:13})),
                el("button",{style:{...S.delBtn,color:"#C8516C"},title:"Supprimer",onClick:function(){setModal({kind:"confirmdelproj",projId:proj.id,projLabel:proj.label});}},el(Icon,{name:"trash-2",size:13})))),
            el("div",{style:S.potBalRow},
              el("span",{style:{fontSize:24,fontWeight:800,color:proj.color||"#945ECF",letterSpacing:"-0.5px"}},fmt(bal)),
              goal>0&&el("span",{style:S.potGoalTxt},"/ "+fmt(goal))),
            pct!==null && el(React.Fragment,null,
              el("div",{style:S.potBarTrack},el("div",{style:{...S.potBarFill,width:pct+"%",background:proj.color||"#945ECF"}})),
              el("div",{style:S.potFoot},
                el("span",{style:{color:proj.color||"#945ECF",fontWeight:600}},pct.toFixed(0)+"%"),
                el("span",{style:{color:"var(--text-3)"}},bal>=goal?"Objectif atteint 🎉":"reste "+fmt(remaining)))),
            el("div",{style:S.projStats},
              estDate && el("div",{style:S.projStat},
                el("span",{style:{color:"var(--text-3)",fontSize:11}},"Atteint vers"),
                el("span",{style:{fontWeight:700,fontSize:12}},MONTHS_FR[estDate.getMonth()]+" "+estDate.getFullYear())),
              reqMonthly && el("div",{style:S.projStat},
                el("span",{style:{color:"var(--text-3)",fontSize:11}},"Nécessaire / mois"),
                el("span",{style:{fontWeight:700,fontSize:12,color:proj.color||"#945ECF"}},fmt(reqMonthly))),
              (proj.linkedPotIds||[]).length>0 && el("div",{style:{fontSize:11,color:"var(--text-3)",marginTop:4}},
                "Cagnottes : "+(proj.linkedPotIds||[]).map(function(id){var p=pots.find(function(x){return x.id===id;});return p?p.label:"?";}).join(", "))));
        })))),

    // ---- TAB GRAPHIQUES ----
    tab==="graphiques" && el(Charts,{months,pots,year,month,mk})
    ), // fin du panneau d'onglet

    // ---- barre d'onglets en bas (style iOS) ----
    el("nav",{style:S.tabBar},
      [["budget","coins","Budget"],["epargne","piggy-bank","Épargne"],["graphiques","bar-chart","Graphiques"]].map(function(t){
        var id=t[0],icon=t[1],label=t[2];var on=tab===id;
        return el("button",{key:id,style:Object.assign({},S.tabBtn,on?S.tabActive:{}),onClick:function(){setTab(id);}},
          el(Icon,{name:icon,size:23,color:on?"#1D8BCE":"var(--text-3)"}),
          el("span",{style:{fontSize:10.5,fontWeight:on?700:500}},label));
      })),

    // Modals
    (modal&&modal.kind==="newpot") && el(PotModal,{onClose:()=>setModal(null),onSave:p=>{addPot(p);setModal(null);}}),
    (modal&&modal.kind==="editpot") && el(PotModal,{initial:modal.pot,onClose:()=>setModal(null),onSave:upd=>{editPot(modal.pot.id,upd);setModal(null);}}),
    (modal&&modal.kind==="deposit") && el(DepositModal,{pot:modal,maxSuggest:nonAffecte,onClose:()=>setModal(null),onSave:a=>{addDeposit(modal.potId,a);setModal(null);}}),
    (modal&&modal.kind==="allocate") && el(AllocateModal,{pots:pots,available:nonAffecte,onClose:()=>setModal(null),onSave:function(entries){addDeposits(entries);setModal(null);}}),
    (modal&&modal.kind==="history") && el(HistoryModal,{pot:modal.pot,history:potHistory(modal.pot.id),total:potBalance(modal.pot.id),onClose:()=>setModal(null)}),
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
      onConfirm:()=>{delProject(modal.projId);setModal(null);}})
  );
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

// ---- helpers ----
function flowRow(icon,color,label,val,valColor){
  return el("div",{style:S.flowRow},
    el("span",{style:S.flowLabel},el(Icon,{name:icon,size:14,color}),` ${label}`),
    el("span",{style:{...S.flowVal,color:valColor}},val));
}

function FastBlock({kind,cfg,items,onAmount,onDel,onRename,onAdd}){
  const total=items.reduce((s,x)=>s+(x.amount||0),0);
  const [newLabel,setNewLabel]=useState("");
  const addNew=()=>{ if(!newLabel.trim())return; onAdd(newLabel.trim()); setNewLabel(""); };
  return el("div",{style:S.section},
    el("div",{style:S.sectionHead},
      el("span",{style:S.sectionTitle},el("span",{style:{color:cfg.accent,display:"flex"}},el(Icon,{name:cfg.icon,size:16,color:cfg.accent}))," "+cfg.title),
      el("span",{style:{...S.badge,background:cfg.accent+"1a",color:cfg.accent}},cfg.sign+" "+fmt(total))),
    el("div",{style:S.lineList}, items.map(it=>el("div",{key:it.id,style:S.lineRow},
      el("span",{style:{...S.lineDot,background:cfg.accent}}),
      el("input",{style:S.lineLabelInput,value:it.label,onChange:e=>onRename(it.id,e.target.value),placeholder:"Libellé"}),
      el("div",{style:{...S.lineAmtWrap,borderColor:it.amount>0?cfg.accent+"55":"var(--border)"}},
        el("input",{type:"number",inputMode:"decimal",style:S.lineAmtInput,value:it.amount||"",placeholder:"0",
          onChange:e=>onAmount(it.id,parseFloat(e.target.value)||0),onFocus:e=>e.target.select()}),
        el("span",{style:S.eur},"€")),
      el("button",{style:S.lineDel,onClick:()=>onDel(it.id)},el(Icon,{name:"x",size:15}))))),
    el("div",{style:S.addLineRow},
      el(Icon,{name:"plus",size:15,color:"var(--text-4)"}),
      el("input",{style:S.addLineInput,value:newLabel,placeholder:"Ajouter une ligne…",onChange:e=>setNewLabel(e.target.value),onKeyDown:e=>e.key==="Enter"&&addNew()}),
      newLabel.trim() && el("button",{style:{...S.addLineBtn,color:cfg.accent},onClick:addNew},"Ajouter")));
}

function PotModal({initial,onClose,onSave}){
  const [label,setLabel]=useState((initial&&initial.label)||"");
  const [goal,setGoal]=useState((initial&&initial.goal>0)?String(initial.goal):"");
  const [startBalance,setStartBalance]=useState((initial&&initial.startBalance>0)?String(initial.startBalance):"");
  const [color,setColor]=useState((initial&&initial.color)||POT_PALETTE[0]);
  const submit=function(){if(!label)return;onSave({label,goal:parseFloat(goal)||0,startBalance:parseFloat(startBalance)||0,color});};
  return el(Modal,{title:initial?"Modifier la cagnotte":"Nouvelle cagnotte",onClose},
    el("div",{style:{marginBottom:14}},el("label",{style:S.fieldLabel},"Nom"),el("input",{value:label,autoFocus:true,placeholder:"ex : Vacances, Voiture…",style:S.input,onChange:function(e){setLabel(e.target.value);}})),
    el("div",{style:{marginBottom:14}},el("label",{style:S.fieldLabel},"Solde de départ (€) — épargne déjà constituée"),el("input",{type:"number",inputMode:"decimal",value:startBalance,placeholder:"0",style:S.input,onChange:function(e){setStartBalance(e.target.value);}})),
    el("div",{style:{marginBottom:14}},el("label",{style:S.fieldLabel},"Objectif (€) — optionnel"),el("input",{type:"number",inputMode:"decimal",value:goal,placeholder:"Vide = cagnotte libre",style:S.input,onChange:function(e){setGoal(e.target.value);}})),
    el("div",{style:{marginBottom:18}},el("label",{style:S.fieldLabel},"Couleur"),el("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},POT_PALETTE.map(function(c){return el("button",{key:c,onClick:function(){setColor(c);},style:{width:30,height:30,borderRadius:8,background:c,border:color===c?"3px solid var(--text)":"2px solid var(--border)",cursor:"pointer"}});}))),
    el("button",{style:S.saveBtn,onClick:submit},initial?"Enregistrer":"Créer la cagnotte"));
}

function ProjectModal({initial,pots,onClose,onSave}){
  const [label,setLabel]=useState((initial&&initial.label)||"");
  const [goal,setGoal]=useState((initial&&initial.goal>0)?String(initial.goal):"");
  const [initialAmount,setInitialAmount]=useState((initial&&initial.initialAmount>0)?String(initial.initialAmount):"");
  const [targetDate,setTargetDate]=useState((initial&&initial.targetDate)||"");
  const [color,setColor]=useState((initial&&initial.color)||"#945ECF");
  const [linkedPotIds,setLinkedPotIds]=useState((initial&&initial.linkedPotIds)||[]);
  const togglePot=function(id){setLinkedPotIds(function(prev){return prev.indexOf(id)>=0?prev.filter(function(x){return x!==id;}):[...prev,id];});};
  const submit=function(){if(!label)return;onSave({label,goal:parseFloat(goal)||0,initialAmount:parseFloat(initialAmount)||0,targetDate:targetDate,color:color,linkedPotIds:linkedPotIds});};
  return el(Modal,{title:initial?"Modifier le projet":"Nouveau projet",onClose},
    el("div",{style:{marginBottom:14}},el("label",{style:S.fieldLabel},"Nom du projet"),el("input",{value:label,autoFocus:true,placeholder:"ex : Apport maison, Voyage…",style:S.input,onChange:function(e){setLabel(e.target.value);}})),
    el("div",{style:{marginBottom:14}},el("label",{style:S.fieldLabel},"Objectif total (€)"),el("input",{type:"number",inputMode:"decimal",value:goal,placeholder:"ex : 40000",style:S.input,onChange:function(e){setGoal(e.target.value);}})),
    el("div",{style:{marginBottom:14}},el("label",{style:S.fieldLabel},"Épargne déjà constituée (€)"),el("input",{type:"number",inputMode:"decimal",value:initialAmount,placeholder:"0",style:S.input,onChange:function(e){setInitialAmount(e.target.value);}})),
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
    el("button",{style:{...S.saveBtn,opacity:(allocated<=0||left<-0.001)?.5:1},onClick:submit},"Verser "+fmt(allocated)));
}

function HistoryModal({pot,history,total,onClose}){
  return el(Modal,{title:"Historique — "+pot.label,onClose},
    pot.startBalance>0 && el("div",{style:{...S.itemRow,borderBottom:"1px dashed var(--border-2)"}},
      el("span",{style:{...S.itemDot,background:pot.color}}),
      el("span",{style:S.lineLabel},"Solde de départ"),
      el("span",{style:{...S.itemAmount,color:"var(--text-2)"}},fmt(pot.startBalance))),
    history.length===0 && pot.startBalance<=0 && el("p",{style:S.blockHint},"Aucun versement pour l'instant."),
    history.map(function(h){
      var parts=h.key.split("-");var mi=parseInt(parts[1],10)-1;
      return el("div",{key:h.key,style:S.itemRow},
        el("span",{style:{...S.itemDot,background:pot.color}}),
        el("span",{style:S.lineLabel},MONTHS_FR[mi]+" "+parts[0]),
        el("span",{style:{...S.itemAmount,color:pot.color}},"+ "+fmt(h.total)));
    }),
    el("div",{style:{display:"flex",justifyContent:"space-between",fontSize:15,fontWeight:800,padding:"14px 2px 4px",marginTop:8,borderTop:"1px solid var(--border-2)"}},
      el("span",null,"Total"),
      el("span",{style:{color:pot.color}},fmt(total))));
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
