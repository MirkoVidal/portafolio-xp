const projectsData = [
  {
    id: 'backend-auth',
    title: 'XP Auth System',
    summary: 'Backend RESTful desarrollado en Node.js para gestionar la seguridad y datos del portafolio.',
    problem: 'Necesidad de desacoplar la lógica de negocio de la interfaz visual, permitiendo escalabilidad y manejo seguro de sesiones.',
    challenges: 'Implementar rutas de autenticación y sistema CRUD para el libro de visitas conectado a base de datos en la nube.',
    techStack: [
      { name: 'Node.js', icon: 'images/tech/node.png' },
      { name: 'JS', icon: 'images/tech/js.png' },
      { name: 'SQL', icon: 'images/tech/sqlite.png' }
    ],
    gallery: [],
    githubUrl: 'https://github.com/MirkoVidal/xp-backend-auth',
    demoUrl: ''
  },
  {
    id: 'smart-bot',
    title: 'Smart File Bot',
    summary: 'Script de automatización en Python que actúa como bot de mantenimiento inteligente para sistemas de archivos.',
    problem: 'La gestión manual de archivos descargados genera desorden y pérdida de tiempo productivo en entornos de diseño y desarrollo.',
    challenges: 'Crear un algoritmo eficiente que clasifique archivos por extensión y genere logs de auditoría para prevenir pérdida de datos.',
    techStack: [
      { name: 'Python', icon: 'images/tech/python.png' },
      { name: 'Git', icon: 'images/tech/git.png' }
    ],
    gallery: [],
    githubUrl: 'https://github.com/MirkoVidal/smart-file-organizer',
    demoUrl: ''
  },
  {
    id: 'portafolio-xp',
    title: 'Portafolio Windows XP',
    summary: 'Sitio web interactivo que simula la interfaz de Windows XP utilizando HTML, CSS y JS puro.',
    problem: 'Destacar en un mercado laboral competitivo con un currículum que demuestre habilidades técnicas y creatividad.',
    challenges: 'Recrear el sistema de ventanas, arrastre (drag & drop) y el sistema de grilla del escritorio sin usar frameworks.',
    techStack: [
      { name: 'HTML5', icon: 'images/tech/html.png' },
      { name: 'CSS3', icon: 'images/tech/css.png' },
      { name: 'JS', icon: 'images/tech/js.png' }
    ],
    gallery: [
        'images/projects/portfolio/boot.png',
        'images/projects/portfolio/snake.png',
        'images/projects/portfolio/code.png',
        'images/projects/portfolio/desktop.png'
    ],
    githubUrl: 'https://github.com/MirkoVidal/portafolio-xp',
    demoUrl: '#'
  }
];

const startupSound = new Audio('xp_startup.wav');
startupSound.volume = 0.5;

function playStartupSound() {
  startupSound.play().catch(error => { /* console.error(error) */ });
}

const bootScreen = document.getElementById('boot-screen');
const lockScreen = document.getElementById('lock-screen');
const desktop = document.querySelector('.desktop');
const taskbar = document.querySelector('.taskbar');

function runBootSequence() {
  lockScreen.style.display = 'none';
  desktop.style.display = 'none';
  taskbar.style.display = 'none';
  const bootTime = 5000;
  setTimeout(() => {
    bootScreen.style.display = 'none';
    lockScreen.style.display = 'flex';
  }, bootTime);
}
document.addEventListener('DOMContentLoaded', runBootSequence);

function openWindow(windowId) {
  const windowElement = document.getElementById(windowId);
  windowElement.style.display = 'block';
  windowElement.style.zIndex = 10;
  addToTaskbar(windowId);

  if (windowElement.dataset.state !== 'maximized') {
      setTimeout(() => toggleMaximizeWindow(windowId), 0);
  }

  if (windowId === 'snake-game') {
    startSnakeGame();
  }

  if (windowId === 'guestbook') {
    loadMessages();
  }
}

function closeWindow(windowId) {
  const windowElement = document.getElementById(windowId);
  if (windowId.startsWith('project-')) {
    windowElement.remove();
  } else {
    windowElement.style.display = 'none';
    delete windowElement.dataset.state;
    windowElement.style.top = '';
    windowElement.style.left = '';
    windowElement.style.width = '';
    windowElement.style.height = '';
    windowElement.style.transform = '';
  }
  document.querySelectorAll('.taskbar-icon').forEach(icon => {
    if (icon.getAttribute('data-window-id') === windowId) {
      icon.remove();
    }
  });
  if (windowId === 'snake-game' && typeof game !== 'undefined') {
    clearInterval(game);
  }
}

function minimizeWindow(windowId) {
  const windowElement = document.getElementById(windowId);
  windowElement.style.display = 'none';
}

function toggleMaximizeWindow(windowId) {
  const windowElement = document.getElementById(windowId);
  const currentState = windowElement.dataset.state;

  if (currentState === 'maximized') {
    windowElement.dataset.state = 'normal';
    windowElement.style.top = windowElement.dataset.originalTop || '50%';
    windowElement.style.left = windowElement.dataset.originalLeft || '50%';
    windowElement.style.width = windowElement.dataset.originalWidth || '';
    windowElement.style.height = windowElement.dataset.originalHeight || '';
    
    if (windowElement.style.top === '50%' && windowElement.style.left === '50%') {
        windowElement.style.transform = 'translate(-50%, -50%)';
    } else {
         windowElement.style.transform = 'none';
    }
  } else {
    if (currentState !== 'maximized') {
        windowElement.dataset.originalTop = windowElement.style.top || '50%';
        windowElement.dataset.originalLeft = windowElement.style.left || '50%';
        windowElement.dataset.originalWidth = windowElement.style.width || windowElement.offsetWidth + 'px';
        windowElement.dataset.originalHeight = windowElement.style.height || windowElement.offsetHeight + 'px';
    }
    windowElement.dataset.state = 'maximized';
    windowElement.style.transform = 'none';
  }
}


function makeWindowDraggable(windowId) {
  const windowElement = document.getElementById(windowId);
  const header = windowElement.querySelector('.window-header');
  let isDragging = false;
  let offsetX, offsetY;

  header.addEventListener('mousedown', (e) => {
    if (windowElement.dataset.state === 'maximized') return;
    isDragging = true;
    offsetX = e.clientX - windowElement.getBoundingClientRect().left;
    offsetY = e.clientY - windowElement.getBoundingClientRect().top;
    windowElement.style.transform = 'none';
    document.querySelectorAll('.window').forEach(win => win.style.zIndex = 5);
    windowElement.style.zIndex = 10;
     header.style.cursor = 'grabbing';
     document.body.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      let newX = e.clientX - offsetX;
      let newY = e.clientY - offsetY;

      const maxTop = window.innerHeight - 40 - 30;
      if (newY < 0) newY = 0;
      if (newY > maxTop) newY = maxTop;
      if (newX < 0) newX = 0;

      windowElement.style.left = `${newX}px`;
      windowElement.style.top = `${newY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        header.style.cursor = 'grab';
        document.body.style.cursor = 'default';
    }
  });
}

function addToTaskbar(windowId) {
  if (document.querySelector(`.taskbar-icon[data-window-id="${windowId}"]`)) {
    const windowElement = document.getElementById(windowId);
    if(windowElement) {
        windowElement.style.display = 'block';
        windowElement.style.zIndex = 10;
    }
    return;
  }
  
  const taskbarWindows = document.querySelector('.taskbar-windows');
  const taskbarIcon = document.createElement('div');
  taskbarIcon.className = 'taskbar-icon';
  const project = projectsData.find(p => `project-${p.id}` === windowId);
  let title = project ? project.title : windowId.replace('project-', '');
  if (windowId === 'recycle-bin') title = 'Papelera';
  if (windowId === 'documents') title = 'Mis Documentos';
  if (windowId === 'guestbook') title = 'Libro de Visitas';
  
  taskbarIcon.textContent = title;
  taskbarIcon.setAttribute('data-window-id', windowId);
  taskbarIcon.onclick = () => {
    const windowElement = document.getElementById(windowId);
    if (windowElement) {
        windowElement.style.display = 'block';
        windowElement.style.zIndex = 10;
    } else {
      openProject(windowId.replace('project-', ''));
    }
  };
  taskbarWindows.appendChild(taskbarIcon);
}

['about', 'projects', 'contact', 'snake-game', 'internet', 'documents', 'recycle-bin', 'guestbook'].forEach(makeWindowDraggable);

function updateClock() {
  const clockElement = document.getElementById('clock');
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock();

let game;
function startSnakeGame() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const box = 20;
  let snake = [{ x: 9 * box, y: 10 * box }];
  let direction;
  let food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
  let score = 0;
  document.getElementById('score').innerText = score;
  document.removeEventListener('keydown', setDirection);
  document.addEventListener('keydown', setDirection);
  function setDirection(event) {
    if (document.getElementById('snake-game').style.display !== 'block') return;
    if (event.keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT';
    if (event.keyCode === 38 && direction !== 'DOWN') direction = 'UP';
    if (event.keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT';
    if (event.keyCode === 40 && direction !== 'UP') direction = 'DOWN';
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = i === 0 ? '#00FF00' : '#00CC00';
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
      ctx.strokeStyle = '#000';
      ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(food.x, food.y, box, box);
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;
    if (snakeX === food.x && snakeY === food.y) {
      score++;
      document.getElementById('score').innerText = score;
      food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
    } else {
      snake.pop();
    }
    let newHead = { x: snakeX, y: snakeY };
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
      clearInterval(game);
      alert('Game Over! Puntuación: ' + score);
      direction = undefined;
      document.removeEventListener('keydown', setDirection);
    }
    snake.unshift(newHead);
  }
  function collision(head, array) {
    for (let i = 1; i < array.length; i++) {
      if (head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
  }
  if (typeof game !== 'undefined') clearInterval(game);
  game = setInterval(draw, 100);
}

function openProject(projectId) {
  const projectData = projectsData.find(p => p.id === projectId);
  if (!projectData) { console.error(`No data for project: ${projectId}`); return; }
  const windowId = `project-${projectData.id}`;
  const existingWindow = document.getElementById(windowId);
  if (existingWindow) { existingWindow.style.display = 'block'; existingWindow.style.zIndex = 10; return; }
  createProjectWindow(projectData);
}

function createProjectWindow(projectData) {
  const windowId = `project-${projectData.id}`;
  const newWindow = document.createElement('div');
  newWindow.id = windowId;
  newWindow.className = 'window project-window';
  newWindow.style.zIndex = 10;
  const techHtml = projectData.techStack.map(tech => `<div class="tech-item"><img src="${tech.icon}" alt="${tech.name}"><span>${tech.name}</span></div>`).join('');
  const galleryHtml = projectData.gallery.map(imgSrc => `<img src="${imgSrc}" alt="Captura de ${projectData.title}" class="gallery-image">`).join('');
  let linksHtml = `<a href="${projectData.githubUrl}" target="_blank" class="project-link github">Ver Código en GitHub</a>`;
  if (projectData.demoUrl) { linksHtml += `<a href="${projectData.demoUrl}" target="_blank" class="project-link demo">Ver Demo</a>`; }
  newWindow.innerHTML = `
    <div class="window-header">
      <span class="window-title">${projectData.title}</span>
      <div class="window-controls">
        <button class="window-minimize" onclick="minimizeWindow('${windowId}')">_</button>
        <button class="window-maximize" onclick="toggleMaximizeWindow('${windowId}')">[]</button>
        <button class="window-close" onclick="closeWindow('${windowId}')">X</button>
      </div>
    </div>
    <div class="window-content project-window-content">
      <div class="project-summary"><h3>${projectData.title}</h3><p>${projectData.summary}</p></div>
      <div class="project-details"><h4>El Problema a Resolver</h4><p>${projectData.problem}</p><h4>Desafíos Técnicos y Solución</h4><p>${projectData.challenges}</p></div>
      <div class="project-stack"><h4>Stack Tecnológico</h4><div class="tech-stack-container">${techHtml}</div></div>
      <div class="project-gallery"><h4>Galería</h4><div class="gallery-container">${galleryHtml}</div></div>
      <div class="project-links">${linksHtml}</div>
    </div>`;
  document.body.appendChild(newWindow);
  makeWindowDraggable(windowId);
  openWindow(windowId);
}

const startButton = document.querySelector('.start-button');
const startMenu = document.getElementById('start-menu');
const contextMenu = document.getElementById('context-menu');

function toggleStartMenu() {
  const isVisible = startMenu.style.display === 'block';
  startMenu.style.display = isVisible ? 'none' : 'block';
}
startButton.addEventListener('click', (event) => {
  event.stopPropagation();
  closeContextMenu();
  toggleStartMenu();
});

document.addEventListener('click', (event) => {
  if (startMenu.style.display === 'block' && !startMenu.contains(event.target) && !startButton.contains(event.target)) {
    startMenu.style.display = 'none';
  }
  if (contextMenu.style.display === 'block' && !contextMenu.contains(event.target)) {
    closeContextMenu();
  }
});

function openWindowFromMenu(windowId) {
  openWindow(windowId);
  startMenu.style.display = 'none';
  closeContextMenu();
}

function logOff() {
  startMenu.style.display = 'none';
  desktop.style.display = 'none';
  taskbar.style.display = 'none';
  document.querySelectorAll('.window').forEach(win => { win.style.display = 'none'; });
  document.querySelector('.taskbar-windows').innerHTML = '';
  lockScreen.style.display = 'flex';
}

function logIn() {
  lockScreen.style.display = 'none';
  desktop.style.display = 'grid';
  taskbar.style.display = 'flex';
  startupSound.currentTime = 0;
  startupSound.play();
}

function turnOff() {
  startMenu.style.display = 'none';
  desktop.style.display = 'none';
  taskbar.style.display = 'none';
  document.querySelectorAll('.window').forEach(win => { win.style.display = 'none'; });
  document.body.innerHTML = '<div class="shutdown-screen">Es seguro apagar el equipo...</div>';
  document.body.style.background = '#000';
  document.body.style.color = '#fff';
  setTimeout(() => { window.close(); }, 2000);
}

desktop.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  startMenu.style.display = 'none';
  contextMenu.style.top = `${event.clientY}px`;
  contextMenu.style.left = `${event.clientX}px`;
  contextMenu.style.display = 'block';
});

function closeContextMenu() {
  contextMenu.style.display = 'none';
}

function refreshDesktop() {
  console.log("Actualizando...");
  closeContextMenu();
}

function renderProjectIcons() {
  const container = document.querySelector('#projects .project-showcase');
  if (!container) return;
  
  container.innerHTML = ''; 

  projectsData.forEach(p => {
    const iconDiv = document.createElement('div');
    iconDiv.className = 'project-icon';
    iconDiv.onclick = () => openProject(p.id);
    
    iconDiv.innerHTML = `
        <img src="images/projects-icon.png" alt="${p.title}">
        <p>${p.title}</p>
    `;
    container.appendChild(iconDiv);
  });
}

document.addEventListener('DOMContentLoaded', renderProjectIcons);

const API_URL = "https://xp-backend-auth.onrender.com/api/guestbook";

async function loadMessages() {
  const listElement = document.getElementById('gb-list');
  listElement.innerHTML = '<p>Conectando con el servidor...</p>';

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    listElement.innerHTML = '';

    if (data.length === 0) {
      listElement.innerHTML = '<p>Aún no hay firmas. ¡Sé el primero!</p>';
      return;
    }

    data.forEach(msg => {
      const date = new Date(msg.created_at).toLocaleDateString();
      const entry = document.createElement('div');
      entry.className = 'gb-entry';
      entry.innerHTML = `
        <strong>${msg.name}</strong> <span>${date}</span>
        <p>${msg.message}</p>
      `;
      listElement.appendChild(entry);
    });

  } catch (error) {
    console.error(error);
    listElement.innerHTML = '<p style="color:red">Error al conectar con el servidor.</p>';
  }
}

async function postMessage() {
  const nameInput = document.getElementById('gb-name');
  const msgInput = document.getElementById('gb-msg');
  const name = nameInput.value.trim();
  const message = msgInput.value.trim();

  if (!name || !message) {
    alert("Por favor escribe tu nombre y un mensaje.");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message })
    });

    if (response.ok) {
      nameInput.value = "";
      msgInput.value = "";
      loadMessages(); 
    } else {
      alert("Error al enviar mensaje.");
    }
  } catch (error) {
    console.error(error);
    alert("No se pudo conectar con el servidor.");
  }
}

function sendEmailToMirko() {
  const subject = document.getElementById('email-subject').value;
  const body = document.getElementById('email-body').value;
  
  if (!body) {
    alert("Por favor escribe un mensaje antes de enviar.");
    return;
  }

  const mailtoLink = `mailto:mirkovidal2023@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  window.open(mailtoLink, '_blank');
}