import mqtt, { MqttClient } from "mqtt";
import { genError, MESSAGES } from "../constants";
import EventEmitter from "events";
import { MQTTHandlerOptions } from "../types/mqttHandlerOptions";

export class MQTTHandler extends EventEmitter {
  private static client: MqttClient;
  private static className: string = "MQTTHandler";
  private static emitter: EventEmitter = new EventEmitter();

  /**
   * @deprecated Use initializeWithUrl or initializeWithCAOptions
   * start client by passing the host url ( this is the minimun requirement to start the client)
   * this method is here for legacy implementation
   * @param mqttUrl - the MQTT broker URL.
   */
  public static initialize(mqttUrl: string): void {
    if (!this.client) {
      console.log("started myqtt");
      this.client = mqtt.connect(mqttUrl);
      this.initEvent();
    }
  }

  /**
   * starts the MQTT client by host name ( this will use default port 8883)
   * @param mqttUrl - the MQTT URL.
   */
  public static initializeWithUrl(mqttUrl: string): void {
    if (!this.client) {
      console.log("started myqtt");
      this.client = mqtt.connect(mqttUrl);
      this.initEvent();
      console.log("complted mqtt init");
    }
  }

  /**
   * start the mqtt client with CA security, in the options:MQTTHandlerOptions pass
   * in the file path to the certificates
   * @param options - MQTTHandlerOptions
   */
  public static initializeWithCAOptions(options: MQTTHandlerOptions): void {
    if (!this.client) {
      console.log("started myqtt");
      this.client = mqtt.connect(options);
      this.initEvent();
      console.log("complted mqtt init");
    }
  }

  private static initEvent() {
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

  public static stopListening(topic: string): void {
    if (!this.client) {
      throw new Error(
        genError("MQTT client not initialized", this.className, "stopListening")
      );
    }

    this.client.unsubscribe(topic, (err) => {
      if (err) {
        console.error(
          genError(
            `Failed to unsubscribe from topic: ${topic}`,
            this.className,
            "stopListening"
          )
        );
      } else {
        console.log(`Successfully unsubscribed from topic: ${topic}`);
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
