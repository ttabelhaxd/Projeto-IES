import random
from datetime import datetime

from volcano_info_gen.data_gen import DataGenerator


class WindGenerator(DataGenerator):
    def __init__(self, volcano_id, address, latitude, stop_event):
        super().__init__(volcano_id, address, "wind-topic", stop_event)
        self.latitude = latitude

        self.wind_ranges = {15: [3, 2], 30: [6.5, 3.5], 60: [10, 5], 90: [6.5, 3.5]}

    def get_value(self):
        lat = abs(self.latitude)
        mean = 6.5
        dev = 3.5

        for max_lat, values in sorted(self.wind_ranges.items()):
            if lat < max_lat:
                mean, dev = values
                break

        return max(0.1, random.normalvariate(mean, dev))

    def gen_data(self):
        return {
            "key": {
                "volcanoId": self.volcano_id,
                "timestamp": datetime.now().isoformat(),
            },
            "windSpeed": self.get_value(),
        }
