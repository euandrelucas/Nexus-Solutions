# Use uma imagem Python como base
FROM python:3.8

# Crie e defina o diretório de trabalho
WORKDIR /usr/src/app

# Copie os arquivos necessários para o diretório de trabalho
COPY requirements.txt .

# Instale as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copie o código-fonte para o diretório de trabalho
COPY . .

# Crie um usuário não-root
RUN adduser --disabled-password --gecos '' appuser

# Mude para o usuário não-root
USER appuser

# Comando para executar o bot quando o contêiner for iniciado
