export const config = {
  port: Number.parseInt(process.env.PORT || "4000", 10),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
};
