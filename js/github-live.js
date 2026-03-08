document.addEventListener("DOMContentLoaded", async () => {
  const username = "COZYkrish";
  const currentYear = new Date().getFullYear();
  const yearStartIso = `${currentYear}-01-01T00:00:00Z`;
  const yearEndIso = `${currentYear}-12-31T23:59:59Z`;

  const els = {
    title: document.getElementById("github-title"),
    updated: document.getElementById("github-updated"),
    year: document.getElementById("gh-year-label"),
    stars: document.getElementById("gh-total-stars"),
    commits: document.getElementById("gh-total-commits"),
    prs: document.getElementById("gh-total-prs"),
    issues: document.getElementById("gh-total-issues"),
    contributed: document.getElementById("gh-contributed-repos"),
    repos: document.getElementById("gh-public-repos"),
    grade: document.getElementById("gh-grade"),
    gradeRing: document.getElementById("gh-grade-ring"),
    totalContrib: document.getElementById("gh-total-contributions"),
    currentStreak: document.getElementById("gh-current-streak"),
    longestStreak: document.getElementById("gh-longest-streak"),
    langBar: document.getElementById("gh-lang-bar"),
    langList: document.getElementById("gh-lang-list"),
    heatMonths: document.getElementById("gh-heat-months"),
    heatGrid: document.getElementById("gh-heat-grid")
  };

  const required = Object.values(els).every(Boolean);
  if (!required) return;

  els.title.textContent = `${username}'s GitHub Stats`;
  els.year.textContent = String(currentYear);

  const setValue = (node, value) => {
    node.textContent = Number.isFinite(value) ? String(value) : "--";
  };

  const formatUpdated = () => {
    const now = new Date();
    return `Updated ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  const fetchJson = async (url) => {
    const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.json();
  };

  const fetchPaginated = async (url, maxPages = 10) => {
    let nextUrl = url;
    let pages = 0;
    const all = [];

    while (nextUrl && pages < maxPages) {
      const resp = await fetch(nextUrl, { headers: { Accept: "application/vnd.github+json" } });
      if (!resp.ok) break;
      const chunk = await resp.json();
      if (!Array.isArray(chunk) || chunk.length === 0) break;
      all.push(...chunk);

      const link = resp.headers.get("link") || "";
      const match = link.match(/<([^>]+)>;\s*rel="next"/);
      nextUrl = match ? match[1] : "";
      pages += 1;
    }

    return all;
  };

  const dateKey = (iso) => new Date(iso).toISOString().slice(0, 10);
  const rangeDays = (start, end) => {
    const out = [];
    const d = new Date(start);
    while (d <= end) {
      out.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return out;
  };

  const levelFromCount = (count, max) => {
    if (count <= 0) return 0;
    if (max <= 1) return 4;
    const ratio = count / max;
    if (ratio >= 0.75) return 4;
    if (ratio >= 0.5) return 3;
    if (ratio >= 0.25) return 2;
    return 1;
  };

  const calcStreaks = (countsByDate, startDate, endDate) => {
    const dates = rangeDays(startDate, endDate).map((d) => d.toISOString().slice(0, 10));
    let longest = 0;
    let current = 0;
    let run = 0;

    dates.forEach((k) => {
      const active = (countsByDate[k] || 0) > 0;
      if (active) {
        run += 1;
        if (run > longest) longest = run;
      } else {
        run = 0;
      }
    });

    for (let i = dates.length - 1; i >= 0; i -= 1) {
      if ((countsByDate[dates[i]] || 0) > 0) current += 1;
      else break;
    }

    return { longest, current };
  };

  try {
    const repos = await fetchJson(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    const ownRepos = repos.filter((r) => !r.fork);
    const totalStars = ownRepos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
    setValue(els.repos, ownRepos.length);
    setValue(els.stars, totalStars);

    const languageTotals = {};
    await Promise.all(
      ownRepos.slice(0, 25).map(async (repo) => {
        try {
          const langData = await fetchJson(repo.languages_url);
          Object.entries(langData).forEach(([lang, bytes]) => {
            languageTotals[lang] = (languageTotals[lang] || 0) + Number(bytes || 0);
          });
        } catch (_) {
          // Skip individual repo language errors.
        }
      })
    );

    const sortedLangs = Object.entries(languageTotals).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const totalLangBytes = sortedLangs.reduce((sum, [, v]) => sum + v, 0) || 1;
    const langPalette = ["#f0542a", "#dacf49", "#7648b8", "#2a7ec1", "#d18b2f", "#56b870"];

    els.langBar.innerHTML = sortedLangs.map(([name, bytes], i) => {
      const pct = (bytes / totalLangBytes) * 100;
      return `<span class="lang-segment" style="width:${pct.toFixed(2)}%;background:${langPalette[i % langPalette.length]}"></span>`;
    }).join("");

    els.langList.innerHTML = sortedLangs.map(([name, bytes], i) => {
      const pct = ((bytes / totalLangBytes) * 100).toFixed(2);
      return `<div class="lang-item"><span class="lang-dot" style="background:${langPalette[i % langPalette.length]}"></span>${name} ${pct}%</div>`;
    }).join("");

    const [prSearch, issueSearch] = await Promise.all([
      fetchJson(`https://api.github.com/search/issues?q=author:${username}+type:pr+created:${currentYear}-01-01..${currentYear}-12-31&per_page=1`),
      fetchJson(`https://api.github.com/search/issues?q=author:${username}+type:issue+created:${currentYear}-01-01..${currentYear}-12-31&per_page=1`)
    ]);

    const totalPRs = prSearch.total_count || 0;
    const totalIssues = issueSearch.total_count || 0;
    setValue(els.prs, totalPRs);
    setValue(els.issues, totalIssues);

    const commitDayCounts = {};
    const contributedRepos = new Set();
    let totalCommits = 0;

    for (const repo of ownRepos.slice(0, 30)) {
      const commits = await fetchPaginated(
        `https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits?author=${username}&since=${yearStartIso}&until=${yearEndIso}&per_page=100`,
        20
      );

      if (commits.length > 0) contributedRepos.add(repo.full_name);
      totalCommits += commits.length;

      commits.forEach((c) => {
        const stamp = c?.commit?.author?.date;
        if (!stamp) return;
        const key = dateKey(stamp);
        commitDayCounts[key] = (commitDayCounts[key] || 0) + 1;
      });
    }

    setValue(els.commits, totalCommits);
    setValue(els.contributed, contributedRepos.size);

    const totalContributions = Object.values(commitDayCounts).reduce((s, n) => s + n, 0);
    setValue(els.totalContrib, totalContributions);

    const startDate = new Date(`${currentYear}-01-01T00:00:00`);
    const endDate = new Date();
    const streaks = calcStreaks(commitDayCounts, startDate, endDate);
    setValue(els.currentStreak, streaks.current);
    setValue(els.longestStreak, streaks.longest);

    const gradeScore = Math.min(
      100,
      totalStars * 3 +
      totalCommits * 0.15 +
      totalPRs * 2.5 +
      totalIssues * 1.5 +
      contributedRepos.size * 5
    );

    let grade = "C";
    if (gradeScore >= 92) grade = "A+";
    else if (gradeScore >= 84) grade = "A";
    else if (gradeScore >= 76) grade = "B+";
    else if (gradeScore >= 68) grade = "B";
    else if (gradeScore >= 58) grade = "C+";

    els.grade.textContent = grade;
    const radius = 48;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.max(0, Math.min(100, gradeScore)) / 100) * circumference;
    els.gradeRing.style.strokeDasharray = String(circumference);
    els.gradeRing.style.strokeDashoffset = String(offset);

    const daysForHeat = 53 * 7;
    const heatEnd = new Date();
    const heatStart = new Date(heatEnd);
    heatStart.setDate(heatEnd.getDate() - (daysForHeat - 1));
    const heatDates = rangeDays(heatStart, heatEnd);
    const maxDaily = Math.max(1, ...Object.values(commitDayCounts));

    els.heatGrid.innerHTML = heatDates.map((d) => {
      const key = d.toISOString().slice(0, 10);
      const count = commitDayCounts[key] || 0;
      const lv = levelFromCount(count, maxDaily);
      return `<span class="heat-cell lv${lv}" title="${key}: ${count} commits"></span>`;
    }).join("");

    const monthLabels = [];
    const monthMap = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 0; i < 7; i += 1) {
      const d = new Date();
      d.setMonth(d.getMonth() - (6 - i));
      monthLabels.push(monthMap[d.getMonth()]);
    }
    els.heatMonths.innerHTML = monthLabels.map((m) => `<span>${m}</span>`).join("");

    els.updated.textContent = formatUpdated();
  } catch (error) {
    [
      els.stars,
      els.commits,
      els.prs,
      els.issues,
      els.contributed,
      els.repos,
      els.totalContrib,
      els.currentStreak,
      els.longestStreak
    ].forEach((n) => { n.textContent = "--"; });

    els.langBar.innerHTML = "";
    els.langList.innerHTML = '<div class="lang-item">Unavailable</div>';
    els.heatGrid.innerHTML = "";
    els.heatMonths.innerHTML = "";
    els.grade.textContent = "--";
    els.updated.textContent = "Update failed (rate limit/network).";
  }
});
