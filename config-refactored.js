const DEFAULT_ENV = 'development';

const ENVIRONMENT_CONFIG = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    debug: true,
    timeout: 5000
  },
  testing: {
    apiUrl: 'http://test-server:3000/api',
    debug: true,
    timeout: 5000
  },
  staging: {
    apiUrl: 'https://staging.example.com/api',
    debug: false,
    timeout: 10000
  },
  production: {
    apiUrl: 'https://api.example.com',
    debug: false,
    timeout: 15000
  }
};

/**
 * Zwraca konfigurację dla podanego środowiska.
 * Nieznane środowisko → konfiguracja development (jak w oryginale).
 */
function getEnvironmentConfig(env) {
  return ENVIRONMENT_CONFIG[env] ?? ENVIRONMENT_CONFIG[DEFAULT_ENV];
}

module.exports = { getEnvironmentConfig, ENVIRONMENT_CONFIG, DEFAULT_ENV };
