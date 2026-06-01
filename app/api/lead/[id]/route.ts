import { NextResponse, type NextRequest } from "next/server";
import { requestFullAudit } from "@/lib/lead";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  }

  try {
    await requestFullAudit(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/lead/[id]] update failed", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
