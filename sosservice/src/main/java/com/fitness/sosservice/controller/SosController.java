package com.fitness.sosservice.controller;

import com.fitness.sosservice.dto.EmergencyContactRequest;
import com.fitness.sosservice.dto.HospitalDto;
import com.fitness.sosservice.dto.SosTriggerRequest;
import com.fitness.sosservice.entity.EmergencyContact;
import com.fitness.sosservice.entity.SosAlert;
import com.fitness.sosservice.service.SosService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sos")
@RequiredArgsConstructor
public class SosController {

    private final SosService sosService;

    // ── Emergency Contact CRUD ─────────────────────────────────────────────────

    @PostMapping("/emergency-contact")
    public ResponseEntity<EmergencyContact> addContact(@RequestBody EmergencyContactRequest req) {
        EmergencyContact contact = new EmergencyContact();
        contact.setUserId(req.getUserId());
        contact.setContactName(req.getContactName());
        contact.setContactEmail(req.getContactEmail());
        contact.setContactPhone(req.getContactPhone());
        return ResponseEntity.ok(sosService.saveEmergencyContact(contact));
    }

    @GetMapping("/emergency-contact/{userId}")
    public ResponseEntity<List<EmergencyContact>> getContacts(@PathVariable String userId) {
        return ResponseEntity.ok(sosService.getContactsByUser(userId));
    }

    // ── SOS Trigger ───────────────────────────────────────────────────────────

    /**
     * POST /api/sos/trigger
     * Body: { userId, latitude, longitude, locationUrl (optional) }
     * Header: X-User-Name: <name>   (or pull from JWT — see note below)
     */
    @PostMapping("/trigger")
    public ResponseEntity<Map<String, Object>> triggerSos(
            @RequestBody SosTriggerRequest request,
            @RequestHeader(value = "X-User-Name", defaultValue = "NeoCare Patient") String userName) {
        return ResponseEntity.ok(sosService.triggerSos(request, userName));
    }

    // ── Nearby Hospitals (standalone endpoint) ────────────────────────────────

    @GetMapping("/nearby-hospitals")
    public ResponseEntity<List<HospitalDto>> nearbyHospitals(
            @RequestParam double lat,
            @RequestParam double lng) {
        return ResponseEntity.ok(sosService.getNearbyHospitals(lat, lng));
    }

    // ── Alert History ─────────────────────────────────────────────────────────

    @GetMapping("/alerts/{userId}")
    public ResponseEntity<List<SosAlert>> getAlerts(@PathVariable String userId) {
        return ResponseEntity.ok(sosService.getUserAlerts(userId));
    }

    @PatchMapping("/alerts/{userId}/read")
    public ResponseEntity<Map<String, String>> markRead(@PathVariable String userId) {
        sosService.markAlertsRead(userId);
        return ResponseEntity.ok(Map.of("message", "Marked as read"));
    }
}
