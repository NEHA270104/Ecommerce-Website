import http from "node:http";
import dotenv from "dotenv";
import { handleApiRequest } from "./apiMiddleware.ts";

// Load environment variables for standalone Node process
dotenv.config({ path: ".env.local" });
dotenv.config();

const PORT = parseInt(process.env.PORT || "5000", 10);
const HOST = "0.0.0.0";

const server = http.createServer(async (req, res) => {
  await handleApiRequest(req, res, () => {
    // Unhandled / non-api routes return 404 JSON
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Not Found" }));
  });
});

server.listen(PORT, HOST, () => {
  console.log(`[Vrishabhanvi Backend] Server is running on http://${HOST}:${PORT}`);
});
