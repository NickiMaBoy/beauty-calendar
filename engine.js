const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Получаем занятые даты из ссылки бота
const urlParams = new URLSearchParams(window.location.search);
const busyDaysParam = urlParams.get('busy_days') || '';
const busyDates = busyDaysParam ? busyDaysParam.split(',') : [];

let currentDate = new Date(2026, 4, 1); // Май 2026
let selectedDateStr = null;
let selectedTimeStr = null;

const monthTitle = document.getElementById('monthTitle');
const calendarDays = document.getElementById('calendarDays');
const timeSlotsContainer = document.getElementById('timeSlotsContainer');
const timeSlots = document.getElementById('timeSlots');
const submitBtn = document.getElementById('submitBtn');

const monthsRu = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

const availableHours = ["10:00", "13:00", "16:00", "19:00"];

function renderCalendar() {
    calendarDays.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthTitle.innerText = monthsRu[month] + " " + year;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const shift = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Пустые ячейки для сдвига дней недели
    for (let i = 0; i < shift; i++) {
        const emptyDiv = document.createElement('div');
        calendarDays.appendChild(emptyDiv);
    }

    // Отрисовка дней месяца
    for (let day = 1; day <= totalDays; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.innerText = day;
        dayDiv.classList.add('day-cell');

        // Вручную собираем строку даты без сложных функций
        let displayMonth = month + 1;
        if (displayMonth < 10) displayMonth = '0' + displayMonth;
        let displayDay = day;
        if (displayDay < 10) displayDay = '0' + displayDay;
        
        const dateKey = year + '-' + displayMonth + '-' + displayDay;

        // Проверяем, занята ли дата бэкендом
        if (busyDates.includes(dateKey)) {
            dayDiv.style.background = '#444c56'; // Делаем темной
            dayDiv.style.color = '#222';         // Текст почти невидимым
            dayDiv.style.opacity = '0.4';
            dayDiv.style.pointerEvents = 'none'; // Отключаем клики
        } else {
            // Если дата свободна
            dayDiv.addEventListener('click', function() {
                const allCells = document.querySelectorAll('.day-cell');
                allCells.forEach(function(cell) {
                    cell.classList.remove('selected');
                });
                dayDiv.classList.add('selected');
                
                selectedDateStr = dateKey;
                selectedTimeStr = null; 
                submitBtn.style.display = 'none'; 
                
                showTimeSlots();
            });
        }

        calendarDays.appendChild(dayDiv);
    }
}

function showTimeSlots() {
    timeSlots.innerHTML = '';
    timeSlotsContainer.style.display = 'block';

    availableHours.forEach(function(time) {
        const timeBtn = document.createElement('button');
        timeBtn.innerText = time;
        timeBtn.style.padding = '10px 15px';
        timeBtn.style.border = '1px solid #ccc';
        timeBtn.style.borderRadius = '8px';
        timeBtn.style.background = 'var(--tg-theme-secondary-bg-color, #fff)';
        timeBtn.style.color = 'var(--tg-theme-text-color, #000)';
        timeBtn.style.cursor = 'pointer';

        timeBtn.addEventListener('click', function() {
            const allBtns = document.querySelectorAll('#timeSlots button');
            allBtns.forEach(function(btn) {
                btn.style.background = 'var(--tg-theme-secondary-bg-color, #fff)';
                btn.style.color = 'var(--tg-theme-text-color, #000)';
            });
            
            timeBtn.style.background = 'var(--tg-theme-button-color, #3390ec)';
            timeBtn.style.color = 'var(--tg-theme-button-text-color, #fff)';
            
            selectedTimeStr = time;
            submitBtn.style.display = 'block'; 
        });

        timeSlots.appendChild(timeBtn);
    });
}

submitBtn.addEventListener('click', function() {
    if (selectedDateStr && selectedTimeStr) {
        const dataToSend = {
            date: selectedDateStr,
            time: selectedTimeStr
        };
        tg.sendData(JSON.stringify(dataToSend));
        tg.close();
    }
});

document.getElementById('prevMonth').addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    timeSlotsContainer.style.display = 'none';
    submitBtn.style.display = 'none';
    renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    timeSlotsContainer.style.display = 'none';
    submitBtn.style.display = 'none';
    renderCalendar();
});

renderCalendar();
