# Messages

## Serialization and Deserialization

### Serialization

```python
value_serializer=lambda v: json.dumps(v).encode("utf-8")
```

```java
ObjectMapper objectMapper = new ObjectMapper();
    try {
      return objectMapper.writeValueAsString(this);
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Failed to serialize Volcano to JSON", e);
    }
```

### Deserialization

```python
value_deserializer=lambda m: json.loads(m.decode("UTF-8"))
```

```java
ObjectMapper objectMapper = new ObjectMapper();
    try {
      Wind wind = objectMapper.readValue(windStr, Wind.class);
      windRepository.save(wind);
      logger.info(String.format("Received wind -> %s", wind));
    } catch (Exception e) {
      e.printStackTrace();
    }
```

## Volcano Message

### Topic

- volcano-topic

### Message Format

```json
{
  "id": "f704f519-d171-4f5c-a876-ff9d7d0bbb6f",
  "name": "Pinatubo",
  "description": "description",
  "latitude": 38.73,
  "longitude": -27.32,
  "magnitude": 1.0
}
```

## Earthquake Message

### Topic

- earthquake-topic

### Message Format

```json
{
  "key": {
    "volcanoId": "f704f519-d171-4f5c-a876-ff9d7d0bbb6f",
    "timestamp": "timestamp"
  },
  "latitude": 38.73,
  "longitude": -27.32,
  "depth": 2.0,
  "source": "source"
}
```

## Erosion Message

### Topic

- erosion-topic

### Message Format

```json
{
  "key": {
    "volcanoId": "f704f519-d171-4f5c-a876-ff9d7d0bbb6f",
    "timestamp": "timestamp"
  },
  "erosionRate": 2.0
}
```

## Eruption Message

### Topic

- eruption-topic

### Message Format

```json
{
  "key": {
    "volcanoId": "f704f519-d171-4f5c-a876-ff9d7d0bbb6f",
    "timestamp": "timestamp"
  },
  "type": "efusivo",
  "vei": 2,
  "description": "description"
}
```

## Gases Message

### Topic

- gases-topic

### Message Format

```json
{
  "key": {
    "volcanoId": "f704f519-d171-4f5c-a876-ff9d7d0bbb6f",
    "timestamp": "timestamp"
  },
  "h2S": 2.0,
  "co2": 2.0,
  "so2": 2.0,
  "hcl": 2.0
}
```

## Humidity Message

### Topic

- humidity-topic

### Message Format

```json
{
  "key": {
    "volcanoId": "f704f519-d171-4f5c-a876-ff9d7d0bbb6f",
    "timestamp": "timestamp"
  },
  "humidityValue": 2.0
}
```

## Magma Message

### Topic

- magma-topic

### Message Format

```json
{
  "key": {
    "volcanoId": "f704f519-d171-4f5c-a876-ff9d7d0bbb6f",
    "timestamp": "timestamp"
  },
  "silicon": 2.0,
  "iron": 2.0,
  "aluminum": 2.0,
  "calcium": 2.0,
  "sodium": 2.0,
  "magnesium": 2.0,
  "potassium": 2.0,
  "viscosity": 2.0
}
```

## Pressure Message

### Topic

- pressure-topic

### Message Format

```json
{
  "key": {
    "volcanoId": "f704f519-d171-4f5c-a876-ff9d7d0bbb6f",
    "timestamp": "timestamp"
  },
  "pressureValue": 2.0
}
```

## Soil Message

### Topic

- soil-topic

### Message Format

```json
{
  "key": {
    "volcanoId": "f704f519-d171-4f5c-a876-ff9d7d0bbb6f",
    "timestamp": "timestamp"
  },
  "type": "type",
  "humidity": 2.0,
  "landslideProbability": 2.0
}
```

## Temperature Message

### Topic

- temperature-topic

### Message Format

```json
{
  "key": {
    "volcanoId": "f704f519-d171-4f5c-a876-ff9d7d0bbb6f",
    "timestamp": "timestamp"
  },
  "temperatureValue": 2.0
}
```

## Wind Message

### Topic

- wind-topic

### Message Format

```json
{
  "key": {
    "volcanoId": "f704f519-d171-4f5c-a876-ff9d7d0bbb6f",
    "timestamp": "timestamp"
  },
  "windSpeed": 2.0
}
```
