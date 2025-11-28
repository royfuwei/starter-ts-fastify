// 擴展 FastifyRequest 類型以包含自定義屬性
declare module 'fastify' {
  interface FastifyRequest {
    startTime?: number;
  }
}
