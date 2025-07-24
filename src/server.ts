import "dotenv/config";
import connectToDB from "./database/db";
import { initMailer } from "./mail/mail.service";
import app from "./app";

const startServer = async () => {
  await connectToDB();
  await initMailer();

  const PORT: number | string = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server", err);
});
