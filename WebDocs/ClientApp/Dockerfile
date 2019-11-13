ARG RUNTIME_IMAGE=nginx:alpine
ARG SDK_IMAGE=node:alpine

FROM ${RUNTIME_IMAGE} AS runtime

FROM ${SDK_IMAGE} AS build
WORKDIR /app
COPY .  ./
RUN npm install
RUN npm run build --prod

FROM runtime as final
RUN rm -rf /usr/share/nginx/html/*
COPY ops/nginx_config.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/* /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]