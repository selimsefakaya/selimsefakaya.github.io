
// TODO PROJECT



const form = document.querySelector('form');
const input = document.querySelector('input');
const btnAdd = document.querySelector("#addButton");
const btnDeleteAll = document.querySelector("#btn-delete-all");
const taskList = document.querySelector("#task-list-ul");
const deletedList = document.querySelector("#removed-tasks-ul");
const btnClearDeleted = document.querySelector("#btn-clear-deleted");
const btnClearDone = document.querySelector("#btn-clear-done");
const btnDone = document.querySelector(".done");
const doneList = document.querySelector("#done-tasks-ul");
const infoBox = $("#infoBody");

let todos;
let todosDel;
let todosDone;


// Load tasks
loadItems();
eventListeners();

function eventListeners() {
    // Submit event
    form.addEventListener("submit", addNewItem);        //submit işlemi yapılınca(enter veya butona tıklanarak -button taginde type submit yapıldı-), addNewItem function çalıştır.
    // Delete event
    taskList.addEventListener("click", deleteItem);     //tek tek eleman silme işlemini gerçekleştirir.
    // Delete all event
    btnDeleteAll.addEventListener("click", deleteAll);
    // Clear deleted list event
    btnClearDeleted.addEventListener("click", clearDeleted);
    // Restore deleted task
    deletedList.addEventListener("click", restoreDeletedTask);
    // Delete deleted task
    deletedList.addEventListener("click", deleteDeletedTask);
    // Done event
    taskList.addEventListener("click", doneTask);
    // Delete done task
    doneList.addEventListener("click", deleteDone)
    // Clear done list
    btnClearDone.addEventListener("click", clearDone);

}


function loadItems() {
    todos = getItemsFromLS();
    todos.forEach(function (item) {
        createItem(item);
    });
    todosDel = getItemsFromDeletedLS();
    todosDel = todosDel.reverse();
    todosDel.forEach(function (old) {
        loadDeleted(old);
    })
    todosDone = getItemsFromDoneLS();
    todosDone = todosDone.reverse();
    todosDone.forEach(function (done) {
        loadDone(done);
    })
}


// Get items from local storage
function getItemsFromLS() {
    if (localStorage.getItem("todos") === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}


function getItemsFromDoneLS() {
    if (localStorage.getItem("todosDone") === null) {
        todosDone = [];
    }
    else {
        todosDone = JSON.parse(localStorage.getItem("todosDone"));
    }
    return todosDone;
}


function setItemToDoneLS(doneTodo) {
    todosDone = getItemsFromDoneLS();
    todosDone.unshift(doneTodo);
    let count = 0;
    todosDone.forEach(function (item) {
        count += 1;
        return count;
    });
    console.log(count)
    console.log(todosDone)
    if (count > 14) {
        for (let i = count - 1; i >= 15; i--) {
            todosDone.splice(i, 1);
        }
    }
    localStorage.setItem("todosDone", JSON.stringify(todosDone));
}


// Set item to local storage
function setItemToLS(newTodo) {
    todos = getItemsFromLS();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function clearLS() {
    todos = [];
    localStorage.setItem("todos", JSON.stringify(todos));
}


function clearDeletedLS() {
    todosDel = [];
    localStorage.setItem("todosDel", JSON.stringify(todosDel));
}


function clearDoneLS() {
    todosDone = [];
    localStorage.setItem("todosDone", JSON.stringify(todosDone));
}


function restoreItemToLS(newTodo) {
    todos = getItemsFromLS();
    todos.unshift(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function setItemToDeletedLS(oldTodo) {
    todosDel = getItemsFromDeletedLS();
    todosDel.unshift(oldTodo);
    let count = 0;
    todosDel.forEach(function (item) {
        count += 1;
        return count;
    });
    console.log(count)
    console.log(todosDel)
    if (count > 19) {
        for (let i = count - 1; i >= 20; i--) {
            todosDel.splice(i, 1);
        }
    }
    localStorage.setItem("todosDel", JSON.stringify(todosDel));
}


function createItem(newTodo) {
    // -li oluşturmak-
    const li = document.createElement('li');
    li.classList = "task-li";
    // li içinde a oluşturmak
    const a = document.createElement("a");
    a.classList = "delete-task";
    a.setAttribute("href", "#");
    a.innerHTML = `<span class="material-symbols-outlined delete">remove</span>`;
    const divTask = document.createElement("div");
    divTask.classList = "task-box";
    //done için a
    const aDone = document.createElement("a");
    aDone.classList = "done-task";
    aDone.setAttribute("href", "#");
    aDone.innerHTML = `<span class="material-symbols-outlined done">done</span>`;
    const divADone = document.createElement("div");
    divADone.className = "task-done-box";
    divADone.appendChild(aDone);
    // task name girmek
    const h4 = document.createElement("h4");
    h4.innerHTML = newTodo;
    divTask.appendChild(h4);
    // delete için div oluşturmak
    const divDelete = document.createElement("div");
    divDelete.classList = "task-delete-box";
    const divButton = document.createElement("div");
    divDelete.appendChild(a);
    divButton.className = "task-btns";
    li.appendChild(divTask);
    divButton.appendChild(divDelete);
    divButton.appendChild(divADone);
    li.appendChild(divButton)
    taskList.insertBefore(li, taskList.children[0]);
}


function addNewItem(e) {
    if (input.value === ``) {
        alert("Please fill the new task box!");
    }
    else {
        createItem(input.value);
        setItemToLS(input.value);
        input.value = "";
    }

    e.preventDefault();         //sayfayı yenilemeyi önledi.
}


function deleteItem(e) {
    const task = e.target.parentElement.parentElement.parentElement.parentElement;
    taskContent = task.children[0].children[0].textContent;

    if (e.target.className === "material-symbols-outlined delete") {
        createDeletedTask(task);
        task.remove();
        // Silinecek elemanın içerik adı, storage'da kayıtlı olduğu için bunu çekmek gerekir:
        deleteTodoFromLS(e.target.parentElement.parentElement.parentElement.parentElement.children[0].textContent);
    }
    e.preventDefault();
}


function createDeletedTask(task) {
    const delTask = document.createElement("li");
    delTask.className = "removed-li";
    delTask.innerHTML = task.children[0].outerHTML;
    const divButton = document.createElement("div");
    divButton.className = "task-btns"
    const divRestore = document.createElement("div");
    divRestore.className = "task-delete-box";
    divRestore.innerHTML = `<a href="#" class="delete-task">
                                <span class="material-symbols-outlined restore">keyboard_double_arrow_up</span>
                            </a>`
    const divDel = document.createElement("div");
    divDel.className = "task-delete-box"
    divDel.innerHTML = `<a href="#" class="delete-task">
                            <span class="material-symbols-outlined delete">close</span>
                        </a>`
    divButton.appendChild(divDel);
    divButton.appendChild(divRestore);
    delTask.appendChild(divButton);
    deletedList.insertBefore(delTask, deletedList.children[0]);
    setItemToDeletedLS(taskContent);
}

function loadDeleted(task) {
    const delTask = document.createElement("li");
    delTask.className = "removed-li";
    const divTask = document.createElement("div");
    divTask.className = "task-box"
    const h4 = document.createElement("h4");
    h4.innerHTML = task;
    divTask.appendChild(h4);
    const divButton = document.createElement("div");
    divButton.className = "task-btns"
    const divRestore = document.createElement("div");
    divRestore.className = "task-delete-box";
    divRestore.innerHTML = `<a href="#" class="delete-task">
                                <span class="material-symbols-outlined restore">keyboard_double_arrow_up</span>
                            </a>`
    const divDel = document.createElement("div");
    divDel.className = "task-delete-box";
    divDel.innerHTML = `<a href="#" class="delete-task">
                            <span class="material-symbols-outlined delete">close</span>
                        </a>`
    delTask.appendChild(divTask);
    divButton.appendChild(divDel);
    divButton.appendChild(divRestore);
    delTask.appendChild(divButton);
    deletedList.insertBefore(delTask, deletedList.children[0]);
}


function loadDone(task) {
    const doneTask = document.createElement("li");
    doneTask.className = "done-li";
    const divTask = document.createElement("div");
    divTask.className = "task-box"
    const h4 = document.createElement("h4");
    h4.innerHTML = task;
    divTask.appendChild(h4);
    const divRestore = document.createElement("div");
    divRestore.className = "task-done-box";
    divRestore.innerHTML = `<a href="#" class="delete-task">
                                        <span class="material-symbols-outlined delete">close</span>
                                    </a>`
    doneTask.appendChild(divTask);
    doneTask.appendChild(divRestore);
    doneList.insertBefore(doneTask, doneList.children[0]);
}


function deleteTodoFromDeletedLS(restoreTodo) {
    let todosDel = getItemsFromDeletedLS();
    let count = 0;
    todosDel.forEach(function (todo, index) {
        if (todo === restoreTodo && count === 0) {
            count += 1;
            todosDel.splice(index, 1);
        }
    });
    localStorage.setItem("todosDel", JSON.stringify(todosDel));
}


function deleteTodoFromLS(deleteTodo) {
    let todos = getItemsFromLS();
    let count = 0;
    todos.forEach(function (todo, index) {
        if (todo === deleteTodo && count === 0) {
            count += 1;
            todos.splice(index, 1);   //bulunduğu indexten itibaren bir tanesini siler.
        }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function deleteTodoFromDoneLS(deleteTodo) {
    let todosDone = getItemsFromDoneLS();
    let count = 0;
    todosDone.forEach(function (todo, index) {
        if (todo === deleteTodo && count === 0) {
            count += 1;
            console.log(deleteTodo)
            todosDone.splice(index, 1);
        };
    });
    localStorage.setItem("todosDone", JSON.stringify(todosDone));
}


function deleteAll(e) {

    if (confirm(`Warning!\nAre you sure you want to delete all tasks?`)) {
        const allTasks = e.target.parentElement;
        let confirm10 = true;
        if (taskList.children.length > 20) {
            confirm10 = confirm("The deleted list can hold up to 20 tasks. Are you sure you want to continue?");
        }

        if (confirm10) {
            // for (let i = taskList.children.length; i > 0; i--) {

            //     const delAllTask = document.createElement("li");
            //     delAllTask.className = "removed-li";
            //     delAllTask.innerHTML = taskList.children[i - 1].children[0].outerHTML;
            //     const divRestore = document.createElement("div");
            //     divRestore.className = "task-delete-box";
            //     divRestore.innerHTML = `<a href="#" class="delete-task">
            //                                 <span class="material-symbols-outlined">
            //                                     keyboard_double_arrow_up
            //                                 </span>
            //                             </a>`
            //     delAllTask.appendChild(divRestore);
            //     deletedList.insertBefore(delAllTask, deletedList.children[0]);

            //     taskList.children[i - 1].remove();
            // }

            // or
            // sıkıntılı çalışıyor, eleman ekledikten sonra hepsini silmiyor. 
            // taskList.childNodes.forEach(function (item){
            //     if (item.nodeType === 1){
            //         item.remove();
            //     }
            // });

            //or

            // taskList.innerHTML=""

            //or

            while (taskList.lastChild) {
                const delAllTask = document.createElement("li");
                delAllTask.className = "removed-li";
                delAllTask.innerHTML = taskList.lastChild.children[0].outerHTML;
                const divRestore = document.createElement("div");
                divRestore.className = "task-delete-box";
                divRestore.innerHTML = `<a href="#" class="delete-task">
                                            <span class="material-symbols-outlined">keyboard_double_arrow_up</span>
                                        </a>`
                const divDel = document.createElement("div");
                divDel.className = "task-delete-box";
                divDel.innerHTML = `<a href="#" class="delete-task">
                                        <span class="material-symbols-outlined delete">close</span>
                                    </a>`
                delAllTask.appendChild(divDel);
                delAllTask.appendChild(divRestore);
                deletedList.insertBefore(delAllTask, deletedList.children[0]);
                setItemToDeletedLS(taskList.lastChild.children[0].textContent);
                taskList.removeChild(taskList.children[taskList.children.length - 1]);
            }



            clearLS();

            e.preventDefault();
        }

        // let count = 0;
        // deletedList.childNodes.forEach(function (item) {
        //     if (item.nodeType === 1) {
        //         count += 1;
        //     }
        // });

        // if (count > 10) {
        //     for (let i = count - 1; i >= 10; i--) {
        //         deletedList.children[i].remove();
        //     }
        // }
    }
}


function clearDeleted(e) {
    if (confirm("Warning!\nAre you sure want to clear Deleted Tasks List?")) {
        for (let k = deletedList.children.length; k > 0; k--) {
            deletedList.children[k - 1].remove();
        }
        clearDeletedLS();
    }
}

function clearDone(e) {
    if (confirm("Warning!\nAre you sure want to clear Completed Tasks List?")) {
        for (let k = doneList.children.length; k > 0; k--) {
            doneList.children[k - 1].remove();
        }
        clearDoneLS();
    }
}


function restoreDeletedTask(e) {
    const task = e.target.parentElement.parentElement.parentElement.parentElement;
    taskContent = task.children[0].children[0].textContent;

    if (e.target.className === "material-symbols-outlined restore") {
        const restTask = document.createElement("li");
        restTask.className = "task-li";
        restTask.innerHTML = task.children[0].outerHTML;
        restoreItemToLS(restTask.textContent);
        // createItem(taskContent);
        task.remove();
        e.preventDefault();
        const a = document.createElement("a");
        a.classList = "delete-task";
        a.setAttribute("href", "#");
        a.innerHTML = `<span class="material-symbols-outlined delete">remove</span>`;
        const divDelete = document.createElement("div");
        divDelete.classList = "task-delete-box";
        divDelete.appendChild(a);
        const aDone = document.createElement("a");
        aDone.classList = "done-task";
        aDone.setAttribute("href", "#");
        aDone.innerHTML = `<span class="material-symbols-outlined done">done</span>`;
        const divADone = document.createElement("div");
        divADone.className = "task-done-box";
        divADone.appendChild(aDone);
        restTask.appendChild(divDelete);
        restTask.appendChild(divADone);
        taskList.appendChild(restTask);
        deleteTodoFromDeletedLS(taskContent);
    }

}

function deleteDeletedTask(e) {
    const task = e.target.parentElement.parentElement.parentElement.parentElement;
    taskContent = task.children[0].children[0].textContent;
    if (e.target.className === "material-symbols-outlined delete") {
        if (confirm("Are you sure you want to delete completely this task?")) {
            task.remove();
            deleteTodoFromDeletedLS(taskContent);
        }
    }
    e.preventDefault();
}


function getItemsFromDeletedLS() {
    if (localStorage.getItem("todosDel") === null) {
        todosDel = [];
    }
    else {
        todosDel = JSON.parse(localStorage.getItem("todosDel"));
    }
    return todosDel;
}


function doneTask(e) {
    const task = e.target.parentElement.parentElement.parentElement.parentElement;
    taskContent = task.children[0].children[0].textContent;

    if (e.target.className === "material-symbols-outlined done") {
        if (confirm("Congratz!\nYou have completed the task. Are you sure you want to remove it from the list?")) {
            createDoneTask(task);
            task.remove();
            // Silinecek elemanın içerik adı, storage'da kayıtlı olduğu için bunu çekmek gerekir:
            deleteTodoFromLS(e.target.parentElement.parentElement.parentElement.parentElement.children[0].textContent);
        }
    }
    e.preventDefault();
}


function createDoneTask(task) {
    const delTask = document.createElement("li");
    delTask.className = "done-li";
    delTask.innerHTML = task.children[0].outerHTML;
    const divRestore = document.createElement("div");
    divRestore.className = "task-delete-box";
    divRestore.innerHTML = `<a href="#" class="delete-task"><span class="material-symbols-outlined delete">close</span></a>`
    delTask.appendChild(divRestore);
    doneList.insertBefore(delTask, doneList.children[0]);
    setItemToDoneLS(taskContent);
}


function deleteDone(e) {
    if (e.target.className === "material-symbols-outlined delete") {
        const task = e.target.parentElement.parentElement.parentElement;
        const taskContent = task.children[0].children[0].textContent;
        task.remove();
        deleteTodoFromDoneLS(taskContent);
    }
}


$("#in-hover-hid").click(function () {
    infoBox.fadeTo(200, 1);

    $("#iconInfo").removeClass("iconHover");
    $("#iconInfo").css("background-color", "white");
    $("#iconInfo").css("color", "rgb(108,5,50");
    $("#textInfo").css("fontSize", "1rem");

    $("#infoBox").animate(
        {
            width: "400px",
            height: "220px",
            top: "50%",
            left: "50%",
        },
        400
    );


});

$("#close-info").click(function (e) {
    e.preventDefault();
    closeInfoBox();
});

$(infoBox).click(function (event) {
    if (event.target.className === "dont") { }
    else {
        closeInfoBox();
    }
});


$(document).on("keydown", function (event) {
    if (event.key === "Escape") { closeInfoBox() };
})

function closeInfoBox(e) {
    $("#textInfo").css("fontSize", "0");
    $("#infoBox").animate(
        {
            width: "0",
            height: "0",
            top: "4%",
            left: "105%",
        }, 400

    )
    infoBox.fadeOut(400);
    $(".fa-circle-info").css("color", "white");
    $(".fa-circle-info").css("backgroundColor", "orange");

    $(".fa-circle-info").addClass("iconHover");
}


$("#in-hover-hid").mouseover(function () {
    $(".iconHover").css("color", "orange"),
        $(".iconHover").css("backgroundColor", "white")
});
$("#in-hover-hid").mouseleave(function () {
    $(".iconHover").css("color", "white"),
        $(".iconHover").css("backgroundColor", "orange")
});
