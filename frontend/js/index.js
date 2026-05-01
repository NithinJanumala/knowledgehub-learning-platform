async function loadCourses(search = '', category = '') {
    const grid = document.getElementById('courses-grid');
    grid.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div></div>';
    
    try {
        let courses = staticCourses;
        if (search) {
            courses = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()));
        }
        if (category) {
            courses = courses.filter(c => c.category === category);
        }
        
        // Show only preview (max 4 courses) on home page
        const previewCourses = courses.slice(0, 4);

        if (previewCourses.length === 0) {
            grid.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted">No courses found.</p></div>';
            return;
        }

        grid.innerHTML = previewCourses.map(course => `
            <div class="col-md-6 col-lg-3">
                <div class="glass-card h-100 d-flex flex-column hover-lift">
                    <div class="card-img-wrapper" style="height: 160px; overflow: hidden;">
                        <img src="${course.image || 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}" class="course-thumbnail w-100 h-100" style="object-fit: cover;" alt="${course.title}">
                    </div>
                    <div class="p-4 d-flex flex-column flex-grow-1">
                        <span class="badge bg-secondary w-auto mb-2 align-self-start">${course.category || 'General'}</span>
                        <h3 class="h6 fw-bold mb-2">${course.title}</h3>
                        <p class="text-muted small flex-grow-1">${course.description ? course.description.substring(0, 80) + '...' : 'No description available.'}</p>
                        <a href="course.html?id=${course.id}" class="btn btn-outline-glass w-100 mt-3">View Details</a>
                    </div>
                </div>
            </div>
        `).join('');

        // Add View All button
        grid.innerHTML += `
            <div class="col-12 text-center mt-4">
                <a href="courses.html" class="btn btn-primary-gradient px-5 rounded-pill shadow-sm hover-lift">View All Courses <i class="bi bi-arrow-right ms-2"></i></a>
            </div>
        `;

    } catch (err) {
        grid.innerHTML = `<div class="col-12 text-center py-5 text-danger"><p>Error loading courses: ${err.message}</p></div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCourses();
});
