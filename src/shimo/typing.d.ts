declare namespace Shimo {
  type Opts = {
    sheet_name?: string;
    end_row?: number | string;
    end_col?: number | string;
    header_suffix?: string;
    cache_ttl?: number;
  }

  type WriteResourse = {
    values: any[][];
  }

  type WriteOpts = {
    range?: string;
    resource?: WriteResourse;
  }

  type Sign = {
    Opts: Opts;
    fileId: string,
  }

  type Cache = {
    Opts: Opts;
    expire?: number;
    result?: any;
  }

  type OauthResponse = {
    access_token?: string;
    refresh_token?: string;
  }

  interface WriteObj {
    Values(): any[][];
  }

  type Client = {
    clientId?: string;
    clientSecret?: string;
    username?: string;
    password?: string;
    scope?: string;
    asyncSign?: Map<string, Sign>;
    cache?: Map<string, Cache>;
    credential?: {
      accessToken?: string;
      accessTokenExpiresAt?: number;
      refreshToken?: string;
    }
  }
}
