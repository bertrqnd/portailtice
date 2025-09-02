// wait for the DOM to be loaded before executing the code
document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("services.json");
    const allServices = await response.json();

    // Helper pour créer les liens
    function renderServices(services, containerId) {
        services.sort((a, b) => a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' }));
        const container = document.getElementById(containerId);
        for (const service of services) {
            const link = document.createElement("a");
            link.href = service.url;
            link.target = "_blank";
            link.className = "service";

            const icon = document.createElement("img");
            icon.src = service.image;
            icon.className = "service-icon";
            link.appendChild(icon);

            const span = document.createElement("span");
            span.textContent = service.title;
            link.appendChild(span);

            container.appendChild(link);
        }
    }

    renderServices(allServices.users, "services-users");
    renderServices(allServices.admin, "services-admin");

// MODALE
const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const loginSection = document.getElementById('loginSection');
const addAppSection = document.getElementById('addAppSection');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const addAppForm = document.getElementById('addAppForm');

// Ouvre la modale
openModalBtn.onclick = () => {
  modal.style.display = 'block';
  loginSection.style.display = 'block';
  addAppSection.style.display = 'none';
  loginError.style.display = 'none';
};

// Ferme la modale
closeModalBtn.onclick = () => { modal.style.display = 'none'; };

// Ferme si clic en dehors
window.onclick = (e) => {
  if (e.target == modal) modal.style.display = 'none';
};

// Login simple (user: admin, mdp: admin)
loginForm.onsubmit = function(e) {
  e.preventDefault();
  const user = document.getElementById('loginUser').value;
  const pwd = document.getElementById('loginPwd').value;
  if (user === 'admin' && pwd === 'admin') {
    loginSection.style.display = 'none';
    addAppSection.style.display = 'block';
    loginError.style.display = 'none';
  } else {
    loginError.style.display = 'block';
  }
};

// Initialise Supabase
const supabaseUrl = 'https://dpboaxdydkqvlzmbtarb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwYm9heGR5ZGtxdmx6bWJ0YXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MTIwMDQsImV4cCI6MjA3MjM4ODAwNH0.--NZ3zILqPr6uHiAZzcgoYtRuLlACuSYc9xZM4dVaCg';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Ajout dynamique d'une application dans Supabase
addAppForm.onsubmit = async function(e) {
  e.preventDefault();
  const title = document.getElementById('appName').value.trim();
  const url = document.getElementById('appUrl').value.trim();
  const category = document.getElementById('appCategory').value;
  const imageInput = document.getElementById('appImage');
  const file = imageInput.files[0];
  if (!title || !url || !file) return;

  const reader = new FileReader();
  reader.onload = async function(event) {
    const imageData = event.target.result;
    // Ajoute dans Supabase
    const { error } = await supabase
      .from('applications')
      .insert([{ title, url, image: imageData, category }]);
    if (!error) {
      modal.style.display = 'none';
      addAppForm.reset();
      loadApplications(); // recharge la liste
    } else {
      alert('Erreur lors de l\'ajout');
    }
  };
  reader.readAsDataURL(file);
};

// Charge les applications depuis Supabase
async function loadApplications() {
  const { data, error } = await supabase
    .from('applications')
    .select('*');
  if (error) return;
  // Sépare users/admin
  const users = data.filter(app => app.category === 'users');
  const admin = data.filter(app => app.category === 'admin');
  // Vide les containers
  document.getElementById('services-users').innerHTML = '';
  document.getElementById('services-admin').innerHTML = '';
  renderServices(users, 'services-users');
  renderServices(admin, 'services-admin');
}

// Au chargement, affiche les applications Supabase
document.addEventListener("DOMContentLoaded", loadApplications);
});
