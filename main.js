// FULL JS SECTION — FIXED ADD SHIFT + WEEK SWITCH

let currentCell = null;
let currentWeek = 1;
let weekView = 1;

const tbody = document.getElementById('schedule-body');
const thead = document.getElementById('table-head');
const modal = document.getElementById('shift-modal');
const modalForm = document.getElementById('modal-form');

const schedule = {
  employees: [
    "Anna", "Daniel", "Lena", "Tom", "Maya", "Lukas", "Nina", "Tariq",
    "Eva", "Mark", "Selina", "Chris", "Julie", "Kai", "Ben"
  ].map(name => ({ name, shifts: {} }))
};

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getWeekStartDate(weekOffset = 0) {
  const now = new Date();
  const start = new Date(now.setDate(now.getDate() - now.getDay() + 1 + (weekOffset * 7)));
  return start;
}

function getDateLabels(weekOffset = 0, weekView = 1) {
  const labels = [];
  const base = getWeekStartDate(weekOffset);
  for (let w = 0; w < weekView; w++) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(base);
      date.setDate(base.getDate() + (w * 7) + d);
      const label = `${days[d]}<br><small>${date.toLocaleDateString()}</small>`;
      labels.push(`W${weekOffset + w + 1}-${days[d]}::${label}`);
    }
  }
  return labels;
}

function renderTableHead(daysWithDates) {
  const row = document.createElement('tr');
  row.innerHTML = '<th class="p-2 border">Employee</th>' +
    daysWithDates.map(d => `<th class="p-2 border">${d.split('::')[1]}</th>`).join('');
  thead.innerHTML = '';
  thead.appendChild(row);
}

function renderSchedule() {
  const labels = getDateLabels(currentWeek - 1, weekView);
  const daysWithKeys = labels.map(label => label.split('::')[0]);
  renderTableHead(labels);
  tbody.innerHTML = '';

  schedule.employees.forEach((emp, rowIndex) => {
    const tr = document.createElement('tr');
    const nameTd = document.createElement('td');
    nameTd.className = "p-2 border font-medium";
    nameTd.textContent = emp.name;
    tr.appendChild(nameTd);

    daysWithKeys.forEach(day => {
      const td = document.createElement('td');
      td.className = "schedule-cell";
      td.dataset.row = rowIndex;
      td.dataset.day = day;
      td.addEventListener('click', () => openModal(td));
      const shift = emp.shifts[day];
      if (shift) {
        td.innerHTML = `<div class="shift-box" style="background-color: ${shift.color}">${shift.label}<br>${shift.time}</div>`;
      }
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

function openModal(cell) {
  currentCell = cell;
  const row = cell.dataset.row;
  const day = cell.dataset.day;
  const shift = schedule.employees[row].shifts[day];
  if (shift) {
    document.getElementById('modal-role').value = shift.label;
    document.getElementById('modal-time').value = shift.time;
    document.getElementById('modal-color').value = shift.color;
  } else {
    modalForm.reset();
  }
  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
  modalForm.reset();
  currentCell = null;
}

modalForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const role = document.getElementById('modal-role').value;
  const time = document.getElementById('modal-time').value;
  const color = document.getElementById('modal-color').value;
  const row = currentCell.dataset.row;
  const day = currentCell.dataset.day;
  const emp = schedule.employees[row];
  emp.shifts[day] = { label: role, time: time, color: color };
  closeModal();
  renderSchedule();
});

function setWeekView(view) {
  weekView = view;
  renderSchedule();
}

function changeWeek(direction) {
  currentWeek += direction;
  renderSchedule();
}

function goToCurrentWeek() {
  currentWeek = 1;
  renderSchedule();
}

// initial render
renderSchedule();

