document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("[data-site-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const navMenu = nav ? nav.querySelector("#nav-menu") : null;

  const toggleNav = () => {
    if (!navToggle || !nav) return;
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isExpanded));
    nav.classList.toggle("is-open", !isExpanded);
  };

  if (navToggle) {
    navToggle.addEventListener("click", () => toggleNav());
  }

  document.addEventListener("click", (event) => {
    if (!nav || !navToggle || !nav.classList.contains("is-open")) return;
    if (!nav.contains(event.target) && event.target !== navToggle) {
      toggleNav();
    }
  });

  const updateHeaderShadow = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  window.addEventListener("scroll", updateHeaderShadow);
  updateHeaderShadow();

  const dataScript = document.getElementById("detections-data");
  const resultsContainer = document.querySelector("#detections-results");
  const filterRoot = document.querySelector("[data-detections-filter]");

  if (dataScript && resultsContainer && filterRoot) {
    const detections = JSON.parse(dataScript.textContent || "[]");

    const controls = {
      search: filterRoot.querySelector("#filter-search"),
      tactic: filterRoot.querySelector("#filter-tactic"),
      product: filterRoot.querySelector("#filter-product"),
      dataSource: filterRoot.querySelector("#filter-data-source"),
      severity: filterRoot.querySelector("#filter-severity"),
    };

    const renderDetections = (list) => {
      if (!list.length) {
        resultsContainer.innerHTML = `
          <div class="empty-state">
            <p>No detections match those filters just yet.</p>
            <p class="footnote">Try clearing filters or check the MITRE view for roadmap items.</p>
          </div>
        `;
        return;
      }

      resultsContainer.innerHTML = list
        .map(
          (item) => `
          <article class="card">
            <div class="card-body">
              <p class="card-eyebrow">${item.tactic_name} · ${capitalize(item.severity)}</p>
              <h3 class="card-title"><a href="${item.url}">${item.title}</a></h3>
              <p class="card-summary">${item.summary || ""}</p>
              <ul class="meta-inline">
                <li>${item.product}</li>
                <li>${item.query_language}</li>
              </ul>
            </div>
            <footer class="card-footer">
              <span>Updated ${formatDate(item.last_updated)}</span>
              <a class="text-link" href="${item.url}">Read detection →</a>
            </footer>
          </article>
        `
        )
        .join("");
    };

    const formatDate = (timestamp) => {
      const date = new Date(Number(timestamp) * 1000);
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    };

    const capitalize = (value) => {
      if (!value) return "";
      return value.charAt(0).toUpperCase() + value.slice(1);
    };

    const normalize = (value) => (value || "").toLowerCase();

    const applyFilters = () => {
      const searchTerm = normalize(controls.search?.value);
      const tactic = controls.tactic?.value || "";
      const product = controls.product?.value || "";
      const dataSource = controls.dataSource?.value || "";
      const severity = normalize(controls.severity?.value);

      const filtered = detections.filter((item) => {
        const matchesSearch =
          !searchTerm ||
          normalize(item.title).includes(searchTerm) ||
          normalize(item.summary).includes(searchTerm) ||
          normalize(item.tactic_name).includes(searchTerm) ||
          normalize(item.technique || "").includes(searchTerm);

        const matchesTactic = !tactic || item.tactic_name === tactic;
        const matchesProduct = !product || item.product === product;
        const matchesSeverity = !severity || normalize(item.severity) === severity;
        const matchesSource =
          !dataSource || (Array.isArray(item.data_sources) && item.data_sources.includes(dataSource));

        return matchesSearch && matchesTactic && matchesProduct && matchesSeverity && matchesSource;
      });

      renderDetections(filtered);
    };

    Object.values(controls).forEach((control) => {
      if (!control) return;
      control.addEventListener("input", applyFilters);
      control.addEventListener("change", applyFilters);
    });

    renderDetections(detections);
  }

  document.querySelectorAll(".code-pre code").forEach((code) => {
    if (code.dataset.processed === "true") return;
    const raw = code.textContent.replace(/\r\n/g, "\n");
    const lines = raw.endsWith("\n") ? raw.slice(0, -1).split("\n") : raw.split("\n");
    code.innerHTML = "";
    lines.forEach((line) => {
      const span = document.createElement("span");
      span.textContent = line || " ";
      code.appendChild(span);
    });
    code.dataset.processed = "true";
  });

  document.querySelectorAll("[data-copy-btn]").forEach((button) => {
    button.addEventListener("click", async () => {
      const targetId = button.getAttribute("data-copy-source");
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;
      const text = target.innerText.trim();

      try {
        await navigator.clipboard.writeText(text);
        button.classList.add("is-success");
        button.textContent = "Copied";
        setTimeout(() => {
          button.classList.remove("is-success");
          button.textContent = "Copy";
        }, 2000);
      } catch (error) {
        console.error("Clipboard copy failed", error);
      }
    });
  });

  document.querySelectorAll("[data-wrap-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-wrap-target");
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;
      target.classList.toggle("is-wrapped");
    });
  });

  document.querySelectorAll("[data-accordion]").forEach((item) => {
    const toggle = item.querySelector(".accordion-toggle");
    const panel = item.querySelector(".accordion-panel");
    if (!toggle || !panel) return;

    toggle.addEventListener("click", () => {
      const isOpen = item.classList.toggle("is-open");
      panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : "0";
      toggle.querySelector(".icon").textContent = isOpen ? "−" : "+";
    });
  });
});
