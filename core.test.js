// core.test.js — Tests des calculs financiers. Aucune dépendance : `node core.test.js`.
var Core = require("./core.js");

var passed = 0, failed = 0;
function eq(actual, expected, label){
  if(actual === expected){ passed++; }
  else { failed++; console.error("  ✗ " + label + "  attendu " + expected + ", obtenu " + actual); }
}
function group(name){ console.log("\n" + name); }

// ---------- monthTotals ----------
group("Budget de base");
(function(){
  var t = Core.monthTotals({
    revenus:[{amount:3000}],
    fixed:[{amount:1200}],
    variable:[{amount:400}],
    excep:[{amount:100}],
    deposits:[]
  });
  eq(t.revenus, 3000, "revenus");
  eq(t.dep, 1700, "dépenses totales");
  eq(t.reste, 1300, "reste avant épargne");
  eq(t.nonAffecte, 1300, "non-affecté");
})();

group("Épargne réduit le non-affecté une fois");
(function(){
  var t = Core.monthTotals({
    revenus:[{amount:3000}],
    fixed:[{amount:1000}],
    deposits:[{potId:"a",amount:500}]  // versement normal
  });
  eq(t.saved, 500, "épargné");
  eq(t.nonAffecte, 1500, "non-affecté = 3000 - 1000 - 500");
})();

group("Retrait cagnotte réintégré au budget ne gonfle pas le non-affecté");
(function(){
  // On retire 200 de la cagnotte, réintégrés au budget : ligne revenu fromPot + dépôt négatif toBudget
  var t = Core.monthTotals({
    revenus:[{amount:3000},{amount:200,fromPot:"a"}],
    fixed:[{amount:1000}],
    deposits:[{potId:"a",amount:-200,toBudget:true}]
  });
  eq(t.revenus, 3000, "le financement cagnotte n'est pas un revenu");
  eq(t.saved, 0, "le retrait réintégré n'est pas de l'épargne");
  eq(t.nonAffecte, 2000, "non-affecté = 3000 - 1000 (pas de double compte)");
})();

group("Dépense couverte par cagnotte : net à la charge du foyer");
(function(){
  // Dépense 300 couverte à 200 par une cagnotte
  var t = Core.monthTotals({
    revenus:[{amount:3000}],
    excep:[{amount:300, potCovers:[{depId:"d1",potId:"a",coveredAmount:200}]}],
    deposits:[{potId:"a",amount:-200,linkedExpenseId:"e1"}]
  });
  eq(t.excep, 300, "dépense brute");
  eq(t.potCovExcep, 200, "part couverte");
  eq(t.dep, 100, "dépense nette = 100");
  eq(t.saved, 0, "le retrait de couverture n'est pas de l'épargne");
  eq(t.nonAffecte, 2900, "non-affecté = 3000 - 100");
})();

group("Achat de prêt sorti d'un livret n'impacte pas le budget du mois");
(function(){
  var t = Core.monthTotals({
    revenus:[{amount:3000}],
    fixed:[{amount:1000}],
    deposits:[{potId:"liv",amount:-1200,loanKind:"purchase",loanId:"L1"}]
  });
  eq(t.saved, 0, "l'achat (purchase) est exclu de l'épargne");
  eq(t.nonAffecte, 2000, "non-affecté inchangé par l'achat");
})();

group("Remboursement de prêt compte comme épargne du mois");
(function(){
  var t = Core.monthTotals({
    revenus:[{amount:3000}],
    fixed:[{amount:1000}],
    deposits:[{potId:"liv",amount:300,loanKind:"repay",loanId:"L1"}]
  });
  eq(t.saved, 300, "le remboursement compte comme épargne");
  eq(t.nonAffecte, 1700, "non-affecté = 3000 - 1000 - 300");
})();

// ---------- loanRepaid ----------
group("Total remboursé d'un prêt (multi-mois, multi-cagnottes)");
(function(){
  var months = {
    "2026-06":{deposits:[{loanId:"L1",loanKind:"repay",amount:100},{loanId:"L1",loanKind:"repay",amount:100}]},
    "2026-07":{deposits:[{loanId:"L1",loanKind:"repay",amount:445},{loanId:"X",loanKind:"repay",amount:50}]}
  };
  eq(Core.loanRepaid("L1", months), 645, "645 remboursés sur L1");
  eq(Core.loanRepaid("X", months), 50, "50 sur un autre prêt");
})();

// ---------- potBalance ----------
group("Solde de cagnotte = départ + mouvements");
(function(){
  var pots = [{id:"a",startBalance:1000}];
  var months = {
    "2026-06":{deposits:[{potId:"a",amount:200}]},
    "2026-07":{deposits:[{potId:"a",amount:-50},{potId:"b",amount:999}]}
  };
  eq(Core.potBalance(pots, months, "a"), 1150, "1000 + 200 - 50");
  eq(Core.potBalance(pots, months, "b"), 999, "cagnotte sans solde de départ");
})();

group("Solde de projet = apport + cagnottes rattachées");
(function(){
  var pots = [{id:"a",startBalance:500},{id:"b",startBalance:0}];
  var months = { "2026-07":{deposits:[{potId:"a",amount:100},{potId:"b",amount:300}]} };
  var proj = {initialAmount:1000, linkedPotIds:["a","b"]};
  eq(Core.projectBalance(pots, months, proj), 1900, "1000 + (500+100) + (0+300)");
})();

// ---------- garde-fous entrées vides ----------
group("Entrées vides / manquantes");
(function(){
  var t = Core.monthTotals({});
  eq(t.nonAffecte, 0, "mois vide → 0");
  eq(Core.loanRepaid("L1", {}), 0, "aucun mois → 0");
  eq(Core.potBalance([], {}, "z"), 0, "cagnotte inconnue → 0");
})();

// ---------- prévision de trésorerie ----------
group("Flux net moyen mensuel (mois saisis seulement)");
(function(){
  var months = {
    "2026-06":{revenus:[{amount:3000}],fixed:[{amount:2000}]},      // reste 1000
    "2026-07":{revenus:[{amount:3000}],fixed:[{amount:2400}]},      // reste 600
    "2026-08":{}                                                     // mois vide → ignoré
  };
  eq(Core.avgMonthlyNet(months), 800, "moyenne de 1000 et 600");
  eq(Core.avgMonthlyNet({}), 0, "aucun mois → 0");
})();

group("Projection de trésorerie");
(function(){
  var f = Core.forecast(5000, 800, 6);
  eq(f.length, 7, "mois 0 → 6");
  eq(f[0].balance, 5000, "départ = maintenant");
  eq(f[6].balance, 9800, "5000 + 6×800");
  var down = Core.forecast(1000, -400, 3);
  eq(down[3].balance, -200, "flux négatif → passe sous zéro");
})();

// ---------- bilan annuel ----------
group("Bilan annuel : totaux & catégories");
(function(){
  var months = {
    "2026-01":{revenus:[{amount:3000}],fixed:[{amount:1000,cat:"logement"}],variable:[{amount:300,cat:"alim"}],deposits:[{potId:"a",amount:200}]},
    "2026-02":{revenus:[{amount:3000}],fixed:[{amount:1000,cat:"logement"}],variable:[{amount:400,cat:"alim"}]},
    "2025-12":{revenus:[{amount:9999}]}  // autre année, ignorée
  };
  var b = Core.annualSummary(months, 2026);
  eq(b.revenus, 6000, "revenus année");
  eq(b.depenses, 2700, "dépenses année (1000+300 + 1000+400)");
  eq(b.epargne, 200, "épargne année");
  eq(b.byMonth.length, 12, "12 mois");
  eq(b.byMonth[0].net, 1700, "janvier net = 3000-1300");
  eq(b.byCategory.logement, 2000, "logement cumulé");
  eq(b.byCategory.alim, 700, "alimentation cumulée");
})();

group("Bilan : dépense non catégorisée + couverture cagnotte");
(function(){
  var months = {
    "2026-03":{excep:[{amount:300,cat:"loisirs",potCovers:[{coveredAmount:200}]},{amount:50}]}
  };
  var b = Core.annualSummary(months, 2026);
  eq(b.byCategory.loisirs, 100, "loisirs net = 300 - 200 couverts");
  eq(b.byCategory.__none, 50, "ligne sans catégorie → __none");
})();

console.log("\n" + (failed === 0 ? "✓ TOUS LES TESTS PASSENT" : "✗ ÉCHECS") + " — " + passed + " ok, " + failed + " ko\n");
if(typeof process !== "undefined"){ process.exit(failed === 0 ? 0 : 1); }
