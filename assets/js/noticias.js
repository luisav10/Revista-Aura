// Lógica do Calendário para a página de Notícias
document.addEventListener('DOMContentLoaded', () => {
    const searchDateButton = document.getElementById('searchDateButton');
    const calendarPopup = document.getElementById('calendarPopup');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const calendarGrid = document.getElementById('calendarGrid');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    const selectDateButton = document.getElementById('selectDateButton');
    
    let currentViewDate = new Date(); // Mês e ano atualmente exibidos no calendário
    
    function toggleCalendar() {
        calendarPopup.classList.toggle('active');
    }
    
    function generateCalendar(year, month) {
        calendarGrid.innerHTML = ''; // Limpa os dias anteriores
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Domingo, 1 = Segunda...
    
        currentMonthYear.textContent = `${firstDayOfMonth.toLocaleString('pt-br', { month: 'long' })} ${year}`;
        yearSelect.value = year;
        monthSelect.value = month;
    
        // Preenche dias vazios no início do mês
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('empty-day');
            calendarGrid.appendChild(emptyDay);
        }
    
        // Preenche os dias do mês
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.textContent = day;
            dayElement.dataset.date = new Date(year, month, day).toISOString().split('T')[0];
            dayElement.addEventListener('click', () => {
                // Remove 'selected' de todos os dias
                document.querySelectorAll('.calendar-day.selected').forEach(d => d.classList.remove('selected'));
                // Adiciona 'selected' ao dia clicado
                dayElement.classList.add('selected');
            });
            calendarGrid.appendChild(dayElement);
        }
    }
    
    function setupYearSelect() {
        const currentYear = new Date().getFullYear();
        for (let i = currentYear - 10; i <= currentYear + 5; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            yearSelect.appendChild(option);
        }
        yearSelect.value = currentYear;
    }
    
    searchDateButton.addEventListener('click', toggleCalendar);
    
    prevMonthButton.addEventListener('click', () => {
        currentViewDate.setMonth(currentViewDate.getMonth() - 1);
        generateCalendar(currentViewDate.getFullYear(), currentViewDate.getMonth());
    });
    
    nextMonthButton.addEventListener('click', () => {
        currentViewDate.setMonth(currentViewDate.getMonth() + 1);
        generateCalendar(currentViewDate.getFullYear(), currentViewDate.getMonth());
    });
    
    yearSelect.addEventListener('change', (event) => {
        currentViewDate.setFullYear(parseInt(event.target.value));
        generateCalendar(currentViewDate.getFullYear(), currentViewDate.getMonth());
    });
    
    monthSelect.addEventListener('change', (event) => {
        currentViewDate.setMonth(parseInt(event.target.value));
        generateCalendar(currentViewDate.getFullYear(), currentViewDate.getMonth());
    });
    
    selectDateButton.addEventListener('click', () => {
        const selectedDay = document.querySelector('.calendar-day.selected');
        if (selectedDay) {
            const date = selectedDay.dataset.date;
            alert(`Data selecionada: ${date}. Aqui você buscaria as notícias dessa data.`);
            toggleCalendar(); // Fecha o calendário após a seleção
        } else {
            alert('Por favor, selecione um dia.');
        }
    });
    
    setupYearSelect();
    generateCalendar(currentViewDate.getFullYear(), currentViewDate.getMonth());
    
    // Fechar o calendário ao clicar fora
    document.addEventListener('click', (event) => {
        if (!calendarPopup.contains(event.target) && !searchDateButton.contains(event.target) && calendarPopup.classList.contains('active')) {
            calendarPopup.classList.remove('active');
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const pautaForm = document.getElementById('pautaForm');
    const pautaFormWrapper = document.getElementById('pauta-form-wrapper');
    const pautaSuccessWrapper = document.getElementById('pauta-success-wrapper');
    const openPautaButton = document.getElementById('openPautaButton');
    const closePopupButton = document.querySelector('.close-popup');
    const popupOverlay = document.getElementById('popupPauta');

    openPautaButton.addEventListener('click', function(event) {
        event.preventDefault();
        popupOverlay.style.display = 'flex';
        pautaFormWrapper.style.display = 'block'; // Mostra o formulário
        pautaSuccessWrapper.style.display = 'none'; // Esconde a mensagem de sucesso
    });

    closePopupButton.addEventListener('click', function() {
        popupOverlay.style.display = 'none';
        pautaForm.reset(); // Limpa o formulário quando o pop-up é fechado
    });

    pautaForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Envia o formulário usando fetch para evitar recarregar a página
        fetch(pautaForm.action, {
            method: 'POST',
            body: new FormData(pautaForm),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Se o envio for bem-sucedido:
                // 1. Esconde o formulário
                pautaFormWrapper.style.display = 'none';
                // 2. Mostra a mensagem de sucesso
                pautaSuccessWrapper.style.display = 'block';
                // 3. Reseta o formulário para limpar os campos
                pautaForm.reset();
            } else {
                // Se houver erro, pode exibir uma mensagem de erro
                alert('Ocorreu um erro ao enviar a pauta. Por favor, tente novamente.');
            }
        })
        .catch(error => {
            alert('Ocorreu um erro ao enviar a pauta. Por favor, tente novamente.');
        });
    });
});