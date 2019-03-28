import { Column, Entity } from 'typeorm'
import Model from './model'

@Entity()
class User extends Model {

  @Column({
    comment: '名称',
  })
  name: string
}

export default User
