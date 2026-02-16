import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (Global variable)
// Note: This data will be lost when the server restarts.
// For production, use a database like Redis or Postgres.

interface SessionState {
    activeQuestion: {
        id: number;
        text: string;
        options: string[];
    } | null;
    answers: { [option: string]: number };
}

let session: SessionState = {
    activeQuestion: null,
    answers: {},
};

export async function GET() {
    return NextResponse.json(session);
}

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (body.type === 'distribute') {
        // Organizer distributes a question
        session.activeQuestion = body.question;
        session.answers = {}; // Reset answers
        // Initialize answers with 0 for all options
        body.question.options.forEach((opt: string) => {
            session.answers[opt] = 0;
        });
        return NextResponse.json({ message: 'Question distributed', session });
    }

    if (body.type === 'answer') {
        // Participant submits an answer
        const { option } = body;
        if (session.answers[option] !== undefined) {
            session.answers[option]++;
        } else {
            session.answers[option] = 1;
        }
        return NextResponse.json({ message: 'Answer received', session });
    }

    if (body.type === 'reset') {
        session = {
            activeQuestion: null,
            answers: {}
        };
        return NextResponse.json({ message: 'Session reset', session });
    }

    return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
}
