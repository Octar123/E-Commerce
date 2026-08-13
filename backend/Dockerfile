FROM node:20

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose backend port
EXPOSE 3001

# Start the server using ts-node since TypeORM expects .ts entities
CMD ["npx", "ts-node", "src/index.ts"]
