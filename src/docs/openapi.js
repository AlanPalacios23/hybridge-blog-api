const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');

const specificationPath = path.join(__dirname, '../../docs/openapi.yaml');
const openApiDocument = YAML.parse(fs.readFileSync(specificationPath, 'utf8'));

module.exports = { openApiDocument };
