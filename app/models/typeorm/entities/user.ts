import { Column, Entity } from 'typeorm';
import { Model } from './';

@Entity()
export class User extends Model {

	@Column({
		comment: '名称',
	})
	name: string;
}
