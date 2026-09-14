# SignalScope — Test Suite

This directory contains all automated tests for the SignalScope forensic engine.

---

## Structure

```
tests/
├── unit/                     # Unit tests for individual ML & forensic modules
│   ├── test_sanitizer.py     # Alpha compositing & sRGB standardization tests
│   ├── test_spectral.py      # 2D FFT + DCT Notch Filter tests
│   ├── test_texture.py       # PRNU + Bayer correlation tests
│   ├── test_ela.py           # Error Level Analysis tests
│   └── test_predict.py       # Full predict() pipeline smoke tests
└── integration/              # End-to-end API integration tests
    └── test_api.py           # POST /predict + GET /health route tests
```

---

## Running Tests

```powershell
# All tests
python -m pytest tests/ -v

# Unit tests only
python -m pytest tests/unit/ -v

# Integration tests (requires Flask API running)
python -m pytest tests/integration/ -v

# With coverage report
python -m pytest tests/ --cov=ml/src --cov-report=term-missing
```

---

## Quick API Smoke Test

```powershell
# Start Flask API first, then:
curl -X POST http://localhost:5000/predict -F "image=@data/test_sample.jpg"
curl http://localhost:5000/health
```
