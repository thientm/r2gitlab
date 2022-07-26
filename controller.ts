
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

    const content = await request.body().value;
    console.log(content);
    response.body = { message: "Received msg: " + content };
    response.status = 200;
};

export { getR2gitlab, receivedWebhookR2Gitlab };
