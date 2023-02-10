Prisma:
Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.
3. Run npx prisma db pull to turn your database schema into a Prisma schema.
4. Run npx prisma generate to generate the Prisma Client. You can then start querying your database.

База данных в настоящее время не существует. Prisma создаст базу данных prisma/dev.db при первой миграции.

Миграция:
npx prisma migrate dev --name init

Команда создает миграцию с именем init. После завершения миграции создается новый /prisma/migrations каталог.
Поскольку вы работаете с SQLite, Prisma CLI создаст вашу базу данных и применит изменения к вашей базе данных.
После создания первой миграции Prisma CLI устанавливает пакет @prisma/client.
При последующих миграциях базы данных Prisma CLI создаст ваш Prisma Client.
Prisma Client — это автоматически сгенерированный клиент базы данных,
который позволяет вам взаимодействовать с вашей базой данных безопасным для типов способом.

Настройка typegraphql-prisma
TypeGraphQL обеспечивает интеграцию с Prisma с помощью [typegraphql-prisma](https://www.npmjs.com/package/typegraphql-prisma)пакета.
Этот пакет будет автоматически генерировать типы, перечисления и даже преобразователи CRUD на основе вашей схемы Prisma,
которую в противном случае вам пришлось бы писать вручную.
npm install --save-dev typegraphql-prisma
npm install graphql-type-json graphql-fields
npm install --save-dev @types/graphql-fields

Запустите npx prisma generate для создания классов TypeGraphQL и преобразователей CRUD на основе вашей схемы Prisma.
npx prisma generate
typegraphql-prisma отправляет сгенерированные классы, перечисления и распознаватели в node_modules/@generated/typegraphql-prisma.

При последующих миграциях классы и распознаватели, генерируемые TypeGraphQL,
будут автоматически обновляться при запуске npx prisma migrate dev.

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
CI CD:
обернуть в гит, запушить
настроить пайплайн:
    pr:
        создаем поддомен для ветки: mp-111.domen.ru
        отправляем туда файлы ветки
        открываем соединение ssh:
            устанавливаем порт по номеру ветки env
            переходим в папку src
            yarn
            запускаем проект


так же добавить монорепо для исключения дублирования зависимостей


.htcsess
RewriteEngine on
# редирект на https
RewriteCond %{HTTP:X-Forwarded-Protocol} !=https
RewriteRule .* https://%{SERVER_NAME}%{REQUEST_URI} [R=301,L]

# редирект ветки на ip + port. port берется из поддомена
RewriteCond %{HTTP_HOST} ^mps-(.*)\.test-metall\.site
RewriteRule ^(.*)$ http://127.0.0.1:%1/$1 [P,L]