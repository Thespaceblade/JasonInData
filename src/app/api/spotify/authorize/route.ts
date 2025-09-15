import { NextResponse } from "next/server";

const AUTH_URL = "https://accounts.spotify.com/authorize";

export async function GET(req: Request) {
  const url = new URL(req.url);
  // TEMP DEBUG: visit /api/spotify/authorize?debug=1 to see values
  if (url.searchParams.get("debug") === "1") {
    return NextResponse.json({
      using_client_id: process.env.SPOTIFY_CLIENT_ID,
      using_redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      using_scope: process.env.SPOTIFY_SCOPE,
    });
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID || "",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI || "",
    scope: process.env.SPOTIFY_SCOPE || "",
    state: Math.random().toString(36).slice(2),
  });

  return NextResponse.redirect(`${AUTH_URL}?${params.toString()}`);
}