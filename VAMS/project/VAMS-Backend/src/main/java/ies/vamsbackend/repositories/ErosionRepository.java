package ies.vamsbackend.repositories;

import ies.vamsbackend.entities.Erosion;
import ies.vamsbackend.keys.EntityKey;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ErosionRepository extends CassandraRepository<Erosion, EntityKey> {

    List<Erosion> findByKeyVolcanoId(UUID volcanoId);

    List<Erosion> findByKeyVolcanoIdAndKeyTimestampBetween(UUID volcanoId, LocalDateTime startTimestamp, LocalDateTime endTimestamp);

    void deleteByKeyVolcanoId(UUID volcano_id);

}
