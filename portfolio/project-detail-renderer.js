function detailTextList(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function detailTags(items) {
  return `<div class="tags">${items.map((item) => `<span class="tag">${item}</span>`).join("")}</div>`;
}

function cssVars(theme = {}) {
  return Object.entries(theme)
    .map(([key, value]) => {
      const varName = key
        .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
        .replace(/^series(\d+)$/, "series-$1");
      return `--case-${varName}:${value}`;
    })
    .join(";");
}

function metricCards(items) {
  return `
    <section class="case-kpis" aria-label="Project key metrics">
      ${items
        .map(
          (item) => `
          <article class="case-kpi">
            <strong>${item.value}</strong>
            <span>${item.label}</span>
            <small>${item.detail}</small>
          </article>
        `
        )
        .join("")}
    </section>
  `;
}

function barChart(chart) {
  const max = Math.max(...chart.values.map((item) => item.value));
  return `
    <div class="case-chart case-bar-chart" data-chart="bar">
      ${chart.values
        .map((item, index) => {
          const width = Math.max(5, Math.round((item.value / max) * 100));
          return `
            <button class="case-bar-row${index === 0 ? " is-active" : ""}" type="button" data-label="${item.label}" data-value="${item.value}${chart.unit || ""}">
              <span>${item.label}</span>
              <i><b style="width:${width}%"></b></i>
              <strong>${item.value}${chart.unit || ""}</strong>
            </button>
          `;
        })
        .join("")}
      <p class="case-chart-note" aria-live="polite"></p>
    </div>
  `;
}

function groupedBarChart(chart) {
  const max = Math.max(...chart.groups.flatMap((group) => group.values.map((item) => item.value)));
  return `
    <div class="case-chart case-grouped-chart" data-chart="bar">
      <div class="case-legend">
        ${chart.series.map((item, index) => `<span><i style="background:var(--case-series-${index + 1})"></i>${item}</span>`).join("")}
      </div>
      ${chart.groups
        .map(
          (group) => `
          <div class="case-group">
            <span>${group.label}</span>
            <div>
              ${group.values
                .map((item, index) => {
                  const height = Math.max(8, Math.round((item.value / max) * 100));
                  return `<button style="height:${height}%;background:var(--case-series-${index + 1})" type="button" data-label="${group.label} ${chart.series[index]}" data-value="${item.value}${chart.unit || ""}"></button>`;
                })
                .join("")}
            </div>
          </div>
        `
        )
        .join("")}
      <p class="case-chart-note" aria-live="polite"></p>
    </div>
  `;
}

function lineChart(chart) {
  const values = chart.values.map((item) => item.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const spread = Math.max(1, max - min);
  const points = values
    .map((value, index) => {
      const x = 8 + (index / Math.max(1, values.length - 1)) * 84;
      const y = 88 - ((value - min) / spread) * 72;
      return `${x},${y}`;
    })
    .join(" ");

  return `
    <div class="case-chart case-line-chart" data-chart="line">
      <svg viewBox="0 0 100 100" role="img" aria-label="${chart.title}">
        <polyline points="${points}" fill="none" stroke="var(--case-accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></polyline>
        ${chart.values
          .map((item, index) => {
            const x = 8 + (index / Math.max(1, values.length - 1)) * 84;
            const y = 88 - ((item.value - min) / spread) * 72;
            return `<circle cx="${x}" cy="${y}" r="2.6" data-label="${item.label}" data-value="${item.value}${chart.unit || ""}"></circle>`;
          })
          .join("")}
      </svg>
      <div class="case-line-axis">
        ${chart.values.map((item) => `<span>${item.label}</span>`).join("")}
      </div>
    </div>
  `;
}

function heatColor(value) {
  const opacity = Math.max(0.12, Math.min(0.95, value / 100));
  return `rgba(var(--case-accent-rgb), ${opacity})`;
}

function heatmapChart(chart) {
  return `
    <div class="case-chart case-heatmap" data-chart="heatmap">
      <div class="case-heat-row">
        <span></span>
        ${chart.columns.map((column) => `<b>${column}</b>`).join("")}
      </div>
      ${chart.rows
        .map(
          (row) => `
          <div class="case-heat-row">
            <span>${row.label}</span>
              ${row.values
                .map((value, index) => {
                  const textColor = value >= 50 ? "var(--case-on-dark)" : "var(--case-dark)";
                  return `<button type="button" style="background:${heatColor(value)};color:${textColor}" data-label="${row.label} ${chart.columns[index]}" data-value="${value}%">${value}%</button>`;
                })
                .join("")}
          </div>
        `
        )
        .join("")}
      <p class="case-chart-note" aria-live="polite"></p>
    </div>
  `;
}

function modelTable(chart) {
  return `
    <div class="case-chart case-model-table">
      <table>
        <thead>
          <tr>${chart.columns.map((column) => `<th>${column}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${chart.rows
            .map(
              (row) => `
              <tr>
                ${row.map((cell, index) => `<td${index === 0 ? " class=\"model-name\"" : ""}>${cell}</td>`).join("")}
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function chartBlock(chart, index) {
  const chartMarkup = {
    bar: barChart,
    groupedBar: groupedBarChart,
    line: lineChart,
    heatmap: heatmapChart,
    table: modelTable,
  }[chart.type](chart);
  const wideClass = chart.type === "line" || chart.type === "heatmap" || chart.type === "table" || chart.fullWidth ? " is-wide" : "";

  return `
    <article class="case-panel chart-panel chart-${chart.type}${wideClass}" style="--chart-order:${index + 1};--chart-groups:${chart.groups ? chart.groups.length : 5}">
      <div class="case-panel-heading">
        <span>${chart.eyebrow || "Dashboard View"}</span>
        <h3>${chart.title}</h3>
        <p>${chart.subtitle}</p>
      </div>
      ${chartMarkup}
    </article>
  `;
}

function dashboardControls(study) {
  const controls = study.dashboard.controls || study.workflow || [];
  return `
    <section class="case-filter-bar" aria-label="Dashboard controls">
      <div class="case-filter-group">
        ${controls
          .slice(0, 6)
          .map((item, index) => `<button class="${index === 0 ? "is-active" : ""}" type="button">${item}</button>`)
          .join("")}
      </div>
      <div class="case-filter-meta">
        <span>Format</span>
        <strong>Interactive project view</strong>
      </div>
    </section>
  `;
}

function dashboardContextCard(study) {
  return `
    <aside class="case-context-card">
      <img src="${study.detailPreview}" alt="${study.title} project preview">
      <div class="case-context-list">
        <div>
          <span>Dataset</span>
          <strong>${study.dataset}</strong>
        </div>
        <div>
          <span>Role</span>
          <strong>${study.role}</strong>
        </div>
      </div>
      <a href="${study.pdf}" target="_blank" rel="noreferrer">Open PDF</a>
    </aside>
  `;
}

function insightCards(items) {
  return items
    .map(
      (item) => `
      <article class="case-panel insight-panel">
        <span>${item.label}</span>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `
    )
    .join("");
}

function recommendationCards(items) {
  return `
    <section class="case-recommendations">
      <div class="case-section-title">
        <span>Action Plan</span>
        <h2>Recommendations</h2>
      </div>
      <div class="case-recommendation-grid">
        ${items
          .map(
            (item) => `
            <article class="case-rec">
              <span>${item.horizon}</span>
              <h3>${item.title}</h3>
              <p>${item.text}</p>
            </article>
          `
          )
          .join("")}
      </div>
    </section>
  `;
}

const dashboardCloneData = {
  "loyalty-retention": [
    {
      title: "Overview",
      areas: [
        "title title title title title title title title title title title title",
        "rev rev ord ord cus cus rate rate qty qty member member",
        "ptype ptype combo combo combo combo combo combo gender gender date date",
        "ptype ptype combo combo combo combo combo combo gender gender date date",
        "ship ship pay pay pay rating rating rating addons addons addons addons",
        "ship ship pay pay pay rating rating rating addons addons addons addons",
        "ship ship pay pay pay rating rating rating addons addons addons addons"
      ],
      items: [
        { type: "kpi", area: "rev", label: "Total Revenue", value: "43.46M" },
        { type: "kpi", area: "ord", label: "Total Order", value: "13.43K" },
        { type: "kpi", area: "cus", label: "Total Customer", value: "9465" },
        { type: "kpi", area: "rate", label: "Average Rating", value: "3.10" },
        { type: "kpi", area: "qty", label: "Average Quantity", value: "5.48" },
        { type: "slicer", area: "member", title: "Loyalty Member", options: ["No", "Yes"] },
        { type: "date", area: "date", title: "Purchase Date", from: "9/24/2023", to: "9/23/2024" },
        { type: "slicer", area: "ptype", title: "Product Type", options: ["Headphones", "Laptop", "Smartphone", "Smartwatch", "Tablet"] },
        { type: "slicer", area: "ship", title: "Shipping Type", options: ["Expedited", "Express", "Overnight", "Same Day", "Standard"] },
        {
          type: "combo",
          area: "combo",
          title: "Total Payment by Month",
          values: [
            { label: "Sep", bar: 120, line: .3, barLabel: "0.3M" },
            { label: "Oct", bar: 520, line: 1.6, barLabel: "1.6M" },
            { label: "Nov", bar: 500, line: 1.4, barLabel: "1.4M" },
            { label: "Dec", bar: 510, line: 1.3, barLabel: "1.3M" },
            { label: "Jan", bar: 1450, line: 4.6, barLabel: "4.6M" },
            { label: "Feb", bar: 1240, line: 4.0, barLabel: "4.0M" },
            { label: "Mar", bar: 1350, line: 4.3, barLabel: "4.3M" },
            { label: "Apr", bar: 1390, line: 4.4, barLabel: "4.4M" },
            { label: "May", bar: 1450, line: 4.6, barLabel: "4.6M" },
            { label: "Jun", bar: 1460, line: 4.6, barLabel: "4.6M" },
            { label: "Jul", bar: 1440, line: 4.5, barLabel: "4.5M" },
            { label: "Aug", bar: 1420, line: 4.5, barLabel: "4.5M" },
            { label: "Sep", bar: 1040, line: 3.4, barLabel: "3.4M" }
          ]
        },
        {
          type: "grouped",
          area: "gender",
          title: "Gender by Age Group",
          series: ["Female", "Male"],
          groups: [
            { label: "Teen", values: [100, 100], displays: ["0.1K", "0.1K"] },
            { label: "Young Adult", values: [1200, 1100], displays: ["1.2K", "1.1K"] },
            { label: "Adult", values: [2100, 2200], displays: ["2.1K", "2.2K"] },
            { label: "Senior", values: [3200, 3400], displays: ["3.2K", "3.4K"] }
          ]
        },
        {
          type: "bar",
          area: "pay",
          title: "Payment Method Distribution",
          values: [
            { label: "Credit Card", value: 3900, display: "3.9K" },
            { label: "Paypal", value: 3900, display: "3.9K" },
            { label: "Bank Transfer", value: 2300, display: "2.3K" },
            { label: "Cash", value: 1700, display: "1.7K" },
            { label: "Debit Card", value: 1700, display: "1.7K" }
          ]
        },
        {
          type: "bar",
          area: "rating",
          title: "Customer Rating Distribution",
          values: [
            { label: "1", value: 1400, display: "1.4K" },
            { label: "2", value: 2600, display: "2.6K" },
            { label: "3", value: 5300, display: "5.3K" },
            { label: "4", value: 1400, display: "1.4K" },
            { label: "5", value: 2700, display: "2.7K" }
          ]
        },
        {
          type: "grouped",
          area: "addons",
          title: "Add-ons by Age Group",
          series: ["0", "1", "2", "3"],
          groups: [
            { label: "Teen", values: [48, 52, 45, 43] },
            { label: "Young Adult", values: [575, 562, 581, 587] },
            { label: "Adult", values: [1021, 1080, 1112, 980] },
            { label: "Senior", values: [1642, 1625, 1590, 1677] }
          ]
        }
      ]
    },
    {
      title: "Loyalty Customer Purchase Behaviour",
      areas: [
        "title title title title title title title title title title title title",
        "kpi1 kpi1 kpi2 kpi2 kpi3 kpi3 kpi4 kpi4 member member member member",
        "price price price addons addons addons paytrend paytrend paytrend paytrend paytrend paytrend",
        "price price price addons addons addons paytrend paytrend paytrend paytrend paytrend paytrend",
        "product product product product payment payment payment payment ship ship ship ship",
        "product product product product payment payment payment payment ship ship ship ship",
        "product product product product payment payment payment payment ship ship ship ship"
      ],
      items: [
        { type: "kpi", area: "kpi1", label: "Loyalty Orders", value: "3.91K" },
        { type: "kpi", area: "kpi2", label: "Loyalty Revenue", value: "12.1M" },
        { type: "kpi", area: "kpi3", label: "Avg Rating", value: "3.08" },
        { type: "kpi", area: "kpi4", label: "Avg Quantity", value: "5.6" },
        { type: "slicer", area: "member", title: "Loyalty Member", options: ["Yes"] },
        { type: "grouped", area: "price", title: "Price Range by Loyalty", series: ["No", "Yes"], groups: [{ label: "<300", values: [19, 14] }, { label: "300-1000", values: [54, 58] }, { label: "1000+", values: [27, 28] }] },
        { type: "grouped", area: "addons", title: "Add-on Purchase by Loyalty", series: ["No", "Yes"], groups: [{ label: "0", values: [38, 33] }, { label: "1", values: [24, 27] }, { label: "2", values: [19, 22] }, { label: "3", values: [19, 18] }] },
        { type: "combo", area: "paytrend", title: "Total Payment by Month", values: [{ label: "Sep", bar: 60, line: .06, barLabel: "0.06M" }, { label: "Oct", bar: 170, line: .17, barLabel: "0.17M" }, { label: "Nov", bar: 310, line: .31, barLabel: "0.31M" }, { label: "Dec", bar: 420, line: .42, barLabel: "0.42M" }, { label: "Jan", bar: 860, line: .86, barLabel: "0.86M" }, { label: "Feb", bar: 960, line: .96, barLabel: "0.96M" }, { label: "Mar", bar: 910, line: .91, barLabel: "0.91M" }, { label: "Jul", bar: 1030, line: 1.03, barLabel: "1.03M" }, { label: "Sep", bar: 680, line: .68, barLabel: "0.68M" }] },
        { type: "bar", area: "product", title: "Product Type", values: [{ label: "Smartphone", value: 34 }, { label: "Tablet", value: 24 }, { label: "Laptop", value: 19 }, { label: "Smartwatch", value: 14 }, { label: "Headphones", value: 9 }] },
        { type: "bar", area: "payment", title: "Payment Method", values: [{ label: "Paypal", value: 28 }, { label: "Credit Card", value: 24 }, { label: "Cash", value: 20 }, { label: "Debit Card", value: 18 }, { label: "Bank Transfer", value: 10 }] },
        { type: "bar", area: "ship", title: "Shipping Type", values: [{ label: "Express", value: 27 }, { label: "Overnight", value: 23 }, { label: "Expedited", value: 20 }, { label: "Same Day", value: 16 }, { label: "Standard", value: 14 }] }
      ]
    },
    {
      title: "Retention Analysis",
      areas: [
        "title title title title title title title title title title title title",
        "kpi1 kpi1 kpi2 kpi2 kpi3 kpi3 kpi4 kpi4 kpi5 kpi5 kpi6 kpi6",
        "heat heat heat heat heat heat nov nov nov jan jan jan",
        "heat heat heat heat heat heat nov nov nov jan jan jan",
        "novprod novprod novprod novship novship novship janprod janprod janprod janship janship janship",
        "novprod novprod novprod novship novship novship janprod janprod janprod janship janship janship",
        "novprod novprod novprod novship novship novship janprod janprod janprod janship janship janship"
      ],
      items: [
        { type: "kpi", area: "kpi1", label: "Worst Cohort", value: "Nov 2023" },
        { type: "kpi", area: "kpi2", label: "Retained", value: "7" },
        { type: "kpi", area: "kpi3", label: "Churned", value: "94" },
        { type: "kpi", area: "kpi4", label: "Worst Churn", value: "93%" },
        { type: "kpi", area: "kpi5", label: "Best Cohort", value: "Jan 2024" },
        { type: "kpi", area: "kpi6", label: "Best Retained", value: "23" },
        { type: "heatmap", area: "heat", title: "Retention Cohort Heatmap", columns: ["M0", "M1", "M2", "M3", "M4", "M5", "M6"], rows: [{ label: "Nov 23", values: [100, 7, 4, 2, 1, 1, 1] }, { label: "Jan 24", values: [100, 23, 20, 18, 19, 21, 20] }, { label: "Apr 24", values: [100, 17, 13, 10, 8, 6, 4] }, { label: "Jul 24", values: [100, 18, 15, 12, 10, 8, 6] }] },
        { type: "grouped", area: "nov", title: "Nov Retain vs Churn", series: ["Retain", "Churn"], groups: [{ label: "Senior", values: [29, 46] }, { label: "Teen", values: [0, 8] }, { label: "3-star", values: [43, 54] }] },
        { type: "grouped", area: "jan", title: "Jan Retain vs Churn", series: ["Retain", "Churn"], groups: [{ label: "Senior", values: [39, 34] }, { label: "3-star", values: [44, 51] }, { label: "Credit Card", values: [33, 22] }] },
        { type: "bar", area: "novprod", title: "Nov Product Type", values: [{ label: "Smartphone", value: 42 }, { label: "Tablet", value: 18 }, { label: "Laptop", value: 16 }, { label: "Other", value: 24 }] },
        { type: "bar", area: "novship", title: "Nov Shipping Type", values: [{ label: "Standard", value: 31 }, { label: "Express", value: 18 }, { label: "Overnight", value: 16 }, { label: "Other", value: 35 }] },
        { type: "bar", area: "janprod", title: "Jan Product Type", values: [{ label: "Smartphone", value: 39 }, { label: "Tablet", value: 22 }, { label: "Laptop", value: 17 }, { label: "Other", value: 22 }] },
        { type: "bar", area: "janship", title: "Jan Shipping Type", values: [{ label: "Express", value: 37 }, { label: "Overnight", value: 21 }, { label: "Standard", value: 29 }, { label: "Other", value: 13 }] }
      ]
    }
  ],
  "delivery-performance": [
    {
      title: "Delivery Performance Overview",
      areas: [
        "title title title title title title title title title title title title",
        "orders orders time time rating rating late late age age vehicle vehicle",
        "type type timebar timebar timebar timebar weather weather weather traffic traffic traffic",
        "type type timebar timebar timebar timebar weather weather weather traffic traffic traffic",
        "city city load load load vehiclebar vehiclebar vehiclebar day day day day",
        "city city load load load vehiclebar vehiclebar vehiclebar day day day day",
        "city city load load load vehiclebar vehiclebar vehiclebar day day day day"
      ],
      items: [
        { type: "kpi", area: "orders", label: "Total Orders", value: "11.4K" },
        { type: "kpi", area: "time", label: "Avg Delivery Time", value: "10.1 min" },
        { type: "kpi", area: "rating", label: "Avg Rating", value: "4.64" },
        { type: "kpi", area: "late", label: "Late Risk Driver", value: "2+ orders" },
        { type: "slicer", area: "age", title: "Age Group", options: ["20-24", "25-29", "30-34", "35-39"] },
        { type: "slicer", area: "vehicle", title: "Vehicle", options: ["Motorcycle", "Scooter", "Electric scooter"] },
        { type: "slicer", area: "type", title: "Order Type", options: ["Drinks", "Meal", "Snack", "Buffet"] },
        { type: "slicer", area: "city", title: "City", options: ["Metropolitan", "Urban", "Semi-Urban"] },
        { type: "bar", area: "timebar", title: "Avg Delivery Time by Condition", values: [{ label: "Sunny / Low traffic", value: 9.3 }, { label: "Single delivery", value: 9.9 }, { label: "Multiple deliveries", value: 10.2 }, { label: "Bad weather", value: 10.8 }, { label: "Semi-Urban jam", value: 11.5 }] },
        { type: "grouped", area: "weather", title: "Weather by City", series: ["Urban", "Metro", "Semi"], groups: [{ label: "Sunny", values: [9.3, 9.4, 10.1] }, { label: "Cloudy", values: [10.1, 10.0, 10.8] }, { label: "Foggy", values: [10.2, 10.1, 11.0] }, { label: "Windy", values: [10.4, 10.3, 11.5] }] },
        { type: "grouped", area: "traffic", title: "On-Time Rate by Traffic", series: ["Urban", "Metro", "Semi"], groups: [{ label: "Low", values: [92, 94, 84] }, { label: "Medium", values: [86, 88, 76] }, { label: "High", values: [79, 82, 65] }, { label: "Jam", values: [71, 74, 58] }] },
        { type: "grouped", area: "load", title: "Multiple Deliveries", series: ["Time", "Rating", "Late"], groups: [{ label: "1 order", values: [99, 93, 8] }, { label: "2 orders", values: [102, 88, 17] }, { label: "3 orders", values: [108, 81, 28] }] },
        { type: "grouped", area: "vehiclebar", title: "Vehicle Performance", series: ["Normal", "Jam", "Bad weather"], groups: [{ label: "Motorcycle", values: [9.7, 10.4, 10.6] }, { label: "Scooter", values: [9.9, 10.5, 10.9] }, { label: "Electric", values: [10.1, 11.1, 11.4] }] },
        { type: "combo", area: "day", title: "Weekly Demand and Delay", values: [{ label: "Mon", bar: 112, line: 112, barLabel: "112" }, { label: "Tue", bar: 100, line: 100, barLabel: "100" }, { label: "Wed", bar: 96, line: 96, barLabel: "96" }, { label: "Thu", bar: 98, line: 98, barLabel: "98" }, { label: "Fri", bar: 104, line: 104, barLabel: "104" }, { label: "Sat", bar: 91, line: 91, barLabel: "91" }, { label: "Sun", bar: 88, line: 88, barLabel: "88" }] }
      ]
    },
    {
      title: "Optimization View",
      areas: [
        "title title title title title title title title title title title title",
        "k1 k1 k2 k2 k3 k3 k4 k4 festival festival festival festival",
        "city city city route route route driver driver driver vehicle vehicle vehicle",
        "city city city route route route driver driver driver vehicle vehicle vehicle",
        "distance distance distance weather weather weather load load load actions actions actions",
        "distance distance distance weather weather weather load load load actions actions actions",
        "distance distance distance weather weather weather load load load actions actions actions"
      ],
      items: [
        { type: "kpi", area: "k1", label: "Best Age", value: "20-24" },
        { type: "kpi", area: "k2", label: "Complex Routes", value: "30-39" },
        { type: "kpi", area: "k3", label: "Best Vehicle", value: "Motorcycle" },
        { type: "kpi", area: "k4", label: "Peak Day", value: "Monday" },
        { type: "grouped", area: "festival", title: "Festival by Rating Band", series: ["Normal", "Festival"], groups: [{ label: "4.0-4.4", values: [10.0, 11.4] }, { label: "4.5-4.9", values: [9.8, 10.9] }, { label: "5.0", values: [9.7, 9.6] }] },
        { type: "grouped", area: "city", title: "City Demand vs Time", series: ["Order share", "Time index"], groups: [{ label: "Metropolitan", values: [54, 98] }, { label: "Urban", values: [38, 100] }, { label: "Semi-Urban", values: [8, 115] }] },
        { type: "bar", area: "route", title: "Route Distance", values: [{ label: "<5 km", value: 38 }, { label: "5-10 km", value: 44 }, { label: "10-15 km", value: 13 }, { label: "15+ km", value: 5 }] },
        { type: "grouped", area: "driver", title: "Age Band Performance", series: ["Time", "Rating"], groups: [{ label: "20-24", values: [99, 93] }, { label: "25-29", values: [101, 93] }, { label: "30-34", values: [98, 90] }, { label: "35-39", values: [103, 88] }] },
        { type: "bar", area: "vehicle", title: "Vehicle Recommendation", values: [{ label: "Motorcycle", value: 92 }, { label: "Scooter", value: 78 }, { label: "Electric scooter", value: 60 }] },
        { type: "grouped", area: "weather", title: "Harsh Weather Quality", series: ["Distance", "Rating"], groups: [{ label: "Sunny", values: [82, 94] }, { label: "Cloudy", values: [94, 88] }, { label: "Stormy", values: [112, 82] }, { label: "Windy", values: [108, 84] }] },
        { type: "bar", area: "load", title: "Order Cap Rule", values: [{ label: "1 order", value: 93 }, { label: "2 orders", value: 88 }, { label: "3 orders", value: 81 }] },
        { type: "table", area: "actions", title: "Action Plan", columns: ["Term", "Decision"], rows: [["Short", "Cap simultaneous deliveries"], ["Mid", "Match vehicle to route"], ["Long", "Smart assignment system"]] }
      ]
    }
  ],
  "employee-promotion": [
    {
      title: "Promotion Overview",
      areas: [
        "title title title title title title title title title title title title",
        "records records promoted promoted rate rate rd rd sales sales dept dept",
        "deptvol deptvol deptvol deptvol ready ready ready ready train train train train",
        "deptvol deptvol deptvol deptvol ready ready ready ready train train train train",
        "award award award kpi kpi kpi rating rating rating cluster cluster cluster",
        "award award award kpi kpi kpi rating rating rating cluster cluster cluster",
        "award award award kpi kpi kpi rating rating rating cluster cluster cluster"
      ],
      items: [
        { type: "kpi", area: "records", label: "Employee Records", value: "155,846" },
        { type: "kpi", area: "promoted", label: "Promoted", value: "22,620" },
        { type: "kpi", area: "rate", label: "Promotion Rate", value: "14.5%" },
        { type: "kpi", area: "rd", label: "R&D Promotion", value: "21.5%" },
        { type: "kpi", area: "sales", label: "Sales Promotion", value: "13.6%" },
        { type: "slicer", area: "dept", title: "Department", options: ["R&D", "Sales & Marketing", "Finance", "Technology"] },
        { type: "grouped", area: "deptvol", title: "Employees and Promotion Rate by Department", series: ["Employee share", "Promotion rate"], groups: [{ label: "Sales", values: [31, 13.6] }, { label: "Operations", values: [21, 14.2] }, { label: "Technology", values: [18, 16.0] }, { label: "Procurement", values: [13, 12.4] }, { label: "Finance", values: [5, 17.1] }, { label: "R&D", values: [2, 21.5] }] },
        { type: "grouped", area: "ready", title: "Readiness Signals", series: ["KPI", "Awards", "Training"], groups: [{ label: "R&D", values: [50.2, 4.6, 83.2] }, { label: "Finance", values: [48.5, 3.6, 60.4] }, { label: "Technology", values: [43.0, 3.4, 80.1] }, { label: "Sales", values: [35.8, 2.3, 52.8] }] },
        { type: "bar", area: "train", title: "Average Training Score", values: [{ label: "R&D", value: 83.2 }, { label: "Technology", value: 80.1 }, { label: "Finance", value: 60.4 }, { label: "Operations", value: 59.2 }, { label: "Sales", value: 52.8 }] },
        { type: "bar", area: "award", title: "Award Rate", values: [{ label: "R&D", value: 4.6 }, { label: "Finance", value: 3.6 }, { label: "Technology", value: 3.4 }, { label: "Sales", value: 2.3 }] },
        { type: "bar", area: "kpi", title: "KPI Met >80%", values: [{ label: "R&D", value: 50.2 }, { label: "Finance", value: 48.5 }, { label: "Technology", value: 43.0 }, { label: "Sales", value: 35.8 }] },
        { type: "bar", area: "rating", title: "Previous Year Rating", values: [{ label: "R&D", value: 4.2 }, { label: "Technology", value: 3.7 }, { label: "Finance", value: 3.5 }, { label: "Sales", value: 3.0 }] },
        { type: "table", area: "cluster", title: "Missing Rating Imputation", columns: ["Step", "Method"], rows: [["Cluster", "K-Means k=4"], ["Features", "Training, KPI, awards"], ["Fill", "Cluster average rating"]] }
      ]
    },
    {
      title: "Department Promotion Analysis",
      areas: [
        "title title title title title title title title title title title title",
        "rdkpi rdkpi rdkpi saleskpi saleskpi saleskpi compare compare compare compare compare compare",
        "rdprofile rdprofile rdprofile rdage rdage rdage salesprofile salesprofile salesprofile salesage salesage salesage",
        "rdprofile rdprofile rdprofile rdage rdage rdage salesprofile salesprofile salesprofile salesage salesage salesage",
        "rdtrain rdtrain rdtrain rdtrain rdtrain rdtrain salestrain salestrain salestrain salestrain salestrain salestrain",
        "rdtrain rdtrain rdtrain rdtrain rdtrain rdtrain salestrain salestrain salestrain salestrain salestrain salestrain",
        "rdtrain rdtrain rdtrain rdtrain rdtrain rdtrain salestrain salestrain salestrain salestrain salestrain salestrain"
      ],
      items: [
        { type: "kpi", area: "rdkpi", label: "R&D Promotion Rate", value: "21.5%" },
        { type: "kpi", area: "saleskpi", label: "Sales Promotion Rate", value: "13.6%" },
        { type: "grouped", area: "compare", title: "R&D vs Sales Readiness", series: ["Promotion", "KPI", "Training"], groups: [{ label: "R&D", values: [21.5, 50.2, 83.2] }, { label: "Sales", values: [13.6, 35.8, 52.8] }] },
        { type: "grouped", area: "rdprofile", title: "R&D Education / Gender", series: ["Not promoted", "Promoted"], groups: [{ label: "Bachelor", values: [1650, 430] }, { label: "Master+", values: [720, 210] }, { label: "Male", values: [2180, 615] }, { label: "Female", values: [382, 85] }] },
        { type: "grouped", area: "rdage", title: "R&D Career Stage", series: ["Promoted", "Not"], groups: [{ label: "<25", values: [12, 14] }, { label: "25-30", values: [42, 38] }, { label: "31-35", values: [30, 28] }, { label: "36+", values: [16, 20] }] },
        { type: "grouped", area: "salesprofile", title: "Sales Education / Gender", series: ["Not promoted", "Promoted"], groups: [{ label: "Bachelor", values: [25500, 4509] }, { label: "Master+", values: [8100, 1260] }, { label: "Male", values: [33510, 5456] }, { label: "Female", values: [8100, 1110] }] },
        { type: "grouped", area: "salesage", title: "Sales Career Stage", series: ["Promoted", "Not"], groups: [{ label: "<25", values: [11, 13] }, { label: "25-30", values: [43, 39] }, { label: "31-35", values: [29, 30] }, { label: "36+", values: [17, 18] }] },
        { type: "grouped", area: "rdtrain", title: "R&D Training and Score", series: ["Promoted", "Not"], groups: [{ label: "1 train", values: [61, 65] }, { label: "2 train", values: [22, 20] }, { label: "3+ train", values: [17, 15] }, { label: "Score 80+", values: [55, 38] }] },
        { type: "grouped", area: "salestrain", title: "Sales Training and Score", series: ["Promoted", "Not"], groups: [{ label: "1 train", values: [68, 70] }, { label: "2 train", values: [18, 17] }, { label: "3+ train", values: [14, 13] }, { label: "Score 55+", values: [56, 42] }] }
      ]
    },
    {
      title: "Promotion Model Evaluation",
      areas: [
        "title title title title title title title title title title title title",
        "m1 m1 m2 m2 m3 m3 m4 m4 m5 m5 m6 m6",
        "table table table table table metrics metrics metrics features features features features",
        "table table table table table metrics metrics metrics features features features features",
        "rf rf rf gb gb gb salesrf salesrf salesrf salesgb salesgb salesgb",
        "rf rf rf gb gb gb salesrf salesrf salesrf salesgb salesgb salesgb",
        "rf rf rf gb gb gb salesrf salesrf salesrf salesgb salesgb salesgb"
      ],
      items: [
        { type: "kpi", area: "m1", label: "R&D RF Grid", value: "81.01%" },
        { type: "kpi", area: "m2", label: "R&D GB Grid", value: "81.63%" },
        { type: "kpi", area: "m3", label: "Sales RF Grid", value: "87.30%" },
        { type: "kpi", area: "m4", label: "Sales GB Grid", value: "14.66%" },
        { type: "kpi", area: "m5", label: "Best Precision", value: "0.69" },
        { type: "kpi", area: "m6", label: "High Recall Risk", value: "0.90" },
        { type: "table", area: "table", title: "Model Comparison", columns: ["Dept", "Model", "Accuracy", "Precision", "Risk"], rows: [["R&D", "RF Grid", "81.01%", "0.61", "Balanced"], ["R&D", "GB Grid", "81.63%", "0.64", "Best R&D"], ["Sales", "RF Grid", "87.30%", "0.69", "Best practical"], ["Sales", "GB Grid", "14.66%", "0.14", "False positives"]] },
        { type: "grouped", area: "metrics", title: "Model Metrics", series: ["Accuracy", "Precision", "Recall"], groups: [{ label: "R&D RF", values: [81, 61, 68] }, { label: "R&D GB", values: [82, 64, 66] }, { label: "Sales RF", values: [87, 69, 52] }, { label: "Sales GB", values: [15, 14, 90] }] },
        { type: "bar", area: "features", title: "Top Promotion Predictors", values: [{ label: "Avg training score", value: 31 }, { label: "Age", value: 22 }, { label: "Length of service", value: 19 }, { label: "Previous rating", value: 16 }, { label: "KPI / awards", value: 12 }] },
        { type: "bar", area: "rf", title: "R&D Random Forest", values: [{ label: "Accuracy", value: 81 }, { label: "Precision", value: 61 }, { label: "Recall", value: 68 }] },
        { type: "bar", area: "gb", title: "R&D Gradient Boosting", values: [{ label: "Accuracy", value: 82 }, { label: "Precision", value: 64 }, { label: "Recall", value: 66 }] },
        { type: "bar", area: "salesrf", title: "Sales Random Forest", values: [{ label: "Accuracy", value: 87 }, { label: "Precision", value: 69 }, { label: "Recall", value: 52 }] },
        { type: "bar", area: "salesgb", title: "Sales Gradient Boosting", values: [{ label: "Accuracy", value: 15 }, { label: "Precision", value: 14 }, { label: "Recall", value: 90 }] }
      ]
    }
  ]
};

function boardKpi(item) {
  return `
    <div class="bi-kpi" style="${item.area ? `grid-area:${item.area}` : ""}">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
    </div>
  `;
}

function boardSlicer(item) {
  return `
    <div class="bi-slicer" style="${item.area ? `grid-area:${item.area}` : ""}">
      <h4>${item.title}</h4>
      <div class="bi-slicer-options">
        ${item.options.map((option) => `<button type="button">${option}</button>`).join("")}
      </div>
    </div>
  `;
}

function boardDateSlicer(item) {
  return `
    <div class="bi-date-slicer" style="${item.area ? `grid-area:${item.area}` : ""}">
      <h4>${item.title}</h4>
      <div class="bi-date-row">
        <span>${item.from}</span>
        <span>${item.to}</span>
      </div>
      <div class="bi-slider"><i></i><b></b></div>
    </div>
  `;
}

function boardPanel(item, body) {
  return `
    <section class="bi-panel ${item.kind ? `bi-${item.kind}` : ""}" style="${item.area ? `grid-area:${item.area}` : ""}">
      <h4>${item.title}</h4>
      ${body}
    </section>
  `;
}

function axisTicks(maxValue, count = 4, suffix = "") {
  return Array.from({ length: count + 1 }, (_, index) => {
    const value = Math.round((maxValue / count) * index);
    return `<span>${value}${suffix}</span>`;
  }).join("");
}

function boardBars(item) {
  const maxValue = Math.max(...item.values.map((value) => value.value));
  return boardPanel(
    item,
    `<div class="bi-bars ${item.horizontal ? "is-horizontal" : ""}">
      ${item.values
        .map((value) => {
          const size = Math.max(4, (value.value / maxValue) * 100);
          return item.horizontal
            ? `<div class="bi-hbar"><span>${value.label}</span><i><b style="width:${size}%"></b></i><strong>${value.display || value.value}</strong></div>`
            : `<div class="bi-vbar"><i style="height:${size}%"></i><strong>${value.display || value.value}</strong><span>${value.label}</span></div>`;
        })
        .join("")}
    </div>`
  );
}

function boardGroupedBars(item) {
  const maxValue = Math.max(...item.groups.flatMap((group) => group.values));
  return boardPanel(
    item,
    `<div class="bi-legend">${item.series.map((series, index) => `<span><i class="s${index + 1}"></i>${series}</span>`).join("")}</div>
    <div class="bi-grouped-bars">
      ${item.groups
        .map(
          (group) => `
          <div class="bi-group">
            <div>
              ${group.values
                .map((value, index) => `<i class="s${index + 1}" style="height:${Math.max(4, (value / maxValue) * 100)}%"><em>${group.displays ? group.displays[index] : value}</em></i>`)
                .join("")}
            </div>
            <span>${group.label}</span>
          </div>
        `
        )
        .join("")}
    </div>`
  );
}

function boardCombo(item) {
  const barMax = Math.max(...item.values.map((value) => value.bar));
  const lineMax = Math.max(...item.values.map((value) => value.line));
  const points = item.values
    .map((value, index) => {
      const x = 6 + (index / Math.max(1, item.values.length - 1)) * 88;
      const y = 86 - (value.line / lineMax) * 72;
      return `${x},${y}`;
    })
    .join(" ");

  return boardPanel(
    item,
    `<div class="bi-combo">
      <div class="bi-combo-bars">
        ${item.values
          .map((value) => `<div><i style="height:${Math.max(4, (value.bar / barMax) * 100)}%"></i><strong>${value.barLabel}</strong></div>`)
          .join("")}
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline points="${points}" fill="none" stroke="var(--bi-navy)" stroke-width="2.8"></polyline>
      </svg>
      <div class="bi-xaxis">${item.values.map((value) => `<span>${value.label}</span>`).join("")}</div>
    </div>`
  );
}

function boardHeatmap(item) {
  const maxValue = Math.max(...item.rows.flatMap((row) => row.values));
  return boardPanel(
    item,
    `<div class="bi-heatmap">
      <div class="bi-heat-row"><span></span>${item.columns.map((column) => `<b>${column}</b>`).join("")}</div>
      ${item.rows
        .map(
          (row) => `
          <div class="bi-heat-row">
            <span>${row.label}</span>
            ${row.values.map((value) => `<i style="opacity:${Math.max(0.12, value / maxValue)}">${value}%</i>`).join("")}
          </div>
        `
        )
        .join("")}
    </div>`
  );
}

function boardTable(item) {
  return boardPanel(
    item,
    `<table class="bi-table">
      <thead><tr>${item.columns.map((column) => `<th>${column}</th>`).join("")}</tr></thead>
      <tbody>${item.rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>`
  );
}

function boardVisual(item) {
  if (item.type === "kpi") return boardKpi(item);
  if (item.type === "slicer") return boardSlicer(item);
  if (item.type === "date") return boardDateSlicer(item);
  if (item.type === "grouped") return boardGroupedBars(item);
  if (item.type === "combo") return boardCombo(item);
  if (item.type === "heatmap") return boardHeatmap(item);
  if (item.type === "table") return boardTable(item);
  return boardBars(item);
}

function clonedDashboardPages(study) {
  const boards = dashboardCloneData[study.id] || [];
  if (!boards.length) return "";

  return `
    <div class="bi-board-stack">
      ${boards
        .map(
          (board) => `
          <article class="bi-board bi-board-${study.id}" style="--bi-cols:${board.cols || 12};--bi-rows:${board.rows || 7};${board.areas ? `grid-template-areas:${board.areas.map((row) => `'${row}'`).join(" ")};` : ""}">
            <div class="bi-board-title">${board.title}</div>
            ${board.items.map(boardVisual).join("")}
          </article>
        `
        )
        .join("")}
    </div>
  `;
}

function dashboardTemplate(study) {
  const dashboard = study.dashboard;
  return `
    <div class="case-study-page case-${study.id}" style="${cssVars(dashboard.theme)}">
      <section class="case-dashboard-hero">
        <div class="case-title-block">
          <a class="case-back-link" href="../index.html#case-studies">Back to Projects</a>
          <span>${study.eyebrow}</span>
          <h1>${study.title}</h1>
          <p>${dashboard.intro}</p>
          ${detailTags(study.summaryTools || study.tools.slice(0, 4))}
        </div>
        ${dashboardContextCard(study)}
      </section>

      ${metricCards(study.metrics)}
      ${dashboardControls(study)}

      <section class="case-workspace">
        <div class="case-workspace-heading">
          <div>
            <span>Dashboard Workspace</span>
            <h2>${dashboard.dashboardTitle}</h2>
          </div>
          <p>${dashboard.dashboardText}</p>
        </div>
        ${clonedDashboardPages(study)}
      </section>

      <section class="case-analysis-grid">
        <div class="case-section-title">
          <span>Analysis</span>
          <h2>What The Dashboard Shows</h2>
          <p>${dashboard.analysisText}</p>
        </div>
        <div class="case-insight-grid">
          ${insightCards(dashboard.insights)}
        </div>
      </section>

      ${recommendationCards(dashboard.recommendations)}

      <section class="case-method-grid">
        <article class="case-panel">
          <span>Method</span>
          <h3>How I Worked</h3>
          ${detailTextList(study.approach)}
        </article>
        <article class="case-panel source-panel">
          <span>Reference</span>
          <h3>Project PDF</h3>
          <p>The PDF includes the original project visuals and supporting analysis for deeper review.</p>
          <a href="${study.pdf}" target="_blank" rel="noreferrer">Open PDF</a>
        </article>
      </section>
    </div>
  `;
}

function activateCharts() {
  document.querySelectorAll(".case-chart").forEach((chart) => {
    const note = chart.querySelector(".case-chart-note");
    const buttons = chart.querySelectorAll("button[data-label], circle[data-label]");

    function select(item) {
      buttons.forEach((button) => button.classList.toggle("is-active", button === item));
      if (note) {
        note.textContent = `${item.dataset.label}: ${item.dataset.value}`;
      }
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => select(button));
      button.addEventListener("mouseenter", () => select(button));
    });

    if (buttons[0]) {
      select(buttons[0]);
    }
  });

  document.querySelectorAll(".case-filter-bar button").forEach((button) => {
    button.addEventListener("click", () => {
      button
        .closest(".case-filter-group")
        .querySelectorAll("button")
        .forEach((item) => item.classList.toggle("is-active", item === button));
    });
  });
}

function renderProjectDetail() {
  const mount = document.querySelector("#projectDetail");
  const projectId = document.body.dataset.projectId;
  const availableCaseStudies =
    window.caseStudies || (typeof caseStudies !== "undefined" ? caseStudies : []);
  const study = availableCaseStudies.find((item) => item.id === projectId);

  if (!mount || !study) {
    return;
  }

  document.title = `${study.title} | Vo Tran Hoang Chau`;
  mount.innerHTML = dashboardTemplate(study);
  activateCharts();
}

renderProjectDetail();
