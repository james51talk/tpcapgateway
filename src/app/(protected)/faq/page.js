"use client";

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
        a: "Admins must select a center from the dropdown in the header before billing data is shown.",
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
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">FAQ</h1>
        <p className="mt-1 text-sm text-zinc-600">Common questions organized by category.</p>
      </div>

      <div className="space-y-6">
        {faq.map((section) => (
          <section
            key={section.category}
            className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200"
          >
            <div className="border-b border-zinc-100 px-4 py-4">
              <div className="text-sm font-semibold text-zinc-900">{section.category}</div>
            </div>
            <div className="divide-y divide-zinc-100">
              {section.items.map((item) => (
                <details key={item.q} className="group px-4 py-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-zinc-900">
                    <div className="flex items-center justify-between gap-3">
                      <span>{item.q}</span>
                      <span className="text-zinc-400 transition-transform group-open:rotate-45">+</span>
                    </div>
                  </summary>
                  <div className="mt-2 text-sm leading-7 text-zinc-600">{item.a}</div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

