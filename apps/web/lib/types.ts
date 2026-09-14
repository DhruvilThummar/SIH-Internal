// Shared types used across the frontend.

export type AppState = 'idle' | 'loading' | 'result' | 'error' | 'batch' | 'compare';

export interface ForensicMetric {
  score: number;       // 0 to 100
  detail: string;      // Technical forensic description
}

/** Shape of the defense-grade JSON response from POST /predict */
export interface PredictResult {
  label:                string;   // "likely AI-generated" | "likely real" | "uncertain — low confidence"
  confidence:           number;   // calibrated probability 0–1
  prob_ai?:             number;   // raw AI probability 0–1
  suspected_generator?: string;   // e.g. "FLUX.1 (Schnell/Dev)", "Midjourney v6", "Optical CMOS Camera Sensor"
  generator_confidence?:number;   // 0–1
  tampering_analysis?: {
    is_fully_synthetic:         boolean;
    has_localized_inpainting:   boolean;
    adversarial_noise_injected: boolean;
  };
  evidence?: {
    primary_spatial:      string;
    secondary_texture:    string;
    spectral_frequency:   string;
    metadata_consistency: string;
  };
  heatmap_grid?:    number[][];
  grid_dimensions?: [number, number];
  valid_roi?:       [number, number, number, number];
  forensics?: {
    fft_spectrum:     ForensicMetric;
    sensor_prnu:      ForensicMetric;
    color_saturation: ForensicMetric;
    ela_compression:  ForensicMetric;
  };
}

export interface VerdictMeta {
  color:        string;   // CSS custom property value
  displayLabel: string;   // Human-readable short label
  a11y:         string;   // Accessible description
}
