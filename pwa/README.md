# Progressive Web App (PWA) - Configuração

Este diretório contém a configuração e documentação do PWA para o projeto.

## Estrutura

```
pwa/
├── README.md              # Esta documentação
├── manifest.json          # Manifest do PWA (copiado para public/)
├── service-worker.js      # Service Worker customizado (opcional)
└── icons/                 # Ícones do PWA (copiados para public/icons/)
```

## Arquivos Principais

### 1. manifest.json
Define as configurações do PWA:
- Nome e descrição
- Ícones em diferentes tamanhos
- Theme color e background color
- Display mode
- Start URL

### 2. Service Worker
Gerenciado automaticamente pelo `next-pwa`:
- Cache de assets estáticos
- Cache de páginas
- Estratégia de cache (Network First, Cache First, etc.)
- Atualização automática

### 3. Ícones
Ícones necessários em diferentes tamanhos:
- 192x192 (Android)
- 512x512 (Android splash)
- 180x180 (iOS)
- favicon.ico

## Instalação

O PWA pode ser instalado:
- **Desktop**: Botão de instalação no navegador
- **Mobile**: Prompt de instalação ou menu do navegador
- **iOS**: Compartilhar > Adicionar à Tela de Início

## Compatibilidade

- ✅ Chrome/Edge (Android e Desktop)
- ✅ Safari (iOS 11.3+)
- ✅ Firefox (Android)
- ✅ Vercel (deploy automático)

## Manutenção

Para atualizar o PWA:
1. Atualize o `manifest.json` se necessário
2. Atualize os ícones em `public/icons/`
3. O service worker será atualizado automaticamente no próximo build

