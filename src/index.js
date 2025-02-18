import styles from "../src/styles.css"
import Todo from "./modules/todo"
import Subtask from "./modules/subtask"
import Project from "./modules/project"
import pendingUI from "./ui-modules/pending"
import { PRIORITIES } from "./modules/priority-constants"
import projectUI from "./ui-modules/projectsui"
import completedUI from "./ui-modules/completed"
const header=document.querySelector("headder")
const dialog = document.querySelector(".addprojectdialog");
const closeButton = document.querySelector(".cancelprojectbtn");
const addProjectDialogBtn=document.querySelector(".addproject")
const addProjectbtn=document.querySelector(".addprojectbtn")
const projectNameInput=document.getElementById("projectnameinput")


const editProjectDialog=document.querySelector(".editprojectdialog")
const editProjectNameInput=document.getElementById("editprojectnameinput")
const addEditProjectNameBtn=document.querySelector(".addeditprojectbtn")
const cancelEditProjectBtn=document.querySelector(".canceleditprojectbtn")

const projectlists=document.querySelector(".projectlists")
const projectsListarr=[]

const demoproj=new Project("Demo Project");
projectsListarr.push(demoproj)

// Render the projects by traversing the projectsListarr
function renderProjects() {
    // Clear the current UI
    projectlists.innerHTML = "";

    // Rebuild the UI based on the current projectsListarr
    projectsListarr.forEach((project, index) => {
        projectlists.innerHTML += `
            <li class="proj nav ${index === 0 ? 'active' : ''}" data-index="${index}">
                <div class="wrapper">
                    <p class="project">${project.title}</p>
                    <div class="icons">
                        <svg class="edit" data-index="${index}" fill="#F696A9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>edit name</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
                        <svg class="check" data-index="${index}" fill="#F696A9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>mark complete</title><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" /></svg>
                    </div>
                </div>
            </li>`;
    });

    // Call projectUI for the first project if it exists
    if (projectsListarr.length > 0) {
        const firstProject = projectsListarr[0];
        projectUI(firstProject);
    }
    else{
        activateElement(document.querySelector(".completed"));
        completedUI(projectsListarr);
    }
}

renderProjects()

// Function to activate clicked element and remove active from others
function activateElement(target) {
    const allNavItems = document.querySelectorAll(".nav");
    allNavItems.forEach(item => item.classList.remove("active"));
    if (target.closest(".completed")) {
        target.closest(".completed").classList.add("active");
        completedUI(projectsListarr);
    }

    if (target.closest(".pending")) {
        target.closest(".pending").classList.add("active");
        pendingUI(projectsListarr);
    }

    if (target.closest(".proj")) {
        target.closest(".proj").classList.add("active");
        const index = target.closest(".proj").dataset.index;
        const selectedProject = projectsListarr[index];
        projectUI(selectedProject);
    }
}



// Handle clicks on the entire header section
document.querySelector("header").addEventListener("click", (e) => {
    const target = e.target;

    // Handle Completed Tasks Click
    if (target.classList.contains("completed") || target.classList.contains("completed-svg") || target.classList.contains("completed-tasks")) {
        activateElement(document.querySelector(".completed"));
        completedUI(projectsListarr);
    }

    // Handle Pending Tasks Click
    if (target.classList.contains("pending") || target.classList.contains("pending-svg") || target.classList.contains("pending-tasks")) {
        activateElement(document.querySelector(".pending"));
        pendingUI(projectsListarr);
    }

    // Handle Project Click
    if (target.closest(".proj")) {
        const liElement = target.closest(".proj");
        const index = parseInt(liElement.dataset.index);
        const selectedProject = projectsListarr[index];
        console.log(selectedProject)
        if (selectedProject) {
            activateElement(liElement);
            projectUI(selectedProject);
        }
    }
});

addProjectDialogBtn.addEventListener("click",(e)=>{
    dialog.showModal();
})

addProjectbtn.addEventListener("click",(e)=>{
    if (projectNameInput.value.trim()!==""){
        const project=new Project(projectNameInput.value.trim())
        projectsListarr.push(project)
        const index = projectsListarr.length - 1;
        projectlists.innerHTML+=`<li class="proj nav" data-index="${index}">
                        <div class="wrapper">
                            <p class="project">${project.title}</p>
                            <div class="icons">
                            <svg class="edit" data-index="${index}" fill="#F696A9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>edit name</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
                            <svg class="check" data-index="${index}" fill="#F696A9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>mark complete</title><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" /></svg>
                        </div>
                        </div>
                    </li>`
        
        console.log("project list",projectsListarr)
        projectNameInput.value=""
        dialog.close();
        console.log(project)
    }
    else{
        dialog.close();
    }
    
})


// "Close" button closes the dialog
closeButton.addEventListener("click", () => {
  projectNameInput.value=""  
  dialog.close();
});



let currentEditIndex = null; // Track the index of the project being edited

projectlists.addEventListener("click", (e) => {
    const target = e.target;
    const index = parseInt(target.dataset.index);

    if (target.classList.contains("edit")) {
        console.log("edit clicked= ", index);
        currentEditIndex = index; // Set the current index for editing
        editProjectDialog.showModal();
    }

    if (target.classList.contains("check")) {
        // Handle mark complete action
        projectsListarr[index].markCompleted();
        projectsListarr.splice(index, 1);
        renderProjects();
        console.log(`Project at index ${index} marked as complete:`, projectsListarr);
    }
});

// Handle the edit action here to prevent multiple event listeners
addEditProjectNameBtn.addEventListener("click", () => {
    if (editProjectNameInput.value.trim() !== "" && currentEditIndex !== null) {
        // projectsListarr[currentEditIndex].editProjectTitle(editProjectNameInput.value.trim());
        projectsListarr[currentEditIndex].title=editProjectNameInput.value.trim();
        renderProjects();
        console.log(`Project at index ${currentEditIndex} updated:`, projectsListarr);
        editProjectNameInput.value = "";
        editProjectDialog.close();
        currentEditIndex = null; // Reset after editing
    } else {
        editProjectDialog.close();
    }
});

// Handle cancel edit
cancelEditProjectBtn.addEventListener("click", () => {
    editProjectNameInput.value = "";
    editProjectDialog.close();
    currentEditIndex = null;
});

export default projectsListarr
