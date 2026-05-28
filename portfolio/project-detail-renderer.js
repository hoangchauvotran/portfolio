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

function chartColors(theme) {
  return [
    theme.series1 || theme.accent || "#1f6f73",
    theme.series2 || theme.accent2 || "#c9a56f",
    theme.series3 || theme.accent3 || "#9b3d21",
    theme.muted || "#756a5f",
    theme.dark || "#241812",
    theme.accent || "#1f6f73"
  ];
}

function colorWithAlpha(color, alpha) {
  if (!color) return `rgba(31, 111, 115, ${alpha})`;
  if (color.startsWith("#") && color.length === 7) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color;
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeFilterValue(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function chartValueSuffix(chart, dataset) {
  return dataset?.unit ?? chart.unit ?? "";
}

function selectedFilterLabel(study, filterValue) {
  const config = study.dashboard?.filterConfig;
  return config?.options?.[filterValue]?.label || config?.options?.all?.label || "All";
}

function filterOptionIds(study) {
  return Object.keys(study.dashboard?.filterConfig?.options || { all: { label: "All" } });
}

function filterChartMatchesValue(chart, filterValue) {
  if (filterValue === "all") return true;
  const values = chart.filterValues || (chart.filterValue ? [chart.filterValue] : chart.variant ? [chart.variant] : []);
  return values.includes(filterValue);
}

function isChartVisible(chart, filterValue) {
  if (filterValue === "all" || !chart.filter || chart.filter === "all" || chart.filter === "split") {
    return true;
  }
  if (chart.filter === "dept" || chart.filter === "dimension") {
    return filterChartMatchesValue(chart, filterValue);
  }
  if (typeof chart.filter === "object" && chart.filter.type === "hide") {
    return chart.filter.value !== filterValue;
  }
  return true;
}

function labelMatchesFilter(label, filterValue) {
  const normalized = normalizeFilterValue(label);
  if (filterValue === "loyalty") {
    return normalized.includes("loyalty") && !normalized.includes("non-loyalty");
  }
  if (filterValue === "non-loyalty") {
    return normalized.includes("non-loyalty");
  }
  if (filterValue === "electric-scooter") {
    return normalized.includes("electric") || normalized.includes("electric-scooter");
  }
  if (filterValue === "sales-marketing") {
    return normalized.includes("sales") || normalized.includes("marketing");
  }
  return normalized === filterValue || normalized.includes(filterValue);
}

function pointDimValue(label, filterValue) {
  return filterValue !== "all" && !labelMatchesFilter(label, filterValue);
}

function employeeFilterSubtitle(chart, filterValue, label) {
  const data = window.caseStudies
    ?.find((study) => study.id === "employee-promotion")
    ?.dashboard?.departmentData?.[filterValue];
  if (!data) return chart.subtitle;
  if (chart.title === "Promotion Volume And Rate By Department") {
    return `${label} accounts for ${data.employeeShare}% of employees with a ${data.promotionRate}% promotion rate.`;
  }
  if (chart.title === "Department Readiness Signals") {
    return `${label} is shown against R&D's 100 baseline across promotion, KPI, awards, training, and previous-rating signals.`;
  }
  if (chart.title === "Average Training Score") {
    return data.trainingScore == null ? `${label} does not have a training-score benchmark in this dashboard.` : `${label}'s average training score is ${data.trainingScore}.`;
  }
  if (chart.title === "KPI & Award Achievement By Department") {
    return data.kpiRate == null ? `${label} does not have a KPI/award benchmark in this dashboard.` : `${label}'s KPI and award readiness score is ${data.kpiRate}%.`;
  }
  return chart.subtitle;
}

function filteredChart(chart, study, filterValue) {
  const current = filterValue || "all";
  const next = cloneData(chart);
  if (current === "all" || chart.filter !== "split") {
    return next;
  }

  const label = selectedFilterLabel(study, current);
  if (study.id === "employee-promotion") {
    next.subtitle = employeeFilterSubtitle(next, current, label);
  } else if (study.id === "delivery-performance" && chart.title === "Vehicle Choice By Condition") {
    next.subtitle = `${label} performance is emphasized; other vehicle bars are dimmed for comparison.`;
  } else if (study.id === "delivery-performance" && chart.title === "Harsh Weather Service Quality") {
    next.subtitle = `${label} scenarios stay emphasized while other harsh-weather profiles recede.`;
  } else if (study.id === "loyalty-retention") {
    next.subtitle = `${label} is emphasized so the segment comparison remains visible without hiding the broader context.`;
  }

  if (next.filterMode === "seriesKeepReference") {
    const selectedSeries = next.series
      .map((series, index) => ({ series, index, id: normalizeFilterValue(series) }))
      .filter((item) => item.id === current || item.id === next.referenceValue);
    if (selectedSeries.length) {
      next.series = selectedSeries.map((item) => item.series);
      next.groups = next.groups.map((group) => ({
        ...group,
        values: selectedSeries.map((item) => group.values[item.index])
      }));
    }
    return next;
  }

  if (next.filterMode === "series") {
    next.series = next.series.map((series) => ({ label: series, _dim: !labelMatchesFilter(series, current) }));
    return next;
  }

  if (Array.isArray(next.values)) {
    next.values = next.values.map((item) => ({ ...item, _dim: pointDimValue(item.label, current) }));
  }

  if (Array.isArray(next.groups)) {
    next.groups = next.groups.map((group) => ({ ...group, _dim: pointDimValue(group.label, current) }));
  }

  return next;
}

function chartConfig(study, filterValue = "all") {
  const charts = study.dashboard.charts || [];
  const theme = study.dashboard.theme || {};
  const colors = chartColors(theme);

  let chartIndex = 0;
  const configs = [];

  charts.filter((chart) => isChartVisible(chart, filterValue)).forEach((chart) => {
    const activeChart = filteredChart(chart, study, filterValue);
    if (activeChart.type === "heatmap" || activeChart.type === "table" || activeChart.type === "funnel" || activeChart.type === "process" || activeChart.type === "reportGrid") {
      configs.push({ ...activeChart, _chartIndex: -1, _render: "static" });
      return;
    }
    const id = `chart-canvas-${chartIndex}`;
    const cfg = { ...activeChart, _chartIndex: chartIndex, _id: id, _render: "chart" };
    configs.push(cfg);
    chartIndex++;
  });

  return { configs, chartCount: chartIndex, colors };
}

function chartGrid(study, filterValue = "all") {
  const { configs } = chartConfig(study, filterValue);
  const theme = study.dashboard.theme || {};
  if (!configs.length) return "";

  const wideTypes = ["line", "combo", "heatmap", "table", "funnel", "process", "reportGrid"];
  const compactTypes = ["doughnut", "pie", "horizontalBar"];

  return `
    <div class="case-chart-grid">
      ${configs
        .map((chart, index) => {
          let span = chart.span || 6;
          if (!chart.span) {
            if (chart.fullWidth || wideTypes.includes(chart.type) || chart.type === "scatter" || chart.type === "bubble") {
              span = 12;
            } else if (compactTypes.includes(chart.type)) {
              span = 4;
            }
          }
          const spanClass = span === 12 ? " is-wide" : span <= 4 ? " is-third" : "";
          const spanAttr = span !== 6 ? `style="grid-column: span ${span}"` : null;
          const variantClass = chart.variant ? ` variant-${chart.variant}` : "";
          const typeClass = `chart-${chart.type}`;
          return `
            <article class="case-panel chart-panel ${typeClass}${spanClass}${variantClass}"${spanAttr ? ` ${spanAttr}` : ""} data-chart-index="${index}">
              <div class="case-panel-heading">
                <span>Dashboard View</span>
                <h3>${chart.title}</h3>
                <p>${chart.subtitle}</p>
              </div>
              ${chart._render === "static" ? staticChart(chart, theme) : `<div class="chart-canvas-wrap"><canvas id="${chart._id}"></canvas></div>`}
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function staticChart(chart, theme) {
  if (chart.type === "heatmap") {
    return heatmapMarkup(chart, theme);
  }
  if (chart.type === "table") {
    return tableMarkup(chart);
  }
  if (chart.type === "funnel") {
    return funnelMarkup(chart, theme);
  }
  if (chart.type === "process") {
    return processMarkup(chart);
  }
  if (chart.type === "reportGrid") {
    return reportGridMarkup(chart);
  }
  return "";
}

function heatmapMarkup(chart, theme) {
  const accentRgb = theme.accentRgb || "49, 90, 128";
  const allValues = chart.rows.flatMap((row) => row.values);
  const maxValue = Math.max(...allValues);
  const unit = chart.unit || "%";
  const cornerLabel = chart.cornerLabel || "";
  const allVals = chart.rows.flatMap(r => r.values);
  const minVal = Math.min(...allVals);
  const valRange = maxValue - minVal || 1;
  const scale = chart.opacityScale;
  return `
    <div class="case-chart case-heatmap" style="--heat-columns:${chart.columns.length}">
      <div class="case-heat-row"><span>${cornerLabel}</span>${chart.columns.map((c) => `<b>${c}</b>`).join("")}</div>
      ${chart.rows
        .map(
          (row) => `
          <div class="case-heat-row">
            <span>${row.label}</span>
            ${row.values
              .map((v) => {
                let opacity;
                if (scale === "log") {
                  opacity = Math.min(0.95, 0.15 + 0.8 * Math.log10(v + 1) / Math.log10(maxValue + 1));
                } else if (scale === "range") {
                  opacity = 0.15 + 0.8 * (v - minVal) / valRange;
                } else {
                  opacity = Math.max(0.12, Math.min(0.95, v / maxValue));
                }
                return `<i style="background:rgba(${accentRgb},${opacity});color:${opacity >= 0.5 ? "#fff" : "#222"}">${v}${unit}</i>`;
              })
              .join("")}
          </div>
        `
        )
        .join("")}
    </div>
  `;
}

function tableMarkup(chart) {
  const highlights = chart.highlights || [];
  const isHL = (ri, ci) => highlights.some(h => h[0] === ri && h[1] === ci);
  return `
    <div class="case-chart case-model-table">
      <table>
        <thead><tr>${chart.columns.map((c) => `<th>${c}</th>`).join("")}</tr></thead>
        <tbody>${chart.rows.map((row, ri) => `<tr>${row.map((cell, ci) => `<td class="${isHL(ri, ci) ? "is-best" : ""}">${cell}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function reportGridMarkup(chart) {
  return `
    <div class="case-chart case-report-grid">
      ${chart.groups.map((group) => `
        <section class="case-report-group">
          <div class="case-report-group-head">
            <span>${group.label}</span>
            <strong>${group.summary}</strong>
          </div>
          <div class="case-report-cards">
            ${group.models.map((model) => `
              <article class="case-report-card${model.champion ? " is-champion" : ""}${model.rejected ? " is-rejected" : ""}">
                <div class="case-report-card-head">
                  <div>
                    <span>${model.family}</span>
                    <strong>${model.name}</strong>
                  </div>
                  <b>${model.accuracy}</b>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Class</th>
                      <th>Precision</th>
                      <th>Recall</th>
                      <th>F1</th>
                      <th>Support</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${model.rows.map((row) => `
                      <tr class="${row.class === "1" ? "is-promote" : ""}">
                        <td>${row.class}</td>
                        <td>${row.precision}</td>
                        <td>${row.recall}</td>
                        <td>${row.f1}</td>
                        <td>${row.support}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
                <p>${model.note}</p>
              </article>
            `).join("")}
          </div>
        </section>
      `).join("")}
    </div>
  `;
}

function funnelMarkup(chart, theme) {
  const max = Math.max(...chart.values.map((item) => item.value));
  const accentRgb = theme.accentRgb || "49, 90, 128";
  return `
    <div class="case-chart case-funnel" role="img" aria-label="${chart.title}">
      ${chart.values
        .map((item, index) => {
          const percent = Math.max(8, Math.round((item.value / max) * 100));
          const opacity = Math.max(0.18, 0.95 - index * 0.1);
          return `
            <div class="case-funnel-step">
              <span class="case-funnel-label">${item.label}</span>
              <div class="case-funnel-track">
                <i style="width:${percent}%;background:rgba(${accentRgb},${opacity})">
                  <strong>${item.value.toLocaleString()}${chart.unit || ""}</strong>
                </i>
              </div>
              <b class="case-funnel-pct">${percent}%</b>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function processMarkup(chart) {
  return `
    <div class="case-chart case-process-flow">
      ${chart.steps.map((step, i) => `
        <div class="case-process-step${step.champion ? " is-champion" : ""}${step.rejected ? " is-rejected" : ""}">
          <div class="case-process-head">
            <strong>${step.title}</strong>
            ${step.champion ? '<span class="case-process-badge">★</span>' : ""}
            ${step.rejected ? '<span class="case-process-badge rejected">✗</span>' : ""}
          </div>
          <ul>
            ${step.items.map(item => `<li>${item}</li>`).join("")}
          </ul>
          <span class="case-process-verdict">${step.verdict}</span>
        </div>
        ${i < chart.steps.length - 1 ? '<div class="case-process-arrow">→</div>' : ""}
      `).join("")}
    </div>
  `;
}

function chartDatasetsFromGroups(chart, colors, extra = {}) {
  return chart.series.map((series, sIdx) => {
    const seriesLabel = typeof series === "object" ? series.label : series;
    const seriesDim = typeof series === "object" && series._dim;
    const baseColor = colors[sIdx % colors.length];
    return {
    label: seriesLabel,
    data: chart.groups.map((g) => g.values[sIdx]?.value ?? 0),
    backgroundColor: chart.groups.map((g) => colorWithAlpha(baseColor, g._dim || seriesDim ? 0.2 : 0.9)),
    borderColor: chart.groups.map((g) => colorWithAlpha(baseColor, g._dim || seriesDim ? 0.25 : 1)),
    borderRadius: 4,
    maxBarThickness: 28,
    ...extra
  };
  });
}

function formatCount(value) {
  return typeof value === "number" ? value.toLocaleString() : value;
}

function filteredMetrics(study, filterValue = "all") {
  const dashboard = study.dashboard || {};
  if (filterValue === "all") {
    return study.metrics;
  }

  const filterLabel = selectedFilterLabel(study, filterValue);

  if (study.id === "employee-promotion" && dashboard.departmentData?.[filterValue]) {
    const data = dashboard.departmentData[filterValue];
    return [
      { label: "Records analyzed", value: formatCount(data.records), detail: `employee records in ${filterLabel}` },
      { label: "Promoted", value: formatCount(data.promoted), detail: `employees promoted in ${filterLabel}` },
      { label: "Best RF model", value: data.modelAccuracy || "N/A", detail: `model accuracy for ${filterLabel}` },
      { label: "Promotion rate", value: `${data.promotionRate}%`, detail: `${filterLabel} promotion rate` }
    ];
  }

  if (study.id === "delivery-performance") {
    return study.metrics.map((item) => ({ ...item, detail: `${item.detail} (${filterLabel} view)` }));
  }

  if (study.id === "loyalty-retention" && dashboard.segmentMetrics?.[filterValue]) {
    return dashboard.segmentMetrics[filterValue];
  }

  return study.metrics;
}

function filteredInsights(items = [], filterValue = "all") {
  return items.filter((item) => !item.showFor || item.showFor.includes(filterValue));
}

function renderFilterBar(study, currentFilter = "all") {
  const config = study.dashboard?.filterConfig;
  if (!config) return "";
  const options = Object.entries(config.options || {});
  return `
    <div class="case-filter-bar" aria-label="${config.label} filter">
      <div class="case-filter-meta">
        <span>${config.label}</span>
        <strong>${selectedFilterLabel(study, currentFilter)}</strong>
      </div>
      <div class="case-filter-options">
        ${options.map(([value, option]) => `
          <button class="case-filter-btn${value === currentFilter ? " is-active" : ""}" type="button" data-filter-value="${value}">
            ${option.label}
          </button>
        `).join("")}
      </div>
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

      <div id="caseMetricsMount"></div>

      <section class="case-workspace">
        <div class="case-workspace-heading">
          <div>
            <span>Dashboard Workspace</span>
            <h2>${dashboard.dashboardTitle}</h2>
          </div>
          <p>${dashboard.dashboardText}</p>
        </div>
        <div id="caseFilterMount"></div>
        <div id="chartsMount"></div>
      </section>

      <section class="case-analysis-grid">
        <div class="case-section-title">
          <span>Analysis</span>
          <h2>What The Dashboard Shows</h2>
          <p>${dashboard.analysisText}</p>
        </div>
        <div class="case-insight-grid" id="caseInsightsMount"></div>
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

let activeChartInstances = [];

function destroyActiveCharts() {
  activeChartInstances.forEach((chart) => chart.destroy());
  activeChartInstances = [];
}

function renderChartsJs(study, filterValue = "all") {
  const mount = document.querySelector("#chartsMount");
  if (!mount) return;

  destroyActiveCharts();
  mount.innerHTML = chartGrid(study, filterValue);

  const theme = study.dashboard.theme || {};
  const colors = chartColors(theme);
  const charts = chartConfig(study, filterValue).configs;

  if (typeof Chart === "undefined") return;

  charts.forEach((chart) => {
    if (chart._render === "static") return;

    const palette = chart.colors || colors;

    const chartTheme = chart.variant === "rd" ? { ...theme, text: "#f5f0e0", muted: "#cfe8d2", dark: "#174f2e" } : theme;

    const canvas = document.querySelector(`#${chart._id}`);
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    const baseOpts = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: chartTheme.dark || "#241812",
          titleColor: "#fff",
          bodyColor: "#eadfcd",
          padding: 10,
          cornerRadius: 6
        }
      },
      scales: {
        x: {
          grid: { color: "rgba(0,0,0,0.06)" },
          ticks: { color: chartTheme.muted || "#666" }
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.06)" },
          ticks: { color: chartTheme.muted || "#666" }
        }
      }
    };

    if (chart.type === "bar" || chart.type === "horizontalBar") {
      const max = Math.max(...chart.values.map((v) => v.value));
      const instance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chart.values.map((v) => v.label),
          datasets: [{
            data: chart.values.map((v) => v.value),
            backgroundColor: chart.values.map((v, i) => colorWithAlpha(palette[i % palette.length], v._dim ? 0.2 : 0.9)),
            borderColor: chart.values.map((v, i) => colorWithAlpha(palette[i % palette.length], v._dim ? 0.25 : 1)),
            borderRadius: 6,
            maxBarThickness: 48
          }]
        },
        options: {
          ...baseOpts,
          indexAxis: "y",
          plugins: {
            ...baseOpts.plugins,
            tooltip: {
              ...baseOpts.plugins.tooltip,
              callbacks: {
                label: (ctx) => `${ctx.raw}${chart.unit || ""}`
              }
            }
          },
          scales: {
            ...baseOpts.scales,
            x: { ...baseOpts.scales.x, beginAtZero: true, suggestedMax: Math.ceil(max * 1.15) }
          }
        }
      });
      activeChartInstances.push(instance);
    }

    if (chart.type === "groupedBar") {
      const max = Math.max(...chart.groups.flatMap((g) => g.values.map((v) => v.value)));
      const instance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chart.groups.map((g) => g.label),
          datasets: chartDatasetsFromGroups(chart, palette)
        },
        options: {
          ...baseOpts,
          plugins: {
            legend: { display: true, labels: { color: chartTheme.text || "#222", boxWidth: 12, padding: 12 } },
            tooltip: {
              ...baseOpts.plugins.tooltip,
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}${chart.unit || ""}`
              }
            }
          },
          scales: {
            ...baseOpts.scales,
            y: { ...baseOpts.scales.y, beginAtZero: true, suggestedMax: Math.ceil(max * 1.15) }
          }
        }
      });
      activeChartInstances.push(instance);
    }

    if (chart.type === "stackedBar") {
      const max = Math.max(...chart.groups.map((g) => g.values.reduce((sum, v) => sum + v.value, 0)));
      const instance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chart.groups.map((g) => g.label),
          datasets: chartDatasetsFromGroups(chart, palette)
        },
        options: {
          ...baseOpts,
          plugins: {
            legend: { display: true, labels: { color: chartTheme.text || "#222", boxWidth: 12, padding: 12 } },
            tooltip: {
              ...baseOpts.plugins.tooltip,
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}${chart.unit || ""}`
              }
            }
          },
          scales: {
            x: { ...baseOpts.scales.x, stacked: true },
            y: { ...baseOpts.scales.y, stacked: true, suggestedMax: Math.ceil(max * 1.15) }
          }
        }
      });
      activeChartInstances.push(instance);
    }

    if (chart.type === "line") {
      const values = chart.values.map((v) => v.value);
      const max = Math.max(...values);
      const instance = new Chart(ctx, {
        type: "line",
        data: {
          labels: chart.values.map((v) => v.label),
          datasets: [{
            data: values,
            borderColor: palette[0],
            backgroundColor: palette[0] + "18",
            fill: true,
            tension: 0.3,
            pointBackgroundColor: palette[0],
            pointBorderColor: "#fff",
            pointBorderWidth: 1.5,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          ...baseOpts,
          plugins: {
            ...baseOpts.plugins,
            tooltip: {
              ...baseOpts.plugins.tooltip,
              callbacks: {
                label: (ctx) => `${ctx.raw}${chart.unit || ""}`
              }
            }
          },
          scales: {
            ...baseOpts.scales,
            y: { ...baseOpts.scales.y, beginAtZero: false, suggestedMin: Math.max(0, max * 0.6), suggestedMax: max * 1.1 }
          },
          elements: { point: { hoverRadius: 7 } }
        }
      });
      activeChartInstances.push(instance);
    }

    if (chart.type === "combo") {
      const primaryValues = chart.datasets
        .filter((dataset) => (dataset.axis || "y") === "y")
        .flatMap((dataset) => dataset.values);
      const secondaryValues = chart.datasets
        .filter((dataset) => dataset.axis === "y1")
        .flatMap((dataset) => dataset.values);
      const primaryMax = Math.max(...primaryValues);
      const secondaryMax = secondaryValues.length ? Math.max(...secondaryValues) : 0;
      const hasSecondaryAxis = secondaryValues.length > 0;
      const instance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chart.labels,
          datasets: chart.datasets.map((dataset, dIdx) => {
            const isLine = dataset.type === "line";
            return {
              type: dataset.type || "bar",
              label: dataset.label,
              data: dataset.values,
              yAxisID: dataset.axis || (isLine ? "y1" : "y"),
              backgroundColor: isLine ? colorWithAlpha(palette[dIdx % palette.length], 0.18) : palette[dIdx % palette.length],
              borderColor: palette[dIdx % palette.length],
              borderRadius: isLine ? 0 : 4,
              borderWidth: isLine ? 2.5 : 1,
              fill: isLine ? false : undefined,
              tension: isLine ? 0.28 : undefined,
              pointRadius: isLine ? 4 : undefined,
              pointHoverRadius: isLine ? 6 : undefined,
              maxBarThickness: isLine ? undefined : 30
            };
          })
        },
        options: {
          ...baseOpts,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { display: true, labels: { color: chartTheme.text || "#222", boxWidth: 12, padding: 12 } },
            tooltip: {
              ...baseOpts.plugins.tooltip,
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}${chartValueSuffix(chart, chart.datasets[ctx.datasetIndex])}`
              }
            }
          },
          scales: {
            x: baseOpts.scales.x,
            y: { ...baseOpts.scales.y, beginAtZero: true, suggestedMax: Math.ceil(primaryMax * 1.12) },
            ...(hasSecondaryAxis
              ? {
                  y1: {
                    position: "right",
                    beginAtZero: false,
                    suggestedMax: Math.ceil(secondaryMax * 1.12),
                    grid: { drawOnChartArea: false },
                    ticks: { color: chartTheme.muted || "#666" }
                  }
                }
              : {})
          }
        }
      });
      activeChartInstances.push(instance);
    }

    if (chart.type === "pie" || chart.type === "doughnut" || chart.type === "polarArea") {
      const instance = new Chart(ctx, {
        type: chart.type,
        data: {
          labels: chart.values.map((v) => v.label),
          datasets: [{
            data: chart.values.map((v) => v.value),
            backgroundColor: chart.values.map((v, i) => colorWithAlpha(palette[i % palette.length], v._dim ? 0.2 : chart.type === "polarArea" ? 0.72 : 0.9)),
            borderColor: chartTheme.panel || "#fff",
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: "bottom", labels: { color: chartTheme.text || "#222", boxWidth: 12, padding: 12 } },
            tooltip: {
              ...baseOpts.plugins.tooltip,
              callbacks: {
                label: (ctx) => `${ctx.label}: ${ctx.raw}${chart.unit || ""}`
              }
            }
          }
        }
      });
      activeChartInstances.push(instance);
    }

    if (chart.type === "radar") {
      const instance = new Chart(ctx, {
        type: "radar",
        data: {
          labels: chart.labels,
          datasets: chart.datasets.map((dataset, dIdx) => ({
            label: dataset.label,
            data: dataset.values,
            borderColor: palette[dIdx % palette.length],
            backgroundColor: colorWithAlpha(palette[dIdx % palette.length], 0.16),
            pointBackgroundColor: palette[dIdx % palette.length],
            pointBorderColor: "#fff",
            borderWidth: 2
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: "bottom", labels: { color: chartTheme.text || "#222", boxWidth: 12, padding: 12 } },
            tooltip: baseOpts.plugins.tooltip
          },
          scales: {
            r: {
              beginAtZero: true,
              suggestedMax: 100,
              grid: { color: "rgba(0,0,0,0.08)" },
              angleLines: { color: "rgba(0,0,0,0.08)" },
              pointLabels: { color: chartTheme.text || "#222", font: { size: 11, weight: "700" } },
              ticks: { display: false }
            }
          }
        }
      });
      activeChartInstances.push(instance);
    }

    if (chart.type === "scatter" || chart.type === "bubble") {
      const series = chart.series || [{ label: chart.title, points: chart.points }];
      const instance = new Chart(ctx, {
        type: chart.type === "bubble" ? "bubble" : "scatter",
        data: {
          datasets: series.map((dataset, dIdx) => ({
            label: dataset.label,
            data: dataset.points.map((point) => ({
              x: point.x,
              y: point.y,
              r: point.r || 6,
              label: point.label
            })),
            backgroundColor: colorWithAlpha(palette[dIdx % palette.length], 0.72),
            borderColor: palette[dIdx % palette.length],
            pointRadius: chart.type === "scatter" ? 5 : undefined,
            pointHoverRadius: chart.type === "scatter" ? 8 : undefined
          }))
        },
        options: {
          ...baseOpts,
          plugins: {
            legend: { display: series.length > 1, labels: { color: chartTheme.text || "#222", boxWidth: 12, padding: 12 } },
            tooltip: {
              ...baseOpts.plugins.tooltip,
              callbacks: {
                label: (ctx) => {
                  const raw = ctx.raw;
                  const size = chart.type === "bubble" ? `, ${chart.rLabel || "size"}: ${raw.r}` : "";
                  return `${raw.label || ctx.dataset.label}: ${chart.xLabel || "x"} ${raw.x}, ${chart.yLabel || "y"} ${raw.y}${size}`;
                }
              }
            }
          },
          scales: {
            x: { ...baseOpts.scales.x, title: { display: true, text: chart.xLabel || "", color: chartTheme.muted || "#666" } },
            y: { ...baseOpts.scales.y, title: { display: true, text: chart.yLabel || "", color: chartTheme.muted || "#666" } }
          }
        }
      });
      activeChartInstances.push(instance);
    }
  });
}

function renderDashboard(study, filterValue = "all") {
  const validFilters = filterOptionIds(study);
  const currentFilter = validFilters.includes(filterValue) ? filterValue : study.dashboard?.filterConfig?.default || "all";

  const metricsMount = document.querySelector("#caseMetricsMount");
  if (metricsMount) {
    metricsMount.innerHTML = metricCards(filteredMetrics(study, currentFilter));
  }

  const filterMount = document.querySelector("#caseFilterMount");
  if (filterMount) {
    filterMount.innerHTML = renderFilterBar(study, currentFilter);
    filterMount.querySelectorAll(".case-filter-btn").forEach((button) => {
      button.addEventListener("click", () => renderDashboard(study, button.dataset.filterValue));
    });
  }

  renderChartsJs(study, currentFilter);

  const insightsMount = document.querySelector("#caseInsightsMount");
  if (insightsMount) {
    insightsMount.innerHTML = insightCards(filteredInsights(study.dashboard?.insights, currentFilter));
  }
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

  if (study.dashboard && study.dashboard.charts) {
    renderDashboard(study, study.dashboard.filterConfig?.default || "all");
  }
}

renderProjectDetail();
