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

## Observacoes

- O endpoint do Apps Script agora fica no servidor do Next, entao o navegador nao precisa chamar o Google diretamente.
- Isso reduz problemas de CORS e evita expor a URL do Web App no bundle do cliente.
