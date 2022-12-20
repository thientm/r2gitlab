import { Router } from "https://deno.land/x/oak/mod.ts";
import {
  getR2gitlab,
  receivedWebhookR2Gitlab
} from "./controller.ts";

const router = new Router();
router.get("/", getR2gitlab).post("/r2gitlab", receivedWebhookR2Gitlab);
export default router;
