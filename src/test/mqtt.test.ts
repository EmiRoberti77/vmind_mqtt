import { MQTTHandler } from "../broker/MQTTHandler";

describe("vmind_mqtt test suite", () => {
  const host = "mqtt://localhost";
  const topic = "emi-test";
  //   afterEach(async () => {
  //     await MQTTHandler.close();
  //   });
  //   test("test-1 MQTTHandler.initialize()", async () => {
  //     const ret = await MQTTHandler.initialize();
  //     expect(ret).toBe(true);
  //   });

  test("test-2 listen - subscribe - publish", async () => {
    const ret = await MQTTHandler.initialize();
    expect(ret).toBeTruthy();
    await MQTTHandler.listen(topic);
    MQTTHandler.onMessage((data) => {
      expect(data.topic).toBe(topic);
      expect(data.message).toBeDefined();
    });
    expect(ret).toBe(true);

    MQTTHandler.publish(
      topic,
      JSON.stringify({
        message: "test-message",
        timeStamp: new Date().toISOString(),
      })
    );
  });

  //   test("test-3 MQTTHandler.initialize(host)", async () => {
  //     const ret = await MQTTHandler.initialize(host);
  //     expect(ret).toBe(true);
  //   });
});
