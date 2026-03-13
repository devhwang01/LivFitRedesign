document.addEventListener("DOMContentLoaded", () => {
  setupTrackerDemo();
  setupContactDemoMessage();
});

function setupTrackerDemo() {
  const trackerForm = document.getElementById("trackerForm");
  const trackerList = document.getElementById("trackerList");
  const clearEntriesBtn = document.getElementById("clearEntries");
  const emptyState = document.getElementById("trackerEmptyState");

  const totalEntriesEl = document.getElementById("totalEntries");
  const workoutEntriesEl = document.getElementById("workoutEntries");
  const nutritionEntriesEl = document.getElementById("nutritionEntries");

  if (!trackerForm || !trackerList) return;

  const entryType = document.getElementById("entryType");
  const entryTitle = document.getElementById("entryTitle");
  const entryValue = document.getElementById("entryValue");
  const entryNotes = document.getElementById("entryNotes");

  const storageKey = "livfitTrackerEntries";

  function getEntries() {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  }

  function saveEntries(entries) {
    localStorage.setItem(storageKey, JSON.stringify(entries));
  }

  function renderEntries() {
    const entries = getEntries();
    trackerList.innerHTML = "";

    if (entries.length === 0) {
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
    }

    let workoutCount = 0;
    let nutritionCount = 0;

    entries.forEach((entry, index) => {
      if (entry.type === "Workout") workoutCount++;
      if (entry.type === "Nutrition") nutritionCount++;

      const item = document.createElement("div");
      item.className = "tracker-item";

      item.innerHTML = `
        <div class="tracker-item-header">
          <div>
            <span class="tracker-badge">${entry.type}</span>
            <h4 class="mt-2 mb-1">${entry.title}</h4>
          </div>
          <div class="tracker-value">${entry.value} ${entry.type === "Workout" ? "mins" : "cal"}</div>
        </div>
        <p>${entry.notes ? entry.notes : "No additional notes provided."}</p>
        <button class="tracker-remove-btn" data-index="${index}">Remove entry</button>
      `;

      trackerList.appendChild(item);
    });

    totalEntriesEl.textContent = entries.length;
    workoutEntriesEl.textContent = workoutCount;
    nutritionEntriesEl.textContent = nutritionCount;

    document.querySelectorAll(".tracker-remove-btn").forEach((button) => {
      button.addEventListener("click", () => {
        removeEntry(Number(button.dataset.index));
      });
    });
  }

  function removeEntry(index) {
    const entries = getEntries();
    entries.splice(index, 1);
    saveEntries(entries);
    renderEntries();
  }

  trackerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!entryType.value || !entryTitle.value.trim() || !entryValue.value.trim()) {
      return;
    }

    const entries = getEntries();

    entries.unshift({
      type: entryType.value,
      title: entryTitle.value.trim(),
      value: entryValue.value.trim(),
      notes: entryNotes.value.trim()
    });

    saveEntries(entries);
    trackerForm.reset();
    renderEntries();
  });

  clearEntriesBtn.addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    renderEntries();
  });

  renderEntries();
}

function setupContactDemoMessage() {
  const contactDemoBtn = document.getElementById("contactDemoBtn");
  const contactSuccessMessage = document.getElementById("contactSuccessMessage");

  if (!contactDemoBtn || !contactSuccessMessage) return;

  contactDemoBtn.addEventListener("click", () => {
    contactSuccessMessage.classList.remove("d-none");
  });
}