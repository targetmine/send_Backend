export interface Attribute{
	name: string;
	type: 'varchar(40)' | 'text' | 'integer' | 'double precision';
	unique: boolean;
}

export interface Element{
	name: string;
	attributes: Attribute[];
}

export interface Relation{
	name: string;
	srcElement: string;
	srcAttribute: string;
	trgElement: string;
	trgAttribute: string;
	cardinality: 'one to one' | 'one to many' | 'many to many';
}

export function toStringArray(foo: any): string[]|undefined{
	if (!Array.isArray(foo)) return undefined;
	let s: string[] = [];
	foo.forEach(_ => {
		if (typeof _ !== 'string') return undefined;
		s.push(_ as string);
	})
	return s;
}