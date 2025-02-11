FROM oven/bun
LABEL authors="Azraїl"

# Установите рабочий каталог
WORKDIR /usr/src/app

EXPOSE 3000

COPY package.json ./
COPY bun.lockb ./

RUN mkdir "fileTree"

RUN bun install
COPY . .

RUN bun run build
CMD ["bun", "start"]