# [File manager](https://github.com/AzrailVOI/next-file-manager)

Developed by [AzrailVOI](https://github.com/AzrailVOI)

Developed on [Next.js 15](https://github.com/vercel/next.js)

### Allows:

- upload files
- create folders
- watch files (only browser supported)
- rename and delete files and folders (right mouse button on file or folder)

### Implemented in 4 languages:

- English
- Ukrainian
- Slovak
- Russian.

You can add new translations in the file along the path `src/constants/dictionary.ts`

# Quick start with Docker

```shell
docker run -d -p 3000:3000 azrailvo/next-file-manager
```

With Docker Volume

```shell
docker volume create filetree_volume
```

```shell
docker run -d -p 3000:3000 -v filetree_volume:/usr/src/app/fileTree azrailvo/next-file-manager
```

# Quick start with NodeJS or Bun

Create `fileTree` directory in your project

```shell
mkdir fileTree
```

Install dependencies

```shell
npm install
```

```shell
yarn
```

```shell
pnpm install
```

```shell
bun install
```

Launch

- In development mode

```sh
bun dev
```

- In standard mode

```sh
bun start
```

- PM2 launch

```sh
pm2 start bun --name "file-manager" -- start
```

# Build

```shell
npm run build
```

```shell
yarn run build
```

```shell
pnpm run build
```

```shell
bun run build
```
