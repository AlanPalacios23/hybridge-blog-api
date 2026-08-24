jest.mock('../src/config/database', () => ({
  query: jest.fn().mockResolvedValue({
    rowCount: 1,
    rows: [{ current_time: '2026-08-23T00:00:00.000Z' }],
  }),
  close: jest.fn(),
}));

const request = require('supertest');
const app = require('../src/app');

describe('Hybridge Blog API', () => {
  test('GET / responde que la API está en línea', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      name: 'Hybridge Blog API',
      status: 'online',
    });
  });

  test('GET /api/health confirma el estado de la API y PostgreSQL', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      status: 'healthy',
      database: { status: 'connected' },
    });
  });

  test('GET /openapi.json publica la especificación de la API', async () => {
    const response = await request(app).get('/openapi.json');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      openapi: '3.1.0',
      info: { title: 'Hybridge Blog API', version: '1.0.0' },
    });
  });

  test('GET /docs/ publica la documentación interactiva', async () => {
    const response = await request(app).get('/docs/');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Hybridge Blog API | Documentación');
    expect(response.text).toContain('id="swagger-ui"');
  });

  test('POST /api/auth/register rechaza datos inválidos', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'A',
      email: 'correo-invalido',
      password: '123',
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('POST /api/posts requiere autenticación', async () => {
    const response = await request(app).post('/api/posts').send({
      title: 'Publicación de prueba',
      content: 'Contenido suficientemente largo para la prueba.',
    });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('AUTH_REQUIRED');
  });

  test('una ruta inexistente responde 404 con un error claro', async () => {
    const response = await request(app).get('/ruta-inexistente');

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      success: false,
      error: { code: 'ROUTE_NOT_FOUND' },
    });
  });
});
