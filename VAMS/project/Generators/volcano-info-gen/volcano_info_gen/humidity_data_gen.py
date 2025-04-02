import random
from datetime import datetime

from volcano_info_gen.data_gen import DataGenerator


class HumidityGenerator(DataGenerator):
    def __init__(self, volcano_id, address, latitude, stop_event):
        super().__init__(volcano_id, address, "humidity-topic", stop_event)
        self.latitude = latitude

        self.humidity_values = {15: [85, 15], 30: [40, 20], 60: [60, 20], 90: [65, 15]}

    def get_value(self):
        lat = abs(self.latitude)
        mean = 6.5
        dev = 3.5

        for max_lat, values in sorted(self.humidity_values.items()):
            if lat < max_lat:
                mean, dev = values
                break

        return max(1.2, min(99.9, random.normalvariate(mean, dev)))

    def gen_data(self):
        return {
            "key": {
                "volcanoId": self.volcano_id,
                "timestamp": datetime.now().isoformat(),
            },
            "humidityValue": self.get_value(),
        }
