package com.fitness.sosservice.service;

import com.fitness.sosservice.dao.EmergencyContactRepository;
import com.fitness.sosservice.dao.SosAlertRepository;
import com.fitness.sosservice.dto.HospitalDto;
import com.fitness.sosservice.dto.SosTriggerRequest;
import com.fitness.sosservice.entity.EmergencyContact;
import com.fitness.sosservice.entity.SosAlert;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SosService {

    private final EmergencyContactRepository emergencyContactRepo;
    private final SosAlertRepository sosAlertRepo;
    private final JavaMailSender mailSender;
    private final RestTemplate restTemplate;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${google.places.api-key}")
    private String googleApiKey;

    // ─── Save / Update Emergency Contact ───────────────────────────────────────

    public EmergencyContact saveEmergencyContact(EmergencyContact contact) {
        return emergencyContactRepo.save(contact);
    }

    public List<EmergencyContact> getContactsByUser(String userId) {
        return emergencyContactRepo.findByUserId(userId);
    }

    // ─── Trigger SOS ───────────────────────────────────────────────────────────

    public Map<String, Object> triggerSos(SosTriggerRequest request, String userName) {
        String userId = request.getUserId();

        // 1. Persist internal alert
        SosAlert alert = new SosAlert();
        alert.setUserId(userId);
        alert.setTitle("🚨 SOS ALERT TRIGGERED");
        alert.setMessage("Emergency contacts alerted. Lat: " + request.getLatitude()
                + ", Lng: " + request.getLongitude());
        alert.setType("emergency");
        sosAlertRepo.save(alert);

        // 2. Email all emergency contacts
        List<EmergencyContact> contacts = emergencyContactRepo.findByUserId(userId);
        for (EmergencyContact contact : contacts) {
            sendEmergencyEmail(contact, request, userName);
        }

        // 3. Fetch nearby hospitals
        List<HospitalDto> hospitals = getNearbyHospitals(
                request.getLatitude(), request.getLongitude()
        );

        return Map.of(
                "message", "SOS dispatched successfully",
                "alertId", alert.getId(),
                "emailsSent", contacts.size(),
                "nearbyHospitals", hospitals
        );
    }

    // ─── Email Logic ───────────────────────────────────────────────────────────

    private void sendEmergencyEmail(EmergencyContact contact,
                                    SosTriggerRequest req,
                                    String userName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("\"NeoCare Emergency\" <" + fromEmail + ">");
            helper.setTo(contact.getContactEmail());
            helper.setSubject("🚨 URGENT: Emergency SOS from " + userName);

            String mapsUrl = req.getLocationUrl() != null
                    ? req.getLocationUrl()
                    : "https://www.google.com/maps?q=" + req.getLatitude() + "," + req.getLongitude();

            String html = """
                <div style="font-family:sans-serif;border:3px solid red;padding:20px;border-radius:8px;">
                  <h1 style="color:red;">🚨 Emergency Alert</h1>
                  <p>Dear <strong>%s</strong>,</p>
                  <p><strong>%s</strong> has triggered an SOS on the NeoCare platform.</p>
                  <p><strong>Live Location:</strong>
                     <a href="%s" style="color:red;">Click to View on Google Maps</a>
                  </p>
                  <p style="background:#fff5f5;padding:10px;border-radius:6px;
                             font-weight:bold;color:#d32f2f;">
                    Please check on them immediately or contact emergency services.
                  </p>
                  <hr/>
                  <small style="color:#888;">Sent by NeoCare Emergency System</small>
                </div>
                """.formatted(contact.getContactName(), userName, mapsUrl);

            helper.setText(html, true);
            mailSender.send(message);
            log.info("SOS email sent to {}", contact.getContactEmail());

        } catch (Exception e) {
            log.error("Failed to send SOS email to {}: {}", contact.getContactEmail(), e.getMessage());
        }
    }

    // ─── Google Places — Nearby Hospitals ──────────────────────────────────────

    @SuppressWarnings("unchecked")
    public List<HospitalDto> getNearbyHospitals(double lat, double lng) {
        String url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
                + "?location=" + lat + "," + lng
                + "&radius=5000"
                + "&type=hospital"
                + "&key=" + googleApiKey;

        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            List<Map<String, Object>> results =
                    (List<Map<String, Object>>) response.get("results");

            List<HospitalDto> hospitals = new ArrayList<>();
            if (results == null) return hospitals;

            for (Map<String, Object> place : results) {
                HospitalDto h = new HospitalDto();
                h.setName((String) place.get("name"));
                h.setAddress((String) place.getOrDefault("vicinity", "N/A"));

                Map<String, Object> geometry = (Map<String, Object>) place.get("geometry");
                Map<String, Object> location  = (Map<String, Object>) geometry.get("location");
                double pLat = ((Number) location.get("lat")).doubleValue();
                double pLng = ((Number) location.get("lng")).doubleValue();
                h.setLatitude(pLat);
                h.setLongitude(pLng);
                h.setDistanceKm(haversineKm(lat, lng, pLat, pLng));
                h.setGoogleMapsUrl("https://www.google.com/maps/search/?api=1&query="
                        + pLat + "," + pLng);
                hospitals.add(h);
            }

            hospitals.sort((a, b) -> Double.compare(a.getDistanceKm(), b.getDistanceKm()));
            return hospitals.subList(0, Math.min(5, hospitals.size()));  // top 5

        } catch (Exception e) {
            log.error("Google Places API error: {}", e.getMessage());
            return List.of();
        }
    }

    // Haversine formula — straight-line km between two coords
    private double haversineKm(double lat1, double lng1, double lat2, double lng2) {
        final double R = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // ─── Alerts ────────────────────────────────────────────────────────────────

    public List<SosAlert> getUserAlerts(String userId) {
        return sosAlertRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void markAlertsRead(String userId) {
        List<SosAlert> alerts = sosAlertRepo.findByUserIdOrderByCreatedAtDesc(userId);
        alerts.forEach(a -> a.setRead(true));
        sosAlertRepo.saveAll(alerts);
    }
}
