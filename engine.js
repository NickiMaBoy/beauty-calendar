const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const monthYearLabel = document.getElementById('monthYear');
const calendarDaysContainer = document.getElementById('calendarDays');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const confirmBtn = document.getElementById('confirmBtn');

const months = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

let currentDate = new Date();
let selectedDate = null;

function renderCalendar() {
    calendarDaysContainer.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYearLabel.textContent = ${months[month]} ${year};

    const firstDayIndex = new Date(year, month, 1).getDay();
    const shift = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < shift; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('calendar-day', 'empty');
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

        if (selectedDate && day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
            dayDiv.classList.add('selected');
        }

        dayDiv.addEventListener('click', () => {
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            dayDiv.classList.add('selected');
            selectedDate = new Date(year, month, day);
            confirmBtn.style.display = 'block';
        });

        calendarDaysContainer.appendChild(dayDiv);
    }
}

prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

confirmBtn.addEventListener('click', () => {
    if (selectedDate) {
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const year = selectedDate.getFullYear();
        const formattedDate = ${day}.${month}.${year};

        const dataToSend = { date: formattedDate };
        tg.sendData(JSON.stringify(dataToSend));
        tg.close();
    }
});

renderCalendar();
