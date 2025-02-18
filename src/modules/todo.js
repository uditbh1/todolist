import Subtask from "./subtask";
import { PRIORITIES } from "./priority-constants";

export default class Todo{
    constructor(title,projectTitle){
        this.title=title;
        this.description="";
        this.dueDate="Not Set";
        this.subtasks=[];
        this.completed=false;
        this.project=projectTitle
        this.priority=PRIORITIES.NONE
    }
    getTitle(){
        return this.title
    }
    getDueDate(){
        return this.dueDate
    }
    getPriority(){
        return this.priority
    }
    changeTitle(title){
        this.title=title
    }
    addDescription(description){
        this.description=description
    }
    addDueDate(dueDate){
        this.dueDate=dueDate
    }
    removeDueDate(){
        this.dueDate=""
    }
    addSubtask(subTaskTitle){
        const subtask=new Subtask(subTaskTitle)
        this.subtasks.push(subtask)
    }
    deleteSubtask(index){
        if (index >= 0 && index < this.todos.length) {
            this.subtasks.splice(index, 1);
          } else {
            console.error("Subtask not found at index:", index);
        }
    }
    markCompleted(){
        this.completed=true
    }
    toggleCompleted(){
        if (this.completed===true){
            this.completed=false
        }
        else{
            this.completed=true
        }
    }
    changeProject(projectTitle){
        this.project=projectTitle
    }
    setPriority(priorityKey) {
        if (PRIORITIES[priorityKey]) {
          this.priority = PRIORITIES[priorityKey];
        } else {
          console.error(`Invalid priority key: ${priorityKey}`);
        }
    }
    
    
}