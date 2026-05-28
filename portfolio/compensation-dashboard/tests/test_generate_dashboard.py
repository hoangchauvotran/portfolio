import sys
import unittest
from pathlib import Path


PROJECT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_DIR))

from generate_dashboard import clamp, percentile, summarize  # noqa: E402


class CompensationDashboardTests(unittest.TestCase):
    def test_clamp_limits_values(self):
        self.assertEqual(clamp(5, 1, 10), 5)
        self.assertEqual(clamp(-2, 1, 10), 1)
        self.assertEqual(clamp(15, 1, 10), 10)

    def test_percentile_uses_inclusive_quantiles(self):
        values = [10, 20, 30, 40, 50]

        self.assertEqual(percentile(values, 0), 10)
        self.assertEqual(percentile(values, 0.5), 30)
        self.assertEqual(percentile(values, 1), 50)
        self.assertEqual(percentile([99], 0.75), 99)
        self.assertAlmostEqual(percentile(values, 0.25), 20)
        self.assertAlmostEqual(percentile(values, 0.75), 40)

    def test_summarize_returns_kpis_departments_and_levels(self):
        rows = [
            {
                "department": "Engineering",
                "level": "L1 Analyst",
                "gender": "Male",
                "salary_vnd": 100_000_000,
                "bonus_vnd": 10_000_000,
                "merit_increase_vnd": 5_000_000,
                "performance_rating": 4,
                "compa_ratio": 1.0,
                "pay_equity_flag": "In Range",
            },
            {
                "department": "Engineering",
                "level": "L1 Analyst",
                "gender": "Female",
                "salary_vnd": 80_000_000,
                "bonus_vnd": 8_000_000,
                "merit_increase_vnd": 4_000_000,
                "performance_rating": 3,
                "compa_ratio": 0.82,
                "pay_equity_flag": "Review",
            },
            {
                "department": "Finance",
                "level": "L2 Associate",
                "gender": "Female",
                "salary_vnd": 60_000_000,
                "bonus_vnd": 6_000_000,
                "merit_increase_vnd": 3_000_000,
                "performance_rating": 5,
                "compa_ratio": 1.1,
                "pay_equity_flag": "In Range",
            },
        ]

        summary = summarize(rows)
        engineering = next(
            item for item in summary["departments"] if item["department"] == "Engineering"
        )

        self.assertEqual(summary["kpis"]["headcount"], 3)
        self.assertEqual(summary["kpis"]["review_count"], 1)
        self.assertAlmostEqual(summary["kpis"]["gender_gap"], 30.0)
        self.assertEqual(engineering["headcount"], 2)
        self.assertEqual(engineering["avg_salary"], 90_000_000)
        self.assertEqual(engineering["review_rate"], 50.0)
        self.assertEqual(len(summary["levels"]), 2)


if __name__ == "__main__":
    unittest.main()
