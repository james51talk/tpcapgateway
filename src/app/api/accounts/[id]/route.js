import { query } from "@/lib/mysql";

export async function PUT(request) {
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