package raf.rs.domaci3.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data
@Table(name = "error_message")
public class ErrorMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Date errorDate;

    private Long machineId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private User user;

    private String operationName;
    private String errorMessage;

    public ErrorMessage(Date errorDate, Long machineId, User user, String operationName, String errorMessage) {
        this.errorDate = errorDate;
        this.machineId = machineId;
        this.user = user;
        this.operationName = operationName;
        this.errorMessage = errorMessage;
    }

    public ErrorMessage() { }
}
