export const genError = (
  error: string,
  className: string | undefined = undefined,
  funcName: string | undefined = undefined
) =>
  `ERROR:message=${error}:className=${className ? className : "NCN"}:funcName=${
    funcName ? funcName : "NFN"
  }`;

export enum MESSAGES {
  STARTED = "started",
  CONROLLER_NOT_IN_STARTED_MODE = "controller is not in started mode",
  MQTT_BROKER_CONNECTED = "mqtt broker connected",
  MQTT_BROKER_DISCONNECTED = "mqtt broker disconnected",
  MQTT_BROKER_END = "mqtt broker end",
  MQTT_BROKER_CONNECTION_ERR = "mqtt broker connection error",
  MQTT_CLIENT_NOT_INIT = "mqtt client is not initialised",
}

export enum ERRORS {
  NULL_INSTANCE = "mqtt client null instance",
}
