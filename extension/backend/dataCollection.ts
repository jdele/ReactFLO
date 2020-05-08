// Function to traverse the fiber dom
// Two arguments the initial node and an array
export const dummyName = (node, array) => {
  // Create an object that will represent a component
  // Object will contain 
}


export const childOrSibling = (node) => {
  const memoizedState = node.memoizedState ? node.memoizedState.memoizedState : null;
  const infoObject = {
    id: node._debugID,
    type: node.type,
    memoizedState,
    memoizedProps: node.memoizedProps,
    tag: node.tag,
  };
  if (node.child) infoObject.child = childOrSibling(node.child);
  if (node.sibling) infoObject.sibling = childOrSibling(node.sibling);

  return infoObject;
}

export const addToArray = (node) => {
  const childArray = addToArray(node.child);
  const siblingArray = addToArray(node.sibling);
  return [...childArray, ...siblingArray];
}