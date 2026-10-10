FROM node:20-alpine

WORKDIR /app

COPY server.js ./server.js

ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

CMD ["node", "server.js"]