/*
 * Compalgo – romantic compatibility algorithm
 * -------------------------------------------
 * Line-by-line JavaScript translation of the original Ruby on Rails code
 * (app/models/name_compatibility.rb, birth_date_compatibility.rb,
 * birth_order_compatibility.rb and app/controllers/compatibility_controller.rb).
 *
 * Everything runs in the visitor's browser. Nothing is stored or sent anywhere.
 *
 * The small helpers below copy Ruby's behaviour exactly, so the scores are
 * identical to the original site, including its quirks:
 *   - "abc"[-2..]  -> "bc", but "a"[-2..] and ""[-2..] -> nil (null here)
 *   - ""[0]        -> nil,  but ""[0..1] -> ""  (empty string, not nil)
 *   - nil == nil   -> true, but "" == nil -> false
 */
(function (global) {
  'use strict';

  // ---------- Ruby-like string helpers ----------
  function chars(s) { return Array.from(s); }      // Ruby counts characters, not bytes

  function noMethod(what) {                         // like Ruby's NoMethodError on nil
    throw new Error('undefined method for nil (' + what + ')');
  }
  function req(s) { if (s === null || s === undefined) noMethod('string'); return s; }

  // s[0]
  function at0(s) { var c = chars(req(s)); return c.length ? c[0] : null; }
  // s&.[](0)
  function sAt0(s) { return (s === null || s === undefined) ? null : at0(s); }
  // s[0..1]
  function first2(s) { return chars(req(s)).slice(0, 2).join(''); }
  // s&.[](0..1)
  function sFirst2(s) { return (s === null || s === undefined) ? null : first2(s); }
  // s[-2..]
  function last2(s) { var c = chars(req(s)); return c.length < 2 ? null : c.slice(-2).join(''); }
  // s&.[](-2..)
  function sLast2(s) { return (s === null || s === undefined) ? null : last2(s); }
  // x.downcase (fails on nil, like Ruby)
  function dc(x) { if (x === null || x === undefined) noMethod('downcase'); return x.toLowerCase(); }
  // x&.downcase
  function sdc(x) { return (x === null || x === undefined) ? null : x.toLowerCase(); }
  // x.to_s.empty?
  function isEmpty(x) { return x === null || x === undefined || x === ''; }
  // Ruby ==  (nil == nil is true, "" == nil is false)
  function eq(a, b) { return a === b; }

  // ---------- NameCompatibility ----------
  function initials1(i1, i2) {
    var points = 0;
    // First name to first name comparison
    if (eq(dc(at0(i1.first_name)), dc(at0(i2.first_name)))) points += 88;

    // First name to middle name comparisons (28 points each)
    if (eq(dc(at0(i1.first_name)), sdc(sAt0(i2.middle_name))) && !isEmpty(i2.middle_name)) points += 28;
    if (eq(dc(at0(i2.first_name)), sdc(sAt0(i1.middle_name))) && !isEmpty(i1.middle_name)) points += 28;

    // First name to last name comparisons (28 points each)
    if (eq(dc(at0(i1.first_name)), dc(at0(i2.last_name)))) points += 28;
    if (eq(dc(at0(i2.first_name)), dc(at0(i1.last_name)))) points += 28;

    // First name to maiden name comparisons (28 points each)
    if (eq(dc(at0(i1.first_name)), sdc(sAt0(i2.maiden_name)))) points += 28;
    if (eq(dc(at0(i2.first_name)), sdc(sAt0(i1.maiden_name)))) points += 28;

    // Middle name to middle name comparison (28 points)
    if (eq(sdc(sAt0(i1.middle_name)), sdc(sAt0(i2.middle_name))) && !isEmpty(i1.middle_name) && !isEmpty(i2.middle_name)) points += 28;

    // Middle name to last name comparisons (28 points each)
    if (eq(sdc(sAt0(i1.middle_name)), dc(at0(i2.last_name))) && !isEmpty(i1.middle_name)) points += 28;
    if (eq(sdc(sAt0(i2.middle_name)), dc(at0(i1.last_name))) && !isEmpty(i2.middle_name)) points += 28;

    // Middle name to maiden name comparisons (28 points each)
    if (eq(sdc(sAt0(i1.middle_name)), sdc(sAt0(i2.maiden_name))) && !isEmpty(i1.middle_name)) points += 28;
    if (eq(sdc(sAt0(i2.middle_name)), sdc(sAt0(i1.maiden_name))) && !isEmpty(i2.middle_name)) points += 28;

    // Last name to last name comparison (28 points)
    if (eq(dc(at0(i1.last_name)), dc(at0(i2.last_name)))) points += 28;

    // Last name to maiden name comparisons (28 points each)
    if (eq(dc(at0(i1.last_name)), sdc(sAt0(i2.maiden_name)))) points += 28;
    if (eq(dc(at0(i2.last_name)), sdc(sAt0(i1.maiden_name)))) points += 28;
    return points;
  }

  function initials2(i1, i2) {
    var points = 0;
    // First name to first name comparison (56 points)
    if (eq(sdc(first2(i1.first_name)), sdc(first2(i2.first_name)))) points += 56;

    // First name to middle name comparisons (28 points each)
    if (eq(sdc(first2(i1.first_name)), sdc(sFirst2(i2.middle_name))) && !isEmpty(i2.middle_name)) points += 28;
    if (eq(sdc(first2(i2.first_name)), sdc(sFirst2(i1.middle_name))) && !isEmpty(i1.middle_name)) points += 28;

    // First name to last name comparisons (28 points each)
    if (eq(sdc(first2(i1.first_name)), sdc(first2(i2.last_name)))) points += 28;
    if (eq(sdc(first2(i2.first_name)), sdc(first2(i1.last_name)))) points += 28;

    // First name to maiden name comparisons (28 points each)
    if (eq(sdc(first2(i1.first_name)), sdc(sFirst2(i2.maiden_name)))) points += 28;
    if (eq(sdc(first2(i2.first_name)), sdc(sFirst2(i1.maiden_name)))) points += 28;

    // Middle name to middle name comparison (28 points)
    if (eq(sdc(sFirst2(i1.middle_name)), sdc(sFirst2(i2.middle_name))) && !isEmpty(i1.middle_name) && !isEmpty(i2.middle_name)) points += 28;

    // Middle name to last name comparisons (28 points each)
    if (eq(sdc(sFirst2(i1.middle_name)), sdc(first2(i2.last_name))) && !isEmpty(i1.middle_name)) points += 28;
    if (eq(sdc(sFirst2(i2.middle_name)), sdc(first2(i1.last_name))) && !isEmpty(i2.middle_name)) points += 28;

    // Middle name to maiden name comparisons (28 points each)
    if (eq(sdc(sFirst2(i1.middle_name)), sdc(sFirst2(i2.maiden_name))) && !isEmpty(i1.middle_name)) points += 28;
    if (eq(sdc(sFirst2(i2.middle_name)), sdc(sFirst2(i1.maiden_name))) && !isEmpty(i2.middle_name)) points += 28;

    // Last name to last name comparison (28 points)
    if (eq(sdc(first2(i1.last_name)), sdc(first2(i2.last_name)))) points += 28;

    // Last name to maiden name comparisons (28 points each)
    if (eq(sdc(first2(i1.last_name)), sdc(sFirst2(i2.maiden_name)))) points += 28;
    if (eq(sdc(first2(i2.last_name)), sdc(sFirst2(i1.maiden_name)))) points += 28;
    return points;
  }

  function firstLast(i1, i2) {
    var points = 0;
    // First name to first name comparisons (28 points each)
    if (eq(sdc(first2(i1.first_name)), sdc(last2(i2.first_name)))) points += 28;
    if (eq(sdc(last2(i1.first_name)), sdc(first2(i2.first_name)))) points += 28;

    // First name to middle name comparisons (28 points each)
    if (eq(sdc(first2(i1.first_name)), sdc(sLast2(i2.middle_name)))) points += 28;
    if (eq(sdc(last2(i1.first_name)), sdc(sFirst2(i2.middle_name)))) points += 28;
    if (eq(sdc(sFirst2(i1.middle_name)), sdc(last2(i2.first_name)))) points += 28;
    if (eq(sdc(sLast2(i1.middle_name)), sdc(first2(i2.first_name)))) points += 28;

    // First name to last name comparisons (56 points each)
    if (eq(sdc(first2(i1.first_name)), sdc(last2(i2.last_name)))) points += 56;
    if (eq(sdc(last2(i1.first_name)), sdc(first2(i2.last_name)))) points += 56;
    if (eq(sdc(first2(i1.last_name)), sdc(last2(i2.first_name)))) points += 56;
    if (eq(sdc(last2(i1.last_name)), sdc(first2(i2.first_name)))) points += 56;

    // First name to maiden name comparisons (28 points each)
    if (eq(sdc(first2(i1.first_name)), sdc(sLast2(i2.maiden_name)))) points += 28;
    if (eq(sdc(last2(i1.first_name)), sdc(sFirst2(i2.maiden_name)))) points += 28;
    if (eq(sdc(sFirst2(i1.maiden_name)), sdc(last2(i2.first_name)))) points += 28;
    if (eq(sdc(sLast2(i1.maiden_name)), sdc(first2(i2.first_name)))) points += 28;

    // Middle name to middle name comparisons (28 points each)
    if (eq(sdc(sFirst2(i1.middle_name)), sdc(sLast2(i2.middle_name)))) points += 28;
    if (eq(sdc(sLast2(i1.middle_name)), sdc(sFirst2(i2.middle_name)))) points += 28;

    // Middle name to last name comparisons (28 points each)
    if (eq(sdc(sFirst2(i1.middle_name)), sdc(last2(i2.last_name)))) points += 28;
    if (eq(sdc(sLast2(i1.middle_name)), sdc(first2(i2.last_name)))) points += 28;
    if (eq(sdc(first2(i1.last_name)), sdc(sLast2(i2.middle_name)))) points += 28;
    if (eq(sdc(last2(i1.last_name)), sdc(sFirst2(i2.middle_name)))) points += 28;

    // Middle name to maiden name comparisons (28 points each)
    if (eq(sdc(sFirst2(i1.middle_name)), sdc(sLast2(i2.maiden_name)))) points += 28;
    if (eq(sdc(sLast2(i1.middle_name)), sdc(sFirst2(i2.maiden_name)))) points += 28;
    if (eq(sdc(sFirst2(i1.maiden_name)), sdc(sLast2(i2.middle_name)))) points += 28;
    if (eq(sdc(sLast2(i1.maiden_name)), sdc(sFirst2(i2.middle_name)))) points += 28;

    // Last name to last name comparisons (28 points each)
    if (eq(sdc(first2(i1.last_name)), sdc(last2(i2.last_name)))) points += 28;
    if (eq(sdc(last2(i1.last_name)), sdc(first2(i2.last_name)))) points += 28;

    // Last name to maiden name comparisons (28 points each)
    if (eq(sdc(first2(i1.last_name)), sdc(sLast2(i2.maiden_name)))) points += 28;
    if (eq(sdc(last2(i1.last_name)), sdc(sFirst2(i2.maiden_name)))) points += 28;
    if (eq(sdc(sFirst2(i1.maiden_name)), sdc(last2(i2.last_name)))) points += 28;
    if (eq(sdc(sLast2(i1.maiden_name)), sdc(first2(i2.last_name)))) points += 28;
    return points;
  }

  function rhymes(i1, i2) {
    var points = 0;
    // First name to first name comparison
    if (eq(sdc(last2(i1.first_name)), sdc(last2(i2.first_name)))) points += 48;

    // First name to middle name comparisons
    if (eq(sdc(last2(i1.first_name)), sdc(last2(i2.middle_name))) && !isEmpty(i2.middle_name)) points += 48;
    if (eq(sdc(last2(i1.middle_name)), sdc(last2(i2.first_name))) && !isEmpty(i1.middle_name)) points += 48;

    // First name to last name comparisons
    if (eq(sdc(last2(i1.first_name)), sdc(last2(i2.last_name)))) points += 48;
    if (eq(sdc(last2(i1.last_name)), sdc(last2(i2.first_name)))) points += 48;

    // First name to maiden name comparisons
    if (eq(sdc(last2(i1.first_name)), sdc(last2(i2.maiden_name)))) points += 48;
    if (eq(sdc(last2(i1.maiden_name)), sdc(last2(i2.first_name)))) points += 48;

    // Middle name to middle name comparison
    if (eq(sdc(last2(i1.middle_name)), sdc(last2(i2.middle_name))) && !isEmpty(i1.middle_name) && !isEmpty(i2.middle_name)) points += 48;

    // Middle name to last name comparisons
    if (eq(sdc(last2(i1.middle_name)), sdc(last2(i2.last_name))) && !isEmpty(i1.middle_name)) points += 48;
    if (eq(sdc(last2(i1.last_name)), sdc(last2(i2.middle_name))) && !isEmpty(i2.middle_name)) points += 48;

    // Middle name to maiden name comparisons
    if (eq(sdc(last2(i1.middle_name)), sdc(last2(i2.maiden_name))) && !isEmpty(i1.middle_name)) points += 48;
    if (eq(sdc(last2(i1.maiden_name)), sdc(last2(i2.middle_name))) && !isEmpty(i2.middle_name)) points += 48;

    // Last name to last name comparison
    if (eq(sdc(last2(i1.last_name)), sdc(last2(i2.last_name)))) points += 48;

    // Last name to maiden name comparisons
    if (eq(sdc(last2(i1.last_name)), sdc(last2(i2.maiden_name)))) points += 48;
    if (eq(sdc(last2(i1.maiden_name)), sdc(last2(i2.last_name)))) points += 48;
    return points;
  }

  // [first, middle, last, maiden].compact.join.downcase
  function fullName(i) {
    return [i.first_name, i.middle_name, i.last_name, i.maiden_name]
      .filter(function (x) { return x !== null && x !== undefined; })
      .join('').toLowerCase();
  }

  function letterGroups(i1, i2) {
    var points = 0;
    var name1 = chars(fullName(i1));
    var name2 = fullName(i2);
    var i;
    // Groups of 2 letters (every match counts)
    for (i = 0; i <= name1.length - 2; i++) {
      if (name2.indexOf(name1.slice(i, i + 2).join('')) !== -1) points += 28;
    }
    // Groups of 3 letters (counted once)
    for (i = 0; i <= name1.length - 3; i++) {
      if (name2.indexOf(name1.slice(i, i + 3).join('')) !== -1) { points += 28; break; }
    }
    // Groups of 4 letters (counted once)
    for (i = 0; i <= name1.length - 4; i++) {
      if (name2.indexOf(name1.slice(i, i + 4).join('')) !== -1) { points += 56; break; }
    }
    return points;
  }

  function commonLetters(i1, i2) {
    var name1 = chars(fullName(i1));
    var name2 = chars(fullName(i2));
    var count = 0;
    var shorter = name1.length <= name2.length ? name1 : name2;
    var longer = (name1.length <= name2.length ? name2 : name1).slice();
    shorter.forEach(function (letter) {
      var idx = longer.indexOf(letter);
      if (idx !== -1) { count += 1; longer.splice(idx, 1); }
    });
    var shorterLength = Math.min(name1.length, name2.length);
    var raw = count / shorterLength * 100;
    if (!isFinite(raw)) throw new Error('empty names');   // Ruby: NaN.round raises
    var pct = Math.round(raw);                             // same as Ruby's round for positive numbers
    if (pct <= 20) return 0;
    if (pct <= 30) return 8;
    if (pct <= 40) return 18;
    if (pct <= 50) return 28;
    if (pct <= 60) return 56;
    if (pct <= 70) return 88;
    if (pct <= 80) return 56;
    return 0;                                              // 81..100
  }

  // ---------- BirthOrderCompatibility ----------
  function birthOrder(i1, i2) {
    var o1 = i1.birth_order, o2 = i2.birth_order;
    if (o1 === o2) return 88;
    if ((o1 === 'First Born' && o2 === 'Only Child') || (o1 === 'Only Child' && o2 === 'First Born')) return 56;
    return 0;
  }

  // ---------- BirthDateCompatibility ----------
  // Dates come from <input type="date"> as "YYYY-MM-DD".
  function dayNumber(y, mo, d) {
    var t = new Date(Date.UTC(2000, mo - 1, d));
    t.setUTCFullYear(y);
    return Math.round(t.getTime() / 86400000);
  }
  function parseDate(s) {
    var m = /^(\d{4,})-(\d{2})-(\d{2})$/.exec(String(s || ''));
    if (!m) throw new Error('invalid date');
    var y = parseInt(m[1], 10), mo = parseInt(m[2], 10), d = parseInt(m[3], 10);
    var t = new Date(Date.UTC(2000, mo - 1, d));
    t.setUTCFullYear(y);
    if (t.getUTCFullYear() !== y || t.getUTCMonth() !== mo - 1 || t.getUTCDate() !== d) throw new Error('invalid date');
    return { year: y, month: mo, day: d, n: dayNumber(y, mo, d) };
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  // date.year.to_s[-2..-1]  (nil for one-digit years, which makes Ruby fail)
  function yearDigits(date) {
    var y = String(date.year);
    if (y.length < 2) noMethod('year digits');
    return y.slice(-2);
  }
  function extractDigits(date) { return yearDigits(date) + pad2(date.month) + pad2(date.day); }
  function digitSum(str) { return chars(str).reduce(function (a, c) { return a + parseInt(c, 10); }, 0); }

  function countCommonDigits(d1, d2) {
    var digits1 = chars(extractDigits(d1));
    var digits2 = chars(extractDigits(d2));
    var rem1 = digits1.slice(), rem2 = digits2.slice();
    var exact = 0, i;
    // Count exact position matches first
    for (i = 0; i < digits1.length; i++) if (digits1[i] === digits2[i]) exact++;
    for (i = 0; i < digits1.length; i++) {
      if (digits1[i] === digits2[i]) { rem1[i] = null; rem2[i] = null; }
    }
    // Then remaining matches in any position
    var remaining = 0;
    rem1.filter(function (x) { return x !== null; }).forEach(function (dg) {
      var idx = rem2.indexOf(dg);
      if (idx !== -1) { remaining++; rem2[idx] = null; }
    });
    return exact + remaining;
  }

  function birthDate(i1, i2) {
    var d1 = parseDate(i1.birthdate), d2 = parseDate(i2.birthdate);
    var score = 0;

    // same_or_adjacent_day_score
    var sameDay = d1.year === d2.year && d1.month === d2.month && d1.day === d2.day;
    var oneDayApart = (d1.n === d2.n + 1) || (d1.n === d2.n - 1);
    if (sameDay || oneDayApart) score += 56;

    // same_or_adjacent_day_different_year_score (adjacent days checked in the year 2000)
    if (d1.year !== d2.year) {
      if (d1.month === d2.month && d1.day === d2.day) {
        score += 84;
      } else {
        var n1 = dayNumber(2000, d1.month, d1.day), n2 = dayNumber(2000, d2.month, d2.day);
        if (n1 === n2 + 1 || n1 === n2 - 1) score += 56;
      }
    }

    // digit_sums_score
    if (digitSum(extractDigits(d1)) === digitSum(extractDigits(d2))) score += 56;
    if (digitSum(yearDigits(d1)) === digitSum(yearDigits(d2))) score += 28;
    if (digitSum(pad2(d1.month) + pad2(d1.day)) === digitSum(pad2(d2.month) + pad2(d2.day))) score += 28;

    // common_digits_score
    var common = countCommonDigits(d1, d2);
    if (common === 5) score += 84;
    else if (common === 4) score += 56;
    else if (common === 3) score += 28;
    return score;
  }

  // ---------- Total (as in CompatibilityController#calculate) ----------
  function calculate(i1, i2) {
    var parts = {
      initials1: initials1(i1, i2),
      initials2: initials2(i1, i2),
      firstLast: firstLast(i1, i2),
      rhymes: rhymes(i1, i2),
      letterGroups: letterGroups(i1, i2),
      commonLetters: commonLetters(i1, i2),
      birthOrder: birthOrder(i1, i2),
      birthDate: birthDate(i1, i2)
    };
    var total = 0;
    for (var k in parts) total += parts[k];
    parts.total = total;
    return parts;
  }

  global.RomanticAlgo = { calculate: calculate };
})(typeof window !== 'undefined' ? window : globalThis);

// ---------- Form handling on the calculator page ----------
(function () {
  if (typeof document === 'undefined') return;
  var form = document.getElementById('romantic-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    function person(n) {
      function v(f) { return form.elements['individual' + n + '_' + f].value; }
      return {
        first_name: v('first_name'), middle_name: v('middle_name'),
        last_name: v('last_name'), maiden_name: v('maiden_name'),
        birthdate: v('birthdate'), birth_order: v('birth_order')
      };
    }
    var error = document.getElementById('form-error');
    try {
      var result = window.RomanticAlgo.calculate(person(1), person(2));
      // The score travels after the # in the address, which browsers never send to any server.
      window.location.href = form.getAttribute('data-results') + '#score=' + result.total;
    } catch (err) {
      error.hidden = false;
      error.focus();
    }
  });
})();
