# SignalScope — Model Report

**Event:** SIH 2026 Internal Hackathon, L.J. Institute of Engineering and Technology
**Problem Statement:** PS-2
**Team:** Team Hexa

---

## 1. Task

Binary image classification: classify a single image as **real** (genuine photograph) or
**AI-generated** (produced by a text-to-image model), and report a calibrated confidence score.

Scope: core task only. No explanation/heat-map, generator attribution, or other bonus modules.

---

## 2. Data & Split

| Split | Source | Size | Notes |
|-------|--------|------|-------|
| Train | CIFAKE-style real-vs-synthetic set | ~[N] images | Provided at kickoff |
| Val   | Held-out 20% (stratified) | ~[N] images | Never used during Phase 1 backbone freeze |
| Test  | Organizer held-out (NOT seen during training) | ~[N] images | Includes unseen-generator images |

**Additional public data used:** [List any, e.g. GenImage subset — cite here]

**Ethics:** No images of identifiable real individuals used. Only provided/public data explicitly
cleared of identifiable people. No ad-hoc scraping.

---

## 3. Model Architecture

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Backbone | EfficientNet-B0 (ImageNet pretrained) | Good accuracy/compute tradeoff; CPU-inference viable |
| Head | Linear(1280 → 2) + Softmax | Binary task |
| Training Phase 1 | Frozen backbone, 5 epochs, LR=1e-3 | Fast head warmup |
| Training Phase 2 | Unfreeze last 2 MBConv blocks, 10 epochs, LR=1e-4 | Domain adaptation |
| Augmentation | JPEG re-compression, resize jitter, Gaussian blur, color jitter | Generalization across generator families |
| Loss | CrossEntropyLoss (class-weighted) | Handles real/fake imbalance |
| Calibration | Temperature scaling (post-hoc) | Honest confidence; reduces false-positive risk |

---

## 4. Calibration

Temperature scaling was applied after training on a held-out validation slice:

| Metric | Before Calibration | After Calibration |
|--------|--------------------|-------------------|
| ECE    | [fill in]          | [fill in]         |
| Temperature (T) | — | [fill in] |

T > 1 means the model was overconfident before calibration — expected for neural networks.

---

## 5. Metrics (on organizer held-out test set)

> Fill in after running `python model/evaluate.py` in Phase 5.

| Metric | Overall | Unseen-Generator Split |
|--------|---------|------------------------|
| ROC-AUC | **[fill in]** | **[fill in]** |
| Macro-F1 | [fill in] | [fill in] |
| Accuracy | [fill in] @ threshold=[fill in] | [fill in] |
| FPR | [fill in] | [fill in] |

**Confusion matrix:** see `report/confusion_matrix.png`
**ROC curve:** see `report/roc_curve.png`

> [!IMPORTANT]
> The unseen-generator-split AUC is the primary tie-break criterion per the evaluation rubric.

---

## 6. Baseline Comparison

| Model | Val AUC | Notes |
|-------|---------|-------|
| Random | 0.50 | Lower bound |
| Frozen backbone (Phase 1 only) | [fill in] | Head-only warmup |
| Full model (Phase 2) | [fill in] | Best checkpoint |
| Full model + calibration | [fill in] | Submitted |

---

## 7. Limitations

- **Seen-generator bias:** The model may perform better on generators present in the CIFAKE-style training set (e.g., Stable Diffusion family) than on entirely novel architectures.
- **Degradation sensitivity:** Heavily compressed, resized, or screenshotted images may reduce confidence; the "uncertain" band is designed to handle this honestly.
- **Resolution dependence:** Trained at 224×224; very high-resolution or very low-resolution inputs are downscaled/upscaled accordingly.
- **No provenance analysis:** EXIF/C2PA metadata is not used — the prediction is image-content-only.
- [Add any additional limitations discovered during evaluation]

---

## 8. Responsible Framing

All outputs are framed as likelihood assessments, never certainty claims:
- "likely AI-generated" / "likely real" / "uncertain — low confidence"
- Confidence is reported as a calibrated probability, not a misleading percentage gauge.
- The disclaimer *"This is an automated likelihood estimate, not a definitive determination."*
  is always displayed in the UI alongside results.

No outputs claim to identify, profile, or make determinations about specific real people.

---

## 9. Reproducibility

```bash
# 1. Install dependencies (CPU-only PyTorch)
pip install -r requirements.txt

# 2. Download weights (see README for link)
# Place best.pth and temperature.json in model/weights/

# 3. Predict on a single image
python model/predict.py --image /path/to/image.jpg

# 4. Run full evaluation
python model/evaluate.py \
    --data_dir   /path/to/test_set \
    --weights    model/weights/best.pth \
    --temperature model/weights/temperature.json
```

Expected wall time for setup from clean clone: **< 10 minutes** (CPU-only).

---

## 10. Originality Declaration

- Backbone: EfficientNet-B0 pretrained on ImageNet via `torchvision.models` (Apache 2.0 / BSD).
- Training framework: PyTorch (BSD).
- Temperature scaling: standard technique; implementation is original code.
- Evaluation: scikit-learn (BSD).
- All code in this repository is original work by the team, unless cited above.
- Dataset: [Cite organizer dataset + any additional public datasets used].
