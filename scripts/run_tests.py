"""
run_tests.py — Robust test runner discovering and executing unit & integration tests.
"""

import sys
import unittest
from pathlib import Path

_REPO_ROOT = Path(__file__).resolve().parent.parent
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))

def main():
    print("=========================================================")
    print(" SignalScope Defense Test Suite Discovery & Execution")
    print("=========================================================")

    loader = unittest.TestLoader()
    suite = unittest.TestSuite()

    unit_dir = _REPO_ROOT / "tests" / "unit"
    integration_dir = _REPO_ROOT / "tests" / "integration"

    if unit_dir.exists():
        unit_suite = loader.discover(start_dir=str(unit_dir), pattern="test_*.py")
        suite.addTests(unit_suite)

    if integration_dir.exists():
        int_suite = loader.discover(start_dir=str(integration_dir), pattern="test_*.py")
        suite.addTests(int_suite)

    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    if result.testsRun == 0:
        print("\n[!] WARNING: No tests were discovered in tests/ directory.")
        sys.exit(1)

    if not result.wasSuccessful():
        print("\n✗ Test Suite Failures Detected!")
        sys.exit(1)
    else:
        print(f"\n✓ All {result.testsRun} Unit & Integration Tests Passed Cleanly!")
        sys.exit(0)

if __name__ == "__main__":
    main()
