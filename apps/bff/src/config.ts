/**
 * @fileoverview Configuration module for PUMVA BFF application.
 * Centralizes all environment-based configuration including external hosts,
 * API endpoints, SSO settings, and logger configuration.
 * 
 * Configuration is loaded from environment variables with sensible defaults.
 * Supports multiple environments (development, staging, production).
 * 
 * @module config
 * @requires path
 * @author PUMVA Team
 */

import path from "path";

/**
 * Main configuration object containing all application settings
 * @type {Object}
 */
let config: any = {};

/**
 * List of default ports that should be omitted from URLs
 * @type {number[]} 
 */
let ignored_ports = [80, 8080, 443];

// External host configuration
config.external_host = process.env.PUMVA_HOST || 'pumva.external.test'
config.external_api_host = process.env.PUMVA_API_HOST || 'pumva.external.test'
config.external_protocol = process.env.PUMVA_PROTOCOL || 'https'
config.external_port = process.env.PUMVA_PORT || 443
config.external_url = `${config.external_protocol}://${config.external_host}${ignored_ports.includes(config.external_port) ? '' : `:${config.external_port}` }`
config.favicon_file = process.env.PUMVA_FAVICON || '/favicon.ico'
config.favicon_url = config.external_host + config.favicon_file
config.frontendPath = process.env.PUMVA_FRONTEND_PATH || path.join(__dirname, "../../frontend/dist");

// API configuration
config.api = {};
config.api.host = process.env.PUMVA_API_HOST || 'api.external.test'
config.api.protocol = process.env.PUMVA_API_PROTOCOL || 'https'
config.api.port = process.env.PUMVA_API_PORT || 443
config.api.url = `${config.api.protocol}://${config.api.host}${ignored_ports.includes(config.api.port) ? '' : `:${config.api.port}` }`

// Logger configuration
config.logger = {};
config.logger.level = process.env.LOGGER_LEVEL || 'info';
config.logger.processTag = process.env.LOGGER_PROCESS_TAG || 'bff';
config.logger.folder = process.env.LOGGER_FOLDER || '../../logs';

// SSO (Single Sign-On) configuration using Keycloak
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

// Shlink URL shortener configuration  
config.shlink = {};
config.shlink.apihost = process.env.SHORTLINK_HOST || 'shlink.external.test'
config.shlink.protocol = process.env.SHORTLINK_PROTOCOL || 'https'
config.shlink.port = process.env.SHORTLINK_PORT || 443
config.shlink.apiurl = `${config.shlink.protocol}://${config.shlink.apihost}${ignored_ports.includes(config.shlink.port) ? '' : `:${config.shlink.port}` }`
config.shlink.apikey = process.env.SHORTLINK_API_KEY || 'shlink-api-key';

/**
 * Export the complete configuration object
 * @type {Object}
 */
export default config;