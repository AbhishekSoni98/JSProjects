let addButton = document.getElementById('addButton');
let input = document.getElementById('input');
let todoUList = document.getElementById('todoUList');
let todo;

let localData = JSON.parse(localStorage.getItem("todo"));
let todoList = localData || [];

/** Creating function to get unique id */
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (param) {
        let number = Math.random() * 16 | 0;
        let randomNumber = param == 'x' ? number : (number & 0x3 | 0x8);
        return randomNumber.toString(16);
    });
}

addButton.addEventListener("click", (e) => {
    e.preventDefault();
    todo = input.value;
    if (todo.length > 0) {
        todoList.push({id: uuid(), todo, isCompleted: false})
    }
    localStorage.setItem("todo", JSON.stringify(todoList));
    input.value = '';
    renderTodoList();
});

function renderTodoList() {
    let iH = ''
    todoList.forEach(({id, todo, isCompleted}) => {
        iH +=  `
            <li class="list-group-item" data-key=${id}>
                <input class="form-check-input mt-2" id="item-${id}" type="checkbox"  ${isCompleted ? "checked": ""}>
                    <label for="item-${id}" class="todo todo-text t-pointer ${isCompleted ? "checked-todo" : ""}" data-key=${id}> &nbsp; ${todo}</label>
                    <button type="button" class="btn btn-dark" data-todokey=${id}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16" data-todokey=${id}>
                            <path data-todokey=${id} d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                            <path data-todokey=${id} d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                        </svg>
                    </button>
            </li>`
    });
    todoUList.innerHTML = iH;
}

todoUList.addEventListener("click", (e) => {
    let key = e.target.dataset.key;
    let delTodokey = e.target.dataset.todokey
    todoList = todoList.map(todo => todo.id === key ? {...todo, isCompleted: !todo.isCompleted} : todo);
    todoList = todoList.filter(todo => todo.id !== delTodokey);
    localStorage.setItem("todo", JSON.stringify(todoList));
    renderTodoList(todoList);
})