// First event listener:
// HTML elements must be loaded first so this can work, interaction with mongoDB justifies this maybe
document.addEventListener('DOMContentLoaded', () => {
    const taskTitleInput = document.getElementById('taskTitle')
    const taskDescriptionInput = document.getElementById('taskDescription')
    const addTaskBtn = document.getElementById('addTaskBtn')
    const taskList = document.getElementById('taskList')
    const errorMessage = document.getElementById('errorMessage') // Add this line

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
        const tBody = document.createElement('tbody')
        tasks.forEach(task => {
            const taskItem = document.createElement('tr')
            taskItem.innerHTML = `
                
                    <td><span class="task-title">${task.title}</span>:</td>
                    <td><span class="task-description">${task.description}</span></td>
                    <td><button class="completeBtn" disabled>${task.status ? '✔' : '✖'}</button></td>
                    <td>
                        <button class="editBtn">Edit</button>
                        <button class="deleteBtn">Delete</button>
                    </td>
                
            `
            tBody.appendChild(taskItem)
            taskList.appendChild(tBody)


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
                displayError('')
            } else {
                const errorText = await response.text()
                console.error('Error adding:', errorText)
                displayError('Error adding task: ' + errorText)
            }
        } catch (error) {
            console.error('Error adding:', error)
            displayError('Error adding task: ' + error.message)
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
                displayError('')
            } else {
                console.error('updating not possible at the moment:', response.statusText)
                const errorText = await response.text()
                displayError('Error updating task: ' + errorText)
            }
        } catch (error) {
            console.error('nope update not working:', error)
            displayError('Error updating task: ' + error.message)
        }
    }

    // allow edit
    async function allowEdit(taskItem, id) {
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
            const title = titleElement.textContent.trim();
            const description = descriptionElement.textContent.trim();
        
            // Client-side validation because validation is not working for update in the same way 
            // due to it happenning in different stages allow edit, savechanges and changeStatus i think
            if (title.length < 3 || description.length < 3) {
                displayError('Title and description must be at least 3 characters long.');
            return;
            }

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
                displayError('')
            } else {
                console.error('update not working:', response.statusText)
                const errorText = await response.text()
                displayError('Error update task: ' + errorText)
            }
        } catch (error) {
            console.error('update is not working:', error)
            displayError('Error updating task: ' + error.message)
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
                displayError('')
            } else {
                console.error('Deleting not possible:', response.statusText)
                const errorText = await response.text()
                displayError('Error deleting task: ' + errorText)
            }
        } catch (error) {
            console.error('Deleting not possible:', error)
            displayError('Error delete task: ' + error.message)
        }
    }

    function displayError(message) {
        const errorMessage = document.getElementById('errorMessage');
        
        // If no message make it
        if (!errorMessage) {
            const errorElement = document.createElement('div');
            errorElement.id = 'errorMessage'
            errorElement.style.color = 'red'
            errorElement.textContent = message
            document.body.appendChild(errorElement)
        } else {
            // Update error 
            errorMessage.textContent = message
        }
    }

    addTaskBtn.addEventListener('click', addTask)
    fetchTasks()
})
