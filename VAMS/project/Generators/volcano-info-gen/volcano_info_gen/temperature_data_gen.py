import random
from datetime import datetime

from volcano_info_gen.data_gen import DataGenerator


class TemperatureGenerator(DataGenerator):
    def __init__(self, volcano_id: str, broker, latitude, stop_event):
        super().__init__(volcano_id, broker, "temperature-topic", stop_event)
        self.latitude = latitude

    def get_temperature(self):
        mean = 26 - abs(self.latitude) * 0.3
        return round(random.normalvariate(mean, 5), 2)

    def gen_data(self):
        return {
            "key": {
                "volcanoId": self.volcano_id,
                "timestamp": datetime.now().isoformat(),
            },
            "temperatureValue": self.get_temperature(),
        }
