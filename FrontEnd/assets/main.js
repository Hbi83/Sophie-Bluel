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

// Récupération des données des categories sur API//

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
 

// Fonction pour filter les projets//

async function filterProject(e) {
    const idFilter = e.target.value; 
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
	editButtonPortfolio.href = "#modal1";
	editButtonPortfolio.innerHTML = "<i class='fa-regular fa-pen-to-square'></i>modifier";
	editButtonPortfolio.setAttribute("id", "button-portfolio");

    // Ouverture et fermeture modal //
    let modal = null;
    const openModal = function (e) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute("href"));
        target.style.display = null;
        target.setAttribute("aria-hidden", false);
        modal = target;
        modal.addEventListener("click", closeModal);
        modal.querySelectorAll(".js-modal-close").forEach(btnClose =>{
            btnClose.addEventListener("click", closeModal);
        })
        modal.querySelectorAll(".js-modal-stop").forEach(stopPro =>{
            stopPro.addEventListener("click", stopPropagation);
        })
        modal.querySelector(".addPictureBtn").addEventListener("click", openModal2);
    }

    const closeModal = function (e) {
        e.preventDefault();
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", true);
        removeForm()
    }

    const stopPropagation = function (e) {
        e.stopPropagation();
    }

    editButtonPortfolio.addEventListener("click", openModal);
    
    // Ajout des travaux dans la modal //

    async function displayAllMiniProjects() {
        const reponse = await fetch("http://localhost:5678/api/works");
        const miniProjets = await reponse.json();
        // Ajout des travaux de l'architect récupéré dynamiquement //
        document.querySelector(".modalContent").innerHTML = "";
        miniProjets.forEach(miniProjet => {
            let url = miniProjet.imageUrl;
            let title = miniProjet.title;
            let id = miniProjet.id;
            let catId = miniProjet.categoryId;
            document.querySelector(".modalContent").innerHTML +=
            `
                <div class=${catId}>
                        <img class=miniWork src=${url} alt="${title}">
                        <button class="suppBtn" id=${id}> <i class="fa-solid fa-trash-can"></i></boutton>
                </div>
            `
        })
        miniProjets.forEach(miniProjet => {
            document.getElementById(`${miniProjet.id}`).addEventListener('click', async (e) => {
                e.preventDefault();
                await deleteProject(e.target.id);
            })
        })
    }
    await displayAllMiniProjects();
    
    
    // Fonction supp un projet //

    async function deleteProject(projectId) {
        console.log(projectId);
        
        const reponse = await fetch(`http://localhost:5678/api/works/${projectId}`, {
            method: "DELETE",
            headers: {
                authorization: `Bearer ${token}`,
            }
        })
        if (reponse.ok) {
            alert("Projet supprimé");
            await displayAllProjects();
            await displayAllMiniProjects();
        }
    }      
    // Formulaire ajouter une photo //

    const openModal2 = function(e) {
        e.preventDefault();
        const editGallery = document.getElementById("editGallery");
        editGallery.style.display = "none";
        const addPictureModal = document.getElementById("addPicture");
        addPictureModal.style.display = "flex";
        categoryId.value = ""; 
    }

    // Fleche retour du formulaire //

    const btnBack = document.querySelector(".fa-arrow-left");
    btnBack.addEventListener("click", (e) => {
        e.preventDefault();
        const editGallery = document.getElementById("editGallery");
        editGallery.style.display = "flex";
        const addPictureModal = document.getElementById("addPicture");
        addPictureModal.style.display = "none";
    })

    // Previsualisation image //

    const previewImg = document.getElementById("imgPreview");
    const inputFile = document.getElementById("image");
    const labelFile = document.getElementById("label");
    const iconFile = document.getElementById("imgTemp");
    const pFile = document.getElementById("text");

    inputFile.addEventListener("change",() => {
        const file = inputFile.files[0];
        if (file) {         
            const reader = new FileReader();
            reader.onload = function (e){
                previewImg.src = e.target.result;
                previewImg.style.display = "flex";
                labelFile.style.display = "none";
                iconFile.style.display = "none";
                pFile.style.display = "none";
            }
            reader.readAsDataURL(file);
        }        
    })
    

    // Creation liste de catégories dans l'input select //

    async function displayCategoryModal() {
        const select = document.getElementById("category");
        const reponse = await fetch("http://localhost:5678/api/categories");
        const categories = await reponse.json();
        categories.forEach(categorie => {
            const option = document.createElement("option");
            option.value = categorie.id;
            option.textContent = categorie.name;
            select.appendChild(option);
        })
    }
    
    await displayCategoryModal();
    
    // Activation du boutton valider si tous les champs sont remplis //

  const changeBtnValid = function() {
      if (image !== undefined && title.value !== "" && categoryId.value !== "") {
          btnValid.style.backgroundColor = "#1D6154";
          btnValid.removeAttribute("disabled");         
        }
        else {
            btnValid.style.backgroundColor = "#A7A7A7"; 
            btnValid.setAttribute("disabled", "true");      
        }
    }
    
    document.getElementById("addPictureForm").onchange = changeBtnValid;
    
    // Post pour ajout de Travaux //
    
    const btnValid = document.querySelector(".buttonValid");
    const form = document.getElementById("addPictureForm");
    const image = document.getElementById("image");
    const imagePreview = document.getElementById("imgPreview");
    const title = document.getElementById("title");
    const categoryId = document.getElementById("category");
    
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", image.files[0]);
        formData.append("title", title.value);
        formData.append("category", categoryId.value);
        console.log(title);
        
        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: "POST",
                body: formData,
                headers: {
                    authorization: `Bearer ${token}`,                   
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                alert("Ajout avec succès:", data);
                removeForm();
                await displayAllProjects();
                await displayAllMiniProjects();

            } else {
                alert("Echec de l'ajout");
            }
        } catch (error) {
            console.error("Erreur:", error);
        }
    });
    
    // Fonction pour reset le formulaire //

    function removeForm() {
        title.value = "";
        categoryId.value = "";
        imagePreview.removeAttribute("src");
        imagePreview.removeAttribute("alt");
        imagePreview.style.display = "none";
        labelFile.style.display = "flex";
        iconFile.style.display = "flex";
        pFile.style.display = "flex";
        btnValid.style.backgroundColor = "#A7A7A7";
        btnValid.setAttribute("disabled", "true");
    }


}
        
       




        
    


