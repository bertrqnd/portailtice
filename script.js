// wait for the DOM to be loaded before executing the code
document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("services.json");
    const allServices = await response.json();

    // Helper pour créer les liens
    function renderServices(services, containerId) {
        services.sort((a, b) => a.title.localeCompare(b.title));
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
});
