        // Récupération des données des projets sur API//




// Suppression des projets précédents //
async function displayAllProjects() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const projets = await reponse.json();
    document.querySelector(".gallery").innerHTML = '';
    // Ajout des travaux de l'architect récupéré dynamiquement //
    projets.forEach(projet => {
        let url = projet.imageUrl;
        let title = projet.title;
        let catId = projet.categoryId;
        let id = projet.id;
        document.querySelector(".gallery").innerHTML +=
        ` <div id="${id}">
            <div class=cat-${catId}>
                <figure>
                    <img src=${url} alt="${title}">
                    <figcaption>${title}</figcaption>
                </figure>
            </div>
          </div>
        `
    })
}

async function displayAllCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const categories = await reponse.json();

    const titre = document.querySelector(".titre_projet");
    const newDiv = document.createElement("div");
    titre.appendChild(newDiv);
    newDiv.className = "btn-filtres";

    const buttonTous = document.createElement("button");
    newDiv.appendChild(buttonTous);
    buttonTous.innerHTML = "Tous";
    buttonTous.className = "btn-filtre";
    buttonTous.setAttribute("value", 0)

    categories.forEach(categorie => {
        const buttonFilter = document.createElement("button");
        newDiv.appendChild(buttonFilter);
        buttonFilter.innerHTML = categorie.name;
        buttonFilter.className = "btn-filtre";
        buttonFilter.setAttribute("value",categorie.id);
    });
}

 
await displayAllProjects();
await displayAllCategories();

// ---------------------------------------------//

async function filterProject(e) {
    const idFilter = e.target.value;
    console.log(typeof idFilter);
    if (idFilter == '0') {
        return await displayAllProjects();
    }
    const reponse = await fetch("http://localhost:5678/api/works");
    const projects = await reponse.json();
    document.querySelector(".gallery").innerHTML = '';
    const filtredProjects = projects.filter((project) => project.category.id == idFilter)
    console.log(filtredProjects);
    filtredProjects.forEach(filtredProject => {
        let url = filtredProject.imageUrl;
        let title = filtredProject.title;
        let catId = filtredProject.categoryId;
        let id = filtredProjects.id;
        document.querySelector(".gallery").innerHTML +=
        ` <div id="${id}">
            <div class=cat-${catId}>
                <figure>
                    <img src=${url} alt="${title}">
                    <figcaption>${title}</figcaption>
                </figure>
            </div>
          </div>
        `
    })
}

document.querySelectorAll(".btn-filtre").forEach(btnFilter =>{
    btnFilter.addEventListener('click', filterProject);
    
})







