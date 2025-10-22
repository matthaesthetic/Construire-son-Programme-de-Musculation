// --- Données muscles & exercices ---
const muscles = {
  Pectoraux: { min: 10, max: 20 },
  Dos: { min: 10, max: 20 },
  Épaules: { min: 8, max: 16 },
  Biceps: { min: 8, max: 14 },
  Triceps: { min: 8, max: 14 },
  Jambes: { min: 12, max: 20 },
  Abdos: { min: 8, max: 14 }
};

const exercises = [
  { name: "Développé couché", muscle: "Pectoraux", series: 3 },
  { name: "Pompes", muscle: "Pectoraux", series: 2 },
  { name: "Tractions", muscle: "Dos", series: 3 },
  { name: "Rowing barre", muscle: "Dos", series: 3 },
  { name: "Élévations latérales", muscle: "Épaules", series: 3 },
  { name: "Développé militaire", muscle: "Épaules", series: 3 },
  { name: "Curl biceps", muscle: "Biceps", series: 2 },
  { name: "Hammer curl", muscle: "Biceps", series: 2 },
  { name: "Dips", muscle: "Triceps", series: 3 },
  { name: "Extensions triceps", muscle: "Triceps", series: 2 },
  { name: "Squat", muscle: "Jambes", series: 4 },
  { name: "Fentes", muscle: "Jambes", series: 3 },
  { name: "Crunchs", muscle: "Abdos", series: 2 },
  { name: "Gainage", muscle: "Abdos", series: 3 }
];

// --- Variables globales ---
const remainingSeries = {};
let selectedMuscles = [];

// --- Étape 1 : afficher muscles ---
const muscleList = document.getElementById("muscle-list");
Object.keys(muscles).forEach(muscle => {
  const label = document.createElement("label");
  label.innerHTML = `<input type="checkbox" value="${muscle}"> ${muscle}`;
  muscleList.appendChild(label);
});

// --- Étape 2 : générer quotas et exercises ---
document.getElementById("generate").addEventListener("click", () => {
  selectedMuscles = Array.from(document.querySelectorAll("input:checked")).map(m => m.value);
  if(selectedMuscles.length === 0) return alert("Choisis au moins un muscle !");

  const quotaList = document.getElementById("quota-list");
  quotaList.innerHTML = "";
  selectedMuscles.forEach(muscle => {
    remainingSeries[muscle] = muscles[muscle].max;
    const li = document.createElement("li");
    li.id = `quota-${muscle}`;
    li.textContent = `${muscle} → ${muscles[muscle].min} à ${muscles[muscle].max} séries/semaine (${muscles[muscle].max} restantes)`;
    quotaList.appendChild(li);
  });

  document.getElementById("quota-section").classList.remove("hidden");
  document.getElementById("exercises-section").classList.remove("hidden");
  document.getElementById("planner-section").classList.remove("hidden");

  const pool = document.getElementById("exercise-pool");
  pool.innerHTML = "";
  exercises.filter(e => selectedMuscles.includes(e.muscle)).forEach(ex => {
    const div = document.createElement("div");
    div.className = "exercise";
    div.draggable = true;
    div.dataset.name = ex.name;
    div.dataset.muscle = ex.muscle;
    div.dataset.series = ex.series;
    div.textContent = `${ex.name} (${ex.series} séries)`;
    pool.appendChild(div);
  });

  enableDragDrop();
});

// --- Drag & Drop ---
function enableDragDrop() {
  const exerciseEls = document.querySelectorAll(".exercise");
  const dropzones = document.querySelectorAll(".dropzone");

  exerciseEls.forEach(ex => {
    ex.addEventListener("dragstart", e => {
      ex.classList.add("dragging");
      e.dataTransfer.setData("text/plain", JSON.stringify({
        name: ex.dataset.name,
        muscle: ex.dataset.muscle,
        series: ex.dataset.series
      }));
    });
    ex.addEventListener("dragend", () => ex.classList.remove("dragging"));
  });

  dropzones.forEach(zone => {
    zone.addEventListener("dragover", e => e.preventDefault());
    zone.addEventListener("drop", e => {
      e.preventDefault();
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      if(remainingSeries[data.muscle] <= 0) return alert(`${data.muscle} a atteint son quota !`);

      const div = document.createElement("div");
      div.className = "exercise";
      div.textContent = `${data.name} (${data.series} séries)`;
      zone.appendChild(div);

      remainingSeries[data.muscle] -= parseInt(data.series);
      updateQuotas();
    });
  });
}

// --- Mise à jour quotas ---
function updateQuotas() {
  Object.keys(remainingSeries).forEach(muscle => {
    const li = document.getElementById(`quota-${muscle}`);
    const remaining = remainingSeries[muscle];
    const min = muscles[muscle].min;
    const max = muscles[muscle].max;

    li.textContent = `${muscle} → ${min} à ${max} séries/semaine (${Math.max(0, remaining)} restantes)`;

    if (remaining > min) li.style.color = "green";
    else if (remaining > 0) li.style.color = "orange";
    else li.style.color = "red";
  });
}
