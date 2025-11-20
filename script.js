// script.js
document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const especialidadeSelect = document.getElementById('especialidade');
    const hdaTextarea = document.getElementById('hda');
    const listaCidsDiv = document.getElementById('lista-cids');
    const sugerirBtn = document.getElementById('sugerir-btn');
    const modelInfoDiv = document.getElementById('model-info'); // Novo elemento

    // Lista de especialidades... (continua igual)
    const ESPECIALIDADES = [
        "Acupuntura", "Alergia e Imunologia", "Anestesiologia", "Angiologia", "Cardiologia", "Cirurgia Cardiovascular", "Cirurgia da Mão", "Cirurgia de Cabeça e Pescoço", "Cirurgia do Aparelho Digestivo", "Cirurgia Geral", "Cirurgia Oncológica", "Cirurgia Pediátrica", "Cirurgia Plástica", "Cirurgia Torácica", "Cirurgia Vascular", "Clínica Médica", "Coloproctologia", "Dermatologia", "Endocrinologia e Metabologia", "Endoscopia", "Gastroenterologia", "Genética Médica", "Geriatria", "Ginecologia e Obstetrícia", "Hematologia e Hemoterapia", "Homeopatia", "Infectologia", "Mastologia", "Medicina de Emergência", "Medicina de Família e Comunidade", "Medicina do Trabalho", "Medicina do Tráfego", "Medicina Esportiva", "Medicina Física e Reabilitação", "Medicina Intensiva", "Medicina Legal e Perícia Médica", "Medicina Nuclear", "Medicina Preventiva e Social", "Nefrologia", "Neurocirurgia", "Neurologia", "Nutrologia", "Oftalmologia", "Oncologia Clínica", "Ortopedia e Traumatologia", "Otorrinolaringologia", "Patologia", "Patologia Clínica/Medicina Laboratorial", "Pediatria", "Pneumologia", "Psiquiatria", "Radiologia e Diagnóstico por Imagem", "Radioterapia", "Reumatologia", "Urologia"
    ];

    function carregarEspecialidades() {
        especialidadeSelect.innerHTML = '<option value="">Selecione...</option>';
        ESPECIALIDADES.sort().forEach(esp => {
            const option = document.createElement('option');
            option.value = esp;
            option.textContent = esp;
            especialidadeSelect.appendChild(option);
        });
    }

    async function sugerirCids() {
        const especialidade = especialidadeSelect.value;
        const texto = hdaTextarea.value;

        if (!especialidade || texto.length < 10) {
            listaCidsDiv.innerHTML = '<p>Selecione uma especialidade e digite uma descrição clínica detalhada (mínimo 10 caracteres).</p>';
            return;
        }

        listaCidsDiv.innerHTML = '<p>Analisando com IA... 🧠</p>';
        modelInfoDiv.innerHTML = ''; // Limpa a info do modelo anterior
        hdaTextarea.disabled = true;
        sugerirBtn.disabled = true;
        sugerirBtn.textContent = 'Analisando...';

        try {
            const response = await fetch('https://cida-i-backend.onrender.com/sugerir-cid', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto, especialidade }),
            });

            if (!response.ok) throw new Error(`Falha na resposta do servidor: ${response.statusText}`);

            // --- MUDANÇA AQUI: Processamos o novo objeto de resposta ---
            const responseData = await response.json();
            exibirResultados(responseData.suggestions);
            modelInfoDiv.innerHTML = `Análise fornecida pelo modelo: <strong>${responseData.modelName}</strong>`;

        } catch (error) {
            console.error("Erro ao buscar sugestões:", error);
            listaCidsDiv.innerHTML = '<p>Ocorreu um erro ao contatar o serviço de IA. Verifique se o servidor backend está rodando e tente novamente.</p>';
        } finally {
            hdaTextarea.disabled = false;
            sugerirBtn.disabled = false;
            sugerirBtn.textContent = 'Sugerir CIDs 💡';
        }
    }

    function exibirResultados(cids) {
        if (!cids || cids.length === 0) {
            listaCidsDiv.innerHTML = '<p>A IA não encontrou sugestões correspondentes. Tente detalhar mais a descrição.</p>';
            return;
        }

        listaCidsDiv.innerHTML = cids.map(cid => `
            <div class="cid-item">
                <h3>${cid.cid}</h3>
                <p><strong>Descrição:</strong> ${cid.descricao}</p>
                <p><strong>Justificativa da IA:</strong> <em>${cid.justificativa}</em></p>
            </div>
        `).join('');
    }

    // --- INICIALIZAÇÃO E EVENTOS ---
    carregarEspecialidades();
    sugerirBtn.addEventListener('click', sugerirCids);
});