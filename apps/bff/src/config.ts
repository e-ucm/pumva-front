import { sso } from "../../../../simva-front/config";

let config: any = {};

let ignored_ports = [80, 8080, 443];

config.external_host = process.env.PUMVA_HOST || 'pumva.external.test'
config.external_api_host = process.env.PUMVA_API_HOST || 'pumva.external.test'
config.external_protocol = process.env.PUMVA_PROTOCOL || 'https'
config.external_port = process.env.PUMVA_PORT || 443
config.external_url = `${config.external_protocol}://${config.external_host}${ignored_ports.includes(config.external_port) ? '' : `:${config.external_port}` }`
config.favicon_file = process.env.PUMVA_FAVICON || '/favicon.ico'
config.favicon_url = config.external_host + config.favicon_file

config.logger = {};
config.logger.level = process.env.LOGGER_LEVEL || 'info';
config.logger.processTag = process.env.LOGGER_PROCESS_TAG || 'bff';
config.logger.folder = process.env.LOGGER_FOLDER || '../../logs';

config.sso = {}
config.sso.host = process.env.SSO_HOST || 'sso.external.test'
config.sso.protocol = process.env.SSO_PROTOCOL || 'https'
config.sso.port = process.env.SSO_PORT || 443
config.sso.account_path = process.env.SSO_ACCOUNT_PATH || '/account'
config.sso.user_can_select_role = process.env.SSO_USER_CAN_SELECT_ROLE || 'true'
config.sso.administrator_contact = process.env.SSO_ADMINISTRATOR_CONTACT || 'true'
config.sso.student_allowed_role = process.env.SSO_STUDENT_ALLOWED_ROLE || 'true'
config.sso.teaching_assistant_allowed_role = process.env.SSO_TEACHING_ASSISTANT_ALLOWED_ROLE || 'true'
config.sso.teacher_allowed_role = process.env.SSO_TEACHER_ALLOWED_ROLE || 'true'
config.sso.researcher_allowed_role = process.env.SSO_RESEARCHER_ALLOWED_ROLE || 'true'
config.sso.realm = process.env.SSO_REALM || 'pumva'
config.sso.client_id = process.env.SSO_CLIENT_ID || 'pumva'
config.sso.client_secret = process.env.SSO_CLIENT_SECRET || 'secret'
config.sso.ssl_required = process.env.SSO_SSL_REQUIRED || 'external'
config.sso.public_client = process.env.SSO_PUBLIC_CLIENT || 'false'
config.sso.url = `${config.sso.protocol}://${config.sso.host}${ignored_ports.includes(config.sso.port) ? '' : `:${config.sso.port}` }`

export default config;