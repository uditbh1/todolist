// import projectsListarr from "..";
export default function completedUI(projectsListarr){
    const mainContainer = document.querySelector(".main-container");
    const mainTitle = document.querySelector(".main-title");

    mainTitle.textContent="Completed Tasks"
    mainContainer.innerHTML=`<div class="task-box">
                <div class="task-box-left">
                    <div class="task-content">
                    </div>
                </div>
            </div>`
    const taskBox=document.querySelector(".task-content")
    if (projectsListarr.length>0){
        projectsListarr.forEach((project,index)=>{
            project.todos.forEach((todo,idx)=>{
                if ( todo && todo.completed===true){
                    taskBox.innerHTML+=`<h3 class="task-title">${todo.title}</h3>
                            <div class="task-subdetails">
                                <p class="task-duedate">Due Date: ${todo.dueDate}</p>
                                <p class="task-project">Project: ${todo.project}</p>
                            </div>`
                }
            })
        })
    }
    else{
        taskBox.innerHTML+="<h3>0 Tasks</h3>"
    }
}
// export default completedUI;