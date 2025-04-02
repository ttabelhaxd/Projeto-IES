import random
from datetime import datetime

from volcano_info_gen.data_gen import DataGenerator


def get_gas_concentrations():
    res = {"h2s": 0.0, "co2": 0.0, "so2": 0.0, "hcl": 0.0}

    if random.random() > 0.005:
        res["h2s"] = random.normalvariate(0.5, 0.2)
        res["co2"] = random.normalvariate(250, 200)
        res["so2"] = random.normalvariate(25, 20)
        res["hcl"] = random.normalvariate(5, 2)
        return res

    res["h2s"] = random.normalvariate(7.5, 1)
    res["co2"] = random.normalvariate(17500, 7500)
    res["so2"] = random.normalvariate(2750, 1750)
    res["hcl"] = random.normalvariate(300, 100)

    return res


class GasesGenerator(DataGenerator):
    def __init__(self, volcano_id: str, broker, stop_event):
        super().__init__(volcano_id, broker, "gases-topic", stop_event)

    def gen_data(self):
        concentrations = get_gas_concentrations()
        h2s = concentrations["h2s"]
        co2 = concentrations["co2"]
        so2 = concentrations["so2"]
        hcl = concentrations["hcl"]

        return {
            "key": {
                "volcanoId": self.volcano_id,
                "timestamp": datetime.now().isoformat(),
            },
            "h2S": round(max(0.1, h2s), 2),
            "co2": round(max(5.0, co2), 2),
            "so2": round(max(0.5, so2), 2),
            "hcl": round(max(0.05, hcl), 2),
        }
