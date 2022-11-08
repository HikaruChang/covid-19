import { Transform } from "./transform";

export const shimoConfig = {
  endpoints: "https://api.shimo.im",
  tokenTTL: 21600,
  timeout: 3600,
}

export function NewWriteOpts(sheetName: string, v: Shimo.WriteObj): Shimo.WriteOpts {
  const w: Shimo.WriteOpts = {
    range: sheetName,
    resource: {
      values: [],
    }
  }

  w.resource!.values = [];
  w.resource!.values.concat(v.Values());

  return w;
}

export const NewClient = async (clientId: string, clientSecret: string, username: string, password: string, scope: string): Promise<Shimo.Client> => {
  const client: Shimo.Client = {
    clientId: clientId,
    clientSecret: clientSecret,
    username: username,
    password: password,
    scope: scope,
    cache: new Map(),
  }

  await ReceiveSign(client);

  return client;
}

export const DoOauth = async (c: Shimo.Client, v: any) => {
  const res = await fetch(`${shimoConfig.endpoints}/oauth/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${btoa(`${c.clientId}:${c.clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: v,
  });

  const data = res.json();
  if (res.status !== 200) {
    throw new Error(`non-200 response received when getting token: ${data}`);
  }

  if (!!data) {
    var oauthCredentials: Shimo.OauthResponse = await res.json();
    c.credential = {
      accessToken: oauthCredentials.access_token,
      accessTokenExpiresAt: Date.now() + shimoConfig.tokenTTL,
      refreshToken: oauthCredentials.refresh_token,
    }

    return oauthCredentials.access_token;
  }

  return "";
}

export const GetAccessToken = (c: Shimo.Client) => {
  const v = `grant_type=password&username=${c.username}&password=${c.password}&scope=${c.scope}`;
  return DoOauth(c, v);
}

export const RefreshToken = (c: Shimo.Client) => {
  if (!!c.credential && !!c.credential.refreshToken) {
    const v = `grant_type=refresh_token&refresh_token=${c.credential.refreshToken}&scope=${c.scope}`;
    return DoOauth(c, v);
  }

  return "";
}

export const Token = (c: Shimo.Client) => {
  if (!!c.credential?.accessToken) {
    if (!!c.credential.accessTokenExpiresAt && c.credential.accessTokenExpiresAt < Date.now()) {
      return c.credential.accessToken;
    } else {
      return RefreshToken(c);
    }
  } else {
    return GetAccessToken(c);
  }
}

export const Request = async (c: Shimo.Client, method: string, url: string, body?: any) => {
  const res = await fetch(url, {
    method: method,
    headers: {
      "Authorization": `Bearer ${await Token(c)}`,
      "Content-Type": "application/json",
    },
    body: body,
  });

  const data = await res.json();
  if (res.status !== 200 && res.status !== 204) {
    throw new Error(`request error: ${res.status} ${data}`);
  }

  if (!data) {
    throw new Error(`read response failed: ${data}`);
  }

  return data;
}

export const GetFileFromAPI = async (c: Shimo.Client, fileId: string, opts: Shimo.Opts) => {
  const url = `${shimoConfig.endpoints}/files/${fileId}/sheets/values?range=${opts.sheet_name}!A1:${opts.end_col}${opts.end_row}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${Token(c)}`,
      "Content-Type": "application/json",
    },
  });
  return Transform(response, opts.header_suffix!);
}

export const WriteFileFromAPI = async (c: Shimo.Client, method: string, fileId: string, opts: Shimo.WriteOpts) => {
  const url = `${shimoConfig.endpoints}/files/${fileId}/sheets/values`;

  await Request(c, method, url, opts);
}

export const UploadFileFromAPI = async (c: Shimo.Client, fileId: string, opts: Shimo.WriteOpts) => {
  return WriteFileFromAPI(c, "POST", fileId, opts);
}

export const AppendFileFromAPI = async (c: Shimo.Client, fileId: string, opts: Shimo.WriteOpts) => {
  return WriteFileFromAPI(c, "PUT", fileId, opts);
}

export const UpdateOrCreateCache = (c: Shimo.Client, fileId: string, opts: Shimo.Opts) => {
  const r = GetFileFromAPI(c, fileId, opts);

  const cache: Shimo.Cache = {
    expire: Date.now() + opts.cache_ttl!,
    Opts: opts,
    result: r,
  }

  c?.cache?.set(fileId, cache);
  return c?.cache;
}

export const ReceiveSign = (c: Shimo.Client,) => {
  c.asyncSign?.forEach((v) => {
    UpdateHandler(c, v.fileId, v.Opts);
  });
}

export const UpdateHandler = async (c: Shimo.Client, fileId: string, opts: Shimo.Opts) => {
  const cache = c.cache?.get(fileId);
  if (!!cache &&
    !!cache.expire &&
    cache.expire > Date.now() &&
    opts.sheet_name === cache.Opts.sheet_name &&
    opts.end_col === cache.Opts.end_col &&
    opts.end_row === cache.Opts.end_row &&
    opts.header_suffix === cache.Opts.header_suffix) {
    return cache;
  }

  await UpdateOrCreateCache(c, fileId, opts);
}

export const GetFileWithOpts = async (c: Shimo.Client, fileId: string, opts: Shimo.Opts) => {
  const cache = c.cache?.get(fileId);

  if (!cache) {
    const r = await UpdateOrCreateCache(c, fileId, opts);
    return r?.get(fileId)?.result;
  }

  if (!!cache &&
    !!cache.expire &&
    cache.expire > Date.now() &&
    opts.sheet_name === cache.Opts.sheet_name &&
    opts.end_col === cache.Opts.end_col &&
    opts.end_row === cache.Opts.end_row &&
    opts.header_suffix === cache.Opts.header_suffix) {
    return cache.result;
  }

  c.asyncSign?.set(fileId, { fileId: fileId, Opts: opts });

  return cache.result;
}