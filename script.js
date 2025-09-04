document.addEventListener("DOMContentLoaded", async () => {
  // Initialise Supabase avec la clé anon
  const supabaseUrl = 'https://dpboaxdydkqvlzmbtarb.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwYm9heGR5ZGtxdmx6bWJ0YXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MTIwMDQsImV4cCI6MjA3MjM4ODAwNH0.--NZ3zILqPr6uHiAZzcgoYtRuLlACuSYc9xZM4dVaCg';
  
  try {
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    console.log("Supabase initialisé");

    // Helper pour créer les liens
    function renderServices(services, containerId) {
      console.log(`Rendu des services pour ${containerId}`, services);
      
      if (!Array.isArray(services)) {
        console.error('services n\'est pas un tableau');
        return;
      }

      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Container ${containerId} non trouvé dans le DOM`);
        return;
      }

      // Vide le container avant d'ajouter les nouveaux services
      container.innerHTML = '';

      services.forEach((service, index) => {
        try {
          if (!service || !service.title || !service.url) {
            console.error(`Service invalide à l'index ${index}:`, service);
            return;
          }

          const link = document.createElement('a');
          link.href = service.url;
          link.className = 'service';
          link.target = '_blank';
          
          const img = document.createElement('img');
          if (service.image) {
            img.src = service.image;
          } else {
            img.src = '/portailtice/src/default-icon.png';
          }
          img.className = 'service-icon';

          img.onerror = () => {
            console.warn(`Image non chargée pour ${service.title}: ${img.src}`);
            img.src = '/portailtice/src/default-icon.png';
          };
          
          const span = document.createElement('span');
          span.textContent = service.title;
          
          link.appendChild(img);
          link.appendChild(span);
          container.appendChild(link);
          
          console.log(`Service ajouté: ${service.title}`);
        } catch (err) {
          console.error(`Erreur lors du rendu du service ${index}:`, err);
        }
      });
    }

    // Fonction principale de chargement
    async function loadApplications() {
      try {
        console.log("Chargement des applications depuis Supabase...");
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .order('title');

        if (error) {
          throw new Error(`Erreur Supabase: ${error.message}`);
        }

        if (!data || !Array.isArray(data)) {
          throw new Error('Données invalides reçues de Supabase');
        }

        console.log("Données reçues:", data);

        const users = data.filter(app => app.category === 'users');
        const admin = data.filter(app => app.category === 'admin');
        
        console.log(`Services users: ${users.length}, admin: ${admin.length}`);
        
        renderServices(users, 'services-users');
        renderServices(admin, 'services-admin');
        
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        // Affiche une erreur visible pour l'utilisateur
        const errorDiv = document.createElement('div');
        errorDiv.style.color = 'red';
        errorDiv.textContent = "Erreur lors du chargement des services";
        document.body.insertBefore(errorDiv, document.body.firstChild);
      }
    }

    // Charge les applications au démarrage
    await loadApplications();
    
    // MODALE
    const modal = document.getElementById('modal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const loginSection = document.getElementById('loginSection');
    const addAppSection = document.getElementById('addAppSection');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const addAppForm = document.getElementById('addAppForm');

    openModalBtn.onclick = () => {
      modal.style.display = 'block';
      loginSection.style.display = 'block';
      addAppSection.style.display = 'none';
      loginError.style.display = 'none';
    };

    closeModalBtn.onclick = () => {
      modal.style.display = 'none';
    };

    window.onclick = (e) => {
      if (e.target === modal) modal.style.display = 'none';
    };

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
        const { error } = await supabase
          .from('applications')
          .insert([{ title, url, image: imageData, category }]);
        if (!error) {
          modal.style.display = 'none';
          addAppForm.reset();
          await loadApplications();
        } else {
          alert('Erreur lors de l\'ajout');
        }
      };
      reader.readAsDataURL(file);
    };
  } catch (error) {
    console.error("Erreur d'initialisation:", error);
  }
});
