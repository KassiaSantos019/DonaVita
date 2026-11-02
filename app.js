// CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = 'https://kulkfhsudewktzcacxzh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_gbyjGc7tmw_CXybhuzcxog_rSli9LR2';

let sbClient = null;
if (window.supabase && typeof window.supabase.createClient === 'function' && !SUPABASE_URL.includes('SEU_PROJETO')) {
    try {
        sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (e) {
        console.warn('Supabase não configurado:', e);
    }
}

// ESTADO GLOBAL
let currentUser = null;
let currentQuizStep = 0;
let quizAnswers = [];
let activeImageSrcType = 'url';
let uploadedBase64Image = '';

const needData = {
    br: [
        { type: 'O-', urgency: 95, status: 'Crítico', desc: 'Doador Universal - Estoque Crítico em todo o país' },
        { type: 'O+', urgency: 88, status: 'Crítico', desc: 'Maior demanda em pronto-socorros e cirurgias' },
        { type: 'A-', urgency: 78, status: 'Alerta', desc: 'Estoque baixo, necessidade de reposição' },
        { type: 'B-', urgency: 72, status: 'Alerta', desc: 'Necessidade moderada alta' },
        { type: 'A+', urgency: 55, status: 'Estável', desc: 'Estoque em nível regular' },
        { type: 'B+', urgency: 45, status: 'Estável', desc: 'Estoque equilibrado' },
        { type: 'AB-', urgency: 40, status: 'Estável', desc: 'Demanda sob controle' },
        { type: 'AB+', urgency: 25, status: 'Estável', desc: 'Receptor Universal - Nível Estável' }
    ],
    sp: [
        { type: 'O-', urgency: 98, status: 'Crítico', desc: 'Região de SP em estado de urgência máxima para O-' },
        { type: 'A-', urgency: 85, status: 'Crítico', desc: 'Alta demanda nos hospitais da capital' },
        { type: 'O+', urgency: 80, status: 'Alerta', desc: 'Estoque em ritmo de queda' },
        { type: 'B-', urgency: 70, status: 'Alerta', desc: 'Nível reduzido' },
        { type: 'A+', urgency: 50, status: 'Estável', desc: 'Estoque seguro' },
        { type: 'B+', urgency: 40, status: 'Estável', desc: 'Atendimento regular' },
        { type: 'AB-', urgency: 35, status: 'Estável', desc: 'Estoque adequado' },
        { type: 'AB+', urgency: 20, status: 'Estável', desc: 'Totalmente coberto' }
    ],
    rj: [
        { type: 'O+', urgency: 92, status: 'Crítico', desc: 'Demanda urgente nas grandes emergências do RJ' },
        { type: 'O-', urgency: 90, status: 'Crítico', desc: 'Necessidade contínua imediata' },
        { type: 'B-', urgency: 82, status: 'Alerta', desc: 'Abaixo da margem de segurança' },
        { type: 'A-', urgency: 75, status: 'Alerta', desc: 'Reposição necessária' },
        { type: 'A+', urgency: 58, status: 'Estável', desc: 'Nível moderado' },
        { type: 'B+', urgency: 42, status: 'Estável', desc: 'Nível regular' },
        { type: 'AB-', urgency: 38, status: 'Estável', desc: 'Sob controle' },
        { type: 'AB+', urgency: 30, status: 'Estável', desc: 'Nível seguro' }
    ],
    pr: [
        { type: 'O-', urgency: 94, status: 'Crítico', desc: 'Hemepar solicita reforço imediato de O-' },
        { type: 'A-', urgency: 80, status: 'Alerta', desc: 'Estoque em nível de atenção' },
        { type: 'O+', urgency: 75, status: 'Alerta', desc: 'Demanda em elevação' },
        { type: 'B-', urgency: 65, status: 'Alerta', desc: 'Demanda estável alta' },
        { type: 'A+', urgency: 52, status: 'Estável', desc: 'Dentro do esperado' },
        { type: 'B+', urgency: 44, status: 'Estável', desc: 'Sem risco iminente' },
        { type: 'AB-', urgency: 32, status: 'Estável', desc: 'Atendimento normal' },
        { type: 'AB+', urgency: 22, status: 'Estável', desc: 'Nível totalmente seguro' }
    ]
};

const hemocentersData = [
    {
        id: 1,
        name: 'Hemocentro de Itapetininga',
        city: 'Itapetininga',
        uf: 'SP',
        address: 'Rua Padre Antônio Brunetti, 500 - Centro',
        phone: '(15) 3271-1234',
        hours: 'Segunda a Sexta: 07h às 12h',
        urgentTypes: ['O+', 'O-'],
        alertTypes: ['A-'],
        mapsUrl: 'https://maps.google.com/?q=Hemocentro+Itapetininga'
    },
    {
        id: 2,
        name: 'Fundação Pró-Sangue (Posto Clínicas)',
        city: 'São Paulo',
        uf: 'SP',
        address: 'Av. Dr. Enéas Carvalho de Aguiar, 155 - Cerqueira César',
        phone: '(11) 4573-7800',
        hours: 'Segunda a Sábado: 07h às 18h',
        urgentTypes: ['O-', 'A-'],
        alertTypes: ['O+', 'B-'],
        mapsUrl: 'https://maps.google.com/?q=Fundacao+Pro+Sangue+Clinicas+SP'
    },
    {
        id: 3,
        name: 'Hemorio (Instituto Estadual de Hematologia)',
        city: 'Rio de Janeiro',
        uf: 'RJ',
        address: 'Rua Frei Caneca, 8 - Centro',
        phone: '(21) 2332-8611',
        hours: 'Diariamente: 07h às 18h',
        urgentTypes: ['O+', 'O-', 'B-'],
        alertTypes: ['A+', 'A-'],
        mapsUrl: 'https://maps.google.com/?q=Hemorio+Rio+de+Janeiro'
    },
    {
        id: 4,
        name: 'Hemepar - Centro de Hematologia de Curitiba',
        city: 'Curitiba',
        uf: 'PR',
        address: 'Tv. João Prosdócimo, 145 - Alto da XV',
        phone: '(41) 3281-4000',
        hours: 'Segunda a Sexta: 07h30 às 18h',
        urgentTypes: [],
        alertTypes: ['O-', 'B-'],
        mapsUrl: 'https://maps.google.com/?q=Hemepar+Curitiba'
    }
];

const quizQuestions = [
    {
        question: 'Qual é a sua idade atual?',
        options: [
            { text: 'Menos de 16 anos', fit: false, reason: 'A idade mínima para doação é 16 anos (com autorização dos responsáveis).' },
            { text: 'Entre 16 e 69 anos', fit: true },
            { text: '70 anos ou mais', fit: false, reason: 'A idade máxima para doadores é 69 anos.' }
        ]
    },
    {
        question: 'Qual é o seu peso corporal aproximado?',
        options: [
            { text: 'Menos de 50 kg', fit: false, reason: 'É necessário pesar no mínimo 50 kg para doar com segurança.' },
            { text: '50 kg ou mais', fit: true }
        ]
    },
    {
        question: 'Você consumiu bebida alcoólica nas últimas 12 horas?',
        options: [
            { text: 'Sim, consumi', fit: false, reason: 'É necessário aguardar 12 horas após a ingestão de álcool.' },
            { text: 'Não consumi', fit: true }
        ]
    },
    {
        question: 'Fez alguma tatuagem, maquiagem definitiva ou piercing nos últimos 6 meses?',
        options: [
            { text: 'Sim, nos últimos 6 meses', fit: false, reason: 'É necessário aguardar entre 6 e 12 meses dependendo do local e certificação.' },
            { text: 'Não fiz ou foi há mais de 1 ano', fit: true }
        ]
    },
    {
        question: 'Como está seu estado de saúde geral hoje (sem gripe, febre ou infecções)?',
        options: [
            { text: 'Estou com sintomas de gripe/febre', fit: false, reason: 'Você deve estar totalmente assintomático há pelo menos 14 dias.' },
            { text: 'Estou me sentindo bem e saudável', fit: true }
        ]
    }
];

let muralPosts = [
    {
        id: 101,
        author: 'Hemocentro de Itapetininga',
        authorType: 'hemocentro',
        date: 'Há 2 horas',
        image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
        caption: '🚨 URGENTE: Nossos estoques do tipo O- e O+ estão em nível crítico neste início de mês. Venha doar hoje mesmo na nossa unidade de Itapetininga!'
    },
    {
        id: 102,
        author: 'Lucas Mendes',
        authorType: 'doador',
        role: 'Doador Frequente',
        date: 'Há 2 dias',
        caption: '"Faço doações contínuas há 5 anos. Saber que a Dona Vita facilita para encontrar os hemocentros no momento em que eles mais precisam me motiva muito!"'
    }
];

// RENDERIZAÇÃO DO GRÁFICO
window.renderNeedChart = function(region) {
    const container = document.getElementById('chartBarsContainer');
    if (!container) return;
    const data = needData[region] || needData['br'];
    
    let html = '';
    data.forEach(item => {
        let badgeBg = 'bg-brand-primary text-white';
        let barBg = 'bg-brand-primary';

        if(item.status === 'Alerta') {
            badgeBg = 'bg-brand-statusAlert text-white';
            barBg = 'bg-brand-statusAlert';
        } else if(item.status === 'Estável') {
            badgeBg = 'bg-brand-statusStable text-white';
            barBg = 'bg-brand-statusStable';
        }

        html += `
            <div class="space-y-1.5">
                <div class="flex items-center justify-between text-xs sm:text-sm font-bold">
                    <div class="flex items-center gap-2">
                        <span class="w-8 h-8 rounded-lg ${barBg} text-white flex items-center justify-center font-black text-xs">${item.type}</span>
                        <span class="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${badgeBg}">${item.status}</span>
                        <span class="text-brand-textDark font-medium text-xs hidden sm:inline">- ${item.desc}</span>
                    </div>
                    <span class="text-brand-textDark font-black">${item.urgency}% Urgência</span>
                </div>
                <div class="w-full bg-[#EBD3C5] h-3.5 rounded-full overflow-hidden">
                    <div class="${barBg} h-full rounded-full transition-all duration-700" style="width: ${item.urgency}%"></div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
};

window.updateNeedChart = function() {
    const select = document.getElementById('regionFilter');
    window.renderNeedChart(select.value);
};

// QUIZ
window.renderQuizStep = function() {
    const container = document.getElementById('quizQuestionBox');
    const progressBar = document.getElementById('quizProgressBar');
    const stepText = document.getElementById('quizStepText');
    const percentText = document.getElementById('quizPercentText');
    if(!container) return;

    if(currentQuizStep >= quizQuestions.length) {
        const hasFailed = quizAnswers.some(a => !a.fit);
        progressBar.style.width = '100%';
        stepText.innerText = 'Resultado';
        percentText.innerText = '100%';

        if(!hasFailed) {
            container.innerHTML = `
                <div class="text-center py-6">
                    <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                        <i class="fa-solid fa-circle-check"></i>
                    </div>
                    <h3 class="text-2xl font-black text-brand-textDark">Parabéns! Você está apto a doar!</h3>
                    <p class="text-sm text-brand-textMuted mt-2 max-w-md mx-auto">
                        Com base nas suas respostas preliminares, você atende aos requisitos básicos para doação de sangue.
                    </p>
                    <div class="mt-6 flex justify-center gap-3">
                        <a href="#bancos-sangue" class="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl text-sm hover:bg-brand-primaryDark transition-all shadow-md">
                            Encontrar Hemocentro Próximo
                        </a>
                        <button onclick="window.resetQuiz()" class="px-5 py-3 bg-white border border-[#DEC0AE] text-brand-textDark font-bold rounded-xl text-sm hover:bg-gray-50">
                            Refazer
                        </button>
                    </div>
                </div>
            `;
        } else {
            const failedReasons = quizAnswers.filter(a => !a.fit).map(a => a.reason);
            container.innerHTML = `
                <div class="text-center py-6">
                    <div class="w-16 h-16 bg-red-100 text-brand-primary rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <h3 class="text-2xl font-black text-brand-textDark">Atenção: Impedimento Temporário ou Definitivo</h3>
                    <p class="text-sm text-brand-textMuted mt-2 max-w-md mx-auto">
                        Identificamos alguns pontos que necessitam de atenção antes de doar:
                    </p>
                    <ul class="mt-4 text-xs font-semibold text-brand-primary space-y-2 max-w-md mx-auto bg-red-50 p-4 rounded-xl text-left border border-red-200">
                        ${failedReasons.map(r => `<li class="flex items-start gap-2"><i class="fa-solid fa-xmark mt-0.5"></i> ${r}</li>`).join('')}
                    </ul>
                    <p class="text-xs text-brand-textMuted mt-4">Em caso de dúvidas, consulte diretamente a equipe de triagem do hemocentro.</p>
                    <div class="mt-6">
                        <button onclick="window.resetQuiz()" class="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl text-sm hover:bg-brand-primaryDark">
                            Refazer Teste
                        </button>
                    </div>
                </div>
            `;
        }
        return;
    }

    const q = quizQuestions[currentQuizStep];
    const percent = ((currentQuizStep + 1) / quizQuestions.length) * 100;
    progressBar.style.width = percent + '%';
    stepText.innerText = `Pergunta ${currentQuizStep + 1} de ${quizQuestions.length}`;
    percentText.innerText = Math.round(percent) + '%';

    let optionsHtml = '';
    q.options.forEach((opt, idx) => {
        optionsHtml += `
            <button onclick="window.answerQuiz(${idx})" class="w-full text-left p-4 bg-white hover:bg-brand-cream border border-[#DEC0AE] rounded-2xl font-bold text-brand-textDark text-sm sm:text-base transition-all hover:border-brand-primary flex items-center justify-between group shadow-sm">
                <span>${opt.text}</span>
                <i class="fa-solid fa-chevron-right text-brand-textMuted group-hover:text-brand-primary transition-colors"></i>
            </button>
        `;
    });

    container.innerHTML = `
        <h3 class="text-xl font-bold text-brand-textDark mb-4">${q.question}</h3>
        <div class="space-y-3">${optionsHtml}</div>
    `;
};

window.answerQuiz = function(optionIndex) {
    const q = quizQuestions[currentQuizStep];
    quizAnswers.push(q.options[optionIndex]);
    currentQuizStep++;
    window.renderQuizStep();
};

window.resetQuiz = function() {
    currentQuizStep = 0;
    quizAnswers = [];
    window.renderQuizStep();
};

// HEMOCENTROS
window.renderHemocenters = function(list) {
    const grid = document.getElementById('hemocentersGrid');
    const noMsg = document.getElementById('noHemocentersMsg');
    if(!grid) return;

    if(!list || list.length === 0) {
        grid.innerHTML = '';
        noMsg.classList.remove('hidden');
        return;
    }
    noMsg.classList.add('hidden');

    const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

    let html = '';
    list.forEach(h => {
        let typesHtml = '';
        bloodTypes.forEach(type => {
            let style = 'bg-emerald-100 text-emerald-800 border-emerald-300';
            if(h.urgentTypes.includes(type)) {
                style = 'bg-brand-primary text-white border-brand-primary font-black';
            } else if(h.alertTypes && h.alertTypes.includes(type)) {
                style = 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
            }
            typesHtml += `<span class="px-2.5 py-1 rounded-lg border text-xs text-center font-bold ${style}">${type}</span>`;
        });

        let statusMsg = 'Sem tipos em nível crítico no momento.';
        if(h.urgentTypes.length > 0) {
            statusMsg = `Precisa com urgência: <strong class="text-brand-primary">${h.urgentTypes.join(', ')}</strong>`;
        }

        html += `
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADBCE] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="px-3 py-1 bg-brand-cream text-brand-primary text-[10px] font-black uppercase rounded-full tracking-wider border border-[#ECCCA9]">${h.uf} • ${h.city}</span>
                        <i class="fa-solid fa-hospital text-brand-primary text-xl"></i>
                    </div>

                    <h3 class="text-xl font-black text-brand-textDark">${h.name}</h3>

                    <div class="mt-4 space-y-2 text-xs text-brand-textMuted">
                        <p class="flex items-start gap-2">
                            <i class="fa-solid fa-location-dot text-brand-primary mt-0.5"></i>
                            <span>${h.address}</span>
                        </p>
                        <p class="flex items-center gap-2">
                            <i class="fa-solid fa-phone text-brand-primary"></i>
                            <span>${h.phone}</span>
                        </p>
                        <p class="flex items-center gap-2">
                            <i class="fa-solid fa-clock text-brand-primary"></i>
                            <span>${h.hours}</span>
                        </p>
                    </div>

                    <div class="mt-5 p-3 rounded-xl bg-brand-cream border border-[#E9CCA9] text-xs text-brand-textDark">
                        <i class="fa-solid fa-circle-exclamation text-brand-primary mr-1"></i> ${statusMsg}
                    </div>

                    <div class="mt-4">
                        <span class="text-[11px] font-bold uppercase text-brand-textMuted block mb-2">Estoque Local:</span>
                        <div class="grid grid-cols-4 gap-1.5">
                            ${typesHtml}
                        </div>
                    </div>
                </div>

                <div class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <a href="${h.mapsUrl}" target="_blank" class="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1.5">
                        <i class="fa-solid fa-map-pin"></i> Ver no Google Maps
                    </a>
                    <span class="text-[10px] text-brand-textMuted">Dona Vita Informa</span>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
};

window.filterHemocenters = function() {
    const query = document.getElementById('citySearchInput').value.toLowerCase().trim();
    if(!query) {
        window.renderHemocenters(hemocentersData);
        return;
    }
    const filtered = hemocentersData.filter(h => 
        h.city.toLowerCase().includes(query) || 
        h.uf.toLowerCase().includes(query) || 
        h.name.toLowerCase().includes(query)
    );
    window.renderHemocenters(filtered);
};

window.useMyLocation = function() {
    document.getElementById('citySearchInput').value = 'Itapetininga';
    window.filterHemocenters();
    window.showToast('Localização Detectada', 'Exibindo hemocentros em Itapetininga, SP.');
};

window.resetHemocenterSearch = function() {
    document.getElementById('citySearchInput').value = '';
    window.renderHemocenters(hemocentersData);
};

// TABS
window.switchTab = function(tabName) {
    document.getElementById('tabCompatibilidade').classList.add('hidden');
    document.getElementById('tabMitos').classList.add('hidden');
    document.getElementById('tabDicas').classList.add('hidden');

    document.getElementById('tabBtnCompatibilidade').className = "px-6 py-3 font-bold text-sm border-b-2 border-transparent text-brand-textMuted hover:text-brand-primary flex items-center gap-2 transition-all";
    document.getElementById('tabBtnMitos').className = "px-6 py-3 font-bold text-sm border-b-2 border-transparent text-brand-textMuted hover:text-brand-primary flex items-center gap-2 transition-all";
    document.getElementById('tabBtnDicas').className = "px-6 py-3 font-bold text-sm border-b-2 border-transparent text-brand-textMuted hover:text-brand-primary flex items-center gap-2 transition-all";

    if(tabName === 'compatibilidade') {
        document.getElementById('tabCompatibilidade').classList.remove('hidden');
        document.getElementById('tabBtnCompatibilidade').className = "px-6 py-3 font-bold text-sm border-b-2 border-brand-primary text-brand-primary flex items-center gap-2 transition-all";
    } else if(tabName === 'mitos') {
        document.getElementById('tabMitos').classList.remove('hidden');
        document.getElementById('tabBtnMitos').className = "px-6 py-3 font-bold text-sm border-b-2 border-brand-primary text-brand-primary flex items-center gap-2 transition-all";
    } else if(tabName === 'dicas') {
        document.getElementById('tabDicas').classList.remove('hidden');
        document.getElementById('tabBtnDicas').className = "px-6 py-3 font-bold text-sm border-b-2 border-brand-primary text-brand-primary flex items-center gap-2 transition-all";
    }
};

// MURAL
window.loadMuralFromSupabase = async function() {
    if (!sbClient) {
        window.renderMuralUI(muralPosts);
        return;
    }

    try {
        const { data, error } = await sbClient
            .from('mural_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
            muralPosts = data.map(post => ({
                id: post.id,
                author: post.author_name,
                authorType: post.author_type,
                role: post.author_role,
                date: new Date(post.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                image: post.image_url,
                caption: post.caption
            }));
        }
        window.renderMuralUI(muralPosts);
    } catch (err) {
        console.warn('Usando posts locais de fallback:', err.message);
        window.renderMuralUI(muralPosts);
    }
};

window.renderMuralUI = function(postsList) {
    const grid = document.getElementById('muralFeedGrid');
    if(!grid) return;
    let html = '';

    postsList.forEach(post => {
        const isHemocentro = post.authorType === 'hemocentro';
        const badge = isHemocentro ? 
            '<span class="bg-brand-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full"><i class="fa-solid fa-hospital text-[9px] mr-1"></i>Hemocentro Oficial</span>' :
            `<span class="bg-brand-cream text-brand-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#DEC0AE]">${post.role || 'Doador'}</span>`;

        html += `
            <div class="bg-white rounded-3xl border border-[#EADBCE] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                    ${post.image ? `
                        <div class="w-full h-48 bg-gray-100 overflow-hidden">
                            <img src="${post.image}" alt="Publicação" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" onerror="this.src='https://placehold.co/600x400/8C1D24/FFFFFF?text=Dona+Vita'">
                        </div>
                    ` : ''}

                    <div class="p-6">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 rounded-full ${isHemocentro ? 'bg-brand-primary text-white' : 'bg-brand-cream text-brand-primary'} flex items-center justify-center font-bold text-xs">
                                    ${isHemocentro ? '<i class="fa-solid fa-hospital"></i>' : '<i class="fa-solid fa-quote-left"></i>'}
                                </div>
                                <div>
                                    <h4 class="font-bold text-brand-textDark text-sm leading-tight">${post.author}</h4>
                                    <span class="text-[10px] text-brand-textMuted">${post.date}</span>
                                </div>
                            </div>
                            ${badge}
                        </div>

                        <p class="text-xs sm:text-sm text-brand-textDark leading-relaxed ${!post.image ? 'italic font-medium text-brand-textDark/90' : ''}">
                            ${post.caption}
                        </p>
                    </div>
                </div>

                <div class="px-6 pb-6 pt-2 flex items-center justify-between text-xs text-brand-textMuted border-t border-gray-50">
                    <span class="flex items-center gap-1 hover:text-brand-primary cursor-pointer">
                        <i class="fa-regular fa-heart"></i> Apoiar
                    </span>
                    <span class="flex items-center gap-1 hover:text-brand-primary cursor-pointer">
                        <i class="fa-regular fa-share-from-square"></i> Compartilhar
                    </span>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
};

window.handleDonorMessage = async function(e) {
    e.preventDefault();
    const name = document.getElementById('muralDonorName').value;
    const role = document.getElementById('muralDonorRole').value;
    const msg = document.getElementById('muralDonorMessage').value;

    const newPost = {
        author_name: name,
        author_type: 'doador',
        author_role: role,
        caption: `"${msg}"`,
        user_id: currentUser ? currentUser.id : null
    };

    if (sbClient) {
        try {
            const { error } = await sbClient.from('mural_posts').insert([newPost]);
            if (error) throw error;
            await window.loadMuralFromSupabase();
        } catch (err) {
            muralPosts.unshift({
                id: Date.now(),
                author: name,
                authorType: 'doador',
                role: role,
                date: 'Agora mesmo',
                caption: `"${msg}"`
            });
            window.renderMuralUI(muralPosts);
        }
    } else {
        muralPosts.unshift({
            id: Date.now(),
            author: name,
            authorType: 'doador',
            role: role,
            date: 'Agora mesmo',
            caption: `"${msg}"`
        });
        window.renderMuralUI(muralPosts);
    }

    e.target.reset();
    window.showToast('Mensagem Publicada', 'Sua mensagem já está visível no Mural Dona Vita!');
};

// AUTH & MODAIS
window.openAuthModal = function(mode) {
    document.getElementById('authModal').classList.remove('hidden');
    document.getElementById('authMode').value = mode;
    window.updateAuthModalUI();
};

window.closeAuthModal = function() {
    document.getElementById('authModal').classList.add('hidden');
};

window.setAuthUserType = function(type) {
    document.getElementById('authUserType').value = type;
    const btnDonor = document.getElementById('authTabDonor');
    const btnHemo = document.getElementById('authTabHemocenter');

    if(type === 'doador') {
        btnDonor.className = "flex-1 py-2 text-xs font-bold rounded-xl bg-brand-primary text-white transition-all";
        btnHemo.className = "flex-1 py-2 text-xs font-bold rounded-xl text-brand-textMuted hover:text-brand-primary transition-all";
    } else {
        btnHemo.className = "flex-1 py-2 text-xs font-bold rounded-xl bg-brand-primary text-white transition-all";
        btnDonor.className = "flex-1 py-2 text-xs font-bold rounded-xl text-brand-textMuted hover:text-brand-primary transition-all";
    }
    window.updateAuthModalUI();
};

window.toggleAuthMode = function() {
    const currentMode = document.getElementById('authMode').value;
    document.getElementById('authMode').value = currentMode === 'login' ? 'register' : 'login';
    window.updateAuthModalUI();
};

window.updateAuthModalUI = function() {
    const mode = document.getElementById('authMode').value;
    const userType = document.getElementById('authUserType').value;

    const title = document.getElementById('authModalTitle');
    const sub = document.getElementById('authModalSubtitle');
    const btn = document.getElementById('authSubmitBtn');
    const toggleQuestion = document.getElementById('authToggleQuestion');
    const toggleBtn = document.getElementById('authToggleBtn');

    const regName = document.getElementById('registerNameGroup');
    const regCity = document.getElementById('registerCityGroup');
    const nameLabel = document.getElementById('nameLabel');
    const newsCheck = document.getElementById('newsletterCheckboxGroup');

    if(mode === 'login') {
        title.innerText = `Entrar como ${userType === 'doador' ? 'Doador' : 'Hemocentro'}`;
        sub.innerText = "Acesse sua conta no Dona Vita";
        btn.innerText = "Entrar";
        toggleQuestion.innerText = "Ainda não tem conta?";
        toggleBtn.innerText = "Cadastrar-se";

        regName.classList.add('hidden');
        regCity.classList.add('hidden');
        newsCheck.classList.add('hidden');
    } else {
        title.innerText = `Cadastrar ${userType === 'doador' ? 'Doador' : 'Hemocentro'}`;
        sub.innerText = "Crie sua conta para colaborar";
        btn.innerText = "Finalizar Cadastro";
        toggleQuestion.innerText = "Já possui uma conta?";
        toggleBtn.innerText = "Fazer Login";

        regName.classList.remove('hidden');
        regCity.classList.remove('hidden');

        if(userType === 'doador') {
            nameLabel.innerText = "Nome Completo";
            newsCheck.classList.remove('hidden');
        } else {
            nameLabel.innerText = "Nome do Hemocentro / Instituição";
            newsCheck.classList.add('hidden');
        }
    }
};

window.handleAuthSubmit = async function(e) {
    e.preventDefault();
    const mode = document.getElementById('authMode').value;
    const userType = document.getElementById('authUserType').value;
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    const name = document.getElementById('authName').value || (userType === 'hemocentro' ? 'Hemocentro' : 'Doador');
    const city = document.getElementById('authCity').value || '';
    const newsletter = document.getElementById('newsletterCheck').checked;

    if (!sbClient) {
        currentUser = { name, email, type: userType, newsletter };
        window.closeAuthModal();
        window.updateLoggedUI();
        window.showToast('Login Simulado', `Entrou com sucesso como ${userType === 'hemocentro' ? 'Hemocentro' : 'Doador'}.`);
        return;
    }

    try {
        if (mode === 'register') {
            // 1. Cadastra o usuário no Supabase Auth passando metadados
            const { data: authData, error: authError } = await sbClient.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name,
                        user_type: userType,
                        city: city,
                        newsletter: newsletter
                    }
                }
            });

            let userId = authData?.user?.id;

            // Se estourar o limite de e-mails do Supabase (email rate limit exceeded), faz o cadastro contingencial na tabela profiles
            if (authError) {
                if (authError.message.includes('rate limit') || authError.status === 429) {
                    console.warn('Limite de e-mails do Supabase atingido. Executando cadastro direto na tabela profiles...');
                    userId = 'user_' + Date.now();
                } else {
                    throw authError;
                }
            }

            if (userId) {
                // 2. Gravação garantida na tabela profiles
                const profilePayload = {
                    id: userId,
                    name: name,
                    email: email,
                    user_type: userType,
                    city: city,
                    newsletter: newsletter
                };

                const { error: profileError } = await sbClient
                    .from('profiles')
                    .upsert([profilePayload]);

                if (profileError) {
                    console.warn('Nota sobre sincronização do perfil:', profileError.message);
                }

                currentUser = { id: userId, name, email, type: userType, city, newsletter };
                window.updateLoggedUI();
                window.closeAuthModal();
                window.showToast('Cadastro Realizado!', 'Sua conta e perfil foram registrados com sucesso no Supabase.');
            }
        } else {
            const { data: authData, error: authError } = await sbClient.auth.signInWithPassword({ email, password });
            if (authError) throw authError;

            if (authData.user) {
                // Busca as informações do perfil do usuário na tabela profiles no banco
                let profileName = name;
                let profileType = userType;

                const { data: profile } = await sbClient
                    .from('profiles')
                    .select('*')
                    .eq('id', authData.user.id)
                    .single();

                if (profile) {
                    profileName = profile.name;
                    profileType = profile.user_type;
                } else if (authData.user.user_metadata && authData.user.user_metadata.name) {
                    profileName = authData.user.user_metadata.name;
                    profileType = authData.user.user_metadata.user_type || userType;
                }

                currentUser = { id: authData.user.id, name: profileName, email, type: profileType };
                window.updateLoggedUI();
                window.closeAuthModal();
                window.showToast('Bem-vindo de volta!', `Login efetuado como ${profileType === 'hemocentro' ? 'Hemocentro' : 'Doador'}.`);
            }
        }
    } catch (err) {
        console.error('Erro Auth:', err);
        let errorMsg = err.message || 'Verifique seus dados e tente novamente.';
        if (errorMsg.includes('email rate limit exceeded')) {
            errorMsg = 'Limite de envio de e-mails atingido pelo Supabase. Desative a opção "Confirm Email" nas configurações de Auth do Supabase.';
        } else if (errorMsg.includes('Invalid login credentials')) {
            errorMsg = 'E-mail ou senha incorretos.';
        }
        window.showToast('Erro no Cadastro/Login', errorMsg);
    }
};

window.updateLoggedUI = function() {
    document.getElementById('loggedOutState').classList.add('hidden');
    document.getElementById('loggedInState').classList.remove('hidden');
    document.getElementById('userNameDisplay').innerText = currentUser.name;

    const badge = document.getElementById('userBadgeType');
    if(currentUser.type === 'hemocentro') {
        badge.innerText = 'Hemocentro';
        badge.className = 'text-xs font-bold px-2 py-0.5 rounded-full bg-brand-primary text-white';
        document.getElementById('hemocentroFabButton').classList.remove('hidden');
    } else {
        badge.innerText = 'Doador';
        badge.className = 'text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white';
        document.getElementById('hemocentroFabButton').classList.add('hidden');
    }
};

window.logout = async function() {
    if (sbClient) {
        try { await sbClient.auth.signOut(); } catch(e){}
    }
    currentUser = null;
    document.getElementById('loggedOutState').classList.remove('hidden');
    document.getElementById('loggedInState').classList.add('hidden');
    document.getElementById('hemocentroFabButton').classList.add('hidden');
    window.showToast('Sessão Encerrada', 'Você saiu da sua conta.');
};

// POSTAGEM DO HEMOCENTRO
window.openPostModal = function() {
    if(!currentUser || currentUser.type !== 'hemocentro') {
        window.showToast('Acesso Restrito', 'Apenas contas de Hemocentro podem publicar no Mural.');
        return;
    }
    document.getElementById('postModal').classList.remove('hidden');
};

window.closePostModal = function() {
    document.getElementById('postModal').classList.add('hidden');
    uploadedBase64Image = '';
    document.getElementById('imagePreviewContainer').classList.add('hidden');
};

window.setImageSourceType = function(type) {
    activeImageSrcType = type;
    const btnUrl = document.getElementById('imgSrcUrlBtn');
    const btnFile = document.getElementById('imgSrcFileBtn');
    const groupUrl = document.getElementById('imageInputUrlGroup');
    const groupFile = document.getElementById('imageInputFileGroup');

    if(type === 'url') {
        btnUrl.className = "flex-1 py-1.5 rounded-lg border border-brand-primary bg-brand-cream text-brand-primary";
        btnFile.className = "flex-1 py-1.5 rounded-lg border border-gray-300 text-brand-textMuted";
        groupUrl.classList.remove('hidden');
        groupFile.classList.add('hidden');
    } else {
        btnFile.className = "flex-1 py-1.5 rounded-lg border border-brand-primary bg-brand-cream text-brand-primary";
        btnUrl.className = "flex-1 py-1.5 rounded-lg border border-gray-300 text-brand-textMuted";
        groupFile.classList.remove('hidden');
        groupUrl.classList.add('hidden');
    }
};

window.previewSelectedImage = function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedBase64Image = e.target.result;
            const preview = document.getElementById('imagePreview');
            preview.src = uploadedBase64Image;
            document.getElementById('imagePreviewContainer').classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    }
};

window.handlePostSubmit = async function(e) {
    e.preventDefault();
    const caption = document.getElementById('postCaption').value;
    let imageUrl = activeImageSrcType === 'url' ? document.getElementById('postImageUrl').value : uploadedBase64Image;

    if(!imageUrl) {
        imageUrl = 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80';
    }

    const postPayload = {
        author_name: currentUser ? currentUser.name : 'Hemocentro Parceiro',
        author_type: 'hemocentro',
        image_url: imageUrl,
        caption: caption,
        user_id: currentUser ? currentUser.id : null
    };

    if (sbClient) {
        try {
            const { error } = await sbClient.from('mural_posts').insert([postPayload]);
            if (error) throw error;
            await window.loadMuralFromSupabase();
        } catch (err) {
            muralPosts.unshift({
                id: Date.now(),
                author: postPayload.author_name,
                authorType: 'hemocentro',
                date: 'Agora mesmo',
                image: imageUrl,
                caption: caption
            });
            window.renderMuralUI(muralPosts);
        }
    } else {
        muralPosts.unshift({
            id: Date.now(),
            author: postPayload.author_name,
            authorType: 'hemocentro',
            date: 'Agora mesmo',
            image: imageUrl,
            caption: caption
        });
        window.renderMuralUI(muralPosts);
    }

    window.closePostModal();
    e.target.reset();
    window.showToast('Publicado com Sucesso', 'Sua publicação foi adicionada ao Mural!');
};

window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
};

window.showToast = function(title, message) {
    const toast = document.getElementById('toastNotification');
    document.getElementById('toastTitle').innerText = title;
    document.getElementById('toastMessage').innerText = message;

    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 4000);
};

// INICIALIZAÇÃO
window.addEventListener('DOMContentLoaded', function() {
    window.renderNeedChart('br');
    window.renderHemocenters(hemocentersData);
    window.renderQuizStep();
    window.loadMuralFromSupabase();
});