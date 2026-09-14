# SignalScope Machine Learning Engine (v2.0)

Defense-grade two-stage hybrid ML pipeline combining semantic vision foundation backbones with physical signal extractors.

## Directory Layout

```
ml/
├── weights/
│   ├── best.pth                 # Calibrated model checkpoint weights
│   └── temperature.json         # Temperature scaling parameters (T = 1.42)
└── src/
    ├── data/                    # Dataset ingest & synthetic data generation
    │   ├── download_dataset.py
    │   ├── populate_dataset.py
    │   └── prepare_dataset.py
    ├── training/                # Training, temperature calibration & evaluation
    │   ├── train.py
    │   ├── calibrate.py
    │   └── evaluate.py
    ├── models/                  # ViT / DINOv2 backbone models
    │   └── model_utils.py
    ├── forensics/               # Stage B Physical Signal Extractors
    │   ├── ela.py
    │   ├── spectral.py          # 2D Fast Fourier Transform
    │   ├── texture.py           # PRNU & Bayer cross-channel correlation
    │   ├── metadata.py          # EXIF & camera profile parser
    │   └── sanitizer.py         # RGBA white-canvas flattener & sRGB normalizer
    └── predict.py               # Primary inference entrypoint
```

## Running Pipeline Stages

### 1. Prepare Datasets
```bash
python ml/src/data/download_dataset.py
python ml/src/data/prepare_dataset.py
```

### 2. Train Model
```bash
python ml/src/training/train.py --epochs 25 --batch-size 32
```

### 3. Calibrate Temperature Scaling
```bash
python ml/src/training/calibrate.py
```

### 4. Evaluate Zero-Shot Benchmarks
```bash
python ml/src/training/evaluate.py
```
