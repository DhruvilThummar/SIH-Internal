# Contributing to SignalScope

Thank you for contributing to SignalScope! This guide covers code standards, branch conventions, and review process.

---

## 📋 Before You Start

1. Read [`docs/memory.md`](./docs/memory.md) — the authoritative context file with all hard constraints.
2. Review [`docs/architecture.md`](./docs/architecture.md) — understand the two-stage hybrid pipeline before touching ML code.
3. Check [`docs/phase.md`](./docs/phase.md) — see what phase we're in and what's planned next.

---

## 🔒 Non-Negotiable Rules

> [!CAUTION]
> **These must never be violated in any PR:**
>
> - All image processing must use `io.BytesIO` — never write images to disk server-side
> - All verdict outputs must use probabilistic language: `"likely AI-generated"` / `"likely real"` / `"uncertain — low confidence"`
> - Never train or evaluate on held-out benchmark splits (`data/held_out/`)
> - `POST /predict` JSON response schema must not change without updating `lib/types.ts` and all consumers

---

## 🌿 Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/<description>` | `feat/compare-mode` |
| Bug Fix | `fix/<description>` | `fix/ela-threshold` |
| Documentation | `docs/<description>` | `docs/api-reference` |
| Refactor | `refactor/<description>` | `refactor/batch-panel` |

---

## 🧪 Testing Requirements

All ML and forensic extractor changes must include unit tests in `tests/unit/`.  
API endpoint changes must include integration tests in `tests/integration/`.

```powershell
# Run all tests
python -m pytest tests/ -v

# Run only unit tests
python -m pytest tests/unit/ -v
```

---

## 📝 Code Style

### Python (`ml/`, `services/`)
- Type hints on all function signatures
- Docstrings on all public functions
- `black` formatter with 100-char line limit
- No silent exception swallowing — always log with context

### TypeScript (`apps/web/`)
- Strict TypeScript (`"strict": true` in tsconfig)
- Props interfaces on all React components
- No `any` types without explicit comment justification
- Component files: PascalCase. Utility files: camelCase.

---

## 🔄 Pull Request Checklist

- [ ] `docs/memory.md` updated if architectural decision changed
- [ ] `docs/phase.md` updated if milestone completed
- [ ] `CHANGELOG.md` updated with description of changes
- [ ] Unit tests pass: `python -m pytest tests/ -v`
- [ ] TypeScript compiles: `npm run build` (in `apps/web`)
- [ ] No images stored to disk server-side
- [ ] All verdict text uses probabilistic framing
