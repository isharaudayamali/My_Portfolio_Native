
const githubUsername = "isharaudayamali";  // replace with user or get from your app
const languagesUrl = `https://api.github.com/users/${githubUsername}/repos`;

async function fetchLanguages() {
  try {
    const reposResponse = await fetch(languagesUrl);
    const repos = await reposResponse.json();

    const languageTotals = {};

    // Fetch languages for each repo
    const promises = repos.map(repo =>
      fetch(repo.languages_url).then(res => res.json())
    );

    const languagesArray = await Promise.all(promises);

    // Sum language bytes across all repos
    languagesArray.forEach(langs => {
      for (const [language, bytes] of Object.entries(langs)) {
        languageTotals[language] = (languageTotals[language] || 0) + bytes;
      }
    });

    // Calculate total bytes for percentage calculation
    const totalBytes = Object.values(languageTotals).reduce((a, b) => a + b, 0);

    // Convert to percentages and sort descending
    const languagesPercent = Object.entries(languageTotals)
      .map(([lang, bytes]) => ({ lang, percent: ((bytes / totalBytes) * 100).toFixed(1) }))
      .sort((a, b) => b.percent - a.percent);

    renderLanguages(languagesPercent);
  } catch (error) {
    console.error("Failed to fetch languages:", error);
  }
}

function renderLanguages(languagesPercent) {
  const container = document.querySelector("#languages-container");
  container.innerHTML = "<h2>Languages</h2>";

  languagesPercent.forEach(({ lang, percent }) => {
    const section = document.createElement("section");
    section.className = "language-skill";

    section.innerHTML = `
      <p>${lang}</p>
      <div class="progress">
        <div class="progress-bar" style="width:${percent}%">${percent}%</div>
      </div>`;

    container.appendChild(section);
  });
}
function renderLanguages(languagesPercent) {
  const container = document.querySelector("#combined-progress-container");
  const progressBar = container.querySelector(".combined-progress-bar");
  const legendContainer = container.querySelector("#languages-legend");

  progressBar.innerHTML = "";
  legendContainer.innerHTML = "";

  // A helper to get color class by language
  const colorClass = (lang) => {
    const knownColors = {
      "TypeScript": "lang-color-TypeScript",
      "HTML": "lang-color-HTML",
      "Java": "lang-color-Java",
      "CSS": "lang-color-CSS",
      "JavaScript": "lang-color-JavaScript",
    };
    return knownColors[lang] || "lang-color-Other";
  };

  // Create segments for combined bar
  languagesPercent.forEach(({ lang, percent }) => {
    const segment = document.createElement("div");
    segment.className = `combined-progress-segment ${colorClass(lang)}`;
    segment.style.width = `${percent}%`;
    segment.title = `${lang} ${percent}%`;
    segment.textContent = percent > 8 ? `${lang} ${percent}%` : "";  // show text only if wide enough
    progressBar.appendChild(segment);

    // Add legend entry
    const legendItem = document.createElement("span");
    const colorBox = document.createElement("span");
    colorBox.className = `color-box ${colorClass(lang)}`;
    legendItem.appendChild(colorBox);
    legendItem.appendChild(document.createTextNode(`${lang} ${percent}%`));
    legendContainer.appendChild(legendItem);
  });
}


// Run on page load
fetchLanguages();
