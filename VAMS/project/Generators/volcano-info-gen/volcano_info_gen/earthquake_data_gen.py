import random
from datetime import datetime

from volcano_info_gen.data_gen import DataGenerator


def get_magnitude():
    return random.normalvariate(1, 1)


def get_depth():
    return round(random.uniform(0.3, 2.5), 2)


class EarthquakeGenerator(DataGenerator):
    def __init__(
        self,
        volcano_id: str,
        broker,
        volcano_name: str,
        volcano_latitude: float,
        volcano_longitude: float,
        stop_event,
    ):
        super().__init__(volcano_id, broker, "earthquake-topic", stop_event)
        self.source = "VAMS"
        self.location = volcano_name
        self.volcano_lat = volcano_latitude
        self.volcano_lon = volcano_longitude

    def get_latitude(self):
        return round(self.volcano_lat + random.uniform(-0.2, 0.2), 5)

    def get_longitude(self):
        return round(self.volcano_lon + random.uniform(-0.2, 0.2), 5)

    def gen_data(self):
        return {
            "key": {
                "volcanoId": self.volcano_id,
                "timestamp": datetime.now().isoformat(),
            },
            "latitude": self.get_latitude(),
            "longitude": self.get_longitude(),
            "depth": get_depth(),
            "magnitude": max(0.1, get_magnitude()),
            "location": self.location,
            "source": self.source,
        }
