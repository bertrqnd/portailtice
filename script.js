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

// Ajout dynamique d'une application
addAppForm.onsubmit = function(e) {
  e.preventDefault();
  const title = document.getElementById('appName').value.trim();
  const url = document.getElementById('appUrl').value.trim();
  const category = document.getElementById('appCategory').value;
  const imageInput = document.getElementById('appImage');
  const file = imageInput.files[0];
  if (!title || !url || !file) return;
  const reader = new FileReader();
  reader.onload = function(event) {
    const newService = {
      title: title,
      url: url,
      image: event.target.result // base64
    };
    renderServices([newService], category === 'users' ? 'services-users' : 'services-admin');
    modal.style.display = 'none';
  };
  reader.readAsDataURL(file);
  e.target.reset();
};
});
