package ies.vamsbackend.repositories;

import ies.vamsbackend.entities.Gases;
import ies.vamsbackend.keys.EntityKey;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface GasesRepository extends CassandraRepository<Gases, EntityKey> {

    List<Gases> findByKeyVolcanoId(UUID volcanoId);

    List<Gases> findByKeyVolcanoIdAndKeyTimestampBetween(UUID volcanoId, LocalDateTime startTimestamp, LocalDateTime endTimestamp);

    void deleteByKeyVolcanoId(UUID volcano_id);

}
