        // Récupération des données des projets sur API//
async function displayAllProjects() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const projets = await reponse.json();
    // Suppression des projets précédents //
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



// Mode Admin //

// Stockage du token dans une constante //
const token = localStorage.getItem("token");
console.log(token);

// Si présence du token, mode edition activé //

if (token !== null) {
    // On cache les filtres //
    const cacherBtn = document.querySelector(".btn-filtres");
    cacherBtn.style.display ="none";
    // Création du bandeau noir //
    const bandeNoir = document.querySelector("html");
    const divNoir = document.createElement("div");
    bandeNoir.prepend(divNoir);
    divNoir.className = "div-noir";

    const edition = document.createElement("div");
    divNoir.appendChild(edition);
    edition.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Mode édition';
    edition.className = "edition";

    // je change dans la nav login en logout //
    const menu = document.getElementById("menu");
    const menuLogin = document.getElementById("menu-login");
    const menuLogout = document.createElement("li");
    menuLogout.innerHTML = "<a href='#'>logout</a>";
    menu.replaceChild(menuLogout, menuLogin);
    function logout(e) {
        e.preventDefault();
        localStorage.removeItem("token");
        location.reload();
    }
    menuLogout.addEventListener("click", logout);
    
    // Bouton "Modifier" ouvrant la modale //
    const editButtonPortfolio = document.createElement("a");
	const works = document.querySelector(".titre_projet");
	works.appendChild(editButtonPortfolio);
	editButtonPortfolio.href = "#modal";
	editButtonPortfolio.innerHTML = "<i class='fa-regular fa-pen-to-square'></i>modifier";
	editButtonPortfolio.setAttribute("id", "button-portfolio");
}
