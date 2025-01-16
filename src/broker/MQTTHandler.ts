import mqtt, { MqttClient } from "mqtt";
import { genError, MESSAGES } from "../constants";
import EventEmitter from "events";

export class MQTTHandler extends EventEmitter {
  private static client: MqttClient;
  private static className: string = "MQTTHandler";
  private static emitter: EventEmitter = new EventEmitter();

  // Initialize the MQTT client
  public static initialize(mqttUrl: string): void {
    if (!this.client) {
      console.log("started myqtt");
      this.client = mqtt.connect(mqttUrl);

      this.client.on("connect", () => {
        console.log(MESSAGES.MQTT_BROKER_CONNECTED);
      });

      this.client.on("disconnect", () => {
        console.log(MESSAGES.MQTT_BROKER_DISCONNECTED);
      });

      this.client.on("error", (err) => {
        console.error(genError(err.message, this.className, "initialize"));
      });
      console.log("complted mqtt init");
    }
  }

  // Publish a message to a topic
  public static publish(topic: string, message: string) {
    console.log("sending mqtt message");
    if (!this.client) {
      throw new Error(
        genError("MQTT client not initialized", this.className, "publish")
      );
    }

    this.client.publish(topic, message, { qos: 1 }, (err) => {
      if (err) {
        console.error(genError(err.message, this.className, "publish"));
      } else {
        console.log(`Published to ${topic}: ${message}`);
      }
    });
  }

  public static listen(topic: string) {
    if (!this.client) {
      throw new Error(
        genError("MQTT client not initialized", this.className, "listen")
      );
    }

    this.client.subscribe(topic, { qos: 1 }, (err) => {
      if (err) {
        throw new Error(
          genError(
            `failed to subscribe to topic:${topic}`,
            this.className,
            "listen/subscribe"
          )
        );
      } else {
        console.log("Success:subscribed to:", topic);
        this.client.on("message", (receivedTopic, payLoad) => {
          this.emitter.emit(
            "message",
            JSON.stringify({
              topic,
              message: JSON.parse(payLoad.toString()),
            })
          );
        });
      }
    });
  }

  public static onMessage(
    callback: (data: { topic: string; message: any }) => void
  ): void {
    this.emitter.on("message", callback);
  }

  // Close the MQTT connection
  public static close(): void {
    if (this.client) {
      this.client.end();
      console.log(MESSAGES.MQTT_BROKER_DISCONNECTED);
    } else {
      console.warn(
        genError("MQTT client not initialized", this.className, "close")
      );
    }
  }
}
