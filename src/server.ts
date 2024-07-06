import app from "./app";
import config from "./config/config";

app.set("port", config.port || 3000); // 포트 설정
app.set("host", process.env.HOST || "0.0.0.0"); // 아이피 설정

app.listen(app.get("port"), app.get("host"), () => {
  console.log(
    "Server is running on : " + app.get("host") + ":" + app.get("port"),
  );
});
