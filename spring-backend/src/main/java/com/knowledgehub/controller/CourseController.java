package com.knowledgehub.controller;

import com.knowledgehub.model.Course;
import com.knowledgehub.model.Lesson;
import com.knowledgehub.repository.CourseRepository;
import com.knowledgehub.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
@SuppressWarnings("null")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private LessonRepository lessonRepository;

    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable Long id) {
        Optional<Course> courseOpt = courseRepository.findById(id);
        if (courseOpt.isPresent()) {
            Course course = courseOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("id", course.getId());
            response.put("title", course.getTitle());
            response.put("description", course.getDescription());
            response.put("category", course.getCategory());
            response.put("thumbnail", course.getThumbnail());
            response.put("video_url", course.getVideoUrl());
            
            List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderIndexAsc(course.getId());
            response.put("lessons", lessons);
            
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody Course course) {
        // Simple role check based on granted authority
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        if (!isAdmin) {
            return ResponseEntity.status(403).body("Require Admin Role");
        }
        
        Course savedCourse = courseRepository.save(course);
        return ResponseEntity.ok(savedCourse);
    }
}
