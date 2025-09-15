import { NextResponse } from "next/server";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  if (error) return NextResponse.json({ error }, { status: 400 });
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI || "",
    client_id: process.env.SPOTIFY_CLIENT_ID || "",
    client_secret: process.env.SPOTIFY_CLIENT_SECRET || "",
  });

  const r = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!r.ok) {
    const txt = await r.text();
    return NextResponse.json({ error: "Token exchange failed", detail: txt }, { status: 400 });
  }

  const json = await r.json();
  const refresh = json.refresh_token;

  return new NextResponse(
    `<html><body style="font-family:ui-sans-serif;max-width:720px;margin:40px auto;line-height:1.5">
       <h2>Copy your Spotify refresh token</h2>
       <p>Paste this into <code>.env.local</code> or Vercel env as <code>SPOTIFY_REFRESH_TOKEN</code>:</p>
       <pre style="white-space:pre-wrap;border:1px solid #ddd;padding:12px;border-radius:8px;background:#f9fafb">${refresh ?? "(none received)"}</pre>
       <p>Then redeploy.</p>
     </body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}