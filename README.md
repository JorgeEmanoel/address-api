## Address Manager

Este projeto consiste em uma API para gerenciamento de endereços por usuário.

Autor: [Jorge emanoel](https://jorgeemanoel.com)

### Tecnologias

- [nodejs](https://nodejs.org/en/)
- [typescript](https://www.typescriptlang.org/)
- [mysql](https://www.mysql.com/)
- [sequelize](https://sequelize.org/)

### Instalação

Você deve possuir o [docker](https://www.docker.com/) e o [docker-compose](https://docs.docker.com/compose/install).

1. Copie o `.env.example` para `.env` e defina os valores necessários para subir o container:

```bash
cp .env.example .env
```

2. Suba os containers

```bash
docker-compose up -d
```

3. Crie um banco de dados:

Entre no container:
```bash
docker exec -it address_api_db mysql -u root -p'123456'
```

e depois:
```mysql
mysql> create database address_db;
```

4. Salve as configurações de acesso ao banco no seu `.env`. Seu arquivo deve ficar parecido com isto:

```env
DB_HOST=127.0.0.1
DB_USERNAME=root
DB_PASSWORD=123456
DB_PORT=3306
DB_NAME=address_db
```

5. Reinicie os containers:

```bash
docker-compose down && docker-compose up -d
```

6. Migre o banco:

```bash
docker exec address_api bash -c 'cd /app && yarn migrate'
```

### Testes

Após configurar corretamente a aplicação, os testes podem ser executados através do seguinte comando:

```bash
docker exec address_api bash -c 'cd /app && yarn test'
```
