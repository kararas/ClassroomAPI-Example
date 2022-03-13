
/**
* コース一覧の取得
*/
function getCourseList() {

  // シート名を指定してスプレッドシートを取得
  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('Classroom Info');

  // シート内のコンテンツをクリア
  sheet.getDataRange().clear();

  // 1行目 - ヘッダー出力
  let line = [
    'role',
    'id',
    'name',
    'section',
    'description',
    'room',
    'ownerId',
  ];
  let range = sheet.getRange(2, 1, 1, line.length);
  range.setValues([line]);

  // 教師・学習者それぞれ取得
  const roles = ['teacher', 'student'];
  for (let roleIndex=0; roleIndex<roles.length; roleIndex++) {
    let param = {};
    // 自分が担当・所属するコースを指定
    param[`${roles[roleIndex]}Id`] = 'me';

    // コース一覧を取得
    let response = Classroom.Courses.list(param);

    if (response) {

      // レスポンスからコース一覧を取得
      let courses = response.courses;

      if (courses) {

        for (let courseIndex=0; courseIndex<courses.length; courseIndex++) {
          // 結果をシートに出力
          line = [
            roles[roleIndex],
            courses[courseIndex].id, // コースID
            courses[courseIndex].name, // コース名
            courses[courseIndex].section, // セクション
            courses[courseIndex].description, // 説明
            courses[courseIndex].room, // 教室
            courses[courseIndex].ownerId, // 担当教師（オーナー）
          ];
          range = sheet.getRange(3+courseIndex, 1, 1, line.length);
          range.setValues([line]);
        }

      }

    }
  }

}


/**
* コースの作成
*/
function createCourse() {

  // 作成するコース
  let newCourse = {
    'name': 'New Class 1', // コース名
    'section': 'section I', // セクション
    'description': 'This is a new course.', // 説明
    'room': 'Room A', // 教室
    'ownerId': 'me' // 担当教師（オーナー）
  };

  // コースを作成
  let createdCourse = Classroom.Courses.create (newCourse);

  // コースのIDを返却
  return createdCourse.id;

}


/*
* コース情報の更新
*/
function updateCourseInfo(newCourseId) {

  // コースの情報
  let updateCourse = {
    'name': 'New Class 2', // コース名
    'section': 'section II', // セクション
    'room': 'Room B', // 教室
  };

  // コースの情報を更新
  let updatedCourse = Classroom.Courses.update(updateCourse, newCourseId);

}


/**
* コースに課題を登録
*/
function createCourseWork(newCourseId) {

  // 課題の情報
  let newCourseWork = {
    'title': 'New CourseWork 1', // タイトル
    'description': 'This is a new coursework.', // 説明
    'maxPoints': 100, // 得点
    'workType': 'ASSIGNMENT', // タイプ
    'state': 'PUBLISHED', // 公開
  };

  //課題を作成
  let createdCourseWork = Classroom.Courses.CourseWork.create(newCourseWork, newCourseId);

  // 課題のIDを返却
  return createdCourseWork.id;

}

