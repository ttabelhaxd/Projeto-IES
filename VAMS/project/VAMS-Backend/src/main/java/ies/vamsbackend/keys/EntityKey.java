package ies.vamsbackend.keys;

import static org.springframework.data.cassandra.core.cql.PrimaryKeyType.CLUSTERED;
import static org.springframework.data.cassandra.core.cql.PrimaryKeyType.PARTITIONED;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.cassandra.core.mapping.PrimaryKeyClass;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@PrimaryKeyClass
public class EntityKey implements Serializable {

  @PrimaryKeyColumn(name = "volcano_id", type = PARTITIONED)
  @JsonProperty("volcanoId")
  private UUID volcanoId;

  @PrimaryKeyColumn(name = "timestamp", type = CLUSTERED)
  @JsonProperty("timestamp")
  private LocalDateTime timestamp;

}
