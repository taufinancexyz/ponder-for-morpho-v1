FROM node:22-slim

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm0,target=/pnpm/store pnpm install --frozen-lockfile --prod --ignore-scripts
COPY . .

CMD ["bash"]
