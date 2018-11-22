export enum Cardinal { // The four cardinal compass directions
	N = 0,
	E = 2,
	S = 4,
	W = 6,
} 

export enum Diagonal { // The four diagonal directions
	NE = 1,
	SE = 3,
	SW = 5,
	NW = 7
}

export type Direction = Cardinal | Diagonal; // Full set of eight directions
