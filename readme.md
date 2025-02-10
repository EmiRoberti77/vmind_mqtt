# MQTTHandler Library

## Overview

The **MQTTHandler** library is a lightweight, static TypeScript-based MQTT client utility designed to simplify real-time messaging for IoT applications. It ensures a **single MQTT connection** across your application and provides robust **event-driven communication** via `EventEmitter`.

## Features

- **Static Design**: Manages a **single MQTT client instance**, removing the need for multiple instantiations.
- **Secure Communication**: Supports **SSL/TLS certificates** for **encrypted MQTT connections**.
- **Event-Driven**: Uses `EventEmitter` for handling incoming messages.
- **Error Handling**: Provides **detailed error messages** for debugging.
- **Flexible**: Supports **both plaintext and secure MQTT connections**.

---

## Installation

Install the package via **npm**:

```sh
npm install vmind_mqtt
```

---

## Deprecation Notice

⚠️ **`initialize(mqttUrl: string)` is deprecated!**  
Use **`initializeWithUrl()`** or **`initializeWithCAOptions()`** instead.

---

## Usage

### **1. Initialize the MQTT Client**

#### **Option 1: Basic Connection (Unsecured)**

```typescript
MQTTHandler.initializeWithUrl("mqtt://broker.hivemq.com");
```

- Uses **default port 1883** for **plaintext (non-TLS)** connections.

#### **Option 2: Secure Connection with CA (Recommended)**

```typescript
MQTTHandler.initializeWithCAOptions({
  host: "your-mqtt-broker.com",
  port: 8883,
  protocol: "mqtts", // Secure MQTT
  ca: fs.readFileSync("path/to/ca.crt").toString(),
  cert: fs.readFileSync("path/to/client.crt").toString(),
  key: fs.readFileSync("path/to/client.key").toString(),
  rejectUnauthorized: true, // Enforce strict SSL validation in production
});
```

- Uses **port 8883** for **SSL/TLS** communication.
- Requires **valid CA, client certificate, and client key**.
- Prevents **MITM attacks** by enforcing **encryption**.

---

### **2. Publish a Message**

```typescript
MQTTHandler.publish("test/topic", JSON.stringify({ message: "Hello, MQTT!" }));
```

---

### **3. Subscribe & Listen to a Topic**

```typescript
MQTTHandler.listen("test/topic");

MQTTHandler.onMessage((data) => {
  console.log(`Received message from ${data.topic}:`, data.message);
});
```

---

### **4. Stop Listening to a Topic**

```typescript
MQTTHandler.stopListening("test/topic");
```

---

### **5. Close the MQTT Connection**

```typescript
MQTTHandler.close();
```

---

## API Reference

| Method                                                 | Description                                                         |
| ------------------------------------------------------ | ------------------------------------------------------------------- |
| `initialize(mqttUrl: string)`                          | **(Deprecated)** Initializes MQTT client with a broker URL.         |
| `initializeWithUrl(mqttUrl: string)`                   | Initializes MQTT using a broker URL.                                |
| `initializeWithCAOptions(options: MQTTHandlerOptions)` | **(Recommended)** Secure MQTT connection with SSL/TLS certificates. |
| `publish(topic: string, message: string)`              | Publishes a message to an MQTT topic.                               |
| `listen(topic: string)`                                | Subscribes to an MQTT topic.                                        |
| `onMessage(callback)`                                  | Registers a callback to handle received messages.                   |
| `stopListening(topic: string)`                         | Unsubscribes from a topic.                                          |
| `close()`                                              | Gracefully closes the MQTT connection.                              |

---

## Example Usage

```typescript
import { MQTTHandler } from "vmind_mqtt/dist";
import fs from "fs";

// Secure connection with SSL/TLS
MQTTHandler.initializeWithCAOptions({
  host: "your-mqtt-broker.com",
  port: 8883,
  protocol: "mqtts",
  ca: fs.readFileSync("path/to/ca.crt").toString(),
  cert: fs.readFileSync("path/to/client.crt").toString(),
  key: fs.readFileSync("path/to/client.key").toString(),
  rejectUnauthorized: true, // Enforce strict SSL validation
});

// Subscribe and listen to a topic
MQTTHandler.listen("example/topic");
MQTTHandler.onMessage((data) => {
  console.log(`Received message from ${data.topic}:`, data.message);
});

// Publish a message
MQTTHandler.publish(
  "example/topic",
  JSON.stringify({ message: "Secure MQTT!" })
);

// Stop listening to the topic
MQTTHandler.stopListening("example/topic");

// Close the connection after some time
setTimeout(() => {
  MQTTHandler.close();
}, 5000);
```

---

## 🔹 Why Use the Static Approach?

✅ **Singleton Pattern** → Ensures **only one MQTT connection** per application.  
✅ **Simplified API** → No need for manual instantiation.  
✅ **Event-Driven Communication** → Uses `EventEmitter` for efficient message handling.  
✅ **Lightweight & Efficient** → Works well for **IoT & real-time** applications.

---

## License

This library is licensed under the **MIT License**. See the LICENSE file for details.

## Contributing

Feel free to submit **issues** or **pull requests** to improve the library!

## Support

If you encounter any issues, **open a GitHub issue** or reach out for support.

---

Emi Roberti - Happy coding
