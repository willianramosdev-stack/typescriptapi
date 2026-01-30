npm init 

npm i --save-dev typescript tsx @types/node
npm i fastify
npm tsc --init
remover comentario do tsconfig.json (outdir)
adicionar no package.json

  "scripts": {
    "dev": "tsx --watch ./src/index.ts",
    "build": "tsc",
    "start": "node ./dist/index.js"
  }
  
npm prisma generate
npm prisma db push


se der erro no fastify mudar no package.json 
"type": "module"


