import { NextResponse } from "next/server";

type RSVPRequestBody = {
  nomeCompleto?: string;
  presenca?: string;
  quantidadeAcompanhantes?: number;
  nomesAcompanhantes?: string[];
  telefoneWhatsapp?: string;
  restricoesAlimentares?: string;
  mensagemAosNoivos?: string;
};

export async function POST(request: Request) {
  try {
    const endpoint = process.env.APPS_SCRIPT_URL || process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

    if (!endpoint) {
      return NextResponse.json(
        {
          ok: false,
          message: "APPS_SCRIPT_URL não configurada.",
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as RSVPRequestBody;

    if (!body.nomeCompleto?.trim()) {
      return NextResponse.json(
        {
          ok: false,
          message: "Nome completo é obrigatório.",
        },
        { status: 400 }
      );
    }

    if (!body.presenca?.trim()) {
      return NextResponse.json(
        {
          ok: false,
          message: "Presença é obrigatória.",
        },
        { status: 400 }
      );
    }

    const payload = {
      nomeCompleto: body.nomeCompleto.trim(),
      presenca: body.presenca.trim(),
      quantidadeAcompanhantes: Number(body.quantidadeAcompanhantes || 0),
      nomesAcompanhantes: Array.isArray(body.nomesAcompanhantes) ? body.nomesAcompanhantes : [],
      telefoneWhatsapp: body.telefoneWhatsapp?.trim() || "",
      restricoesAlimentares: body.restricoesAlimentares?.trim() || "",
      mensagemAosNoivos: body.mensagemAosNoivos?.trim() || "",
    };

    const upstreamResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const rawText = await upstreamResponse.text();
    const upstreamData = safeParseJson(rawText);

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: upstreamData?.message || "Falha ao enviar RSVP para o Apps Script.",
        },
        { status: 502 }
      );
    }

    if (upstreamData && upstreamData.ok === false) {
      return NextResponse.json(
        {
          ok: false,
          message: upstreamData.message || "Apps Script recusou a confirmação.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: upstreamData?.message || "Confirmação enviada com sucesso.",
    });
  } catch (error) {
    console.error("RSVP API error", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Não foi possível processar sua confirmação agora.",
      },
      { status: 500 }
    );
  }
}

function safeParseJson(value: string) {
  try {
    return JSON.parse(value) as { ok?: boolean; message?: string };
  } catch {
    return null;
  }
}
