/**
 * Editor class
 */
class Editor {
  #content;
  #history = new History();

  get content() {
    return this.#content;
  }

  set content(content) {
    this.#content = content;
    this.#history.push(this.createState());
  }

  createState() {
    return new EditorState(this.#content);
  }

  restore() {
    const prevContent = this.#history.pop().content;
    this.#content = prevContent;
  }
}

/**
 * Editor state class
 */
class EditorState {
  #content;

  constructor(content) {
    this.#content = content;
  }

  get content() {
    return this.#content;
  }
}

/**
 * History class
 */
class History {
  #states = [];

  push(state) {
    this.#states.push(state);
  }

  pop() {
    return this.#states.pop();
  }
}

const editor = new Editor();

editor.content = 'hello';
editor.content = 'world';
editor.content = 'i am';
editor.content = 'bruce';

editor.restore();
console.log(editor.content);
editor.restore();
console.log(editor.content);
editor.restore();
console.log(editor.content);
editor.restore();
console.log(editor.content);
