import { NextResponse } from "next/server";
const AUTH_URL = "https://accounts.spotify.com/authorize";

export async function GET() {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID || "",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI || "",
    scope: process.env.SPOTIFY_SCOPE || "",
    state: Math.random().toString(36).slice(2),
    show_dialog: "true", // forces consent so we get a refresh_token
  });
  return NextResponse.redirect(`${AUTH_URL}?${params.toString()}`);
}