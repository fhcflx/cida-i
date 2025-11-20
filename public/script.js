// public/script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const especialidadeSelect = document.getElementById('especialidade');
    const hdaTextarea = document.getElementById('hda');
    const listaCidsDiv = document.getElementById('lista-cids');
    const sugerirBtn = document.getElementById('sugerir-btn'); // Pega o novo botão

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

        // --- MELHORIA DE UX: Desabilita o formulário durante a busca ---
        listaCidsDiv.innerHTML = '<p>Analisando com IA... 🧠</p>';
        hdaTextarea.disabled = true;
        sugerirBtn.disabled = true;
        sugerirBtn.textContent = 'Analisando...';

        try {
            const response = await fetch('/sugerir-cid', { // Não precisa mais do endereço completo http://localhost:3000
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto, especialidade }),
            });

            if (!response.ok) throw new Error(`Falha na resposta do servidor: ${response.statusText}`);

            const cidsSugeridos = await response.json();
            exibirResultados(cidsSugeridos);

        } catch (error) {
            console.error("Erro ao buscar sugestões:", error);
            listaCidsDiv.innerHTML = '<p>Ocorreu um erro ao contatar o serviço de IA. Verifique se o servidor backend está rodando e tente novamente.</p>';
        } finally {
            // --- MELHORIA DE UX: Reabilita o formulário ao final ---
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
    
    // REMOVEMOS os listeners antigos que ficavam observando a digitação.
    // hdaTextarea.addEventListener('input', debouncedSugerirCids);
    // especialidadeSelect.addEventListener('change', sugerirCids);

    // ADICIONAMOS o novo listener que só funciona com o clique no botão.
    sugerirBtn.addEventListener('click', sugerirCids);
});