// notification.js
export async function requestNotificationPermission() {
    if (!("Notification" in window)) {
        alert("This browser does not support notifications.");
        return;
    }

    if (Notification.permission === "default") {
        await Notification.requestPermission();
    }
}

export function showNotification(title: string, body: string) {
    if (Notification.permission === "granted") {
        new Notification(title, {
            body,
            icon: "/logo.png",
        });
    }
}