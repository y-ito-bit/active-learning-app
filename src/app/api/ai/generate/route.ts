import { NextRequest, NextResponse } from 'next/server';

// Models to try in order of preference
const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
const VERSIONS = ["v1beta", "v1"];

async function tryGenerate(apiKey: string, model: string, version: string, context: string) {
    const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;

    const prompt = `
    あなたは教育イベントのファシリテーターを支援するAIです。
    以下の議論や講義の内容（コンテキスト）をもとに、参加者に問いかけるべき「重要な問い」を3つ生成してください。
    それぞれの問いには、3〜4つの選択肢（回答）も作成してください。

    フォーマットは以下のJSON配列のみを返してください。余計なマークダウンや説明は不要です。
    [
      { "id": 1, "text": "問いのテキスト", "options": ["選択肢1", "選択肢2", "選択肢3"] },
      ...
    ]

    コンテキスト:
    ${context}
    `;

    const body = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }]
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`[${version}/${model}] HTTP ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    return data;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { apiKey, context } = body;

        if (!apiKey) {
            return NextResponse.json({ error: 'API Key is required' }, { status: 400 });
        }

        let lastError: any = null;
        let successResponse = null;
        let usedModel = "";
        let usedVersion = "";

        // Iterate through versions and models
        loop:
        for (const version of VERSIONS) {
            for (const model of MODELS) {
                try {
                    console.log(`Trying ${version}/${model}...`);
                    const data = await tryGenerate(apiKey, model, version, context);

                    // Parse response
                    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                        const text = data.candidates[0].content.parts[0].text;

                        // JSON parsing logic
                        const jsonStart = text.indexOf('[');
                        const jsonEnd = text.lastIndexOf(']');
                        let cleanText = text;
                        if (jsonStart !== -1 && jsonEnd !== -1) {
                            cleanText = text.substring(jsonStart, jsonEnd + 1);
                        }

                        const questions = JSON.parse(cleanText);
                        const formattedQuestions = questions.map((q: any, i: number) => ({
                            id: Date.now() + i,
                            text: q.text,
                            options: q.options
                        }));

                        successResponse = { questions: formattedQuestions, modelUsed: `${model} (${version})` };
                        usedModel = model;
                        usedVersion = version;
                        break loop;
                    }
                } catch (e: any) {
                    console.warn(`Failed ${version}/${model}: ${e.message}`);
                    lastError = e;
                }
            }
        }

        if (successResponse) {
            return NextResponse.json(successResponse);
        }

        // If all failed, try to list models to help debugging
        let availableModelsList = "Unknown";
        try {
            const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
            const listRes = await fetch(listUrl);
            if (listRes.ok) {
                const listData = await listRes.json();
                if (listData.models) {
                    availableModelsList = listData.models
                        .map((m: any) => m.name.replace('models/', ''))
                        .filter((n: string) => n.includes('gemini'))
                        .join(', ');
                }
            }
        } catch (e) {
            console.error("Failed to list models", e);
        }

        console.error("All attempts failed:", lastError);
        // Include detailed error for last attempt + available models
        return NextResponse.json({
            error: `All attempts failed. Last error: ${lastError?.message || 'Unknown'}. Please check if the API Key has access to these models. Available: ${availableModelsList}`,
            details: lastError?.toString()
        }, { status: 500 });

    } catch (error: any) {
        console.error("AI Generation Error", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
