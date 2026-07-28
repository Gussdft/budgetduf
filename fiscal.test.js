// fiscal.test.js — Tests des calculs fiscaux & financiers. `node fiscal.test.js`.
var F = require("./fiscal.js");

var passed = 0, failed = 0;
function eq(actual, expected, label){
  if(actual === expected){ passed++; }
  else { failed++; console.error("  ✗ " + label + "  attendu " + expected + ", obtenu " + actual); }
}
function near(actual, expected, tol, label){
  if(Math.abs(actual - expected) <= tol){ passed++; }
  else { failed++; console.error("  ✗ " + label + "  attendu ~" + expected + " (±" + tol + "), obtenu " + actual); }
}
function group(name){ console.log("\n" + name); }

group("Parts fiscales");
eq(F.irParts("celibataire", 0), 1, "célibataire sans enfant");
eq(F.irParts("couple", 0), 2, "couple sans enfant");
eq(F.irParts("couple", 1), 2.5, "couple + 1 enfant");
eq(F.irParts("couple", 2), 3, "couple + 2 enfants");
eq(F.irParts("couple", 3), 4, "couple + 3 enfants (3e = 1 part)");
eq(F.irParts("celibataire", 2), 2, "parent isolé, 2 enfants");

group("Barème IR par tranche");
eq(F.irTaxOnQuotient(11497), 0, "pile en haut de la tranche à 0 %");
near(F.irTaxOnQuotient(29315), 1959.98, 0.5, "haut de tranche 11 %");
eq(F.irMarginalRate(10000), 0, "TMI 0 %");
eq(F.irMarginalRate(20000), 0.11, "TMI 11 %");
eq(F.irMarginalRate(50000), 0.30, "TMI 30 %");
eq(F.irMarginalRate(100000), 0.41, "TMI 41 %");
eq(F.irMarginalRate(200000), 0.45, "TMI 45 %");

group("Décote (art. 197 CGI)");
eq(F.irDecote(5000, false), 0, "célibataire hors décote (IR élevé)");
eq(F.irDecote(5000, true), 0, "couple hors décote");
near(F.irDecote(1000, false), 873 - 452.5, 0.01, "célibataire, IR 1000");
near(F.irDecote(1000, true), 1444 - 452.5, 0.01, "couple, IR 1000");
eq(F.irDecote(1929, false), 0, "célibataire pile au seuil = pas de décote");

group("IR complet — couple, 2 enfants, 60 000 € imposables");
(function(){
  var parts = F.irParts("couple", 2);            // 3
  var q = 60000 / parts;                          // 20000
  var impot = F.irTaxOnQuotient(q) * parts;       // remis sur le foyer
  var net = impot - F.irDecote(impot, true);
  eq(parts, 3, "3 parts");
  near(net, 2631.70, 1, "IR net ~2632 € (décote couple appliquée)");
})();

group("Mensualité de prêt");
near(F.loanMonthly(200000, 3.5, 240), 1159.92, 0.5, "200k, 3,5 %, 20 ans");
eq(F.loanMonthly(12000, 0, 12), 1000, "taux 0 % → capital / durée");
eq(F.loanMonthly(1000, 3, 0), 0, "durée nulle → 0");

group("Capacité d'emprunt (inverse de la mensualité)");
(function(){
  var cap = F.loanCapacity(1159.92, 3.5, 240);
  near(cap, 200000, 50, "1159,92 €/mois à 3,5 % sur 20 ans ≈ 200k");
})();
eq(F.loanCapacity(1000, 0, 12), 12000, "taux 0 % → mensualité × durée");

group("Valeur future (capital + versements)");
(function(){
  eq(F.futureValue(0, 100, 1, 0), 1200, "1 an, 100/mois, 0 % → 1200");
  eq(Math.round(F.futureValue(1000, 0, 1, 0.10)), 1100, "1000 à 10 % sur 1 an → 1100");
})();

group("Enveloppes — net de frais et d'impôts");
(function(){
  var p = {initial:1000, monthly:200, years:20, ret:7, ter:0.2, avFee:0.5, tmi:30, couple:false};
  var pea = F.investEnvelope("pea", p);
  var cto = F.investEnvelope("cto", p);
  var av  = F.investEnvelope("av",  p);
  var per = F.investEnvelope("per", p);
  eq(pea.verse, 49000, "total versé = 1000 + 200×12×20");
  // PEA n'a pas de frais AV → valeur avant impôt > AV
  var ok1 = pea.valeurAvantImpot > av.valeurAvantImpot; eq(ok1, true, "AV rogne plus que PEA (frais de gestion)");
  // PEA (PS 17,2 %) laisse plus net que CTO (PFU 30 %) à valeur égale
  var ok2 = pea.capitalNet > cto.capitalNet; eq(ok2, true, "PEA plus avantageux que CTO à l'impôt");
  // PER : économie d'impôt à l'entrée = versé × TMI
  eq(Math.round(per.economieEntree), Math.round(49000*0.30), "PER : économie d'entrée = versé × TMI");
  // impôts positifs partout
  var ok3 = pea.impots>0 && cto.impots>0 && av.impots>0; eq(ok3, true, "impôts calculés sur les gains");
  // frais AV > 0 (TER + frais gestion)
  var ok4 = av.fraisCumules > pea.fraisCumules; eq(ok4, true, "AV a plus de frais cumulés que PEA");
})();

console.log("\n" + (failed === 0 ? "✓ TOUS LES TESTS PASSENT" : "✗ ÉCHECS") + " — " + passed + " ok, " + failed + " ko\n");
if(typeof process !== "undefined"){ process.exit(failed === 0 ? 0 : 1); }
