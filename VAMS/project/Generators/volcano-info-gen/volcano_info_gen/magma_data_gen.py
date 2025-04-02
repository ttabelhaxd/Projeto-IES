import random
from datetime import datetime

from volcano_info_gen.data_gen import DataGenerator

TYPES = ["Basaltic", "Andesitic", "Rhyolitic"]


def get_viscosity():
    viscosity = random.lognormvariate(2, 1)
    return max(10.0, min(1_000_000.0, viscosity))


def get_random_value(lower, upper):
    return random.uniform(lower, upper)


class MagmaGenerator(DataGenerator):
    def __init__(self, volcano_id: str, broker, stop_event):
        super().__init__(volcano_id, broker, "magma-topic", stop_event)
        self.type = random.choice(TYPES)

    def get_silicon(self):
        lower = 0
        upper = 0

        match self.type:
            case "Basaltic":
                lower = 45
                upper = 52
            case "Andesitic":
                lower = 52
                upper = 63
            case "Rhyolitic":
                lower = 63
                upper = 75
            case _:
                pass

        return random.uniform(lower, upper)

    def get_iron(self):
        lower = 0
        upper = 0

        match self.type:
            case "Basaltic":
                lower = 8
                upper = 12
            case "Andesitic":
                lower = 5
                upper = 8
            case "Rhyolitic":
                lower = 1
                upper = 5
            case _:
                pass

        return random.uniform(lower, upper)

    def get_aluminum(self):
        lower = 0
        upper = 0

        match self.type:
            case "Basaltic":
                lower = 10
                upper = 18
            case "Andesitic":
                lower = 15
                upper = 18
            case "Rhyolitic":
                lower = 12
                upper = 16
            case _:
                pass

        return random.uniform(lower, upper)

    def get_calcium(self):
        lower = 0
        upper = 0

        match self.type:
            case "Basaltic":
                lower = 8
                upper = 12
            case "Andesitic":
                lower = 5
                upper = 9
            case "Rhyolitic":
                lower = 1
                upper = 4
            case _:
                pass

        return random.uniform(lower, upper)

    def get_sodium(self):
        lower = 0
        upper = 0

        match self.type:
            case "Basaltic":
                lower = 1
                upper = 4
            case "Andesitic":
                lower = 2
                upper = 6
            case "Rhyolitic":
                lower = 3
                upper = 8
            case _:
                pass

        return random.uniform(lower, upper)

    def get_magnesium(self):
        lower = 0
        upper = 0

        match self.type:
            case "Basaltic":
                lower = 5
                upper = 15
            case "Andesitic":
                lower = 3
                upper = 8
            case "Rhyolitic":
                lower = 0.5
                upper = 2
            case _:
                pass

        return random.uniform(lower, upper)

    def get_potassium(self):
        lower = 0
        upper = 0

        match self.type:
            case "Basaltic":
                lower = 0.1
                upper = 1
            case "Andesitic":
                lower = 1
                upper = 3
            case "Rhyolitic":
                lower = 3
                upper = 5
            case _:
                pass

        return random.uniform(lower, upper)

    def gen_data(self):
        return {
            "key": {
                "volcanoId": self.volcano_id,
                "timestamp": datetime.now().isoformat(),
            },
            "silicon": round(self.get_silicon(), 2),
            "iron": round(self.get_iron(), 2),
            "aluminum": round(self.get_aluminum(), 2),
            "calcium": round(self.get_calcium(), 2),
            "sodium": round(self.get_sodium(), 2),
            "magnesium": round(self.get_magnesium(), 2),
            "potassium": round(self.get_potassium(), 2),
            "viscosity": round(get_viscosity(), 2),
        }
