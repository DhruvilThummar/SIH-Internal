// Forensics metadata and sample URLs for URL analysis mode.

export const SAMPLE_IMAGE_URLS = [
  {
    label: 'FLUX.1 Synthetic Portrait',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    type: 'Sample AI Test',
  },
  {
    label: 'Natural Optical CMOS Photo',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    type: 'Sample Real Photo',
  },
];

export const FORENSIC_METRIC_HELP = {
  fft: 'High-frequency 2D Fast Fourier Transform anomalies indicating GAN/Diffusion grid artifacts.',
  prnu: 'Photo-Response Non-Uniformity sensor noise inconsistency.',
  ela: 'Error Level Analysis identifying resaved JPEG compression variances.',
  saturation: 'Color space saturation distribution anomalies common in synthetic generation.',
};
