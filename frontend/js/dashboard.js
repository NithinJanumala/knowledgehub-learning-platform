document.addEventListener('DOMContentLoaded', async () => {

    // 🔐 Auth check
    const user = checkAuth();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // 📦 Get elements
    const grid = document.getElementById('enrolled-courses-grid');
    const statsGrid = document.getElementById('dashboard-stats');
    const recGrid = document.getElementById('recommended-courses');
    const activityGrid = document.getElementById('recent-activity');

    // Show loading spinners initially
    const loadingSpinner = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
        </div>
    `;
    grid.innerHTML = loadingSpinner;
    statsGrid.innerHTML = loadingSpinner;

    try {
        const courses = staticCourses;
        
        if (!courses || courses.length === 0) throw new Error("No courses loaded");

        // 📊 Core Data Fetch
        const enrolledCoursesIds = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
        const videoProgress = JSON.parse(localStorage.getItem('courseProgress')) || {}; // seconds tracked
        const myCourses = courses.filter(c => enrolledCoursesIds.includes(parseInt(c.id)) || enrolledCoursesIds.includes(String(c.id)));

        // 🧠 Calculations
        let totalCourses = myCourses.length;
        let coursesStarted = 0;
        let completedCourses = 0;
        let sumProgress = 0;
        let totalWatchedSeconds = 0;
        let lastWatchedCourse = null;
        let maxWatchedTime = -1; // to find most recently watched by looking at highest progress value or we can use lastWatched timestamp

        // Learning Streak Logic
        let today = new Date().toDateString();
        let lastActive = localStorage.getItem('lastActiveDate');
        let streak = parseInt(localStorage.getItem('learningStreak') || '0');

        if (lastActive !== today) {
            if (lastActive) {
                let lastDate = new Date(lastActive);
                let current = new Date(today);
                let diffTime = Math.abs(current - lastDate);
                let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                
                if (diffDays === 1) {
                    streak += 1;
                } else if (diffDays > 1) {
                    streak = 1;
                }
            } else {
                streak = 1;
            }
            localStorage.setItem('lastActiveDate', today);
            localStorage.setItem('learningStreak', streak);
        }

        // Loop through enrolled to calculate real stats
        myCourses.forEach(course => {
            let pData = JSON.parse(localStorage.getItem('progress_' + course.id) || '[]');
            let totalLessons = course.lessons ? course.lessons.length : 1;
            let cProgress = Math.round((pData.length / totalLessons) * 100);
            
            let watchedSecs = videoProgress[course.id] || 0;
            totalWatchedSeconds += watchedSecs;

            if (cProgress > 0 || watchedSecs > 0) {
                coursesStarted++;
            }
            if (cProgress === 100) {
                completedCourses++;
            }
            sumProgress += cProgress;

            // Simple heuristic for "last watched": course with most recent activity or highest watch time. 
            // Since we didn't track timestamps before, we fallback to just taking the last active or first started.
            // If user explicitly asks for lastWatched, we should ideally track it. We'll use the one with most seconds watched for now if no lastWatched is set.
            let lw = localStorage.getItem('lastWatchedCourseId');
            if (lw && String(course.id) === lw) {
                lastWatchedCourse = course;
            } else if (!lastWatchedCourse && watchedSecs > maxWatchedTime) {
                maxWatchedTime = watchedSecs;
                lastWatchedCourse = course;
            }
        });

        let learningHours = (totalWatchedSeconds / 3600).toFixed(1);
        let progressPercent = totalCourses > 0 ? Math.round(sumProgress / totalCourses) : 0;

        // 📈 Render Top Stats
        const statsData = [
            { label: 'Total Courses', value: totalCourses, icon: 'bi-journal-bookmark' },
            { label: 'Completed', value: completedCourses, icon: 'bi-check-circle' },
            { label: 'Learning Hours', value: `${learningHours}h`, icon: 'bi-clock-history' },
            { label: 'Day Streak', value: `${streak} <i class="bi bi-fire text-warning ms-1"></i>`, icon: 'bi-calendar-check' }
        ];

        statsGrid.innerHTML = statsData.map(stat => `
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="glass-card p-4 text-center hover-lift h-100 d-flex flex-column justify-content-center align-items-center">
                    <i class="bi ${stat.icon} text-primary mb-2" style="font-size: 1.8rem;"></i>
                    <h3 class="fw-bold text-light mb-1">${stat.value}</h3>
                    <p class="text-muted small text-uppercase tracking-wide mb-0" style="letter-spacing: 1px;">${stat.label}</p>
                </div>
            </div>
        `).join('');

        // 📚 My Courses (Main Grid)
        if (myCourses.length > 0) {
            grid.innerHTML = myCourses.map(course => {
                let pData = JSON.parse(localStorage.getItem('progress_' + course.id) || '[]');
                let totalLessons = course.lessons ? course.lessons.length : 1;
                let cp = Math.round((pData.length / totalLessons) * 100);
                
                return `
                <div class="col-md-6 col-lg-6 mb-3">
                    <div class="glass-card h-100 hover-lift overflow-hidden d-flex flex-column">
                        <img src="${course.image}" class="course-thumbnail w-100" style="height: 180px; object-fit: cover;" alt="${course.title}"/>
                        <div class="p-4 flex-grow-1 d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h5 class="fw-bold text-light mb-0">${course.title}</h5>
                                ${cp === 100 ? '<i class="bi bi-check-circle-fill text-success fs-5"></i>' : ''}
                            </div>
                            <div class="progress mb-3 bg-dark border border-secondary border-opacity-25" style="height: 6px;">
                                <div class="progress-bar bg-primary" role="progressbar" style="width: ${cp}%"></div>
                            </div>
                            <p class="text-muted small mb-4 flex-grow-1">${course.description ? course.description.substring(0, 90) + '...' : 'No description available.'}</p>
                            <a href="course.html?id=${course.id}" class="btn btn-primary-gradient btn-sm w-100 mt-auto shadow-sm">
                                ${cp === 100 ? 'Review Course' : 'Continue Learning'} <i class="bi bi-play-circle ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>`;
            }).join('');
        } else {
            grid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="glass-card p-5 border border-secondary border-opacity-25 d-inline-block fade-in">
                        <i class="bi bi-rocket text-primary display-3 mb-3 d-block" style="filter: drop-shadow(0 0 15px rgba(250,204,21,0.4));"></i>
                        <h4 class="text-light fw-bold mb-2">Start your learning journey 🚀</h4>
                        <p class="text-muted mb-4">You haven't enrolled in any courses yet. Discover skills that matter.</p>
                        <a href="courses.html" class="btn btn-primary-gradient px-4 py-2 hover-lift fw-bold">Browse Courses</a>
                    </div>
                </div>
            `;
        }

        // ⭐ Recommended (Horizontal Scroll)
        recGrid.innerHTML = courses.filter(c => !enrolledCoursesIds.includes(String(c.id))).slice(0, 4).map(course => `
            <a href="course.html?id=${course.id}" class="text-decoration-none">
                <div class="glass-card hover-lift overflow-hidden" style="min-width: 240px; max-width: 260px; flex-shrink: 0;">
                    <img src="${course.image}" class="course-thumbnail w-100" style="height: 130px;" alt="${course.title}"/>
                    <div class="p-3">
                        <h6 class="fw-bold text-light mb-1 text-truncate">${course.title}</h6>
                        <small class="text-primary mt-1 d-block">Explore Course <i class="bi bi-arrow-right"></i></small>
                    </div>
                </div>
            </a>
        `).join('');

        // 🧠 Recent Activity & Resume Learning
        let activityHTML = '';
        
        if (lastWatchedCourse) {
            let pData = JSON.parse(localStorage.getItem('progress_' + lastWatchedCourse.id) || '[]');
            let totalLessons = lastWatchedCourse.lessons ? lastWatchedCourse.lessons.length : 1;
            let cp = Math.round((pData.length / totalLessons) * 100);

            activityHTML += `
                <div class="mb-4 pb-4 border-bottom border-secondary border-opacity-25">
                    <h6 class="text-muted small text-uppercase tracking-wide mb-3">Resume Learning</h6>
                    <div class="d-flex align-items-center mb-3">
                        <img src="${lastWatchedCourse.image}" class="rounded me-3" style="width: 60px; height: 60px; object-fit: cover;">
                        <div>
                            <h6 class="mb-1 text-light fw-bold text-truncate" style="max-width: 200px;">${lastWatchedCourse.title}</h6>
                            <small class="text-primary">Progress: ${cp}%</small>
                        </div>
                    </div>
                    <a href="course.html?id=${lastWatchedCourse.id}" class="btn btn-outline-glass btn-sm w-100">Resume Course <i class="bi bi-play-fill"></i></a>
                </div>
            `;
        }

        activityHTML += `
            <div class="d-flex align-items-center mb-3">
                <div class="bg-success bg-opacity-25 p-2 rounded-circle me-3">
                    <i class="bi bi-check-lg text-success"></i>
                </div>
                <div>
                    <h6 class="mb-0 text-light fw-bold">Courses Completed</h6>
                    <small class="text-muted">You've finished ${completedCourses} courses so far.</small>
                </div>
            </div>
            ${progressPercent > 0 ? `
            <div class="progress mt-4 bg-dark border border-secondary border-opacity-25" style="height: 8px;">
                <div class="progress-bar bg-primary" role="progressbar" style="width: ${progressPercent}%" aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <p class="text-end small text-muted mt-2 mb-0">${progressPercent}% Overall Completion</p>
            ` : ''}
        `;
        
        activityGrid.innerHTML = activityHTML;

    } catch (error) {
        console.error('Dashboard error:', error);

        statsGrid.innerHTML = `
            <div class="col-12">
                <div class="glass-card p-5 text-center border-danger border-opacity-25">
                    <i class="bi bi-exclamation-triangle text-danger mb-3 display-4"></i>
                    <h5 class="text-light fw-bold">We couldn't load your data right now</h5>
                    <p class="text-muted mb-4">Please try again later or check your connection.</p>
                    <button class="btn btn-outline-glass px-4" onclick="location.reload()">
                        <i class="bi bi-arrow-clockwise me-2"></i>Retry
                    </button>
                </div>
            </div>
        `;
        
        grid.innerHTML = '';
        recGrid.innerHTML = '';
        activityGrid.innerHTML = '';
    }

});