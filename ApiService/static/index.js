// Данные FAQ
const faqData = [
    {
        question: "Есть ли у сайта мобильная версия?",
        answer: "В данный момент у сайта Medinsite нет мобильного приложения, но планируем выпустить в будущем."
    },
    {
        question: "Для чего был создан сайт MedInsite?",
        answer: "Данный сайт был создан для того, чтобы помогать медицинским работникам быстрее и более точно принимать врачебные решения."
    },
    {
        question: "У меня есть идея для нового раздела на сайте. К кому можно обратиться?",
        answer: "Вы можете написать нам на почту example@mail.ru"
    },
    {
        question: "Как мне связаться с вашей компанией, если здесь нет ответа на мой вопрос?",
        answer: "Вы можете написать нам на почту example@mail.ru"
    }
];

// Функция создания FAQ
function createFaqSection(data) {
    const faqContainer = document.getElementById("faq-container");

    data?.forEach(item => {
        const faqItem = document.createElement("div");
        faqItem.className = "faq-item";

        const questionDiv = document.createElement("div");
        questionDiv.className = "faq-question";

        const ellipse = document.createElement("div");
        ellipse.className = "faq-ellipse";

        const questionSpan = document.createElement("span");
        questionSpan.textContent = item.question;

        const arrowIcon = document.createElement("i");
        arrowIcon.className = "bi bi-chevron-down arrow-icon";

        questionDiv.appendChild(ellipse);
        questionDiv.appendChild(questionSpan);
        questionDiv.appendChild(arrowIcon);

        const answerDiv = document.createElement("div");
        answerDiv.className = "faq-answer";

        const answerP = document.createElement("p");
        answerP.textContent = item.answer;

        answerDiv.appendChild(answerP);

        faqItem.appendChild(questionDiv);
        faqItem.appendChild(answerDiv);

        // Добавляем обработчик клика
        questionDiv.addEventListener("click", () => {
            faqItem.classList.toggle("open");
        });

        faqContainer.appendChild(faqItem);
    });
}

function faqHandler() {
    const questions = document.querySelectorAll('.faq-question');

    questions?.forEach(question => {
        const answer = question.nextElementSibling;
        const arrow = question.querySelector('i');
        const ellipse = question.querySelector('.faq-ellipse');

        question.addEventListener('click', function() {
            const isActive = this.classList.contains('active');

            // Закрываем все вопросы
            questions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.style.height = '0';
                q.querySelector('i').style.transform = 'rotate(0deg)';
                q.querySelector('.faq-ellipse').style.backgroundColor = '#A5A6F6';
            });

            // Открываем текущий если был закрыт
            if (!isActive) {
                this.classList.add('active');
                answer.style.height = answer.scrollHeight + 'px';
                arrow.style.transform = 'rotate(180deg)';
                ellipse.style.backgroundColor = '#5D5FEF';
            }
        });

        // Обработчик наведения
        question.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                ellipse.style.backgroundColor = '#5D5FEF';
            }
        });

        question.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                ellipse.style.backgroundColor = '#A5A6F6';
            }
        });
    });
};


const cardsData = [
    {
      title: "Мирамистин",
      image: "/images/result card/мирамистин.png",
      description: "Раствор для местного применения, предназначен для дезинфекции небольших по площади поверхностей изделий медицинского и ветеринарного назначения при инфекциях бактериальной, грибковой и вирусной этиологии.",
      link: "https://www.rlsnet.ru/drugs/miramistin-4584"
    },
    {
      title: "Дентесгель",
      image: "/images/result card/дентесгель.png",
      description: "Мягкий однородный гель желтовато-коричневого цвета с характерным запахом, свободный от крупинок, комков и посторонних частиц.",
      link: "https://www.rlsnet.ru/drugs/dentesgel-85391"
    },
    {
      title: "Кальцевита",
      image: "/images/result card/кальцевита.png",
      description: "Повышающее неспецифическую резистентность организма, улучшающее усвоение питательных веществ, стимулирующее остеогенез. Восполняет дефицит витаминов C, D3, B6 и кальция.",
      link: "https://www.rlsnet.ru/drugs/kalcevita-3158"
    },
    {
      title: "Кларитин",
      image: "/images/result card/кларитин.png",
      description: "Таблетки овальной формы белого или почти белого цвета, не содержащие посторонних включений, на одной стороне имеется риска.",
      link: "https://www.rlsnet.ru/drugs/klaritin-1646"
    },
    {
      title: "Меркаптопурин",
      image: "/images/result card/Меркаптопурин.png",
      description: "Таблетки светло-желтого цвета, плоскоцилиндрические, с фаской. На поверхности таблеток допускаются вкрапления.",
      link: "https://www.rlsnet.ru/drugs/merkaptopurin-4557"
    },
    {
      title: "Ренни",
      image: "/images/result card/ренни.png",
      description: "Таблетки жевательные: белые с кремоватым оттенком, квадратные, с гравировкой «RENNIE», с запахом мяты.",
      link: "https://www.rlsnet.ru/drugs/renni-2644"
    },
    {
      title: "Ренагель",
      image: "/images/result card/ренагель.png",
      description: "Овальные таблетки, покрытые пленочной оболочкой, почти белого цвета, с надписью «Renagel 800».",
      link: "https://www.rlsnet.ru/drugs/renagel-34627"
    },
    {
      title: "Фенибут",
      image: "/images/result card/фенибут.png",
      description: "Таблетки: круглые, плоскоцилиндрические, от белого до слегка желтоватого цвета, с фаской и риской.",
      link: "https://www.rlsnet.ru/drugs/fenibut-5083"
    }
];
function createCardSection(data) {
    const container = document.getElementById("cards-container");
    const dotsContainer = document.querySelector('.carousel-dots');
    if (!container || !dotsContainer) return;

    container.innerHTML = '';
    dotsContainer.innerHTML = '';

    // Массив для хранения экземпляров tooltips
    const tooltipInstances = [];

    // Функция инициализации tooltips (с отложением, если bootstrap не загружен)
    function initTooltips() {
        if (typeof bootstrap === 'undefined' || typeof bootstrap.Tooltip === 'undefined') {
            console.warn('Bootstrap или Tooltip не загружены. Повтор через 100мс...');
            setTimeout(initTooltips, 100);
            return;
        }

        // Удаляем старые tooltip'ы, если они были
        tooltipInstances.forEach(tooltip => {
            if (tooltip) tooltip.dispose();
        });
        tooltipInstances.length = 0;

        // Инициализируем новые
        document.querySelectorAll('.result-card[data-bs-toggle="tooltip"]').forEach(el => {
            // Убедимся, что tooltip не инициализирован дважды
            const tooltip = bootstrap.Tooltip.getInstance(el);
            if (tooltip) tooltip.dispose();
            tooltipInstances.push(new bootstrap.Tooltip(el));
        });
    }

    // Bootstrap row
    data.forEach(card => {
        let cardElement = document.createElement("div");
        cardElement.className = "result-card d-flex flex-column justify-content-center align-items-center";
        cardElement.style.maxWidth = '280px';
        cardElement.style.maxHeight = '200px';
        cardElement.style.flexShrink = '0';
        cardElement.style.position = 'relative'; // Важно для позиционирования tooltip
        cardElement.style.zIndex = '100';

        cardElement.setAttribute('data-bs-toggle', 'tooltip');
        cardElement.setAttribute('data-bs-html', 'true');
        cardElement.setAttribute('data-bs-placement', 'right');

        // Экранируем HTML и формируем title
        const tooltipContent = `
            <div style="font-family: sans-serif; font-size: 14px; margin: 0;">
                <div style="font-weight: bold; font-size: 15px; color: #1a1a1a; margin-bottom: 6px;">
                    ${escapeHtml(card.title)}
                </div>
                <div style="font-size: 13px; color: #555; margin-bottom: 8px;">
                    ${escapeHtml(card.description)}
                </div>
                <a href="${escapeHtml(card.link)}" target="_blank" style="color: #007bff; text-decoration: none; font-size: 13px;">
                    Подробнее →
                </a>
            </div>
        `;
        cardElement.setAttribute('title', tooltipContent);

        cardElement.innerHTML = `
            <img 
                src="/static/${card.image}" 
                alt="${escapeHtml(card.title)}"
                style="object-fit: cover; object-position: center; width: 100%; height: 100%; "
            >
        `;

        container.appendChild(cardElement);
    });

    // Запускаем инициализацию tooltips после рендеринга
    initTooltips();

    // Генерируем точки динамически
    const visibleCount = 4;
    const total = data.length;
    const dotsCount = Math.max(1, total - visibleCount + 1);
    for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot btn btn-light btn-sm rounded-circle mx-1 p-0';
        if (i === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
    }
}

// Утилита для экранирования HTML (защита от XSS и сломанных строк)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function AutoCardScroller() {
    const track = document.getElementById('cards-container');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    const carousel = document.getElementById('meds-carousel');
    const cards = document.querySelectorAll('.result-card');
    let dots = document.querySelectorAll('.carousel-dots .dot');

    if (!track || !prevBtn || !nextBtn || !dotsContainer || !cards.length) return;


    let currentIndex = 0;
    let autoScrollInterval = null;
    let isHovered = false;
    let resizeTimeout;

    // Определяем количество видимых карточек в зависимости от размера экрана
    function getVisibleCount() {
        const width = window.innerWidth;
        if (width < 576) return 1;      // xs
        if (width < 768) return 2;      // sm
        if (width < 992) return 3;      // md
        if (width < 1200) return 4;     // lg
        return 5;                       // xl
    }

    // Обновляем точки при изменении размера экрана
    function updateDots() {
        const visibleCount = getVisibleCount();
        const total = cards.length;
        const dotsCount = Math.max(1, total - visibleCount + 1);
        
        // Очищаем и пересоздаем точки
        dotsContainer.innerHTML = '';
        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot btn btn-light btn-sm rounded-circle mx-1 p-0';
            if (i === 0) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        }
        
        // Обновляем индекс, если он выходит за границы
        if (currentIndex >= dotsCount) {
            currentIndex = dotsCount - 1;
        }
        
        updateCarousel();
    }

    function updateCarousel() {
        const visibleCount = getVisibleCount();
        const cardWidth = cards[0].offsetWidth;
        const gap = 20; // gap между карточками
        const totalCardWidth = cardWidth + gap;
        
        // Показываем части соседних карточек
        const containerWidth = carousel.offsetWidth;
        const visibleWidth = visibleCount * totalCardWidth;
        const sidePadding = (containerWidth - visibleWidth) / 2;
        
        const offset = -currentIndex * totalCardWidth + sidePadding;
        track.style.transform = `translateX(${offset}px)`;
        
        // Обновляем активную точку
        dots = document.querySelectorAll('.carousel-dots .dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    function goTo(index) {
        const visibleCount = getVisibleCount();
        const total = cards.length;
        const dotsCount = Math.max(1, total - visibleCount + 1);
        
        if (index < 0) index = dotsCount - 1;
        if (index >= dotsCount) index = 0;
        
        currentIndex = index;
        updateCarousel();
    }

    // Обработчики событий
    prevBtn.addEventListener('click', () => {
        goTo(currentIndex - 1);
    });
    
    nextBtn.addEventListener('click', () => {
        goTo(currentIndex + 1);
    });
    
    dotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('dot')) {
            const idx = Array.from(dots).indexOf(e.target);
            if (idx !== -1) goTo(idx);
        }
    });

    // Автоматическая прокрутка
    function startAutoScroll() {
        if (autoScrollInterval) clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(() => {
            if (!isHovered) {
                goTo(currentIndex + 1);
            }
        }, 3500);
    }
    
    function stopAutoScroll() {
        if (autoScrollInterval) clearInterval(autoScrollInterval);
    }

    carousel.addEventListener('mouseenter', () => {
        isHovered = true;
        stopAutoScroll();
    });
    
    carousel.addEventListener('mouseleave', () => {
        isHovered = false;
        startAutoScroll();
    });

    // Swipe для мобильных
    let startX = 0;
    let isDragging = false;
    
    track.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
    });
    
    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const diff = e.touches[0].clientX - startX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goTo(currentIndex - 1);
            } else {
                goTo(currentIndex + 1);
            }
            isDragging = false;
        }
    });
    
    track.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Обработчик изменения размера окна
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateDots();
        }, 250);
    });

    // Инициализация
    updateDots();
    startAutoScroll();
}

const blogCards = [
    {
        image: '/images/гестационная.png',
        header_link: 'https://www.rmj.ru/articles/endokrinologiya/Gestacionnaya_giperglikemiya_i_perinatalynye_ishody/ ',
        subheader: 'Акушерство и гинекология',
        header: 'Гестационная гипергликемия и перинатальные исходы',
        text: 'Шапошникова Е.В., Менцик М.М., Гольцман Е.В. Перинатальные исходы. РМЖ. Мать и дитя. 2024;7(4):302-306.',
        author_photo: '/images/avatarки/марина.png',
        author_name: 'Марина К.',
        date: '15 Янв 2025'
    },
    {
        image: '/images/типы.png',
        header_link: 'https://docma.ru/article-zachem-nuzhen-solncezashchitnyi-krem-vesnoi/tpost/h8sug177x1-tipi-kozhi-kak-opredelit-i-zachem ',
        subheader: 'Дерматология',
        header: 'Типы кожи. Как определить и зачем?',
        text: 'Начну с того, что единой международной классификации типов кожи нет. Поэтому каждый врач самостоятельно выбирает свой подход...',
        author_photo: '/images/avatarки/Джон.png',
        author_name: 'Джон Ф.',
        date: '19 Янв 2025'
    },
    {
        image: '/images/сдвг.png',
        header_link: 'https://docma.ru/article-mnogoformnaya-eritema/tpost/6ccfi2hna1-svds-kak-snizit-riski ',
        subheader: 'Педиатрия',
        header: 'СВДС, как снизить риски?',
        text: 'СВДС определяется как внезапная смерть младенца в возрасте до одного года, которая остается необъяснимой...',
        author_photo: '/images/avatarки/жанна.png',
        author_name: 'Жанна М.',
        date: '18 Янв 2025'
    },
    {
        image: '/images/уход за телом.png',
        header_link: 'https://docma.ru/article-zachem-nuzhen-solncezashchitnyi-krem-vesnoi/tpost/t9arej7m31-uhod-za-telom-v-letnee-vremya ',
        subheader: 'Дерматология',
        header: 'Уход за телом в летнее время',
        text: 'В чем же разница? Летом повышается температура воздуха, вследствие больше потливости и жирности кожи, но...',
        author_photo: '/images/avatarки/алекс.png',
        author_name: 'Алекс Д.',
        date: '17 Янв 2025'
    },
    {
        image: '/images/сердце.png',
        header_link: 'https://docma.ru/tpost/ygb8dapmt1-infektsionnie-zabolevaniya-serdtsa ',
        subheader: 'Кардиология',
        header: 'Инфекционные заболевания сердца',
        text: 'К кардиологу редко обращаются с инфекционными болезнями. Однако, сердце тоже попадает под атаку вирусов и микробов.',
        author_photo: '/images/avatarки/кристина.png',
        author_name: 'Кристина Б.',
        date: '16 Янв 2025'
    },
    {
        image: '/images/белые пятна на.png',
        header_link: 'https://docma.ru/tpost/imncsxf7e1-belie-pyatna-na-zubah ',
        subheader: 'Стоматология',
        header: 'Белые пятна на зубах',
        text: 'Белые пятна на зубах\nЧто это и чем опасно?',
        author_photo: '/images/avatarки/наталия.png',
        author_name: 'Наталья У.',
        date: '15 Янв 2025'
    },
    {
        image: '/images/ком в горле.png',
        header_link: 'https://docma.ru/article-nevralgiya-trojnichnogo-nerva/tpost/3uu7ux9yr1-kom-v-gorle-meloch-ili-trevozhnii-simpto ',
        subheader: 'Неврология',
        header: 'Ком в горле: мелочь или тревожный симптом?',
        text: '',
        author_photo: '/images/avatarки/екатирина.png',
        author_name: 'Екатерина М.',
        date: '14 Янв 2025'
    },
    {
        image: '/images/рак.png',
        header_link: '#',
        subheader: 'Онкология',
        header: 'Рак яичников',
        text: 'Рак яичников это разрастание клеток, образующееся в области яичников. Клетки быстро размножаются, могут проникать в здоровые ткани.',
        author_photo: '/images/avatarки/андрюха.png',
        author_name: 'Андрей З.',
        date: '21 Янв 2023'
    },
    {
        image: '/images/чай против.png',
        header_link: '#',
        subheader: 'Терапия',
        header: 'Чай против сахарного диабета',
        text: '',
        author_photo: '/images/avatarки/димон.png',
        author_name: 'Дмитрий Л.',
        date: '12 Янв 2025'
    }
];

function createCardForBlog(data) {
    const container = document.getElementById("blog-container");
    data.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.className = "blog-post-card mx-4 my-4";
        cardElement.style.maxHeight = "580px";
        cardElement.style.maxWidth = "340px";
        cardElement.innerHTML = `
            <div class="blog-image-wrapper">
                <img class="blog-image" src="static${card.image}" alt="${card.subheader}">
            </div>
            <div class="d-flex flex-column justify-content-between align-items-start position-relative w-100 flex-grow-1 pt-1"  style="padding-top: 5px;">
                <div class="d-flex flex-column">
                    <div class="text-uppercase fw-semibold" style="font-size: 14px; color: #4F9CF9; letter-spacing: 0.5px; line-height: 1.5;">${card.subheader}</div>
                    <a href="${card.header_link}" target="_blank" rel="noopener noreferrer" class="text-decoration-none">
                        <div class="d-flex align-items-start gap-2 pt-1" style="min-height: 56px;">
                            <div class="flex-grow-1 fw-bold" style="font-size: 20px; color: #1e293b; line-height: 1.4; margin-bottom: 12px;">
                                ${card.header}
                            </div>
                        </div>
                    </a>
                    <p class="mb-4" style="font-size: 16px; color: #64748b; line-height: 1.6;">
                        ${card.text}
                    </p>
                </div>
                <div class="d-flex align-items-center gap-3 mt-auto">
                    <img src="static/${card.author_photo}" alt="Автор ${card.author_name}" class="rounded-circle" style="width: 40px; height: 40px; object-fit: cover; background-color: #e2e8f0;" />
                    <div>
                        <div class="fw-semibold text-dark" style="font-size: 14px; line-height: 1.5; margin-top: -1px;">${card.author_name}</div>
                        <div class="text-muted" style="font-size: 14px; line-height: 1.5;">${card.date}</div>
                    </div>
                    <div class="blog-icon">
                        <i class="bi bi-arrow-up-right"></i>
                    </div>
                </div>
            </div>
        `;
        container?.appendChild(cardElement);
    });
    // Добавляем кнопку "Далее"
    const actionDiv = document.createElement("div");
    actionDiv.className = "blog-action";
    actionDiv.innerHTML = `
        <button class="blog-button">
            <div class="blog-button-content">
                <i class="bi bi-arrow-right"></i>
                <div>Далее</div>
            </div>
        </button>
    `;
    container?.appendChild(actionDiv);
};

function openBurgerMenu() {
    var burgerBtn = document.getElementById('burgerMenuBtn');
    var mobileMenu = document.getElementById('mobileMenu');
    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', function() {
            var bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(mobileMenu);
            bsOffcanvas.show();
        });
    }
}

function starHandler() {
    // Скрипт для подсветки звезд слева направо
    const stars = document.querySelectorAll('#rating-stars .star-label');
    const radios = document.querySelectorAll('#rating-stars input[type="radio"]');
    let selected = 0;

    function highlightStars(count) {
        stars.forEach((star, idx) => {
            if (idx < count) {
                star.classList.add('gold');
            } else {
                star.classList.remove('gold');
            }
        });
    }

    stars.forEach((star, idx) => {
        star.addEventListener('mouseenter', function() {
            highlightStars(idx + 1);
        });
        star.addEventListener('mouseleave', function() {
            highlightStars(selected);
        });
        star.addEventListener('click', function() {
            selected = idx + 1;
            highlightStars(selected);
            radios[idx].checked = true;
        });
    });

    // Если уже выбрано (например, после отправки формы)
    radios.forEach((radio, idx) => {
        if (radio.checked) {
            selected = idx + 1;
            highlightStars(selected);
        }
    });
}

function uploadAriaHandler() {
    const uploadArea = document.querySelector('.upload-area');
    const uploadButton = document.querySelector('.upload-button');
    const uploadContent = document.querySelector('.upload-content');  
    if (!uploadArea || !uploadButton || !uploadContent) return;

    // Создаем скрытый input для выбора файла
    const fileInput = document.createElement('input');
    fileInput.type = 'file';

    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // Состояние загрузки
    let isUploading = false;

    // Функция для показа состояния загрузки
    function showUploadingState() {
        if (isUploading) return;
        isUploading = true;
        
        uploadContent.innerHTML = `
            <div class="text-center">
                <div class="upload-progress mb-3">
                    <div class="progress-circle d-flex align-items-center justify-content-center mb-3">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Загрузка...</span>
                        </div>
                    </div>
                    <div class="progress mb-2" style="height: 8px;">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" 
                             role="progressbar" 
                             style="width: 0%" 
                             id="upload-progress">
                        </div>
                    </div>
                    <small class="text-light" id="upload-status">Подготовка к загрузке...</small>
                </div>
            </div>
        `;
        
        uploadArea.style.backgroundColor = 'rgba(79, 156, 249, 0.1)';
        uploadArea.style.borderColor = '#4F9CF9';    }

    // Функция для показа прогресса загрузки
    function updateProgress(percent, status) {
        const progressBar = document.getElementById('upload-progress');
        const statusText = document.getElementById('upload-status');
        
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
        if (statusText) {
            statusText.textContent = status;
        }
    }

    // Функция для завершения загрузки
    function showSuccessState() {
        uploadContent.innerHTML = `
            <div class="text-center">
                <div class="upload-success mb-3">
                    <i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>
                </div>
                <h5 class="text-success mb-2">Файл успешно загружен!</h5>
                <p class="text-light mb-3">Загрузка изображения завершена</p>
                <button class="btn btn-outline-light btn-sm" onclick="resetUploadArea()">
                    Загрузить еще один файл
                </button>
            </div>
        `;
        
        uploadArea.style.backgroundColor = 'rgba(25, 135, 84, 0.1)';
        uploadArea.style.borderColor = '#198754';    
    
        
    }

    // Функция для показа ошибки
    function showErrorState(error) {
        uploadContent.innerHTML = `
            <div class="text-center">
                <div class="upload-error mb-3">
                    <i class="bi bi-exclamation-triangle-fill text-warning" style="font-size: 3rem;"></i>
                </div>
                <h5 class="text-warning mb-2">Ошибка загрузки</h5>
                <p class="text-light mb-3">${error}</p>
                <button class="btn btn-outline-light btn-sm" onclick="resetUploadArea()">
                    Попробовать снова
                </button>
            </div>
        `;
        }

    // Функция для сброса области загрузки
    window.resetUploadArea = function() {       
        isUploading = false;
        uploadContent.innerHTML = `
            <div class="upload-icon mb-3">
                <i class="bi bi-cloud-arrow-up" style="font-size:2rem; color: #4F9CF9;"></i>
            </div>
            <p class="upload-text-main mb-2">Перетащите изображение сюда или кликните для выбора файла</p>
            <p class="upload-text-secondary text-light mb-4">Держиваемые форматы: JPG, PNG, DICOM, TIFF (до 20 МБ)</p>
            <button class="upload-button btn btn-primary px-4 py-2" style="background-color: #4F9CF9; border: none;">                Загрузить фото <i class="bi bi-arrow-right ms-2"></i>
            </button>
        `;
        
        uploadArea.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        uploadArea.style.borderColor = '';
        
        // Переподключаем обработчики
        uploadAriaHandler();
    };

    // Функция для обработки файла
    function handleFile(file) {
        showUploadingState();
        
        // Имитация загрузки файла
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100      
            updateProgress(progress, `Загрузка файла... ${Math.round(progress)}%`);
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    updateProgress(100, 'Загрузка изображения...');
                    setTimeout(() => {
                        showSuccessState();
                        // Отправляем файл на эндпоинт '/api/media'
                        const formData = new FormData();
                        formData.append('file', file);

                        fetch('/api/media', {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Ошибка загрузки файла на сервер');
                            }
                            return response.json();
                        })
                        .catch(error => {
                            showErrorState('Ошибка при отправке файла: ' + error.message);
                        });
                    }, 2000);
                }, 500);
            }
        }, 20);
    }

    // Обработчик клика по кнопке
    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });

    // Обработчик выбора файла
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    });

    // Drag and Drop обработчики
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.backgroundColor = 'rgba(79, 156, 249, 0.1)';
        uploadArea.style.borderColor = '#4F9CF9';
        uploadArea.style.transform = 'scale(1.1)';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        if (!uploadArea.contains(e.relatedTarget)) {
            uploadArea.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            uploadArea.style.borderColor = '';
            uploadArea.style.transform = 'scale(1)';
        }
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.backgroundColor = 'rgba(255, 255, 255, 1)';
        uploadArea.style.borderColor = '';
        uploadArea.style.transform = 'scale(1)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // Добавляем CSS для анимаций
    const style = document.createElement('style');
    style.textContent = `
        .upload-area {
            transition: all 0.3s ease;
            cursor: pointer;
        }
        .upload-area:hover {
            background-color: rgba(255, 255, 255, 0.15) !important;
        }
        .progress-circle {
            width: 60px;
            height: 60px;
            margin: 0 auto;
        }
        .upload-progress {
            max-width: 300px;
            margin: 0 auto;
        }
    `;
    document.head.appendChild(style);
}

// Глобальный объект для хранения изображений и состояния
const CanvasApp = {
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    images: [], // [{ x, y, blob, img }]
    canvas: null,
    ctx: null
};

// Инициализация canvas
function initCanvas() {
    CanvasApp.canvas = document.getElementById('tileCanvas');
    CanvasApp.ctx = CanvasApp.canvas.getContext('2d');

    CanvasApp.canvas.width = window.innerWidth;
    CanvasApp.canvas.height = window.innerHeight;

    setupEventListeners();
    redraw();
}

// Установка обработчиков
function setupEventListeners() {
    const canvas = CanvasApp.canvas;

    // Перетаскивание
    canvas.addEventListener('mousedown', (e) => {
        CanvasApp.isDragging = true;
        CanvasApp.lastX = e.clientX;
        CanvasApp.lastY = e.clientY;
});

canvas.addEventListener('mousemove', (e) => {
    if (CanvasApp.isDragging) {
        const dx = e.clientX - CanvasApp.lastX;
        const dy = e.clientY - CanvasApp.lastY;
        CanvasApp.offsetX += dx;
        CanvasApp.offsetY += dy;
        CanvasApp.lastX = e.clientX;
        CanvasApp.lastY = e.clientY;
        redraw();
    }
});

window.addEventListener('mouseup', () => {
    CanvasApp.isDragging = false;
});

window.addEventListener('mouseleave', () => {
    CanvasApp.isDragging = false;
});

// Масштабирование (исправлено — не уезжает!)
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Точка в мире до зума
    const worldX = (mouseX - CanvasApp.offsetX) / CanvasApp.scale;
    const worldY = (mouseY - CanvasApp.offsetY) / CanvasApp.scale;

    // Изменение масштаба
    const zoomFactor = 0.1;
    if (e.deltaY < 0) {
        CanvasApp.scale *= (1 + zoomFactor); // приблизить
    } else {
        CanvasApp.scale /= (1 + zoomFactor); // отдалить
    }

    // Ограничение
    CanvasApp.scale = Math.max(0.1, Math.min(CanvasApp.scale, 50));

    // Новое смещение, чтобы точка осталась под курсором
    CanvasApp.offsetX = mouseX - worldX * CanvasApp.scale;
    CanvasApp.offsetY = mouseY - worldY * CanvasApp.scale;

    redraw();
});

// Адаптация под размер окна
window.addEventListener('resize', () => {
    CanvasApp.canvas.width = window.innerWidth;
    CanvasApp.canvas.height = window.innerHeight;
    redraw();
});
}

// Загрузка изображения с сервера
async function getMedia(filename) {
    try {
        const response = await fetch('http://localhost:6003/api/media/' + filename);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        return blob;
    } catch (err) {
        console.error("Ошибка загрузки файла:", filename, err);
        return null;
    }
}

// Рисование изображения на canvas
function drawOnCanvas(x, y, imageBlob) {
    if (!imageBlob) return;

    const img = new Image();
    img.src = URL.createObjectURL(imageBlob);

    img.onload = () => {
        // Сохраняем изображение для перерисовки
        CanvasApp.images.push({ x, y, img });

        // Перерисовываем с новым изображением
        redraw();
    };

    img.onerror = () => {
        console.error("Не удалось загрузить изображение");
    };
}

// Основная функция перерисовки
function redraw() {
    const ctx = CanvasApp.ctx;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();

    // Применяем смещение и масштаб
    ctx.translate(CanvasApp.offsetX, CanvasApp.offsetY);
    ctx.scale(CanvasApp.scale, CanvasApp.scale);

    // Рисуем сетку
    drawGrid(ctx);

    // Рисуем все изображения
    CanvasApp.images.forEach(item => {
        ctx.drawImage(item.img, item.x, item.y);
    });

    ctx.restore();
}

// Рисуем сетку
function drawGrid(ctx) {
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    const gridSize = 50;

    const startX = Math.floor(-CanvasApp.offsetX / CanvasApp.scale / gridSize) * gridSize;
    const startY = Math.floor(-CanvasApp.offsetY / CanvasApp.scale / gridSize) * gridSize;
    const endX = startX + (ctx.canvas.width / CanvasApp.scale) + gridSize;
    const endY = startY + (ctx.canvas.height / CanvasApp.scale) + gridSize;

    for (let x = startX; x < endX; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();
    }
    for (let y = startY; y < endY; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
    }
}

function wsConnect () {
    const ws = new WebSocket("ws://localhost:6003/api/ws");

    ws.onopen = () => {
        console.log("✅ Подключено к WebSocket");
    };

    ws.onmessage = async (event) => {
        const data = event.data;
        console.log("📩 Получено: " + data);

        // Если сообщение в формате JSON — можно обработать
        try {
            const json = JSON.parse(data);
            console.log("🔍 JSON:", json);
            let x = json.filename.split('_')[0]
            let y = json.filename.split('_')[1]
            console.log(x, y);
            let image = await getMedia(json.filename)
            drawOnCanvas(x, y, image)
            // Здесь можно обновить UI: показать уведомление и т.п.
        } catch (e) {
        // Не JSON — просто игнорируем
        }
    };

    ws.onerror = (error) => {
        console.log("❌ Ошибка WebSocket: ");
        console.log(error)
    };

    ws.onclose = (event) => {
        console.log(`⚠️ Соединение закрыто, код: ${event.code}, причина: ${event.reason}`);
        
        // Переподключение через 3 секунды
        setTimeout(() => {
            console.log("🔄 Попытка переподключения...");
            wsConnect();
        }, 3000);
    };
}



// Запуск при загрузке страницы
window.addEventListener('DOMContentLoaded', function() {
    createFaqSection(faqData);
    faqHandler();
    createCardSection(cardsData);
    AutoCardScroller();
    createCardForBlog(blogCards);
    openBurgerMenu();
    starHandler();
    uploadAriaHandler();
    wsConnect();
    initCanvas();

    document.querySelectorAll('.offcanvas a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
    
          if (targetElement) {
            e.preventDefault();
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasRight'));
            if (bsOffcanvas) bsOffcanvas.hide();
    
            // Через небольшую задержку — прокрутка
            setTimeout(() => {
              targetElement.scrollIntoView({ behavior: 'smooth' });
            }, 300);
          }
        });
    });
});

