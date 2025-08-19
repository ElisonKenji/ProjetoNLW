// src/http/types/index.ts

export interface Question {
  isGeneratingAnswer: boolean | undefined
  id: string
  question: string
  answer: string | null
  createdAt: string
  // Adicione outras propriedades se houver, como:
  // votes: number;
  // authorId: string;
}

export interface GetRoomQuestionsResponse {
  questions: Question[] // O backend retorna um objeto com 'questions'
}
