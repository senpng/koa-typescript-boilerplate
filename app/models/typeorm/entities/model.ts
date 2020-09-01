import { Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

export abstract class Model extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column('timestamp', {
		name: 'created_at',
		precision: 6,
		default: () => 'CURRENT_TIMESTAMP(6)',
	})
	createdAt: Date;

	@Column('timestamp', {
		nullable: true,
		name: 'updated_at',
		precision: 6,
		onUpdate: 'CURRENT_TIMESTAMP(6)',
	})
	updatedAt?: Date;

	// @Column('timestamp', {
	//   nullable: true,
	//   name: 'deleted_at',
	//   precision: 6,
	// })
	// deletedAt?: Date

}
