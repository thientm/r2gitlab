import { Router } from "https://deno.land/x/oak/mod.ts";
import {
  getR2gitlab,
  receivedWebhookR2Gitlab,
  testSentToWorkplaceChat,
} from "./controller.ts";

const router = new Router();
router.get("/", getR2gitlab).post("/r2gitlab", receivedWebhookR2Gitlab);
router.get("/testSentToWorkplaceChat", testSentToWorkplaceChat);
export default router;
