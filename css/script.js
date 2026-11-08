// PROJECT DATA ARRAY
const projects = [
    {
        id: 1,
        name: "Medieval Castle",
        category: "fantasy",
        style: "Large medieval stone castle",
        image: "css/images/coloseum.png"
    },
    {
        id: 2,
        name: "Skyblock Spawn",
        category: "server",
        style: "Floating island server spawn",
        image: "css/images/camp.png"
    },
    {
        id: 3,
        name: "Cyberpunk City",
        category: "modern",
        style: "Modern futuristic city",
        image: "css/images/end.png"
    },
    {
        id: 4,
        name: "Fantasy Village",
        category: "fantasy",
        style: "Beautiful fantasy village",
        image: "css/images/village.png"
    }
];

// SECOND ARRAY
const services = [
    {
        id: "standard",
        name: "Standard Spawn",
        size: "100 x 100 blocks",
        description: "Basic server spawn",
        price: 49
    },
    {
        id: "advanced",
        name: "Advanced Hub",
        size: "250 x 250 blocks",
        description: "Detailed server hub",
        price: 129
    },
    {
        id: "mega",
        name: "Mega World Map",
        size: "500 x 500 blocks",
        description: "Large custom world",
        price: 299
    }
];

let favorites = [];
let favoritesOnly = false;


// FUNCTION 1: Format price
function formatPrice(price) {
    return "$" + price;
}


// FUNCTION 2: Create project card
function createProjectCard(project) {
    const card = document.createElement("div");

    card.className = "gallery-card";

    card.innerHTML = `
        <img src="${project.image}" class="gallery-image"
             alt="${project.name}">

        <div class="gallery-card-content">
            <h3>${project.name}</h3>
            <p>${project.style}</p>

            <button class="favorite-btn ${
                favorites.includes(project.id) ? "is-favorite" : ""
            }" data-id="${project.id}">
                ${favorites.includes(project.id) ? "★ Saved" : "☆ Favorite"}
            </button>
        </div>
    `;

    return card;
}


// FUNCTION 3: Display projects
function displayProjects(items, container) {
    if (!container) return;

    container.innerHTML = "";

    for (const project of items) {
        container.appendChild(createProjectCard(project));
    }
}


// FUNCTION 4: Filter projects
function filterProjects() {
    const search = document.querySelector("#projectSearch")
        ?.value.toLowerCase() || "";

    const category = document.querySelector("#categoryFilter")
        ?.value || "all";

    const filtered = projects.filter(project => {
        const matchesSearch =
            project.name.toLowerCase().includes(search) ||
            project.style.toLowerCase().includes(search);

        const matchesCategory =
            category === "all" || project.category === category;

        const matchesFavorite =
            !favoritesOnly || favorites.includes(project.id);

        return matchesSearch && matchesCategory && matchesFavorite;
    });

    const gallery = document.querySelector("#galleryGrid");

    displayProjects(filtered, gallery);

    const count = document.querySelector("#galleryCount");

    if (count) {
        count.textContent = `Showing ${filtered.length} projects`;
    }

    document.querySelector("#emptyGallery")
        ?.classList.toggle("d-none", filtered.length > 0);
}


// FUNCTION 5: Display services
function displayServices() {
    const table = document.querySelector("#pricingRows");
    const selector = document.querySelector("#estimateTier");

    if (!table || !selector) return;

    for (let i = 0; i < services.length; i++) {
        const service = services[i];

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${service.name}</td>
            <td>${service.size}</td>
            <td>${service.description}</td>
            <td>${formatPrice(service.price)}</td>
        `;

        table.appendChild(row);

        const option = document.createElement("option");

        option.value = service.id;
        option.textContent = service.name;

        selector.appendChild(option);
    }
}


// FUNCTION 6: Validate form
function validateForm() {
    const name = document.querySelector("#userName").value.trim();
    const email = document.querySelector("#userEmail").value.trim();
    const discord = document.querySelector("#discordTag").value.trim();
    const tier = document.querySelector("#buildTier").value;
    const details = document.querySelector("#projectDetails").value.trim();

    const errors = {
        name: name.length < 3 ? "Enter at least 3 characters." : "",
        email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            ? "Enter a valid email." : "",
        discord: discord.length < 2 ? "Enter your Discord username." : "",
        tier: !tier ? "Select a package." : "",
        details: details.length < 20
            ? "Enter at least 20 characters." : ""
    };

    let valid = true;

    for (const field in errors) {
        document.querySelector("#" + field + "Error").textContent =
            errors[field];

        if (errors[field]) {
            valid = false;
        }
    }

    return valid;
}


// DOM CONTENT LOADED
document.addEventListener("DOMContentLoaded", function() {

    // FEATURED PROJECTS
    const featured = document.querySelector("#featuredProjects");

    if (featured) {
        projects.slice(0, 3).forEach(project => {
            const column = document.createElement("div");

            column.className = "col-md-4";

            column.innerHTML = `
                <div class="card p-3">
                    <img src="${project.image}" class="img-fluid"
                         alt="${project.name}">
                    <h4 class="mt-2">${project.name}</h4>
                    <p>${project.style}</p>
                </div>
            `;

            featured.appendChild(column);
        });
    }

    // DISPLAY SERVICES
    displayServices();

    // DISPLAY GALLERY
    filterProjects();


    // SEARCH EVENT
    document.querySelector("#projectSearch")
        ?.addEventListener("input", filterProjects);


    // CATEGORY EVENT
    document.querySelector("#categoryFilter")
        ?.addEventListener("change", filterProjects);


    // FAVORITES BUTTON
    document.querySelector("#showFavorites")
        ?.addEventListener("click", function() {

            favoritesOnly = !favoritesOnly;

            this.textContent = favoritesOnly
                ? "Show All"
                : "★ Favorites";

            filterProjects();
        });


    // FAVORITE PROJECT EVENT
    document.querySelector("#galleryGrid")
        ?.addEventListener("click", function(event) {

            const button = event.target.closest(".favorite-btn");

            if (!button) return;

            const id = Number(button.dataset.id);

            if (favorites.includes(id)) {
                favorites = favorites.filter(item => item !== id);
            } else {
                favorites.push(id);
            }

            filterProjects();
        });


    // PRICE ESTIMATOR
    document.querySelector("#estimateTier")
        ?.addEventListener("change", function() {

            const selected = services.find(
                service => service.id === this.value
            );

            document.querySelector("#estimateResult").textContent =
                selected
                    ? "Estimated price: " + formatPrice(selected.price)
                    : "Select a package.";
        });


    // THEME SWITCHER
    document.querySelector("#themeToggle")
        ?.addEventListener("click", function() {

            document.body.classList.toggle("dark-theme");

            this.textContent =
                document.body.classList.contains("dark-theme")
                    ? "☀️ Light"
                    : "🌙 Theme";
        });


    // FORM VALIDATION
    document.querySelector("#commissionForm")
        ?.addEventListener("submit", function(event) {

            event.preventDefault();

            const success = document.querySelector("#formSuccess");

            success.classList.add("d-none");

            if (validateForm()) {

                success.textContent =
                    "Your commission request passed validation!";

                success.classList.remove("d-none");

                this.reset();
            }
        });


    // JQUERY FAQ ANIMATION
    $(".faq-answer").hide();

    $(".faq-question").on("click", function() {

        $(this)
            .closest(".faq-item")
            .children(".faq-answer")
            .slideToggle();
    });


    // JQUERY HOVER EFFECT
    $(".navbar-brand").on("mouseenter", function() {

        $(this).fadeTo(150, 0.5).fadeTo(150, 1);
    });


    // JQUERY KEYBOARD EVENT
    $(".faq-question").on("keydown", function(event) {

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            $(this).trigger("click");
        }
    });

});
