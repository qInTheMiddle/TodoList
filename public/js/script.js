// First event listener:
// HTML elements must be loaded first so this can work, interaction with mongoDB justifies this maybe
document.addEventListener('DOMContentLoaded', () => {
    const taskTitleInput = document.getElementById('taskTitle')
    const taskDescriptionInput = document.getElementById('taskDescription')
    const addTaskBtn = document.getElementById('addTaskBtn')
    const taskList = document.getElementById('taskList')

    // Fetch tasks
    async function fetchTasks() {
        try {
            const response = await fetch('/tasks')
            const tasks = await response.json()
            displayTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error)
        }
    }

    // Display tasks 
    function displayTasks(tasks) {
        taskList.innerHTML = `
            <thead>
                <tr>
                    <th>Task Title</th>
                    <th>Task Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
        `
        tasks.forEach(task => {
            const taskItem = document.createElement('tr')
            taskItem.innerHTML = `
            <tbody>
                <tr>
                    <td><span class="task-title">${task.title}</span>:</td>
                    <td><span class="task-description">${task.description}</span></td>
                    <td><button class="completeBtn" disabled>${task.status ? '✔' : '✖'}</button></td>
                    <td>
                        <button class="editBtn">Edit</button>
                        <button class="deleteBtn">Delete</button>
                    </td>
                </tr>
            </tbody>
            `
            taskList.appendChild(taskItem)

            // Event listeners of edit, delete and complete 
            const completeBtn = taskItem.querySelector('.completeBtn')
            completeBtn.addEventListener('click', () => {
                if (completeBtn.disabled === false) {
                    changeStatus(task._id, task.status)
                }
            })

            const editBtn = taskItem.querySelector('.editBtn');
            editBtn.addEventListener('click', () => allowEdit(taskItem, task._id))

            const deleteBtn = taskItem.querySelector('.deleteBtn')
            deleteBtn.addEventListener('click', () => deleteTask(task._id))
        });
    }

    // Add task
    async function addTask() {
        const newTask = {
            title: taskTitleInput.value,
            description: taskDescriptionInput.value,
            status: false
        }

        

        try {
            const response = await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask)
            })

            if (response.ok) {
                fetchTasks()  
            } else {
                console.error('Error adding:', response.statusText)
            }
        } catch (error) {
            console.error('Error adding:', error)
        }
    }

    // change status
    async function changeStatus(id, currentStatus) {
        try {
            const response = await fetch(`/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: !currentStatus }),
            })
            if (response.ok) { 
                
                fetchTasks()
            } else {
                console.error('updating not possible at the moment:', response.statusText)
            }
        } catch (error) {
            console.error('nope update not working:', error)
        }
    }

    // allow edit
    function allowEdit(taskItem, id) {
        const editBtn = taskItem.querySelector('.editBtn')
        const titleElement = taskItem.querySelector('.task-title')
        const descriptionElement = taskItem.querySelector('.task-description')
        const completeBtn = taskItem.querySelector('.completeBtn')
        
        if (editBtn.textContent === 'Edit') {
            titleElement.setAttribute('contenteditable', 'true')
            descriptionElement.setAttribute('contenteditable', 'true')
            completeBtn.disabled = false
            titleElement.focus()
            editBtn.textContent = 'Save'
        } else {
            titleElement.setAttribute('contenteditable', 'false')
            descriptionElement.setAttribute('contenteditable', 'false')
            completeBtn.disabled = true
            editBtn.textContent = 'Edit'

            const updatedTask = {
                title: titleElement.textContent,
                description: descriptionElement.textContent,
                status: completeBtn.textContent === '✔'
            }

            saveTask(id, updatedTask);
        }
    }

     // Save changes
        async function saveTask(id, updatedTask) {
        try {
            const response = await fetch(`/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedTask)
            })

            if (response.ok) {
                fetchTasks()  
            } else {
                console.error('update not working:', response.statusText)
            }
        } catch (error) {
            console.error('update is not working:', error)
        }
    }

    // Delete task
    async function deleteTask(id) {
        try {
            const response = await fetch(`/tasks/${id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                fetchTasks() 
            } else {
                console.error('Deleting not possible:', response.statusText)
            }
        } catch (error) {
            console.error('Deleting not possible:', error)
        }
    }

    addTaskBtn.addEventListener('click', addTask)
    fetchTasks()
})