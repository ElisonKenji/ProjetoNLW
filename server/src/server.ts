import 'dotenv/config';
import { fastifyCors } from '@fastify/cors';
import { fastifyMultipart } from '@fastify/multipart';
import { fastify } from 'fastify';
import printRoutes from 'fastify-print-routes';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { env } from './env.ts';
import { createQuestionRoute } from './http/routes/create-question.ts';
import { createRoomRoute } from './http/routes/create-room.ts';
import { getRoomQuestions } from './http/routes/get-room-questions.ts';
import { getRoomsRoute } from './http/routes/get-rooms.ts';
import { submitTextRoute } from './http/routes/submit-text.ts';
import { uploadAudioRoute } from './http/routes/upload-audio.ts';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: 'http://localhost:5173',
});

app.register(fastifyMultipart);

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get('/health', () => {
  return 'OK';
});

app.register(printRoutes);

app.register(getRoomsRoute);
app.register(createRoomRoute);
app.register(getRoomQuestions);
app.register(createQuestionRoute);
app.register(uploadAudioRoute, { prefix: '/rooms/:roomId' });
app.register(submitTextRoute, { prefix: '/rooms/:roomId' });

const start = async () => {
  try {
    await app.ready();
    app.printRoutes();

    await app.listen({ port: env.PORT });
    console.log(`✅ Server is running at: http://localhost:${env.PORT}`);
  } catch (err) {
    console.error('❌ Erro ao iniciar o servidor:', err);
    process.exit(1);
  }
};

start();
