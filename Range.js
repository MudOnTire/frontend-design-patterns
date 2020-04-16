function Range(start, end) {
  return {
    [Symbol.iterator]: function () {
      return {
        next() {
          if (start < end) {
            return { value: start++, done: false };
          }
          return { done: true, value: end };
        }
      }
    }
  }
}

// function Range(start, end) {
//   return {
//     [Symbol.iterator]() { // #A
//       return this;
//     },
//     next() {
//       if (start < end) {
//         return { value: start++, done: false }; // #B
//       }
//       return { done: true, value: end }; // #B
//     }
//   }
// }

const range = Range(1, 5);
console.log(range.next());

// for (num of Range(1, 5)) {
//   console.log(num);
// }