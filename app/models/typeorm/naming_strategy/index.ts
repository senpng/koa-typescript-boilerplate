import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

export class SnakeCaseNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
	columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
		return snakeCase(embeddedPrefixes.concat(customName ? customName : propertyName).join('_'));
	}

	joinColumnName(relationName: string, referencedColumnName: string): string {
		return snakeCase(relationName + '_' + referencedColumnName);
	}
}
