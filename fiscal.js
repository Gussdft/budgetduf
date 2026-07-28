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

  // Prélèvements sociaux 2026
  var PS_RATE = 0.172;

  // Valeur future : capital initial + versements mensuels, capitalisation annuelle
  function futureValue(initial, monthly, years, annualRate){
    var bal = initial || 0;
    var annualContrib = (monthly || 0) * 12;
    for(var y=0;y<years;y++){ bal = bal * (1 + annualRate) + annualContrib; }
    return bal;
  }

  // Simule une enveloppe d'investissement, NET de frais et d'impôts (fiscalité 2026, simplifiée).
  // env : "pea" | "cto" | "av" | "per"
  // p   : {initial, monthly, years, ret (%/an brut), ter (%/an frais de support),
  //        avFee (%/an frais de gestion AV/PER), tmi (%), couple (bool)}
  // Renvoie versé, brut (sans frais), fraisCumules, valeurAvantImpot, gains, impots,
  //         capitalNet, economieEntree (PER), et le net "réel" (capital + économie d'entrée).
  function investEnvelope(env, p){
    p = p || {};
    var initial = p.initial || 0, monthly = p.monthly || 0, years = p.years || 0;
    var ret = (p.ret || 0) / 100, ter = (p.ter || 0) / 100, avFee = (p.avFee || 0) / 100;
    var tmi = (p.tmi || 0) / 100;
    var couple = !!p.couple;
    var verse = initial + monthly * 12 * years;

    // Frais annuels selon l'enveloppe
    var feeRate = ter;
    if(env === "av" || env === "per") feeRate += avFee;
    var netRate = ret - feeRate;

    var brut = futureValue(initial, monthly, years, ret);           // sans aucun frais
    var valeur = futureValue(initial, monthly, years, netRate);     // net de frais, avant impôt
    var fraisCumules = Math.max(0, brut - valeur);
    var gains = Math.max(0, valeur - verse);

    var impots = 0, economieEntree = 0;
    if(env === "pea"){
      impots = gains * PS_RATE;                                     // >5 ans : PS uniquement
    } else if(env === "cto"){
      impots = gains * 0.30;                                        // PFU 30 %
    } else if(env === "av"){
      var abatt = couple ? 9200 : 4600;                            // >8 ans
      impots = gains * PS_RATE + Math.max(0, gains - abatt) * 0.075;
    } else if(env === "per"){
      economieEntree = verse * tmi;                                 // déduction à l'entrée
      impots = verse * tmi + gains * 0.30;                          // sortie : capital à la TMI + gains PFU
    }
    var capitalNet = valeur - impots;
    return {
      verse:verse, brut:brut, valeurAvantImpot:valeur, fraisCumules:fraisCumules,
      gains:gains, impots:impots, capitalNet:capitalNet, economieEntree:economieEntree,
      netReel:capitalNet + economieEntree
    };
  }

  var Fiscal = {
    IR_BRACKETS: IR_BRACKETS,
    IR_PLAFOND_DEMI_PART: IR_PLAFOND_DEMI_PART,
    PS_RATE: PS_RATE,
    irDecote: irDecote,
    irParts: irParts,
    irTaxOnQuotient: irTaxOnQuotient,
    irMarginalRate: irMarginalRate,
    loanMonthly: loanMonthly,
    loanCapacity: loanCapacity,
    futureValue: futureValue,
    investEnvelope: investEnvelope
  };

  if(typeof module !== "undefined" && module.exports){ module.exports = Fiscal; }
  root.Fiscal = Fiscal;
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : this));
