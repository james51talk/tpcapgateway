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

export function getWeeksInMonth(year, month) {
  const weeks = [];
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  
  let currentDate = new Date(first);
  
  while (currentDate <= last) {
    const dayOfWeek = currentDate.getDay();
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - dayOfWeek + 1);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    // Only add if week starts in this month
    if (weekStart.getMonth() === month || (weekStart.getMonth() < month && weekEnd.getMonth() === month)) {
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const startMonth = monthNames[weekStart.getMonth()];
      const endMonth = monthNames[weekEnd.getMonth()];
      const label = startMonth === endMonth 
        ? `${startMonth} ${weekStart.getDate()}-${weekEnd.getDate()}`
        : `${startMonth} ${weekStart.getDate()}-${endMonth} ${weekEnd.getDate()}`;
      
      weeks.push({ label, start: new Date(weekStart), end: new Date(weekEnd) });
    }
    
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  return weeks;
}

export function getDashboardKpis(centerId, opts = {}) {
  const { filterType = "week", filterDate = new Date() } = opts;
  
  const seed = hashString(centerId || "none");
  const activeOnlist = pickNumber(seed ^ 0x1111, 25, 90);
  const activeOnlistPrev = pickNumber(seed ^ 0xaaaa, 10, 24);

  
  const overallOnlist = pickNumber(seed ^ 0x2222, 50, 150);
  const overallOnlistPrev = pickNumber(seed ^ 0xbbbb, 30, 49);

  
  const attrition = pickNumber(seed ^ 0x3333, 0, 15);
  const attritionPrev = pickNumber(seed ^ 0xcccc, 16, 30);

  
  const centerCapacity = pickNumber(seed ^ 0x8888, 75, 95);
  const centerCapacityPrev = pickNumber(seed ^ 0xdddd, 50, 74);

  
  const utilization = pickNumber(seed ^ 0x9999, 70, 90);
  const utilizationPrev = pickNumber(seed ^ 0xeeee, 50, 69);

  
  const teacherEarnings = pickNumber(seed ^ 0x4444, 100_000, 250_000);
  const teacherEarningsPrev = pickNumber(seed ^ 0x1111, 50_000, 99_999);

  
  const coEarnings = pickNumber(seed ^ 0x5555, 80_000, 220_000);
  const coEarningsPrev = pickNumber(seed ^ 0x2222, 40_000, 79_999);


  // Helper to calculate percentage change
  const calcPercentChange = (current, previous) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };



  const kpis = [
    { 
      title: "Active Onlist", 
      value: formatInt(activeOnlist),
      previous: formatInt(activeOnlistPrev),
      percentChange: calcPercentChange(activeOnlist, activeOnlistPrev),
      status: activeOnlist > activeOnlistPrev ? "success" : "danger" 
    },
    { 
      title: "Overall Onlist", 
      value: formatInt(overallOnlist),
      previous: formatInt(overallOnlistPrev),
      percentChange: calcPercentChange(overallOnlist, overallOnlistPrev),
      status: overallOnlist > overallOnlistPrev ? "success" : "danger" 
    },
    { 
      title: "Center Capacity", 
      value: `${centerCapacity}%`,
      previous: `${centerCapacityPrev}%`,
      percentChange: centerCapacity - centerCapacityPrev,
      status: centerCapacity > centerCapacityPrev ? "success" : "danger" 
    },
    { 
      title: "Utilization", 
      value: `${utilization}%`,
      previous: `${utilizationPrev}%`,
      percentChange: utilization - utilizationPrev,
      status: utilization > utilizationPrev ? "success" : "danger" 
    },
    { 
      title: "Teacher Earnings", 
      value: formatPHP(teacherEarnings),
      previous: formatPHP(teacherEarningsPrev),
      percentChange: calcPercentChange(teacherEarnings, teacherEarningsPrev),
      status: teacherEarnings > teacherEarningsPrev ? "success" : "danger" 
    },
    { 
      title: "CO Earnings", 
      value: formatPHP(coEarnings),
      previous: formatPHP(coEarningsPrev),
      percentChange: calcPercentChange(coEarnings, coEarningsPrev),
      status: coEarnings > coEarningsPrev ? "success" : "danger" 
    },
    { 
      title: "Attrition", 
      value: `${attrition}%`,
      previous: `${attritionPrev}%`,
      percentChange: attrition - attritionPrev,
      status: attrition < attritionPrev ? "success" : "danger" 
    },
  ];

  // Generate date range
  let dateRange = "";
  if (filterType === "month") {
    const year = filterDate.getFullYear();
    const month = filterDate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const endDate = new Date(year, month + 1, 0);
    dateRange = `${monthNames[month]} 1-${endDate.getDate()}`;
  } else {
    const today = filterDate;
    const dayOfWeek = today.getDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek + 1);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const startMonth = monthNames[startDate.getMonth()];
    const endMonth = monthNames[endDate.getMonth()];
    dateRange = startMonth === endMonth 
      ? `${startMonth} ${startDate.getDate()}-${endDate.getDate()}`
      : `${startMonth} ${startDate.getDate()}-${endMonth} ${endDate.getDate()}`;
  }

  // Calculate summary stats
  const healthyKpis = kpis.filter(k => k.status === "success").length;
  const needsAttention = kpis.filter(k => k.status === "danger").length;
  const healthPercentage = Math.round((healthyKpis / kpis.length) * 100);

  return {
    dateRange,
    kpis,
    summary: {
      healthyKpis,
      needsAttention,
      healthPercentage,
      totalKpis: kpis.length,
    }
  };
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

export function getCenterProfile(centerId, centerName) {
  const seed = hashString(centerId || "none");

  const firstNames = ["Alex", "Jamie", "Sam", "Taylor", "Jordan", "Morgan", "Casey", "Riley"];
  const lastNames = ["Reyes", "Santos", "Garcia", "Dela Cruz", "Mendoza", "Torres", "Flores", "Navarro"];
  const cities = ["Quezon City", "Makati", "Pasig", "Cebu City", "Davao City", "Iloilo City", "Bacolod", "Cagayan de Oro"];
  const streets = ["Quezon Ave", "Ortigas Ave", "Ayala Ave", "Roxas Blvd", "Bonifacio St", "Rizal St", "Osmeña Blvd", "National Hwy"];

  const ownerFirst = firstNames[pickNumber(seed ^ 0x101, 0, firstNames.length - 1)];
  const ownerLast = lastNames[pickNumber(seed ^ 0x202, 0, lastNames.length - 1)];
  const owner = `${ownerFirst} ${ownerLast}`;

  const city = cities[pickNumber(seed ^ 0x303, 0, cities.length - 1)];
  const street = streets[pickNumber(seed ^ 0x404, 0, streets.length - 1)];
  const number = pickNumber(seed ^ 0x505, 10, 999);
  const address = `${number} ${street}, ${city}`;

  const emailUser = `${ownerFirst}.${ownerLast}`.toLowerCase();
  const ownerEmail = `${emailUser}@tpcap.co`;

  const ownerPhone = `+63 9${pickNumber(seed ^ 0x606, 10, 99)} ${pickNumber(seed ^ 0x707, 100, 999)} ${pickNumber(seed ^ 0x808, 1000, 9999)}`;

  return {
    owner,
    ownerEmail,
    ownerPhone,
    location: centerName || "",
    address,
  };
}
