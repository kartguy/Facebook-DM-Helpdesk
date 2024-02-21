const express=require("express");
const router=express.Router();

router.post('/webhook',(req,res)=>{
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
});

router.get('/webhook',(req,res)=>{
    const VERIFY_TOKEN = 'EAAXe6QCXIL4BOZB4ZCMOJ3i6JbVQjKx2LOjgl5qUYAZAnoWpxneJ19rYCeD4WpbDuNQ3ETc9dGTdmnpYGD1bQEyW9i4wsers5mYIYjJg1l1vBvxAKjzkBf4AoDHfpD41hXXQ8bgw0vDzk8jUm2fs9vSE6Nim3ihjQUyi9GrRFkuGUmPk3LgysQ5HZB6TSFZCP';
    
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode==='subscribe' && token === VERIFY_TOKEN) {

        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }   
})


module.exports={
    webRouter:router
}