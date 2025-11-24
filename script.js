// O evento 'DOMContentLoaded' garante que o script só será executado após o carregamento completo do HTML.
document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    // Mapeia os elementos HTML para variáveis JavaScript para fácil manipulação.
    const especialidadeSelect = document.getElementById('especialidade');
    const hdaTextarea = document.getElementById('hda');
    const listaCidsDiv = document.getElementById('lista-cids');
    const sugerirBtn = document.getElementById('sugerir-btn');
    const modelInfoDiv = document.getElementById('model-info');

    // --- CONSTANTES E DADOS ---
    const ESPECIALIDADES = [
        "Acupuntura", "Alergia e Imunologia", "Anestesiologia", "Angiologia", "Cardiologia", "Cirurgia Cardiovascular", "Cirurgia da Mão", "Cirurgia de Cabeça e Pescoço", "Cirurgia do Aparelho Digestivo", "Cirurgia Geral", "Cirurgia Oncológica", "Cirurgia Pediátrica", "Cirurgia Plástica", "Cirurgia Torácica", "Cirurgia Vascular", "Clínica Médica", "Coloproctologia", "Dermatologia", "Endocrinologia e Metabologia", "Endoscopia", "Gastroenterologia", "Genética Médica", "Geriatria", "Ginecologia e Obstetrícia", "Hematologia e Hemoterapia", "Homeopatia", "Infectologia", "Mastologia", "Medicina de Emergência", "Medicina de Família e Comunidade", "Medicina do Trabalho", "Medicina do Tráfego", "Medicina Esportiva", "Medicina Física e Reabilitação", "Medicina Intensiva", "Medicina Legal e Perícia Médica", "Medicina Nuclear", "Medicina Preventiva e Social", "Nefrologia", "Neurocirurgia", "Neurologia", "Nutrologia", "Oftalmologia", "Oncologia Clínica", "Ortopedia e Traumatologia", "Otorrinolaringologia", "Patologia", "Patologia Clínica/Medicina Laboratorial", "Pediatria", "Pneumologia", "Psiquiatria", "Radiologia e Diagnóstico por Imagem", "Radioterapia", "Reumatologia", "Urologia"
    ];

    // --- FUNÇÕES ---

    /**
     * Popula o dropdown de especialidades com a lista em ordem alfabética.
     */
    function carregarEspecialidades() {
        especialidadeSelect.innerHTML = '<option value="">Selecione...</option>';
        ESPECIALIDADES.sort().forEach(esp => {
            const option = document.createElement('option');
            option.value = esp;
            option.textContent = esp;
            especialidadeSelect.appendChild(option);
        });
    }

    /**
     * Função principal que é chamada ao clicar no botão.
     * Ela coleta os dados, envia para o backend e gerencia o estado da UI.
     */
    async function sugerirCids() {
        const especialidade = especialidadeSelect.value;
        const texto = hdaTextarea.value;

        // Validação inicial no frontend para evitar requisições desnecessárias.
        if (!especialidade || texto.length < 10) {
            listaCidsDiv.innerHTML = '<p>Selecione uma especialidade e digite uma descrição clínica detalhada (mínimo 10 caracteres).</p>';
            return;
        }

        // Atualiza a UI para mostrar que o processamento começou.
        listaCidsDiv.innerHTML = '<p>Analisando com IA... 🧠</p>';
        modelInfoDiv.innerHTML = '';
        hdaTextarea.disabled = true;
        sugerirBtn.disabled = true;
        sugerirBtn.textContent = 'Analisando...';

        // Bloco try...catch para lidar com sucessos e falhas na comunicação com o backend.
        try {
            // Define a URL da API baseada no ambiente (local ou produção)
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const apiUrl = isLocal ? 'http://localhost:3000/sugerir-cid' : 'https://cida-i-backend.onrender.com/sugerir-cid';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto, especialidade }),
            });

            // Lê o corpo da resposta como JSON.
            const responseData = await response.json();

            // Se a resposta não foi bem-sucedida, o backend enviou um JSON com a chave 'error'
            if (!response.ok) {
                // Lança um erro com a mensagem específica vinda do backend para ser capturado pelo 'catch'.
                throw new Error(responseData.error || `Falha na resposta do servidor: ${response.statusText}`);
            }
            
            // Passa a lista de sugestões para exibirResultados
            exibirResultados(responseData.suggestions);

            // Exibe a outra parte do objeto
            modelInfoDiv.innerHTML = `Análise fornecida pelo modelo: <strong>${responseData.modelName}</strong>`;

        // Se qualquer erro ocorrer no bloco 'try' (falha de rede, erro do servidor, etc.), ele é capturado aqui.
        } catch (error) {
            console.error("Erro ao buscar sugestões:", error);
            // Monta uma mensagem de erro amigável para o usuário.
            // Erros de rede (backend offline) ou CORS geralmente são 'TypeError'.
            const isNetworkError = error instanceof TypeError && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'));
            const mensagemErro = isNetworkError
                ? 'Não foi possível conectar ao servidor. Verifique se o programa de análise (backend) está ativo e tente novamente.'
                : error.message;
            listaCidsDiv.innerHTML = `<p class="error-message"><strong>Erro:</strong> ${mensagemErro}</p>`;
        
        // O bloco 'finally' sempre é executado, independentemente de sucesso ou falha.
        } finally {
            // Restaura o estado original da UI, permitindo uma nova requisição.
            hdaTextarea.disabled = false;
            sugerirBtn.disabled = false;
            sugerirBtn.textContent = 'Sugerir CIDs 💡';
        }
    }

    /**
     * Renderiza a lista de sugestões de CID no HTML.
     * @param {Array} cids - Um array de objetos, onde cada objeto representa uma sugestão de CID.
     */
    function exibirResultados(cids) {
        // Recebe a variável 'cids' como um array
        // Validação para o caso de a IA não retornar sugestões.
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
    // Chama a função para carregar as especialidades assim que a página carrega.
    carregarEspecialidades();
    // Adiciona o "ouvinte" de evento para o clique no botão.
    sugerirBtn.addEventListener('click', sugerirCids);
});