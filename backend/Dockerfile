FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --include=dev && npm cache clean --force

COPY . .
RUN useradd --system --uid 1001 --create-home floo
USER floo
EXPOSE 5000
CMD ["node", "src/server.js"]
