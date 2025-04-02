import json
import os
import threading

from kafka import KafkaConsumer

from volcano_info_gen.earthquake_data_gen import EarthquakeGenerator
from volcano_info_gen.eruption_data_gen import EruptionGenerator
from volcano_info_gen.gases_data_gen import GasesGenerator
from volcano_info_gen.magma_data_gen import MagmaGenerator
from volcano_info_gen.soil_data_gen import SoilGenerator
from volcano_info_gen.temperature_data_gen import TemperatureGenerator
from volcano_info_gen.erosion_data_gen import ErosionGenerator
from volcano_info_gen.humidity_data_gen import HumidityGenerator
from volcano_info_gen.pressure_data_gen import PressureGenerator
from volcano_info_gen.wind_data_gen import WindGenerator

KAFKA_BROKER = os.getenv("KAFKA_BROKER", "localhost:9092")

# ALL GENS ARE GENERATING DATA EVERY 5 TO 10 MINUTES (RANDOMLY), EXCEPT FIXED ONES
LOWER_TIME_IN_MINUTES = 5
UPPER_TIME_IN_MINUTES = 10
FIXED_TIME_IN_MINUTES = 0.5

active_volcanoes = {}


def start_generators(volcano_data):
    volcano_id = volcano_data.get("id")
    volcano_name = volcano_data.get("name")
    volcano_latitude = volcano_data.get("latitude")
    volcano_longitude = volcano_data.get("longitude")

    stop_event = threading.Event()

    # To create instance generator e.g. gases_generator = GasesGenerator(volcano_id)
    soil_generator = SoilGenerator(
        volcano_id, KAFKA_BROKER, volcano_latitude, stop_event
    )
    temperature_generator = TemperatureGenerator(
        volcano_id, KAFKA_BROKER, volcano_latitude, stop_event
    )
    magma_generator = MagmaGenerator(volcano_id, KAFKA_BROKER, stop_event)
    gases_generator = GasesGenerator(volcano_id, KAFKA_BROKER, stop_event)
    earthquake_generator = EarthquakeGenerator(
        volcano_id,
        KAFKA_BROKER,
        volcano_name,
        volcano_latitude,
        volcano_longitude,
        stop_event,
    )
    eruption_generator = EruptionGenerator(volcano_id, KAFKA_BROKER, stop_event)
    erosion_generator = ErosionGenerator(volcano_id, KAFKA_BROKER, stop_event)
    humidity_generator = HumidityGenerator(
        volcano_id, KAFKA_BROKER, volcano_latitude, stop_event
    )
    pressure_generator = PressureGenerator(
        volcano_id, KAFKA_BROKER, volcano_latitude, stop_event
    )
    wind_generator = WindGenerator(
        volcano_id, KAFKA_BROKER, volcano_latitude, stop_event
    )

    # # Create thread e.g. gases_thread = threading.Thread(target=gases_generator.<method_to_generate_data>, args=(LOWER_TIME_IN_MINUTES, UPPER_TIME_IN_MINUTES))
    threads = [
        threading.Thread(
            target=soil_generator.run,
            args=(FIXED_TIME_IN_MINUTES, FIXED_TIME_IN_MINUTES),
        ),
        threading.Thread(
            target=temperature_generator.run,
            args=(FIXED_TIME_IN_MINUTES, FIXED_TIME_IN_MINUTES),
        ),
        threading.Thread(
            target=magma_generator.run,
            args=(FIXED_TIME_IN_MINUTES, FIXED_TIME_IN_MINUTES),
        ),
        threading.Thread(
            target=gases_generator.run,
            args=(FIXED_TIME_IN_MINUTES, FIXED_TIME_IN_MINUTES),
        ),
        threading.Thread(
            target=earthquake_generator.run,
            args=(LOWER_TIME_IN_MINUTES, UPPER_TIME_IN_MINUTES),
        ),
        threading.Thread(
            target=eruption_generator.run,
            args=(LOWER_TIME_IN_MINUTES, UPPER_TIME_IN_MINUTES),
        ),
        threading.Thread(
            target=erosion_generator.run,
            args=(FIXED_TIME_IN_MINUTES, FIXED_TIME_IN_MINUTES),
        ),
        threading.Thread(
            target=humidity_generator.run,
            args=(FIXED_TIME_IN_MINUTES, FIXED_TIME_IN_MINUTES),
        ),
        threading.Thread(
            target=pressure_generator.run,
            args=(FIXED_TIME_IN_MINUTES, FIXED_TIME_IN_MINUTES),
        ),
        threading.Thread(
            target=wind_generator.run,
            args=(FIXED_TIME_IN_MINUTES, FIXED_TIME_IN_MINUTES),
        ),
    ]
    # # start threads e.g. gases_thread.daemon = True; gases_thread.start();
    for thread in threads:
        thread.daemon = True
        thread.start()

    active_volcanoes[volcano_id] = {"threads": threads, "stop_event": stop_event}

    print(f"started generators for volcano {volcano_name}")


def stop_generators(volcano_id):
    if volcano_id not in active_volcanoes:
        print(f"No active generators found for volcano ID {volcano_id}.")
        return

    # Set the stop event to signal threads to exit
    volcano_data = active_volcanoes[volcano_id]
    stop_event = volcano_data["stop_event"]
    stop_event.set()

    # Wait for threads to finish
    threads = volcano_data["threads"]
    for thread in threads:
        thread.join(timeout=1)

    # Clean up
    del active_volcanoes[volcano_id]


consumer = KafkaConsumer(
    "volcano-topic",
    group_id="my-group",
    bootstrap_servers=[KAFKA_BROKER],
    value_deserializer=lambda m: json.loads(m.decode("UTF-8")),
)

for message in consumer:
    volcano_data = message.value

    if volcano_data["action"] == "add":
        print(
            f'Adding: id: {volcano_data.get("id")}, name: {volcano_data.get("name")}, geo: {volcano_data.get("latitude"), volcano_data.get("longitude")}'
        )
        start_generators(volcano_data)
    elif volcano_data["action"] == "delete":
        print(f'Deleting: id: {volcano_data.get("id")}')
        stop_generators(volcano_data.get("id"))
