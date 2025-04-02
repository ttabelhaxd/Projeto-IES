package ies.vamsbackend.repositories;

import ies.vamsbackend.entities.Earthquake;
import ies.vamsbackend.keys.EntityKey;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface EarthquakeRepository extends CassandraRepository<Earthquake, EntityKey> {

    List<Earthquake> findByKeyVolcanoId(UUID volcano_id);

    List<Earthquake> findByKeyVolcanoIdAndKeyTimestampBetween(UUID volcano_id, LocalDateTime startTime, LocalDateTime endTime);

    void deleteByKeyVolcanoId(UUID volcano_id);

}
