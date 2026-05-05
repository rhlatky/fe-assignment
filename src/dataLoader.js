import { CONFIG } from "./config.js";

const CACHE_KEY = "fe_assignment_data_cache";
const CACHE_TIMESTAMP_KEY = "fe_assignment_data_timestamp";
const debugLog = (...args) => {
    if (CONFIG.DEBUG_LOGS) {
        console.log(...args);
    }
};

/**
 * Check if cached data is still valid
 */
const isCacheValid = () => {
    if (!CONFIG.DEV_MODE) {
        return false;
    }

    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestamp) {
        return false;
    }

    const cacheAge = Date.now() - parseInt(timestamp, 10);
    return cacheAge < CONFIG.DEV_CACHE_DURATION;
};

/**
 * Get cached data from localStorage
 */
const getCachedData = () => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        return cached ? JSON.parse(cached) : null;
    } catch (error) {
        console.warn("[Data Loader] Failed to parse cached data:", error);
        return null;
    }
};

/**
 * Save data to localStorage cache
 */
const setCachedData = (data) => {
    if (!CONFIG.DEV_MODE) {
        return;
    }

    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
        console.warn("[Data Loader] Failed to cache data:", error);
    }
};

/**
 * Load data from API
 *
 * @returns {Promise<Object>} Data object with banner, ctaBanner, products, categories
 */
export const loadData = async () => {
    if (CONFIG.DEV_MODE && isCacheValid()) {
        const cachedData = getCachedData();
        if (cachedData) {
            debugLog("[Data Loader] Using cached data");
            return cachedData;
        }
    }

    const mode = CONFIG.TEST_MODE || "static";
    const modeParam = mode === "static" ? "" : `?mode=${mode}`;
    const fetchJson = (endpoint) =>
        fetch(`${CONFIG.API_BASE_URL}/${endpoint}${modeParam}`).then((response) => response.json());

    try {
        debugLog("[Data Loader] Fetching fresh data from API");
        const [banner, ctaBanner, products, categories] = await Promise.all([
            fetchJson("banner"),
            fetchJson("cta-banner"),
            fetchJson("products"),
            fetchJson("categories"),
        ]);

        const data = {
            banner: banner.data,
            ctaBanner: ctaBanner.data,
            products: products.data,
            categories: categories.data,
        };

        setCachedData(data);

        return data;
    } catch (error) {
        console.error("[Data Loader] Failed to load data from API:", error);
        throw error;
    }
};

/**
 * Clear cached data (useful for development)
 */
export const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    debugLog("[Data Loader] Cache cleared");
};

/**
 * Log data source info to console
 */
export const logDataMode = () => {
    if (CONFIG.DEV_MODE) {
        window.clearCache = clearCache;
    } else {
        delete window.clearCache;
    }

    debugLog(`[Data Loader] API: ${CONFIG.API_BASE_URL}`);
    debugLog(`[Data Loader] DEV mode: ${CONFIG.DEV_MODE ? "ON" : "OFF"}`);
};
