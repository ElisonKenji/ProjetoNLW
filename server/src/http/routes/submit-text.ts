import type { FastifyPluginCallback } from 'fastify';
import { z } from 'zod/v4';
import { db } from '../../db/connections.ts';
import { schema } from '../../db/schema/index.ts';
import { generateEmbeddings } from '../../services/gemini.ts';

export const submitTextRoute: FastifyPluginCallback = (app, _opts, done) => {
  app.post(
    '/text',
    {
      schema: {
        params: z.object({
          roomId: z.string().uuid(),
        }),
        body: z.object({
          text: z.string().min(1, 'Texto não pode estar vazio'),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params as { roomId: string };
      const { text } = request.body as { text: string };

      const embeddings = await generateEmbeddings(text);

      const result = await db
        .insert(schema.audioChunks)
        .values({
          roomId,
          transcription: text,
          embeddings,
        })
        .returning();

      const chunk = result[0];

      if (!chunk) {
        throw new Error('Erro ao salvar texto na tabela audioChunks.');
      }

      return reply.status(201).send({ chunkId: chunk.id });
    }
  );

  done();
};
