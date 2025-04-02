from datetime import datetime
import random

from volcano_info_gen.data_gen import DataGenerator


def get_value():
    lower = 0.0
    upper = 100.0

    if random.random() < 0.01:
        upper = 10000.0

    return random.uniform(lower, upper)


class ErosionGenerator(DataGenerator):
    def __init__(self, volcano_id, address, stop_event):
        super().__init__(volcano_id, address, "erosion-topic", stop_event)

    def gen_data(self):
        return {
            "key": {
                "volcanoId": self.volcano_id,
                "timestamp": datetime.now().isoformat(),
            },
            "erosionRate": get_value(),
        }
