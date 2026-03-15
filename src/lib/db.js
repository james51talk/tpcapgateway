export const DB_KEY = "tpcap.db.v1";

const seedDB = {
  centers: [
    { id: "c1", name: "TPCAP Center - Manila" },
    { id: "c2", name: "TPCAP Center - Cebu" },
    { id: "c3", name: "TPCAP Center - Davao" },
  ],
  accounts: [
    { id: "a_admin", role: "admin", username: "admin", password: "admin123" },
    {
      id: "a_owner_1",
      role: "center_owner",
      username: "owner.manila",
      password: "owner123",
      centerId: "c1",
    },
    {
      id: "a_owner_2",
      role: "center_owner",
      username: "owner.cebu",
      password: "owner123",
      centerId: "c2",
    },
  ],
};

export function getSeedDB() {
  return structuredClone(seedDB);
}

export function loadDB() {
  if (typeof window === "undefined") return getSeedDB();
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    if (!raw) {
      const seeded = getSeedDB();
      window.localStorage.setItem(DB_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (!parsed?.centers || !parsed?.accounts) throw new Error("Invalid DB");
    return parsed;
  } catch {
    const seeded = getSeedDB();
    window.localStorage.setItem(DB_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

export function saveDB(db) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DB_KEY, JSON.stringify(db));
  window.dispatchEvent(new Event("tpcap:store"));
}

export function newId(prefix) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function findCenterById(db, centerId) {
  return db.centers.find((c) => c.id === centerId) ?? null;
}

export function findAccountById(db, accountId) {
  return db.accounts.find((a) => a.id === accountId) ?? null;
}

