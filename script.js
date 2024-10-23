const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const showCompletedBtn = document.getElementById('showCompleted');
const completedTasks = document.getElementById('completedTasks');
const completedList = document.getElementById('completedList');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${task.text}</span>
        <div>
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <button class="delete-btn">Delete</button>
        </div>
    `;
    
    if (task.completed) {
        li.classList.add('completed');
    }

    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        li.classList.toggle('completed');
        saveTasks();
        updateCompletedTasks();
    });

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        gsap.to(li, {
            opacity: 0,
            x: -100,
            duration: 0.3,
            onComplete: () => {
                const index = tasks.indexOf(task);
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
                updateCompletedTasks();
            }
        });
    });

    return li;
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = createTaskElement(task);
        taskList.appendChild(li);
        gsap.from(li, { opacity: 0, y: -20, duration: 0.3 });
    });
}

function addTask() {
    const text = taskInput.value.trim();
    if (text) {
        const newTask = { text, completed: false, date: new Date() };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }
}

function updateCompletedTasks() {
    completedList.innerHTML = '';
    const today = new Date().toDateString();
    const completedToday = tasks.filter(task => 
        task.completed && new Date(task.date).toDateString() === today
    );

    completedToday.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;
        completedList.appendChild(li);
    });
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

showCompletedBtn.addEventListener('click', () => {
    completedTasks.classList.toggle('hidden');
    updateCompletedTasks();
    
    if (completedTasks.classList.contains('hidden')) {
        showCompletedBtn.textContent = 'Show Completed Tasks';
        gsap.to(completedTasks, { opacity: 0, y: -20, duration: 0.3, onComplete: () => {
            completedTasks.style.display = 'none';
        }});
    } else {
        showCompletedBtn.textContent = 'Hide Completed Tasks';
        completedTasks.style.display = 'block';
        gsap.from(completedTasks, { opacity: 0, y: -20, duration: 0.3 });
    }
});

renderTasks();
updateCompletedTasks();