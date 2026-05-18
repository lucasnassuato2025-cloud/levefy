import { NextResponse } from "next/server";
import ollama from "ollama";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
    Crie uma refeição fitness brasileira personalizada.

    Objetivo: ${body.goal}
    Peso: ${body.weight}kg
    Altura: ${body.height}
    Idade: ${body.age}
    Sexo: ${body.gender}
    Refeição: ${body.meal}

    Retorne:
    - Nome da refeição
    - Alimentos
    - Quantidades
    - Calorias
    - Proteínas
    - Carboidratos
    - Gorduras

    Responda em português.
    `;

    const response = await ollama.chat({
      model: "llama3",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      result: response.message.content,
    });

  } catch (error: any) {
    console.error(error);

    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}