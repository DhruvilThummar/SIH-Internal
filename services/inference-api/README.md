# SignalScope Defense Inference API (Flask v2.0)

Modular, defense-grade Python Flask API providing high-throughput inference for synthetic image detection.

## Architecture

- **`config.py`**: Centralized environment & model configuration.
- **`middleware/error_handler.py`**: Standardized JSON error response handler.
- **`routes/health.py`**: Blueprint for `GET /health` liveness/readiness probe.
- **`routes/predict.py`**: Blueprints for `POST /predict` (multipart file upload) and `POST /predict-url` (SSRF-protected remote URL analysis).
- **`services/inference_service.py`**: Decouples Flask request parsing from PyTorch/DINOv2/CLIP inference execution.
- **`utils/validation.py` & `url_fetcher.py`**: In-memory byte stream validation, extension checks, and SSRF protection.

## API Specification

### 1. `GET /health`
- **Response**: `200 OK`
```json
{
  "status": "ok",
  "model_loaded": true,
  "weights_path": "ml/weights/best.pth",
  "version": "2.0.0"
}
```

### 2. `POST /predict`
- **Content-Type**: `multipart/form-data`
- **Body**: `image` (binary file: JPG, PNG, WebP <= 16MB)
- **Response**: Standard `PredictResult` JSON.

### 3. `POST /predict-url` (Phase 7)
- **Content-Type**: `application/json`
- **Body**: `{"url": "https://example.com/sample.jpg"}`
- **Response**: Standard `PredictResult` JSON.
