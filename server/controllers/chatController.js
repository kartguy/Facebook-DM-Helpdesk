
function postWebHook(req,res){
    const body = req.body;

    if (body.object === 'page') {
        body.entry.forEach(entry => {
            const webhookEvent = entry.messaging[0];
            console.log(webhookEvent);
            // Handle the incoming message logic here
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }

}

function getWebHook(req,res){
    const VERIFY_TOKEN = 'myToken'; // Replace with your Verify Token
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }   
}

module.exports={
    postWebHook,
    getWebHook
}
