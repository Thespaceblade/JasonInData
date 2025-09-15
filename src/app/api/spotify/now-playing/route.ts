import { NextResponse } from "next/server";

const TOKEN_URL = "https://accounts.spotify.com/api/token";

async function getAccessToken() {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: process.env.SPOTIFY_REFRESH_TOKEN || "",
    client_id: process.env.SPOTIFY_CLIENT_ID || "",
    client_secret: process.env.SPOTIFY_CLIENT_SECRET || "",
  });

  const r = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!r.ok) throw new Error(`Failed to refresh token: ${await r.text()}`);
  const json = await r.json();
  return json.access_token as string;
}

export async function GET() {
  try {
    if (!process.env.SPOTIFY_REFRESH_TOKEN) {
      return NextResponse.json({ isPlaying: false, reason: "No refresh token set" }, { status: 200 });
    }

    const access = await getAccessToken();

    const np = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${access}` },
      cache: "no-store",
    });

    if (np.status === 204 || np.status === 202) {
      const recent = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
        headers: { Authorization: `Bearer ${access}` },
        cache: "no-store",
      });
      if (!recent.ok) return NextResponse.json({ isPlaying: false }, { status: 200 });
      const rjson = await recent.json();
      const item = rjson.items?.[0]?.track;
      return NextResponse.json({
        isPlaying: false,
        title: item?.name || null,
        artist: item?.artists?.map((a: any) => a.name).join(", ") || null,
        url: item?.external_urls?.spotify || null,
        albumImageUrl: item?.album?.images?.[0]?.url || null,
      });
    }

    if (!np.ok) {
      return NextResponse.json({ isPlaying: false, error: await np.text() }, { status: 200 });
    }

    const data = await np.json();
    const item = data.item;
    return NextResponse.json({
      isPlaying: Boolean(data.is_playing),
      title: item?.name || null,
      artist: item?.artists?.map((a: any) => a.name).join(", ") || null,
      url: item?.external_urls?.spotify || null,
      albumImageUrl: item?.album?.images?.[0]?.url || null,
    });
  } catch (e: any) {
    return NextResponse.json({ isPlaying: false, error: e.message }, { status: 200 });
  }
}

