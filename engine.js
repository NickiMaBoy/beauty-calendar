const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const monthYearLabel = document.getElementById('monthYear');
const calendarDaysContainer = document.getElementById('calendarDays');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const confirmBtn = document.getElementById('confirmBtn');

const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

let currentDate = new Date();
let selectedDate = null;

function renderCalendar() {
    calendarDaysContainer.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYearLabel.textContent = months[month] + " " + year;

    const firstDayIndex = new Date(year, month, 1).getDay();
    let shift = 0;
    if (firstDayIndex === 0) {
        shift = 6;
    } else {
        shift = firstDayIndex - 1;
    }
    
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < shift; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('calendar-day');
        emptyDiv.classList.add('empty');
        calendarDaysContainer.appendChild(emptyDiv);
    }

    for (let day = 1; day <= totalDays; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = day;

        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayDiv.classList.add('today');
        }

        dayDiv.addEventListener('click', function() {
            const allDays = document.querySelectorAll('.calendar-day');
            for (let i = 0; i < allDays.length; i++) {
                allDays[i].classList.remove('selected');
            }
            dayDiv.classList.add('selected');
            selectedDate = new Date(year, month, day);
            confirmBtn.style.style.display = 'block';
        });

        calendarDaysContainer.appendChild(dayDiv);
    }
}

prevMonthBtn.addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

confirmBtn.addEventListener('click', function() {
    if (selectedDate) {
        const d = String(selectedDate.getDate()).padStart(2, '0');
        const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const y = selectedDate.getFullYear();
        const formattedDate = d + "." + m + "." + y;

        tg.sendData(JSON.stringify({ date: formattedDate }));
        tg.close();
    }
});

renderCalendar();
