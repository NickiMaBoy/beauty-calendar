const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const urlParams = new URLSearchParams(window.location.search);
const busyParam = urlParams.get('busy');
let busyDates = busyParam ? busyParam.split(',') : [];

let currentDate = new Date();
let selectedDateStr = null;
let selectedTimeSlot = null;

const availableSlots = ["10:00", "13:00", "16:00", "19:00"];

const monthTitle = document.getElementById('monthTitle');
const calendarDays = document.getElementById('calendarDays');
const timeSlotsContainer = document.getElementById('timeSlotsContainer');
const timeSlotsGrid = document.getElementById('timeSlots');
const submitBtn = document.getElementById('submitBtn');

const monthsRu = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

function renderCalendar() {
    calendarDays.innerHTML = "";
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthTitle.innerText = monthsRu[month] + " " + year;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const shift = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < shift; i++) {
        calendarDays.appendChild(document.createElement('div'));
    }

    for (let day = 1; day <= totalDays; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day-cell');
        dayCell.innerText = day;
        const dateString = ${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')};

        if (busyDates.includes(dateString)) {
            dayCell.classList.add('busy');
        } else {
            dayCell.onclick = function() {
                document.querySelectorAll('.day-cell').forEach(c => c.classList.remove('selected'));
                dayCell.classList.add('selected');
                selectedDateStr = dateString;
                showTimeSlots();
            };
        }
        calendarDays.appendChild(dayCell);
    }
}

function showTimeSlots() {
    timeSlotsGrid.innerHTML = "";
    timeSlotsContainer.style.display = "block";
    submitBtn.style.display = "none";
    
    availableSlots.forEach(slot => {
        const btn = document.createElement('button');
        btn.innerText = slot;
        btn.onclick = function() {
            document.querySelectorAll('.slots-grid button').forEach(b => b.style.backgroundColor = "");
            btn.style.backgroundColor = "var(--button-color)";
            btn.style.color = "var(--button-text-color)";
            selectedTimeSlot = slot;
            submitBtn.style.display = "block";
        };
        timeSlotsGrid.appendChild(btn);
    });
}

submitBtn.onclick = function() {
    if (selectedDateStr && selectedTimeSlot) {
        tg.sendData(JSON.stringify({date: selectedDateStr, time: selectedTimeSlot}));
        tg.close();
    }
};

document.getElementById('prevMonth').onclick = () => { currentDate.setMonth(currentDate.getMonth()-1); renderCalendar(); };
document.getElementById('nextMonth').onclick = () => { currentDate.setMonth(currentDate.getMonth()+1); renderCalendar(); };

renderCalendar();
