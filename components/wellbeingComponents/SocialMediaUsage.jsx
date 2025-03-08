import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import PieChart from 'react-native-pie-chart';

const socialMediaApps = [
    { name: 'Facebook', packageName: 'com.facebook.katana', icon: 'https://cdn-icons-png.flaticon.com/512/124/124010.png' },
    { name: 'Instagram', packageName: 'com.instagram.android', icon: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
    { name: 'Twitter/X', packageName: 'com.twitter.android', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968958.png' },
    { name: 'TikTok', packageName: 'com.zhiliaoapp.musically', icon: 'https://cdn-icons-png.flaticon.com/512/3046/3046128.png' },
    { name: 'WhatsApp', packageName: 'com.whatsapp', icon: 'https://cdn-icons-png.flaticon.com/512/124/124034.png' },
    { name: 'Snapchat', packageName: 'com.snapchat.android', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111615.png' },
    { name: 'LinkedIn', packageName: 'com.linkedin.android', icon: 'https://cdn-icons-png.flaticon.com/512/174/174857.png' },
    { name: 'Pinterest', packageName: 'com.pinterest', icon: 'https://cdn-icons-png.flaticon.com/512/174/174863.png' },
    { name: 'Reddit', packageName: 'com.reddit.frontpage', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111589.png' },
    { name: 'Telegram', packageName: 'org.telegram.messenger', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111703.png' },
    { name: 'YouTube', packageName: 'com.google.android.youtube', icon: 'https://cdn-icons-png.flaticon.com/512/3938/3938026.png' },
    { name: 'Discord', packageName: 'com.discord', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111370.png' },
    { name: 'WeChat', packageName: 'com.tencent.mm', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111728.png' },
    { name: 'Tumblr', packageName: 'com.tumblr', icon: 'https://cdn-icons-png.flaticon.com/512/174/174881.png' },
    { name: 'Viber', packageName: 'com.viber.voip', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111720.png' },
    { name: 'Line', packageName: 'jp.naver.line.android', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111491.png' },
    { name: 'Kuaishou', packageName: 'com.kwai.video', icon: 'https://cdn.iconscout.com/icon/free/png-256/kuaishou-282614.png' },
    { name: 'Threads', packageName: 'com.instagram.threadsapp', icon: 'https://cdn-icons-png.flaticon.com/512/11729/11729603.png' },
    { name: 'BeReal', packageName: 'com.bereal.ft', icon: 'https://cdn.iconscout.com/icon/free/png-256/bereal-10621068.png' },
    { name: 'Twitch', packageName: 'tv.twitch.android.app', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111718.png' },
    { name: 'Flickr', packageName: 'com.flickr.android', icon: 'https://cdn-icons-png.flaticon.com/512/174/174846.png' },
    { name: 'VK', packageName: 'com.vkontakte.android', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111716.png' },
    { name: 'Sina Weibo', packageName: 'com.sina.weibo', icon: 'https://cdn-icons-png.flaticon.com/512/3938/3938048.png' },
    { name: 'QQ', packageName: 'com.tencent.mobileqq', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111550.png' },
    { name: 'Nextdoor', packageName: 'com.nextdoor', icon: 'https://cdn.iconscout.com/icon/free/png-256/nextdoor-282604.png' },
    { name: 'Meetup', packageName: 'com.meetup', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111519.png' },
    { name: 'Bigo Live', packageName: 'sg.bigo.live', icon: 'https://cdn.iconscout.com/icon/free/png-256/bigo-live-282597.png' },
    { name: 'Likee', packageName: 'video.like', icon: 'https://cdn.iconscout.com/icon/free/png-256/likee-282601.png' },
    { name: 'Yubo', packageName: 'co.yellw.yellowapp', icon: 'https://cdn.iconscout.com/icon/free/png-256/yubo-282616.png' },
    { name: 'Clubhouse', packageName: 'com.clubhouse.app', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968858.png' },
];
// Function to filter social media apps and get proper app names
const filterSocialMediaApps = (usageStats) => {
    return usageStats.filter(item => {
        const socialMediaApp = socialMediaApps.find(app => app.packageName === item.packageName);
        if (socialMediaApp) {
            item.appName = socialMediaApp.name;
            item.icon = socialMediaApp.icon;
            return true;
        }
        return false;
    });
};

const SocialMediaUsage = ({ usageStats, formatTime }) => {
    const socialMediaUsage = filterSocialMediaApps(usageStats || []);
    return (
        <View style={{ width: '100%', alignItems: 'center', gap: 10, marginTop: 20 }}>

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {socialMediaUsage.length > 0 ? (
                    socialMediaUsage.map((item) => (
                        <View key={item.packageName} style={styles.appContainer}>
                            <View style={styles.appContent}>
                                <Image
                                    source={{ uri: item.icon }}
                                    style={styles.appIcon}
                                />
                                <Text
                                    style={styles.appName}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {item.appName}
                                </Text>
                            </View>
                            <Text
                                style={styles.timeText}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {formatTime(item.totalTimeInForeground)}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noDataText}>No social media usage data available</Text>
                )}
            </ScrollView>
            <TouchableOpacity style={{
                backgroundColor: 'rgba(111,145,103,0.9)',
                paddingHorizontal: 20,
                paddingVertical: 15,
                alignItems: 'center',
                borderRadius: 12,
                width: '90%',
                alignSelf: 'center',
            }}>
                <Text style={{ fontFamily: 'Poppins-SemiBold', color: 'white', width: 'min-content' }}>See details</Text>
            </TouchableOpacity>
        </View >
    );
};

// Enhanced Styles
const styles = StyleSheet.create({
    scrollContainer: {
        width: '100%',
        height: 'min-content',
        maxHeight: 300,
        paddingBottom: 20,
        paddingHorizontal: 15,
    },
    appContainer: {
        width: '100%',
        maxWidth: '99%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    appName: {
        fontSize: 17,
        color: 'black',
    },
    appContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 15,
        alignItems: 'center',
    },
    timeText: {
        fontSize: 17,
        color: 'black',
    },
    noDataText: {
        fontSize: 17,
        textAlign: 'center',
        color: 'black',
    },
    appIcon: {
        height: 40,
        width: 40,
        aspectRatio: 1,
        borderRadius: 10,
    },
    pieChartContainer: {
        width: '100%',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },

});

export default SocialMediaUsage;