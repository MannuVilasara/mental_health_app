import { useEffect, useState, useRef } from 'react';
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { UsageStatsModule } = NativeModules;

/**
 * @typedef {Object} UsageStat
 * @property {string} packageName - The app's package name
 * @property {string} appName - The app's display name
 * @property {number} totalTimeInForeground - Total time in foreground (ms)
 * @property {number} lastTimeUsed - Last time the app was used (timestamp)
 * @property {string} [icon] - Base64-encoded app icon (optional)
 */

/**
 * @typedef {Object} InstalledApp
 * @property {string} packageName - The app's package name
 * @property {string} appName - The app's display name
 * @property {boolean} isSystemApp - Whether the app is a system app
 * @property {string} [icon] - Base64-encoded app icon (optional)
 */

/**
 * @typedef {Object} AppLaunchEvent
 * @property {string} packageName - The app's package name
 * @property {string} appName - The app's display name
 * @property {number} timestamp - Time of the app launch
 * @property {string} [icon] - Base64-encoded app icon (optional)
 */

/**
 * Custom hook to manage usage statistics on Android
 * @returns {Object} Usage stats utilities
 */
export const useUsageStats = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [usageStats, setUsageStats] = useState(null);
    const [totalScreenTime, setTotalScreenTime] = useState(null);
    const [topUsedApps, setTopUsedApps] = useState(null);
    const [installedApps, setInstalledApps] = useState(null);
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [error, setError] = useState(null);

    const appLaunchListenerRef = useRef(null);
    const appLaunchCallbackRef = useRef(null);

    const isAndroid = Platform.OS === 'android';

    // Format time from milliseconds to human-readable string
    const formatTime = (milliseconds) => {
        const ms = Math.max(0, milliseconds || 0);
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    // Check permission on mount
    useEffect(() => {
        if (isAndroid) {
            checkPermission();
        } else {
            setError(new Error('Usage statistics are only available on Android'));
        }

        return () => {
            if (isMonitoring) {
                stopMonitoring();
            }
        };
    }, []);

    // Check usage stats permission
    const checkPermission = async () => {
        try {
            if (!isAndroid) return;
            const permission = await UsageStatsModule.hasUsagePermission();
            setHasPermission(permission);
            if (!permission) {
                setError(new Error('Usage stats permission not granted. Please enable it in Settings.'));
            }
            return permission;
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    // Request usage stats permission
    const requestPermission = async () => {
        try {
            if (!isAndroid) return;
            await UsageStatsModule.requestUsagePermission();
            // Poll permission status since requestUsagePermission doesn't return a result
            const checkInterval = setInterval(async () => {
                const granted = await checkPermission();
                if (granted) {
                    clearInterval(checkInterval);
                }
            }, 1000);
            return new Promise((resolve) => {
                setTimeout(() => {
                    clearInterval(checkInterval);
                    resolve(hasPermission);
                }, 10000); // Timeout after 10 seconds
            });
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    // Fetch usage stats
    const fetchUsageStats = async (startTime, endTime) => {
        try {
            if (!isAndroid) return;
            if (!hasPermission) throw new Error('Permission not granted');
            const stats = await UsageStatsModule.getUsageStats(startTime, endTime);

            setUsageStats(stats);
            return stats;
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    // Fetch total screen time
    const fetchTotalScreenTime = async (startTime, endTime) => {
        try {
            if (!isAndroid) return;
            if (!hasPermission) throw new Error('Permission not granted');
            const screenTime = await UsageStatsModule.getTotalScreenTime(startTime, endTime);
            setTotalScreenTime(screenTime);
            return screenTime;
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    // Fetch installed apps
    const fetchInstalledApps = async (filter = 'all') => {
        try {
            if (!isAndroid) return;
            const apps = await UsageStatsModule.getInstalledApps();
            let filteredApps = apps;
            if (filter === 'system') {
                filteredApps = apps.filter((app) => app.isSystemApp);
            } else if (filter === '3party') {
                filteredApps = apps.filter((app) => !app.isSystemApp);
            }
            setInstalledApps(filteredApps);
            return filteredApps;
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    // Fetch top used apps
    const fetchTopUsedApps = async (startTime, endTime, limit = 10) => {
        try {
            if (!isAndroid) return;
            if (!hasPermission) throw new Error('Permission not granted');
            const apps = await UsageStatsModule.getTopUsedApps(startTime, endTime, limit);
            setTopUsedApps(apps);
            return apps;
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    // Close an app
    const closeApp = async (packageName) => {
        try {
            if (!isAndroid) throw new Error('App closing is only available on Android');
            const result = await UsageStatsModule.closeApp(packageName);
            return result;
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    // Exit the app
    const exitApp = async () => {
        try {
            if (!isAndroid) return;
            await UsageStatsModule.exitApp();
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    // Refresh all data
    const refreshAllData = async (startTime, endTime, appLimit = 10) => {
        try {
            if (!isAndroid) return;
            if (!hasPermission) throw new Error('Permission not granted');
            const [stats, screenTime, topApps, apps] = await Promise.all([
                fetchUsageStats(startTime, endTime),
                fetchTotalScreenTime(startTime, endTime),
                fetchTopUsedApps(startTime, endTime, appLimit),
                fetchInstalledApps(),
            ]);
            return { stats, screenTime, topApps, apps };
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    // Start monitoring app launches
    const startMonitoring = (onAppLaunch) => {
        try {
            if (!isAndroid) return;
            if (!hasPermission) throw new Error('Permission not granted');
            if (isMonitoring) return;

            const eventEmitter = new NativeEventEmitter(UsageStatsModule);
            appLaunchCallbackRef.current = onAppLaunch;

            appLaunchListenerRef.current = eventEmitter.addListener('onAppLaunch', (event) => {
                if (appLaunchCallbackRef.current) {
                    appLaunchCallbackRef.current(event);
                }
            });

            UsageStatsModule.detectAppLaunchEvents();
            setIsMonitoring(true);
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    // Stop monitoring app launches
    const stopMonitoring = async () => {
        try {
            if (!isAndroid || !isMonitoring) return;
            await UsageStatsModule.stopAppLaunchDetection();
            if (appLaunchListenerRef.current) {
                appLaunchListenerRef.current.remove();
                appLaunchListenerRef.current = null;
            }
            setIsMonitoring(false);
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    return {
        hasPermission,
        requestPermission,
        usageStats,
        totalScreenTime,
        topUsedApps,
        installedApps,
        isMonitoring,
        error,
        fetchUsageStats,
        fetchTotalScreenTime,
        fetchTopUsedApps,
        fetchInstalledApps,
        closeApp,
        exitApp,
        refreshAllData,
        startMonitoring,
        stopMonitoring,
        formatTime,
    };
};