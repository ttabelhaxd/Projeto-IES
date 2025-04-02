package ies.vamsbackend.repositories;

import ies.vamsbackend.entities.Soil;
import ies.vamsbackend.keys.EntityKey;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface SoilRepository extends CassandraRepository<Soil, EntityKey> {

    List<Soil> findByKeyVolcanoId(UUID volcanoId);

    List<Soil> findByKeyVolcanoIdAndKeyTimestampBetween(UUID volcanoId, LocalDateTime startTimestamp, LocalDateTime endTimestamp);

    void deleteByKeyVolcanoId(UUID volcano_id);

}
