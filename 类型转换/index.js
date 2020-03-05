const obj = {
  toString() {
    return 'abc'
  },
  valueOf() {
    return {}
  },
}

const res = obj + 2
console.log(res,'res') 
