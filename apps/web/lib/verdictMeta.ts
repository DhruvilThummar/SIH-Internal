import type { VerdictMeta } from './types';

/**
 * Maps a raw label string from /predict to display properties.
 * Three meaning-coded accents:
 *   teal-real       (var(--teal-real))       → likely real (#2C6E63)
 *   copper-ai       (var(--copper-ai))       → likely AI-generated (#B5622E)
 *   ochre-uncertain (var(--ochre-uncertain)) → uncertain / low confidence (#C69214)
 */
export function verdictMeta(label: string): VerdictMeta {
  const l = label.toLowerCase();

  if (l.includes('ai-generated') || l.includes('ai generated') || l.includes('synthetic')) {
    return {
      color:        'var(--copper-ai)',
      displayLabel: 'Likely AI-generated',
      a11y:         'Likely AI-generated image',
    };
  }
  if (l.includes('real') || l.includes('authentic')) {
    return {
      color:        'var(--teal-real)',
      displayLabel: 'Likely real',
      a11y:         'Likely real photograph',
    };
  }
  return {
    color:        'var(--ochre-uncertain)',
    displayLabel: 'Uncertain',
    a11y:         'Uncertain — low confidence result',
  };
}
