import { query } from "@/lib/mysql";

const hasDbEnv = Boolean(process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER);
const useDbCenters = process.env.USE_DB_CENTERS !== "false" && hasDbEnv;

export async function PUT(request, { params }) {
  if (!useDbCenters) {
    return new Response(JSON.stringify({ error: "Centers are running in code-only mode." }), {
      status: 501,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { id } = params;
    const { name, island } = await request.json();
    await query("UPDATE centers SET center_name = ?, center_island = ? WHERE center_id = ?", [name, island, id]);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating center:", error);
    return new Response(JSON.stringify({ error: "Failed to update center" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request, { params }) {
  if (!useDbCenters) {
    return new Response(JSON.stringify({ error: "Centers are running in code-only mode." }), {
      status: 501,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { id } = params;
    await query("DELETE FROM centers WHERE center_id = ?", [id]);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting center:", error);
    return new Response(JSON.stringify({ error: "Failed to delete center" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
