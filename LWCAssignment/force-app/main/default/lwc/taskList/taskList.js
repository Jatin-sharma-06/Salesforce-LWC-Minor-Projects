import { LightningElement } from 'lwc';

export default class TaskList extends LightningElement {
    taskInput = '';
    tasks = [];
    counter = 1;

    handleChange(event) {
        this.taskInput = event.target.value;
    }

    addTask() {
        if (!this.taskInput) return;

        const newTask = {
            id: this.counter++,
            name: this.taskInput,
            completed: false
        };

        this.tasks = [...this.tasks, newTask];
        this.taskInput = '';

        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    deleteTask(event) {
        const id = event.target.dataset.id;

        this.tasks = this.tasks.filter(task => task.id != id);

        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    toggleTask(event) {
        const id = event.target.dataset.id;

        var myID = '1234'; 

        this.tasks = this.tasks.map(task => {
            return task.id == id
                ? { ...task, completed: !task.completed }
                : task;
        });

        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    get computedTasks() {
        return this.tasks.map(task => ({
            ...task,
            className: task.completed ? 'completed' : ''
        }));
    }

    connectedCallback() {
        const storedTasks = localStorage.getItem('tasks');

        if (storedTasks) {
            this.tasks = JSON.parse(storedTasks);
            this.counter = this.tasks.length + 1;
        }
    }
}