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

let remainingSeries = {};
let selectedMuscles = [];

const muscleList = document.getElementById("muscle-list");
Object.keys(muscles).forEach(m => {
  const label = document.createElement("label");
  label.innerHTML = `<input type="checkbox" value="${m}"> ${m}`;
  muscleList.appendChild(label);
});

document.getElementById("generate").addEventListener("click", () => {
  selectedMuscles = Array.from(document.querySelectorAll("input:checked")).map(m => m.value);
  if(selectedMuscles.length === 0) return alert("Choisis au moins un muscle !");

  remainingSeries = {};
  const quotaList = document.getElementById("quota-list");
  quotaList.innerHTML = "";
  selectedMuscles.forEach(m => {
    remainingSeries[m] = muscles[m].max;
    const li = document.createElement("li");
    li.id = `quota-${m}`;
    li.textContent = `${m} → ${muscles[m].min} à ${muscles[m].max} séries/semaine (${muscles[m].max} restantes)`;
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

  setupWeekPlanner();
  enableDragDrop();
});

function setupWeekPlanner() {
  const week = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
  const planner = document.getElementById("week-planner");
  planner.innerHTML = "";
  week.forEach(day => {
    const div = document.createElement("div");
    div.className = "day";
    div.innerHTML = `<h3>${day}</h3><div class="dropzone"></div>`;
    planner.appendChild(div);
  });
}

function enableDragDrop() {
  const exercisesEls = document.querySelectorAll(".exercise");
  const dropzones = document.querySelectorAll(".dropzone");

  exercisesEls.forEach(ex => {
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
    zone.addEventListener("dragover", e => {
      e.preventDefault();
      zone.classList.add("dragover");
    });
    zone.addEventListener("dragleave", e => zone.classList.remove("dragover"));
    zone.addEventListener("drop", e => {
      e.preventDefault();
      zone.classList.remove("dragover");
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

function updateQuotas() {
  Object.keys(remainingSeries).forEach(m => {
    const li = document.getElementById(`quota-${m}`);
    const remaining = remainingSeries[m];
    const min = muscles[m].min;
    const max = muscles[m].max;

    li.textContent = `${m} → ${min} à ${max} séries/semaine (${Math.max(0, remaining)} restantes)`;
    li.style.color = remaining > min ? "green" : remaining > 0 ? "orange" : "red";
  });
}
