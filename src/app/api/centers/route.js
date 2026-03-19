import { query } from "@/lib/mysql";
import { mockCenters } from "@/lib/mockCenters";

const useDbCenters = process.env.USE_DB_CENTERS === "true";

export async function GET() {
  if (!useDbCenters) {
    return new Response(JSON.stringify(mockCenters), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const centers = await query("SELECT center_id AS id, center_name AS name, center_island AS island FROM centers ORDER BY center_name");
    return new Response(JSON.stringify(centers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching centers:", error);
    return new Response(JSON.stringify(mockCenters), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request) {
  if (!useDbCenters) {
    return new Response(JSON.stringify({ error: "Centers are running in code-only mode." }), {
      status: 501,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { name, island } = await request.json();
    const result = await query("INSERT INTO centers (center_name, center_island) VALUES (?, ?)", [name, island]);
    const newCenter = {
      id: result.insertId,
      name,
      island,
    };
    return new Response(JSON.stringify(newCenter), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating center:", error);
    return new Response(JSON.stringify({ error: "Failed to create center" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
