import { mockAccounts } from "@/lib/mockAccounts";
import { query } from "@/lib/mysql";

const useDbAccounts = process.env.USE_DB_ACCOUNTS === "true";

function getAccountStore() {
  if (!globalThis.__mockAccountsStore) {
    globalThis.__mockAccountsStore = structuredClone(mockAccounts);
  }
  return globalThis.__mockAccountsStore;
}

export async function GET() {
  if (!useDbAccounts) {
    return new Response(JSON.stringify(getAccountStore()), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const accounts = await query("SELECT account_id AS id, username, password, role, center_id AS centerId FROM accounts");
    return new Response(JSON.stringify(accounts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return new Response(JSON.stringify(getAccountStore()), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request) {
  if (!useDbAccounts) {
    const { username, password, role, centerId } = await request.json();
    const store = getAccountStore();
    const maxId = store.reduce((m, a) => (typeof a.id === "number" ? Math.max(m, a.id) : m), 0);
    const next = {
      id: maxId + 1,
      username,
      password,
      role,
      centerId: centerId ?? null,
    };
    store.push(next);
    return new Response(JSON.stringify(next), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { username, password, role, centerId } = await request.json();
    const result = await query(
      "INSERT INTO accounts (username, password, role, center_id) VALUES (?, ?, ?, ?)",
      [username, password, role, centerId]
    );
    const newAccount = {
      id: result.insertId,
      username,
      password,
      role,
      centerId,
    };
    return new Response(JSON.stringify(newAccount), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating account:", error);
    return new Response(JSON.stringify({ error: "Failed to create account" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
