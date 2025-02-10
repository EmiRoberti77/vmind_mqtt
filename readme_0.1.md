# MQTTHandler Library

## Overview

The MQTTHandler library is a lightweight, static TypeScript-based MQTT broker utility designed to simplify the use of the MQTT protocol for IoT and real-time messaging. The library uses a static approach to remove the need for repeated instantiation, ensures a single connection across your application, and provides robust event-driven communication via EventEmitter.

## Features

- Static Design: Simplifies usage by managing a single shared MQTT client instance.
- Event-Driven: Uses EventEmitter to handle message events seamlessly.
- Ease of Use: Intuitive APIs for connecting, publishing, and subscribing to MQTT topics.
- Error Handling: Provides detailed error messages for debugging.
- Scalable: Designed for lightweight, efficient message handling.

## Installation

Install the library from npm:

```bash
npm i vmind_mqtt
```

## Methods

The `MQTTHandler` library provides the following methods:

1. **`initialize(mqttUrl: string): void`**  
   Initializes the MQTT client with the specified broker URL.  
   Example:

   ```typescript
   MQTTHandler.initialize("mqtt://broker.hivemq.com");
   ```

2. **`publish(topic: string, message: string): void`**  
   Publishes a message to the specified topic.  
   Example:

   ```typescript
   MQTTHandler.publish(
     "test/topic",
     JSON.stringify({ message: "hello, MQTT!" })
   );
   ```

3. **`listen(topic: string): void`**  
   Subscribes to a topic and listens for incoming messages.  
   Example:

   ```typescript
   MQTTHandler.listen("test/topic");
   ```

4. **`onMessage(callback: (data: { topic: string; message: any }) => void): void`**  
   Registers a callback to handle incoming messages from subscribed topics.  
   Example:

   ```typescript
   MQTTHandler.onMessage((data) => {
     console.log(`Received message from ${data.topic}:`, data.message);
   });
   ```

5. **`stopListening(topic: string): void`**  
   Unsubscribes from a specific topic, stopping the library from receiving messages from it.  
   Example:

   ```typescript
   MQTTHandler.stopListening("test/topic");
   ```

6. **`close(): void`**  
   Gracefully closes the MQTT connection.  
   Example:
   ```typescript
   MQTTHandler.close();
   ```

## Usage

### Initialize the MQTT Client

Before using the library, initialize the MQTT client with the broker URL:

```typescript
MQTTHandler.initialize("mqtt://broker.hivemq.com");
```

### Publish a Message

Send a message to a specific topic:

```typescript
MQTTHandler.publish("test/topic", JSON.stringify({ message: "hello, MQTT!" }));
```

### Subscribe and Listen to a Topic

Listen for messages from a subscribed topic:

```typescript
MQTTHandler.listen("test/topic");

MQTTHandler.onMessage((data) => {
  console.log(`Received message from ${data.topic}:`, data.message);
});
```

### Stop Listening to a Topic

Unsubscribe from a topic to stop receiving messages:

```typescript
MQTTHandler.stopListening("test/topic");
```

### Close the MQTT Connection

Gracefully close the MQTT connection when done:

```typescript
MQTTHandler.close();
```

## Example

```typescript
import { MQTTHandler } from "vmind_mqtt/dist";

// Initialize the client
MQTTHandler.initialize("mqtt://broker.hivemq.com");

// Subscribe and listen to a topic
MQTTHandler.listen("example/topic");
MQTTHandler.onMessage((data) => {
  console.log(`Received message on topic ${data.topic}:`, data.message);
});

// Publish a message
MQTTHandler.publish(
  "example/topic",
  JSON.stringify({ message: "Hello, World!" })
);

// Stop listening to the topic
MQTTHandler.stopListening("example/topic");

// Close the client after some time
setTimeout(() => {
  MQTTHandler.close();
}, 5000);
```

## Advantages of the Static Approach

1. **Singleton Pattern**:  
   Ensures a single MQTT connection instance across your application, reducing overhead and connection management issues.

2. **Simplified API**:  
   No need to instantiate the client repeatedly; directly use static methods to interact with the broker.

3. **Event-Driven Communication**:  
   Uses EventEmitter to handle messages, enabling clean, modular, and decoupled code.

4. **Lightweight**:  
   Avoids dependencies on frameworks like Express, making it ideal for small services or microservices.

5. **Flexibility**:  
   Easily integrates into any TypeScript or Node.js project.

## License

This library is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! If you find a bug or want to add features, feel free to submit a pull request or open an issue on the GitHub repository.

## Support

If you encounter any issues or have questions, feel free to contact us or open a support ticket.

Emi Roberti - Happy Coding
