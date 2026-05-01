let courseModalInstance;
let lessonModalInstance;

document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth();
    if (!user || user.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    courseModalInstance = new bootstrap.Modal(document.getElementById('courseModal'));
    lessonModalInstance = new bootstrap.Modal(document.getElementById('lessonModal'));

    loadAdminCourses();

    document.getElementById('course-form').addEventListener('submit', handleCourseSubmit);
    document.getElementById('lesson-form').addEventListener('submit', handleLessonSubmit);
});

async function loadAdminCourses() {
    const tbody = document.getElementById('admin-courses-tbody');
    try {
        const courses = await apiFetch('/courses');
        if (courses.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No courses available.</td></tr>';
            return;
        }

        tbody.innerHTML = courses.map(c => `
            <tr>
                <td>${c.id}</td>
                <td><img src="${c.thumbnail}" style="width: 50px; height: 35px; object-fit: cover;" class="rounded" alt="${c.title}"></td>
                <td class="fw-bold text-light">${c.title}</td>
                <td><span class="badge bg-secondary">${c.category || 'General'}</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-info me-1 border-0" onclick="prepareAddLesson(${c.id})">Add Lesson</button>
                    <button class="btn btn-sm btn-outline-warning me-1 border-0" onclick="prepareEditCourse(${c.id})">Edit</button>
                    <button class="btn btn-sm btn-outline-danger border-0" onclick="deleteCourse(${c.id})">Delete</button>
                </td>
            </tr>
        `).join('');

    } catch (err) {
        showAdminAlert(err.message);
    }
}

function showAdminAlert(msg, type = 'danger') {
    const alert = document.getElementById('admin-alert');
    alert.className = `alert alert-${type}`;
    alert.textContent = msg;
    alert.classList.remove('d-none');
    setTimeout(() => alert.classList.add('d-none'), 3000);
}

function prepareCreateCourse() {
    document.getElementById('course-form').reset();
    document.getElementById('course-id').value = '';
    document.getElementById('courseModalTitle').textContent = 'Create Course';
}

async function prepareEditCourse(id) {
    try {
        const course = await apiFetch(`/courses/${id}`);
        document.getElementById('course-id').value = course.id;
        document.getElementById('course-title').value = course.title;
        document.getElementById('course-desc').value = course.description;
        document.getElementById('course-category').value = course.category || 'General';
        document.getElementById('course-thumb').value = course.thumbnail || '';
        document.getElementById('courseModalTitle').textContent = 'Edit Course';
        courseModalInstance.show();
    } catch (err) {
        showAdminAlert('Error fetching course details');
    }
}

async function handleCourseSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('course-id').value;
    const title = document.getElementById('course-title').value;
    const description = document.getElementById('course-desc').value;
    const category = document.getElementById('course-category').value;
    const thumbnail = document.getElementById('course-thumb').value;

    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `/courses/${id}` : '/courses';

    try {
        await apiFetch(endpoint, {
            method,
            body: JSON.stringify({ title, description, category, thumbnail })
        });
        courseModalInstance.hide();
        showAdminAlert(`Course ${id ? 'updated' : 'created'} successfully!`, 'success');
        loadAdminCourses();
    } catch (err) {
        alert(err.message);
    }
}

async function deleteCourse(id) {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
        await apiFetch(`/courses/${id}`, { method: 'DELETE' });
        showAdminAlert('Course deleted.', 'success');
        loadAdminCourses();
    } catch (err) {
        showAdminAlert(err.message);
    }
}

function prepareAddLesson(courseId) {
    document.getElementById('lesson-form').reset();
    document.getElementById('lesson-course-id').value = courseId;
    lessonModalInstance.show();
}

async function handleLessonSubmit(e) {
    e.preventDefault();
    const course_id = document.getElementById('lesson-course-id').value;
    const title = document.getElementById('lesson-title').value;
    const content_url = document.getElementById('lesson-content-url').value;
    const order_index = document.getElementById('lesson-order').value;
    const day_number = document.getElementById('lesson-day').value;

    try {
        await apiFetch('/lessons', {
            method: 'POST',
            body: JSON.stringify({ course_id, title, content_url, order_index, day_number })
        });
        lessonModalInstance.hide();
        showAdminAlert('Lesson added successfully!', 'success');
    } catch (err) {
        alert(err.message);
    }
}
