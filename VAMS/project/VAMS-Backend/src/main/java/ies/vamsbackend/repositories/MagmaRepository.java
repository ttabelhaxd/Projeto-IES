package ies.vamsbackend.repositories;

import ies.vamsbackend.entities.Magma;
import ies.vamsbackend.keys.EntityKey;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface MagmaRepository extends CassandraRepository<Magma, EntityKey> {

    List<Magma> findByKeyVolcanoId(UUID volcano_id);

    List<Magma> findByKeyVolcanoIdAndKeyTimestampBetween(UUID volcano_id, LocalDateTime startDate, LocalDateTime endDate);

    void deleteByKeyVolcanoId(UUID volcano_id);

}
