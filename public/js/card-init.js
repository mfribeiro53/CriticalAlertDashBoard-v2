/**
 * File: card-init.js
 * Created: 2025-12-15 12:43:56
 * Last Modified: 2026-01-01 15:30:00
 * 
 * Card Initialization - Orchestration Layer
 * 
 * This file handles card initialization and configuration loading.
 * It serves as the orchestration layer that coordinates configuration loading
 * with page-specific rendering and binding functions.
 * 
 * SCOPE:
 * - Loading card configurations from JSON files
 * - Orchestrating initialization flow
 * - Error handling for configuration loading
 * 
 * PATTERN:
 * 1. Load configuration from JSON
 * 2. Call page-specific render function with configuration
 * 3. Call page-specific bind function for table integration
 * 4. Handle errors gracefully
 * 
 * NAMING CONVENTION:
 * All initialization functions are exported as named exports
 */

'use strict';

/**
 * Generic card initialization with custom update function
 * 
 * @param {String} configPath - Path to card configuration JSON file
 * @param {Function} updateFunction - Custom function to call with the config
 * @param {Object} options - Additional options for initialization
 */
export const initializeCards = async (configPath, updateFunction, options = {}) => {
    const initialize = async () => {
      try {
        const response = await fetch(configPath);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const config = await response.json();
        
        if (typeof updateFunction === 'function') {
          updateFunction(config, options);
        } else {
          console.error('Invalid update function provided to initializeCards');
        }
      } catch (error) {
        console.error('Failed to load card configuration:', error.message);
        console.error(`Configuration path: ${configPath}`);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialize);
    } else {
      await initialize();
    }
  };
