import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isValidSessionId } from "@/features/leads/api/session-registry";

/**
 * Chaque visiteur reçoit un identifiant de session au premier passage. Le
 * dépôt en mémoire s'en sert pour lui donner sa propre copie du jeu de
 * données : la démonstration est publique, personne ne doit hériter des
 * suppressions d'un autre.
 *
 * Le cookie est aussi posé sur la requête en cours, pour que la toute
 * première page rendue lise déjà la bonne copie.
 */
export function proxy(request: NextRequest) {
  if (isValidSessionId(request.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.next();
  }

  const sessionId = crypto.randomUUID();
  request.cookies.set(SESSION_COOKIE, sessionId);

  const response = NextResponse.next({ request: { headers: request.headers } });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: sessionId,
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export const config = {
  matcher: [
    // Tout sauf les fichiers statiques et les images générées.
    "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|opengraph-image|twitter-image|robots.txt|sitemap.xml).*)",
  ],
};
