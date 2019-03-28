import { getManager } from 'typeorm'
import User from '@/models/typeorm/entities/user'

export default {
  get: async (id: number) => {
    const userRepository = getManager().getRepository(User)
    const user = await userRepository.findOne(id)
    if (!user) {
      throw Error('用户不存在')
    }
    return user
  },
}
