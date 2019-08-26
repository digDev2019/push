const express = require('express');
const app = express();
const webpush = require('web-push');
app.use(express.static(__dirname));
app.use(express.json());
const server = app.listen(8081, () => {
const host = server.address().address;
const port = server.address().port;
console.log('App listening at http://%s:%s', host, port);
});

let dataBase = [];

app.post('/api/save-subscription', function(req, res){
    if(!isValidSaveRequest(req, res)){
        return;
    };

    if(dataBase.length == 0){
        dataBase.push(req.body);
    };
    for(let i=0; i<dataBase.length; i++){
        if(dataBase[i].endpoint == req.body.endpoint){
            break;
        }
        else{
            if(i == dataBase.length-1){
                dataBase.push(req.body);
            }
        }
    };
    
    console.log(dataBase);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
            data: {success: true}
        })
    );
});

const isValidSaveRequest = (req, res)=>{
    if(!req.body || !req.body.endpoint){
        res.status(400);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            error: {
                id: 'Нет endpoint',
                message: 'Подписка должна иметь endpoint'
            }
        }));
        return false;
    };
    return true;
};

//отправка push сообщения
app.post('/api/trigger-push-msg/', function (req, res) {

    for(let i=0; i<dataBase.length; i++){

        const pushSubscription = dataBase[i];
        const payload = JSON.stringify(req.body);
        const options = {
            TTL: 60,
            vapidDetails: {
                subject: 'mailto:loggin.log@yandex.ru',
                publicKey: 'BNoEyUT5b2t2CnZVSWmTHIIZJJQNN5C3Yo9lNplspZOl0z1hVPd_-i5jFjuMaoDVdjH27RmIQXqvoH4enAyZTUA',
                privateKey: 'qsqM6kiihGlMsyoMzA-_fovwkM5fUdOdyz3hsEFzelE'
            }
        };

        webpush.sendNotification(
          pushSubscription,
          payload,
          options
        );
    };

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
            data: {success: true}
        })
    );
});









//
