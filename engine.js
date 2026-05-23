// Минимально необходимый код для запуска
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Функция отрисовки
function renderCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    if (!calendarDays) return; // Защита от вылета
    
    calendarDays.innerHTML = '<p style="padding:20px;">Календарь работает!</p>';
    console.log("Календарь успешно отрисован");
}

// Запуск
renderCalendar();
