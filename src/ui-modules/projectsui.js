
import projectsListarr from ".."
import Subtask from "../modules/subtask";
import Project from "../modules/project"
import Todo from "../modules/todo"

function projectUI(project) {
    const mainContainer = document.querySelector(".main-container");
    const mainTitle = document.querySelector(".main-title");
    
    const addTaskDialogBox = document.querySelector(".add-task-dialog");
    const addTaskTitleInput = document.getElementById("add-task-title-input");
    const addTaskDialogBtn = document.querySelector(".add-task-ok-btn");
    const cancelTaskDialogBtn = document.querySelector(".cancel-task-btn");

    const editTaskDialog = document.querySelector(".edit-task-dialog");
    const editTaskTitleInput = document.getElementById("edit-task-title");
    const editTaskDueDateInput = document.getElementById("edit-task-due-date");
    const editTaskDescTextarea = document.getElementById("edit-task-desc");
    const editTaskCompletedCheckbox = document.getElementById("edit-task-completed");
    const editTaskProjectSelect = document.getElementById("edit-task-project");
    const editTaskPrioritySelect = document.getElementById("edit-task-priority");

    const subtasksContainer = document.querySelector(".subtasks-container"); 
    const addSubtaskBtn = document.querySelector(".add-subtask-btn");
    const newSubtaskInput = document.querySelector(".new-subtask-input");
    const saveTaskBtn = document.querySelector(".save-task-btn");
    const cancelEditTaskBtn = document.querySelector(".cancel-edit-task-btn");
    let currentEditTask = null;



    
    mainTitle.textContent = project.getTitle();

    // Render the "Add Task" button only once
    mainContainer.innerHTML = `<button type="button" class="add-task-btn">+ Add Task</button>
                               <div class="task-list"></div>`;
    
    const addTaskBtn = document.querySelector(".add-task-btn");
    const taskListContainer = document.querySelector(".task-list");

    // Function to render tasks
    function renderTasks() {
        taskListContainer.innerHTML = ""; // Clear only the task list, not the button
        
        const todoList = project.todos;
        todoList.forEach((todo, index) => {
          // If 'todo.completed' is true, make the checkbox checked and apply line-through
          const isChecked = todo.completed ? "checked" : "";
          const textDecoration = todo.completed ? "line-through" : "none";
      
          taskListContainer.innerHTML += `
            <div class="task-box" data-index="${index}">
              <div class="task-box-left" data-index="${index}">
                <input type="checkbox" 
                       name="task-checkbox" 
                       id="taskcheckbox" 
                       data-index="${index}" 
                       ${isChecked}>
      
                <div class="task-content" data-index="${index}">
                  <h3 class="task-title" data-index="${index}" 
                      style="text-decoration: ${textDecoration}">
                    ${todo.getTitle()}
                  </h3>
                  
                  <div class="task-subdetails" data-index="${index}">
                    <p class="task-duedate" data-index="${index}">
                      Due Date: ${todo.getDueDate()}
                    </p>
                    <svg data-index="${index}" 
                         fill="${todo.getPriority().color}" 
                         class="task-priority" 
                         xmlns="http://www.w3.org/2000/svg" 
                         viewBox="0 0 24 24">
                      <title>flag</title>
                      <path d="M14.4,6L14,4H5V21H7V14H12.6L13,16H20V6H14.4Z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div class="task-box-right" data-index="${index}">
                <svg data-index="${index}" class="edit-task" fill="#F696A9"
                     xmlns="http://www.w3.org/2000/svg" 
                     viewBox="0 0 24 24">
                  <title>edit</title>
                  <path data-index="${index}" class="edit-task" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9
                           17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93
                           L14.06,6.18L3,17.25Z" />
                </svg>
                <svg data-index="${index}" class="delete-task" fill="#F696A9"
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>delete</title>
                  <path class="delete-task" data-index="${index}"
                        d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2
                           0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                </svg>
              </div>
            </div>`;
        });
    }
    function renderSubtasks(task) {
      subtasksContainer.innerHTML = ""; // clear old content
    
      task.subtasks.forEach((subtask, index) => {
        const div = document.createElement("div");
        div.classList.add("subtask-item");
        div.dataset.subtaskIndex = index;
    
        div.innerHTML = `
          <input 
            type="checkbox" 
            class="subtask-complete" 
            data-subtask-index="${index}" 
            ${subtask.completed ? "checked" : ""}
          />
          <span class="subtask-title">${subtask.title}</span>
          <button 
            class="delete-subtask-btn" 
            data-subtask-index="${index}"
          >
            X
          </button>
        `;
        subtasksContainer.appendChild(div);
      });
    }
    

    function openEditTaskDialog(task) {
      currentEditTask = task;
        // 1) Set the input values
        editTaskTitleInput.value = task.title || "";
        editTaskDueDateInput.value = task.dueDate && task.dueDate !== "Not Set" 
          ? task.dueDate 
          : "";
        editTaskDescTextarea.value = task.description || "";
        editTaskCompletedCheckbox.checked = task.completed;
        
        // 2) Populate the project <select>
        //    Clear out existing options, then add one for each project:
        editTaskProjectSelect.innerHTML = "";
        projectsListarr.forEach((projectObj) => {
          const option = document.createElement("option");
          option.value = projectObj.getTitle();  // or some unique project ID
          option.textContent = projectObj.getTitle();
          
          // If this project's title = the task's project, select it
          if (projectObj.getTitle() === task.project) {
            option.selected = true;
          }
          editTaskProjectSelect.appendChild(option);
        });
        
        // 3) Set the priority <select> based on task.priority
        //    (assuming task.priority is a key like "LOW", "MEDIUM", etc.)
        //    If you store priority object or key differently, adjust accordingly.
        if (task.priority) {
          console.log(task.priority)
          // For example, if your priority object has a key: task.priorityKey = "LOW"
          // Make sure your <option> values match "LOW", "MEDIUM", "HIGH", ...
          editTaskPrioritySelect.value = getPriorityKey(task.priority); 
          // or if the priority is directly stored as "LOW"
          // editTaskPrioritySelect.value = task.priority;
        }

        renderSubtasks(task);
        subtasksContainer.addEventListener("click",(e)=>{
          const target=e.target
          const index=target.dataset.index
          if(target.classList.contains("delete-subtask-btn")){
            task.subtasks.splice(index,1)
            renderSubtasks(task)
          }
        })
        
        // 5) Show the dialog
        editTaskDialog.showModal();
      }
      
      // Helper if needed: get the priority key from the priority object
      function getPriorityKey(priorityObj) {
        // Suppose your priority objects look like: { label: "Low Priority", color: "green" }
        // and your PRIORITIES object is { LOW: {...}, MEDIUM: {...}, HIGH: {...} }
        // You can figure out the matching key by comparing objects or labels:
        if (priorityObj.label === "Low Priority") return "LOW";
        if (priorityObj.label === "Medium Priority") return "MEDIUM";
        if (priorityObj.label === "High Priority") return "HIGH";
        return "NONE";
      }
      

    // Initial rendering of tasks
    renderTasks();

    // Open dialog when clicking "Add Task"
    addTaskBtn.addEventListener("click", () => {
        addTaskDialogBox.showModal();
    });
    // Remove previous event listener if it exists
    if (addTaskDialogBtn._addTaskHandler) {
        addTaskDialogBtn.removeEventListener("click", addTaskDialogBtn._addTaskHandler);
    }

    // Define the new handler and attach it to the button for reference
    addTaskDialogBtn._addTaskHandler = () => {
        const taskTitle = addTaskTitleInput.value.trim();
        if (taskTitle !== "") {
            project.addToDo(taskTitle);
            addTaskTitleInput.value = "";
            addTaskDialogBox.close();
            renderTasks();
        }
    };

    addTaskDialogBtn.addEventListener("click", addTaskDialogBtn._addTaskHandler);

    // Cancel adding a task
    cancelTaskDialogBtn.addEventListener("click", () => {
        addTaskDialogBox.close();
    });

    cancelEditTaskBtn.addEventListener("click",()=>{
        editTaskDialog.close()
      })

    taskListContainer.addEventListener("click", (e) => {
        const target = e.target;
        if (target.matches('input[type="checkbox"]')) {
          const index = target.dataset.index;
          const tasktitle = document.querySelector(
            `.task-title[data-index="${index}"]`
          );
          if (tasktitle) {
            if (target.checked) {
              tasktitle.style.textDecoration = 'line-through';
              project.getToDoList()[index].toggleCompleted()
              console.log(project.getToDoList()[index])
            } else {
              tasktitle.style.textDecoration = 'none';
              project.getToDoList()[index].toggleCompleted()
              console.log(project.getToDoList()[index])
            }
          }
        }
        if (target.classList.contains("delete-task") ){
            const index = target.dataset.index;
            project.deleteToDo(index);
            renderTasks()
        }
        if(target.classList.contains("edit-task")){
            const index = target.dataset.index;
            // editTaskDialog.showModal()
            openEditTaskDialog(project.getToDoList()[index])
        }
      });
      addSubtaskBtn.addEventListener("click", () => {
        if (!currentEditTask) return;
        
        const title = newSubtaskInput.value.trim();
        if (!title) return;
      
        // Add subtask to the in-memory data
        currentEditTask.addSubtask(title);
      
        // Clear input field
        newSubtaskInput.value = "";
      
        // Re-render to see new subtask
        renderSubtasks(currentEditTask);
      });
      saveTaskBtn.addEventListener("click", () => {
        if (!currentEditTask) return;
        // const oldProjectTitle = currentEditTask.project;
        // const newProjectTitle = editTaskProjectSelect.value;
      
        // 1) Read new values from the dialog
        const newTitle = editTaskTitleInput.value.trim();
        const newDueDate = editTaskDueDateInput.value;
        const newDesc = editTaskDescTextarea.value.trim();
        const newCompletedStatus = editTaskCompletedCheckbox.checked;
        const newProjectTitle = editTaskProjectSelect.value;
        const newPriorityKey = editTaskPrioritySelect.value; 
        const oldProjectTitle = currentEditTask.project;
        // e.g. "LOW", "MEDIUM", etc.
      
        // 2) Update the Todo object
        //    (assuming your Todo class has setters or direct properties)
        currentEditTask.title = newTitle;
        currentEditTask.dueDate = newDueDate || "Not Set"; 
        currentEditTask.description = newDesc;
        currentEditTask.completed = newCompletedStatus;
        // currentEditTask.changeProject(newProject); 
        currentEditTask.setPriority(newPriorityKey); 

        

  // Get new project from the <select>
  

  // If user changed the project:
          if (oldProjectTitle !== newProjectTitle) {
            // Find the old and new Project objects
            const oldProject = projectsListarr.find((p) => p.getTitle() === oldProjectTitle);
            const newProject = projectsListarr.find((p) => p.getTitle() === newProjectTitle);

            // Remove the task from the old project
            if (oldProject) {
                const oldIndex = oldProject.getToDoList().indexOf(currentEditTask);
                if (oldIndex !== -1) {
                    oldProject.deleteToDo(oldIndex);
                }
            }

            // Add the task to the new project
            if (newProject) {
                newProject.addToDo(currentEditTask.title); // Add a new task with the same title
                const newTask = newProject.getToDoList()[newProject.getToDoList().length - 1];
                // Copy all properties from the old task to the new task
                newTask.description = currentEditTask.description;
                newTask.dueDate = currentEditTask.dueDate;
                newTask.completed = currentEditTask.completed;
                newTask.priority = currentEditTask.priority;
                newTask.subtasks = [...currentEditTask.subtasks]; // Copy subtasks
            }

            // Update the task's project property
            currentEditTask.changeProject(newProjectTitle);
        }
          // or if you store it differently, do the correct method
      
        // 3) Re-render the tasks in the current project 
        //    so the updated values appear in the UI
        const subtaskRows = subtasksContainer.querySelectorAll(".subtask-item");
  // Clear out the old array or keep them if you’re purely appending
        currentEditTask.subtasks = [];

        subtaskRows.forEach((row) => {
          const titleInput = row.querySelector(".subtask-title");
          const completedCheck = row.querySelector(".subtask-complete");
      
          // If you have a Subtask class:
          const newSubtask = new Subtask(titleInput.textContent);
          newSubtask.completed = completedCheck.checked;

          // Push into the currentEditTask's subtask array
          currentEditTask.subtasks.push(newSubtask);
        });
        currentEditTask=null
        renderTasks();
      
        // 4) Close the dialog
        editTaskDialog.close();
      });
      
      
      
      
}

export default projectUI;
