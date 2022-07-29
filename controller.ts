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

  await sentToTelegramApi(pipelinesInfoText);
  //await sentToWorkplaceChat(pipelinesInfoText);

  response.status = 200;
};

const sentToTelegramApi = async function (text: string) {
  //configTelegramBot.url = 'https://api.telegram.org/bot5337368328:AAH7FQeGeXk6AvubjpvuMYuqclTPI9mwYhs/sendMessage?chat_id=-1001531122216&text=' + encodeURI(text)
  const teleBotEnpoint =
    "https://api.telegram.org/bot5337368328:AAH7FQeGeXk6AvubjpvuMYuqclTPI9mwYhs/sendMessage?chat_id=-717245078&text=" +
    encodeURI(text);

  const resp = await fetch(teleBotEnpoint);
  console.log(resp.status + ": Tele Sent!"); // 200
};

const sentToWorkplaceChat = function (msgtoSent: string) {
  const myHeaders = new Headers();
  myHeaders.append("authority", "citigo.m.workplace.com");
  myHeaders.append("accept", "*/*");
  myHeaders.append("accept-language", "en-US,en;q=0.9,vi;q=0.8,la;q=0.7");
  myHeaders.append("content-type", "application/x-www-form-urlencoded");
  myHeaders.append(
    "cookie",
    "datr=4he9Ykshdo-z0VylQtFho8KW; sb=EBi9YrIuKz_fTS10xUZdZfCv; c_user=100042843791126; presence=EDvF3EtimeF1657253794EuserFA21B42843791126A2EstateFDutF0CEchF_7bCC; dpr=3; wd=390x844; m_pixel_ratio=3; xs=8%3ALenKhBqXwvz8Xw%3A2%3A1656559633%3A-1%3A-1%3A%3AAcUDxYbze0973oSh7vENAzL49lTUm3U3XgMb2C4VZPDs",
  );
  myHeaders.append("dnt", "1");
  myHeaders.append("origin", "https://citigo.m.workplace.com");
  myHeaders.append(
    "referer",
    "https://citigo.m.workplace.com/chat/t/4774597829305770",
  );
  myHeaders.append("sec-fetch-dest", "empty");
  myHeaders.append("sec-fetch-mode", "cors");
  myHeaders.append("sec-fetch-site", "same-origin");
  myHeaders.append(
    "user-agent",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
  );
  myHeaders.append("x-fb-lsd", "-kanfWBb3e5k6EZZF_7O0u");
  myHeaders.append("x-msgr-region", "PRN");
  myHeaders.append("x-requested-with", "XMLHttpRequest");
  myHeaders.append("x-response-format", "JSONStream");

  const bodyEncoded = new URLSearchParams();
  bodyEncoded.append("tids", "cid.g.4774597829305770");
  bodyEncoded.append("wwwupp", "C3");
  bodyEncoded.append("body", msgtoSent);
  bodyEncoded.append("waterfall_source", "message");
  bodyEncoded.append("action_time", "1658831449749");
  bodyEncoded.append("__cid", "750043595418020");
  bodyEncoded.append(
    "fb_dtsg",
    "NAcPorvTGy9mleT-GsijvD9iGUjm5CXebl7F-2z7FibT7Z7k-romPCQ:8:1656559633",
  );
  bodyEncoded.append("jazoest", "25445");
  bodyEncoded.append("lsd", "-kanfWBb3e5k6EZZF_7O0u");
  bodyEncoded.append(
    "__dyn",
    "1KQEGiEiwgVU-4UpwGzVQ2mml3onxG6U4a6EC5UfQE6C2W3q327E2JxK4o19oe8hwaG3G0Joeoe852q1ew65xO0FE6S1QzU1vrzo1sE52229wcq0C9EdE2IzUuw9O1Awci1qw8W1uwa-7U881soow46wbS1Lwqo",
  );
  bodyEncoded.append("__req", "u");
  bodyEncoded.append(
    "__a",
    "AYk9w97Cfsy95kk0fud3hOMuyzW4Xs32m18nf8LFtCw3eyqtyilB89cfIx2uwh43dS78oRmdYaVeaCN5HqNPtquNssDUM1-y3_2BWUaRa_zEFw",
  );
  bodyEncoded.append("__user", "100042843791126");

  const body = bodyEncoded;
  console.log("Workplace-Chat Sent!"); // 200
  const resp = fetch(
    "https://citigo.m.workplace.com/messages/send/?icm=1",
    {
      method: "POST",
      headers: myHeaders,
      body,
    },
  );
  //console.log(resp.status + ": Workplace-Chat Sent!"); // 200
};

let getPipelinesInfo = function (pipeData) {
  let pipeObj = "🚀 " + (pipeData.object_attributes.tag ? "New Tag: " : "") +
    pipeData.object_attributes.ref + "\n" +
    "👷‍♂️ " + pipeData.user.username + ": " + pipeData.commit.title + "\n" +
    "⚡ Status: " + pipeData.object_attributes.status + " -> " +
    pipeData.object_attributes.detailed_status;
  return pipeObj;
};

export { getR2gitlab, receivedWebhookR2Gitlab, testSentToWorkplaceChat };
