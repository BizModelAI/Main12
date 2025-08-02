import express from "express";

// Request type imported from express
// Response type imported from express

console.log("Starting minimal test server...");

const app = express();
const port = 9000;

app.get("/api/health", (req: any, res: any) => {
  res.json({ status: "Test server is running!" });
});

app.get("*", (req: any, res: any) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Test Server</title>
      </head>
      <body>
        <div id="root">
          <h1>Test Server Running</h1>
          <p>Minimal server is working</p>
        </div>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
});
