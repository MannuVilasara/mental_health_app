package com.aiims_v1

import android.app.ActivityManager
import android.app.AppOpsManager
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.Drawable
import android.os.Build
import android.provider.Settings
import android.util.Base64
import android.util.Log
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.ByteArrayOutputStream
import java.util.*

class UsageStatsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val usageStatsManager = reactContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
    private val packageManager = reactContext.packageManager

    override fun getName(): String {
        return "UsageStatsModule"
    }

    @ReactMethod
    fun hasUsagePermission(promise: Promise) {
        try {
            val appOps = reactApplicationContext.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
            val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                appOps.unsafeCheckOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, android.os.Process.myUid(), reactApplicationContext.packageName)
            } else {
                @Suppress("DEPRECATION")
                appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, android.os.Process.myUid(), reactApplicationContext.packageName)
            }
            promise.resolve(mode == AppOpsManager.MODE_ALLOWED)
        } catch (e: Exception) {
            promise.reject("PERMISSION_CHECK_ERROR", "Failed to check usage permission: ${e.message}")
        }
    }

    @ReactMethod
    fun requestUsagePermission(promise: Promise) {
        try {
            val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            reactApplicationContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("PERMISSION_REQUEST_ERROR", "Failed to request usage permission: ${e.message}")
        }
    }

    @RequiresApi(Build.VERSION_CODES.LOLLIPOP)
    @ReactMethod
    fun getUsageStats(startTime: Double, endTime: Double, promise: Promise) {
        try {
            val usageStatsList = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime.toLong(),
                endTime.toLong()
            )
            val result = Arguments.createArray()

            for (usageStats in usageStatsList) {
                if (usageStats.totalTimeInForeground == 0L) continue
                if (isSystemPackage(usageStats.packageName)) continue

                val map = Arguments.createMap()
                val packageName = usageStats.packageName
                val appName = getAppName(packageName) ?: packageName
                val appIconBase64 = getAppIconAsBase64(packageName)

                map.putString("packageName", packageName)
                map.putString("appName", appName)
                map.putDouble("totalTimeInForeground", usageStats.totalTimeInForeground.toDouble())
                map.putDouble("lastTimeUsed", usageStats.lastTimeUsed.toDouble())
                appIconBase64?.let { map.putString("icon", it) }
                result.pushMap(map)
            }
            promise.resolve(result)
        } catch (e: SecurityException) {
            promise.reject("PERMISSION_ERROR", "Usage stats permission not granted")
        } catch (e: Exception) {
            promise.reject("USAGE_STATS_ERROR", "Failed to get usage stats: ${e.message}")
        }
    }

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val packages = packageManager.getInstalledApplications(PackageManager.GET_META_DATA)
            val appsArray = Arguments.createArray()

            for (packageInfo in packages) {
                val appData = Arguments.createMap()
                val packageName = packageInfo.packageName
                val appName = packageManager.getApplicationLabel(packageInfo).toString()
                val appIconBase64 = getAppIconAsBase64(packageName)

                appData.putString("packageName", packageName)
                appData.putString("appName", appName)
                appData.putBoolean("isSystemApp", (packageInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0)
                appIconBase64?.let { appData.putString("icon", it) }
                appsArray.pushMap(appData)
            }
            promise.resolve(appsArray)
        } catch (e: Exception) {
            promise.reject("INSTALLED_APPS_ERROR", "Failed to get installed apps: ${e.message}")
        }
    }

    @RequiresApi(Build.VERSION_CODES.LOLLIPOP)
    @ReactMethod
    fun getTotalScreenTime(startTime: Double, endTime: Double, promise: Promise) {
        try {
            val usageStatsList = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime.toLong(),
                endTime.toLong()
            )
            val timelineEvents = mutableListOf<Pair<Long, Boolean>>()

            for (stats in usageStatsList) {
                if (stats.totalTimeInForeground > 0 && !isSystemPackage(stats.packageName)) {
                    val lastTime = stats.lastTimeUsed
                    val firstTime = lastTime - stats.totalTimeInForeground
                    timelineEvents.add(Pair(firstTime, true))
                    timelineEvents.add(Pair(lastTime, false))
                }
            }

            timelineEvents.sortBy { it.first }

            var totalTime = 0L
            var activeApps = 0
            var lastEventTime = 0L

            for (event in timelineEvents) {
                val currentTime = event.first
                if (activeApps > 0 && lastEventTime > 0) {
                    totalTime += (currentTime - lastEventTime)
                }
                lastEventTime = currentTime
                activeApps += if (event.second) 1 else -1
            }

            promise.resolve(totalTime.toDouble())
        } catch (e: SecurityException) {
            promise.reject("PERMISSION_ERROR", "Usage stats permission not granted")
        } catch (e: Exception) {
            promise.reject("SCREEN_TIME_ERROR", "Failed to get total screen time: ${e.message}")
        }
    }

    @RequiresApi(Build.VERSION_CODES.LOLLIPOP)
    @ReactMethod
    fun getTopUsedApps(startTime: Double, endTime: Double, limit: Int, promise: Promise) {
        try {
            val usageStatsList = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime.toLong(),
                endTime.toLong()
            )
            val filteredList = usageStatsList.filter {
                it.totalTimeInForeground > 0 && !isSystemPackage(it.packageName)
            }
            val sortedList = filteredList.sortedByDescending { it.totalTimeInForeground }
            val result = Arguments.createArray()
            val appsToShow = if (limit > 0) sortedList.take(limit) else sortedList

            appsToShow.forEach { usageStats ->
                val map = Arguments.createMap()
                val packageName = usageStats.packageName
                val appName = getAppName(packageName) ?: packageName
                val appIconBase64 = getAppIconAsBase64(packageName)

                map.putString("packageName", packageName)
                map.putString("appName", appName)
                map.putDouble("totalTimeInForeground", usageStats.totalTimeInForeground.toDouble())
                map.putDouble("lastTimeUsed", usageStats.lastTimeUsed.toDouble())
                appIconBase64?.let { map.putString("icon", it) }
                result.pushMap(map)
            }
            promise.resolve(result)
        } catch (e: SecurityException) {
            promise.reject("PERMISSION_ERROR", "Usage stats permission not granted")
        } catch (e: Exception) {
            promise.reject("TOP_APPS_ERROR", "Failed to get top used apps: ${e.message}")
        }
    }

    @RequiresApi(Build.VERSION_CODES.LOLLIPOP)
    @ReactMethod
    fun detectAppLaunchEvents(promise: Promise) {
        if (isMonitoring) {
            promise.resolve("Already monitoring")
            return
        }
        isMonitoring = true

        Thread {
            try {
                while (isMonitoring) {
                    val endTime = System.currentTimeMillis()
                    val startTime = endTime - 10000
                    val events = usageStatsManager.queryEvents(startTime, endTime)
                    val event = UsageEvents.Event()
                    while (events.hasNextEvent() && isMonitoring) {
                        events.getNextEvent(event)
                        if (event.eventType == UsageEvents.Event.ACTIVITY_RESUMED) {
                            val params = Arguments.createMap()
                            val packageName = event.packageName
                            val appName = getAppName(packageName) ?: packageName
                            val appIconBase64 = getAppIconAsBase64(packageName)

                            params.putString("packageName", packageName)
                            params.putString("appName", appName)
                            params.putDouble("timestamp", event.timeStamp.toDouble())
                            appIconBase64?.let { params.putString("icon", it) }
                            sendEvent("onAppLaunch", params)
                        }
                    }
                    Thread.sleep(5000)
                }
                promise.resolve("Monitoring stopped")
            } catch (e: SecurityException) {
                promise.reject("PERMISSION_ERROR", "Usage stats permission not granted")
            } catch (e: Exception) {
                promise.reject("MONITOR_ERROR", "Error monitoring app launches: ${e.message}")
            } finally {
                isMonitoring = false
            }
        }.start()
        promise.resolve("Monitoring started")
    }

    @ReactMethod
    fun closeApp(packageName: String, promise: Promise) {
        try {
            val am = reactApplicationContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                am.killBackgroundProcesses(packageName)
            }
            promise.resolve("App closed successfully")
        } catch (e: SecurityException) {
            promise.reject("PERMISSION_ERROR", "Permission denied to close app")
        } catch (e: Exception) {
            promise.reject("CLOSE_APP_ERROR", "Failed to close app: ${e.message}")
        }
    }

    @ReactMethod
    fun exitApp(promise: Promise) {
        try {
            android.os.Process.killProcess(android.os.Process.myPid())
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("EXIT_ERROR", "Failed to exit app: ${e.message}")
        }
    }

    @ReactMethod
    fun stopAppLaunchDetection(promise: Promise) {
        isMonitoring = false
        promise.resolve("Stopped app launch detection")
    }

    private fun getAppName(packageName: String): String? {
        return try {
            val appInfo = packageManager.getApplicationInfo(packageName, 0)
            packageManager.getApplicationLabel(appInfo).toString()
        } catch (e: PackageManager.NameNotFoundException) {
            null
        }
    }

    private fun isSystemPackage(packageName: String): Boolean {
        return try {
            val appInfo = packageManager.getApplicationInfo(packageName, 0)
            (appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0
        } catch (e: PackageManager.NameNotFoundException) {
            false
        }
    }

    private fun getAppIconAsBase64(packageName: String): String? {
        return try {
            val drawable = packageManager.getApplicationIcon(packageName)
            val bitmap = drawableToBitmap(drawable)
            val byteArrayOutputStream = ByteArrayOutputStream()
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream)
            val byteArray = byteArrayOutputStream.toByteArray()
            "data:image/png;base64," + Base64.encodeToString(byteArray, Base64.DEFAULT)
        } catch (e: PackageManager.NameNotFoundException) {
            Log.e("UsageStatsModule", "App icon not found for $packageName: ${e.message}")
            null
        } catch (e: Exception) {
            Log.e("UsageStatsModule", "Error converting app icon for $packageName: ${e.message}")
            null
        }
    }

    private fun drawableToBitmap(drawable: Drawable): Bitmap {
        val width = drawable.intrinsicWidth.takeIf { it > 0 } ?: 1
        val height = drawable.intrinsicHeight.takeIf { it > 0 } ?: 1
        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        drawable.setBounds(0, 0, canvas.width, canvas.height)
        drawable.draw(canvas)
        return bitmap
    }

    private var isMonitoring = false

    private fun sendEvent(eventName: String, params: WritableMap) {
        try {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                ?.emit(eventName, params)
        } catch (e: Exception) {
            Log.e("UsageStatsModule", "Failed to send event: ${e.message}")
        }
    }
}