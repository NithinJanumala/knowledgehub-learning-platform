package com.knowledgehub.model;

import jakarta.persistence.*;

@Entity
@Table(name = "lessons")
public class Lesson {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "course_id", nullable = false)
    private Long courseId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(name = "content_url")
    private String contentUrl;
    
    @Column(name = "order_index")
    private Integer orderIndex;
    
    @Column(name = "day_number", columnDefinition = "INTEGER DEFAULT 1")
    private Integer dayNumber;

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getContentUrl() { return contentUrl; }
    public void setContentUrl(String contentUrl) { this.contentUrl = contentUrl; }
    
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    
    public Integer getDayNumber() { return dayNumber; }
    public void setDayNumber(Integer dayNumber) { this.dayNumber = dayNumber; }
}
