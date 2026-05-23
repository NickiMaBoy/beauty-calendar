// Инициализируем объект Телеграм Веб Апп
// Через эту переменную 'tg' наш сайт будет общаться с приложением Telegram
const tg = window.Telegram.WebApp;

// Сообщаем Телеграму, что приложение полностью загрузилось и готово к показу
tg.ready();
// Расширяем приложение на весь экран для удобства пользователя
tg.expand();

// Находим нужные элементы на HTML странице, чтобы управлять ими из кода
const monthYearLabel = document.getElementById('monthYear');
const calendarDaysContainer = document.getElementById('calendarDays');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const confirmBtn = document.getElementById('confirmBtn');

// Массив с названиями месяцев для красивого отображения в шапке
const months = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

// Создаем объект даты, который изначально хранит сегодняшний день
let currentDate = new Date();
let selectedDate = null; // Переменная, где мы сохраним дату, которую выберет клиентка

// Главная функция, которая рисует сетку календаря для выбранного месяца
function renderCalendar() {
    // Очищаем сетку от старых чисел (нужно при переключении месяцев)
    calendarDaysContainer.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Пишем текущий месяц и год в шапку (например: "Май 2026")
    monthYearLabel.textContent = ${months[month]} ${year};

    // Находим первый день месяца и определяем, какой это день недели (0 - Вс, 1 - Пн и т.д.)
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Корректируем индекс под привычную нам неделю, где понедельник — первый день (а не воскресенье)
    const shift = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    // Находим количество дней в текущем месяце
    const totalDays = new Date(year, month + 1, 0).getDate();

    // 1. Создаем пустые карточки для дней недели из прошлого месяца, чтобы сдвинуть числа
    for (let i = 0; i < shift; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('calendar-day', 'empty');
        calendarDaysContainer.appendChild(emptyDiv);
    }

    // 2. Заполняем календарь реальными числами текущего месяца
    for (let day = 1; day <= totalDays; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = day;

        // Проверяем, является ли этот день сегодняшним
        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayDiv.classList.add('today');
        }

        // Проверяем, был ли этот день уже выбран пользователем (чтобы сохранить подсветку)
        if (selectedDate && day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
            dayDiv.classList.add('selected');
        }

        // Вешаем событие клика на каждый день
        dayDiv.addEventListener('click', () => {
            // Убираем выделение 'selected' со всех остальных дней
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            
            // Выделяем текущий нажатый день
            dayDiv.classList.add('selected');
            
            // Сохраняем выбранную дату в память
            selectedDate = new Date(year, month, day);
            
            // Показываем кнопку "Подтвердить запись"
            confirmBtn.style.display = 'block';
        });

        calendarDaysContainer.appendChild(dayDiv);
    }
}

// Слушатель клика для стрелочки "Назад" (Предыдущий месяц)
prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(); // Перерисовываем календарь
});
// Слушатель клика для стрелочки "Вперед" (Следующий месяц)
nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(); // Перерисовываем календарь
});

// САМАЯ ВАЖНАЯ ЧАСТЬ: клик по кнопке "Подтвердить запись"
confirmBtn.addEventListener('click', () => {
    if (selectedDate) {
        // Форматируем дату в удобный вид DD.MM.YYYY (например: "23.05.2026")
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const year = selectedDate.getFullYear();
        const formattedDate = ${day}.${month}.${year};

        // Подготавливаем данные для отправки в бот
        const dataToSend = {
            date: formattedDate
        };

        // ОТПРАВЛЯЕМ ДАННЫЕ В ТЕЛЕГРАМ БОТ
        // tg.sendData принимает ТОЛЬКО строковые данные, поэтому превращаем наш объект в строку JSON
        tg.sendData(JSON.stringify(dataToSend));
        
        // Закрываем наше Web App окошко автоматически после отправки данных
        tg.close();
    }
});

// Первый запуск при открытии страницы, чтобы календарь сразу нарисовался
renderCalendar();