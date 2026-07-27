// fiscal.js — Calculs fiscaux & financiers purs (barème IR, décote, parts, prêt).
// Chargé avant app.js (window.Fiscal) et importable sous Node pour les tests.
// Sources : article 197 CGI, LFI 2025 (revenus 2024). iOS-safe : pas de ?., pas de catch sans (e).
(function(root){
  "use strict";

  // Barème IR 2025 (revenus 2024)
  var IR_BRACKETS = [
    {upTo:11497,    rate:0},
    {upTo:29315,    rate:0.11},
    {upTo:83823,    rate:0.30},
    {upTo:180294,   rate:0.41},
    {upTo:Infinity, rate:0.45}
  ];
  // Plafond de l'avantage du quotient familial : 1 791 € / demi-part
  var IR_PLAFOND_DEMI_PART = 1791;

  // Décote (art. 197 CGI) : célibataire si IR < 1 929 €, couple si IR < 3 191 €
  function irDecote(impotBrut, couple){
    if(couple){ if(impotBrut < 3191) return Math.max(0, 1444 - 0.4525*impotBrut); }
    else { if(impotBrut < 1929) return Math.max(0, 873 - 0.4525*impotBrut); }
    return 0;
  }

  // Nombre de parts fiscales selon situation + nombre d'enfants
  function irParts(situation, enfants){
    var base = situation === "couple" ? 2 : 1;
    var e = enfants || 0;
    var ep = 0;
    if(e >= 1) ep += 0.5;
    if(e >= 2) ep += 0.5;
    if(e >= 3) ep += (e - 2) * 1;
    return base + ep;
  }

  // Impôt sur un quotient (revenu imposable / nb de parts), avant multiplication par les parts
  function irTaxOnQuotient(q){
    var tax = 0, prev = 0, i;
    for(i=0;i<IR_BRACKETS.length;i++){
      var b = IR_BRACKETS[i];
      if(q > prev){ tax += (Math.min(q, b.upTo) - prev) * b.rate; prev = b.upTo; }
      else break;
    }
    return tax;
  }

  // Taux marginal d'imposition applicable à un quotient
  function irMarginalRate(q){
    var i, r = 0;
    for(i=0;i<IR_BRACKETS.length;i++){ if(q > (i===0 ? 0 : IR_BRACKETS[i-1].upTo)) r = IR_BRACKETS[i].rate; }
    return r;
  }

  // Mensualité d'un prêt (P capital, annualRate en %, n mois)
  function loanMonthly(P, annualRate, n){
    if(n <= 0) return 0;
    var r = annualRate/100/12;
    if(r === 0) return P/n;
    return P * r / (1 - Math.pow(1+r, -n));
  }

  // Capacité d'emprunt (mensualité max, annualRate en %, n mois)
  function loanCapacity(monthlyMax, annualRate, n){
    if(n <= 0) return 0;
    var r = annualRate/100/12;
    if(r === 0) return monthlyMax*n;
    return monthlyMax * (1 - Math.pow(1+r, -n)) / r;
  }

  var Fiscal = {
    IR_BRACKETS: IR_BRACKETS,
    IR_PLAFOND_DEMI_PART: IR_PLAFOND_DEMI_PART,
    irDecote: irDecote,
    irParts: irParts,
    irTaxOnQuotient: irTaxOnQuotient,
    irMarginalRate: irMarginalRate,
    loanMonthly: loanMonthly,
    loanCapacity: loanCapacity
  };

  if(typeof module !== "undefined" && module.exports){ module.exports = Fiscal; }
  root.Fiscal = Fiscal;
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : this));
