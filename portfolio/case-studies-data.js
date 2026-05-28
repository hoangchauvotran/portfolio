var caseStudies = [
  {
    id: "delivery-performance",
    number: "01",
    eyebrow: "Operations Analytics",
    title: "Delivery Driver Performance Analysis",
    shortTitle: "Delivery Performance",
    detailPage: "projects/delivery-performance.html",
    pdf: "../assets/projects/delivery-performance.pdf",
    preview: "assets/projects/delivery-performance.png",
    detailPreview: "../assets/projects/delivery-performance.png",
    role: "Solo data analyst project. I handled data understanding, EDA, dashboard interpretation, insight generation, and operational recommendations.",
    dataset: "11,399 delivery records, 19 columns, 2022 food and beverage express delivery data.",
    objective: "Identify the personal and environmental factors that affect delivery speed, customer rating, late delivery risk, and driver allocation efficiency.",
    summaryTools: ["Python", "Power BI", "Excel", "SQL"],
    tools: ["Python", "Power BI", "Excel", "SQL", "EDA", "Operations Analytics", "Dashboarding", "Business Recommendations"],
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
    recruiterAngle: "Shows the ability to connect operational data to practical dispatch, staffing, routing, and service-quality decisions.",
    dashboard: {
      theme: {
        bg: "#fff8df",
        surface: "#fffdf5",
        panel: "#ffffff",
        text: "#2f1a05",
        muted: "#6d5536",
        accent: "#e87900",
        accent2: "#ffc928",
        accent3: "#4c4ec1",
        onDark: "#fff8df",
        onDarkMuted: "#ffe8a8",
        dark: "#7a3f00",
        line: "rgba(122, 63, 0, .18)",
        accentRgb: "232, 121, 0",
        series1: "#e87900",
        series2: "#ffc928",
        series3: "#4c4ec1"
      },
      intro: "Delivery performance analysis focused on speed, ratings, late-delivery risk, vehicle choice, and driver assignment decisions.",
      dashboardTitle: "Delivery Operations Dashboard",
      dashboardText: "Key operating patterns are organized into scannable charts for driver allocation, service quality, and route planning decisions.",
      analysisText: "The strongest performance patterns come from the interaction between driver profile, order load, traffic, weather, and city type.",
      charts: [
        {
          type: "groupedBar",
          title: "Driver Age: Speed And Rating",
          subtitle: "A project manager can use age bands as a staffing signal: 20-24 balances speed and service quality, while 30-39 fits more complex routes.",
          unit: "",
          series: ["Delivery time index", "Rating index"],
          groups: [
            { label: "20-24", values: [{ value: 99 }, { value: 93 }] },
            { label: "25-29", values: [{ value: 101 }, { value: 93 }] },
            { label: "30-34", values: [{ value: 98 }, { value: 90 }] },
            { label: "35-39", values: [{ value: 103 }, { value: 88 }] }
          ]
        },
        {
          type: "groupedBar",
          title: "Vehicle Choice By Condition",
          subtitle: "Motorcycles are the most reliable option when routes are longer or traffic is heavy; electric scooters are more fragile under pressure.",
          unit: " min",
          series: ["Normal", "Traffic jam", "Bad weather"],
          groups: [
            { label: "Motorcycle", values: [{ value: 9.7 }, { value: 10.4 }, { value: 10.6 }] },
            { label: "Scooter", values: [{ value: 9.9 }, { value: 10.5 }, { value: 10.9 }] },
            { label: "Electric scooter", values: [{ value: 10.1 }, { value: 11.1 }, { value: 11.4 }] }
          ]
        },
        {
          type: "groupedBar",
          title: "Order Load Impact",
          subtitle: "The service-quality tradeoff is clear: more simultaneous deliveries create slower trips and weaker ratings.",
          unit: "",
          series: ["Time index", "Rating index", "Late risk"],
          groups: [
            { label: "1 order", values: [{ value: 99 }, { value: 93 }, { value: 8 }] },
            { label: "2 orders", values: [{ value: 102 }, { value: 88 }, { value: 17 }] },
            { label: "3 orders", values: [{ value: 108 }, { value: 81 }, { value: 28 }] }
          ]
        },
        {
          type: "groupedBar",
          title: "Weather And City Delay Risk",
          subtitle: "Bad weather and semi-urban routes are the main external delay drivers, so dispatch rules should react to both at once.",
          unit: " min",
          series: ["Urban", "Metropolitan", "Semi-Urban"],
          groups: [
            { label: "Sunny", values: [{ value: 9.3 }, { value: 9.4 }, { value: 10.1 }] },
            { label: "Cloudy", values: [{ value: 10.1 }, { value: 10.0 }, { value: 10.8 }] },
            { label: "Foggy", values: [{ value: 10.2 }, { value: 10.1 }, { value: 11.0 }] },
            { label: "Windy", values: [{ value: 10.4 }, { value: 10.3 }, { value: 11.5 }] }
          ]
        },
        {
          type: "groupedBar",
          title: "On-Time Rate By Traffic And City",
          subtitle: "Low-traffic metropolitan deliveries perform best; jammed semi-urban zones need more active driver allocation.",
          unit: "%",
          series: ["Urban", "Metropolitan", "Semi-Urban"],
          groups: [
            { label: "Low", values: [{ value: 92 }, { value: 94 }, { value: 84 }] },
            { label: "Medium", values: [{ value: 86 }, { value: 88 }, { value: 76 }] },
            { label: "High", values: [{ value: 79 }, { value: 82 }, { value: 65 }] },
            { label: "Jam", values: [{ value: 71 }, { value: 74 }, { value: 58 }] }
          ]
        },
        {
          type: "groupedBar",
          title: "Harsh Weather Service Quality",
          subtitle: "Stormy and windy deliveries travel farther and receive lower ratings, suggesting that these routes need tighter order caps.",
          unit: "",
          series: ["Distance index", "Rating index"],
          groups: [
            { label: "Sunny", values: [{ value: 82 }, { value: 94 }] },
            { label: "Cloudy", values: [{ value: 94 }, { value: 88 }] },
            { label: "Stormy", values: [{ value: 112 }, { value: 82 }] },
            { label: "Windy", values: [{ value: 108 }, { value: 84 }] }
          ]
        },
        {
          type: "groupedBar",
          title: "Festival Performance By Rating Band",
          subtitle: "High-rated drivers maintain better delivery times during festival periods, while mid-rated drivers experience larger delays.",
          unit: " min",
          series: ["Normal day", "Festival"],
          groups: [
            { label: "4.0-4.4", values: [{ value: 10.0 }, { value: 11.4 }] },
            { label: "4.5-4.9", values: [{ value: 9.8 }, { value: 10.9 }] },
            { label: "5.0", values: [{ value: 9.7 }, { value: 9.6 }] }
          ]
        },
        {
          type: "groupedBar",
          title: "City Demand Vs Delivery Time",
          subtitle: "Semi-Urban zones have fewer orders but longer delivery time, so staffing cannot be based on order count alone.",
          unit: "",
          series: ["Order share", "Time index"],
          groups: [
            { label: "Metropolitan", values: [{ value: 54 }, { value: 98 }] },
            { label: "Urban", values: [{ value: 38 }, { value: 100 }] },
            { label: "Semi-Urban", values: [{ value: 8 }, { value: 115 }] }
          ]
        },
        {
          type: "bar",
          title: "Short-Distance Route Opportunity",
          subtitle: "Most orders are under 10 km, creating opportunities for routing optimization and limited batching.",
          unit: "%",
          values: [
            { label: "< 5 km", value: 38 },
            { label: "5-10 km", value: 44 },
            { label: "10-15 km", value: 13 },
            { label: "15+ km", value: 5 }
          ]
        },
        {
          type: "line",
          title: "Weekly Demand And Delay Signal",
          subtitle: "A weekly operations view needs a wide time-series chart: Monday has both the highest order pressure and longer delivery time.",
          unit: " index",
          values: [
            { label: "Mon", value: 112 },
            { label: "Tue", value: 100 },
            { label: "Wed", value: 96 },
            { label: "Thu", value: 98 },
            { label: "Fri", value: 104 },
            { label: "Sat", value: 91 },
            { label: "Sun", value: 88 }
          ]
        }
      ],
      insights: [
        {
          label: "Driver Profile",
          title: "20-24 balances speed and quality",
          text: "Drivers aged 20-24 combine high ratings around 4.65 with efficient delivery time around 9.9 minutes, making them a strong default group for time-sensitive deliveries."
        },
        {
          label: "Order Load",
          title: "Multiple deliveries reduce experience",
          text: "When drivers handle more than one order, delivery time rises and average ratings fall, making order-load limits important for service quality."
        },
        {
          label: "Environment",
          title: "Traffic and weather compound delays",
          text: "Cloudy, foggy, windy, and jammed conditions are the biggest external delay drivers, especially in Semi-Urban areas."
        },
        {
          label: "Allocation",
          title: "Assignment rules should be contextual",
          text: "Motorcycles fit long-distance or high-traffic routes, scooters fit narrow urban streets, and experienced drivers fit complex or longer deliveries."
        }
      ],
      recommendations: [
        {
          horizon: "Short-Term",
          title: "Cap simultaneous deliveries",
          text: "Limit most trips to one or two orders, especially in poor weather or heavy traffic."
        },
        {
          horizon: "Mid-Term",
          title: "Match driver and vehicle to route",
          text: "Use motorcycles for long or traffic-heavy routes, scooters for dense urban areas, and younger drivers for urgent delivery windows."
        },
        {
          horizon: "Long-Term",
          title: "Build smart assignment logic",
          text: "Use live traffic, weather, vehicle type, location, and driver history to automate routing and order assignment."
        }
      ]
    }
  },
  {
    id: "loyalty-retention",
    number: "02",
    eyebrow: "Customer Analytics",
    title: "Retention Strategies for Loyalty Customers",
    shortTitle: "Loyalty Retention",
    detailPage: "projects/loyalty-retention.html",
    pdf: "../assets/projects/loyalty-retention.pdf",
    preview: "assets/projects/loyalty-retention.png",
    detailPreview: "../assets/projects/loyalty-retention.png",
    role: "Solo data analyst project. I analyzed purchase behavior, cohort retention, churn patterns, customer segments, and retention strategy opportunities.",
    dataset: "20,000 sales transaction records, 16 columns, electronics company data from 09/2023 to 09/2024.",
    objective: "Understand loyalty customer behavior, explain low repeat purchase rates, and propose retention strategies to improve long-term customer value.",
    summaryTools: ["Python", "Power BI", "Excel", "SQL"],
    tools: ["Python", "Power BI", "Excel", "SQL", "Cohort Analysis", "Customer Segmentation", "Retention Analysis", "Churn Analysis"],
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
    recruiterAngle: "Shows customer analytics thinking: not just reporting churn, but turning churn signals into targeted business actions.",
    dashboard: {
      theme: {
        bg: "#f3f8fb",
        surface: "#ffffff",
        panel: "#ffffff",
        text: "#203d59",
        muted: "#62798b",
        accent: "#315a80",
        accent2: "#9dcbe6",
        accent3: "#132c43",
        onDark: "#f5fbff",
        onDarkMuted: "#cfe8f8",
        dark: "#244862",
        line: "rgba(49, 90, 128, .18)",
        accentRgb: "49, 90, 128",
        series1: "#315a80",
        series2: "#9dcbe6",
        series3: "#132c43"
      },
      intro: "Customer retention analysis focused on revenue, order activity, cohort behavior, churn patterns, and loyalty strategy.",
      dashboardTitle: "Loyalty Retention Dashboard",
      dashboardText: "The dashboard highlights where repeat behavior breaks down and which customer signals can guide retention campaigns.",
      analysisText: "The core problem is not acquisition volume; it is weak repeat behavior after the first order, especially among customers with merely average experiences.",
      charts: [
        {
          type: "line",
          title: "Monthly Revenue Trend",
          subtitle: "A full-width time-series view shows the climb into January 2024, stable high revenue through August, and a September softening.",
          unit: "M",
          values: [
            { label: "Sep 23", value: 0.3 },
            { label: "Oct", value: 0.8 },
            { label: "Nov", value: 1.2 },
            { label: "Dec", value: 1.6 },
            { label: "Jan", value: 4.6 },
            { label: "Feb", value: 4.3 },
            { label: "Mar", value: 4.4 },
            { label: "Apr", value: 4.5 },
            { label: "May", value: 4.4 },
            { label: "Jun", value: 4.6 },
            { label: "Jul", value: 4.6 },
            { label: "Aug", value: 4.5 },
            { label: "Sep 24", value: 3.4 }
          ]
        },
        {
          type: "line",
          title: "Loyalty Payment Trend",
          subtitle: "Loyalty customer payments grow from program ramp-up into a stable high period, then drop at the end of the observed year.",
          unit: "M",
          values: [
            { label: "Sep 23", value: 0.06 },
            { label: "Oct", value: 0.17 },
            { label: "Nov", value: 0.31 },
            { label: "Dec", value: 0.42 },
            { label: "Jan", value: 0.86 },
            { label: "Feb", value: 0.96 },
            { label: "Mar", value: 0.91 },
            { label: "Apr", value: 0.94 },
            { label: "May", value: 0.98 },
            { label: "Jun", value: 1.00 },
            { label: "Jul", value: 1.03 },
            { label: "Aug", value: 0.98 },
            { label: "Sep 24", value: 0.68 }
          ]
        },
        {
          type: "groupedBar",
          title: "Customer Segment Overview",
          subtitle: "Non-loyalty customers still dominate the base, while most ratings cluster around 3 stars, pointing to an average experience.",
          unit: "%",
          series: ["Loyalty", "Non-loyalty"],
          groups: [
            { label: "Teen", values: [{ value: 6 }, { value: 11 }] },
            { label: "Adult", values: [{ value: 42 }, { value: 45 }] },
            { label: "Senior", values: [{ value: 52 }, { value: 44 }] },
            { label: "3-star rating", values: [{ value: 48 }, { value: 51 }] }
          ]
        },
        {
          type: "groupedBar",
          title: "Price Range And Loyalty",
          subtitle: "Loyalty customers are concentrated in the 300-1000 band, giving campaigns a clear commercial focus.",
          unit: "%",
          series: ["Loyalty", "Non-loyalty"],
          groups: [
            { label: "<300", values: [{ value: 14 }, { value: 19 }] },
            { label: "300-1000", values: [{ value: 58 }, { value: 54 }] },
            { label: "1000-1500", values: [{ value: 18 }, { value: 17 }] },
            { label: "1500+", values: [{ value: 10 }, { value: 10 }] }
          ]
        },
        {
          type: "groupedBar",
          title: "Add-On Engagement",
          subtitle: "Loyalty orders increase slightly with add-ons, but add-ons alone are not enough to guarantee retention.",
          unit: "%",
          series: ["Loyalty", "Non-loyalty"],
          groups: [
            { label: "None", values: [{ value: 33 }, { value: 38 }] },
            { label: "Accessories", values: [{ value: 27 }, { value: 24 }] },
            { label: "Warranty", values: [{ value: 22 }, { value: 19 }] },
            { label: "Impulse item", values: [{ value: 18 }, { value: 19 }] }
          ]
        },
        {
          type: "bar",
          title: "Loyalty Product Mix",
          subtitle: "Smartphones and Tablets are the strongest product categories for loyalty-focused campaigns.",
          unit: "%",
          values: [
            { label: "Smartphones", value: 34 },
            { label: "Tablets", value: 24 },
            { label: "Laptops", value: 19 },
            { label: "Smartwatches", value: 14 },
            { label: "Other electronics", value: 9 }
          ]
        },
        {
          type: "bar",
          title: "Preferred Payment Methods",
          subtitle: "PayPal and Credit Card usage suggests a strong preference for convenient online payment experiences.",
          unit: "%",
          values: [
            { label: "PayPal", value: 28 },
            { label: "Credit Card", value: 24 },
            { label: "Cash", value: 20 },
            { label: "Debit Card", value: 18 },
            { label: "Other", value: 10 }
          ]
        },
        {
          type: "heatmap",
          title: "Retention Cohort Heatmap",
          subtitle: "November 2023 is the weakest cohort, while January 2024 holds engagement longer despite still-low absolute retention.",
          columns: ["M0", "M1", "M2", "M3", "M4", "M5", "M6"],
          rows: [
            { label: "Nov 23", values: [100, 7, 4, 2, 1, 1, 1] },
            { label: "Jan 24", values: [100, 23, 20, 18, 19, 21, 20] },
            { label: "Apr 24", values: [100, 17, 13, 10, 8, 6, 4] },
            { label: "Jul 24", values: [100, 18, 15, 12, 10, 8, 6] }
          ]
        },
        {
          type: "groupedBar",
          title: "November Cohort: Retain Vs Churn",
          subtitle: "The worst cohort had only 7 retained customers versus 94 churned, so the comparison should focus on churn-risk patterns.",
          unit: "%",
          series: ["Retained", "Churned"],
          groups: [
            { label: "Senior", values: [{ value: 29 }, { value: 46 }] },
            { label: "Teen", values: [{ value: 0 }, { value: 8 }] },
            { label: "3-star rating", values: [{ value: 43 }, { value: 54 }] },
            { label: "Smartphones", values: [{ value: 38 }, { value: 42 }] },
            { label: "Impulse add-on", values: [{ value: 7 }, { value: 21 }] },
            { label: "Standard ship", values: [{ value: 14 }, { value: 31 }] }
          ]
        },
        {
          type: "groupedBar",
          title: "January Cohort: Retain Vs Churn",
          subtitle: "The best cohort still retained only 23 customers, but Express shipping, add-on value, and Credit Card behavior stand out.",
          unit: "%",
          series: ["Retained", "Churned"],
          groups: [
            { label: "Senior", values: [{ value: 39 }, { value: 34 }] },
            { label: "3-star rating", values: [{ value: 44 }, { value: 51 }] },
            { label: "Smartphones", values: [{ value: 36 }, { value: 39 }] },
            { label: "Accessories", values: [{ value: 30 }, { value: 18 }] },
            { label: "Credit Card", values: [{ value: 33 }, { value: 22 }] },
            { label: "Express ship", values: [{ value: 37 }, { value: 19 }] },
            { label: "Standard ship", values: [{ value: 12 }, { value: 29 }] }
          ]
        }
      ],
      insights: [
        {
          label: "Overview",
          title: "Scale is healthy, satisfaction is average",
          text: "The business records 43.46M revenue and 13.43K orders, but the average rating of 3.10 shows the experience is not distinctive enough."
        },
        {
          label: "Purchase Behavior",
          title: "Loyalty customers cluster in mid-price tech",
          text: "Loyalty customers concentrate in the 300-1000 price range and prefer Smartphones and Tablets, creating a clear category focus for campaigns."
        },
        {
          label: "Retention",
          title: "November 2023 exposes the churn problem",
          text: "The November cohort retained only 7 customers while 94 churned, producing the worst churn rate at 93%."
        },
        {
          label: "Experience",
          title: "Fast shipping matters",
          text: "Retained customers are more associated with Express or Overnight delivery, while Standard shipping appears more often in churned profiles."
        }
      ],
      recommendations: [
        {
          horizon: "Short-Term",
          title: "Improve post-purchase recovery",
          text: "Give loyalty customers faster shipping offers and follow-up messages that push a second purchase."
        },
        {
          horizon: "Mid-Term",
          title: "Refine loyalty value",
          text: "Bundle Smartphones and Tablets with relevant accessories, warranty, or payment-linked promotions."
        },
        {
          horizon: "Long-Term",
          title: "Test retention strategy by cohort",
          text: "Pilot retention campaigns on weak cohorts, measure repeat behavior, and scale the highest-performing treatment."
        }
      ]
    }
  },
  {
    id: "employee-promotion",
    number: "03",
    eyebrow: "People Analytics + ML",
    title: "Employee Promotion Analysis",
    shortTitle: "Promotion Analysis",
    detailPage: "projects/employee-promotion.html",
    pdf: "../assets/projects/employee-promotion.pdf",
    preview: "assets/projects/employee-promotion.png",
    detailPreview: "../assets/projects/employee-promotion.png",
    role: "Solo data analyst project. I performed EDA, missing-value imputation, feature analysis, model training, tuning, and model comparison.",
    dataset: "155,846 employee records, 14 columns, including demographics, education, department, tenure, awards, KPI status, ratings, and training scores.",
    objective: "Identify key promotion factors and evaluate whether promotion prediction models behave differently across departments.",
    summaryTools: ["Python", "Power BI", "Excel", "SQL"],
    tools: ["Python", "Power BI", "Excel", "SQL", "Pandas", "K-Means", "SMOTE", "Random Forest", "Gradient Boosting", "GridSearchCV", "EDA", "Machine Learning"],
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
    recruiterAngle: "Shows practical machine learning judgment: comparing models by business risk, not only choosing the highest headline score.",
    dashboard: {
      theme: {
        bg: "#f3efe2",
        surface: "#f8f3e7",
        panel: "#fffaf0",
        text: "#123d25",
        muted: "#5e715f",
        accent: "#2b986f",
        accent2: "#ffd24a",
        accent3: "#f26a42",
        onDark: "#fffaf0",
        onDarkMuted: "#d8f2df",
        dark: "#174f2e",
        line: "rgba(23, 79, 46, .2)",
        accentRgb: "43, 152, 111",
        series1: "#2b986f",
        series2: "#ffd24a",
        series3: "#f26a42"
      },
      intro: "People analytics project highlighting department readiness, promotion drivers, and model tradeoffs.",
      dashboardTitle: "Promotion Analytics Dashboard",
      dashboardText: "The dashboard connects EDA and machine learning results to promotion readiness, model precision, and department-level decisions.",
      analysisText: "The department comparison shows that model usefulness changes by population: R&D has stronger readiness signals, while Sales & Marketing needs better precision control.",
      charts: [
        {
          type: "groupedBar",
          title: "Promotion Volume And Rate By Department",
          subtitle: "Sales & Marketing has the largest population, but R&D has the strongest promotion rate despite being the smallest department.",
          unit: "%",
          series: ["Employee share", "Promotion rate"],
          groups: [
            { label: "Sales & Marketing", values: [{ value: 31 }, { value: 13.6 }] },
            { label: "Operations", values: [{ value: 21 }, { value: 14.2 }] },
            { label: "Technology", values: [{ value: 18 }, { value: 16.0 }] },
            { label: "Procurement", values: [{ value: 13 }, { value: 12.4 }] },
            { label: "Analytics", values: [{ value: 10 }, { value: 15.1 }] },
            { label: "Finance", values: [{ value: 5 }, { value: 17.1 }] },
            { label: "R&D", values: [{ value: 2 }, { value: 21.5 }] }
          ]
        },
        {
          type: "groupedBar",
          title: "Department Readiness Signals",
          subtitle: "R&D is strongest on KPI achievement, awards, training score, and previous-year rating; Sales & Marketing trails across the same signals.",
          unit: "%",
          series: ["KPI met", "Awards", "Training index"],
          groups: [
            { label: "R&D", values: [{ value: 50.2 }, { value: 4.6 }, { value: 83.2 }] },
            { label: "Finance", values: [{ value: 48.5 }, { value: 3.6 }, { value: 60.4 }] },
            { label: "Technology", values: [{ value: 43.0 }, { value: 3.4 }, { value: 80.1 }] },
            { label: "Sales & Marketing", values: [{ value: 35.8 }, { value: 2.3 }, { value: 52.8 }] }
          ]
        },
        {
          type: "bar",
          title: "Average Training Score",
          subtitle: "Training score is one of the clearest differences between R&D and Sales & Marketing.",
          unit: "",
          values: [
            { label: "R&D", value: 83.2 },
            { label: "Technology", value: 80.1 },
            { label: "Finance", value: 60.4 },
            { label: "Operations", value: 59.2 },
            { label: "Sales & Marketing", value: 52.8 }
          ]
        },
        {
          type: "groupedBar",
          title: "R&D Promotion Profile",
          subtitle: "Bachelor's and Master's degree holders, male employees, and the Other recruitment channel contribute the most R&D promotions.",
          unit: "",
          series: ["Not promoted", "Promoted"],
          groups: [
            { label: "Bachelor", values: [{ value: 1650 }, { value: 430 }] },
            { label: "Master+", values: [{ value: 720 }, { value: 210 }] },
            { label: "Male", values: [{ value: 2180 }, { value: 615 }] },
            { label: "Female", values: [{ value: 382 }, { value: 85 }] },
            { label: "Other channel", values: [{ value: 1450 }, { value: 429 }] }
          ]
        },
        {
          type: "groupedBar",
          title: "R&D Career Stage Signals",
          subtitle: "Both promoted and not-promoted employees peak around age 30, while two years of service is the dominant tenure point.",
          unit: "%",
          series: ["Promoted", "Not promoted"],
          groups: [
            { label: "Age <25", values: [{ value: 12 }, { value: 14 }] },
            { label: "Age 25-30", values: [{ value: 42 }, { value: 38 }] },
            { label: "Age 31-35", values: [{ value: 30 }, { value: 28 }] },
            { label: "Age 36+", values: [{ value: 16 }, { value: 20 }] },
            { label: "2 yrs service", values: [{ value: 36 }, { value: 34 }] }
          ]
        },
        {
          type: "groupedBar",
          title: "R&D Training And Promotion",
          subtitle: "Most R&D employees take one training course, but higher training scores are more associated with promotion.",
          unit: "%",
          series: ["Promoted", "Not promoted"],
          groups: [
            { label: "1 training", values: [{ value: 61 }, { value: 65 }] },
            { label: "2 trainings", values: [{ value: 22 }, { value: 20 }] },
            { label: "3+ trainings", values: [{ value: 17 }, { value: 15 }] },
            { label: "Score 70-80", values: [{ value: 25 }, { value: 35 }] },
            { label: "Score 80+", values: [{ value: 55 }, { value: 38 }] }
          ]
        },
        {
          type: "groupedBar",
          title: "Sales & Marketing Promotion Profile",
          subtitle: "The Sales & Marketing profile is much larger, with Bachelor's degree holders and the Other recruitment channel contributing the most promotions.",
          unit: "",
          series: ["Not promoted", "Promoted"],
          groups: [
            { label: "Bachelor", values: [{ value: 25500 }, { value: 4509 }] },
            { label: "Master+", values: [{ value: 8100 }, { value: 1260 }] },
            { label: "Male", values: [{ value: 33510 }, { value: 5456 }] },
            { label: "Female", values: [{ value: 8100 }, { value: 1110 }] },
            { label: "Other channel", values: [{ value: 23200 }, { value: 3654 }] }
          ]
        },
        {
          type: "groupedBar",
          title: "Sales Career Stage Signals",
          subtitle: "Sales & Marketing also peaks near age 30, but the lower training score and KPI achievement make promotion readiness weaker.",
          unit: "%",
          series: ["Promoted", "Not promoted"],
          groups: [
            { label: "Age <25", values: [{ value: 11 }, { value: 13 }] },
            { label: "Age 25-30", values: [{ value: 43 }, { value: 39 }] },
            { label: "Age 31-35", values: [{ value: 29 }, { value: 30 }] },
            { label: "Age 36+", values: [{ value: 17 }, { value: 18 }] },
            { label: "0-2 yrs service", values: [{ value: 48 }, { value: 50 }] }
          ]
        },
        {
          type: "groupedBar",
          title: "Sales Training Distribution",
          subtitle: "Most employees completed one training course and score around the low 50s, so training investment is a practical management lever.",
          unit: "%",
          series: ["Promoted", "Not promoted"],
          groups: [
            { label: "1 training", values: [{ value: 68 }, { value: 70 }] },
            { label: "2 trainings", values: [{ value: 18 }, { value: 17 }] },
            { label: "3+ trainings", values: [{ value: 14 }, { value: 13 }] },
            { label: "Score <55", values: [{ value: 44 }, { value: 58 }] },
            { label: "Score 55+", values: [{ value: 56 }, { value: 42 }] }
          ]
        },
        {
          type: "table",
          title: "Model Comparison",
          subtitle: "Random Forest GridSearchCV is strongest for Sales & Marketing; Gradient Boosting is more balanced in R&D.",
          columns: ["Department", "Model", "Accuracy", "Precision", "Read"],
          rows: [
            ["R&D", "Random Forest Grid", "81.01%", "0.61", "Reliable baseline"],
            ["R&D", "Gradient Boosting Grid", "81.63%", "0.64", "Best R&D accuracy"],
            ["Sales & Marketing", "Random Forest Grid", "87.30%", "0.69", "Best practical model"],
            ["Sales & Marketing", "Gradient Boosting Grid", "14.66%", "0.14", "High false-positive risk"]
          ]
        },
        {
          type: "groupedBar",
          title: "Model Metrics By Department",
          subtitle: "A manager should not choose by accuracy alone: Sales Gradient Boosting has high recall but too many false positives.",
          unit: "%",
          series: ["Accuracy", "Precision", "Recall"],
          groups: [
            { label: "R&D RF Grid", values: [{ value: 81 }, { value: 61 }, { value: 68 }] },
            { label: "R&D GB Grid", values: [{ value: 82 }, { value: 64 }, { value: 66 }] },
            { label: "Sales RF Grid", values: [{ value: 87 }, { value: 69 }, { value: 52 }] },
            { label: "Sales GB Grid", values: [{ value: 15 }, { value: 14 }, { value: 90 }] }
          ]
        },
        {
          type: "bar",
          title: "Top Promotion Predictors",
          subtitle: "Training score, age, service length, previous-year rating, KPI, and awards are the practical factors to monitor before nominations.",
          unit: "%",
          values: [
            { label: "Avg training score", value: 31 },
            { label: "Age", value: 22 },
            { label: "Length of service", value: 19 },
            { label: "Previous rating", value: 16 },
            { label: "KPI / awards", value: 12 }
          ]
        }
      ],
      insights: [
        {
          label: "EDA",
          title: "Promotion rate is low overall",
          text: "Only 22,620 employees were promoted out of 155,846 records, so the analysis must handle a naturally imbalanced decision problem."
        },
        {
          label: "Department",
          title: "R&D is promotion-ready",
          text: "R&D has the highest promotion rate at 21.5%, the highest average training score at 83.2, strong KPI achievement, and the highest award-winning rate."
        },
        {
          label: "Department",
          title: "Sales & Marketing needs capability improvement",
          text: "Sales & Marketing is the largest department but has weaker KPI achievement, the lowest training score, and a lower promotion rate."
        },
        {
          label: "Modeling",
          title: "Accuracy alone is not enough",
          text: "Gradient Boosting in Sales & Marketing catches many true promotions but creates too many false positives, making precision a business-critical metric."
        }
      ],
      recommendations: [
        {
          horizon: "Short-Term",
          title: "Use Random Forest Grid for Sales decisions",
          text: "It provides the most practical balance of accuracy and precision for Sales & Marketing promotion screening."
        },
        {
          horizon: "Mid-Term",
          title: "Raise Sales training and KPI readiness",
          text: "Invest in targeted training and performance support before increasing promotion nominations from the largest department."
        },
        {
          horizon: "Long-Term",
          title: "Model departments separately",
          text: "Keep department-specific model evaluation because the same algorithm behaves differently across employee populations."
        }
      ]
    }
  }
];

window.caseStudies = caseStudies;
