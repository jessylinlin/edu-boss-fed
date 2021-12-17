import request from '@/utils/request'
export const getCourseList = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data
  })
}

export const changeCourseStates = (params:any) => {
  return request({
    method: 'GET',
    url: '/boss/course/changeState',
    params
  })
}

export const saveOrUpdateCourse = (data:any) => {
  return request({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data
  })
}

// 该接口要求的数据类型 multipart/form-data
// 需要提交FormData数据对象
export const fileUpload = (data: any, onUploadProgress?:(progressEvent: any) => void) => {
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    // html5新增的上传响应事件
    onUploadProgress
  })
}

export const getCourse = (courseId: string | number) => {
  return request({
    method: 'GET',
    url: '/boss/course/getCourseById',
    params: {
      courseId
    }
  })
}
