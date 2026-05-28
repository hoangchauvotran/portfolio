from __future__ import annotations

import csv
import json
import random
import statistics
from collections import defaultdict
from pathlib import Path


random.seed(42)

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "compensation_simulated_data.csv"
DASHBOARD_PATH = BASE_DIR / "index.html"

DEPARTMENTS = {
    "Product": {"base": 34_000_000, "budget": 2_850_000_000},
    "Engineering": {"base": 42_000_000, "budget": 4_400_000_000},
    "Sales": {"base": 27_000_000, "budget": 3_150_000_000},
    "Operations": {"base": 24_000_000, "budget": 2_200_000_000},
    "Finance": {"base": 31_000_000, "budget": 1_550_000_000},
    "HR": {"base": 25_000_000, "budget": 1_050_000_000},
}

LEVELS = {
    "L1 Analyst": 0.72,
    "L2 Associate": 0.92,
    "L3 Specialist": 1.18,
    "L4 Senior": 1.55,
    "L5 Manager": 2.05,
}

LOCATIONS = {
    "Ho Chi Minh City": 1.07,
    "Ha Noi": 1.0,
    "Da Nang": 0.9,
    "Remote": 0.95,
}

GENDERS = ["Female", "Male"]
PERFORMANCE_RATINGS = [2, 3, 4, 5]

DEPARTMENT_WEIGHTS = [0.14, 0.24, 0.22, 0.17, 0.12, 0.11]
LEVEL_WEIGHTS = [0.22, 0.29, 0.25, 0.17, 0.07]
LOCATION_WEIGHTS = [0.5, 0.25, 0.13, 0.12]
GENDER_WEIGHTS = [0.54, 0.46]
RATING_WEIGHTS = [0.08, 0.42, 0.36, 0.14]

PAY_EQUITY_MIN_COMPA_RATIO = 0.88
PAY_EQUITY_MAX_COMPA_RATIO = 1.16
MONTHS_PER_YEAR = 12

BONUS_PERCENT_RANGES = {
    2: (0.01, 0.03),
    3: (0.035, 0.06),
    4: (0.065, 0.095),
    5: (0.10, 0.15),
}

MERIT_PERCENT_RANGES = {
    2: (0.00, 0.015),
    3: (0.018, 0.035),
    4: (0.038, 0.065),
    5: (0.068, 0.095),
}


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def money(value: float) -> str:
    return f"{value:,.0f}"


def compact_vnd(value: float) -> str:
    if abs(value) >= 1_000_000_000:
        return f"{value / 1_000_000_000:.1f}B"
    return f"{value / 1_000_000:.0f}M"


def pct(value: float) -> str:
    return f"{value:.1f}%"


def average(values: list[float]) -> float:
    return sum(values) / len(values) if values else 0


def percentile(values: list[float], pct: float) -> float:
    if not values:
        return 0
    if len(values) == 1:
        return values[0]
    if pct <= 0:
        return min(values)
    if pct >= 1:
        return max(values)
    if pct == 0.5:
        return statistics.median(values)

    ordered = sorted(values)
    cuts = statistics.quantiles(ordered, n=100, method="inclusive")
    cut_index = max(0, min(98, round(pct * 100) - 1))
    return cuts[cut_index]


def generate_rows(count: int = 720) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    for employee_num in range(1, count + 1):
        department = random.choices(list(DEPARTMENTS), weights=DEPARTMENT_WEIGHTS)[0]
        level = random.choices(list(LEVELS), weights=LEVEL_WEIGHTS)[0]
        location = random.choices(list(LOCATIONS), weights=LOCATION_WEIGHTS)[0]
        gender = random.choices(GENDERS, weights=GENDER_WEIGHTS)[0]
        tenure = round(clamp(random.gauss(3.2, 2.1), 0.2, 11.5), 1)
        rating = random.choices(PERFORMANCE_RATINGS, weights=RATING_WEIGHTS)[0]

        midpoint = DEPARTMENTS[department]["base"] * LEVELS[level] * LOCATIONS[location]
        salary_noise = random.gauss(1.0, 0.11)
        salary = midpoint * salary_noise
        if gender == "Female" and department in {"Engineering", "Sales"}:
            salary *= random.gauss(0.975, 0.015)

        compa_ratio = salary / midpoint
        bonus_pct = random.uniform(*BONUS_PERCENT_RANGES[rating])
        bonus = salary * bonus_pct
        merit_pct = random.uniform(*MERIT_PERCENT_RANGES[rating])
        merit_increase = salary * merit_pct
        pay_equity_flag = (
            "Review"
            if compa_ratio < PAY_EQUITY_MIN_COMPA_RATIO
            or compa_ratio > PAY_EQUITY_MAX_COMPA_RATIO
            else "In Range"
        )

        rows.append(
            {
                "employee_id": f"EMP{employee_num:04d}",
                "department": department,
                "level": level,
                "location": location,
                "gender": gender,
                "tenure_years": tenure,
                "performance_rating": rating,
                "salary_vnd": round(salary),
                "salary_midpoint_vnd": round(midpoint),
                "compa_ratio": round(compa_ratio, 3),
                "bonus_vnd": round(bonus),
                "merit_increase_vnd": round(merit_increase),
                "pay_equity_flag": pay_equity_flag,
            }
        )
    return rows


def write_csv(rows: list[dict[str, object]]) -> None:
    DATA_PATH.parent.mkdir(exist_ok=True)
    with DATA_PATH.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def outlier_status(compa_ratio: float) -> str:
    if compa_ratio < PAY_EQUITY_MIN_COMPA_RATIO:
        return "Below range"
    if compa_ratio > PAY_EQUITY_MAX_COMPA_RATIO:
        return "Above range"
    return "In range"


def fix_cost(row: dict[str, object]) -> float:
    compa_ratio = float(row["compa_ratio"])
    if compa_ratio >= PAY_EQUITY_MIN_COMPA_RATIO:
        return 0
    salary = float(row["salary_vnd"])
    midpoint = float(row.get("salary_midpoint_vnd", salary / compa_ratio))
    return max(0, (midpoint * PAY_EQUITY_MIN_COMPA_RATIO - salary) * MONTHS_PER_YEAR)


def summarize(rows: list[dict[str, object]]) -> dict[str, object]:
    total_payroll = sum(float(row["salary_vnd"]) for row in rows)
    total_merit = sum(float(row["merit_increase_vnd"]) for row in rows)
    total_bonus = sum(float(row["bonus_vnd"]) for row in rows)
    review_count = sum(1 for row in rows if row["pay_equity_flag"] == "Review")
    avg_compa = average([float(row["compa_ratio"]) for row in rows])
    underpaid_high_performers = [
        row
        for row in rows
        if int(row["performance_rating"]) >= 4
        and float(row["compa_ratio"]) < PAY_EQUITY_MIN_COMPA_RATIO
    ]

    by_department: dict[str, dict[str, object]] = defaultdict(
        lambda: {
            "headcount": 0,
            "salary": 0.0,
            "bonus": 0.0,
            "merit": 0.0,
            "rating": 0.0,
            "compa": [],
            "review": 0,
            "below": 0,
            "above": 0,
            "fix_cost": 0.0,
            "female_salary": [],
            "male_salary": [],
            "level_counts": defaultdict(int),
            "budget": 0.0,
        }
    )
    by_level: dict[str, list[float]] = defaultdict(list)
    by_gender: dict[str, list[float]] = defaultdict(list)
    by_location: dict[str, dict[str, object]] = defaultdict(
        lambda: {
            "headcount": 0,
            "salary": 0.0,
            "compa": [],
            "review": 0,
            "fix_cost": 0.0,
        }
    )
    by_rating: dict[int, dict[str, list[float]]] = defaultdict(
        lambda: {"compa": [], "bonus_pct": [], "merit_pct": []}
    )
    compa_bins = [
        {"label": "<0.80", "min": 0.0, "max": 0.80, "count": 0},
        {"label": "0.80-0.87", "min": 0.80, "max": 0.88, "count": 0},
        {"label": "0.88-0.99", "min": 0.88, "max": 1.00, "count": 0},
        {"label": "1.00-1.07", "min": 1.00, "max": 1.08, "count": 0},
        {"label": "1.08-1.16", "min": 1.08, "max": 1.17, "count": 0},
        {"label": ">1.16", "min": 1.17, "max": 99.0, "count": 0},
    ]

    scatter = []
    for row in rows:
        dept = str(row["department"])
        level = str(row["level"])
        location = str(row.get("location", "Unknown"))
        gender = str(row["gender"])
        salary = float(row["salary_vnd"])
        bonus = float(row["bonus_vnd"])
        merit = float(row["merit_increase_vnd"])
        compa_ratio = float(row["compa_ratio"])
        rating = int(row["performance_rating"])
        row_fix_cost = fix_cost(row)

        dept_item = by_department[dept]
        dept_item["headcount"] += 1
        dept_item["salary"] += salary
        dept_item["bonus"] += bonus
        dept_item["merit"] += merit
        dept_item["rating"] += rating
        dept_item["compa"].append(compa_ratio)
        dept_item["review"] += 1 if row["pay_equity_flag"] == "Review" else 0
        dept_item["below"] += 1 if compa_ratio < PAY_EQUITY_MIN_COMPA_RATIO else 0
        dept_item["above"] += 1 if compa_ratio > PAY_EQUITY_MAX_COMPA_RATIO else 0
        dept_item["fix_cost"] += row_fix_cost
        dept_item["budget"] = float(DEPARTMENTS.get(dept, {}).get("budget", 0))
        dept_item["level_counts"][level] += 1
        if gender == "Female":
            dept_item["female_salary"].append(salary)
        elif gender == "Male":
            dept_item["male_salary"].append(salary)

        loc_item = by_location[location]
        loc_item["headcount"] += 1
        loc_item["salary"] += salary
        loc_item["compa"].append(compa_ratio)
        loc_item["review"] += 1 if row["pay_equity_flag"] == "Review" else 0
        loc_item["fix_cost"] += row_fix_cost

        by_level[level].append(salary)
        by_gender[gender].append(salary)
        by_rating[rating]["compa"].append(compa_ratio)
        by_rating[rating]["bonus_pct"].append(bonus / salary * 100)
        by_rating[rating]["merit_pct"].append(merit / salary * 100)

        for item in compa_bins:
            if item["min"] <= compa_ratio < item["max"]:
                item["count"] += 1
                break

        scatter.append(
            {
                "x": compa_ratio,
                "y": rating + random.uniform(-0.08, 0.08),
                "department": dept,
                "employee": str(row.get("employee_id", "")),
                "salary": round(salary),
                "bonus": round(bonus),
                "gender": gender,
            }
        )

    dept_rows = []
    gender_gap_by_department = []
    outlier_rows = []
    headcount_matrix = []
    for dept in DEPARTMENTS:
        values = by_department[dept]
        headcount = int(values["headcount"])
        if not headcount:
            continue
        planned = float(values["budget"])
        used = float(values["merit"])
        male_avg = average(values["male_salary"])
        female_avg = average(values["female_salary"])
        gender_gap = ((male_avg - female_avg) / male_avg * 100) if male_avg else 0
        dept_rows.append(
            {
                "department": dept,
                "headcount": headcount,
                "avg_salary": round(float(values["salary"]) / headcount),
                "avg_rating": round(float(values["rating"]) / headcount, 2),
                "avg_compa": round(average(values["compa"]), 2),
                "bonus": round(float(values["bonus"])),
                "merit": round(used),
                "budget": round(planned),
                "budget_utilization": round((used / planned) * 100, 1) if planned else 0,
                "review_rate": round((float(values["review"]) / headcount) * 100, 1),
                "below_range": int(values["below"]),
                "above_range": int(values["above"]),
                "fix_cost": round(float(values["fix_cost"])),
            }
        )
        gender_gap_by_department.append(
            {
                "department": dept,
                "Female": round(female_avg),
                "Male": round(male_avg),
                "gap": round(gender_gap, 1),
            }
        )
        outlier_rows.append(
            {
                "department": dept,
                "Below range": int(values["below"]),
                "In range": headcount - int(values["below"]) - int(values["above"]),
                "Above range": int(values["above"]),
            }
        )
        headcount_matrix.append(
            {
                "department": dept,
                **{level: int(values["level_counts"][level]) for level in LEVELS},
            }
        )

    level_rows = [
        {
            "level": level,
            "p25": round(percentile(by_level[level], 0.25)),
            "median": round(percentile(by_level[level], 0.5)),
            "p75": round(percentile(by_level[level], 0.75)),
        }
        for level in LEVELS
        if by_level[level]
    ]

    male_avg = average(by_gender["Male"])
    female_avg = average(by_gender["Female"])
    gender_gap = ((male_avg - female_avg) / male_avg * 100) if male_avg else 0

    location_rows = []
    for location in LOCATIONS:
        values = by_location[location]
        headcount = int(values["headcount"])
        if not headcount:
            continue
        location_rows.append(
            {
                "location": location,
                "headcount": headcount,
                "avg_salary": round(float(values["salary"]) / headcount),
                "avg_compa": round(average(values["compa"]), 2),
                "review_rate": round((float(values["review"]) / headcount) * 100, 1),
                "fix_cost": round(float(values["fix_cost"])),
            }
        )

    performance_rows = [
        {
            "rating": rating,
            "avg_compa": round(average(by_rating[rating]["compa"]), 2),
            "avg_bonus_pct": round(average(by_rating[rating]["bonus_pct"]), 1),
            "avg_merit_pct": round(average(by_rating[rating]["merit_pct"]), 1),
        }
        for rating in PERFORMANCE_RATINGS
        if by_rating[rating]["compa"]
    ]

    total_fix_cost = sum(fix_cost(row) for row in rows)
    estimated_budget_remaining = sum(item["budget"] for item in DEPARTMENTS.values()) - total_merit
    largest_gap = max(gender_gap_by_department, key=lambda item: abs(item["gap"]))
    riskiest_dept = max(dept_rows, key=lambda item: item["review_rate"])
    highest_spend_dept = max(dept_rows, key=lambda item: item["merit"])

    return {
        "kpis": {
            "headcount": len(rows),
            "total_payroll": round(total_payroll),
            "annual_payroll": round(total_payroll * MONTHS_PER_YEAR),
            "merit_budget_used": round(total_merit),
            "merit_budget_remaining": round(estimated_budget_remaining),
            "total_bonus": round(total_bonus),
            "avg_compa_ratio": round(avg_compa, 2),
            "review_count": review_count,
            "review_rate": round(review_count / len(rows) * 100, 1),
            "gender_gap": round(gender_gap, 1),
            "fix_cost": round(total_fix_cost),
            "high_performer_underpaid": len(underpaid_high_performers),
        },
        "departments": sorted(dept_rows, key=lambda item: item["department"]),
        "levels": level_rows,
        "gender_by_department": gender_gap_by_department,
        "outliers_by_department": outlier_rows,
        "headcount_by_level": headcount_matrix,
        "locations": location_rows,
        "performance": performance_rows,
        "compa_bins": [{"label": item["label"], "count": item["count"]} for item in compa_bins],
        "scatter": scatter,
        "insights": {
            "largest_gap_department": largest_gap["department"],
            "largest_gap": largest_gap["gap"],
            "riskiest_department": riskiest_dept["department"],
            "riskiest_review_rate": riskiest_dept["review_rate"],
            "highest_spend_department": highest_spend_dept["department"],
            "highest_spend_merit": highest_spend_dept["merit"],
        },
    }


def script_json(value: object) -> str:
    return json.dumps(value, ensure_ascii=False)


def write_dashboard(rows: list[dict[str, object]], summary: dict[str, object]) -> None:
    del rows
    kpis = summary["kpis"]
    insights = summary["insights"]

    level_cards = []
    for item in summary["levels"]:
        level_cards.append(
            f"""
            <div class="range-card">
              <span>{item["level"]}</span>
              <strong>{compact_vnd(item["median"])}</strong>
              <small>P25 {compact_vnd(item["p25"])} - P75 {compact_vnd(item["p75"])}</small>
            </div>
            """
        )

    html = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Compensation Analytics Dashboard | Vo Tran Hoang Chau</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    :root {{
      --cream: #fbf7ef;
      --sand: #e5dac8;
      --tan: #c9a56f;
      --caramel: #7a521b;
      --espresso: #2a1b14;
      --ink: #201814;
      --muted: #756a5f;
      --white: #fffdfa;
      --line: rgba(42, 27, 20, 0.14);
      --danger: #9b3d21;
      --green: #4f6b3d;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      background: var(--cream);
      color: var(--ink);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: 0;
    }}
    main {{ max-width: 1240px; margin: 0 auto; padding: 28px 18px 48px; }}
    .hero {{
      position: relative;
      overflow: hidden;
      min-height: 320px;
      padding: 48px;
      border-radius: 36px 36px 8px 8px;
      background: linear-gradient(135deg, var(--espresso) 0%, #382318 100%);
      color: var(--white);
    }}
    .hero::before, .hero::after {{
      content: "";
      position: absolute;
      background: var(--sand);
      opacity: .95;
      border-radius: 42px 42px 0 0;
    }}
    .hero::before {{ width: 44%; height: 92px; right: 11%; top: 0; }}
    .hero::after {{ width: 22%; height: 116px; right: 3%; top: 34px; }}
    .eyebrow {{
      position: relative;
      z-index: 1;
      display: inline-flex;
      gap: 10px;
      align-items: center;
      color: #eadfcd;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: .08em;
      text-transform: uppercase;
    }}
    .spark {{ color: var(--tan); font-size: 22px; line-height: 1; }}
    h1 {{
      position: relative;
      z-index: 1;
      max-width: 820px;
      margin: 26px 0 14px;
      font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
      font-size: clamp(48px, 9vw, 104px);
      line-height: .92;
      font-weight: 900;
      letter-spacing: 0;
      text-transform: uppercase;
    }}
    .script {{
      display: block;
      color: var(--tan);
      font-family: Georgia, "Times New Roman", serif;
      font-style: italic;
      font-size: .58em;
      font-weight: 400;
      text-transform: none;
    }}
    .hero p {{
      position: relative;
      z-index: 1;
      max-width: 760px;
      margin: 0;
      color: #f4eadc;
      font-size: clamp(17px, 2vw, 23px);
      line-height: 1.45;
    }}
    .grid {{ display: grid; gap: 18px; }}
    .kpis {{
      grid-template-columns: repeat(6, minmax(0, 1fr));
      margin-top: 18px;
    }}
    .card {{
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--white);
      box-shadow: 0 18px 60px rgba(42, 27, 20, .07);
    }}
    .kpi {{ padding: 20px; background: var(--sand); min-height: 145px; }}
    .kpi strong {{
      display: block;
      margin-bottom: 8px;
      font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
      font-size: clamp(28px, 3.4vw, 46px);
      line-height: 1;
    }}
    .kpi span {{ color: var(--muted); font-size: 14px; line-height: 1.35; }}
    .section {{
      display: grid;
      grid-template-columns: .72fr 1.28fr;
      gap: 24px;
      margin-top: 24px;
      align-items: stretch;
    }}
    .section-title {{
      padding: 30px;
      background: var(--sand);
      border-radius: 8px;
    }}
    h2 {{
      margin: 0 0 16px;
      font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
      font-size: clamp(40px, 7vw, 74px);
      line-height: .94;
      text-transform: uppercase;
    }}
    h2 em {{
      display: block;
      color: var(--caramel);
      font-family: Georgia, "Times New Roman", serif;
      font-size: .72em;
      font-weight: 400;
      text-transform: none;
    }}
    .section-title p, .note p {{ color: var(--muted); line-height: 1.65; margin: 0; }}
    .panel {{ padding: 24px; }}
    .panel h3 {{ margin: 0 0 8px; font-size: 22px; }}
    .panel p.subtext {{ margin: 0 0 18px; color: var(--muted); line-height: 1.5; }}
    .chart-box {{ position: relative; min-height: 330px; }}
    .chart-box.tall {{ min-height: 430px; }}
    .chart-box.compact {{ min-height: 280px; }}
    .two-col {{ grid-template-columns: 1fr 1fr; }}
    .three-col {{ grid-template-columns: repeat(3, minmax(0, 1fr)); }}
    .range-grid {{ grid-template-columns: repeat(5, minmax(0, 1fr)); }}
    .range-card {{
      padding: 18px;
      border-radius: 8px;
      background: var(--espresso);
      color: var(--white);
      min-height: 134px;
    }}
    .range-card span, .range-card small {{ color: #e7ddcf; }}
    .range-card strong {{
      display: block;
      margin: 14px 0 10px;
      color: var(--tan);
      font-size: 28px;
    }}
    .callout {{
      padding: 24px;
      background: var(--espresso);
      color: var(--white);
    }}
    .callout strong {{
      display: block;
      margin-bottom: 8px;
      color: var(--tan);
      font-size: 26px;
    }}
    .callout span {{ color: #e7ddcf; line-height: 1.55; }}
    .filters {{
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 18px;
    }}
    button {{
      min-height: 38px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--white);
      color: var(--espresso);
      padding: 0 16px;
      font-weight: 800;
      cursor: pointer;
    }}
    button.active {{ background: var(--espresso); color: var(--white); }}
    .table-wrap {{ overflow-x: auto; }}
    table {{
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      min-width: 860px;
    }}
    th, td {{
      padding: 13px 10px;
      border-bottom: 1px solid var(--line);
      text-align: left;
      white-space: nowrap;
    }}
    th {{ color: var(--muted); font-size: 12px; text-transform: uppercase; }}
    th[data-sort] {{ cursor: pointer; user-select: none; }}
    th[data-sort]::after {{
      content: "sort";
      display: inline-block;
      margin-left: 6px;
      color: rgba(117, 106, 95, .65);
      font-size: 11px;
    }}
    th.sorted-asc::after {{ content: "asc"; color: var(--caramel); }}
    th.sorted-desc::after {{ content: "desc"; color: var(--caramel); }}
    .badge {{
      display: inline-flex;
      align-items: center;
      min-height: 28px;
      padding: 0 10px;
      border-radius: 999px;
      background: #eee6da;
      color: var(--espresso);
      font-weight: 800;
    }}
    .badge.risk {{ background: #f0d5c9; color: var(--danger); }}
    .footer {{
      margin-top: 24px;
      padding: 26px;
      border-radius: 8px;
      background: var(--sand);
      color: var(--muted);
    }}
    @media (max-width: 980px) {{
      .kpis, .section, .two-col, .three-col, .range-grid {{ grid-template-columns: 1fr; }}
      .chart-box, .chart-box.compact, .chart-box.tall {{ min-height: 300px; }}
    }}
    @media (max-width: 700px) {{
      main {{ padding: 16px 12px 36px; }}
      .hero {{ padding: 34px 24px; border-radius: 28px 28px 8px 8px; }}
      .panel, .section-title {{ padding: 20px; }}
      .kpi {{ min-height: 0; }}
    }}
  </style>
</head>
<body>
<main>
  <section class="hero">
    <h1><span class="script">Compensation</span> Review Dashboard</h1>
    <p>Python-generated compensation analytics for a Vietnam tech company preparing merit, bonus, pay equity, and salary band decisions.</p>
  </section>

  <section class="grid kpis" aria-label="Key compensation metrics">
    <div class="card kpi"><strong>{kpis["headcount"]}</strong><span>employee records across 6 departments, 5 levels, and 4 locations</span></div>
    <div class="card kpi"><strong>{compact_vnd(kpis["total_payroll"])}</strong><span>modeled monthly payroll; annualized at {compact_vnd(kpis["annual_payroll"])}</span></div>
    <div class="card kpi"><strong>{compact_vnd(kpis["merit_budget_used"])}</strong><span>projected monthly merit spend from performance rules</span></div>
    <div class="card kpi"><strong>{kpis["review_rate"]}%</strong><span>employees outside the {PAY_EQUITY_MIN_COMPA_RATIO:.2f}-{PAY_EQUITY_MAX_COMPA_RATIO:.2f} compa-ratio range</span></div>
    <div class="card kpi"><strong>{kpis["gender_gap"]}%</strong><span>overall unadjusted gender pay gap signal</span></div>
    <div class="card kpi"><strong>{compact_vnd(kpis["fix_cost"])}</strong><span>estimated annual cost to bring below-range employees to 0.88 compa-ratio</span></div>
  </section>

  <section class="section">
    <div class="section-title">
      <h2><em>Executive</em> Overview</h2>
      <p>Start with spend concentration and budget pressure, then move into risk: outliers, gender gap, high performers below range, and location premiums.</p>
    </div>
    <div class="card panel">
      <h3>Average Salary by Department</h3>
      <p class="subtext">Shows where cash compensation is structurally concentrated before merit decisions.</p>
      <div class="chart-box"><canvas id="salaryChart"></canvas></div>
    </div>
  </section>

  <section class="grid two-col" style="margin-top:24px">
    <div class="card panel">
      <h3>Merit Budget Utilization</h3>
      <p class="subtext">Compares modeled merit spend against department budget. Low utilization can fund targeted equity corrections.</p>
      <div class="chart-box compact"><canvas id="meritChart"></canvas></div>
    </div>
    <div class="card panel">
      <h3>Pay Equity Review Rate</h3>
      <p class="subtext">Dynamic axis scaling prevents the review-rate bars from understating risk.</p>
      <div class="chart-box compact"><canvas id="reviewChart"></canvas></div>
    </div>
  </section>

  <section class="grid three-col" style="margin-top:24px">
    <div class="card callout"><strong>{insights["riskiest_department"]}</strong><span>has the highest review rate at {pct(insights["riskiest_review_rate"])} and should be first in the equity audit queue.</span></div>
    <div class="card callout"><strong>{insights["largest_gap_department"]}</strong><span>has the largest unadjusted gender pay gap signal at {pct(insights["largest_gap"])}.</span></div>
    <div class="card callout"><strong>{kpis["high_performer_underpaid"]}</strong><span>high performers are below the target compa-ratio floor and may need retention-focused adjustments.</span></div>
  </section>

  <section class="section">
    <div class="section-title">
      <h2><em>Equity</em> Risk</h2>
      <p>Compa-ratio outliers are split into below-range and above-range populations. Below-range cases drive immediate correction cost; above-range cases inform band and promotion calibration.</p>
    </div>
    <div class="card panel">
      <h3>Compa-Ratio Outliers by Department</h3>
      <p class="subtext">Stacked counts show whether risk is concentrated in a few teams or broad-based.</p>
      <div class="chart-box"><canvas id="outlierChart"></canvas></div>
    </div>
  </section>

  <section class="grid two-col" style="margin-top:24px">
    <div class="card panel">
      <h3>Compa-Ratio Distribution</h3>
      <p class="subtext">The center of gravity should sit near 1.00; tails highlight salary band and equity pressure.</p>
      <div class="chart-box compact"><canvas id="compaHistogram"></canvas></div>
    </div>
    <div class="card panel">
      <h3>Gender Pay Gap by Department</h3>
      <p class="subtext">Grouped bars compare average salary by gender. Treat this as a triage view before level-adjusted regression.</p>
      <div class="chart-box compact"><canvas id="genderChart"></canvas></div>
    </div>
  </section>

  <section class="section">
    <div class="section-title">
      <h2><em>Performance</em> Pay</h2>
      <p>Compensation decisions should protect strong performers who sit below range, while ensuring bonus and merit outcomes are visibly differentiated by rating.</p>
    </div>
    <div class="card panel">
      <h3>Performance Rating vs Compa-Ratio</h3>
      <p class="subtext">Each point is an employee, colored by department. The vertical lines mark the pay equity review range.</p>
      <div class="chart-box tall"><canvas id="scatterChart"></canvas></div>
    </div>
  </section>

  <section class="grid two-col" style="margin-top:24px">
    <div class="card panel">
      <h3>Bonus and Merit Differentiation</h3>
      <p class="subtext">Average payout rates should step up with performance rating; flat lines would signal weak pay-for-performance design.</p>
      <div class="chart-box compact"><canvas id="performanceChart"></canvas></div>
    </div>
    <div class="card panel">
      <h3>What Would It Cost to Fix?</h3>
      <p class="subtext">Annualized correction estimate for employees below 0.88 compa-ratio, by department.</p>
      <div class="chart-box compact"><canvas id="fixCostChart"></canvas></div>
    </div>
  </section>

  <section class="section">
    <div class="section-title">
      <h2><em>Location</em> Strategy</h2>
      <p>Location views help HR and Finance test whether geographic salary differentials are still aligned with market premiums and remote work policy.</p>
    </div>
    <div class="card panel">
      <h3>Location Breakdown</h3>
      <p class="subtext">Salary, headcount, and compa-ratio are analyzed together so location premiums do not hide outlier risk.</p>
      <div class="chart-box"><canvas id="locationChart"></canvas></div>
    </div>
  </section>

  <section class="grid two-col" style="margin-top:24px">
    <div class="card panel">
      <h3>Headcount by Department and Level</h3>
      <p class="subtext">Composition matters: a team with many senior employees can have high spend without necessarily being over budget.</p>
      <div class="chart-box"><canvas id="headcountChart"></canvas></div>
    </div>
    <div class="card panel">
      <h3>Salary Bands by Level</h3>
      <p class="subtext">P25, median, and P75 summarize internal ranges before salary band refresh decisions.</p>
      <div class="grid range-grid">
        {"".join(level_cards)}
      </div>
    </div>
  </section>

  <section class="card panel" style="margin-top:24px">
    <h3>Department Drilldown</h3>
    <p class="subtext">Filter by department and click any column header to sort. Risk badges highlight review rates above 25%.</p>
    <div class="filters" id="filters"></div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th data-sort="department">Department</th>
            <th data-sort="headcount">Headcount</th>
            <th data-sort="avg_salary">Avg Salary</th>
            <th data-sort="avg_rating">Avg Rating</th>
            <th data-sort="avg_compa">Avg Compa</th>
            <th data-sort="budget_utilization">Merit Budget</th>
            <th data-sort="review_rate">Review Rate</th>
            <th data-sort="below_range">Below</th>
            <th data-sort="above_range">Above</th>
            <th data-sort="fix_cost">Fix Cost</th>
          </tr>
        </thead>
        <tbody id="deptRows"></tbody>
      </table>
    </div>
  </section>

  <section class="footer">
    <strong>Dataset note:</strong> This dashboard uses simulated HR compensation data generated for portfolio demonstration only. No confidential employer, client, or payroll data is used.
  </section>
</main>
<script>
  const departments = {script_json(summary["departments"])};
  const locations = {script_json(summary["locations"])};
  const genderByDepartment = {script_json(summary["gender_by_department"])};
  const outliersByDepartment = {script_json(summary["outliers_by_department"])};
  const headcountByLevel = {script_json(summary["headcount_by_level"])};
  const performance = {script_json(summary["performance"])};
  const compaBins = {script_json(summary["compa_bins"])};
  const scatterRows = {script_json(summary["scatter"])};
  const levels = {script_json(list(LEVELS))};
  const filters = document.querySelector("#filters");
  const rows = document.querySelector("#deptRows");
  const sortableHeaders = document.querySelectorAll("th[data-sort]");
  let active = "All";
  let sortState = {{ key: "department", direction: "asc" }};

  function formatVnd(value) {{
    return new Intl.NumberFormat("en-US", {{ maximumFractionDigits: 0 }}).format(value);
  }}

  function compactVnd(value) {{
    if (Math.abs(value) >= 1000000000) return `${{(value / 1000000000).toFixed(1)}}B`;
    return `${{Math.round(value / 1000000)}}M`;
  }}

  function renderFilters() {{
    filters.innerHTML = "";
    ["All", ...departments.map(item => item.department)].forEach(name => {{
      const button = document.createElement("button");
      button.textContent = name;
      button.className = name === active ? "active" : "";
      button.addEventListener("click", () => {{
        active = name;
        renderFilters();
        renderRows();
      }});
      filters.appendChild(button);
    }});
  }}

  function getVisibleDepartments() {{
    const visible = active === "All" ? [...departments] : departments.filter(item => item.department === active);
    return visible.sort((a, b) => {{
      const left = a[sortState.key];
      const right = b[sortState.key];
      const result = typeof left === "string"
        ? left.localeCompare(right)
        : Number(left) - Number(right);
      return sortState.direction === "asc" ? result : -result;
    }});
  }}

  function updateSortIndicators() {{
    sortableHeaders.forEach(header => {{
      header.classList.toggle("sorted-asc", header.dataset.sort === sortState.key && sortState.direction === "asc");
      header.classList.toggle("sorted-desc", header.dataset.sort === sortState.key && sortState.direction === "desc");
    }});
  }}

  function renderRows() {{
    rows.innerHTML = "";
    getVisibleDepartments().forEach(item => {{
      const riskClass = item.review_rate >= 25 ? "badge risk" : "badge";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${{item.department}}</td>
        <td>${{item.headcount}}</td>
        <td>${{formatVnd(item.avg_salary)}}</td>
        <td>${{item.avg_rating}}</td>
        <td>${{item.avg_compa}}</td>
        <td>${{item.budget_utilization}}%</td>
        <td><span class="${{riskClass}}">${{item.review_rate}}%</span></td>
        <td>${{item.below_range}}</td>
        <td>${{item.above_range}}</td>
        <td>${{compactVnd(item.fix_cost)}}</td>
      `;
      rows.appendChild(tr);
    }});
    updateSortIndicators();
  }}

  sortableHeaders.forEach(header => {{
    header.addEventListener("click", () => {{
      const key = header.dataset.sort;
      sortState = {{
        key,
        direction: sortState.key === key && sortState.direction === "asc" ? "desc" : "asc"
      }};
      renderRows();
    }});
  }});

  const chartColors = {{
    espresso: "#2a1b14",
    caramel: "#7a521b",
    tan: "#c9a56f",
    sand: "#e5dac8",
    muted: "#756a5f",
    danger: "#9b3d21",
    green: "#4f6b3d",
    gold: "#d1a14d",
    cream: "#fbf7ef"
  }};
  const palette = ["#7a521b", "#c9a56f", "#2a1b14", "#9b3d21", "#4f6b3d", "#756a5f"];

  const rangePlugin = {{
    id: "rangePlugin",
    afterDatasetsDraw(chart) {{
      if (chart.canvas.id !== "scatterChart") return;
      const {{ctx, chartArea, scales}} = chart;
      const x = scales.x;
      [0.88, 1.16].forEach(value => {{
        const px = x.getPixelForValue(value);
        ctx.save();
        ctx.strokeStyle = "rgba(155, 61, 33, .65)";
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(px, chartArea.top);
        ctx.lineTo(px, chartArea.bottom);
        ctx.stroke();
        ctx.restore();
      }});
    }}
  }};

  if (typeof Chart !== "undefined") {{
    Chart.register(rangePlugin);
  }}

  function baseOptions({{ indexAxis = "x", stacked = false, yBeginAtZero = true, xBeginAtZero = true, tooltipLabel = undefined, legend = false }} = {{}}) {{
    return {{
      indexAxis,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {{
        legend: {{ display: legend, labels: {{ color: chartColors.espresso, boxWidth: 14 }} }},
        tooltip: {{
          backgroundColor: chartColors.espresso,
          titleColor: "#fffdfa",
          bodyColor: "#f4eadc",
          padding: 12,
          callbacks: tooltipLabel ? {{ label: tooltipLabel }} : undefined
        }}
      }},
      scales: {{
        x: {{
          beginAtZero: xBeginAtZero,
          stacked,
          grid: {{ color: "rgba(42, 27, 20, 0.10)" }},
          ticks: {{ color: chartColors.muted }}
        }},
        y: {{
          beginAtZero: yBeginAtZero,
          stacked,
          grid: {{ color: indexAxis === "y" ? "transparent" : "rgba(42, 27, 20, 0.10)" }},
          ticks: {{ color: chartColors.espresso }}
        }}
      }}
    }};
  }}

  function fitCanvas(canvas) {{
    const rect = canvas.parentElement.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;
    canvas.width = Math.max(320, Math.floor(rect.width * scale));
    canvas.height = Math.max(220, Math.floor(rect.height * scale));
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    return {{ ctx, width: canvas.width / scale, height: canvas.height / scale }};
  }}

  function drawFallbackBars(canvasId, labels, values, {{ horizontal = false, formatter = value => value }} = {{}}) {{
    const canvas = document.querySelector(canvasId);
    const {{ ctx, width, height }} = fitCanvas(canvas);
    const max = Math.max(...values, 1);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = chartColors.cream;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = chartColors.muted;
    ctx.font = "12px Inter, sans-serif";
    if (horizontal) {{
      const left = 110;
      const barHeight = Math.min(26, (height - 30) / labels.length - 8);
      labels.forEach((label, index) => {{
        const y = 20 + index * ((height - 30) / labels.length);
        const barWidth = (width - left - 78) * (values[index] / max);
        ctx.fillStyle = chartColors.espresso;
        ctx.fillText(label, 8, y + barHeight * .72);
        ctx.fillStyle = index % 2 ? chartColors.tan : chartColors.caramel;
        ctx.fillRect(left, y, Math.max(3, barWidth), barHeight);
        ctx.fillStyle = chartColors.muted;
        ctx.fillText(formatter(values[index]), left + barWidth + 8, y + barHeight * .72);
      }});
    }} else {{
      const bottom = height - 48;
      const gap = 12;
      const barWidth = Math.max(20, (width - 42 - gap * labels.length) / labels.length);
      labels.forEach((label, index) => {{
        const x = 26 + index * (barWidth + gap);
        const barHeight = (bottom - 18) * (values[index] / max);
        ctx.fillStyle = index % 2 ? chartColors.tan : chartColors.caramel;
        ctx.fillRect(x, bottom - barHeight, barWidth, barHeight);
        ctx.save();
        ctx.translate(x + 3, bottom + 10);
        ctx.rotate(-Math.PI / 5);
        ctx.fillStyle = chartColors.muted;
        ctx.fillText(label, 0, 0);
        ctx.restore();
      }});
    }}
  }}

  function drawFallbackScatter() {{
    const canvas = document.querySelector("#scatterChart");
    const {{ ctx, width, height }} = fitCanvas(canvas);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = chartColors.cream;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(42, 27, 20, .2)";
    ctx.strokeRect(44, 20, width - 72, height - 58);
    scatterRows.forEach(item => {{
      const x = 44 + ((item.x - .65) / .7) * (width - 72);
      const y = height - 38 - ((item.y - 1.7) / 3.6) * (height - 58);
      const colorIndex = departments.findIndex(dept => dept.department === item.department);
      ctx.fillStyle = palette[Math.max(0, colorIndex) % palette.length];
      ctx.beginPath();
      ctx.arc(x, y, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }});
    ctx.fillStyle = chartColors.muted;
    ctx.font = "12px Inter, sans-serif";
    ctx.fillText("Compa-ratio", width / 2 - 34, height - 8);
    ctx.save();
    ctx.translate(14, height / 2 + 44);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Performance rating", 0, 0);
    ctx.restore();
  }}

  function renderCanvasFallbacks() {{
    const labels = departments.map(item => item.department);
    drawFallbackBars("#salaryChart", labels, departments.map(item => item.avg_salary), {{ horizontal: true, formatter: compactVnd }});
    drawFallbackBars("#meritChart", labels, departments.map(item => item.budget_utilization), {{ formatter: value => `${{value}}%` }});
    drawFallbackBars("#reviewChart", labels, departments.map(item => item.review_rate), {{ horizontal: true, formatter: value => `${{value}}%` }});
    drawFallbackBars("#outlierChart", labels, departments.map(item => item.below_range + item.above_range), {{ horizontal: true, formatter: value => `${{value}}` }});
    drawFallbackBars("#compaHistogram", compaBins.map(item => item.label), compaBins.map(item => item.count));
    drawFallbackBars("#genderChart", labels, genderByDepartment.map(item => Math.abs(item.gap)), {{ formatter: value => `${{value}}% gap` }});
    drawFallbackScatter();
    drawFallbackBars("#performanceChart", performance.map(item => `R${{item.rating}}`), performance.map(item => item.avg_bonus_pct), {{ formatter: value => `${{value}}%` }});
    drawFallbackBars("#fixCostChart", labels, departments.map(item => item.fix_cost), {{ horizontal: true, formatter: compactVnd }});
    drawFallbackBars("#locationChart", locations.map(item => item.location), locations.map(item => item.avg_salary), {{ formatter: compactVnd }});
    drawFallbackBars("#headcountChart", labels, departments.map(item => item.headcount), {{ horizontal: true }});
  }}

  function renderCharts() {{
    const labels = departments.map(item => item.department);
    const maxReview = Math.max(...departments.map(item => item.review_rate));
    const reviewMax = Math.ceil((maxReview + 3) / 5) * 5;

    if (typeof Chart === "undefined") {{
      renderCanvasFallbacks();
      return;
    }}

    new Chart(document.querySelector("#salaryChart"), {{
      type: "bar",
      data: {{
        labels,
        datasets: [{{
          data: departments.map(item => item.avg_salary),
          backgroundColor: chartColors.caramel,
          borderRadius: 8,
          maxBarThickness: 28
        }}]
      }},
      options: baseOptions({{
        indexAxis: "y",
        tooltipLabel: context => `${{context.label}}: ${{compactVnd(context.raw)}} VND`
      }})
    }});

    new Chart(document.querySelector("#meritChart"), {{
      type: "bar",
      data: {{
        labels,
        datasets: [{{
          data: departments.map(item => item.budget_utilization),
          backgroundColor: chartColors.tan,
          borderRadius: 8,
          maxBarThickness: 42
        }}]
      }},
      options: baseOptions({{
        tooltipLabel: context => `${{context.label}}: ${{context.raw}}%`,
      }})
    }});

    const reviewOptions = baseOptions({{
      indexAxis: "y",
      tooltipLabel: context => `${{context.label}}: ${{context.raw}}%`
    }});
    reviewOptions.scales.x.suggestedMax = reviewMax;
    new Chart(document.querySelector("#reviewChart"), {{
      type: "bar",
      data: {{
        labels,
        datasets: [{{
          data: departments.map(item => item.review_rate),
          backgroundColor: chartColors.espresso,
          borderRadius: 8,
          maxBarThickness: 26
        }}]
      }},
      options: reviewOptions
    }});

    new Chart(document.querySelector("#outlierChart"), {{
      type: "bar",
      data: {{
        labels,
        datasets: [
          {{ label: "Below range", data: outliersByDepartment.map(item => item["Below range"]), backgroundColor: chartColors.danger, borderRadius: 6 }},
          {{ label: "In range", data: outliersByDepartment.map(item => item["In range"]), backgroundColor: chartColors.sand, borderRadius: 6 }},
          {{ label: "Above range", data: outliersByDepartment.map(item => item["Above range"]), backgroundColor: chartColors.green, borderRadius: 6 }}
        ]
      }},
      options: baseOptions({{ indexAxis: "y", stacked: true, legend: true }})
    }});

    new Chart(document.querySelector("#compaHistogram"), {{
      type: "bar",
      data: {{
        labels: compaBins.map(item => item.label),
        datasets: [{{
          data: compaBins.map(item => item.count),
          backgroundColor: compaBins.map(item => item.label.includes("<") || item.label.includes(">") ? chartColors.danger : chartColors.caramel),
          borderRadius: 8,
          maxBarThickness: 44
        }}]
      }},
      options: baseOptions({{ tooltipLabel: context => `${{context.raw}} employees` }})
    }});

    new Chart(document.querySelector("#genderChart"), {{
      type: "bar",
      data: {{
        labels: genderByDepartment.map(item => item.department),
        datasets: [
          {{ label: "Female", data: genderByDepartment.map(item => item.Female), backgroundColor: chartColors.tan, borderRadius: 6 }},
          {{ label: "Male", data: genderByDepartment.map(item => item.Male), backgroundColor: chartColors.espresso, borderRadius: 6 }}
        ]
      }},
      options: baseOptions({{
        legend: true,
        tooltipLabel: context => `${{context.dataset.label}}: ${{compactVnd(context.raw)}} VND`
      }})
    }});

    const scatterDatasets = labels.map((department, index) => ({{
      label: department,
      data: scatterRows.filter(item => item.department === department),
      backgroundColor: palette[index % palette.length],
      pointRadius: 4,
      pointHoverRadius: 7
    }}));
    const scatterOptions = baseOptions({{ legend: true, xBeginAtZero: false, yBeginAtZero: false }});
    scatterOptions.scales.x.min = 0.65;
    scatterOptions.scales.x.max = 1.35;
    scatterOptions.scales.x.title = {{ display: true, text: "Compa-ratio", color: chartColors.muted }};
    scatterOptions.scales.y.min = 1.7;
    scatterOptions.scales.y.max = 5.3;
    scatterOptions.scales.y.title = {{ display: true, text: "Performance rating", color: chartColors.muted }};
    scatterOptions.plugins.tooltip.callbacks = {{
      label: context => {{
        const item = context.raw;
        return `${{item.employee}} | ${{item.department}} | rating ${{Math.round(item.y)}} | compa ${{item.x.toFixed(2)}} | ${{compactVnd(item.salary)}}`;
      }}
    }};
    new Chart(document.querySelector("#scatterChart"), {{
      type: "scatter",
      data: {{ datasets: scatterDatasets }},
      options: scatterOptions
    }});

    new Chart(document.querySelector("#performanceChart"), {{
      type: "line",
      data: {{
        labels: performance.map(item => `Rating ${{item.rating}}`),
        datasets: [
          {{ label: "Avg bonus %", data: performance.map(item => item.avg_bonus_pct), borderColor: chartColors.espresso, backgroundColor: chartColors.espresso, tension: .25 }},
          {{ label: "Avg merit %", data: performance.map(item => item.avg_merit_pct), borderColor: chartColors.tan, backgroundColor: chartColors.tan, tension: .25 }}
        ]
      }},
      options: baseOptions({{ legend: true, tooltipLabel: context => `${{context.dataset.label}}: ${{context.raw}}%` }})
    }});

    new Chart(document.querySelector("#fixCostChart"), {{
      type: "bar",
      data: {{
        labels,
        datasets: [{{
          data: departments.map(item => item.fix_cost),
          backgroundColor: chartColors.danger,
          borderRadius: 8,
          maxBarThickness: 30
        }}]
      }},
      options: baseOptions({{
        indexAxis: "y",
        tooltipLabel: context => `${{context.label}}: ${{compactVnd(context.raw)}} VND`
      }})
    }});

    new Chart(document.querySelector("#locationChart"), {{
      type: "bar",
      data: {{
        labels: locations.map(item => item.location),
        datasets: [
          {{ type: "bar", label: "Avg salary", yAxisID: "salary", data: locations.map(item => item.avg_salary), backgroundColor: chartColors.caramel, borderRadius: 8 }},
          {{ type: "line", label: "Avg compa-ratio", yAxisID: "compa", data: locations.map(item => item.avg_compa), borderColor: chartColors.espresso, backgroundColor: chartColors.espresso, tension: .25 }}
        ]
      }},
      options: {{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {{
          legend: {{ display: true, labels: {{ color: chartColors.espresso, boxWidth: 14 }} }},
          tooltip: {{ backgroundColor: chartColors.espresso, titleColor: "#fffdfa", bodyColor: "#f4eadc", padding: 12 }}
        }},
        scales: {{
          x: {{ ticks: {{ color: chartColors.espresso }}, grid: {{ color: "transparent" }} }},
          salary: {{
            type: "linear",
            position: "left",
            beginAtZero: true,
            ticks: {{ color: chartColors.muted, callback: value => compactVnd(value) }},
            grid: {{ color: "rgba(42, 27, 20, 0.10)" }}
          }},
          compa: {{
            type: "linear",
            position: "right",
            min: .85,
            max: 1.1,
            ticks: {{ color: chartColors.muted }},
            grid: {{ drawOnChartArea: false }}
          }}
        }}
      }}
    }});

    new Chart(document.querySelector("#headcountChart"), {{
      type: "bar",
      data: {{
        labels,
        datasets: levels.map((level, index) => ({{
          label: level,
          data: headcountByLevel.map(item => item[level]),
          backgroundColor: palette[index % palette.length],
          borderRadius: 6
        }}))
      }},
      options: baseOptions({{ indexAxis: "y", stacked: true, legend: true }})
    }});
  }}

  renderFilters();
  renderRows();
  renderCharts();
</script>
</body>
</html>
"""
    DASHBOARD_PATH.write_text(html, encoding="utf-8")


def main() -> None:
    rows = generate_rows()
    write_csv(rows)
    write_dashboard(rows, summarize(rows))
    print(f"Wrote {DATA_PATH}")
    print(f"Wrote {DASHBOARD_PATH}")


if __name__ == "__main__":
    main()
