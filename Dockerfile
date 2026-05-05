FROM node:20-alpine AS frontend-build
WORKDIR /app

COPY frontend/package*.json ./frontend/
RUN npm --prefix frontend install

COPY frontend ./frontend
RUN npm --prefix frontend run build

FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=10000

COPY backend/package*.json ./backend/
RUN npm --prefix backend install --omit=dev

COPY backend ./backend
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

EXPOSE 10000

CMD ["node", "backend/render-server.js"]
