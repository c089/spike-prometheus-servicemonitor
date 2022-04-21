import { Application, Router } from "./deps.ts";
import { Counter, Registry } from "./deps.ts";

const counter = Counter.with({
  name: "http_requests_total",
  help: "The total HTTP requests",
  labels: ["path", "method", "status"],
});

const app = new Application();

let healthStatus = 200;

const healthRouter = new Router()
  .get("/health", (ctx) => {
    ctx.response.status = healthStatus;
  })
  .post("/health", async (ctx) => {
    const body = ctx.request.body({ type: "text" });
    const bodyText = await body.value;
    healthStatus = parseInt(bodyText, 10);
    ctx.response.body = `Health endpoint will return ${healthStatus}`;
  });

app.use(async (ctx, next) => {
  await next();
  counter.labels({
    path: ctx.request.url.pathname,
    method: ctx.request.method,
    status: ctx.response.status.toString() || "",
  }).inc();
});

const metricsRouter = new Router()
  .get("/metrics", (ctx) => {
    ctx.response.headers.set("Content-Type", "");
    ctx.response.body = Registry.default.metrics();
  });

app.use(metricsRouter.routes());
app.use(healthRouter.routes());
await app.listen({ port: 8000 });
