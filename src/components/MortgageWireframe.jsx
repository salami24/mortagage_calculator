// MortgageWireframe.jsx
// Single-file React component wireframe for a mortgage calculator
// Tailwind CSS utility classes used for styling (requires Tailwind configured in the host project).
// Usage:
// 1) Create a React project (Vite or CRA). 2) Install and configure TailwindCSS.
// 3) Place this file under src/components/MortgageWireframe.jsx and import it in App.jsx.
// 4) Run `npm run dev` / `npm start` to preview.

import React, { useState, useMemo } from "react";

// Small accessible input component
function InputField({ id, label, type = "number", value, onChange, suffix, min, step, ariaDescribedby }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          min={min}
          step={step}
          aria-describedby={ariaDescribedby}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function StepBadge({ number, title, active }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${active ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
        {number}
      </div>
      <div className="text-sm text-slate-700">{title}</div>
    </div>
  );
}

export default function MortgageWireframe() {
  // Form state
  const [loanAmount, setLoanAmount] = useState(350000);
  const [interestRate, setInterestRate] = useState(3.5);
  const [termYears, setTermYears] = useState(30);
  const [downPayment, setDownPayment] = useState(70000);
  const [propertyTax, setPropertyTax] = useState(3500);
  const [homeInsurance, setHomeInsurance] = useState(1200);
  const [extraPayment, setExtraPayment] = useState(0);
  const [showAmortization, setShowAmortization] = useState(false);

  // Derived values
  const principal = Math.max(0, loanAmount - downPayment);

  const monthlyPayment = useMemo(() => {
    const r = interestRate / 100 / 12; // monthly rate
    const n = termYears * 12;
    if (r === 0) return principal / n;
    const payment = (principal * r) / (1 - Math.pow(1 + r, -n));
    return Number(payment.toFixed(2));
  }, [principal, interestRate, termYears]);

  const monthlyTaxes = useMemo(() => (propertyTax / 12).toFixed(2), [propertyTax]);
  const monthlyInsurance = useMemo(() => (homeInsurance / 12).toFixed(2), [homeInsurance]);

  const totalMonthly = useMemo(() => {
    const total = Number(monthlyPayment) + Number(monthlyTaxes) + Number(monthlyInsurance) + Number(extraPayment || 0);
    return total.toFixed(2);
  }, [monthlyPayment, monthlyTaxes, monthlyInsurance, extraPayment]);

  // Simple amortization (first 12 rows for preview)
  function generateAmortizationPreview() {
    const rows = [];
    let bal = principal;
    const r = interestRate / 100 / 12;
    for (let i = 1; i <= Math.min(12, termYears * 12); i++) {
      const interest = bal * r;
      const principalPaid = monthlyPayment - interest + Number(extraPayment || 0);
      bal = Math.max(0, bal - principalPaid);
      rows.push({ month: i, interest: interest.toFixed(2), principalPaid: principalPaid.toFixed(2), balance: bal.toFixed(2) });
      if (bal <= 0) break;
    }
    return rows;
  }

  const amortPreview = useMemo(generateAmortizationPreview, [principal, monthlyPayment, interestRate, extraPayment, termYears]);

  // Accessibility: describe summary for screen readers
  const summaryAria = `Estimated monthly principal & interest ${monthlyPayment} dollars. Total monthly (including taxes & insurance) ${totalMonthly} dollars.`;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Mortgage Calculator — Wireframe</h1>
        <p className="text-sm text-slate-600 mt-1">Clear flow, accessible controls, responsive layout. Use this as a base for user testing.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: form + steps */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-4 items-center">
                <StepBadge number={1} title="Loan details" active />
                <StepBadge number={2} title="Cost & extras" />
                <StepBadge number={3} title="Review" />
              </div>
              <div className="text-xs text-slate-500">Estimated time: <strong>1–2 min</strong></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField id="loanAmount" label="Home price / loan amount" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} suffix="$" min={0} />
              <InputField id="downPayment" label="Down payment" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} suffix="$" min={0} />
              <InputField id="interestRate" label="Interest rate" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} suffix="%" step={0.01} min={0} />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField id="termYears" label="Term (years)" value={termYears} onChange={(e) => setTermYears(Number(e.target.value))} min={1} step={1} />
              <InputField id="extraPayment" label="Extra monthly payment" value={extraPayment} onChange={(e) => setExtraPayment(Number(e.target.value))} suffix="$" />
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700 mb-1">Payment frequency</label>
                <select className="rounded-lg border border-slate-300 px-3 py-2" defaultValue="monthly" aria-label="Payment frequency">
                  <option value="monthly">Monthly</option>
                  <option value="biweekly">Bi-weekly</option>
                </select>
              </div>
            </div>

            <div className="mt-6 border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <InputField id="propertyTax" label="Annual property tax" value={propertyTax} onChange={(e) => setPropertyTax(Number(e.target.value))} suffix="$" />
              <InputField id="homeInsurance" label="Annual home insurance" value={homeInsurance} onChange={(e) => setHomeInsurance(Number(e.target.value))} suffix="$" />
              <div className="flex flex-col justify-end">
                <button
                  onClick={() => setShowAmortization((s) => !s)}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-700"
                >
                  {showAmortization ? 'Hide amortization' : 'Show amortization preview'}
                </button>
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-500">Tips: Keep inputs simple — use inline help or tooltips for complicated terms (PMI, escrow, APR).</div>
          </div>

          {/* Amortization / details card */}
          {showAmortization && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold mb-3">Amortization preview (first 12 months)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="text-slate-600">
                      <th className="py-2 pr-4">Month</th>
                      <th className="py-2 pr-4">Interest</th>
                      <th className="py-2 pr-4">Principal</th>
                      <th className="py-2 pr-4">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortPreview.map((r) => (
                      <tr key={r.month} className="odd:bg-slate-50">
                        <td className="py-2 pr-4">{r.month}</td>
                        <td className="py-2 pr-4">${r.interest}</td>
                        <td className="py-2 pr-4">${r.principalPaid}</td>
                        <td className="py-2 pr-4">${r.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right column: summary and actions */}
        <aside className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold">Quick summary</h2>
          <p className="text-sm text-slate-600 mt-1">An accessible, scannable summary card helps users decide whether to continue.</p>

          <div className="mt-4 space-y-3">
            <div className="rounded-lg p-3 bg-slate-50">
              <div className="flex items-baseline justify-between">
                <div className="text-sm text-slate-600">Principal & interest</div>
                <div className="text-xl font-semibold">${monthlyPayment}</div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div className="text-sm text-slate-600">Taxes (monthly)</div>
                <div className="text-sm">${monthlyTaxes}</div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div className="text-sm text-slate-600">Insurance (monthly)</div>
                <div className="text-sm">${monthlyInsurance}</div>
              </div>
              <div className="border-t mt-3 pt-3 flex items-baseline justify-between">
                <div className="text-sm font-medium">Estimated total</div>
                <div className="text-lg font-bold">${totalMonthly}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="px-3 py-2 rounded-lg border border-slate-300 text-sm">Reset</button>
              <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">Save estimate</button>
            </div>

            <div className="mt-3 text-xs text-slate-500" role="status" aria-live="polite" aria-atomic="true">
              <span className="sr-only">Summary</span>
              <div>{summaryAria}</div>
            </div>

            <div className="mt-4">
              <label className="text-xs text-slate-600">Shareable permalink</label>
              <div className="mt-1 flex gap-2">
                <input className="rounded-lg border border-slate-200 px-2 py-1 text-sm flex-1" value="example.com/estimate/abc123" readOnly />
                <button className="px-3 py-1 rounded-lg border bg-white">Copy</button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer: presentation notes (hidden visually but useful for team) */}
      <div className="sr-only">
        Presentation notes: This wireframe prioritizes clarity and progressive disclosure. The form groups inputs into three clear steps and shows a short amortization preview. The right-hand summary card gives an immediate answer for users who want a quick number. Consider adding charting (savings vs. time), export (PDF/CSV), and deeper accessibility checks before full development.
      </div>

      {/* Lightweight focus-group guide as comments for designers/researchers */}
      {/*
        Focus Group Script (short):
        1. Intro (1 min): Explain the goal — faster, clearer mortgage estimates.
        2. Task (3–5 min): Ask participants to enter a home price, down payment, and interest rate for a typical purchase and find the estimated total monthly payment.
        3. Probe (5 min): Ask about clarity of labels (PMI, escrow?), the usefulness of the amortization preview, whether they'd change frequency or add more details.
        4. Wrap-up (2 min): Collect top 3 likes/dislikes and ask for suggestions.

        Usability checklist to iterate:
        - Are labels understood? (e.g., loan vs. home price, APR vs. interest rate)
        - Is the summary card sufficient to make quick decisions?
        - Is the amortization preview helpful or overwhelming?
        - Does the layout work on mobile (single-column flow)?

        Next dev steps:
        - Add deep-linking for saved estimates (server-side or encoded params).
        - Replace preview table with a simple chart for non-technical users.
        - Add keyboard-first interactions, form validation, unit tests.
      */}
    </div>
  );
}
