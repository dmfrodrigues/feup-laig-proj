STACK_SIZE = 100;

class Stack {
    constructor(){
        this._stack = new Array(STACK_SIZE);
        this._idxLastElement = -1;
    }
    push(value){
        this._stack[++this._idxLastElement] = value;
    }
    pop(){
        return this._stack[this._idxLastElement--];
    }
    top(){
        return this._stack[this._idxLastElement];
    }
    size(){
        return this._idxLastElement+1;
    }
}
