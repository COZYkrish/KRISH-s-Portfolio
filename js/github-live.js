document.addEventListener("DOMContentLoaded", async () => {
  const username = "COZYkrish";
  const cacheKey = `github_live_stats_v2_${username.toLowerCase()}`;
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
    streakImage: document.getElementById("gh-streak-image"),
    streakLink: document.getElementById("gh-streak-link"),
    langBar: document.getElementById("gh-lang-bar"),
    langList: document.getElementById("gh-lang-list"),
    heatMonths: document.getElementById("gh-heat-months"),
    heatGrid: document.getElementById("gh-heat-grid")
  };

  if (!Object.values(els).every(Boolean)) return;

  els.title.textContent = `${username}'s GitHub Stats`;
  els.year.textContent = String(currentYear);

  if (els.streakImage && els.streakLink) {
    const streakUrl = `https://nirzak-streak-stats.vercel.app/?user=${encodeURIComponent(username)}&theme=highcontrast&hide_border=false`;
    els.streakImage.src = streakUrl;
    els.streakLink.href = streakUrl;
  }

  const setValue = (node, value) => {
    node.textContent = Number.isFinite(value) ? String(value) : "--";
  };

  const applyGrade = (grade, score) => {
    els.grade.textContent = grade || "--";
    if (!Number.isFinite(score)) return;
    const radius = 48;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;
    els.gradeRing.style.strokeDasharray = String(circumference);
    els.gradeRing.style.strokeDashoffset = String(offset);
  };

  const applySnapshot = (snap, fromCache = false) => {
    if (!snap) return;
    els.year.textContent = String(snap.year || currentYear);
    setValue(els.stars, snap.totalStars);
    setValue(els.commits, snap.totalCommits);
    setValue(els.prs, snap.totalPRs);
    setValue(els.issues, snap.totalIssues);
    setValue(els.contributed, snap.contributedRepos);
    setValue(els.repos, snap.publicRepos);
    setValue(els.totalContrib, snap.totalContributions);
    setValue(els.currentStreak, snap.currentStreak);
    setValue(els.longestStreak, snap.longestStreak);
    applyGrade(snap.grade, snap.gradeScore);

    if (snap.langBarHtml) els.langBar.innerHTML = snap.langBarHtml;
    if (snap.langListHtml) els.langList.innerHTML = snap.langListHtml;
    if (snap.heatMonthsHtml) els.heatMonths.innerHTML = snap.heatMonthsHtml;
    if (snap.heatGridHtml) els.heatGrid.innerHTML = snap.heatGridHtml;

    if (fromCache) {
      const time = snap.updatedAt
        ? new Date(snap.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "cached";
      els.updated.textContent = `Showing cached data (${time})`;
    }
  };

  const formatUpdated = () => {
    const now = new Date();
    return `Updated ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  const fetchJson = async (url) => {
    const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  const fetchGenericJson = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  const fetchPaginatedEvents = async (baseUrl, maxPages = 10) => {
    const all = [];
    for (let page = 1; page <= maxPages; page += 1) {
      const resp = await fetch(`${baseUrl}${baseUrl.includes("?") ? "&" : "?"}per_page=100&page=${page}`, {
        headers: { Accept: "application/vnd.github+json" }
      });
      if (!resp.ok) break;
      const chunk = await resp.json();
      if (!Array.isArray(chunk) || chunk.length === 0) break;
      all.push(...chunk);
      if (chunk.length < 100) break;
    }
    return all;
  };

  const dateKey = (iso) => String(iso).slice(0, 10);
  const localDateKey = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
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
    const days = rangeDays(startDate, endDate).map(localDateKey);
    let run = 0;
    let longest = 0;
    let current = 0;
    days.forEach((k) => {
      if ((countsByDate[k] || 0) > 0) {
        run += 1;
        if (run > longest) longest = run;
      } else {
        run = 0;
      }
    });
    for (let i = days.length - 1; i >= 0; i -= 1) {
      if ((countsByDate[days[i]] || 0) > 0) current += 1;
      else break;
    }
    return { current, longest };
  };

  const fetchContributionCalendar = async () => {
    const payload = await fetchGenericJson(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}`);
    const countsByDay = {};
    const levelsByDay = {};
    const list = Array.isArray(payload?.contributions) ? payload.contributions : [];
    list.forEach((item) => {
      if (!item?.date) return;
      const key = dateKey(item.date);
      countsByDay[key] = Number(item?.count || 0);
      levelsByDay[key] = Math.max(0, Math.min(4, Number(item?.level || 0)));
    });
    return {
      countsByDay,
      levelsByDay
    };
  };

  // Render cached data first (fast + fallback)
  try {
    const cachedRaw = localStorage.getItem(cacheKey);
    if (cachedRaw) applySnapshot(JSON.parse(cachedRaw), true);
  } catch (_) {
    // Ignore cache read errors.
  }

  try {
    const repos = await fetchJson(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    const ownRepos = repos.filter((r) => !r.fork);
    const totalStars = ownRepos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

    const languageTotals = {};
    await Promise.all(
      ownRepos.slice(0, 20).map(async (repo) => {
        try {
          const langData = await fetchJson(repo.languages_url);
          Object.entries(langData).forEach(([lang, bytes]) => {
            languageTotals[lang] = (languageTotals[lang] || 0) + Number(bytes || 0);
          });
        } catch (_) {}
      })
    );

    const sortedLangs = Object.entries(languageTotals).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const totalLangBytes = sortedLangs.reduce((sum, [, v]) => sum + v, 0) || 1;
    const palette = ["#f0542a", "#dacf49", "#7648b8", "#2a7ec1", "#d18b2f", "#56b870"];

    const langBarHtml = sortedLangs.map(([, bytes], i) => {
      const pct = (bytes / totalLangBytes) * 100;
      return `<span class="lang-segment" style="width:${pct.toFixed(2)}%;background:${palette[i % palette.length]}"></span>`;
    }).join("");
    const langListHtml = sortedLangs.map(([name, bytes], i) => {
      const pct = ((bytes / totalLangBytes) * 100).toFixed(2);
      return `<div class="lang-item"><span class="lang-dot" style="background:${palette[i % palette.length]}"></span>${name} ${pct}%</div>`;
    }).join("");

    const events = await fetchPaginatedEvents(`https://api.github.com/users/${username}/events/public`, 10);
    const eventCountsByDay = {};
    const contributedRepos = new Set();
    const prIds = new Set();
    const issueIds = new Set();
    let totalCommits = 0;

    const contributionTypes = new Set([
      "PushEvent",
      "PullRequestEvent",
      "IssuesEvent",
      "PullRequestReviewEvent",
      "IssueCommentEvent",
      "CommitCommentEvent",
      "CreateEvent"
    ]);

    events.forEach((ev) => {
      if (!ev?.created_at) return;
      const key = dateKey(ev.created_at);
      if (contributionTypes.has(ev.type)) {
        eventCountsByDay[key] = (eventCountsByDay[key] || 0) + 1;
      }
      if (ev?.repo?.name) contributedRepos.add(ev.repo.name);

      const d = new Date(ev.created_at);
      const inYear = d >= new Date(yearStartIso) && d <= new Date(yearEndIso);
      if (!inYear) return;

      if (ev.type === "PushEvent") {
        totalCommits += Number(ev?.payload?.size || ev?.payload?.commits?.length || 0);
      }
      if (ev.type === "PullRequestEvent" && ev?.payload?.action === "opened" && ev?.payload?.pull_request?.id) {
        prIds.add(ev.payload.pull_request.id);
      }
      if (ev.type === "IssuesEvent" && ev?.payload?.action === "opened" && ev?.payload?.issue?.id) {
        issueIds.add(ev.payload.issue.id);
      }
    });

    let countsByDay = eventCountsByDay;
    let levelsByDay = {};
    try {
      const calendar = await fetchContributionCalendar();
      if (Object.keys(calendar.countsByDay).length > 0) {
        countsByDay = calendar.countsByDay;
        levelsByDay = calendar.levelsByDay;
      }
    } catch (_) {
      // Keep events-based fallback when calendar API is unavailable.
    }

    const heatDays = 53 * 7;
    const heatEnd = new Date();
    const heatStart = new Date(heatEnd);
    heatStart.setDate(heatEnd.getDate() - (heatDays - 1));
    const heatDates = rangeDays(heatStart, heatEnd);
    const maxDaily = Math.max(1, ...Object.values(countsByDay));
    const todayKey = localDateKey(new Date());
    const yearPrefix = `${currentYear}-`;

    const totalContributions = Object.entries(countsByDay)
      .filter(([k]) => k.startsWith(yearPrefix) && k <= todayKey)
      .map(([, n]) => Number(n || 0))
      .reduce((s, n) => s + n, 0);

    const firstContributionDay = Object.entries(countsByDay)
      .filter(([, n]) => Number(n || 0) > 0)
      .map(([k]) => new Date(`${k}T00:00:00`))
      .sort((a, b) => a - b)[0] || heatStart;
    const streaks = calcStreaks(countsByDay, firstContributionDay, heatEnd);
    const totalPRs = prIds.size;
    const totalIssues = issueIds.size;

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

    const heatGridHtml = heatDates.map((d) => {
      const key = localDateKey(d);
      const count = countsByDay[key] || 0;
      const lv = Number.isFinite(levelsByDay[key]) ? levelsByDay[key] : levelFromCount(count, maxDaily);
      return `<span class="heat-cell lv${lv}" title="${key}: ${count} contributions"></span>`;
    }).join("");

    const monthMap = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthLabels = [];
    for (let i = 0; i < 12; i += 1) {
      const d = new Date(heatStart);
      d.setMonth(heatStart.getMonth() + i);
      monthLabels.push(monthMap[d.getMonth()]);
    }
    const heatMonthsHtml = monthLabels.map((m) => `<span>${m}</span>`).join("");

    const snapshot = {
      year: currentYear,
      publicRepos: ownRepos.length,
      totalStars,
      totalCommits,
      totalPRs,
      totalIssues,
      contributedRepos: contributedRepos.size,
      totalContributions,
      currentStreak: streaks.current,
      longestStreak: streaks.longest,
      grade,
      gradeScore,
      langBarHtml,
      langListHtml,
      heatGridHtml,
      heatMonthsHtml,
      updatedAt: new Date().toISOString()
    };

    applySnapshot(snapshot, false);
    els.updated.textContent = `Updated ${new Date(snapshot.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

    try {
      localStorage.setItem(cacheKey, JSON.stringify(snapshot));
    } catch (_) {}
  } catch (_) {
    const hasCache = !!localStorage.getItem(cacheKey);
    if (!hasCache) {
      [
        els.stars, els.commits, els.prs, els.issues,
        els.contributed, els.repos, els.totalContrib,
        els.currentStreak, els.longestStreak
      ].forEach((n) => { n.textContent = "--"; });
      els.langBar.innerHTML = "";
      els.langList.innerHTML = '<div class="lang-item">Unavailable</div>';
      els.heatGrid.innerHTML = "";
      els.heatMonths.innerHTML = "";
      applyGrade("--", NaN);
      els.updated.textContent = "Update failed (rate limit/network).";
    } else {
      els.updated.textContent = "Live update failed (showing cached data).";
    }
  }
});
