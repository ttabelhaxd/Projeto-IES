package ies.vamsbackend.repositories;

import ies.vamsbackend.entities.Temperature;
import ies.vamsbackend.keys.EntityKey;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TemperatureRepository extends CassandraRepository<Temperature, EntityKey> {

    List<Temperature> findByKeyVolcanoId(UUID volcanoId);

    List<Temperature> findByKeyVolcanoIdAndKeyTimestampBetween(UUID volcanoId, LocalDateTime startTimestamp, LocalDateTime endTimestamp);

    void deleteByKeyVolcanoId(UUID volcano_id);

}
