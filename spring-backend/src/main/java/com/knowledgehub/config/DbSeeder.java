package com.knowledgehub.config;

import com.knowledgehub.model.Course;
import com.knowledgehub.model.Lesson;
import com.knowledgehub.repository.CourseRepository;
import com.knowledgehub.repository.LessonRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DbSeeder {

    @Bean
    CommandLineRunner initDatabase(CourseRepository courseRepository, LessonRepository lessonRepository) {
        return args -> {
            boolean hasHtml = false;
            boolean hasJava = false;
            boolean hasJs = false;
            boolean hasPython = false;
            
            for (Course course : courseRepository.findAll()) {
                if (course.getTitle().equals("HTML for Beginners")) {
                    hasHtml = true;
                } else if (course.getTitle().equals("Java Programming Basics")) {
                    hasJava = true;
                } else if (course.getTitle().equals("JavaScript for Beginners")) {
                    hasJs = true;
                } else if (course.getTitle().equals("Python Programming Basics")) {
                    hasPython = true;
                } else {
                    // Purge legacy/demo fake courses created in earlier stages
                    courseRepository.delete(course);
                }
            }
            
            if (!hasHtml) {
                Course htmlCourse = new Course();
                htmlCourse.setTitle("HTML for Beginners");
                htmlCourse.setCategory("Web Development");
                htmlCourse.setDescription("Learn the absolute basics of HTML5 and web structure.");
                htmlCourse.setThumbnail("https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80");
                htmlCourse.setVideoUrl("https://youtu.be/kUMe1FH4CHE");
                courseRepository.save(htmlCourse);
            }
            
            if (!hasJava) {
                Course javaCourse = new Course();
                javaCourse.setTitle("Java Programming Basics");
                javaCourse.setCategory("Programming");
                javaCourse.setDescription("Master the fundamentals of Java programming and object-oriented concepts.");
                javaCourse.setThumbnail("https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80");
                javaCourse.setVideoUrl("https://youtu.be/eIrMbAQSU34");
                courseRepository.save(javaCourse);
            }

            if (!hasJs) {
                Course jsCourse = new Course();
                jsCourse.setTitle("JavaScript for Beginners");
                jsCourse.setCategory("Web Development");
                jsCourse.setDescription("Learn JavaScript basics including variables, functions, DOM, and events.");
                jsCourse.setThumbnail("https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"); 
                jsCourse.setVideoUrl("https://youtu.be/PkZNo7MFNFg");
                Course savedJs = courseRepository.save(jsCourse);

                Lesson jsLesson1 = new Lesson();
                jsLesson1.setCourseId(savedJs.getId());
                jsLesson1.setTitle("Lesson 1: JavaScript Basics");
                jsLesson1.setContentUrl("https://youtu.be/PkZNo7MFNFg");
                jsLesson1.setOrderIndex(1);
                jsLesson1.setDayNumber(1);
                lessonRepository.save(jsLesson1);

                Lesson jsLesson2 = new Lesson();
                jsLesson2.setCourseId(savedJs.getId());
                jsLesson2.setTitle("Lesson 2: DOM Manipulation");
                jsLesson2.setContentUrl("https://youtu.be/PkZNo7MFNFg");
                jsLesson2.setOrderIndex(2);
                jsLesson2.setDayNumber(1);
                lessonRepository.save(jsLesson2);
            }

            if (!hasPython) {
                Course pyCourse = new Course();
                pyCourse.setTitle("Python Programming Basics");
                pyCourse.setCategory("Programming");
                pyCourse.setDescription("Learn Python fundamentals including syntax, loops, functions, and data structures.");
                pyCourse.setThumbnail("https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"); 
                pyCourse.setVideoUrl("https://youtu.be/_uQrJ0TkZlc");
                Course savedPy = courseRepository.save(pyCourse);

                Lesson pyLesson1 = new Lesson();
                pyLesson1.setCourseId(savedPy.getId());
                pyLesson1.setTitle("Lesson 1: Python Introduction");
                pyLesson1.setContentUrl("https://youtu.be/_uQrJ0TkZlc");
                pyLesson1.setOrderIndex(1);
                pyLesson1.setDayNumber(1);
                lessonRepository.save(pyLesson1);

                Lesson pyLesson2 = new Lesson();
                pyLesson2.setCourseId(savedPy.getId());
                pyLesson2.setTitle("Lesson 2: Python Functions & Loops");
                pyLesson2.setContentUrl("https://youtu.be/_uQrJ0TkZlc");
                pyLesson2.setOrderIndex(2);
                pyLesson2.setDayNumber(1);
                lessonRepository.save(pyLesson2);
            }
        };
    }
}
