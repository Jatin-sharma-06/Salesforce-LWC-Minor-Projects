import { LightningElement } from 'lwc';

export default class TaskList extends LightningElement {
    taskInput = '';
    tasks = [];
    counter = 1;

    handleChange(event) {
        this.taskInput = event.target.value;
    }

    addTask() {
        console.log('Adding task...');
        if (!this.taskInput) return;

        const newTask = {
            id: this.counter++,
            name: this.taskInput,
            completed: false
        };

        this.tasks = [...this.tasks, newTask];
        this.taskInput = '';

        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        console.log(JSON.stringify(this.tasks));
        console.log(this.tasks);
    }

    deleteTask(event) {
        const id = event.target.dataset.id;

        this.tasks = this.tasks.filter(task => task.id != id);

        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    toggleTask(event) {
        const id = event.target.dataset.id;

        this.tasks = this.tasks.map(task => {
            if (task.id == id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });

        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    //  Getter for computed values (fix for class issue)
    get computedTasks() {
        return this.tasks.map(task => {
            return {
                ...task,
                className: task.completed ? 'completed' : ''
            };
        });
    }


    connectedCallback() {
    const storedTasks = localStorage.getItem('tasks');

    if (storedTasks) {
        this.tasks = JSON.parse(storedTasks);
        this.counter = this.tasks.length + 1;
    }
}
}