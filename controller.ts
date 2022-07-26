
const getR2gitlab = ({ response }: { response: any }) => {
    response.body = 'GET OK - Api worked!';
};

const receivedWebhookR2Gitlab = async ({
    request,
    response,
}: {
    request: any;
    response: any;
}) => {
    if (!request.body()) {
        response.status = 400;
        response.body = {
            success: false,
            msg: "The request must have a body",
        };
        return;
    }

    const webhookContent = await request.body().value;    
    //response.body = { message: "Received msg: " + content };

    let pipelinesInfoText = getPipelinesInfo(webhookContent);
    
    await sentToTelegramApi(pipelinesInfoText);

    response.status = 200;
};

let sentToTelegramApi = async function(text) {
    //configTelegramBot.url = 'https://api.telegram.org/bot5337368328:AAH7FQeGeXk6AvubjpvuMYuqclTPI9mwYhs/sendMessage?chat_id=-1001531122216&text=' + encodeURI(text) 
    const teleBotEnpoint = 'https://api.telegram.org/bot5337368328:AAH7FQeGeXk6AvubjpvuMYuqclTPI9mwYhs/sendMessage?chat_id=-717245078&text=' + encodeURI(text) 
    
    let resp = await fetch(teleBotEnpoint);
    console.log(resp.status); // 200
}

let getPipelinesInfo = function(pipeData) {
    let pipeObj = '🚀 ' + (pipeData.object_attributes.tag ? 'New Tag: ': '') + pipeData.object_attributes.ref + '\n'
                    + '👷‍♂️ ' + pipeData.user.username + ': ' + pipeData.commit.title + '\n'
                    + '⚡ Status: ' + pipeData.object_attributes.status + ' -> '+ pipeData.object_attributes.detailed_status;    
    return pipeObj;
}


export { getR2gitlab, receivedWebhookR2Gitlab };
