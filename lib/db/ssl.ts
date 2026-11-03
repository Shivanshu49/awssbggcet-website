// Anything but a local Postgres must use TLS, whatever the URL says: the app carries personal data,
// and the scripts log in to production with the password. A local Postgres, which is how PR B/C get
// tested, has no TLS to offer.
// ponytail: "require" encrypts but doesn't check the certificate. verify-full with Supabase's CA also stops an active attacker.
export function dbSsl(url = ""): "require" | false {
  const isLocal = URL.canParse(url) && ["localhost", "127.0.0.1"].includes(new URL(url).hostname);
  return isLocal ? false : "require";
}

// drizzle-kit silently drops `ssl` when it's given `url`, so it gets the URL's parts instead.
// With no usable URL, the empty host stops `migrate`. `generate` never connects, so it still runs.
export function dbCredentials(value = "") {
  const url = URL.canParse(value) ? new URL(value) : null;
  return {
    host: url?.hostname ?? "",
    port: Number(url?.port) || undefined,
    user: decodeURIComponent(url?.username ?? "") || undefined,
    password: decodeURIComponent(url?.password ?? "") || undefined,
    database: url?.pathname.slice(1) ?? "",
    ssl: dbSsl(value),
  };
}
