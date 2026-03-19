import { query } from "@/lib/mysql";

export async function GET() {
  try {
    const accounts = await query("SELECT account_id AS id, username, password, role, center_id AS centerId FROM accounts");
    return new Response(JSON.stringify(accounts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch accounts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request) {
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