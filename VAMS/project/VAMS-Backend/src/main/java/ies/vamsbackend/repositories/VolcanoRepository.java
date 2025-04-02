package ies.vamsbackend.repositories;

import org.springframework.data.cassandra.repository.CassandraRepository;
import ies.vamsbackend.entities.Volcano;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface VolcanoRepository extends CassandraRepository<Volcano, UUID> {

    Volcano getVolcanoById(UUID volcanoId);

    void deleteVolcanoById(UUID volcanoId);

}
