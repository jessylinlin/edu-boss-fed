import request from '@/utils/request'

export const getRoles = () => {
  return request({
    method: 'GET',
    url: '/boss/role/all'
  })
}

export const createOrUpdateRole = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data
  })
}

export const getRoleById = (id: string | number) => {
  return request({
    method: 'GET',
    url: `/boss/role/${id}`
  })
}

export const deleteRole = (id: string | number) => {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}
export const allocUserRoles = (data:any) => {
  return request({
    method: 'POST',
    url: '/boss/role/allocateUserRoles',
    data
  })
}
export const getUserRoles = (userId: number | string) => {
  return request({
    method: 'GET',
    url: `/boss/role/user/${userId}`
  })
}
