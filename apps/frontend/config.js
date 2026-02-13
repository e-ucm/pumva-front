let config = {};

let ignored_ports = [80, 8080, 443];

config.external_host = process.env.PUMVA_HOST || 'simva.external.test'
config.external_api_host = process.env.PUMVA_API_HOST || 'simva.external.test'
config.favicon_file = process.env.PUMVA_FAVICON || '/favicon.ico'
config.favicon_url = config.external_host + config.favicon_file

export default config;