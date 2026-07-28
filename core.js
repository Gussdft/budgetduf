// core.js — Calculs financiers purs (aucune dépendance, aucun React).
// Chargé avant app.js dans le navigateur (window.Core) et importable sous Node pour les tests.
// Contrainte iOS Safari : pas de ?., pas de catch sans (e).
(function(root){
  "use strict";

  // Somme des montants d'une liste de lignes {amount}
  function sumAmounts(arr){
    arr = arr || [];
    var s = 0;
    for(var i=0;i<arr.length;i++){ s += arr[i].amount || 0; }
    return s;
  }

  // Montant couvert par des cagnottes pour une catégorie de dépenses
  function potCovered(data, cat){
    var arr = (data && data[cat]) || [];
    var s = 0;
    for(var i=0;i<arr.length;i++){
      var pc = arr[i].potCovers || [];
      for(var j=0;j<pc.length;j++){ s += pc[j].coveredAmount || 0; }
    }
    return s;
  }

  // Totaux d'un mois : revenus, dépenses (nettes des couvertures), épargne, non-affecté.
  // Règles clefs :
  //  - les lignes de revenus "fromPot" (financements cagnottes) ne comptent pas comme revenu
  //  - les dépenses sont nettes du montant couvert par cagnotte (potCovers)
  //  - l'épargne exclut : réintégrations budget (toBudget), couvertures (linkedExpenseId)
  //    et l'achat initial d'un prêt (loanKind "purchase") — pour ne jamais double-compter
  function monthTotals(data){
    data = data || {};
    var rv = data.revenus || [];
    var revenus = 0;
    for(var i=0;i<rv.length;i++){ if(!rv[i].fromPot){ revenus += rv[i].amount || 0; } }
    var fixed = sumAmounts(data.fixed);
    var variable = sumAmounts(data.variable);
    var excep = sumAmounts(data.excep);
    var cf = potCovered(data, "fixed");
    var cv = potCovered(data, "variable");
    var ce = potCovered(data, "excep");
    var dep = (fixed - cf) + (variable - cv) + (excep - ce);
    var saved = 0;
    var dp = data.deposits || [];
    for(var k=0;k<dp.length;k++){
      var d = dp[k];
      if(!d.toBudget && !d.linkedExpenseId && d.loanKind !== "purchase"){ saved += d.amount || 0; }
    }
    var reste = revenus - dep;
    return {
      revenus: revenus, fixed: fixed, variable: variable, excep: excep,
      potCovFixed: cf, potCovVariable: cv, potCovExcep: ce,
      dep: dep, saved: saved, reste: reste, nonAffecte: reste - saved
    };
  }

  // Total remboursé pour un prêt (cumul sur tous les mois)
  function loanRepaid(loanId, months){
    months = months || {};
    var s = 0;
    var ks = Object.keys(months);
    for(var i=0;i<ks.length;i++){
      var dps = months[ks[i]].deposits || [];
      for(var j=0;j<dps.length;j++){
        var d = dps[j];
        if(d.loanId === loanId && d.loanKind === "repay"){ s += d.amount || 0; }
      }
    }
    return s;
  }

  // Somme de tous les mouvements (versements − retraits) d'une cagnotte, tous mois confondus
  function potDeposits(months, id){
    months = months || {};
    var s = 0;
    var ks = Object.keys(months);
    for(var i=0;i<ks.length;i++){
      var dps = months[ks[i]].deposits || [];
      for(var j=0;j<dps.length;j++){ if(dps[j].potId === id){ s += dps[j].amount || 0; } }
    }
    return s;
  }

  // Solde d'une cagnotte = solde de départ + mouvements
  function potBalance(pots, months, id){
    pots = pots || [];
    var start = 0;
    for(var i=0;i<pots.length;i++){ if(pots[i].id === id){ start = pots[i].startBalance || 0; break; } }
    return start + potDeposits(months, id);
  }

  // Solde d'un projet = apport initial + soldes des cagnottes rattachées
  function projectBalance(pots, months, proj){
    var s = (proj && proj.initialAmount) || 0;
    var ids = (proj && proj.linkedPotIds) || [];
    for(var i=0;i<ids.length;i++){ s += potBalance(pots, months, ids[i]); }
    return s;
  }

  // Flux net moyen par mois (revenus − dépenses nettes) sur les mois réellement saisis.
  // Un mois "saisi" = au moins une ligne de revenu ou de dépense.
  function avgMonthlyNet(months){
    months = months || {};
    var ks = Object.keys(months);
    var sum = 0, count = 0;
    for(var i=0;i<ks.length;i++){
      var m = months[ks[i]];
      var hasData = (m.revenus&&m.revenus.length) || (m.fixed&&m.fixed.length) || (m.variable&&m.variable.length) || (m.excep&&m.excep.length);
      if(!hasData) continue;
      var t = monthTotals(m);
      sum += t.reste;   // revenus − dépenses nettes (avant épargne : c'est ce qui reste à mettre de côté)
      count++;
    }
    return count > 0 ? sum / count : 0;
  }

  // Projection de trésorerie : solde de départ + flux net chaque mois, sur n mois.
  // Renvoie [{month:0,balance:start}, {month:1,...}, …] — month 0 = maintenant.
  function forecast(startBalance, monthlyNet, nMonths){
    startBalance = startBalance || 0;
    monthlyNet = monthlyNet || 0;
    nMonths = nMonths || 0;
    var out = [{month:0, balance:startBalance}];
    var bal = startBalance;
    for(var i=1;i<=nMonths;i++){ bal += monthlyNet; out.push({month:i, balance:bal}); }
    return out;
  }

  // Montant net d'une ligne de dépense (après ce qui est couvert par des cagnottes)
  function lineNet(line){
    var covered = 0;
    var pc = line.potCovers || [];
    for(var i=0;i<pc.length;i++){ covered += pc[i].coveredAmount || 0; }
    return (line.amount || 0) - covered;
  }

  // Bilan d'une année : totaux, évolution mois par mois, dépenses par catégorie.
  // months keyé "YYYY-MM". Les dépenses sont nettes (part réellement payée par le foyer).
  function annualSummary(months, year){
    months = months || {};
    var pad = function(n){ return (n < 10 ? "0" : "") + n; };
    var revenus = 0, depenses = 0, epargne = 0;
    var byMonth = [];
    var byCat = {};      // catId (ou "__none") -> total net
    for(var m=1;m<=12;m++){
      var key = year + "-" + pad(m);
      var data = months[key];
      var t = data ? monthTotals(data) : {revenus:0, dep:0, saved:0};
      revenus += t.revenus; depenses += t.dep; epargne += t.saved;
      byMonth.push({month:m, revenus:t.revenus, depenses:t.dep, net:t.revenus - t.dep});
      if(data){
        var cats = ["fixed","variable","excep"];
        for(var c=0;c<cats.length;c++){
          var arr = data[cats[c]] || [];
          for(var i=0;i<arr.length;i++){
            var id = arr[i].cat || "__none";
            byCat[id] = (byCat[id] || 0) + lineNet(arr[i]);
          }
        }
      }
    }
    return {year:year, revenus:revenus, depenses:depenses, epargne:epargne, byMonth:byMonth, byCategory:byCat};
  }

  // Équilibre du couple sur un mois : revenus de chacun, part équitable des charges
  // communes, ce que chacun a payé, et le solde (« qui doit combien à qui »).
  //  - couple.rule : "egal" (50/50) ou "prorata" (au prorata des revenus)
  //  - ligne de revenu : who = "a" | "b" (sinon revenu commun, hors ratio)
  //  - ligne de dépense : scope = "a" | "b" pour une dépense perso (exclue du partage),
  //    sinon commune ; paidBy = "a" | "b" (qui a avancé l'argent — sinon hors règlement)
  function coupleBalance(data, couple){
    data = data || {};
    couple = couple || {};
    var rule = couple.rule || "prorata";
    var incomeA = 0, incomeB = 0;
    var rv = data.revenus || [];
    for(var i=0;i<rv.length;i++){
      var r = rv[i];
      if(r.fromPot) continue;
      if(r.who === "a") incomeA += r.amount || 0;
      else if(r.who === "b") incomeB += r.amount || 0;
    }
    var ratioA, ratioB;
    if(rule === "egal"){ ratioA = 0.5; ratioB = 0.5; }
    else if(incomeA + incomeB > 0){ ratioA = incomeA/(incomeA+incomeB); ratioB = 1 - ratioA; }
    else { ratioA = 0.5; ratioB = 0.5; }
    var total = 0, paidA = 0, paidB = 0;
    var cats = ["fixed","variable","excep"];
    for(var c=0;c<cats.length;c++){
      var arr = data[cats[c]] || [];
      for(var j=0;j<arr.length;j++){
        var line = arr[j];
        if(line.scope === "a" || line.scope === "b") continue;   // dépense perso : hors partage
        if(line.paidBy !== "a" && line.paidBy !== "b") continue;  // pas de payeur : hors règlement
        var net = lineNet(line);
        total += net;
        if(line.paidBy === "a") paidA += net; else paidB += net;
      }
    }
    var shareA = total * ratioA, shareB = total * ratioB;
    var balanceA = paidA - shareA, balanceB = paidB - shareB;
    var owes = null;
    if(balanceA > 0.005) owes = {from:"b", to:"a", amount:balanceA};
    else if(balanceB > 0.005) owes = {from:"a", to:"b", amount:balanceB};
    return {
      incomeA:incomeA, incomeB:incomeB, ratioA:ratioA, ratioB:ratioB,
      total:total, paidA:paidA, paidB:paidB, shareA:shareA, shareB:shareB,
      balanceA:balanceA, balanceB:balanceB, owes:owes
    };
  }

  var Core = {
    sumAmounts: sumAmounts,
    potCovered: potCovered,
    monthTotals: monthTotals,
    loanRepaid: loanRepaid,
    potDeposits: potDeposits,
    potBalance: potBalance,
    projectBalance: projectBalance,
    avgMonthlyNet: avgMonthlyNet,
    forecast: forecast,
    lineNet: lineNet,
    annualSummary: annualSummary,
    coupleBalance: coupleBalance
  };

  if(typeof module !== "undefined" && module.exports){ module.exports = Core; }
  root.Core = Core;
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : this));
