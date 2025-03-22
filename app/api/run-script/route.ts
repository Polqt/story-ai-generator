import { NextRequest } from 'next/server';
import { RunEventType, RunOpts } from '@gptscript-ai/gptscript';
import gptScript from '@/lib/gptScriptInstance';

const script = 'app/api/run-script/story-book.gpt';

export async function POST(request: NextRequest) {
  const { story, pages, path } = await request.json();

  // Example CLI command: Gptscript ./story-book.gpt --story "The story of a cat" --pages 10 --path "./output"
  const opts: RunOpts = {
    disableCache: true,
    // Gptscript ./story-book.gpt --story
    input: `--story ${story} --pages ${pages} --path ${path}`,
  };

  try {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const run = await gptScript.run(script, opts);

          run.on(RunEventType.Event, data => {
            controller.enqueue(
              encoder.encode(`event: ${JSON.stringify(data)}\n\n`),
            );
          });

          await run.text();
          controller.close();
        } catch (error) {
          controller.error(error);
          console.error('Error:', error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
