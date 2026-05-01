package com.knowledgehub.controller;

import com.knowledgehub.model.Lesson;
import com.knowledgehub.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@SuppressWarnings("null")
public class LessonController {

    @Autowired
    private LessonRepository lessonRepository;

    @GetMapping("/course/{courseId}")
    public List<Lesson> getLessonsByCourse(@PathVariable Long courseId) {
        return lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
    }

    @PostMapping
    public ResponseEntity<?> createLesson(@RequestBody Lesson lesson) {
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        if (!isAdmin) {
            return ResponseEntity.status(403).body("Require Admin Role");
        }
        
        Lesson savedLesson = lessonRepository.save(lesson);
        return ResponseEntity.ok(savedLesson);
    }
}
