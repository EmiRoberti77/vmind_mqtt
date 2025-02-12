const host = "mqtt://localhost";
const topic = "emi-test";
import { MQTTHandler } from "../broker/MQTTHandler";

async function main() {
  //init connection
  const ret = await MQTTHandler.initialize();
  //subscribe to topic
  MQTTHandler.listen(topic);
  //register to call back
  MQTTHandler.onMessage((data) => {
    console.log(data);
  });
  //publish a message
  MQTTHandler.publish(
    topic,
    JSON.stringify({
      message: "test-message",
      timeStamp: new Date().toISOString(),
    })
  );
  //disconnet if no need to listen or public any more
  MQTTHandler.close();
}

main();
