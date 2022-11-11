const providerCfg = Deno.env.get("providerCfg");

const getR2gitlab = ({ response }: { response: any }) => {
  response.body =
    "GET OK - Api worked! - webhook: POST /r2gitlab,  test sent to workplace: GET /testSentToWorkplaceChat";
};

const testSentToWorkplaceChat = async ({ response }: { response: any }) => {
  await sentToWorkplaceChat("Api worked!");
  response.body = "GET OK - Api worked! Check Wp for sent!";
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

  const pipelinesInfoText = getPipelinesInfo(webhookContent);
  if (providerCfg && providerCfg === "1") {
    await sentToTelegramApi(pipelinesInfoText);
  } else if (providerCfg && providerCfg === "2") {
    sentToWorkplaceChat(pipelinesInfoText);
  } else if (providerCfg && providerCfg === "3") {
    await sentToTelegramApiDev(pipelinesInfoText);
  } else {
    console.log("Debug: ", pipelinesInfoText);
  }

  response.status = 200;
};

const sentToTelegramApiDev = async function (text: string) {
  const teleBotEnpoint =
    "https://api.telegram.org/bot5337368328:AAH7FQeGeXk6AvubjpvuMYuqclTPI9mwYhs/sendMessage?chat_id=-1001531122216&text=" +
    encodeURI(text);
  const resp = await fetch(teleBotEnpoint);
  console.log(resp.status + ": Tele Sent!"); // 200
};

const sentToTelegramApi = async function (text: string) {
  const teleBotEnpoint =
    "https://api.telegram.org/bot5337368328:AAH7FQeGeXk6AvubjpvuMYuqclTPI9mwYhs/sendMessage?chat_id=-717245078&text=" +
    encodeURI(text);

  const resp = await fetch(teleBotEnpoint);
  console.log(resp.status + ": Tele Sent!"); // 200
};

const sentToWorkplaceChat = function (msgtoSent: string) {
  //Header builder
  const myHeaders = new Headers();
  myHeaders.append("authority", "citigo.m.workplace.com");
  myHeaders.append("accept", "*/*");
  myHeaders.append("accept-language", "en-US,en;q=0.9,vi;q=0.8,la;q=0.7");
  myHeaders.append("content-type", "application/x-www-form-urlencoded");
  myHeaders.append("dnt", "1");
  myHeaders.append("origin", "https://citigo.m.workplace.com");
  myHeaders.append(
    "referer",
    "https://citigo.m.workplace.com/chat/t/5401287386619630",
  );
  myHeaders.append("sec-fetch-dest", "empty");
  myHeaders.append("sec-fetch-mode", "cors");
  myHeaders.append("sec-fetch-site", "same-origin");
  myHeaders.append(
    "user-agent",
    "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36",
  );
  myHeaders.append("x-fb-lsd", "OSa_UFP-sQk0XkkN2wIQgd");
  myHeaders.append("x-msgr-region", "PRN");
  myHeaders.append("x-requested-with", "XMLHttpRequest");
  myHeaders.append("x-response-format", "JSONStream");
  // Cookie may change
  myHeaders.append(
    "cookie",
    "datr=4he9Ykshdo-z0VylQtFho8KW; sb=EBi9YrIuKz_fTS10xUZdZfCv; c_user=100042843791126; presence=EDvF3EtimeF1657253794EuserFA21B42843791126A2EstateFDutF0CEchF_7bCC; dpr=3; wd=390x844; m_pixel_ratio=3; xs=8%3ALenKhBqXwvz8Xw%3A2%3A1656559633%3A-1%3A-1%3A%3AAcUDxYbze0973oSh7vENAzL49lTUm3U3XgMb2C4VZPDs",
  );
  // END Header builder
  // Body builder
  const bodyEncoded = new URLSearchParams();
  bodyEncoded.append("tids", "cid.g.5401287386619630");
  bodyEncoded.append("wwwupp", "C3");
  bodyEncoded.append("waterfall_source", "message");
  bodyEncoded.append("action_time", "1668049488450");
  bodyEncoded.append("__cid", "750043595418020");
  bodyEncoded.append("lsd", "OSa_UFP-sQk0XkkN2wIQgd");
  bodyEncoded.append("__user", "100042843791126");
  // may change
  bodyEncoded.append(
    "fb_dtsg",
    "NAcPul8wAx-3X5f3o0MB-zJrjYLUNO8uvaiGtnoWxmx0mEC013y3GZA:37:1658895813",
  );
  bodyEncoded.append("jazoest", "25399");
  bodyEncoded.append(
    "__dyn",
    "1KQEGiEiwgVU-4UpwGzVQ2mml3onxG6U4a6EC5UfQE6C2W3q327E2JxK4o19oe8hwem0Joeoe852q1ew65xO0FE6S1QzU1vrzo1sE52229wcq0C9EdE2IzUuw9O1Awci1qw8W1uwa-7U881soow46wbS1Lwqo2Yw",
  );
  bodyEncoded.append("__req", "f");
  bodyEncoded.append(
    "__a",
    "AYlpWcOZloNdRTZDALfYfmhKzILt8flbxW_8P_5HDAvnn_N4Lweaw0eqcuE9whJ4YqnAjS149eL9jHcgbh1ih1H6GalzrpHD4QLMDALt43FsDg",
  );

  bodyEncoded.append("body", msgtoSent);
  // END Body builder

  console.log("Workplace-Chat Requested!");
  const body = bodyEncoded;
  fetch(
    "https://citigo.m.workplace.com/messages/send/?icm=1",
    {
      method: "POST",
      headers: myHeaders,
      body,
    },
  );
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
  let pipeObj = "🚀 Tag " + parseTagEnv(pipeData.object_attributes.ref) + ": " +
    pipeData.object_attributes.ref + "\n" +
    "👷‍♂️ " + pipeData.user.username + ": " + "⚡ " +
    pipeData.object_attributes.status + " -> " +
    pipeData.object_attributes.detailed_status;
  return pipeObj;
};

let getPipelinesInfo = function (pipeData) {
  if (
    pipeData.object_attributes.status === "pending" ||
    pipeData.object_attributes.status === "canceled"
  ) {
    return "";
  }

  if (pipeData.object_attributes.tag) {
    return tagInfoBuilder(pipeData);
  } else {
    let pipeObj = "👀 " + pipeData.object_attributes.ref + "\n" +
      "👷‍♂️ " + pipeData.user.username + ": " + pipeData.commit.title + "\n" +
      "⚡ Status: " + pipeData.object_attributes.status + " -> " +
      pipeData.object_attributes.detailed_status;
    return pipeObj;
  }
};

export { getR2gitlab, receivedWebhookR2Gitlab, testSentToWorkplaceChat };
