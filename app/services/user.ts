import User from '@/models/typeorm/entities/user'

export default {
  get: async (id: number) => {
    const user = await User.findOne(id)
    if (!user) {
      throw Error('用户不存在')
    }
    return user
  },
}
