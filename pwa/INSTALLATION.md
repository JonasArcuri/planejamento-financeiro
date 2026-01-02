# Instalação do PWA

## Passos para Completar a Configuração

### 1. Gerar Ícones

Siga as instruções em `pwa/generate-icons.md` para criar os ícones necessários.

**Ícones obrigatórios:**
- `public/icons/icon-192x192.png` (mínimo)
- `public/icons/icon-512x512.png` (mínimo)

**Todos os tamanhos recomendados:**
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

### 2. Verificar Manifest

O arquivo `public/manifest.json` já está configurado. Verifique se:
- ✅ Nome e descrição estão corretos
- ✅ Theme color corresponde ao design
- ✅ Ícones estão referenciados corretamente

### 3. Testar Localmente

```bash
# Build de produção
npm run build

# Iniciar servidor de produção
npm start
```

**Importante:** O PWA só funciona em modo de produção (não em desenvolvimento).

### 4. Testar no Navegador

1. Abra `http://localhost:3000` no Chrome/Edge
2. Abra DevTools > Application > Manifest
3. Verifique se o manifest está carregado corretamente
4. Verifique se o Service Worker está registrado

### 5. Testar Instalação

**Desktop (Chrome/Edge):**
- Procure o ícone de instalação na barra de endereços
- Ou use o menu do navegador > Instalar app

**Mobile (Android):**
- Abra o app no Chrome
- Menu > Adicionar à tela inicial

**iOS (Safari):**
- Compartilhar > Adicionar à Tela de Início

### 6. Deploy na Vercel

O PWA é compatível com Vercel automaticamente:

1. Faça commit das mudanças
2. Push para o repositório
3. A Vercel fará o build automaticamente
4. O PWA estará disponível em produção

**Verificar após deploy:**
- Acesse `https://seu-dominio.vercel.app/manifest.json`
- Verifique se o service worker está ativo
- Teste a instalação

## Troubleshooting

### Service Worker não registra
- Verifique se está em modo de produção
- Limpe o cache do navegador
- Verifique o console para erros

### Ícones não aparecem
- Verifique se os arquivos existem em `public/icons/`
- Verifique os caminhos no `manifest.json`
- Use DevTools > Application > Manifest para ver erros

### App não instala
- Verifique se o manifest está válido
- Certifique-se de que está usando HTTPS (ou localhost)
- Verifique se o service worker está registrado

## Recursos Adicionais

- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev - PWA](https://web.dev/progressive-web-apps/)
- [Next.js PWA](https://github.com/shadowwalker/next-pwa)

