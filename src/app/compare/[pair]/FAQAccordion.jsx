'use client';

import { useState } from 'react';

function FAQ({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium hover:bg-muted/40 transition-colors"
      >
        <span>{question}</span>
        <span className="text-muted-foreground shrink-0 ml-2">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border bg-muted/20">
          <p className="pt-3">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQAccordion({ faqs }) {
  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <FAQ key={i} question={faq.q} answer={faq.a} />
      ))}
    </div>
  );
}
