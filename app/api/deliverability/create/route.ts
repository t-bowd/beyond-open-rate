import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { createAudit } from "@/lib/deliverability/db";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
});

const INBOUND_DOMAIN = "mail.beyondopenrate.com.au";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request — name and a valid email are required." },
        { status: 400 }
      );
    }

    const { name, email } = parsed.data;
    const id = randomUUID();
    const inboundAddress = `audit-${id}@${INBOUND_DOMAIN}`;

    await createAudit(name, email, inboundAddress, id);

    return NextResponse.json({ id, inbound_address: inboundAddress });
  } catch (err) {
    console.error("[deliverability/create]", err);
    return NextResponse.json({ error: "Server error — please try again." }, { status: 500 });
  }
}
