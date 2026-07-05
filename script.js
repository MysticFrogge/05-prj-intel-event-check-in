const form = document.getElementById("checkInForm");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const attendeeName = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const checkInButton = document.getElementById("checkInBtn");
const waterList = document.getElementById("waterList");
const zeroList = document.getElementById("zeroList");
const powerList = document.getElementById("powerList");
const waterCard = document.querySelector(".team-card.water");
const zeroCard = document.querySelector(".team-card.zero");
const powerCard = document.querySelector(".team-card.power");
const waterName = waterCard.querySelector(".team-name");
const zeroName = zeroCard.querySelector(".team-name");
const powerName = powerCard.querySelector(".team-name");

let totalAttendees = 0;
const maxAttendees = 50;
const teamLabels = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

const teamAttendees = {
  water: [],
  zero: [],
  power: [],
};

const attendanceStorageKey = "intelAttendanceData";

function saveAttendanceState() {
  const data = {
    totalAttendees: totalAttendees,
    counts: {
      water: Number(document.getElementById("waterCount").textContent),
      zero: Number(document.getElementById("zeroCount").textContent),
      power: Number(document.getElementById("powerCount").textContent),
    },
    teamAttendees: teamAttendees,
  };
  localStorage.setItem(attendanceStorageKey, JSON.stringify(data));
}

function loadAttendanceState() {
  const saved = localStorage.getItem(attendanceStorageKey);
  if (!saved) {
    return;
  }

  try {
    const data = JSON.parse(saved);
    totalAttendees = Number(data.totalAttendees) || 0;
    if (data.teamAttendees) {
      teamAttendees.water = Array.isArray(data.teamAttendees.water)
        ? data.teamAttendees.water
        : [];
      teamAttendees.zero = Array.isArray(data.teamAttendees.zero)
        ? data.teamAttendees.zero
        : [];
      teamAttendees.power = Array.isArray(data.teamAttendees.power)
        ? data.teamAttendees.power
        : [];
    }

    document.getElementById("attendeeCount").textContent = totalAttendees;
    document.getElementById("waterCount").textContent =
      Number(data.counts?.water) || 0;
    document.getElementById("zeroCount").textContent =
      Number(data.counts?.zero) || 0;
    document.getElementById("powerCount").textContent =
      Number(data.counts?.power) || 0;
  } catch (error) {
    console.error("Failed to load attendance state:", error);
  }
}

function disableCheckInForm() {
  checkInButton.disabled = true;
  attendeeName.disabled = true;
  teamSelect.disabled = true;
}

function createConfetti() {
  const colors = ["#ffd166", "#06d6a0", "#118ab2", "#ef476f"];
  const rect = checkInButton.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;

  for (let i = 0; i < 10; i = i + 1) {
    const piece = document.createElement("div");
    piece.className = "celebrate-piece";
    piece.style.left = startX + "px";
    piece.style.top = startY + "px";
    piece.style.backgroundColor = colors[i % colors.length];
    piece.style.setProperty("--x", Math.random() * 100 - 50 + "px");
    piece.style.setProperty("--y", Math.random() * 90 - 45 + "px");

    document.body.appendChild(piece);

    setTimeout(function () {
      piece.remove();
    }, 700);
  }
}

function animateButton() {
  checkInButton.classList.remove("celebrate-button");
  void checkInButton.offsetWidth;
  checkInButton.classList.add("celebrate-button");
}

function createTeamConfetti(targetElement) {
  const colors = ["#ffd166", "#06d6a0", "#118ab2", "#ef476f"];
  const rect = targetElement.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;

  for (let i = 0; i < 12; i = i + 1) {
    const piece = document.createElement("div");
    piece.className = "celebrate-piece";
    piece.style.left = startX + "px";
    piece.style.top = startY + "px";
    piece.style.backgroundColor = colors[i % colors.length];
    piece.style.setProperty("--x", Math.random() * 120 - 60 + "px");
    piece.style.setProperty("--y", Math.random() * 120 - 30 + "px");

    document.body.appendChild(piece);

    setTimeout(function () {
      piece.remove();
    }, 700);
  }
}

function updateTeamList(listEl, teamArray) {
  listEl.innerHTML = "";

  if (teamArray.length === 0) {
    const messageItem = document.createElement("li");
    messageItem.className = "empty-team-message";
    messageItem.textContent = "No attendees yet.";
    listEl.appendChild(messageItem);
    return;
  }

  teamArray.forEach(function (name) {
    const listItem = document.createElement("li");
    listItem.textContent = name;
    listEl.appendChild(listItem);
  });
}

function highlightWinningTeams() {
  waterCard.classList.remove("winner");
  zeroCard.classList.remove("winner");
  powerCard.classList.remove("winner");

  const counts = [
    {
      key: "water",
      count: Number(document.getElementById("waterCount").textContent),
      card: waterCard,
      title: waterName,
    },
    {
      key: "zero",
      count: Number(document.getElementById("zeroCount").textContent),
      card: zeroCard,
      title: zeroName,
    },
    {
      key: "power",
      count: Number(document.getElementById("powerCount").textContent),
      card: powerCard,
      title: powerName,
    },
  ];

  const maxCount = Math.max(counts[0].count, counts[1].count, counts[2].count);
  if (maxCount === 0) {
    return;
  }

  const winners = counts.filter(function (item) {
    return item.count === maxCount;
  });

  winners.forEach(function (item) {
    item.card.classList.add("winner");
    createTeamConfetti(item.title);
  });
}

function renderAttendeeLists() {
  updateTeamList(waterList, teamAttendees.water);
  updateTeamList(zeroList, teamAttendees.zero);
  updateTeamList(powerList, teamAttendees.power);
}

loadAttendanceState();
renderAttendeeLists();

if (totalAttendees >= maxAttendees) {
  highlightWinningTeams();
  disableCheckInForm();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const nameValue = attendeeName.value.trim();
  const teamValue = teamSelect.value;

  if (nameValue === "" || teamValue === "") {
    return;
  }

  totalAttendees = totalAttendees + 1;

  const progressPercent = (totalAttendees / maxAttendees) * 100;
  const safePercent = Math.min(progressPercent, 100);

  attendeeCount.textContent = totalAttendees;
  progressBar.style.width = safePercent + "%";

  const teamElement = document.getElementById(teamValue + "Count");
  const currentTeamCount = Number(teamElement.textContent);
  teamElement.textContent = currentTeamCount + 1;

  teamAttendees[teamValue].push(nameValue);
  renderAttendeeLists();
  saveAttendanceState();

  if (totalAttendees >= maxAttendees) {
    highlightWinningTeams();
  }

  greeting.textContent =
    "Welcome " +
    nameValue +
    "! You checked in for " +
    teamLabels[teamValue] +
    ".";
  greeting.className = "success-message";
  greeting.style.display = "block";

  createConfetti();
  animateButton();

  if (totalAttendees >= maxAttendees) {
    disableCheckInForm();
  }

  form.reset();
});
