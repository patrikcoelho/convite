# Convite de Casamento - Vitoria & Patrik

Landing page em Next.js + TypeScript + Tailwind para convite de casamento.

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Onde editar textos e dados

- Hero, evento, RSVP e demais secoes: `app/page.tsx` e componentes em `components/`
- Imagens de apoio: `public/stock/`
- Script de gravacao na planilha: `apps-script/Code.gs`

## Integracao RSVP com Google Sheets via Apps Script

O fluxo atual funciona assim:

1. O formulario da pagina envia para `POST /api/rsvp`
2. A rota do Next.js encaminha os dados para o Web App do Google Apps Script
3. O Apps Script grava a confirmacao na mesma planilha Google

### Configuracao do Apps Script

1. Abra a planilha de destino no Google Sheets
2. Va em `Extensoes > Apps Script`
3. Cole o conteudo de `apps-script/Code.gs`
4. Em `Project Settings > Script Properties`, defina `SPREADSHEET_ID` com o ID da planilha
5. Publique em `Deploy > New deployment > Web app`

Use estas opcoes:

- Execute as: `You`
- Who has access: `Anyone`

Copie a URL gerada e configure no `.env.local`:

```bash
APPS_SCRIPT_URL=https://script.google.com/macros/s/SEU_ID/exec
```

Tambem aceito por compatibilidade:

```bash
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/SEU_ID/exec
```

### Campos enviados

Os campos enviados para o Apps Script sao:

- `nomeCompleto`
- `presenca`
- `quantidadeAcompanhantes`
- `nomesAcompanhantes`
- `telefoneWhatsapp`
- `restricoesAlimentares`
- `mensagemAosNoivos`

## Upload de fotos para Google Drive

O fluxo de fotos funciona assim:

1. O convidado acessa `/fotos`
2. Seleciona fotos no celular
3. O navegador reduz as imagens antes do envio
4. A rota `POST /api/photos` encaminha os arquivos para o Apps Script
5. O Apps Script salva as fotos em uma pasta do Google Drive

### Configuracao da pasta de fotos

1. Crie uma pasta no Google Drive para receber as fotos
2. Abra a pasta e copie o ID da URL
3. No arquivo `apps-script/Code.gs`, cole o ID na propriedade `photoFolderId`:

```js
var CONFIG = {
  photoFolderId: "ID_DA_PASTA_DO_GOOGLE_DRIVE",
  // demais configuracoes...
};
```

O Apps Script tambem precisa estar atualizado com o conteudo de `apps-script/Code.gs` e publicado como Web App.

## Observacoes

- O endpoint do Apps Script agora fica no servidor do Next, entao o navegador nao precisa chamar o Google diretamente.
- Isso reduz problemas de CORS e evita expor a URL do Web App no bundle do cliente.
