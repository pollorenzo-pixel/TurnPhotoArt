import type { NextRequest } from "next/server";
import { sha256 } from "@/lib/server/crypto";

export function clientIpHash(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rotation = new Date().toISOString().slice(0, 10);
  const salt = process.env.TURNPHOTOART_SESSION_SECRET || "disabled";
  return sha256(`${rotation}:${salt}:${ip}`);
}

export function assertMultipartSize(request: NextRequest, maxBytes = 11 * 1024 * 1024) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length && length > maxBytes) throw new Error("request_too_large");
}

export const noStoreJson = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
