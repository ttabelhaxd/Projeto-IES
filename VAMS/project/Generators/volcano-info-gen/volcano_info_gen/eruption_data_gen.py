import random
from datetime import datetime

from volcano_info_gen.data_gen import DataGenerator

TYPES = [
    [0, "Hawaiian"],
    [1, "Hawaiian / Strombolian"],
    [2, "Strombolian / Vulcanian"],
    [3, "Strombolian / Vulcanian / Peléan / Sub-Plinian"],
    [4, "Peléan / Plinian / Sub-Plinian"],
    [5, "Peléan / Plinian"],
    [6, "Plinian / Ultra-Plinian"],
    [7, "Ultra-Plinian"],
    [8, "Ultra-Plinian"],
]

WEIGHTS = [1000, 700, 500, 200, 100, 50, 10, 2, 1]

eruption_descriptions = {
    0: [
        "Non-explosive eruptions with gentle lava flows.",
        "Characterized by low gas content and low viscosity magma.",
        "Often associated with shield volcanoes like Mauna Loa.",
    ],
    1: [
        "Mildly explosive eruptions with small lava fountains.",
        "Usually causes minimal damage and produces small amounts of tephra.",
        "Common in Hawaiian or Strombolian activity.",
    ],
    2: [
        "Moderate explosive activity with stronger lava fountains.",
        "Ash clouds may rise up to 10 kilometers.",
        "Typically associated with Strombolian or Vulcanian eruptions.",
    ],
    3: [
        "Eruptions of greater intensity, producing significant ash and pyroclastic flows.",
        "Can generate ash columns up to 15 kilometers.",
        "Seen in Strombolian, Vulcanian, or Peléan eruptions.",
    ],
    4: [
        "Powerful eruptions with tall ash columns and pyroclastic surges.",
        "Ash plumes may reach up to 20 kilometers into the atmosphere.",
        "Often associated with Peléan, Plinian, or Sub-Plinian activity.",
    ],
    5: [
        "Very powerful eruptions producing substantial pyroclastic flows and widespread ash.",
        "Ash columns can reach up to 30 kilometers.",
        "Typically linked to Peléan or Plinian eruptions.",
    ],
    6: [
        "Cataclysmic eruptions with widespread effects and massive ash clouds.",
        "Ash plumes can reach heights of 50 kilometers.",
        "Common in Plinian or Ultra-Plinian eruptions.",
    ],
    7: [
        "Extremely violent eruptions with global climatic impacts.",
        "Ash plumes exceeding 50 kilometers are typical.",
        "Associated with Ultra-Plinian eruptions.",
    ],
    8: [
        "Unprecedented eruptions with catastrophic global consequences.",
        "Massive amounts of ash and gases released into the stratosphere.",
        "Most likely to occur in Ultra-Plinian eruptions.",
    ],
}



def get_vei_type():
    random_eruption = random.choices(TYPES, weights=WEIGHTS)[0]
    vei = random_eruption[0]
    type_eruption = random_eruption[1]
    return vei, type_eruption


def get_description(vei):
    return random.choice(eruption_descriptions[vei])


class EruptionGenerator(DataGenerator):
    def __init__(self, volcano_id: str, broker, stop_event):
        super().__init__(volcano_id, broker, "eruption-topic", stop_event)

    def gen_data(self):
        vei, type_eruption = get_vei_type()
        description = get_description(vei)
        return {
            "key": {
                "volcanoId": self.volcano_id,
                "timestamp": datetime.now().isoformat(),
            },
            "type": type_eruption,
            "vei": vei,
            "description": description
        }
