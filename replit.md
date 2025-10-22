# Extrator de Manual de Sinalização

## Visão Geral
Aplicação web full-stack para extrair automaticamente dados de manuais de sinalização em PDF usando inteligência artificial (Claude API da Anthropic).

## Objetivo
Permitir que usuários façam upload de PDFs de manuais de sinalização e obtenham automaticamente uma tabela estruturada com dados extraídos (tipologia, código, descrição, quantidade, diretrizes X/Y, observações), que pode ser editada e exportada para CSV ou Excel.

## Stack Tecnológico

### Backend (Python)
- **Flask**: Framework web para API REST
- **Flask-CORS**: Habilitação de CORS para comunicação frontend-backend
- **PyMuPDF (fitz)**: Extração de texto de arquivos PDF
- **Anthropic SDK**: Integração com Claude API para processamento inteligente
- **Pandas**: Manipulação de dados para exportação
- **OpenPyXL**: Geração de arquivos Excel
- **Python-dotenv**: Gerenciamento de variáveis de ambiente

### Frontend (React)
- **React 19**: Biblioteca UI com hooks
- **Vite**: Build tool e dev server
- **Tailwind CSS 4**: Framework CSS utilitário
- **Lucide React**: Ícones modernos
- **PostCSS**: Processamento CSS

## Arquitetura do Projeto

```
/
├── app.py                 # Backend Flask com 3 endpoints
├── src/
│   ├── App.jsx           # Componente principal React (3 telas)
│   ├── main.jsx          # Entry point React
│   └── index.css         # Estilos globais com Tailwind
├── vite.config.js        # Configuração Vite com proxy para API
├── tailwind.config.js    # Configuração Tailwind
├── postcss.config.js     # Configuração PostCSS
├── package.json          # Dependências Node.js
└── pyproject.toml        # Dependências Python
```

## Funcionalidades Implementadas

### Backend (porta 8000)
1. **GET /api/health**: Health check do servidor e verificação da API key
2. **POST /api/processar-pdf**: 
   - Recebe PDF via multipart/form-data
   - Extrai texto com PyMuPDF
   - Processa com Claude API usando prompt estruturado
   - Retorna JSON com dados de sinalização
3. **POST /api/gerar-excel**: 
   - Recebe dados JSON
   - Gera arquivo Excel com Pandas/OpenPyXL
   - Retorna arquivo para download

### Frontend (porta 5000)
1. **Tela Upload**:
   - Drag & drop de PDF
   - Validação de arquivo (tipo e tamanho)
   - Botão "Processar PDF"
   
2. **Tela Processamento**:
   - Loading spinner animado
   - Mensagem de status
   
3. **Tela Resultados**:
   - Tabela HTML editável com todos os campos
   - Adicionar/remover linhas
   - Exportar para CSV
   - Exportar para Excel
   - Botão "Novo PDF" para reiniciar

### Design
- Gradiente indigo/purple/pink no background
- Cards brancos com sombra
- Botões coloridos (verde=adicionar, azul=CSV, verde-água=Excel, roxo=novo)
- Totalmente responsivo (mobile e desktop)
- Interface em português

## Prompt Claude API
O sistema usa o modelo `claude-sonnet-4-20250514` com o seguinte prompt:

```
Analise este manual de sinalização e extraia os dados em formato JSON.
Retorne APENAS um objeto JSON válido com a estrutura:
{
  "dados": [
    {
      "tipologia": "string",
      "codigo": "string (formato X.YY)",
      "descricao": "string",
      "quantidade": "número",
      "diretriz_x": "string",
      "diretriz_y": "string",
      "observacoes": "string"
    }
  ]
}

REGRAS:
- Agrupe variações do mesmo código somando quantidades
- Códigos devem estar no formato X.YY
- Se quantidade não especificada, use 0
- Retorne apenas JSON válido
```

## Variáveis de Ambiente
- `ANTHROPIC_API_KEY`: Chave da API Anthropic (obrigatória)
- Configurada via Replit Secrets

## Workflows
1. **Backend**: `python app.py` (porta 8000, console)
2. **Frontend**: `npm run dev` (porta 5000, webview)

## Tratamento de Erros
- Validação de arquivo no frontend (tipo e tamanho)
- Validação de PDF no backend
- Tratamento de erros de extração de texto
- Tratamento de erros de parsing JSON
- Mensagens de erro amigáveis ao usuário

## Estado Atual
✅ MVP funcional completo
✅ Upload e validação de PDF
✅ Processamento com Claude API
✅ Exibição em tabela editável
✅ Exportação CSV funcionando
✅ Exportação Excel funcionando
✅ Design responsivo implementado
✅ Ambos workflows rodando sem erros

## Próximas Melhorias (Fase 2)
- Cache de resultados processados
- Histórico de PDFs processados
- Validação avançada do JSON retornado
- Pré-visualização do PDF
- Testes automatizados

## Data de Criação
22 de outubro de 2025
