const { ApiService, ListService } = require('./dist/index.js');

async function testRequest() {
  console.log('=== Iniciando teste de requisição ===\n');

  const api = new ApiService({
    baseUrl: 'http://localhost:8080/rest',
    token: 'token-aleatorio-para-teste'
  });

  console.log('Configuração:');
  console.log('- Base URL: http://localhost:8080/rest');
  console.log('- Model Class: descriptiongeoarea (será convertido para lowercase)');
  console.log('- Token: token-aleatorio-para-teste\n');

  console.log('Fazendo requisição...\n');

  const [data, error] = await ListService(
    api,
    'descriptiongeoarea',
    {}
  );

  if (error) {
   console.log("ERROR TESTE ===>>>", error)
  } else {
    console.log('✅ SUCESSO:');
    console.log('- Dados:', JSON.stringify(data, null, 2));
  }

  console.log('\n=== Teste finalizado ===');
}

testRequest().catch(err => {
  console.error('Erro não tratado:', err);
  process.exit(1);
});
