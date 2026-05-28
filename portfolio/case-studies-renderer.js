function toolLogo(tool) {
  const logos = {
    "Power BI": "assets/logos/power-bi.svg",
    Excel: "assets/logos/excel.svg",
    Python: "assets/logos/python.svg",
    SQL: "assets/logos/sql.svg"
  };

  return logos[tool] || "";
}

function projectCard(study) {
  const tools = (study.summaryTools || study.tools.slice(0, 4))
    .map((tool) => {
      const logo = toolLogo(tool);
      return `
        <span class="project-tool">
          ${logo ? `<img src="${logo}" alt="" aria-hidden="true">` : ""}
          ${tool}
        </span>
      `;
    })
    .join("");

  return `
    <article class="project-card">
      <a class="project-media" href="${study.detailPage}" aria-label="View ${study.title}">
        <img src="${study.preview}" alt="${study.title} dashboard preview">
      </a>
      <div class="project-card-copy">
        <span class="project-number">${study.number}</span>
        <span class="eyebrow"><span class="spark">*</span> ${study.eyebrow}</span>
        <h3>${study.title}</h3>
        <p>${study.objective}</p>
        <div class="project-tools" aria-label="Tools used">${tools}</div>
        <a class="button primary" href="${study.detailPage}">View Details</a>
      </div>
    </article>
  `;
}

function renderCaseStudies(studies, mountSelector = "#caseStudies") {
  const mount = document.querySelector(mountSelector);

  if (!mount) {
    return;
  }

  mount.innerHTML = `<div class="project-grid">${studies.map(projectCard).join("")}</div>`;
}

const availableCaseStudies =
  window.caseStudies || (typeof caseStudies !== "undefined" ? caseStudies : []);

renderCaseStudies(availableCaseStudies);
