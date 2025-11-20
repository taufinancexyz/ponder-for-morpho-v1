FROM node:22-slim

RUN apt-get update \
    && apt-get install --yes jq \
    && rm -rf /var/lib/apt/lists/*

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/ponder/package.json apps/ponder/package.json
RUN pnpm install --frozen-lockfile
COPY . .

CMD ["bash"]
