function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickNumber(seed, min, max) {
  const t = seed / 0xffffffff;
  return Math.floor(min + t * (max - min + 1));
}

function cleanNumber(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return 0;
  return Math.abs(num);
}

export function formatInt(n) {
  return new Intl.NumberFormat("en-PH").format(cleanNumber(n)).replaceAll("-", "");
}

export function formatPHP(n) {
  const formatted = new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cleanNumber(n));
  return `₱ ${formatted.replaceAll("-", "")}`;
}

export function getDashboardKpis(centerId) {
  const seed = hashString(centerId || "none");
  const activeOnlist = pickNumber(seed ^ 0x1111, 10, 90);
  const overallOnlist = activeOnlist + pickNumber(seed ^ 0x2222, 5, 120);
  const attrition = pickNumber(seed ^ 0x3333, 1, 25);
  const coRevenue = pickNumber(seed ^ 0x4444, 30_000, 250_000);
  const teacherRevenue = pickNumber(seed ^ 0x5555, 20_000, 220_000);
  const coMonthlyRevenue = pickNumber(seed ^ 0x6666, 60_000, 480_000);
  const coShare = pickNumber(seed ^ 0x7777, 35, 65);
  const teacherShare = 100 - coShare;
  const allDayBookOpen = (seed & 1) === 0 ? "Open" : "Closed";

  return [
    { title: "Active Onlist", value: formatInt(activeOnlist) },
    { title: "Overall Onlist", value: formatInt(overallOnlist) },
    { title: "Attrition", value: `${attrition}%` },
    { title: "CO Revenue", value: formatPHP(coRevenue) },
    { title: "Teacher Revenue", value: formatPHP(teacherRevenue) },
    { title: "CO Monthly Revenue", value: formatPHP(coMonthlyRevenue) },
    { title: "CO Share", value: `${coShare}%` },
    { title: "Teacher Share", value: `${teacherShare}%` },
    { title: "All Day Book/Open", value: allDayBookOpen },
  ];
}

export function getBillingData(centerId) {
  const seed = hashString(centerId || "none");
  const startDate = new Date(); // Current date
  startDate.setDate(startDate.getDate() - 28); // Start 4 weeks ago
  const weeks = Array.from({ length: 12 }).map((_, i) => {
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const startMonth = monthNames[weekStart.getMonth()];
    const endMonth = monthNames[weekEnd.getMonth()];
    const weekLabel = startMonth === endMonth 
      ? `${startMonth} ${weekStart.getDate()}-${weekEnd.getDate()}`
      : `${startMonth} ${weekStart.getDate()}-${endMonth} ${weekEnd.getDate()}`;

    const s = seed ^ (0x9000 + i * 17);
    const total = pickNumber(s, 30_000, 120_000);
    const coSharePct = pickNumber(s ^ 0x1, 35, 65);
    const teacherSharePct = 100 - coSharePct;
    const lessonShare = pickNumber(s ^ 0x2, 15_000, 80_000);
    const coShare = Math.round((total * coSharePct) / 100);
    const teacherShare = total - coShare;
    return {
      week: weekLabel,
      startDate: new Date(weekStart),
      endDate: new Date(weekEnd),
      totalRevenue: total,
      coShare,
      teacherShare,
      lessonShare,
    };
  });

  const totals = weeks.reduce(
    (acc, w) => {
      acc.totalRevenue += w.totalRevenue;
      acc.coShare += w.coShare;
      acc.teacherShare += w.teacherShare;
      acc.lessonShare += w.lessonShare;
      return acc;
    },
    { totalRevenue: 0, coShare: 0, teacherShare: 0, lessonShare: 0 }
  );

  const weeklyBilled = totals.totalRevenue;

  return { weeks, totals, weeklyBilled };
}

