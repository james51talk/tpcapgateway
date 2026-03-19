import { query } from "@/lib/mysql";
import { mockAccounts } from "@/lib/mockAccounts";

const useDbAccounts = process.env.USE_DB_ACCOUNTS === "true";

function getAccountStore() {
  if (!globalThis.__mockAccountsStore) {
    globalThis.__mockAccountsStore = structuredClone(mockAccounts);
  }
  return globalThis.__mockAccountsStore;
}

export async function PUT(request, { params }) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const id = Number(body?.id ?? params?.id);
  const password = body?.password;
  const username = body?.username;

  if (!Number.isFinite(id)) {
    return new Response(JSON.stringify({ error: "Invalid account id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!useDbAccounts) {
    const store = getAccountStore();
    const idx = store.findIndex((a) => Number(a.id) === id);
    if (idx < 0) {
      return new Response(JSON.stringify({ error: "Account not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const next = { ...store[idx] };
    if (typeof password === "string") next.password = password;
    if (typeof username === "string") next.username = username;
    store[idx] = next;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    if (typeof password === "string") {
      await query("UPDATE accounts SET password = ? WHERE account_id = ?", [password, id]);
    }
    if (typeof username === "string") {
      await query("UPDATE accounts SET username = ? WHERE account_id = ?", [username, id]);
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating account:", error);
    return new Response(JSON.stringify({ error: "Failed to update account" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
