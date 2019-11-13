ARG PROJECT_NAME=WebDocs
ARG PORT=5000
ARG RUNTIME_IMAGE=mcr.microsoft.com/dotnet/core/runtime:3.0-alpine
ARG SDK_IMAGE=mcr.microsoft.com/dotnet/core/sdk:3.0-alpine
ARG PROJECT_PLATFORM=linux-musl-x64
ARG CONFIG_MODE=Release
ARG ASPNETCORE_ENVIRONMENT=PRODUCTION

FROM ${RUNTIME_IMAGE} AS runtime
FROM ${SDK_IMAGE} AS sdk

FROM sdk as build
ARG PROJECT_NAME
ARG PROJECT_PLATFORM
ARG CONFIG_MODE
WORKDIR /src
COPY . .
RUN apk add npm
RUN npm install --prefix ClientApp
RUN dotnet build "$PROJECT_NAME.csproj" -c $CONFIG_MODE -o /app -r $PROJECT_PLATFORM

FROM build AS publish
ARG PROJECT_PLATFORM
ARG PROJECT_NAME
ARG CONFIG_MODE
RUN dotnet publish "$PROJECT_NAME.csproj" -c $CONFIG_MODE -o /app -r $PROJECT_PLATFORM

FROM runtime AS final
ARG PROJECT_NAME
ARG PORT
ENV PROJECT_NAME=$PROJECT_NAME
ENV PORT=$PORT
ENV ASPNETCORE_URLS=http://+:$PORT
ENV ASPNETCORE_ENVIRONMENT=$ASPNETCORE_ENVIRONMENT
WORKDIR /app
COPY --from=publish /app .
COPY out.pf* /app/cert.pfx
COPY Database.db /app/Database.db
RUN adduser -D aspnetcore
RUN chown aspnetcore:aspnetcore -R /app
USER aspnetcore
EXPOSE $PORT
CMD dotnet $PROJECT_NAME.dll
