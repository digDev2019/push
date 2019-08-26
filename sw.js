self.addEventListener('push', event => {

    let body;
    if (event.data) {
    body = event.data.json();
    } else {
    body = 'Получить текст ссобщения не удалось';
    };

    const options = {
    body: body.text,
    icon: 'images/ic.png',
    vibrate: [100, 50, 100],
    data: Date.now(),
    actions: [
      {action: 'explore', title: 'Больше информации',
        icon: 'images/checkmark.png'},
      {action: 'close', title: 'Закрыть уведомление',
        icon: 'images/xmark.png'},
    ]
    };

    event.waitUntil(
    self.registration.showNotification(body.title, options)
    );
});


self.addEventListener('notificationclick', event => {
    const notification = event.notification;
    const primaryKey = notification.data.primaryKey;
    const action = event.action;

    if (action === 'close') {
        notification.close();
    }
    else {
        clients.openWindow('http://www.google.com');
        notification.close();
    };
});
