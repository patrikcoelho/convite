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

## Upload de fotos para Supabase Storage

O fluxo de fotos funciona assim:

1. O convidado acessa `/fotos`
2. Seleciona fotos no celular
3. O navegador reduz as imagens antes do envio
4. A rota `POST /api/photos` recebe os arquivos no servidor
5. O servidor salva as fotos no bucket privado do Supabase Storage

### Configuracao do Supabase

1. Crie um bucket no Supabase Storage, por exemplo `wedding-photos`
2. Mantenha o bucket como privado
3. Configure estas variaveis no `.env.local` e no deploy:

```bash
SUPABASE_URL=https://SEU_PROJETO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=SUA_SERVICE_ROLE_KEY
SUPABASE_PHOTOS_BUCKET=wedding-photos
```

A `SUPABASE_SERVICE_ROLE_KEY` e um segredo de servidor. Nunca exponha essa chave no frontend e nunca commite em arquivos do repositorio.

## Observacoes

- O endpoint do Apps Script do RSVP fica no servidor do Next, entao o navegador nao precisa chamar o Google diretamente.
- Isso reduz problemas de CORS e evita expor a URL do Web App de RSVP no bundle do cliente.
- O upload de fotos nao usa login do convidado. A permissao de escrita no bucket fica restrita ao servidor por meio da `SUPABASE_SERVICE_ROLE_KEY`.
