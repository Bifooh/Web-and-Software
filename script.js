const projects = [
    {
        type: "Web App", 
        title: "Better Future Academy", 
        description: "Education platform for English learners, mentors, scheduling, and practice tools",
        tags: ["React", "Node.js", "MySQL", "Education"],
        link: "https://www.betterfutureacad.com/",
        imgsrc: "images/bfa-project.png",
        imgalt: "Better Future Academy"
    },
    {
        type: "Landing Page", 
        title: "Harmon’s Heating & Cooling", 
        description: "Modern website for a local HVAC business focused on trust and mobile experience.",
        tags: ["HTML", "CSS", "JS"],
        link: "https://preview.harmonsheatingandair.com/",
        imgsrc: "images/harmons-project.png",
        imgalt: "Harmon's Heating and Cooling project preview"
    },
    {
        type: "Game", 
        title: "Spanish Challenge", 
        description: "Showing the kind of fun you can fun while learning a language.",
        tags: ["Live Challenge", "React", "Node.js"],
        link: "https://demo.betterfutureacad.com/",
        imgsrc: "images/spanish-challenge.png",
        imgalt: "Game example"
    },
        {
        type: "Game", 
        title: "Pixel Quest", 
        description: "Small 2D game experiment built with JavaScript and creative coding ideas..",
        tags: ["JavaScript", "React", "Node.js"],
        link: "#",
        imgsrc: "images/game-project.png",
        imgalt: "Game example"
    }
]


let projectsList = document.querySelector('#project-grid');

// CAROUSEL ELEMENTS AND VARIABLES
let currentIndex = 0;  // Where we start
const itemsPerPage = 3; // How many projects are shown at once
const nextButton = document.querySelector("#next-btn");
const previousButton = document.querySelector("#previous-btn");

let currentProjectsShown = projects;

function displayProjects() {
    
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
                    <p class="project-type">${project.type}</p>
                    <h3>${project.title}</h3>
                    <p>
                    ${project.description}
                    </p>

                    <div class="project-tags">
                    ${DisplayTags(project.tags)}
                    </div>

                    <a href="${project.link}" class="project-link" target="_blank">View Project ↗</a>
                </div>
        `
        article.innerHTML = html;
        projectsList.appendChild(article);

        setTimeout(() => {
            article.classList.remove('card-entrance');
        }, 500);
    })

}

// DisplaysProject() complement
function DisplayTags(tags){
        // Creating an empty list.
        let tagsHtml = [];
        // Adding <span> tags to each html element and adding them to the list.
        tags.forEach(element => {
            let tagHtml = `<span>${element}</span>`;
            tagsHtml.push(tagHtml);
        })
        // Return list with all tags in the right format
        return tagsHtml.join('');
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
    // if not, we filter the projects list to include only matchings for *type* or *tags*
        else {         
            const filtered = projects.filter(project => {
                const matchesType = project.type === filterValue; // match type
                const matchesTag = project.tags.includes(filterValue); // match any of the tags

                // return project that match
                return matchesType || matchesTag;
            });
            
            // update info on what is to be shown
            currentProjectsShown = filtered;
            // display only the filtered projects
            displayProjects();
        }
    });
});
