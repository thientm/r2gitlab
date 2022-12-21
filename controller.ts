const providerCfg = Deno.env.get("providerCfg");

const getR2gitlab = ({ response }: { response: any }) => {
  response.body = "GET OK - Api worked! - webhook: POST /r2gitlab";
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

  const pipelinesInfoText = getPipelinesInfo(webhookContent);

  console.log("Debug: ", pipelinesInfoText);
  await sentToTelegramApi(pipelinesInfoText);

  response.status = 200;
};

const sentToTelegramApi = async function (text: string) {
  const teleBotEnpoint =
    "https://api.telegram.org/bot5337368328:AAH7FQeGeXk6AvubjpvuMYuqclTPI9mwYhs/sendMessage?chat_id=-717245078&text=" +
    encodeURI(text);

  const resp = await fetch(teleBotEnpoint);
  console.log(resp.status + ": Tele Sent!"); // 200
};

const parseTagEnv = (tagName: string) => {
  if (tagName.indexOf("dc2s-retail") > -1) {
    return "Staging";
  }
  if (tagName.indexOf("dc1-production") > -1) {
    return "Production-Dc1";
  }
  if (tagName.indexOf("dc2-production") > -1) {
    return "Production-Dc2";
  }
};

const tagInfoBuilder = (pipeData) => {
  const statusPipe = pipeData.object_attributes.status;
  let pipeObj = "🚀 Tag" + ": " +
    pipeData.object_attributes.ref + "\n" +
    "👷‍♂️ " + pipeData.user.username + ": " +
    parseTagEnv(pipeData.object_attributes.ref) + "\n" +
    (statusPipe === "success" ? "✔" : "❌") +
    pipeData.object_attributes.status + " -> " +
    pipeData.object_attributes.detailed_status;
  return pipeObj;
};

let getPipelinesInfo = function (pipeData) {
  const statusPipe = pipeData.object_attributes.status;
  if (
    statusPipe === "pending" ||
    statusPipe === "running" ||
    statusPipe === "canceled"
  ) {
    return "";
  }

  if (pipeData.object_attributes.tag) {
    return tagInfoBuilder(pipeData);
  } else {
    let pipeObj = "👀 " + pipeData.object_attributes.ref + "\n" +
      "👷‍♂️ " + pipeData.user.username + ": " + pipeData.commit.title + "\n" +
      (statusPipe === "success" ? "✔" : "❌") + " Status: " +
      pipeData.object_attributes.status + " -> " +
      pipeData.object_attributes.detailed_status;
    return pipeObj;
  }
};

export { getR2gitlab, receivedWebhookR2Gitlab };
