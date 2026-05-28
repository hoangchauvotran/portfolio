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

function chartValueSuffix(chart, dataset) {
  return dataset?.unit ?? chart.unit ?? "";
}

function chartConfig(study) {
  const charts = study.dashboard.charts || [];
  const theme = study.dashboard.theme || {};
  const colors = chartColors(theme);

  let chartIndex = 0;
  const configs = [];

  charts.forEach((chart) => {
    if (chart.type === "heatmap" || chart.type === "table" || chart.type === "funnel") {
      configs.push({ ...chart, _chartIndex: -1, _render: "static" });
      return;
    }
    const id = `chart-canvas-${chartIndex}`;
    const cfg = { ...chart, _chartIndex: chartIndex, _id: id, _render: "chart" };
    configs.push(cfg);
    chartIndex++;
  });

  return { configs, chartCount: chartIndex, colors };
}

function chartGrid(study) {
  const { configs, chartCount, colors } = chartConfig(study);
  const theme = study.dashboard.theme || {};
  if (!configs.length) return "";

  const wideTypes = ["line", "combo", "heatmap", "table", "funnel"];

  return `
    <div class="case-chart-grid">
      ${configs
        .map((chart, index) => {
          const isWide = wideTypes.includes(chart.type) || chart.fullWidth;
          const wideClass = isWide ? " is-wide" : "";
          const typeClass = `chart-${chart.type}`;
          return `
            <article class="case-panel chart-panel ${typeClass}${wideClass}" data-chart-index="${index}">
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
  return "";
}

function heatmapMarkup(chart, theme) {
  const accentRgb = theme.accentRgb || "49, 90, 128";
  const allValues = chart.rows.flatMap((row) => row.values);
  const maxValue = Math.max(...allValues);
  const unit = chart.unit || "%";
  return `
    <div class="case-chart case-heatmap" style="--heat-columns:${chart.columns.length}">
      <div class="case-heat-row"><span></span>${chart.columns.map((c) => `<b>${c}</b>`).join("")}</div>
      ${chart.rows
        .map(
          (row) => `
          <div class="case-heat-row">
            <span>${row.label}</span>
            ${row.values
              .map((v) => {
                const opacity = Math.max(0.12, Math.min(0.95, v / maxValue));
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
  return `
    <div class="case-chart case-model-table">
      <table>
        <thead><tr>${chart.columns.map((c) => `<th>${c}</th>`).join("")}</tr></thead>
        <tbody>${chart.rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
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
              <span>${item.label}</span>
              <i style="width:${percent}%;background:rgba(${accentRgb},${opacity})" title="${item.label}: ${item.value.toLocaleString()}${chart.unit || ""}">
                <strong>${item.value.toLocaleString()}${chart.unit || ""}</strong>
              </i>
              <b>${percent}%</b>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function chartDatasetsFromGroups(chart, colors, extra = {}) {
  return chart.series.map((series, sIdx) => ({
    label: series,
    data: chart.groups.map((g) => g.values[sIdx]?.value ?? 0),
    backgroundColor: colors[sIdx % colors.length],
    borderColor: colors[sIdx % colors.length],
    borderRadius: 4,
    maxBarThickness: 28,
    ...extra
  }));
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

      <section class="case-workspace">
        <div class="case-workspace-heading">
          <div>
            <span>Dashboard Workspace</span>
            <h2>${dashboard.dashboardTitle}</h2>
          </div>
          <p>${dashboard.dashboardText}</p>
        </div>
        <div id="chartsMount"></div>
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

function renderChartsJs(study) {
  const mount = document.querySelector("#chartsMount");
  if (!mount) return;

  mount.innerHTML = chartGrid(study);

  const theme = study.dashboard.theme || {};
  const colors = chartColors(theme);
  const charts = study.dashboard.charts || [];

  if (typeof Chart === "undefined") return;

  let canvasIndex = 0;

  charts.forEach((chart) => {
    if (chart.type === "heatmap" || chart.type === "table" || chart.type === "funnel") return;

    const canvas = document.querySelector(`#chart-canvas-${canvasIndex}`);
    if (!canvas) {
      canvasIndex++;
      return;
    }

    const ctx = canvas.getContext("2d");
    const baseOpts = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: theme.dark || "#241812",
          titleColor: "#fff",
          bodyColor: "#eadfcd",
          padding: 10,
          cornerRadius: 6
        }
      },
      scales: {
        x: {
          grid: { color: "rgba(0,0,0,0.06)" },
          ticks: { color: theme.muted || "#666" }
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.06)" },
          ticks: { color: theme.muted || "#666" }
        }
      }
    };

    if (chart.type === "bar" || chart.type === "horizontalBar") {
      const max = Math.max(...chart.values.map((v) => v.value));
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: chart.values.map((v) => v.label),
          datasets: [{
            data: chart.values.map((v) => v.value),
            backgroundColor: chart.values.map((_, i) => colors[i % colors.length]),
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
    }

    if (chart.type === "groupedBar") {
      const max = Math.max(...chart.groups.flatMap((g) => g.values.map((v) => v.value)));
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: chart.groups.map((g) => g.label),
          datasets: chartDatasetsFromGroups(chart, colors)
        },
        options: {
          ...baseOpts,
          plugins: {
            legend: { display: true, labels: { color: theme.text || "#222", boxWidth: 12, padding: 12 } },
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
    }

    if (chart.type === "stackedBar") {
      const max = Math.max(...chart.groups.map((g) => g.values.reduce((sum, v) => sum + v.value, 0)));
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: chart.groups.map((g) => g.label),
          datasets: chartDatasetsFromGroups(chart, colors)
        },
        options: {
          ...baseOpts,
          plugins: {
            legend: { display: true, labels: { color: theme.text || "#222", boxWidth: 12, padding: 12 } },
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
    }

    if (chart.type === "line") {
      const values = chart.values.map((v) => v.value);
      const max = Math.max(...values);
      new Chart(ctx, {
        type: "line",
        data: {
          labels: chart.values.map((v) => v.label),
          datasets: [{
            data: values,
            borderColor: colors[0],
            backgroundColor: colors[0] + "18",
            fill: true,
            tension: 0.3,
            pointBackgroundColor: colors[0],
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
      new Chart(ctx, {
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
              backgroundColor: isLine ? colorWithAlpha(colors[dIdx % colors.length], 0.18) : colors[dIdx % colors.length],
              borderColor: colors[dIdx % colors.length],
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
            legend: { display: true, labels: { color: theme.text || "#222", boxWidth: 12, padding: 12 } },
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
                    ticks: { color: theme.muted || "#666" }
                  }
                }
              : {})
          }
        }
      });
    }

    if (chart.type === "pie" || chart.type === "doughnut" || chart.type === "polarArea") {
      new Chart(ctx, {
        type: chart.type,
        data: {
          labels: chart.values.map((v) => v.label),
          datasets: [{
            data: chart.values.map((v) => v.value),
            backgroundColor: chart.values.map((_, i) => colorWithAlpha(colors[i % colors.length], chart.type === "polarArea" ? 0.72 : 0.9)),
            borderColor: theme.panel || "#fff",
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: "bottom", labels: { color: theme.text || "#222", boxWidth: 12, padding: 12 } },
            tooltip: {
              ...baseOpts.plugins.tooltip,
              callbacks: {
                label: (ctx) => `${ctx.label}: ${ctx.raw}${chart.unit || ""}`
              }
            }
          }
        }
      });
    }

    if (chart.type === "radar") {
      new Chart(ctx, {
        type: "radar",
        data: {
          labels: chart.labels,
          datasets: chart.datasets.map((dataset, dIdx) => ({
            label: dataset.label,
            data: dataset.values,
            borderColor: colors[dIdx % colors.length],
            backgroundColor: colorWithAlpha(colors[dIdx % colors.length], 0.16),
            pointBackgroundColor: colors[dIdx % colors.length],
            pointBorderColor: "#fff",
            borderWidth: 2
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: "bottom", labels: { color: theme.text || "#222", boxWidth: 12, padding: 12 } },
            tooltip: baseOpts.plugins.tooltip
          },
          scales: {
            r: {
              beginAtZero: true,
              suggestedMax: 100,
              grid: { color: "rgba(0,0,0,0.08)" },
              angleLines: { color: "rgba(0,0,0,0.08)" },
              pointLabels: { color: theme.text || "#222", font: { size: 11, weight: "700" } },
              ticks: { display: false }
            }
          }
        }
      });
    }

    if (chart.type === "scatter" || chart.type === "bubble") {
      const series = chart.series || [{ label: chart.title, points: chart.points }];
      new Chart(ctx, {
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
            backgroundColor: colorWithAlpha(colors[dIdx % colors.length], 0.72),
            borderColor: colors[dIdx % colors.length],
            pointRadius: chart.type === "scatter" ? 5 : undefined,
            pointHoverRadius: chart.type === "scatter" ? 8 : undefined
          }))
        },
        options: {
          ...baseOpts,
          plugins: {
            legend: { display: series.length > 1, labels: { color: theme.text || "#222", boxWidth: 12, padding: 12 } },
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
            x: { ...baseOpts.scales.x, title: { display: true, text: chart.xLabel || "", color: theme.muted || "#666" } },
            y: { ...baseOpts.scales.y, title: { display: true, text: chart.yLabel || "", color: theme.muted || "#666" } }
          }
        }
      });
    }

    canvasIndex++;
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

  if (study.dashboard && study.dashboard.charts) {
    renderChartsJs(study);
  }
}

renderProjectDetail();
