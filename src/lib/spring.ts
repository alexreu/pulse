/**
 * Un ressort minimal, paramétré comme chez Apple : une réponse (en secondes,
 * la vitesse à laquelle la valeur rejoint sa cible) et un taux d'amortissement
 * (1 = amorti critique, aucun dépassement ; en dessous, un léger rebond).
 *
 * Un ressort n'a pas de durée fixe : il part de la valeur affichée et de la
 * vitesse du geste, ce qui le rend interruptible et sans couture avec le
 * glisser qui le précède.
 */
export interface SpringOptions {
  from: number;
  to: number;
  /** Vitesse initiale, en unités par seconde — celle du doigt au lâcher. */
  velocity?: number;
  response?: number;
  dampingRatio?: number;
  onUpdate: (value: number) => void;
  onComplete?: () => void;
}

/** Lance le ressort et rend une fonction qui l'arrête là où il en est. */
export function animateSpring({
  from,
  to,
  velocity = 0,
  response = 0.3,
  dampingRatio = 1,
  onUpdate,
  onComplete,
}: SpringOptions): () => void {
  const stiffness = (2 * Math.PI / response) ** 2;
  const damping = (4 * Math.PI * dampingRatio) / response;

  let position = from;
  let speed = velocity;
  let previous: number | null = null;
  let frame = 0;

  function step(time: number) {
    // Pas plafonné : un onglet en arrière-plan ne doit pas faire exploser l'intégration.
    const elapsed = previous === null ? 1 / 60 : Math.min((time - previous) / 1000, 1 / 30);
    previous = time;

    // Sous-pas fixes, intégration d'Euler semi-implicite : stable et suffisante ici.
    const substeps = 4;
    const dt = elapsed / substeps;
    for (let index = 0; index < substeps; index += 1) {
      const force = -stiffness * (position - to) - damping * speed;
      speed += force * dt;
      position += speed * dt;
    }

    if (Math.abs(position - to) < 0.5 && Math.abs(speed) < 10) {
      onUpdate(to);
      onComplete?.();
      return;
    }

    onUpdate(position);
    frame = requestAnimationFrame(step);
  }

  frame = requestAnimationFrame(step);
  return () => cancelAnimationFrame(frame);
}

/**
 * Où un geste lancé s'arrêterait de lui-même, avec la décélération d'un
 * défilement natif. Sert à choisir la destination d'après l'élan, et non
 * d'après la seule position au lâcher.
 */
export function projectMomentum(velocity: number, decelerationRate = 0.998): number {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/** Résistance progressive au-delà d'une limite, plutôt qu'un arrêt sec. */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}
