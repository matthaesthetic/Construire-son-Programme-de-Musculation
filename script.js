const taches = document.querySelectorAll('.tache');
const jours = document.querySelectorAll('.jour');

let tacheEnCours = null;

// Charger le planning depuis localStorage
window.addEventListener('load', () => {
  jours.forEach(jour => {
    const saved = localStorage.getItem(jour.dataset.jour);
    if (saved) {
      jour.innerHTML = '<h2>' + jour.dataset.jour.charAt(0).toUpperCase() + jour.dataset.jour.slice(1) + '</h2>' + saved;
      addDragListeners();
    }
  });
});

// Drag start / end
taches.forEach(tache => {
  tache.addEventListener('dragstart', e => {
    tacheEnCours = tache;
    setTimeout(() => tache.style.display = 'none', 0);
  });

  tache.addEventListener('dragend', e => {
    tache.style.display = 'block';
    tacheEnCours = null;
    savePlanning();
  });
});

// Drag over / drop
jours.forEach(jour => {
  jour.addEventListener('dragover', e => e.preventDefault());
  jour.addEventListener('dragenter', e => {
    e.preventDefault();
    jour.classList.add('dragover');
  });
  jour.addEventListener('dragleave', e => {
    jour.classList.remove('dragover');
  });
  jour.addEventListener('drop', e => {
    jour.appendChild(tacheEnCours);
    jour.classList.remove('dragover');
    savePlanning();
  });
});

// Sauvegarder le planning dans localStorage
function savePlanning() {
  jours.forEach(jour => {
    const tasksHTML = Array.from(jour.querySelectorAll('.tache')).map(t => t.outerHTML).join('');
    localStorage.setItem(jour.dataset.jour, tasksHTML);
  });
}

// Ré-attacher les listeners après reconstruction depuis localStorage
function addDragListeners() {
  const allTaches = document.querySelectorAll('.tache');
  allTaches.forEach(tache => {
    tache.addEventListener('dragstart', e => {
      tacheEnCours = tache;
      setTimeout(() => tache.style.display = 'none', 0);
    });
    tache.addEventListener('dragend', e => {
      tache.style.display = 'block';
      tacheEnCours = null;
      savePlanning();
    });
  });
}
