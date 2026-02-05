/**
 * Configuration Service
 * Handles loading and parsing of YAML/JSON configuration files
 * Supports both formats for backward compatibility during migration
 */

const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

// Primary: YAML configs, Fallback: JSON configs
const yamlConfigDir = path.join(__dirname, '..', 'public', 'yaml-config');
const jsonConfigDir = path.join(__dirname, '..', 'public', 'config');

/**
 * Load configuration file (YAML preferred, JSON fallback)
 * @param {string} configFileName - The config file name without extension (e.g., 'cet-dashboard-columns')
 *                                  OR with extension for backward compatibility
 * @param {string|null} propertyPath - Optional property path to extract (e.g., 'cet' or 'cetQueuesSummary')
 * @param {any} defaultValue - Default value if loading fails (default: null)
 * @returns {any} Parsed configuration or default value
 */
const loadConfig = (configFileName, propertyPath = null, defaultValue = null) => {
  // Strip extension if provided for flexibility
  const baseName = configFileName.replace(/\.(json|yaml|yml)$/, '');
  
  // Try YAML first, then fall back to JSON
  const yamlPath = path.join(yamlConfigDir, `${baseName}.yaml`);
  const jsonPath = path.join(jsonConfigDir, `${baseName}.json`);
  
  try {
    let config;
    
    if (fs.existsSync(yamlPath)) {
      const configData = fs.readFileSync(yamlPath, 'utf8');
      config = yaml.load(configData);
    } else if (fs.existsSync(jsonPath)) {
      const configData = fs.readFileSync(jsonPath, 'utf8');
      config = JSON.parse(configData);
    } else {
      console.warn(`Config file not found: ${baseName} (tried .yaml and .json)`);
      return defaultValue;
    }
    
    // If propertyPath is provided, navigate to that property
    if (propertyPath) {
      const properties = propertyPath.split('.');
      let result = config;
      for (const prop of properties) {
        result = result?.[prop];
      }
      return result ?? defaultValue;
    }
    
    return config;
  } catch (error) {
    console.error(`Error loading config file ${baseName}:`, error);
    return defaultValue;
  }
}

module.exports = {
  loadConfig
};
