FROM node
LABEL authors="Azraїl"

# Установите рабочий каталог
WORKDIR /usr/src/app

COPY package.json ./
COPY bun.lockb ./

RUN curl -fsSL https://bun.sh/install | bash

mkdir "tree"

RUN bun install
COPY . .

RUN bun run build
CMD ["bun", "start"]