//Push Notifications with Firebase
import "firebase/messaging";
import firebase from "firebase/app";

// Constant
import GLOBAL from './Constants/global.constants';

// Utils
import { SetItem, GetItem } from 'storage-utility';
import { StoreEvent } from 'state-manager-utility';
import { GetTime } from 'sl-web-utilities';
import { StrToBool } from 'sl-web-utilities';
// import { Toast } from './Utils/toast.utils';
import { Authentication } from "sl-web-utilities";

// Initialize Firebase
export const initializeFirebase = async () => {
    if ('Notification' in window && firebase.messaging.isSupported()) {

        const hasPermission = await permissionStatus();

        //Permission denied than return
        if (!hasPermission) {
            return;
        }

        firebase.initializeApp(GLOBAL.FIREBASE_CONFIG);
        const messaging = firebase.messaging();

        // Request permission to receive notifications and Retrieve the current registration token
        messaging.requestPermission()
            .then(function () {
                // console.log("Have Permission", messaging.getToken());
                return messaging.getToken();
            })
            .then(function (token) {
                console.log("Token special", token);
                Authentication.storeDeviceIdentifierToken(token);
                StoreEvent({ eventName: 'FIREBASE_TOKEN', data: token });
                SetItem('FIRE_TOKEN', token);
            })
            .catch(function (error) {
                console.log("Error", error);
            })

        messaging.onMessage(function (payload) {
            var notificationTitle = payload.data.title;
            const notificationOptions = {
                body: payload.data.body,
                icon: payload.data.icon,
                image: payload.data.image,
                click_action: payload.data.url, // To handle notification click when notification is moved to notification tray
                data: {
                    click_action: payload.data.url
                }
            };

            if (isNewNotificationSupported()) {
                const notification = new Notification(notificationTitle, notificationOptions);
                notification.onclick = function (event) {
                    event.preventDefault(); // prevent the browser from focusing the Notification's tab
                    // window.open(notificationOptions.click_action);
                    if (notificationOptions.click_action) {
                        (window as any).location = window.location.href + notificationOptions.click_action;
                    }
                    notification.close();
                }
            }

            // Store event for showing push notification in user notification component.
            if (payload && payload.data) {

                let { data = {} } = payload;

                const isNotification = data.is_notification;

                //checking if notification is true than storing else showing toast notification
                if (StrToBool(isNotification)) {

                    data.created_at = GetTime();
                    data.content = data.title;

                    StoreEvent({ event: 'pustNotificationData', data: data }); //storing push notification

                } else {
                    // title && Toast.notification({ description: title, type: 'success' }); //showing toast notification when is_notification is false
                }
            }
        });
    }
}

// function isNewNotificationSupported() {
//     // if (!window.Notification || !Notification.requestPermission)
//     //     return false;
//     // if (Notification.permission == 'granted')
//     //     throw new Error('You must only call this *before* calling Notification.requestPermission(), otherwise this feature detect would bug the user with an actual notification!');
//     try {
//         new Notification('');
//     } catch (e) {
//         if (e.name == 'TypeError')
//             return false;
//     }
//     return true;
// }

//Check permission type granted or denied
function permissionStatus() {

    return Notification.requestPermission()
        .then(function (permission) {
            return permission;
        })
        .then(function (permission) {
            if (permission === 'granted') {
                return true;
            } else if (permission === 'denied') {
                return false
            }
        })
        .catch(function (error) {
            console.log("Error", error);
        })
}





export const firebaseCloudMessaging = {
    //checking whether token is available in indexed DB
    tokenInlocalforage: async () => {
        return GetItem('fcm_token');
    },
    //initializing firebase app
    init: async function () {
        const hasPermission = await permissionStatus();
        //Permission denied than return
        if (!hasPermission) {
            return;
        }

        if (!firebase.apps.length && firebase.messaging.isSupported()) {
            firebase.initializeApp(GLOBAL.FIREBASE_CONFIG);
            // firebase.analytics();
            try {
                const messaging = firebase.messaging();
                const tokenInLocalForage = await this.tokenInlocalforage();
                //if FCM token is already there just return the token
                if (tokenInLocalForage !== null) {
                    return tokenInLocalForage;
                }


                //requesting notification permission from browser
                const status = await Notification.requestPermission();

                if (status && status === 'granted') {
                    //getting token from FCM
                    const fcm_token = await messaging.getToken();
                    if (fcm_token) {
                        //setting FCM token in indexed db using localforage
                        // SetItem('fcm_token', fcm_token);
                        //return the FCM token after saving it

                        Authentication.storeDeviceIdentifierToken(fcm_token as string);

                        StoreEvent({ eventName: 'DEVICE_TOKEN', data: fcm_token });
                    }


                    messaging.onMessage(function (payload) {
                        console.log('payload from webpush:', payload);
                        var notificationTitle = payload.data.title;
                        const { bigPictureUrl, largeIconUrl } = payload.data;

                        const notificationOptions = {
                            body: payload.data.body,
                            icon: largeIconUrl,
                            image: bigPictureUrl,
                            click_action: payload.data.url, // To handle notification click when notification is moved to notification tray
                            data: {
                                click_action: payload.data.url
                            }
                        };

                        if (isNewNotificationSupported()) {
                            const notification = new Notification(notificationTitle, notificationOptions);
                            notification.onclick = function (event) {
                                event.preventDefault(); // prevent the browser from focusing the Notification's tab
                                // window.open(notificationOptions.click_action);
                                if (typeof window !== undefined && notificationOptions.click_action) {
                                    (window as any).location = window.location.href + notificationOptions.click_action;
                                }
                                notification.close();
                            }
                        }

                        // Store event for showing push notification in user notification component.
                        if (payload && payload.data) {

                            let { data = {} } = payload;
                            const { title } = data;

                            const isNotification = data.is_notification;

                            //checking if notification is true than storing else showing toast notification
                            if (StrToBool(isNotification)) {

                                // data.created_at = GetTime();
                                data.content = data.title;

                                StoreEvent({ event: 'pustNotificationData', data: data }); //storing push notification

                            } else {
                                // @todo show toast notification when is_notification is false
                                console.log('show this as toast', { description: title, type: 'success' });
                                // title && Toast.notification({ description: title, type: 'success' }); //showing toast notification when is_notification is false
                            }
                        }
                    });
                    console.log('fcm token2', fcm_token);
                    return fcm_token;
                }

            } catch (error) {
                console.error(error);
                return null;
            }
        }
    },
};


function isNewNotificationSupported() {
    // if (!window.Notification || !Notification.requestPermission)
    //     return false;
    // if (Notification.permission == 'granted')
    //     throw new Error('You must only call this *before* calling Notification.requestPermission(), otherwise this feature detect would bug the user with an actual notification!');
    try {
        new Notification('');
    } catch (e) {
        if (e.name === 'TypeError')
            return false;
    }
    return true;
}

//Check permission type granted or denied
// function permissionStatus() {
//     return Notification.requestPermission()
//         .then(function (permission) {
//             return permission;
//         })
//         .then(function (permission) {
//             if (permission === 'granted') {
//                 return true;
//             } else if (permission === 'denied') {
//                 return false
//             }
//         })
//         .catch(function (error) {
//             console.log("Error", error);
//         })
// }

