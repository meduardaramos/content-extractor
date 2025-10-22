# Extrator de Manual de Sinalização

Uma aplicação web full-stack que extrai automaticamente dados de manuais de sinalização em PDF usando inteligência artificial (Claude API da Anthropic).

## 🚀 Funcionalidades

- **Upload de PDF**: Interface drag-and-drop intuitiva para upload de manuais
- **Processamento Inteligente**: Usa Claude AI para extrair dados estruturados
- **Tabela Editável**: Visualize e edite os dados extraídos em tempo real
- **Exportação**: Exporte dados para CSV ou Excel
- **Design Moderno**: Interface responsiva com gradiente indigo/purple

## 📋 Como Usar

1. **Acesse a aplicação** - A interface será carregada automaticamente
2. **Faça upload do PDF** - Arraste e solte ou clique para selecionar
3. **Processe o arquivo** - Clique em "Processar PDF" e aguarde
4. **Revise os dados** - Edite os dados extraídos conforme necessário
5. **Exporte** - Baixe em formato CSV ou Excel

## 🔧 Tecnologias

### Backend
- Python 3.11
- Flask
- Claude API (Anthropic)
- PyMuPDF
- Pandas

### Frontend
- React 19
- Vite
- Tailwind CSS 4
- Lucide Icons

## 📊 Estrutura dos Dados

Cada registro extraído contém:
- **Tipologia**: Tipo de sinalização
- **Código**: Código no formato X.YY
- **Descrição**: Descrição da sinalização
- **Quantidade**: Número de unidades
- **Diretriz X**: Diretriz horizontal
- **Diretriz Y**: Diretriz vertical
- **Observações**: Notas adicionais

## 🔒 Segurança

A chave da API Anthropic está armazenada de forma segura nas variáveis de ambiente do Replit.

## 📝 Próximas Melhorias

- Cache de resultados processados
- Histórico de PDFs processados
- Pré-visualização do PDF
- Validação avançada de dados
- Testes automatizados

## 📅 Desenvolvido em

22 de outubro de 2025
