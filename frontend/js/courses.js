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
        
        if (courses.length === 0) {
            grid.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted">No courses found matching your criteria.</p></div>';
            return;
        }

        grid.innerHTML = courses.map(course => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="glass-card h-100 d-flex flex-column hover-lift course-card position-relative overflow-hidden" style="border-radius: 16px;">
                    <span class="course-badge">${course.category || 'General'}</span>
                    <div class="card-img-wrapper position-relative" style="height: 200px; overflow: hidden;">
                        <div class="position-absolute w-100 h-100 top-0 start-0" style="background: linear-gradient(to bottom, transparent 40%, rgba(11,15,26,0.9) 100%); z-index: 1;"></div>
                        <img src="${course.image || 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}" class="course-thumbnail w-100 h-100" style="object-fit: cover;" alt="${course.title}">
                    </div>
                    <div class="p-4 d-flex flex-column flex-grow-1 position-relative z-2" style="margin-top: -30px;">
                        <h3 class="h5 fw-bold mb-2 text-light" style="letter-spacing: -0.5px;">${course.title}</h3>
                        <p class="text-muted small flex-grow-1 mb-4" style="line-height: 1.6;">${course.description ? course.description.substring(0, 100) + '...' : 'No description available.'}</p>
                        <a href="course.html?id=${course.id}" class="btn btn-primary-gradient w-100 py-2 fw-bold d-flex justify-content-between align-items-center">
                            Explore Course <i class="bi bi-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (err) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="glass-card p-5 d-inline-block border-danger border-opacity-25">
                    <i class="bi bi-exclamation-triangle text-danger" style="font-size: 3rem;"></i>
                    <h3 class="text-light mt-3">We couldn't load your data right now</h3>
                    <p class="text-muted mb-4">There seems to be a connection issue. Please try again.</p>
                    <button class="btn btn-outline-glass px-4" onclick="loadCourses()">
                        <i class="bi bi-arrow-clockwise me-2"></i>Retry
                    </button>
                </div>
            </div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCourses();

    document.getElementById('search-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const search = document.getElementById('search-input').value;
        const category = document.getElementById('category-filter').value;
        loadCourses(search, category);
    });
});
