// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Получаем параметры из URL ссылки
const urlParams = new URLSearchParams(window.location.search);
const busyParam = urlParams.get('busy');

// БРОНЕБОЙНАЯ ПРОВЕРКА: если busy пустой или его нет, делаем просто пустой массив
let busyDates = [];
if (busyParam && busyParam.trim() !== "") {
    busyDates = busyParam.split(',');
}

let currentDate = new Date();
let selectedDateStr = null;
let selectedTimeSlot = null;

// Фиктивные таймслоты для примера
const availableSlots = ["10:00", "13:00", "16:00", "19:00"];

const monthTitle = document.getElementById('monthTitle');
const calendarDays = document.getElementById('calendarDays');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const timeSlotsContainer = document.getElementById('timeSlotsContainer');
const timeSlotsGrid = document.getElementById('timeSlots');
const submitBtn = document.getElementById('submitBtn');

const monthsRu = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

function renderCalendar() {
    calendarDays.innerHTML = "";
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthTitle.innerText = ${monthsRu[month]} ${year};

    // Первый день месяца
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Корректируем под русский календарь (чтобы Пн был первым, а не Вс)
    const shift = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    // Количество дней в текущем месяце
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Отрисовка пустых ячеек для сдвига дней недели
    for (let i = 0; i < shift; i++) {
        const emptyCell = document.createElement('div');
        calendarDays.appendChild(emptyCell);
    }

    // Отрисовка самих чисел месяца
    for (let day = 1; day <= totalDays; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day-cell');
        dayCell.innerText = day;

        // Форматируем дату в вид YYYY-MM-DD для сверки с базой
        const currentMonthStr = String(month + 1).padStart(2, '0');
        const currentDayStr = String(day).padStart(2, '0');
        const dateString = ${year}-${currentMonthStr}-${currentDayStr};

        // Если дата есть в списке занятых
        if (busyDates.includes(dateString)) {
            dayCell.classList.add('busy');
        } else {
            // Если свободна — вешаем клик
            dayCell.addEventListener('click', () => {
                // Снимаем выделение с прошлых дней
                document.querySelectorAll('.day-cell').forEach(cell => cell.classList.remove('selected'));
                dayCell.classList.add('selected');
                
                selectedDateStr = dateString;
                showTimeSlots();
            });
        }

        calendarDays.appendChild(dayCell);
    }
}

function showTimeSlots() {
    timeSlotsGrid.innerHTML = "";
    timeSlotsContainer.style.display = "block";
    submitBtn.style.display = "none"; // Прячем главную кнопку, пока не выбран час
    selectedTimeSlot = null;

    availableSlots.forEach(slot => {
        const slotBtn = document.createElement('button');
        slotBtn.innerText = slot;
        
        slotBtn.addEventListener('click', () => {
            document.querySelectorAll('.slots-grid button').forEach(btn => {
                btn.style.backgroundColor = "var(--bg-color)";
                btn.style.color = "var(--text-color)";
            });
            
            slotBtn.style.backgroundColor = "var(--button-color)";
            slotBtn.style.color = "var(--button-text-color)";
            
            selectedTimeSlot = slot;
            submitBtn.style.display = "block"; // Показываем кнопку отправки
            submitBtn.scrollIntoView({ behavior: 'smooth' });
        });

        timeSlotsGrid.appendChild(slotBtn);
    });
}
// Переключение месяцев
prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
    timeSlotsContainer.style.style.display = "none";
    submitBtn.style.display = "none";
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    timeSlotsContainer.style.display = "none";
    submitBtn.style.display = "none";
});

// Отправка данных обратно в Телеграм-бота
submitBtn.addEventListener('click', () => {
    if (selectedDateStr && selectedTimeSlot) {
        const dataToSend = {
            date: selectedDateStr,
            time: selectedTimeSlot
        };
        // Отправляем JSON-строку в метод Telegram
        tg.sendData(JSON.stringify(dataToSend));
        tg.close();
    }
});

// Первый запуск
renderCalendar();
