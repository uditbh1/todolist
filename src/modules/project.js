import Todo from "./todo"
export default class Project{
    constructor(title){
        this.title=title
        this.todos=[]
        this.completed=false
    }
    getTitle(){
        return this.title
    }
    editProjectTitle(title){
        this.title=title
        this.todos.forEach((todo) => {
            // Each Todo should have a method to change its project
            // e.g., todo.changeProject(newTitle);
            todo.changeProject(title);
        });

    }
    markCompleted(){
        this.completed=true
        if (this.todos.length>0){
            this.todos.forEach((todo,index)=>{
                todo.markCompleted()
            })
        }
    }
    addToDo(toDoTitle){
        const toDo=new Todo(toDoTitle,this.title)
        this.todos.push(toDo)
    }
    deleteToDo(index) {
        if (index >= 0 && index < this.todos.length) {
          this.todos.splice(index, 1);
        } else {
          console.error("Todo not found at index:", index);
        }
    }
    getToDoList(){
        return this.todos;
    }
}