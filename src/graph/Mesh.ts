export abstract class Mesh extends Node {

    constructor() {
        super();
    }

    abstract draw(): void;
}