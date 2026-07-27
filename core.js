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

  var Core = {
    sumAmounts: sumAmounts,
    potCovered: potCovered,
    monthTotals: monthTotals,
    loanRepaid: loanRepaid,
    potDeposits: potDeposits,
    potBalance: potBalance,
    projectBalance: projectBalance
  };

  if(typeof module !== "undefined" && module.exports){ module.exports = Core; }
  root.Core = Core;
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : this));
