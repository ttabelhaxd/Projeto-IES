import random
from datetime import datetime

from volcano_info_gen.data_gen import DataGenerator


class PressureGenerator(DataGenerator):
    def __init__(self, volcano_id, address, latitude, stop_event):
        super().__init__(volcano_id, address, "pressure-topic", stop_event)
        self.latitude = latitude

        self.pressure_values = {
            15: [1012.5, 2.5],
            30: [1020, 5],
            60: [1010, 10],
            90: [1005, 15],
        }

    def get_value(self):
        lat = abs(self.latitude)
        mean = 6.5
        dev = 3.5

        for max_lat, values in sorted(self.pressure_values.items()):
            if lat < max_lat:
                mean, dev = values
                break

        return random.normalvariate(mean, dev)

    def gen_data(self):
        return {
            "key": {
                "volcanoId": self.volcano_id,
                "timestamp": datetime.now().isoformat(),
            },
            "pressureValue": self.get_value(),
        }
