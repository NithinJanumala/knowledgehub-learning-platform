package com.knowledgehub.controller;

import com.knowledgehub.model.Enrollment;
import com.knowledgehub.repository.CourseRepository;
import com.knowledgehub.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/enrollments")
@SuppressWarnings("null")
public class EnrollmentController {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    private Long getCurrentUserId() {
        Object credentials = SecurityContextHolder.getContext().getAuthentication().getCredentials();
        if (credentials instanceof Long) {
            return (Long) credentials;
        }
        return null;
    }

    @GetMapping("/my-courses")
    public ResponseEntity<?> getUserEnrollments() {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        
        List<Enrollment> enrollments = enrollmentRepository.findByUserId(userId);
        List<Map<String, Object>> responseList = new ArrayList<>();
        
        for (Enrollment e : enrollments) {
            courseRepository.findById(e.getCourseId()).ifPresent(course -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", course.getId());
                map.put("title", course.getTitle());
                map.put("thumbnail", course.getThumbnail());
                map.put("category", course.getCategory());
                map.put("progress", e.getProgress());
                responseList.add(map);
            });
        }
        
        return ResponseEntity.ok(responseList);
    }

    @PostMapping
    public ResponseEntity<?> enrollInCourse(@RequestBody Map<String, Object> request) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        
        Object courseIdObj = request.get("course_id");
        if (courseIdObj == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "course_id is required"));
        }
        
        Long courseId;
        try {
            courseId = Long.valueOf(courseIdObj.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid course_id format"));
        }
        
        Optional<Enrollment> existing = enrollmentRepository.findByUserIdAndCourseId(userId, courseId);
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Already enrolled in this course"));
        }
        
        Enrollment enrollment = new Enrollment();
        enrollment.setUserId(userId);
        enrollment.setCourseId(courseId);
        enrollment.setProgress(0);
        
        Enrollment saved = enrollmentRepository.save(enrollment);
        return ResponseEntity.ok(saved);
    }
}
