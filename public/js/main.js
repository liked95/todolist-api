

let todos;


const todoLists = document.querySelector(".todo-list")
const addBtn = document.getElementById("btn-add");
const updateBtn = document.getElementById("btn-update");
const cancelBtn = document.getElementById("btn-cancel");
const input = document.getElementById("todo-input")


// API DS cong viec
let getTodos = async () => {
    try {
        let res = await axios.get("/todos")
        todos = res.data
        renderUI(todos)
    } catch (error) {
        console.log(error)
    }
}

function renderUI(arr) {
    todoLists.innerHTML = ""
    if (!arr.length) {
        todoLists.innerHTML = `<p class="todos-empty"> Hiện tại chưa có công việc nào</p>`
        return;
    }

    for (let todo of arr) {
        const newList = document.createElement("div")
        newList.innerHTML = `
        <div class="todo-item ${todo.status ? "active-todo" : ""} ">
            <div class="todo-item-title " >
                <input type="checkbox" ${todo.status ? "checked" : ""} onclick = toggleStatus(${todo.id})>
                <p>${todo.title}</p>
            </div>

            <div class="option">
                <button class="btn btn-update" onclick = updateTodo(${todo.id})>
                    <img src="./img/pencil.svg" alt="icon" />
                </button>
                <button class="btn btn-delete" onclick = deleteTodo(${todo.id})>
                    <img src="./img/remove.svg" alt="icon" />
                </button>
            </div>
        </div>`

        todoLists.append(newList)
    }
}

getTodos()


// Them cong viec
addBtn.addEventListener("click", addNewTodo)

async function addNewTodo() {
    try {
        if (!input.value) {
            alert("Nội dung ko được để trống")
            return;
        }

        let newTodo = {
            title: input.value,
            status: false,
        }

        let res = await axios.post("/todos", newTodo)

        // them cv moi vao mang
        todos.push(res.data)

        renderUI(todos)
    } catch (error) {
        console.log(error)
    }

    input.value = ""
}


// addBtn.addEventListener("click", () => {
//     addNewTodo()
// })

// input.addEventListener("keydown", (e) => {
//     if (e.keyCode === 13) {
//         addNewTodo()
//     }
// })


const toggleStatus = async (id) => {

    try {
        let todo = todos.find(todo => todo.id == id)
        todo.status = !todo.status
        await axios.put(`/todos/${id}`, todo)
        renderUI(todos)
    } catch (error) {
        console.log(error)
    }
}

const deleteTodo = async (id) => {
    try {
        // Xoa tren server database
        await axios.delete(`/todos/${id}`)
        // Xoa tren mang trong js
        todos = todos.filter(todo => todo.id != id)
        renderUI(todos)
    } catch (error) {
        console.log(error)
    }
}


