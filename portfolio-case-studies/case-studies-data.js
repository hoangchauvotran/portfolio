const caseStudies = [
  {
    id: "delivery-performance",
    number: "01",
    eyebrow: "Operations Analytics",
    title: "Delivery Driver Performance Analysis",
    shortTitle: "Delivery Performance",
    role: "Solo data analyst project. I handled data understanding, EDA, dashboard interpretation, insight generation, and operational recommendations.",
    dataset: "11,399 delivery records, 19 columns, 2022 food and beverage express delivery data.",
    objective: "Identify the personal and environmental factors that affect delivery speed, customer rating, late delivery risk, and driver allocation efficiency.",
    tools: ["Excel", "Power BI", "EDA", "Operations Analytics", "Dashboarding", "Business Recommendations"],
    metrics: [
      { label: "Records analyzed", value: "11,399", detail: "delivery orders across driver, city, weather, traffic, and vehicle features" },
      { label: "Fastest group", value: "20-24", detail: "balanced high rating around 4.65 with efficient delivery time" },
      { label: "Late risk", value: "2+ orders", detail: "multiple simultaneous deliveries increase time and reduce ratings" },
      { label: "Best vehicle", value: "Motorcycle", detail: "strongest delivery-time performance in high-traffic and longer-distance contexts" }
    ],
    problem: [
      "Delivery performance was affected by many overlapping factors: age, vehicle type, weather, traffic, city type, distance, festivals, and multiple deliveries.",
      "The business needed practical rules for assigning drivers and managing service quality during difficult operating conditions."
    ],
    approach: [
      "Cleaned and profiled order-level delivery data to understand driver, order, and environmental attributes.",
      "Segmented performance by age group, vehicle type, traffic density, weather, city type, festival periods, and multiple-delivery load.",
      "Compared average delivery time, ratings, and late-delivery patterns to identify operational tradeoffs.",
      "Translated analytical findings into short-term, mid-term, and long-term recommendations."
    ],
    results: [
      "Drivers aged 20-24 showed the best balance between speed and service quality.",
      "Multiple deliveries reduced service quality: average delivery time increased and ratings dropped when drivers carried more than one order.",
      "Motorcycles outperformed scooters and electric scooters, especially in high-traffic and long-distance cases.",
      "Semi-Urban zones and Mondays require better driver allocation because demand and delivery time were misaligned."
    ],
    skills: ["Data cleaning", "Exploratory data analysis", "Operational segmentation", "KPI design", "Dashboard storytelling", "Recommendation design"],
    visual: {
      type: "bar",
      title: "Simulated Delivery Performance View",
      subtitle: "Average delivery time by operating condition",
      unit: "min",
      values: [
        { label: "Sunny / Low traffic", value: 9.3 },
        { label: "Single delivery", value: 9.9 },
        { label: "Multiple delivery", value: 10.2 },
        { label: "Bad weather", value: 10.8 },
        { label: "Semi-Urban jam", value: 11.5 }
      ]
    },
    workflow: ["Profile drivers", "Segment conditions", "Compare KPIs", "Find bottlenecks", "Recommend assignment rules"],
    recruiterAngle: "Shows the ability to connect operational data to practical dispatch, staffing, routing, and service-quality decisions."
  },
  {
    id: "loyalty-retention",
    number: "02",
    eyebrow: "Customer Analytics",
    title: "Retention Strategies for Loyalty Customers",
    shortTitle: "Loyalty Retention",
    role: "Solo data analyst project. I analyzed purchase behavior, cohort retention, churn patterns, customer segments, and retention strategy opportunities.",
    dataset: "20,000 sales transaction records, 16 columns, electronics company data from 09/2023 to 09/2024.",
    objective: "Understand loyalty customer behavior, explain low repeat purchase rates, and propose retention strategies to improve long-term customer value.",
    tools: ["Excel", "Power BI", "Cohort Analysis", "Customer Segmentation", "Retention Analysis", "Churn Analysis"],
    metrics: [
      { label: "Transactions", value: "20,000", detail: "electronics sales records across product, payment, shipping, and customer attributes" },
      { label: "Revenue", value: "43.46M", detail: "total revenue across the analysis period" },
      { label: "Orders", value: "13.43K", detail: "orders from 9,465 customers" },
      { label: "Worst churn", value: "93%", detail: "November 2023 cohort had the weakest retention profile" }
    ],
    problem: [
      "Loyalty customers were valuable but retention remained very low, with most customers dropping off after one purchase.",
      "The company needed to understand whether satisfaction, delivery speed, product type, payment method, or add-ons influenced retention."
    ],
    approach: [
      "Built an overview of revenue, orders, customers, average rating, and monthly sales trend.",
      "Compared loyalty and non-loyalty customers by price range, add-ons, product type, payment method, and satisfaction rating.",
      "Analyzed retention cohorts, then compared retained versus churned customers for the strongest and weakest months.",
      "Converted findings into retention tactics across post-purchase experience, loyalty program design, and campaign targeting."
    ],
    results: [
      "Loyalty customers concentrated in the 300-1000 price range and preferred Smartphones and Tablets.",
      "Customers giving 3-star ratings were at higher churn risk because the experience was average rather than memorable.",
      "Retained customers tended to prefer Express or Overnight shipping.",
      "Credit Card and PayPal behavior suggested opportunities for targeted payment-linked promotions."
    ],
    skills: ["Customer segmentation", "Cohort retention", "Churn comparison", "Revenue analysis", "Dashboard design", "Retention strategy"],
    visual: {
      type: "heatmap",
      title: "Retention Cohort Mockup",
      subtitle: "Simulated retention intensity based on project findings",
      rows: [
        { label: "Nov 2023", values: [100, 7, 4, 2, 1, 1, 1] },
        { label: "Jan 2024", values: [100, 23, 20, 18, 19, 21, 20] },
        { label: "Jul 2024", values: [100, 18, 15, 12, 10, 8, 6] }
      ],
      columns: ["M0", "M1", "M2", "M3", "M4", "M5", "M6"]
    },
    workflow: ["Define loyalty segment", "Analyze purchase behavior", "Build cohorts", "Compare churn vs retained", "Design retention actions"],
    recruiterAngle: "Shows customer analytics thinking: not just reporting churn, but turning churn signals into targeted business actions."
  },
  {
    id: "employee-promotion",
    number: "03",
    eyebrow: "People Analytics + ML",
    title: "Employee Promotion Analysis",
    shortTitle: "Promotion Analysis",
    role: "Solo data analyst project. I performed EDA, missing-value imputation, feature analysis, model training, tuning, and model comparison.",
    dataset: "155,846 employee records, 14 columns, including demographics, education, department, tenure, awards, KPI status, ratings, and training scores.",
    objective: "Identify key promotion factors and evaluate whether promotion prediction models behave differently across departments.",
    tools: ["Python", "Pandas", "K-Means", "SMOTE", "Random Forest", "Gradient Boosting", "GridSearchCV", "EDA", "Machine Learning"],
    metrics: [
      { label: "Records analyzed", value: "155,846", detail: "employee records across departments and performance attributes" },
      { label: "Promoted", value: "22,620", detail: "employees promoted in the dataset" },
      { label: "Best RF model", value: "87.3%", detail: "Sales & Marketing Random Forest GridSearchCV accuracy" },
      { label: "R&D promotion", value: "21.5%", detail: "highest promotion rate despite the smallest department size" }
    ],
    problem: [
      "Promotion decisions were influenced by department, training, performance, awards, tenure, recruitment channel, and prior rating.",
      "The business needed to understand which departments had stronger promotion readiness and which model approach was more reliable."
    ],
    approach: [
      "Used K-Means clustering to impute missing previous-year ratings based on training score, KPI achievement, and awards.",
      "Compared departments using promotion rate, award rate, KPI achievement, average training score, and previous-year rating.",
      "Focused model analysis on R&D and Sales & Marketing because they showed opposite performance profiles.",
      "Applied encoding, train-test split, SMOTE, Random Forest, Gradient Boosting, and GridSearchCV tuning."
    ],
    results: [
      "R&D had the highest promotion rate, highest training score, highest KPI achievement, and strongest previous-year performance.",
      "Sales & Marketing had the largest employee base but weaker KPI achievement, lower training score, and lower promotion rate.",
      "Random Forest with GridSearchCV improved Sales & Marketing accuracy from 84.4% to 87.3% and precision to 0.69.",
      "Gradient Boosting performed better for R&D but poorly for Sales & Marketing due to high false-positive behavior."
    ],
    skills: ["Missing-value imputation", "K-Means clustering", "Class imbalance handling", "SMOTE", "Model comparison", "Feature importance", "People analytics"],
    visual: {
      type: "model",
      title: "Model Comparison Snapshot",
      subtitle: "Accuracy by department and model variant",
      values: [
        { label: "R&D RF", value: 81.0 },
        { label: "R&D GB", value: 81.6 },
        { label: "Sales RF", value: 87.3 },
        { label: "Sales GB", value: 14.7 }
      ]
    },
    workflow: ["Clean data", "Impute ratings", "Compare departments", "Balance classes", "Train models", "Tune and interpret"],
    recruiterAngle: "Shows practical machine learning judgment: comparing models by business risk, not only choosing the highest headline score."
  }
];
