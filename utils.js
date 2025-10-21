function toNumber(v) {
  if (v === null || v === undefined) return 0;
  const s = String(v).replace(/[^0-9.-]+/g, "");
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function formatMoney(n) {
  const num = Number(n) || 0;
  return "$" + num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function setMoneyInput(el, n) {
  if (!el) return;
  el.value = (n === "" || n === undefined) ? "" : formatMoney(n);
}

function enableKeyboardNavigation(scope) {
  if (!scope) return;
  const selector = 'input:not([type="hidden"]):not([disabled]), select:not([disabled]), button:not([disabled])';
  const inputs = Array.from(scope.querySelectorAll(selector)).filter((i) => i.offsetParent !== null);
  inputs.forEach((el, idx) => {
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) inputs[idx - 1]?.focus();
        else inputs[idx + 1]?.focus();
      }
    });
  });
}
