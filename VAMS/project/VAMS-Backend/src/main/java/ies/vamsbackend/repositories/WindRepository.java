package ies.vamsbackend.repositories;

import ies.vamsbackend.entities.Wind;
import ies.vamsbackend.keys.EntityKey;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface WindRepository extends CassandraRepository<Wind, EntityKey> {

    List<Wind> findByKeyVolcanoId(UUID volcanoId);

    List<Wind> findByKeyVolcanoIdAndKeyTimestampBetween(UUID volcanoId, LocalDateTime startTimestamp, LocalDateTime endTimestamp);

    void deleteByKeyVolcanoId(UUID volcano_id);

}
