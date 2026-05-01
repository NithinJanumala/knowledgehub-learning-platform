package com.knowledgehub.controller;

import com.knowledgehub.model.Course;
import com.knowledgehub.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private CourseRepository courseRepository;

    @PostMapping("/course")
    public ResponseEntity<Course> addCourse(@RequestBody @org.springframework.lang.NonNull Course course) {
        Course savedCourse = courseRepository.save(course);
        return ResponseEntity.ok(savedCourse);
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        return ResponseEntity.ok(courses);
    }

    @DeleteMapping("/course/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable @org.springframework.lang.NonNull Long id) {
        if (courseRepository.existsById(id)) {
            courseRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
