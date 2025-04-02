import random
from datetime import datetime

from volcano_info_gen.data_gen import DataGenerator

TYPES = [
    "Andisols",
    "Latosols",
    "Volcanic Sandy Soils",
    "Clayey",
    "Pumice",
    "Scoria-Rich",
    "Ash-Covered",
]


def get_landslide_prob(humidity):
    base_prob = 0.3
    humidity_factor = (humidity - 50) / 50
    return random.normalvariate(base_prob + 0.4 * humidity_factor, 0.1)


class SoilGenerator(DataGenerator):
    def __init__(self, volcano_id: str, broker, latitude, stop_event):
        super().__init__(volcano_id, broker, "soil-topic", stop_event)
        self.type = random.choice(TYPES)
        self.latitude = latitude

        self.humidity_values = {15: [80, 3], 30: [60, 13], 60: [60, 3], 90: [40, 3]}

    def get_humidity(self):
        lat = abs(self.latitude)
        mean = 6.5
        dev = 3.5

        for max_lat, values in sorted(self.humidity_values.items()):
            if lat < max_lat:
                mean, dev = values
                break

        return random.normalvariate(mean, dev)

    def gen_data(self):
        humidity = max(0.02, min(0.99, self.get_humidity()))
        landslide_prob = max(0.01, min(0.98, get_landslide_prob(humidity)))
        return {
            "key": {
                "volcanoId": self.volcano_id,
                "timestamp": datetime.now().isoformat(),
            },
            "type": self.type,
            "humidity": humidity,
            "landslideProbability": landslide_prob,
        }
