// wait for the DOM to be loaded before executing the code
document.addEventListener("DOMContentLoaded", async () => {

// fetching the json
    const response = await fetch("services.json");
    const allServices = await response.json();
    const services = allServices.className === "services" ? allServices.services : allServices;

// sort services by alphabetical order
    services.sort((a, b) => a.title.localeCompare(b.title));

// for loop that creates the services
    for (let i = 0; i < services.length; i++) {
        const service = services[i];

 // link
        const link = document.createElement("a");
        link.href = service.url;
        link.target = "_blank";
        link.className = "service";

// image
        const icon = document.createElement("img");
        icon.src = service.image;
        icon.className = "service-icon";
        link.appendChild(icon);

// text
        const span = document.createElement("span");
        span.textContent = service.title;
        link.appendChild(span);


        document.getElementById("services-container").appendChild(link);
    }
});
