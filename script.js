const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

menuBtn.onclick = () => {sidebar.classList.add('active'); overlay.classList.add('active');};
overlay.onclick = () => {sidebar.classList.remove('active'); overlay.classList.remove('active');};