import { env } from './.env';

export const environment = {
  production: false,
  hmr: true,
  version: env.npm_package_version + '-dev',
  serverUrl: env.api_url,
  defaultLanguage: 'fr-FR',
  supportedLanguages: ['en-US', 'fr-FR'],
};
