// --- Données de base ---
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
  { name: "Curl biceps", muscle: "Biceps", series: 2 },
  { name: "Dips", muscle: "Triceps", series: 3 },
  { name: "Squat", muscle: "Jambes", series: 4 },
  { name: "Crunchs", muscle: "Abdos", series: 2 },
];

// --- Variables globales ---
const plan = [];
const remainingSeries = {}; // stocke les séries restantes par muscle

// --- Étape 1 : affichage des muscles ---
const muscleList = document.getElementById("muscle-list");
Object.keys(muscles).forEach(muscle => {
  const label = document.createElement("label");
  label.innerHTML = `<input type="checkbox" value="${muscle}"> ${muscle}`;
  muscleList.appendChild(label);
});

// --- Étape 2 : génération du quota ---
document.getElementById("generate").addEventListener("click", () => {
  const selectedMuscles = Array.from(document.querySelectorAll("input:checked")).map(m => m.value);
  if (selectedMuscles.length === 0) return alert("Choisis au moins un muscle !");
  
  const quotaList = document.getElementById("quota-list");
  quotaList.innerHTML = "";

  selectedMuscles.forEach(muscle => {
    const quota = muscles[muscle];
    remainingSeries[muscle] = quota.max; // au départ, on a le quota max
    const li = document.createElement("li");
    li.id = `quota-${muscle}`;
    li.textContent = `${muscle} → ${quota.min} à ${quota.max} séries/semaine (${quota.max} restantes)`;
    quotaList.appendChild(li);
  });

  document.getElementById("quota-section").classList.remove("hidden");
  document.getElementById("exercises-section").classList.remove("hidden");

  // Afficher seulement les exercices liés
  const exerciseSelect = document.getElementById("exercise-select");
  exerciseSelect.innerHTML = "";
  exercises
    .filter(ex => selectedMuscles.includes(ex.muscle))
    .forEach(ex => {
      const option = document.createElement("option");
      option.value = ex.name;
      option.textContent = `${ex.name} (${ex.series} séries - ${ex.muscle})`;
      exerciseSelect.appendChild(option);
    });
});

// --- Étape 3 : ajout d'exercices ---
document.getElementById("add-exercise").addEventListener("click", () => {
  const selectedName = document.getElementById("exercise-select").value;
  const exercise = exercises.find(ex => ex.name === selectedName);
  plan.push(exercise);

  // Soustraire les séries du quota restant
  remainingSeries[exercise.muscle] -= exercise.series;

  renderPlan();
  updateQuotas();
});

function renderPlan() {
  const planList = document.getElementById("exercise-plan");
  planList.innerHTML = "";

  plan.forEach(ex => {
    const li = document.createElement("li");
    li.textContent = `${ex.name} → ${ex.series} séries (${ex.muscle})`;
    planList.appendChild(li);
  });
}

// --- Mise à jour dynamique des quotas ---
function updateQuotas() {
  Object.keys(remainingSeries).forEach(muscle => {
    const li = document.getElementById(`quota-${muscle}`);
    const quota = muscles[muscle];
    const remaining = remainingSeries[muscle];

    if (remaining > quota.min) {
      li.style.color = "green";
    } else if (remaining > 0) {
      li.style.color = "orange";
    } else {
      li.style.color = "red";
    }

    li.textContent = `${muscle} → ${quota.min} à ${quota.max} séries/semaine (${Math.max(0, remaining)} restantes)`;
  });
}
