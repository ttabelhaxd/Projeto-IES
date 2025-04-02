package ies.vamsbackend.repositories;

import ies.vamsbackend.entities.Humidity;
import ies.vamsbackend.keys.EntityKey;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface HumidityRepository extends CassandraRepository<Humidity, EntityKey> {

    List<Humidity> findByKeyVolcanoId(UUID volcanoId);

    List<Humidity> findByKeyVolcanoIdAndKeyTimestampBetween(UUID volcanoId, LocalDateTime startTimestamp, LocalDateTime endTimestamp);

    void deleteByKeyVolcanoId(UUID volcano_id);

}
