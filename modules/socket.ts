import { defineNuxtModule } from "@nuxt/kit";
import { WebSocketServer } from "ws";

export default defineNuxtModule({
  setup(_, nuxt) {
    nuxt.hook("listen", (server) => {
      const wsServer = new WebSocketServer({ server });
      nuxt.hook("close", () => wsServer.close());
      wsServer.on("connection", (ws) => {
        ws.on("message", (data) => {
          ws.send(data.toString() + " hello");
        });
      });
    });
  },
});
