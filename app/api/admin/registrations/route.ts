// app/api/admin/registrations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { desc, like, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { eventRegistrations } from "@/lib/db/schema";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.toLowerCase();

    let records;
    if (query) {
      records = await db
        .select()
        .from(eventRegistrations)
        .where(
          or(
            like(eventRegistrations.email, `%${query}%`),
            like(eventRegistrations.mobile, `%${query}%`),
            like(eventRegistrations.registrationId, `%${query}%`),
            like(eventRegistrations.firstName, `%${query}%`),
            like(eventRegistrations.lastName, `%${query}%`),
          ),
        )
        .orderBy(desc(eventRegistrations.createdAt))
        .limit(100);
    } else {
      records = await db
        .select()
        .from(eventRegistrations)
        .orderBy(desc(eventRegistrations.createdAt))
        .limit(200);
    }

    return NextResponse.json({ registrations: records });
  } catch (error) {
    console.error("[admin/registrations]", error);
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
  }
}

