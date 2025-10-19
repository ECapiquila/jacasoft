# jacasoft

Landing page com captura de leads integrada a um backend PHP que valida os dados e gera automaticamente a mensagem para o WhatsApp **244925521667**.

## Pré-requisitos

- PHP 8.1+ com extensões `pdo` e `pdo_mysql` habilitadas
- Servidor web configurado para direcionar as requisições para `index.php` (ex.: Apache com `mod_php` ou o servidor embutido do PHP)
- MySQL 8+ ou MariaDB 10.5+

## Configuração do banco de dados

A aplicação já está pronta para se conectar ao banco provisionado com as seguintes credenciais:

- Servidor: `localhost`
- Porta: `3306`
- Base de dados: `u638520025_paginavendas`
- Usuário: `u638520025_paginavendas`
- Senha: `OmVaZw~He8q/`

Basta garantir que o banco esteja acessível com essas informações e importar o esquema disponível em `database/schema.sql`.

> **Nota:** o fluxo atual apenas valida os dados e retorna o link do WhatsApp, sem gravar registros. As credenciais acima permanecem disponíveis caso seja necessário reativar a persistência no futuro.

Se desejar utilizar outras credenciais, defina as variáveis de ambiente abaixo antes de iniciar a aplicação:

```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=seu_banco
export DB_USER=seu_usuario
export DB_PASSWORD=sua_senha # opcional
```

## Executando localmente

Com o PHP instalado, execute o servidor embutido apontando para o diretório do projeto:

```bash
php -S localhost:8000 index.php
```

Em seguida acesse `http://localhost:8000` no navegador. O formulário modal enviará os dados para o endpoint `POST /api/leads`, que valida as informações no servidor e retorna o link do WhatsApp 244925521667 com a mensagem pronta para envio.
