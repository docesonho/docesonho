# Doce Sonho - Cardápio Digital

Uma aplicação moderna e responsiva para cardápio digital de uma doceria, desenvolvida com React, TypeScript e Tailwind CSS.

## ✨ Características Principais

### 🎨 Design Responsivo
- **Hero Moderno**: Layout lado a lado com texto e carrossel de imagens
- **Carrossel Automático**: Transição automática a cada 4 segundos
- **Indicadores Interativos**: Navegação por pontos clicáveis
- **Adaptação Mobile**: Layout empilhado em dispositivos móveis

### 🛠️ Funcionalidades

#### Hero Section
- Texto customizável (título, subtítulo, botão)
- Carrossel de 3 imagens promocionais
- Auto-play com controles manuais
- Efeitos visuais e animações

#### Sistema de Administração
- **Gestão de Produtos**: Criar, editar e excluir produtos
- **Gestão de Categorias**: Organizar produtos por categorias
- **Configuração do Hero**: Editar textos e imagens do hero
- **Upload de Imagens**: Redimensionamento automático
- **Autenticação**: Sistema de login seguro

#### Catálogo de Produtos
- **Filtros por Categoria**: Navegação por abas
- **Busca Inteligente**: Pesquisa por nome e descrição
- **Produtos em Destaque**: Seção especial para highlights
- **Carrinho de Compras**: Adicionar/remover produtos

### 🎯 Layout do Hero

O novo hero apresenta:

**Desktop:**
```
┌─────────────────────────────┬─────────────────────────────┐
│                             │                             │
│          TEXTO              │        CARROSSEL            │
│      ┌─────────────┐        │     ┌─────────────────┐     │
│      │   Título    │        │     │                 │     │
│      │ Descritivo  │        │     │     Imagem      │     │
│      │             │        │     │   Promocional   │     │
│      │  [Botão]    │        │     │                 │     │
│      └─────────────┘        │     └─────────────────┘     │
│                             │         ● ● ●               │
└─────────────────────────────┴─────────────────────────────┘
```

**Mobile:**
```
┌─────────────────────────────┐
│        CARROSSEL            │
│     ┌─────────────────┐     │
│     │     Imagem      │     │
│     │   Promocional   │     │
│     └─────────────────┘     │
│         ● ● ●               │
├─────────────────────────────┤
│          TEXTO              │
│      ┌─────────────┐        │
│      │   Título    │        │
│      │ Descritivo  │        │
│      │  [Botão]    │        │
│      └─────────────┘        │
└─────────────────────────────┘
```

## 🚀 Tecnologias Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Embla Carousel** - Componente de carrossel
- **Lucide React** - Ícones
- **React Router** - Navegação
- **LocalStorage** - Persistência de dados

## 📦 Instalação

```bash
# Clone o repositório
git clone [url-do-repositorio]

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🔧 Configuração

### Hero Section
Acesse `/admin` para configurar:

1. **Textos**:
   - Título principal (última palavra fica em rosa)
   - Subtítulo/descrição
   - Texto do botão

2. **Imagens**:
   - 3 imagens para o carrossel
   - Formato recomendado: 800×800px
   - Upload com redimensionamento automático

### Produtos e Categorias
- Gerencie produtos por categoria
- Upload de imagens otimizadas
- Preços e descrições editáveis

## 🎨 Cores Customizadas

O projeto usa um tema customizado com as cores:
- **bakery-pink**: Rosa principal (#ce7095)
- **bakery-dark-purple**: Roxo escuro para contrastes

## 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**: `sm`, `md`, `lg`, `xl` do Tailwind
- **Grid Adaptativo**: Layout flexível para diferentes telas

## 🔐 Área Administrativa

Acesse `/admin` com as credenciais configuradas para:
- Gerenciar produtos e categorias
- Configurar hero e textos
- Upload de imagens
- Visualizar estatísticas

## 📝 Scripts Disponíveis

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext ts,tsx",
  "type-check": "tsc --noEmit"
}
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Doce Sonho** - Desenvolvido com 💖 para adoçar o seu dia!
