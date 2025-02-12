import mqtt, { MqttClient } from "mqtt";
import { genError, MESSAGES, MQTT_LOCAL_HOST } from "../constants";
import EventEmitter from "events";
import { MQTTHandlerOptions } from "../types/mqttHandlerOptions";
import { rejects } from "assert";

export class MQTTHandler extends EventEmitter {
  private static client: MqttClient;
  private static className: string = this.constructor.name;
  private static emitter: EventEmitter = new EventEmitter();

  /**
   * Overloaded function definition
   *
   * Initializes the MQTT client with the default host.
   * @returns A promise that resolves to `true` when initialization is successful.
   */
  public static async initialize(): Promise<boolean>;

  /**
   * Overloaded function definition
   *
   * Initializes the MQTT client with a specified host URL.
   * @param args The MQTT broker URL to connect to.
   * @returns A promise that resolves to `true` when initialization is successful.
   */
  public static async initialize(args?: string): Promise<boolean>;

  /**
   * Initializes the MQTT client, either with a default host or a specified URL.
   *
   * - If `args` is provided, it connects to the given MQTT broker URL.
   * - If `args` is not provided, it connects to a default MQTT broker.
   * - If the client is already initialized, it immediately resolves to `true`.
   *
   * @param args (Optional) The MQTT broker URL to connect to.
   * @returns A promise that resolves to `true` on successful connection,
   *          or rejects if an error occurs.
   */

  public static async initialize(args?: string): Promise<boolean> {
    if (this.client) {
      //if client is already activated then return the promise to true
      return Promise.resolve(true);
    }
    return await new Promise<boolean>((resolve, reject) => {
      let host = MQTT_LOCAL_HOST;
      if (args) host = args;
      try {
        console.log("started myqtt");
        this.client = mqtt.connect(host);
        this.client.on("connect", () => {
          console.log(MESSAGES.MQTT_BROKER_CONNECTED);
          resolve(true);
        });

        this.client.on("disconnect", () => {
          console.log(MESSAGES.MQTT_BROKER_DISCONNECTED);
        });

        this.client.on("error", (err) => {
          const error = genError(err.message, this.className, "initialize");
          console.error(error);
          reject(error);
        });
        console.log("complted mqtt init");
      } catch (err) {
        reject(err);
      }
    });
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

  public static async listen(topic: string) {
    if (!this.client) {
      new Error(
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
