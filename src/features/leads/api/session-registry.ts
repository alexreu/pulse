/**
 * Un registre borné de valeurs par visiteur. Chaque visiteur de la démonstration
 * reçoit sa propre copie du jeu de données : ce qu'il supprime ou modifie ne
 * touche personne d'autre.
 *
 * Le registre vit en mémoire, il doit donc rester petit : les sessions
 * inactives expirent, et au-delà d'un plafond la moins récemment utilisée
 * cède sa place. Un `Map` garde l'ordre d'insertion, ce qui suffit à faire
 * un LRU : chaque accès réinsère la clé en dernier.
 */
export interface SessionRegistryOptions {
  /** Nombre maximal de sessions gardées en mémoire. */
  maxSessions: number;
  /** Durée d'inactivité, en millisecondes, au-delà de laquelle une session expire. */
  idleTimeoutMs: number;
  /** Horloge injectable pour les tests. */
  now?: () => number;
}

export interface SessionRegistry<T> {
  /** La valeur de cette session, créée au premier accès. */
  get(sessionId: string): T;
  /** Remplace la valeur de cette session par une valeur neuve. */
  reset(sessionId: string): T;
  readonly size: number;
}

interface Entry<T> {
  value: T;
  lastSeen: number;
}

export function createSessionRegistry<T>(
  create: () => T,
  { maxSessions, idleTimeoutMs, now = Date.now }: SessionRegistryOptions,
): SessionRegistry<T> {
  const entries = new Map<string, Entry<T>>();

  function evict(at: number) {
    for (const [key, entry] of entries) {
      // L'ordre d'insertion est l'ordre d'usage : dès qu'une entrée est
      // encore fraîche, toutes les suivantes le sont aussi.
      if (at - entry.lastSeen < idleTimeoutMs) break;
      entries.delete(key);
    }
    while (entries.size > maxSessions) {
      const oldest = entries.keys().next().value;
      if (oldest === undefined) break;
      entries.delete(oldest);
    }
  }

  function touch(sessionId: string, value: T, at: number): T {
    entries.delete(sessionId);
    entries.set(sessionId, { value, lastSeen: at });
    evict(at);
    return value;
  }

  return {
    get(sessionId) {
      const at = now();
      const existing = entries.get(sessionId);
      const value =
        existing && at - existing.lastSeen < idleTimeoutMs ? existing.value : create();
      return touch(sessionId, value, at);
    },
    reset(sessionId) {
      return touch(sessionId, create(), now());
    },
    get size() {
      return entries.size;
    },
  };
}

/** Le nom du cookie qui identifie un visiteur de la démonstration. */
export const SESSION_COOKIE = "pulse_session";

const SESSION_ID_PATTERN = /^[0-9a-f-]{36}$/i;

/** Un identifiant de session bien formé : un UUID, rien d'autre. */
export function isValidSessionId(value: string | undefined): value is string {
  return typeof value === "string" && SESSION_ID_PATTERN.test(value);
}
