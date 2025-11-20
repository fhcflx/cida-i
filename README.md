# CIDA.i - Assistente de Codificação Médica com IA

Aplicação web que utiliza a API do Google Gemini para sugerir códigos da CID-10 a partir de descrições de casos clínicos em linguagem natural.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Gemini](https://img.shields.io/badge/Google-Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

  <!-- 
    =====================================================================
    => AÇÃO NECESSÁRIA: Tire um screenshot da sua aplicação em funcionamento 
    => e salve o arquivo como 'screenshot.png' na raiz deste projeto.
    =====================================================================
  -->
  <img src="./screenshot.png" alt="Screenshot da aplicação CIDA.i em funcionamento" width="800"/>
</div>

<br>

## 📋 Sobre o Projeto

**CIDA.i** (Codificação Inteligente de Doenças com Auxílio de IA) é uma ferramenta de apoio projetada para profissionais da saúde. A partir de um texto descrevendo a história clínica (HDA) de um paciente e a especialidade médica, a aplicação se conecta à API do Google Gemini para analisar o contexto e sugerir os códigos da Classificação Internacional de Doenças (CID-10) mais relevantes, incluindo uma justificativa para cada sugestão.

O projeto foi desenvolvido com uma arquitetura moderna de frontend e backend, focando em uma experiência de usuário limpa e intuitiva.

---

## ✨ Funcionalidades

-   **Interface Moderna:** Design limpo e responsivo, focado na usabilidade.
-   **Análise por IA:** Utiliza o poder dos Large Language Models (LLM) do Google para uma compreensão semântica do texto clínico.
-   **Seleção de Especialidade:** Permite contextualizar a busca para obter resultados mais precisos.
-   **Sugestões Justificadas:** Além do código, a IA fornece uma breve explicação sobre por que cada CID é relevante.
-   **Feedback Visual:** O usuário é informado visualmente enquanto a análise está sendo processada.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes tecnologias:

-   **Frontend:**
    -   HTML5
    -   CSS3
    -   JavaScript (ES6+)
-   **Backend:**
    -   Node.js
    -   Express.js
-   **Inteligência Artificial:**
    -   Google Gemini API (`@google/generative-ai`)
-   **Gerenciamento de Ambiente:**
    -   `dotenv`

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para executar a aplicação em seu ambiente local.

```bash
# 1. Clone o repositório
git clone https://github.com/fhcflx/cida-i.git

# 2. Acesse a pasta do projeto
cd cida-i

# 3. Instale as dependências do backend
npm install
```

## Configuração da Chave de API

Para que a aplicação se comunique com a IA do Google, você precisa da sua chave de API.

1. Crie um arquivo chamado .env na raiz do projeto.

2. Dentro deste arquivo, adicione a seguinte linha, substituindo SUA_CHAVE_AQUI pela sua chave da API do Gemini:

```code
# .env
GOOGLE_API_KEY=SUA_CHAVE_AQUI
```

## Execução do Servidor

Iniciando a Aplicação

```bash
# Execute o servidor Node.js
node server.js
```

Após executar o comando acima, a aplicação estará disponível em seu navegador no endereço http://localhost:3000.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

<div align="center">
Feito com ❤️ por Francisco Felix
</div>