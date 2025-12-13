// O evento 'DOMContentLoaded' garante que o script só será executado após o carregamento completo do HTML.
document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    // Mapeia os elementos HTML para variáveis JavaScript para fácil manipulação.
    const especialidadeInput = document.getElementById('especialidade');
    const modelSelect = document.getElementById('model-select');
    const modelDescription = document.getElementById('model-description');
    const hdaTextarea = document.getElementById('hda');
    const listaCidsDiv = document.getElementById('lista-cids');
    const sugerirBtn = document.getElementById('sugerir-btn');
    const modelInfoDiv = document.getElementById('model-info');
    
    // --- FUNÇÕES ---

    /**
     * Retorna a URL base da API dependendo se o ambiente é local ou de produção.
     */
    const getApiBaseUrl = () => {
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
        return isLocal ? 'http://localhost:3000' : 'https://cida-i-backend.onrender.com';
    };

    /**
     * Busca a lista de modelos de IA do backend e popula o dropdown.
     */
    async function carregarModelos() {
        try {
            const baseUrl = getApiBaseUrl();
            const response = await fetch(`${baseUrl}/models`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao carregar modelos do servidor.');
            }

            const modelos = await response.json();

            modelSelect.innerHTML = ''; // Limpa opções existentes
            if (modelos.length === 0) throw new Error('Nenhum modelo foi retornado pelo servidor.');

            modelos.forEach(modelo => {
                const option = document.createElement('option');
                option.value = modelo.id;
                option.textContent = modelo.name; // Ex: "Gemini 1.5 Pro"
                option.dataset.description = modelo.description; // Armazena a descrição no elemento
                modelSelect.appendChild(option);
            });
            atualizarDescricaoModelo(); // Atualiza a descrição para o primeiro modelo da lista
        } catch (error) {
            // Exibe a mensagem de erro específica vinda do backend ou uma mensagem genérica.
            modelDescription.textContent = `Erro: ${error.message}`;
            console.error('Erro ao carregar modelos:', error);
        }
    }

    /**
     * Função principal que é chamada ao clicar no botão.
     * Ela coleta os dados, envia para o backend e gerencia o estado da UI.
     */
    async function sugerirCids() {
        const especialidade = especialidadeInput.value.trim();
        const texto = hdaTextarea.value;
        const modelName = modelSelect.value;

        // Validação inicial no frontend para evitar requisições desnecessárias.
        if (!modelName || texto.length < 10) {
            listaCidsDiv.innerHTML = '<p>Selecione um modelo de IA e digite uma descrição clínica detalhada (mínimo 10 caracteres).</p>';
            return;
        }

        // Atualiza a UI para mostrar que o processamento começou.
        listaCidsDiv.innerHTML = '<p>Analisando com IA... 🧠</p>';
        modelInfoDiv.innerHTML = '';
        hdaTextarea.disabled = true;
        sugerirBtn.disabled = true;
        especialidadeInput.disabled = true;
        modelSelect.disabled = true;
        sugerirBtn.textContent = 'Analisando...';

        // Bloco try...catch para lidar com sucessos e falhas na comunicação com o backend.
        try {
            const apiUrl = `${getApiBaseUrl()}/sugerir-cid`;
            console.log(`[DEBUG] Usando API: ${apiUrl}`);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto, especialidade, modelName }),
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
            especialidadeInput.disabled = false;
            modelSelect.disabled = false;
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

    /**
     * Atualiza o texto de descrição do modelo de IA selecionado.
     */
    function atualizarDescricaoModelo() {
        const selectedOption = modelSelect.options[modelSelect.selectedIndex];
        if (selectedOption && selectedOption.dataset.description) {
            modelDescription.textContent = selectedOption.dataset.description;
        }
    }

    // --- INICIALIZAÇÃO E EVENTOS ---
    // Chama a função para carregar os modelos de IA assim que a página carrega.
    carregarModelos();
    // Adiciona o "ouvinte" de evento para o clique no botão.
    sugerirBtn.addEventListener('click', sugerirCids);
    // Adiciona um ouvinte para atualizar a descrição quando o modelo for trocado.
    modelSelect.addEventListener('change', atualizarDescricaoModelo);
});