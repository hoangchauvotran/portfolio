function textList(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function tags(items) {
  return `<div class="tags">${items.map((item) => `<span class="tag">${item}</span>`).join("")}</div>`;
}

function metrics(items) {
  return `
    <div class="metrics">
      ${items
        .map(
          (item) => `
          <article class="metric">
            <strong>${item.value}</strong>
            <span>${item.label}</span>
            <small>${item.detail}</small>
          </article>
        `
        )
        .join("")}
    </div>
  `;
}

function barVisual(visual) {
  const max = Math.max(...visual.values.map((item) => item.value));
  return `
    <div class="chart-title">
      <h3>${visual.title}</h3>
      <p>${visual.subtitle}</p>
    </div>
    <div class="bar-chart">
      ${visual.values
        .map((item) => {
          const width = Math.max(4, Math.round((item.value / max) * 100));
          return `
            <div class="bar-row">
              <span>${item.label}</span>
              <div class="bar-track"><i class="bar-fill" style="width:${width}%"></i></div>
              <strong>${item.value}${visual.unit ? ` ${visual.unit}` : "%"}</strong>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function heatColor(value) {
  const opacity = Math.max(0.12, Math.min(1, value / 100));
  return `rgba(122, 82, 27, ${opacity})`;
}

function heatmapVisual(visual) {
  return `
    <div class="chart-title">
      <h3>${visual.title}</h3>
      <p>${visual.subtitle}</p>
    </div>
    <div class="heatmap">
      <div class="heat-row">
        <span></span>
        ${visual.columns.map((column) => `<span class="heat-head">${column}</span>`).join("")}
      </div>
      ${visual.rows
        .map(
          (row) => `
          <div class="heat-row">
            <span class="heat-label">${row.label}</span>
            ${row.values
              .map(
                (value) => `
                <span class="heat-cell" style="background:${heatColor(value)}">${value}%</span>
              `
              )
              .join("")}
          </div>
        `
        )
        .join("")}
    </div>
  `;
}

function visualBlock(visual) {
  if (visual.type === "heatmap") {
    return heatmapVisual(visual);
  }
  return barVisual(visual);
}

function workflow(items) {
  return `
    <div class="workflow">
      ${items
        .map(
          (item, index) => `
          <div class="step">
            <span>${String(index + 1).padStart(2, "0")}</span>
            ${item}
          </div>
        `
        )
        .join("")}
    </div>
  `;
}

function caseStudyTemplate(study) {
  const [scriptWord, ...rest] = study.title.split(" ");
  const title = `<em>${scriptWord}</em>${rest.join(" ")}`;

  return `
    <section class="case-study" id="${study.id}">
      <aside class="case-intro">
        <span class="case-number">${study.number}</span>
        <span class="eyebrow"><span class="spark">*</span> ${study.eyebrow}</span>
        <h2>${title}</h2>
        <p>${study.dataset}</p>
        <div class="role"><b>My role:</b> ${study.role}</div>
      </aside>

      <div class="case-body">
        ${metrics(study.metrics)}

        <section class="panel">
          <h3>Objective</h3>
          <p>${study.objective}</p>
        </section>

        <section class="two-col">
          <div class="panel">
            <h3>Problem</h3>
            ${textList(study.problem)}
          </div>
          <div class="panel">
            <h3>Approach</h3>
            ${textList(study.approach)}
          </div>
        </section>

        <section class="panel visual-card">
          ${visualBlock(study.visual)}
        </section>

        <section class="panel">
          <h3>Process Flow</h3>
          ${workflow(study.workflow)}
        </section>

        <section class="two-col">
          <div class="panel">
            <h3>Results</h3>
            ${textList(study.results)}
          </div>
          <div class="panel">
            <h3>Skills Demonstrated</h3>
            ${tags(study.skills)}
          </div>
        </section>

        <section class="panel recruiter-angle">
          <h3>Recruiter Signal</h3>
          <p>${study.recruiterAngle}</p>
          ${tags(study.tools)}
        </section>
      </div>
    </section>
  `;
}

function renderCaseStudies(studies, mountSelector = "#caseStudies") {
  const mount = document.querySelector(mountSelector);
  const nav = document.querySelector("#caseNav");

  nav.innerHTML = studies
    .map((study) => `<a href="#${study.id}">${study.number} ${study.shortTitle}</a>`)
    .join("");

  mount.innerHTML = studies.map(caseStudyTemplate).join("");
}

renderCaseStudies(caseStudies);
