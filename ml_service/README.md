# IoT Cyber Attack Detection – ML Service

This service loads a trained XGBoost model to detect and classify IoT cyber attacks.

## Endpoint
POST /predict

## Input (JSON)
{
  "packet_size": 1200,
  "latency_ms": 350,
  "cpu_usage_percent": 72,
  "memory_usage_percent": 65,
  "battery_level": 40,
  "temperature_c": 38,
  "sector": "Healthcare",
  "protocol": "MQTT",
  "connection_status": "Connected",
  "operation_type": "Read"
}

## Output
{
  "attack_type": 2
}
