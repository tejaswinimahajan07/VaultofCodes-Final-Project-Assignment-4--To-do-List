let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

window.onload = () => {
  renderTasks();
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
};

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

function addTask() {
  const input = document.getElementById("task-input");
  const priority = document.getElementById("priority").value;
  const dueDate = document.getElementById("due-date").value;

  if (!input.value.trim()) return;

  tasks.push({
    text: input.value,
    completed: false,
    priority,
    dueDate
  });

  input.value = "";
  document.getElementById("due-date").value = "";

  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText;
    saveTasks();
    renderTasks();
  }
}

function renderTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `priority-${task.priority} ${task.completed ? "completed" : ""}`;

    const main = document.createElement("div");
    main.className = "task-main";

    // ✅ Completion checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.className = "complete-checkbox";
    checkbox.onchange = () => toggleComplete(index);

    // ✅ Task Text
    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = "task-text";

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.alignItems = "center";
    left.style.gap = "10px";
    left.appendChild(checkbox);
    left.appendChild(span);

    const actions = document.createElement("div");
    actions.className = "actions";
    actions.innerHTML = `
      <button onclick="editTask(${index})"><i class="fas fa-edit"></i> Edit</button>
      <button onclick="deleteTask(${index})"><i class="fas fa-trash"></i> Delete</button>
    `;

    main.appendChild(left);
    main.appendChild(actions);

    const extra = document.createElement("div");
    extra.className = "extra";
    if (task.dueDate) {
      const countdown = getCountdown(task.dueDate);
      extra.innerHTML = `<small>📅 Due: ${task.dueDate} (${countdown})</small>`;
    }

    li.appendChild(main);
    if (task.dueDate) li.appendChild(extra);
    list.appendChild(li);
  });
}

function getCountdown(date) {
  const due = new Date(date);
  const today = new Date();
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `${diff} day(s) left`;
  else if (diff === 0) return "Today!";
  else return "Overdue!";
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
