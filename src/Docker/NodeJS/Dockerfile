# Use uma imagem Node.js como base
FROM node:20

# Crie e defina o diretório de trabalho
WORKDIR /usr/src/app

# Copie os arquivos necessários para o diretório de trabalho
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o código-fonte para o diretório de trabalho
COPY . .

# Exponha a porta utilizada pelo bot (se necessário)
# EXPOSE 3000

# Comando para executar o bot quando o contêiner for iniciado
