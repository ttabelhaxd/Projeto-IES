create keyspace if not exists vams
with replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

use vams;

create table if not exists volcano (
    id UUID PRIMARY KEY,
    name text,
    description text,
    latitude double,
    longitude double
);

create table if not exists earthquake (
    volcano_id UUID,
    timestamp timestamp,
    latitude double,
    longitude double,
    magnitude double,
    depth double,
    location text,
    source text,
    PRIMARY KEY (volcano_id, timestamp)
);

create table if not exists erosion (
    volcano_id UUID,
    timestamp timestamp,
    erosionRate double,
    PRIMARY KEY (volcano_id, timestamp)
);

create table if not exists eruption (
    volcano_id UUID,
    timestamp timestamp,
    type text,
    vei int,
    description text,
    PRIMARY KEY (volcano_id, timestamp)
);

create table if not exists gases (
    volcano_id UUID,
    timestamp timestamp,
    H2S double,
    CO2 double,
    SO2 double,
    HCl double,
    PRIMARY KEY (volcano_id, timestamp)
);

create table if not exists humidity (
    volcano_id UUID,
    timestamp timestamp,
    humidityValue double,
    PRIMARY KEY (volcano_id, timestamp)
);

create table if not exists magma (
    volcano_id UUID,
    timestamp timestamp,
    silicon double,
    iron double,
    aluminum double,
    calcium double,
    sodium double,
    magnesium double,
    potassium double,
    viscosity double,
    PRIMARY KEY (volcano_id, timestamp)
);

create table if not exists pressure (
    volcano_id UUID,
    timestamp timestamp,
    pressureValue double,
    PRIMARY KEY (volcano_id, timestamp)
);

create table if not exists soil (
    volcano_id UUID,
    timestamp timestamp,
    type text,
    humidity double,
    landslideProbability double,
    PRIMARY KEY (volcano_id, timestamp)
);

create table if not exists temperature (
    volcano_id UUID,
    timestamp timestamp,
    temperatureValue double,
    PRIMARY KEY (volcano_id, timestamp)
);

create table if not exists wind (
    volcano_id UUID,
    timestamp timestamp,
    windSpeed double,
    PRIMARY KEY (volcano_id, timestamp)
);
