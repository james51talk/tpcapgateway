import { query } from "@/lib/mysql";

const useDbAccounts = process.env.USE_DB_ACCOUNTS === "true";

export async function PUT(request) {
  if (!useDbAccounts) {
    return new Response(JSON.stringify({ error: "Accounts are running in code-only mode." }), {
      status: 501,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { id, password } = await request.json();
    await query("UPDATE accounts SET password = ? WHERE account_id = ?", [password, id]);
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
