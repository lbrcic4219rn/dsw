package raf.rs.domaci3.responses;

import lombok.Data;

import java.util.HashMap;

@Data
public class ResponseObject {
    private String status;
    private HashMap<String, Object> data;
}
