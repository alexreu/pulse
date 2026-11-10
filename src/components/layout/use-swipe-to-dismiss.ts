"use client";

import * as React from "react";
import { animateSpring, projectMomentum, rubberband } from "@/lib/spring";

/** Distance à parcourir avant de considérer qu'un geste est un glisser. */
const SLOP = 10;
/** Fenêtre d'échantillons gardée pour mesurer la vitesse au lâcher, en ms. */
const VELOCITY_WINDOW = 100;

interface Sample {
  x: number;
  t: number;
}

/**
 * Fermer le tiroir d'un glissement vers la gauche.
 *
 * - Le tiroir suit le doigt au pixel près, depuis l'endroit où on l'a saisi.
 * - Vers la droite, il résiste au lieu de s'arrêter net.
 * - Au lâcher, la destination se décide sur l'élan projeté, puis un ressort
 *   repart de la vitesse du doigt : pas de couture entre geste et animation.
 * - On peut le rattraper en pleine course.
 *
 * Les styles sont écrits directement sur les nœuds : un rendu React par
 * image ferait perdre la synchronisation avec le doigt.
 */
export function useSwipeToDismiss(onDismiss: () => void) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const gesture = React.useRef({
    pointerId: null as number | null,
    originX: 0,
    originY: 0,
    startOffset: 0,
    offset: 0,
    dragging: false,
    dragged: false,
    samples: [] as Sample[],
    stop: null as (() => void) | null,
  });

  const apply = React.useCallback((offset: number) => {
    const content = contentRef.current;
    if (!content) return;
    gesture.current.offset = offset;
    content.style.transform = offset === 0 ? "" : `translate3d(${offset}px, 0, 0)`;
    const width = content.offsetWidth || 280;
    if (overlayRef.current) {
      overlayRef.current.style.opacity = String(Math.min(1, Math.max(0, 1 + offset / width)));
    }
  }, []);

  React.useEffect(() => () => gesture.current.stop?.(), []);

  const onPointerDown = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || gesture.current.pointerId !== null) return;
    const state = gesture.current;
    // Rattraper le tiroir en pleine course : on repart de sa position affichée.
    state.stop?.();
    state.stop = null;
    state.pointerId = event.pointerId;
    state.originX = event.clientX;
    state.originY = event.clientY;
    state.startOffset = state.offset;
    state.dragging = state.offset !== 0;
    state.dragged = false;
    state.samples = [{ x: event.clientX, t: event.timeStamp }];
    if (state.dragging) event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onPointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const state = gesture.current;
      if (state.pointerId !== event.pointerId) return;

      const dx = event.clientX - state.originX;
      const dy = event.clientY - state.originY;

      if (!state.dragging) {
        if (Math.abs(dx) < SLOP && Math.abs(dy) < SLOP) return;
        // Un geste vertical appartient au défilement de la liste.
        if (Math.abs(dy) > Math.abs(dx)) {
          state.pointerId = null;
          return;
        }
        state.dragging = true;
        state.dragged = true;
        // On part du point où le seuil est franchi : pas de saut de 10 px.
        state.originX = event.clientX;
        event.currentTarget.setPointerCapture(event.pointerId);
      }

      state.samples.push({ x: event.clientX, t: event.timeStamp });
      while (state.samples.length > 2 && event.timeStamp - state.samples[0].t > VELOCITY_WINDOW) {
        state.samples.shift();
      }

      const raw = state.startOffset + (event.clientX - state.originX);
      const width = event.currentTarget.offsetWidth;
      apply(raw <= 0 ? raw : rubberband(raw, width));
    },
    [apply],
  );

  const release = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const state = gesture.current;
      if (state.pointerId !== event.pointerId) return;
      state.pointerId = null;
      if (!state.dragging) return;
      state.dragging = false;

      const first = state.samples[0];
      const last = state.samples[state.samples.length - 1];
      const elapsed = last && first ? (last.t - first.t) / 1000 : 0;
      const velocity = elapsed > 0 ? (last.x - first.x) / elapsed : 0;

      const width = event.currentTarget.offsetWidth;
      const projected = state.offset + projectMomentum(velocity);
      const dismiss = projected < -width / 2;
      const target = dismiss ? -width : 0;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        apply(target);
        if (dismiss) onDismiss();
        return;
      }

      state.stop = animateSpring({
        from: state.offset,
        to: target,
        velocity,
        response: 0.3,
        // Amorti critique : un rebond ferait apparaître un jour à gauche du tiroir.
        dampingRatio: 1,
        onUpdate: apply,
        onComplete: () => {
          state.stop = null;
          if (dismiss) onDismiss();
        },
      });
    },
    [apply, onDismiss],
  );

  /** Un glisser ne doit pas finir en clic sur le lien qu'on a saisi. */
  const onClickCapture = React.useCallback((event: React.MouseEvent) => {
    if (!gesture.current.dragged) return;
    gesture.current.dragged = false;
    event.preventDefault();
    event.stopPropagation();
  }, []);

  /** À la réouverture, le tiroir repart de sa position de repos. */
  const resetPosition = React.useCallback(() => {
    gesture.current.stop?.();
    gesture.current.stop = null;
    gesture.current.offset = 0;
  }, []);

  return {
    contentRef,
    overlayRef,
    resetPosition,
    onPointerDown,
    onPointerMove,
    onPointerUp: release,
    onPointerCancel: release,
    onClickCapture,
  };
}
