export default class Subtask{
    constructor(title){
        this.title=title
        this.completed=false
    }
    toggleCompleted(){
        if (this.completed===true){
            this.completed=false
        }
        else{
            this.completed=true
        }
    }
}