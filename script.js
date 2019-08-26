if(!('serviceWorker' in navigator)){
    console.log('Сервис воркер не поддерживается');
};

if(!('PushManager' in window)){
    console.log('PUSH не поддерживается');
};

navigator.serviceWorker.register('sw.js')
.then((reg)=>{
    console.log('Сервис воркер зарегистрирован');

    Notification.requestPermission().then((permission)=>{
        if(permission == 'granted'){
            console.log('Статус разрешения на показ уведомлений ', permission);

            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('BNoEyUT5b2t2CnZVSWmTHIIZJJQNN5C3Yo9lNplspZOl0z1hVPd_-i5jFjuMaoDVdjH27RmIQXqvoH4enAyZTUA')
            };

            reg.pushManager.subscribe(subscribeOptions)
            .then((pushSubscription)=>{
                console.log('Получен pushSubscription', pushSubscription);

                document.getElementsByClassName('pushSubscription')[0].textContent = JSON.stringify(pushSubscription);

                sendSubscriptionToBackEnd(pushSubscription);
            })
            .catch((e)=>{
                console.log('pushSubscription не получен', e);
            });
        }
        else{
            console.log('Нет разрешения на показ уведомлений');
        };
    });
})
.catch((e)=>{
    console.log('Сервис воркер не зарегистрирован', e);
});


const sendButton = document.getElementById('send');
sendButton.addEventListener('click', sendMessageToBackEnd);

function sendMessageToBackEnd(){
    let textMessage = {
        title: document.getElementById('title').value,
        text: document.getElementById('text').value
    };

    return fetch('/api/trigger-push-msg/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(textMessage)
    })
    .then((response)=>{
        if(!response.ok){
            throw new Error('Запрос на отправку сообщения неудачен');
        };

        return response.json();
    })
    .then((responseData)=>{
        if(!(responseData.data && responseData.data.success)){
            throw new Error('Плохой ответ от сервера при отправке сообщения');
        }
    })
    .catch((e)=>{
        console.log('Ошибка при отправке сообщения', e);
    })
};


function sendSubscriptionToBackEnd(subscription){
    return fetch('/api/save-subscription', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((response)=>{
        if(!response.ok){
            throw new Error('Запрос на отправку pushSubscription неудачен');
        };

        return response.json();
    })
    .then((responseData)=>{
        if(!(responseData.data && responseData.data.success)){
            throw new Error('Плохой ответ от сервера');
        }
    });
};

function urlBase64ToUint8Array(base64String){
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};


//
