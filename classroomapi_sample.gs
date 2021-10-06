
function runExample() {
  // Create new course.
  let newCourseId = createCourse();

  // Update existing course info.
  updateCourseInfo(newCourseId);

  // Create course work (teacher).
  let newCourseWorkId = createCourseWork(newCourseId);

  // Submit course work (student).
  submitCourseWork(newCourseWorkId);
}


// Get course info.
function getCourseList() {
  // Course list sheet.
  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('Classroom Info');

  // Clear all contents.
  sheet.getDataRange().clear();

  // Write header line.
  let line = [
    'role',
    'id',
    'name',
    'description',
    'ownerId',
    'section',
    'room',
  ];
  let range = sheet.getRange(2, 1, 1, line.length);
  range.setValues([line]);

  const roles = ['teacher', 'student'];
  for (let roleIndex=0; roleIndex<roles.length; roleIndex++) {
    // Retrieve class list.
    let param = {};
    param[`${roles[roleIndex]}Id`] = 'me';
    let response = Classroom.Courses.list(param);
    if (response) {
      let courses = response.courses;
      if (courses) {
        for (let courseIndex=0; courseIndex<courses.length; courseIndex++) {
          // Write to Spreadsheet.
          line = [
            roles[roleIndex],
            courses[courseIndex].id,
            courses[courseIndex].name,
            courses[courseIndex].description,
            courses[courseIndex].ownerId,
            courses[courseIndex].section,
            courses[courseIndex].room,
          ];
          range = sheet.getRange(3+courseIndex, 1, 1, line.length);
          range.setValues([line]);
        }
      }
    }
  }
}


// Create new course.
function createCourse() {
  // Course param.
  let newCourse = {
    'name': 'New Class 1',
    'section': 'section I',
    'description': 'This is a new course.',
    'room': 'Room A',
    'ownerId': 'me'
  };

  // Add new course to classroom.
  let createdCourse = Classroom.Courses.create (newCourse);

  return createdCourse.id;
}


// Update existing course info.
function updateCourseInfo(newCourseId) {
  // Course param.
  let updateCourse = {
    'name': 'New Class 2',
    'section': 'section II',
    'room': 'Room B',
  };

  let updatedCourse = Classroom.Courses.update(updateCourse, newCourseId);
}


// Create course work (teacher).
function createCourseWork(newCourseId) {
  // Course work.
  let newCourseWork = {
    'title': 'New CourseWork 1',
    'description': 'This is a new coursework.',
    'maxPoints': 100,
    'workType': 'ASSIGNMENT',
    'state': 'PUBLISHED',
  };

  // Add new course work to the course.
  let createdCourseWork = Classroom.Courses.CourseWork.create(newCourseWork, newCourseId);

  return createdCourseWork.id;
}


// Submit course work (student).
function submitCourseWork(newCourseWorkId) {
  // ...
}
