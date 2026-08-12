package raf.rs.domaci3.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import raf.rs.domaci3.model.enums.Status;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "machine")
public class Machine {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String name;

    private Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "createdBy")
    @JsonIgnore
    private User user;

    private boolean active;

    private Date createdAt;

    private boolean operationActive;

    @Version
    @JsonIgnore
    private Long version;
}
