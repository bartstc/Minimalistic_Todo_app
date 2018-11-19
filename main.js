// === Inspired by https://www.youtube.com/watch?v=2wCpkOk2uCg&t=2s :) ===

// === STORE THE DATA - LOCAL STORAGE ===
// If is something in localStorage load content of localStorage, if not - object is empty
const data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')) : {
  todo: {
    value: [],
    description: [],
    icon: []
  },
  complited: {
    value: [],
    description: [],
    icon: []
  }
};
renderTodoList();

// === UPDATE LOCALSTORAGE DATA ===
// Run this function whenever we manipulated the data
function dataObjectUpdated() {
  localStorage.setItem('todoList', JSON.stringify(data));
  tasksNumber();
};

// === SHOW HOW MANY TASKS ARE IN TODO LIST ===
function tasksNumber() {
  let tasksNumber = document.querySelector('.tasks-number span');
  if (data.todo.value.length === 0) {
    tasksNumber.innerText = 'any';
  } else {
    tasksNumber.innerText = data.todo.value.length;
  };
};

// === RENDER TODO LIST FROM LOCALSTORAGE ===
// Run this function only once after opened this app in the browser
function renderTodoList() {
  if (!data.todo.value.length && !data.complited.value.length) return;

  for (let i = 0; i < data.todo.value.length; i++) {
    let value = data.todo.value[i];
    let description = data.todo.description[i];
    let icon = data.todo.icon[i];
    addItemToDOM(value, description, icon);
  }

  for (let j = 0; j < data.complited.value.length; j++) {
    let value = data.complited.value[j];
    let description = data.complited.description[j];
    let icon = data.complited.icon[j];
    addItemToDOM(value, description, icon, true);
  }
  tasksNumber();
};

// GLOBAL VARIABLES
const categoryInputs = document.querySelector('.categories').querySelectorAll('input');

// === ADD EVENT LISTENER FOR ADD BUTTON ===
document.querySelector('.add-btn').addEventListener('click', createItem);

// === CREATE ITEM AND PUSH IT TO THE LIST ===
function createItem() {
  let value = document.querySelector('#add-item').value;
  let description = document.querySelector('#add-description').value;
  if (description === '') description = 'A comment has not been added.';
  let icon;
  let homeIcon = '<i class="fas fa-home"></i>';
  let workIcon = '<i class="fas fa-briefcase"></i>';
  let schoolIcon = '<i class="fas fa-graduation-cap"></i>';
  let shopIcon = '<i class="fas fa-shopping-cart"></i>';
  let hobbyIcon = '<i class="fas fa-camera"></i>';
  let othersIcon = '<i class="fas fa-beer"></i>';
  for (let i = 0; i < categoryInputs.length; i++) {
    if (categoryInputs[i].checked) {
      iconID = categoryInputs[i].id;
      switch (iconID) {
        case 'home':
          icon = homeIcon;
          break;
        case 'work':
          icon = workIcon;
          break;
        case 'school':
          icon = schoolIcon;
          break;
        case 'shop':
          icon = shopIcon;
          break;
        case 'hobby':
          icon = hobbyIcon;
          break;
        case 'others':
          icon = othersIcon;
          break;
        // default not work?? why?
        default:
          icon = othersIcon;
      }
    }
  }
  if (icon === undefined) icon = othersIcon;
  let categoryIcon = icon;

  if (value) addItem(value, description, categoryIcon);
}

// === LOOP FUNCTIONS ===
function loopForSplice(list, nodes) {
  Object.entries(list).forEach((arr, index) => {
    arr[1].splice(arr[1].indexOf(nodes[index]), 1);
  });
};
function loopForPush(list, nodes) {
  Object.entries(list).forEach((arr, index) => {
    arr[1].push(nodes[index]);
  });
}

// === REMOVE ITEM ===
function removeItem() {
  let item = this.parentNode.parentNode;
  let parent = item.parentNode;
  let id = parent.id;

  let value = item.childNodes[0].childNodes[1].childNodes[0].innerText;
  let description = item.childNodes[0].childNodes[2].childNodes[0].innerText;
  let icon = item.childNodes[0].childNodes[0].childNodes[1].innerHTML;
  const nodes = [];
  nodes.push(value, description, icon);

  if (id === 'todo') {
    loopForSplice(data.todo, nodes);
  } else {
    loopForSplice(data.complited, nodes);
  };
  dataObjectUpdated();
  parent.removeChild(item);
};

// === MOVE ITEM TO THE COMPLITE LIST ===
function completeItem() {
  let item = this.parentNode.parentNode.parentNode;
  let parent = item.parentNode;
  let id = parent.id;

  let value = item.childNodes[0].childNodes[1].childNodes[0].innerText;
  let description = item.childNodes[0].childNodes[2].childNodes[0].innerText;
  let icon = this.nextElementSibling.innerHTML;
  const nodes = [];
  nodes.push(value, description, icon);

  // Remove item from todo list and push it to completed list (and vice versa)
  if (id === 'todo') {
    loopForSplice(data.todo, nodes);
    loopForPush(data.complited, nodes);
  } else {
    loopForSplice(data.complited, nodes);
    loopForPush(data.todo, nodes);
  }
  dataObjectUpdated();

  // Check if the item should be added to the completed list or re-added to the todo list
  let target = (id === 'todo') ? document.querySelector('#completed') : document.querySelector('#todo');
  parent.removeChild(item);
  target.insertBefore(item, target.childNodes[0]);
};

// === ADD A NEW ITEM TO THE TODO LIST ===
function addItem(value, description, categoryIcon) {
  addItemToDOM(value, description, categoryIcon);
  document.querySelector('#add-item').value = '';
  document.querySelector('#add-description').value = '';
  for (let i = 0; i < categoryInputs.length; i++) {
    if (categoryInputs[i].checked) categoryInputs[i].checked = false;
  };
  addPanel.classList.remove('opened');

  const nodes = [value, description, categoryIcon];
  loopForPush(data.todo, nodes);
  dataObjectUpdated();
};

// === ADD A NEW ITEM TO THE DOM ===
// if complited = true - item will be added to complited list (if false: todo)
function addItemToDOM(text, description, categoryIcon, complited) {
  const list = (complited) ? document.getElementById('completed') : document.getElementById('todo');

  const item = document.createElement('li');
  item.classList.add('item');

  // Left section of item
  const left = document.createElement('div');
  left.classList.add('left');

  const leftTop = document.createElement('div');
  leftTop.classList.add('left-top');

  const done = document.createElement('button');
  done.classList.add('done');
  done.addEventListener('click', completeItem);
  const iconCheck = document.createElement('i');
  iconCheck.classList.add('fas', 'fa-check');
  done.appendChild(iconCheck);

  const category = document.createElement('div');
  category.classList.add('category');
  category.innerHTML = categoryIcon;

  const iconCategory = document.createElement('i');
  iconCategory.classList.add('fas', 'fa-home');

  const task = document.createElement('div');
  task.classList.add('task');

  const taskValue = document.createElement('p');
  taskValue.classList.add('task-value');
  taskValue.innerHTML = text;
  const desc = document.createElement('div');
  desc.classList.add('description-text');

  const descValue = document.createElement('p');
  descValue.classList.add('desc-value');
  descValue.innerHTML = description;

  // Right section of item
  const right = document.createElement('div');
  right.classList.add('right');

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete');
  deleteBtn.addEventListener('click', removeItem);
  const deleteIcon = document.createElement('i');
  deleteIcon.classList.add('fas', 'fa-times');
  deleteBtn.appendChild(deleteIcon);

  const showBtn = document.createElement('button');
  showBtn.classList.add('description');
  showBtn.addEventListener('click', showDescription);
  const showIcon = document.createElement('i');
  showIcon.classList.add('fas', 'fa-ellipsis-h');
  showBtn.appendChild(showIcon);

  item.appendChild(left);
  item.appendChild(right);
  left.appendChild(leftTop);
  left.appendChild(task);
  left.appendChild(desc);
  leftTop.appendChild(done);
  leftTop.appendChild(category);
  task.appendChild(taskValue);
  desc.appendChild(descValue);
  right.appendChild(deleteBtn);
  right.appendChild(showBtn);

  list.insertBefore(item, list.childNodes[0]);
};

// === OPEN/CLOSE ADD PANEL ===
const addPanel = document.querySelector('.add-panel');
const openBtn = document.querySelector('.open-btn').addEventListener('click', () => {
  addPanel.classList.toggle('opened');
});
const closeBtn = document.querySelector('.close-btn').addEventListener('click', () => {
  addPanel.classList.remove('opened');
});

// === OPEN/CLOSE DESCRIPTION ===
function showDescription() {
  let right = this.parentNode;
  let left = right.previousSibling;
  let leftChildrens = left.childNodes;
  leftChildrens[2].classList.toggle('opened-desc');
};

// === ADD EVENT LISTENER FOR ADD ITEM AFTER ENTER CLICK ===
const panelInputs = document.querySelector('.panel-container').querySelectorAll('input');
for (let i = 0; i < panelInputs.length; i++) {
  panelInputs[i].addEventListener('keydown', e => {
    let value = document.querySelector('#add-item').value;
    if (e.code === 'Enter' && value) {
      createItem();
    }
  });
};

// === SWITCH ON/OFF DAY/NIGHT MODE ===
const checkbox = document.querySelector('#switch-checkbox').addEventListener('change', switchColor);
function switchColor() {
  let setProp = (first, second) => {
    document.documentElement.style.setProperty(first, second);
  };

  const varClrs = ['--first-color', '--second-color', '--bg-color', '--shadow-color', '--item-color'];
  const darkClrs = ['#fff', '#000', '#111', '#111', 'rgb(24, 24, 24)'];
  const lightClrs = ['#000', '#fff', 'rgb(250, 250, 250)', 'rgba(44, 62, 80, 0.10)', '#fff'];

  if (this.checked) {
    varClrs.forEach((clr, index) => {
      setProp(clr, darkClrs[index]);
    });

  } else {
    varClrs.forEach((clr, index) => {
      setProp(clr, lightClrs[index]);
    });
  };
};

// === PRINT TIME AND DATE ===
function printTime() {
  const dayName = document.querySelector('.day');
  const clock = document.querySelector('.clock');
  const date = document.querySelector('.date');
  const now = new Date();
  let year = now.getFullYear();
  let hours = now.getHours();
  if (hours < 10) hours = "0" + hours;
  let minutes = now.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;
  let seconds = now.getSeconds();
  if (seconds < 10) seconds = "0" + seconds;
  const weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let day = weekDay[now.getDay()];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let month = monthNames[now.getMonth()];
  dayName.innerText = `${day}, `;
  clock.innerText = `${hours}:${minutes}:${seconds}`;
  date.innerText = `${month}, ${year}`;
};
setInterval('printTime()', 1000);