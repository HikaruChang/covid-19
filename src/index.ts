import { Router } from 'cloudworker-router';
import { AppendFileFromAPI, NewClient, NewWriteOpts } from './shimo';
import { GetFileWithOpts } from './shimo/index';
import { config } from './config';

const router = new Router();

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    return router.handle(request, env, ctx);
  },
};

router.use(router.allowedMethods());

router.get('/', async (ctx) => {
  return new Response('Make A Better World');
});

router.get('/accommodations', async (ctx) => {
  const shimoClient = await NewClient(config.shimo.clientId, config.shimo.clientSecret, config.shimo.username, config.shimo.password, config.shimo.scope);
  const field = "6c6GKvX83hRCVdG8";
  const opt: Shimo.Opts = {
    sheet_name: "main",
    end_row: 278,
    end_col: "R",
    header_suffix: "（",
    cache_ttl: 5 * 60,
  }

  const message = await GetFileWithOpts(shimoClient, field, opt);
  if (!message) {
    return new Response("Failed to get document", { status: 500 });
  }

  return new Response(message, { status: 200 });
});

router.get('/platforms/psychological', async (ctx) => {
  const shimoClient = await NewClient(config.shimo.clientId, config.shimo.clientSecret, config.shimo.username, config.shimo.password, config.shimo.scope);
  const field = "Dpy6Q668cj3Xx8Rq";
  const opt: Shimo.Opts = {
    sheet_name: "main",
    end_row: 19,
    end_col: "M",
    header_suffix: "\n",
    cache_ttl: 30 * 60,
  }

  const message = await GetFileWithOpts(shimoClient, field, opt);
  if (!message) {
    return new Response("Failed to get document", { status: 500 });
  }

  return new Response(message, { status: 200 });
});

router.get('/platforms/medical', async (ctx) => {
  const shimoClient = await NewClient(config.shimo.clientId, config.shimo.clientSecret, config.shimo.username, config.shimo.password, config.shimo.scope);
  const field = "kDQJ6vWgWWwq8r8H";
  const opt: Shimo.Opts = {
    sheet_name: "main",
    end_row: 30,
    end_col: "D",
    header_suffix: "（",
    cache_ttl: 30 * 60,
  }

  const message = await GetFileWithOpts(shimoClient, field, opt);
  if (!message) {
    return new Response("Failed to get document", { status: 500 });
  }

  return new Response(message, { status: 200 });
});

router.get('/hospital/supplies', async (ctx) => {
  const shimoClient = await NewClient(config.shimo.clientId, config.shimo.clientSecret, config.shimo.username, config.shimo.password, config.shimo.scope);
  const field = "zN32MwmPjmCLF0Av";
  const opt: Shimo.Opts = {
    sheet_name: "main",
    end_row: 426,
    end_col: "AP",
    header_suffix: " ",
    cache_ttl: 5 * 60,
  }

  const message = await GetFileWithOpts(shimoClient, field, opt);
  if (!message) {
    return new Response("Failed to get document", { status: 500 });
  }

  return new Response(message, { status: 200 });
});

router.get('/hospital/supplies/v2', async (ctx) => {
  const shimoClient = await NewClient(config.shimo.clientId, config.shimo.clientSecret, config.shimo.username, config.shimo.password, config.shimo.scope);
  const field = "DqpyXVgXCwdvqrht";
  const opt: Shimo.Opts = {
    sheet_name: "main",
    end_row: 300,
    end_col: "BR",
    header_suffix: "----",
    cache_ttl: 30 * 60,
  }

  const message = await GetFileWithOpts(shimoClient, field, opt);
  if (!message) {
    return new Response("Failed to get document", { status: 500 });
  }

  return new Response(message, { status: 200 });
});

router.get('/people/accommodations', async (ctx) => {
  const shimoClient = await NewClient(config.shimo.clientId, config.shimo.clientSecret, config.shimo.username, config.shimo.password, config.shimo.scope);
  const field = "DR3OV8MN9yUxFnAB";
  const opt: Shimo.Opts = {
    sheet_name: "main",
    end_row: 934,
    end_col: "L",
    header_suffix: " ",
    cache_ttl: 60 * 60,
  }

  const message = await GetFileWithOpts(shimoClient, field, opt);
  if (!message) {
    return new Response("Failed to get document", { status: 500 });
  }

  return new Response(message, { status: 200 });
});

router.get('/wiki/stream', async (ctx) => {
  const shimoClient = await NewClient(config.shimo.clientId, config.shimo.clientSecret, config.shimo.username, config.shimo.password, config.shimo.scope);
  const field = "XRkgJOMRW0CrFbqM";
  const opt: Shimo.Opts = {
    sheet_name: "main",
    end_row: 100,
    end_col: "H",
    header_suffix: " ",
    cache_ttl: 30 * 60,
  }

  const message = await GetFileWithOpts(shimoClient, field, opt);
  if (!message) {
    return new Response("Failed to get document", { status: 500 });
  }

  return new Response(message, { status: 200 });
});

router.post('/hospital/supplies/submissions', async (ctx) => {
  const body: Submission = await ctx.request.json();
  if (!body) {
    return new Response("Invalid request", { status: 400 });
  }

  if (!body.name || !body.address || !body.province || !body.city || !body.suburb || !body.contactOrg || !body.contactPhone || !body.logisticsStatus || !body.pathways || !body.supplies) {
    return new Response("Invalid request", { status: 400 });
  }

  const supplies = body.supplies.map((supply) => {
    return {
      "物资名称": supply.name,
      "数量单位": supply.unit,
      "需求数量": supply.need,
      "每日消耗": supply.daily,
      "库存数量": supply.have,
      "物资要求": supply.requirements,
    }
  });

  const tmpl = {
    "医院名称": body.name,
    "医院所在地区": `${body.province} ${body.city} ${body.suburb}`,
    "医院详细地址": body.address,
    "医院现每天接待患者数量": body.patients,
    "医院床位数": body.beds,
    "负责人姓名": body.contactName,
    "责任人所在单位或组织": body.contactOrg,
    "责任人联系方式": body.contactPhone,
    "物资需求": supplies,
    "可接受的捐物资渠道": body.pathways,
    "现在的物流状况": body.logisticsStatus,
    "需求信息数据来源": body.source,
    "需求的官方证明": body.proof,
    "其他备注": body.notes,
  }

  return new Response(null, { status: 204 });
});

router.get('/community/supplies', async (ctx) => {
  const shimoClient = await NewClient(config.shimo.clientId, config.shimo.clientSecret, config.shimo.username, config.shimo.password, config.shimo.scope);
  const field = "qrpCHCDY8t6wccpD";
  const opt: Shimo.Opts = {
    sheet_name: "main",
    end_row: 100,
    end_col: "M",
    header_suffix: " ",
    cache_ttl: 5 * 60,
  }

  const message = await GetFileWithOpts(shimoClient, field, opt);
  if (!message) {
    return new Response("Failed to get document", { status: 500 });
  }

  return new Response(message, { status: 200 });
});

router.post('/community/supplies/submissions', async (ctx) => {
  const shimoClient = await NewClient(config.shimo.clientId, config.shimo.clientSecret, config.shimo.username, config.shimo.password, config.shimo.scope);
  const body: CommunitySubmission = await ctx.request.json();
  if (!body) {
    return new Response("Invalid request", { status: 400 });
  }

  if (!body.name || !body.address || !body.province || !body.city || !body.suburb || !body.age) {
    return new Response("Invalid request", { status: 400 });
  }

  const field = "qrpCHCDY8t6wccpD";
  const w = NewWriteOpts("main", await ctx.request.json());
  AppendFileFromAPI(shimoClient, field, w);

  return new Response(null, { status: 204 });
});