FROM node:18-alpine
WORKDIR /app
COPY app/package*.json ./
RUN npm install --only=production
COPY app/ .
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["npm", "start"]