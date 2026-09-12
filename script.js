const projects = [
    {
        categories: ["Web App", "Landing Page"],
        title: "Better Future Academy",
        description: "An all-in-one English learning platform (A1–B2) combining live scheduling, interactive practice exercises, and unit-based lessons. Built to streamline language acquisition through intuitive student features and administrative tools.",
        tags: ["Node.js", "Stripe", "JWT Auth"],
        links: [
            { label: "Visit website", url: "https://www.betterfutureacad.com/" }
        ],
        imgsrc: "images/bfa_desktop.png",
        imgalt: "Better Future Academy platform preview"
    },
    {
        categories: ["Web App", "Landing Page"],
        title: "Tally Turn",
        description: "A streamlined, reliable time-tracking web app designed for small businesses to monitor team hours effortlessly. Features location verification and flexible company customization to keep workforce management simple, secure, and accurate.",
        tags: ["ChatGPT", "Stripe", "Supabase"],
        links: [
            { label: "Try demo", url: "https://tallyturn.app/demo" },
            { label: "Visit website", url: "https://tallyturn.app/" }
        ],
        imgsrc: "images/tt_desktop.png",
        imgalt: "Tally Turn time-tracking app preview"
    },
    {
        categories: ["Game"],
        title: "La República del Platanal",
        description: "A lightweight, web-based multiplayer game built to bring family together from anywhere in the world. Designed for instant access using a simple 4-digit PIN code, ensuring smooth play across low-bandwidth connections and any device.",
        tags: ["Socket.IO", "TypeScript", "Supabase"],
        links: [
            { label: "Play game", url: "https://la-republica-del-platanal.vercel.app/" }
        ],
        imgsrc: "images/republic_platanal.png",
        imgalt: "La República del Platanal game preview"
    }
]


let projectsList = document.querySelector('#project-grid');

// CAROUSEL ELEMENTS AND VARIABLES
let currentIndex = 0;  // Where we start
const carouselBreakpoint = window.matchMedia('(max-width: 950px)');
let itemsPerPage = getItemsPerPage();
const nextButton = document.querySelector("#next-btn");
const previousButton = document.querySelector("#previous-btn");
const phoneBreakpoint = window.matchMedia('(max-width: 600px)');

function getItemsPerPage() {
    return carouselBreakpoint.matches ? 1 : 3;
}

function updateCarouselState() {
    const maxIndex = Math.max(currentProjectsShown.length - itemsPerPage, 0);

    currentIndex = Math.min(currentIndex, maxIndex);
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === maxIndex;
}

// Mobile navigation
const header = document.querySelector('header');
const menuButton = document.querySelector('.menu-button');
const navigationLinks = document.querySelectorAll('.nav-links a');

function setMenuOpen(isOpen) {
    header.dataset.menuOpen = isOpen;
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}

menuButton.addEventListener('click', () => {
    setMenuOpen(header.dataset.menuOpen !== 'true');
});

navigationLinks.forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.dataset.menuOpen === 'true') {
        setMenuOpen(false);
        menuButton.focus();
    }
});

let currentProjectsShown = projects;

function displayProjects() {
    updateCarouselState();

    // Any projects currently on display must be removed so that we can use the filters to display only the selected projects later.
    projectsList.innerHTML = "";

    // Extract only the amount of projects we want to show at once
    const visibleProjects = currentProjectsShown.slice(currentIndex, currentIndex + itemsPerPage);

    // from the project we are passing the function, build the HTML and add it to #project-grid
    visibleProjects.forEach((project, index) => {

        const article = document.createElement('article'); // new article element
        article.classList.add("project-card"); // styles
        article.classList.add("card-entrance"); // add animation
        
        article.style.setProperty('--i', index); // pass index num as a variable --i

        let html =
        `
            <img src="${project.imgsrc}" alt="${project.imgalt}"/>

                <div class="project-content">
                    <div class="project-types">
                    ${displayCategories(project.categories)}
                    </div>
                    <h3>${project.title}</h3>
                    <p>
                    ${project.description}
                    </p>

                    <div class="project-tags">
                    ${displayTags(project.tags)}
                    </div>

                    <div class="project-links">
                    ${displayLinks(project.links)}
                    </div>
                </div>
        `
        article.innerHTML = html;
        projectsList.appendChild(article);

        setTimeout(() => {
            article.classList.remove('card-entrance');
        }, 500);
    })

}

function displayCategories(categories) {
    return categories
        .map(category => `<span class="project-type" data-type="${category}">${category}</span>`)
        .join('');
}

function displayTags(tags) {
    return tags.map(tag => `<span>${tag}</span>`).join('');
}

function displayLinks(links) {
    return links
        .map((link, index) => `
            <a href="${link.url}" class="project-link${index > 0 ? ' secondary-project-link' : ''}" target="_blank" rel="noopener noreferrer">${link.label}</a>
        `)
        .join('');
}
// Carousel navigation btns
nextButton.addEventListener('click', () => {
    // Boundary check
    if (currentIndex + itemsPerPage < currentProjectsShown.length) {
        currentIndex += 1;
        displayProjects(); // Re-render with the new index
    }
});
previousButton.addEventListener('click', () => {
    // Boundary check
    if (currentIndex > 0) {
        currentIndex -= 1;
        displayProjects(); // Re-render with the new index
    }
});

// Swipe between projects on phones without blocking vertical scrolling.
let touchStartX = 0;
let touchStartY = 0;
let lastSwipeTime = 0;

projectsList.addEventListener('touchstart', event => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, { passive: true });

projectsList.addEventListener('touchend', event => {
    if (!phoneBreakpoint.matches) return;

    const touch = event.changedTouches[0];
    const horizontalDistance = touch.clientX - touchStartX;
    const verticalDistance = touch.clientY - touchStartY;
    const isHorizontalSwipe = Math.abs(horizontalDistance) > 55
        && Math.abs(horizontalDistance) > Math.abs(verticalDistance) * 1.2;

    if (!isHorizontalSwipe) return;

    lastSwipeTime = Date.now();

    if (horizontalDistance < 0) {
        nextButton.click();
    } else {
        previousButton.click();
    }
}, { passive: true });

// Prevent a swipe that begins over a link from opening that link.
projectsList.addEventListener('click', event => {
    if (Date.now() - lastSwipeTime < 500) {
        event.preventDefault();
        event.stopPropagation();
    }
}, true);

carouselBreakpoint.addEventListener('change', () => {
    itemsPerPage = getItemsPerPage();
    displayProjects();
});

// Display all projects for the first time
displayProjects();


/////////////////////      FILTERS       //////////////////////////////

// Get all filter pills
const pills = document.querySelectorAll('.pill');

// adding event listener to ALL pills
pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
        // remove class "active" from whatever pill has it
        document.querySelector('.pill.active').classList.remove('active');
        // add "active" class to the current pill that has been clicked
        pill.classList.add('active');
        
        // get value from data-filter
        const filterValue = pill.getAttribute('data-filter');
        currentIndex = 0; // Reset carousel back to the first item
        
    // If value is 'all' all project are displayed
        if (filterValue === 'all') {
            currentProjectsShown = projects;
            displayProjects();
        }
    // Otherwise, show projects that belong to the selected category.
        else {         
            const filtered = projects.filter(project =>
                project.categories.includes(filterValue)
            );
            
            // update info on what is to be shown
            currentProjectsShown = filtered;
            // display only the filtered projects
            displayProjects();
        }
    });
});

/////////////////////      PAGE ANIMATIONS       //////////////////////////////

const revealElements = document.querySelectorAll(`
    #projects .section-heading,
    .filter-pills,
    .projects-carousel,
    .about-image-wrap,
    .about-text,
    #skills .section-heading,
    .skill-card,
    .cta-content,
    .cta-section .button-row,
    .site-footer > *
`);

revealElements.forEach(element => {
    element.classList.add('scroll-reveal');

    if (element.classList.contains('skill-card')) {
        const skillIndex = [...document.querySelectorAll('.skill-card')].indexOf(element);
        element.style.setProperty('--reveal-delay', `${(skillIndex % 5) * 70}ms`);
    }

    if (element.matches('.about-image-wrap, .site-footer > :first-child')) {
        element.classList.add('reveal-from-left');
    }

    if (element.matches('.about-text, .site-footer > :last-child')) {
        element.classList.add('reveal-from-right');
    }
});

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -45px'
});

revealElements.forEach(element => revealObserver.observe(element));

document.body.classList.add('motion-ready');
requestAnimationFrame(() => {
    document.body.classList.add('page-loaded');
});
