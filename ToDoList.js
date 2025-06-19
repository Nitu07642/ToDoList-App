
const taskInput = document.getElementById("taskInput");
    const categoryInput = document.getElementById("categoryInput");
    const deadlineInput = document.getElementById("deadlineInput");
    const taskList = document.getElementById("taskList");
    const taskStats = document.getElementById("taskStats");

    window.onload = () => {
      loadTasks();
    };

    function addTask() {
      const text = taskInput.value.trim();
      const category = categoryInput.value;
      const deadline = deadlineInput.value;

      if (!text) return;

      createTaskElement({ text, category, deadline, completed: false });
      taskInput.value = "";
      categoryInput.value = "";
      deadlineInput.value = "";
      saveTasks();
    }

    function createTaskElement(task) {
      const li = document.createElement("li");
      if (task.completed) li.classList.add("completed");

      const left = document.createElement("div");
      left.className = "task-left";

      const topLine = document.createElement("div");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.onclick = () => {
        li.classList.toggle("completed");
        saveTasks();
      };

      const span = document.createElement("span");
      span.innerText = task.text;

      topLine.appendChild(checkbox);
      topLine.appendChild(span);

      const bottomLine = document.createElement("small");
      bottomLine.innerText = `Category: ${task.category || "None"} | Deadline: ${task.deadline || "None"}`;

      left.appendChild(topLine);
      left.appendChild(bottomLine);

      const btns = document.createElement("div");
      btns.className = "buttons";

      const editBtn = document.createElement("button");
      editBtn.className = "edit-btn";
      editBtn.innerText = "Edit";
      editBtn.onclick = () => {
        const newText = prompt("Edit task", span.innerText);
        if (newText) {
          span.innerText = newText;
          saveTasks();
        }
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.innerText = "Delete";
      deleteBtn.onclick = () => {
        taskList.removeChild(li);
        saveTasks();
      };

      btns.appendChild(editBtn);
      btns.appendChild(deleteBtn);

      li.appendChild(left);
      li.appendChild(btns);
      taskList.appendChild(li);
    }

    function saveTasks() {
      const tasks = [];
      taskList.querySelectorAll("li").forEach(li => {
        const text = li.querySelector("span").innerText;
        const info = li.querySelector("small").innerText.split("|");
        const category = info[0].split(":")[1].trim();
        const deadline = info[1].split(":")[1].trim();
        const completed = li.classList.contains("completed");
        tasks.push({ text, category, deadline, completed });
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));
      updateStats();
    }

    function loadTasks() {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.forEach(task => createTaskElement(task));
      updateStats();
    }

    function updateStats() {
      const total = taskList.querySelectorAll("li").length;
      const completed = taskList.querySelectorAll("li.completed").length;
      taskStats.innerText = `Completed: ${completed} / Total: ${total}`;
    }

    function toggleMode() {
      document.body.classList.toggle("dark-mode");
    }

    function exportTasks() {
      const tasks = [];
      taskList.querySelectorAll("li").forEach(li => {
        tasks.push(li.innerText.trim());
      });
      const blob = new Blob([tasks.join("\n")], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "advanced_todo_list.txt";
      link.click();
    }

    function clearAllTasks() {
      if (confirm("Delete all tasks?")) {
        taskList.innerHTML = "";
        saveTasks();
      }
    }

    function searchTasks() {
      const query = document.getElementById("searchInput").value.toLowerCase();
      taskList.querySelectorAll("li").forEach(li => {
        const text = li.querySelector("span").innerText.toLowerCase();
        li.style.display = text.includes(query) ? "" : "none";
      });
    }