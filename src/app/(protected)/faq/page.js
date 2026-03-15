"use client";

import { ChevronDownIcon } from "@/components/Icons";

const faq = [
  {
    category: "Billing",
    items: [
      {
        q: "How do I download the billing statement?",
        a: "Go to Billing and click “Download Bill as PDF”. The PDF includes a full weekly breakdown and totals.",
      },
      {
        q: "Why is Billing empty in Administrator mode?",
        a: "Admins must select a center first (using the center selector) before billing data is shown.",
      },
      {
        q: "What does the yellow totals row mean?",
        a: "It summarizes the totals for the displayed weekly breakdown (Total Revenue, CO Share, Teacher Share, Lesson Share).",
      },
    ],
  },
  {
    category: "Dashboard",
    items: [
      {
        q: "Why do I see “No center selected”?",
        a: "Administrator accounts must select a center first. Center Owners automatically see their assigned center.",
      },
      {
        q: "What is “All Day Book/Open”?",
        a: "It indicates whether the center’s all-day booking/day book is currently open for entries.",
      },
    ],
  },
  {
    category: "Support",
    items: [
      {
        q: "How do I reset a Center Owner password?",
        a: "Admins can reset passwords in Admin → Accounts using the Reset Password button.",
      },
      {
        q: "Is this connected to a backend yet?",
        a: "This version is UI + client-side demo functionality only (stored in your browser localStorage).",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-extrabold text-slate-800">FAQ</h1>
        <p className="mt-1 text-sm text-slate-500">Frequently asked questions about billing, dashboard, and support.</p>
      </div>

      <div className="space-y-6">
        {faq.map((section) => (
          <section key={section.category}>
            <div className="mb-3 text-xs font-extrabold uppercase tracking-widest text-[#1a3c8f]">
              {section.category}
            </div>
            <div className="space-y-3">
              {section.items.map((item) => (
                <details
                  key={item.q}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-slate-800 hover:bg-[#fafbff]">
                    <span>{item.q}</span>
                    <ChevronDownIcon className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-600">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

