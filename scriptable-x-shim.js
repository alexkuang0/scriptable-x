function x(name, props, children) {
  if (typeof name === 'function') {
    return name()
  }
  
  return {
    name,
    props,
    children
  }
}

function render(tree) {
  console.log(tree)
}

export { x, render }
