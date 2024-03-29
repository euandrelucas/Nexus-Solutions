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

# Crie um usuário não-root
RUN adduser --disabled-password --gecos '' appuser

# Mude para o usuário não-root
USER appuser

# Comando para executar o bot quando o contêiner for iniciado
