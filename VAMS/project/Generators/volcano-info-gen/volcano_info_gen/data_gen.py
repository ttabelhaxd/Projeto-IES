import json
import random
from kafka import KafkaProducer
from time import sleep


class DataGenerator:
    def __init__(self, volcano_id: str, broker: str, topic: str, stop_event):
        self.volcano_id = volcano_id
        self.stop_event = stop_event
        self.producer = KafkaProducer(
            bootstrap_servers=broker,
            value_serializer=lambda v: json.dumps(v).encode("utf-8"),
        )
        self.topic = topic

    def send_data(self, data):
        self.producer.send(self.topic, data)

    def run(self, lower_time_in_minutes: int, upper_time_in_minutes: int):
        while not self.stop_event.is_set():
            print(f"staring to send {self} - for volcano {self.volcano_id}")
            data = self.gen_data()
            self.send_data(data)
            print(f"sent data -> {data}")
            if lower_time_in_minutes == upper_time_in_minutes:
                sleep(lower_time_in_minutes * 60)
            else:
                sleep(
                    random.uniform(
                        lower_time_in_minutes * 60, upper_time_in_minutes * 60
                    )
                )

    def gen_data(self):
        raise NotImplementedError("gen_data() must be implemented by the subclass.")
