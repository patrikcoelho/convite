# Convite de Casamento — Vitória & Patrik

Landing page em Next.js + TypeScript + Tailwind para convite de casamento.

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Onde editar textos e dados

- Hero, evento, detalhes, contagem, RSVP e FAQ: `app/page.tsx` e componentes em `components/`.
- Data do evento: `components/CountdownSection.tsx` (const `targetDate`).
- Local, horários e placeholders: `components/DetailsSection.tsx` e `components/EventSection.tsx`.
- Perguntas do FAQ: `components/FaqSection.tsx`.
- Imagens de apoio (stock): `public/stock/` (substitua pelos arquivos do casal quando desejar).

## Integração RSVP (Google Sheets)

A integração funciona com duas opções. Selecione via `NEXT_PUBLIC_RSVP_PROVIDER`.

### OPÇÃO A (padrão): Google Forms

1. Crie um Google Form com os campos:
   - Nome completo
   - Presença (Sim/Não)
   - Quantidade de acompanhantes
   - Nomes dos acompanhantes
   - Telefone/WhatsApp
   - Restrições alimentares
   - Mensagem aos noivos
2. No Form, clique em **Enviar > </>** e copie o link para o endpoint `formResponse`.
   - Exemplo:
     ```
     https://docs.google.com/forms/d/e/SEU_FORM_ID/formResponse
     ```
3. Encontre os IDs `entry.xxxxx` abrindo o Form e inspecionando o HTML (ou usando o link pré-preenchido).
4. Configure o `.env.local`:

```bash
NEXT_PUBLIC_RSVP_PROVIDER=forms
NEXT_PUBLIC_GOOGLE_FORM_ACTION=https://docs.google.com/forms/d/e/SEU_FORM_ID/formResponse
NEXT_PUBLIC_GOOGLE_FORM_ENTRY_NAME=entry.1111111111
NEXT_PUBLIC_GOOGLE_FORM_ENTRY_PRESENCE=entry.2222222222
NEXT_PUBLIC_GOOGLE_FORM_ENTRY_QUANTITY=entry.3333333333
NEXT_PUBLIC_GOOGLE_FORM_ENTRY_COMPANIONS=entry.4444444444
NEXT_PUBLIC_GOOGLE_FORM_ENTRY_WHATSAPP=entry.5555555555
NEXT_PUBLIC_GOOGLE_FORM_ENTRY_RESTRICTIONS=entry.6666666666
NEXT_PUBLIC_GOOGLE_FORM_ENTRY_MESSAGE=entry.7777777777
```

Observação: o envio para Google Forms usa `no-cors`, portanto o retorno não é validado pelo navegador.

### OPÇÃO B: Google Apps Script (Web App)

1. Abra a planilha onde deseja receber os dados.
2. Vá em **Extensões > Apps Script** e cole o conteúdo de `apps-script/Code.gs`.
3. Publique como **Web App**:
   - Execute como: **Você**
   - Quem tem acesso: **Qualquer pessoa**
4. Copie a URL gerada e defina no `.env.local`:

```bash
NEXT_PUBLIC_RSVP_PROVIDER=apps_script
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/SEU_ID/exec
```

## Campos enviados

Os campos enviados pelo RSVP são:
- `nomeCompleto`
- `presenca`
- `quantidadeAcompanhantes`
- `nomesAcompanhantes`
- `telefoneWhatsapp`
- `restricoesAlimentares`
- `mensagemAosNoivos`
