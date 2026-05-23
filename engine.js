const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Считываем занятые даты из GET-параметров ссылки бота
const urlParams = new URLSearchParams(window.location.search);
const busyDaysParam = urlParams.get('busy_days') || '';
// Превращаем строку "2026-05-24,2026-05-25" в удобный массив
const busyDates = busyDaysParam.split(',');

let currentDate = new Date(2026, 4, 1); // Май 2026 года
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

// Встроенный шаблон свободных часов для любого дня
const availableHours = ["10:00", "13:00", "16:00", "19:00"];

function renderCalendar() {
    calendarDays.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthTitle.innerText = ${monthsRu[month]} ${year};

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

        // Форматируем текущую дату ячейки в вид "ГГГГ-ММ-ДД"
        const currentMonthStr = String(month + 1).padStart(2, '0');
        const currentDayStr = String(day).padStart(2, '0');
        const dateKey = ${year}-${currentMonthStr}-${currentDayStr};

        // Проверяем, занята ли дата бэкендом
        if (busyDates.includes(dateKey)) {
            dayDiv.classList.add('busy'); // Покрасим в css (сделай в style.css серым/темным)
            dayDiv.style.opacity = '0.3';
            dayDiv.style.pointerEvents = 'none'; // Делаем некликабельной
        } else {
            // Если дата свободна — вешаем событие клика
            dayDiv.addEventListener('click', () => {
                // Снимаем выделение со старой даты
                document.querySelectorAll('.day-cell').forEach(el => el.classList.remove('selected'));
                dayDiv.classList.add('selected');
                
                selectedDateStr = dateKey;
                selectedTimeStr = null; // Сбрасываем старое выбранное время
                submitBtn.style.display = 'none'; // Прячем кнопку отправки, пока время не выбрано
                
                showTimeSlots();
            });
        }

        calendarDays.appendChild(dayDiv);
    }
}

// Функция отображения доступных часов
function showTimeSlots() {
    timeSlots.innerHTML = '';
    timeSlotsContainer.style.display = 'block';

    availableHours.forEach(time => {
        const timeBtn = document.createElement('button');
        timeBtn.innerText = time;
        timeBtn.style.padding = '10px 15px';
        timeBtn.style.border = '1px solid #ccc';
        timeBtn.style.borderRadius = '8px';
        timeBtn.style.background = 'var(--tg-theme-secondary-bg-color, #fff)';
        timeBtn.style.color = 'var(--tg-theme-text-color, #000)';
        timeBtn.style.cursor = 'pointer';

        timeBtn.addEventListener('click', () => {
            // Снимаем выделение со всех кнопок времени
            document.querySelectorAll('#timeSlots button').forEach(btn => {
                btn.style.background = 'var(--tg-theme-secondary-bg-color, #fff)';
                btn.style.color = 'var(--tg-theme-text-color, #000)';
            });
            // Выделяем текущую
            timeBtn.style.background = 'var(--tg-theme-button-color, #3390ec)';
            timeBtn.style.color = 'var(--tg-theme-button-text-color, #fff)';
            
            selectedTimeStr = time;
            submitBtn.style.display = 'block'; // Показываем кнопку подтверждения!
        });

        timeSlots.appendChild(timeBtn);
    });
}

// Событие на кнопку «Подтвердить запись»
submitBtn.addEventListener('click', () => {
    if (selectedDateStr && selectedTimeStr) {
        const dataToSend = {
            date: selectedDateStr,
            time: selectedTimeStr
        };
        tg.sendData(JSON.stringify(dataToSend));
        tg.close();
    }
});

document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    timeSlotsContainer.style.display = 'none';
    submitBtn.style.display = 'none';
    renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    timeSlotsContainer.style.display = 'none';
    submitBtn.style.display = 'none';
    renderCalendar();
});

renderCalendar();
