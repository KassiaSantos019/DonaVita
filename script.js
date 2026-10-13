const bloodChartData = {
    'geral': [
        { type: 'O-', urgency: 95, status: 'critical', desc: 'Doador Universal - Estoque Crítico em todo o país' },
        { type: 'O+', urgency: 88, status: 'critical', desc: 'Maior demanda em pronto-socorros e cirurgias' },
        { type: 'A-', urgency: 78, status: 'warning', desc: 'Estoque baixo, necessidade de reposição' },
        { type: 'B-', urgency: 72, status: 'warning', desc: 'Necessidade moderada alta' },
        { type: 'A+', urgency: 55, status: 'regular', desc: 'Estoque em nível regular' },
        { type: 'B+', urgency: 45, status: 'regular', desc: 'Estoque equilibrado' },
        { type: 'AB-', urgency: 40, status: 'regular', desc: 'Demanda sob controle' },
        { type: 'AB+', urgency: 25, status: 'regular', desc: 'Receptor Universal - Nível Estável' }
    ],
    'SP': [
        { type: 'O-', urgency: 98, status: 'critical', desc: 'Hemocentros de SP em alerta vermelho' },
        { type: 'O+', urgency: 90, status: 'critical', desc: 'Alta necessidade nos grandes hospitais' },
        { type: 'A-', urgency: 82, status: 'critical', desc: 'Estoque abaixo de 30%' },
        { type: 'B-', urgency: 68, status: 'warning', desc: 'Necessidade constante' },
        { type: 'A+', urgency: 50, status: 'regular', desc: 'Nível adequado' },
        { type: 'B+', urgency: 40, status: 'regular', desc: 'Estoque regular' },
        { type: 'AB-', urgency: 35, status: 'regular', desc: 'Estável' },
        { type: 'AB+', urgency: 20, status: 'regular', desc: 'Estável' }
    ],
    'RJ': [
        { type: 'O-', urgency: 94, status: 'critical', desc: 'Hemorio convoca doadores de O-' },
        { type: 'A-', urgency: 86, status: 'critical', desc: 'Estoque reduzido' },
        { type: 'O+', urgency: 85, status: 'critical', desc: 'Demanda de emergência' },
        { type: 'B-', urgency: 75, status: 'warning', desc: 'Atenção necessária' },
        { type: 'A+', urgency: 60, status: 'warning', desc: 'Abaixo da meta semanal' },
        { type: 'B+', urgency: 42, status: 'regular', desc: 'Estável' },
        { type: 'AB-', urgency: 30, status: 'regular', desc: 'Estável' },
        { type: 'AB+', urgency: 22, status: 'regular', desc: 'Estável' }
    ],
    'MG': [
        { type: 'O-', urgency: 92, status: 'critical', desc: 'Rede Hemominas convoca doadores' },
        { type: 'O+', urgency: 84, status: 'critical', desc: 'Alta demanda em leitos de CTI' },
        { type: 'B-', urgency: 78, status: 'warning', desc: 'Estoque baixo' },
        { type: 'A-', urgency: 70, status: 'warning', desc: 'Alerta amarelo' },
        { type: 'A+', urgency: 52, status: 'regular', desc: 'Nível satisfatório' },
        { type: 'B+', urgency: 48, status: 'regular', desc: 'Estável' },
        { type: 'AB-', urgency: 38, status: 'regular', desc: 'Estável' },
        { type: 'AB+', urgency: 28, status: 'regular', desc: 'Estável' }
    ],
    'PR': [
        { type: 'O-', urgency: 90, status: 'critical', desc: 'Hemepar em estado de emergência' },
        { type: 'O+', urgency: 82, status: 'critical', desc: 'Necessidade de doações' },
        { type: 'A-', urgency: 74, status: 'warning', desc: 'Alerta para reposição' },
        { type: 'B-', urgency: 65, status: 'warning', desc: 'Atenção preventiva' },
        { type: 'A+', urgency: 48, status: 'regular', desc: 'Estável' },
        { type: 'B+', urgency: 40, status: 'regular', desc: 'Estável' },
        { type: 'AB-', urgency: 32, status: 'regular', desc: 'Estável' },
        { type: 'AB+', urgency: 20, status: 'regular', desc: 'Estável' }
    ]
};

function updateBloodChart() {
    const regionSelect = document.getElementById("chart-region-filter");
    if (!regionSelect) return;
    const region = regionSelect.value;
    const container = document.getElementById("blood-chart-container");
    const items = bloodChartData[region] || bloodChartData['geral'];

    if (!container) return;
    container.innerHTML = "";

    items.forEach(item => {
        let barColor = "bg-palette-wine";
        let badgeBg = "bg-palette-wine text-white";
        let badgeText = "Crítico";

        if (item.status === 'warning') {
            barColor = "bg-amber-500";
            badgeBg = "bg-amber-100 text-amber-900 border border-amber-300";
            badgeText = "Alerta";
        } else if (item.status === 'regular') {
            barColor = "bg-emerald-600";
            badgeBg = "bg-emerald-100 text-emerald-900 border border-emerald-300";
            badgeText = "Estável";
        }

        const row = document.createElement("div");
        row.className = "space-y-1.5";
        row.innerHTML = `
            <div class="flex items-center justify-between text-xs font-bold text-palette-espresso">
                <div class="flex items-center space-x-2">
                    <span class="w-8 text-sm font-extrabold text-palette-wine">${item.type}</span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${badgeBg}">${badgeText}</span>
                    <span class="hidden sm:inline text-palette-espresso/70 text-xs font-medium ml-2">- ${item.desc}</span>
                </div>
                <span class="font-extrabold">${item.urgency}% Urgência</span>
            </div>

            <div class="w-full bg-white h-4 rounded-full p-0.5 border border-palette-rose/50 overflow-hidden shadow-inner">
                <div class="chart-bar-fill h-full rounded-full ${barColor}" style="width: 0%"></div>
            </div>
        `;
        container.appendChild(row);

        setTimeout(() => {
            const fill = row.querySelector('.chart-bar-fill');
            if (fill) fill.style.width = `${item.urgency}%`;
        }, 50);
    });
}

const bloodBanksData = [
    {
        name: "Hemocentro de Itapetininga",
        city: "Itapetininga",
        state: "SP",
        address: "Rua Padre Antônio Brunetti, 500 - Centro",
        phone: "(15) 3271-1234",
        hours: "Segunda a Sexta: 07h às 12h",
        stocks: { 'O+': 'critical', 'O-': 'critical', 'A+': 'regular', 'A-': 'warning', 'B+': 'regular', 'B-': 'warning', 'AB+': 'good', 'AB-': 'good' }
    },
    {
        name: "Fundação Pró-Sangue (Posto Clínicas)",
        city: "São Paulo",
        state: "SP",
        address: "Av. Dr. Enéas Carvalho de Aguiar, 155 - Cerqueira César",
        phone: "(11) 4573-7800",
        hours: "Segunda a Sábado: 07h às 18h",
        stocks: { 'O+': 'warning', 'O-': 'critical', 'A+': 'good', 'A-': 'critical', 'B+': 'regular', 'B-': 'warning', 'AB+': 'good', 'AB-': 'regular' }
    },
    {
        name: "Hemorio (Instituto Estadual do Sangue)",
        city: "Rio de Janeiro",
        state: "RJ",
        address: "Rua Frei Caneca, 8 - Centro",
        phone: "(21) 2332-8611",
        hours: "Diariamente: 07h às 18h",
        stocks: { 'O+': 'critical', 'O-': 'critical', 'A+': 'warning', 'A-': 'warning', 'B+': 'good', 'B-': 'critical', 'AB+': 'good', 'AB-': 'regular' }
    },
    {
        name: "Hemepar - Centro de Hematologia de Curitiba",
        city: "Curitiba",
        state: "PR",
        address: "Tv. João Prosdócimo, 145 - Alto da XV",
        phone: "(41) 3281-4000",
        hours: "Segunda a Sexta: 07h30 às 18h",
        stocks: { 'O+': 'good', 'O-': 'warning', 'A+': 'good', 'A-': 'regular', 'B+': 'good', 'B-': 'regular', 'AB+': 'good', 'AB-': 'good' }
    },
    {
        name: "Hemominas - Alameda Ezequiel Dias",
        city: "Belo Horizonte",
        state: "MG",
        address: "Alameda Ezequiel Dias, 321 - Santa Efigênia",
        phone: "(31) 3768-4500",
        hours: "Segunda a Sábado: 07h às 18h",
        stocks: { 'O+': 'critical', 'O-': 'critical', 'A+': 'warning', 'A-': 'regular', 'B+': 'warning', 'B-': 'warning', 'AB+': 'good', 'AB-': 'good' }
    }
];

const defaultStories = [
    {
        author: "Lucas Mendes",
        role: "Doador Frequente",
        text: "Faço doações contínuas há 5 anos. Saber que a Dona Vita facilita para encontrar os hemocentros no momento em que eles mais precisam me motiva muito!",
        date: "Há 2 dias"
    },
    {
        author: "Camila Rocha",
        role: "Receptora Agradecida",
        text: "Passei por uma cirurgia delicada e recebi 3 bolsas de sangue. Minha eterna gratidão a cada doador voluntário que nos dá uma segunda chance!",
        date: "Há 1 semana"
    },
    {
        author: "Rafael Souza",
        role: "Doador de Primeira Viagem",
        text: "Sempre tive medo do processo, mas a equipe do posto de coleta explicou tudo pacientemente. O lanche final e a alegria de ajudar valem cada segundo!",
        date: "Há 3 dias"
    }
];

const quizQuestions = [
    {
        question: "Qual é a sua idade atual?",
        options: [
            { text: "Menos de 16 anos", eligible: false, reason: "A idade mínima para doação no Brasil é 16 anos (com autorização de responsável)." },
            { text: "Entre 16 e 69 anos", eligible: true },
            { text: "70 anos ou mais", eligible: false, reason: "A idade máxima permitida para doação de sangue é 69 anos." }
        ]
    },
    {
        question: "Qual o seu peso corporal aproximado?",
        options: [
            { text: "Abaixo de 50 kg", eligible: false, reason: "É necessário pesar no mínimo 50 kg para doar com total segurança." },
            { text: "50 kg ou mais", eligible: true }
        ]
    },
    {
        question: "Fez alguma tatuagem, maquiagem definitiva ou piercing nos últimos meses?",
        options: [
            { text: "Sim, há menos de 6 meses", eligible: false, reason: "É preciso aguardar de 6 a 12 meses após a realização de tatuagens ou piercings." },
            { text: "Não / Há mais de 12 meses", eligible: true }
        ]
    },
    {
        question: "Teve febre, gripe, sintoma de infecção ou tomou vacina recentemente?",
        options: [
            { text: "Sim, nos últimos 15 dias", eligible: false, reason: "É necessário aguardar a recuperação completa e a janela de inativação vacinal." },
            { text: "Não, estou 100% saudável", eligible: true }
        ]
    },
    {
        question: "Ingeriu bebida alcoólica nas últimas 12 horas?",
        options: [
            { text: "Sim, ingeri álcool hoje ou ontem à noite", eligible: false, reason: "É necessário estar sem consumir bebidas alcoólicas por pelo menos 12 horas." },
            { text: "Não consumi álcool", eligible: true }
        ]
    }
];

let currentQuizIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    updateBloodChart();
    renderHemocentros(bloodBanksData);
    loadQuizQuestion(currentQuizIndex);
    loadStories();

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const menu = document.getElementById('mobile-menu');
            if (menu) menu.classList.toggle('hidden');
        });
    }
});

function renderHemocentros(list) {
    const container = document.getElementById("hemocentros-list");
    if (!container) return;
    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = `
            <div class="col-span-2 text-center py-12 bg-white rounded-2xl border border-dashed border-palette-rose">
                <i class="fa-solid fa-location-dot-slash text-4xl text-palette-wine/40 mb-3"></i>
                <p class="text-palette-espresso font-medium">Nenhum hemocentro encontrado para essa cidade.</p>
            </div>`;
        return;
    }

    list.forEach(bank => {
        const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bank.name + " " + bank.city)}`;
        
        const card = document.createElement("div");
        card.className = "bg-white p-6 rounded-2xl border border-palette-rose/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between";
        
        let stockBadgesHTML = "";
        Object.keys(bank.stocks).forEach(type => {
            const status = bank.stocks[type];
            let bg = "bg-emerald-100 text-emerald-900 border-emerald-300";
            if (status === 'critical') bg = "bg-palette-wine text-white border-palette-wine font-extrabold";
            if (status === 'warning') bg = "bg-amber-100 text-amber-900 border-amber-300 font-bold";

            stockBadgesHTML += `
                <div class="flex flex-col items-center justify-center p-2 rounded-xl border text-center ${bg}">
                    <span class="text-xs font-black">${type}</span>
                </div>
            `;
        });

        card.innerHTML = `
            <div>
                <div class="flex items-start justify-between">
                    <div>
                        <span class="text-[10px] font-extrabold text-palette-wine uppercase tracking-wider bg-palette-rose/30 px-2.5 py-0.5 rounded-full border border-palette-rose/50">${bank.state} • ${bank.city}</span>
                        <h3 class="text-lg font-bold text-palette-espresso mt-1">${bank.name}</h3>
                    </div>
                    <span class="p-2.5 bg-palette-rose/40 text-palette-wine rounded-xl border border-palette-rose/60"><i class="fa-solid fa-hospital"></i></span>
                </div>

                <div class="mt-4 space-y-2 text-xs text-palette-espresso/80 font-medium">
                    <p><i class="fa-solid fa-location-dot w-4 text-palette-wine"></i> ${bank.address}</p>
                    <p><i class="fa-solid fa-phone w-4 text-palette-wine"></i> ${bank.phone}</p>
                    <p><i class="fa-solid fa-clock w-4 text-palette-wine"></i> ${bank.hours}</p>
                </div>

                <div class="mt-6">
                    <p class="text-xs font-bold text-palette-espresso mb-2">Estoque Local:</p>
                    <div class="grid grid-cols-4 gap-2">
                        ${stockBadgesHTML}
                    </div>
                </div>
            </div>

            <div class="mt-6 pt-4 border-t border-palette-rose/40 flex items-center justify-between">
                <a href="${mapSearchUrl}" target="_blank" rel="noopener" class="text-xs font-bold text-palette-wine hover:text-palette-espresso transition-colors flex items-center">
                    <i class="fa-solid fa-route mr-1.5 text-palette-coral"></i> Ver no Google Maps
                </a>
                <span class="text-[10px] font-bold text-palette-espresso/50">Dona Vita Informa</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterBloodBanks() {
    const input = document.getElementById("city-search-input");
    if (!input) return;
    const query = input.value.toLowerCase().trim();
    const filtered = bloodBanksData.filter(b => 
        b.city.toLowerCase().includes(query) || 
        b.state.toLowerCase().includes(query) ||
        b.name.toLowerCase().includes(query)
    );
    renderHemocentros(filtered);
}

function loadQuizQuestion(index) {
    const box = document.getElementById("quiz-question-box");
    if (!box) return;
    const q = quizQuestions[index];

    const progressPercent = Math.round(((index + 1) / quizQuestions.length) * 100);
    const progressText = document.getElementById("quiz-progress-text");
    const progressPercentEl = document.getElementById("quiz-progress-percent");
    const progressBar = document.getElementById("quiz-progress-bar");

    if (progressText) progressText.innerText = `PERGUNTA ${index + 1} DE ${quizQuestions.length}`;
    if (progressPercentEl) progressPercentEl.innerText = `${progressPercent}%`;
    if (progressBar) progressBar.style.width = `${progressPercent}%`;

    let optionsHTML = "";
    q.options.forEach((opt) => {
        const safeReason = (opt.reason || '').replace(/'/g, "\\'");
        optionsHTML += `
            <button onclick="handleQuizAnswer(${opt.eligible}, '${safeReason}')" class="w-full text-left p-4 rounded-xl border border-palette-rose/60 hover:border-palette-wine hover:bg-white text-palette-espresso font-semibold text-sm transition-all flex items-center justify-between group">
                <span>${opt.text}</span>
                <i class="fa-solid fa-chevron-right text-palette-rose group-hover:text-palette-wine transition-colors"></i>
            </button>
        `;
    });

    box.innerHTML = `
        <h3 class="text-lg font-bold text-palette-espresso">${q.question}</h3>
        <div class="space-y-3">${optionsHTML}</div>
    `;
}

function handleQuizAnswer(eligible, reason) {
    if (!eligible) {
        showQuizResult(false, reason);
        return;
    }

    if (currentQuizIndex < quizQuestions.length - 1) {
        currentQuizIndex++;
        loadQuizQuestion(currentQuizIndex);
    } else {
        showQuizResult(true);
    }
}

function showQuizResult(isEligible, reason = "") {
    const questionBox = document.getElementById("quiz-question-box");
    const resultBox = document.getElementById("quiz-result-box");
    if (questionBox) questionBox.classList.add("hidden");
    if (resultBox) resultBox.classList.remove("hidden");

    const icon = document.getElementById("quiz-result-icon");
    const title = document.getElementById("quiz-result-title");
    const desc = document.getElementById("quiz-result-desc");

    if (isEligible) {
        if (icon) {
            icon.className = "w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl bg-emerald-100 text-emerald-800 border border-emerald-300";
            icon.innerHTML = '<i class="fa-solid fa-check"></i>';
        }
        if (title) {
            title.innerText = "Você está apto a doar hoje!";
            title.className = "text-2xl font-bold text-emerald-800";
        }
        if (desc) desc.innerText = "Parabéns! De acordo com a simulação Dona Vita, você cumpre todos os requisitos básicos para doação. Procure um posto de coleta próximo!";
    } else {
        if (icon) {
            icon.className = "w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl bg-amber-100 text-amber-800 border border-amber-300";
            icon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
        }
        if (title) {
            title.innerText = "Aguarde um pouco antes de doar";
            title.className = "text-2xl font-bold text-amber-900";
        }
        if (desc) desc.innerText = reason || "No momento você não preenche um dos requisitos para doação temporária. Fale com a equipe médica do seu banco de sangue de referência.";
    }
}

function resetQuiz() {
    currentQuizIndex = 0;
    const resultBox = document.getElementById("quiz-result-box");
    const questionBox = document.getElementById("quiz-question-box");
    if (resultBox) resultBox.classList.add("hidden");
    if (questionBox) questionBox.classList.remove("hidden");
    loadQuizQuestion(0);
}

function switchTab(tabKey) {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("border-palette-wine", "text-palette-wine", "font-bold");
        btn.classList.add("border-transparent", "text-palette-espresso/60");
    });

    document.querySelectorAll(".tab-content").forEach(c => c.classList.add("hidden"));

    const activeBtn = document.getElementById(`tab-btn-${tabKey}`);
    if (activeBtn) {
        activeBtn.classList.add("border-palette-wine", "text-palette-wine", "font-bold");
        activeBtn.classList.remove("border-transparent", "text-palette-espresso/60");
    }

    const activeContent = document.getElementById(`content-${tabKey}`);
    if (activeContent) activeContent.classList.remove("hidden");
}

function loadStories() {
    const saved = localStorage.getItem("dona_vita_stories");
    const stories = saved ? JSON.parse(saved) : defaultStories;

    const grid = document.getElementById("stories-grid");
    if (!grid) return;
    grid.innerHTML = "";

    stories.forEach(item => {
        const card = document.createElement("div");
        card.className = "bg-white p-6 rounded-2xl border border-palette-rose/50 shadow-sm flex flex-col justify-between";
        card.innerHTML = `
            <div class="space-y-3">
                <i class="fa-solid fa-quote-left text-palette-coral text-xl"></i>
                <p class="text-palette-espresso text-sm italic font-medium leading-relaxed">"${item.text}"</p>
            </div>
            <div class="mt-6 pt-4 border-t border-palette-rose/40 flex items-center justify-between text-xs">
                <div>
                    <p class="font-bold text-palette-espresso">${item.author}</p>
                    <p class="text-palette-wine font-semibold">${item.role}</p>
                </div>
                <span class="text-palette-espresso/50 font-medium">${item.date || 'Recente'}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

function handleStorySubmit(e) {
    e.preventDefault();
    const authorEl = document.getElementById("story-author");
    const roleEl = document.getElementById("story-role");
    const textEl = document.getElementById("story-text");

    if (!authorEl || !roleEl || !textEl) return;

    const author = authorEl.value;
    const role = roleEl.value;
    const text = textEl.value;

    const saved = localStorage.getItem("dona_vita_stories");
    const stories = saved ? JSON.parse(saved) : [...defaultStories];

    stories.unshift({
        author,
        role,
        text,
        date: "Agora mesmo"
    });

    localStorage.setItem("dona_vita_stories", JSON.stringify(stories));
    loadStories();

    const form = document.getElementById("story-form");
    if (form) form.reset();
}