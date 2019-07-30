import * as dotenv from 'dotenv';

function init() {
  dotenv.config();
}

export enum KnownConfigKey {
      JwtSecret = 'JWT_SIGN_SECRET',
      ServerPort = 'SERVER_PORT',
}

function get(key: string, callback = ''): string {
      return process.env[key] || callback;
    }

export default {
      get,
      init,
};
