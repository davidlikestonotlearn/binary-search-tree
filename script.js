class Node {
  constructor(data) {
    this.data = data
    this.left = null
    this.right = null
  }
}

class Tree {
  constructor(array) {
    // Removes duplicates - turned into an array
    // Also sorted by smallest to greatest
    const cleaned = [...new Set(array)].sort((a, b) => a - b)
    this.root = this.buildTree(cleaned) // Top node that buildTree returns
  }

  buildTree(array) {
    if (array.length === 0) return null

    const mid = Math.floor(array.length / 2)
    const root = array[mid]
    const left = array.slice(0, mid)
    const right = array.slice(mid + 1) // + 1 skips the middle num
    const node = new Node(root)
    node.left = this.buildTree(left)
    node.right = this.buildTree(right)

    return node
  }

  includes(value) {
    let current = this.root

    while (current !== null) { // Checks if the node is null
        if (current.data === value) return true

        if (current.data > value) {
            current = current.left
        } else {
            current = current.right
        }
    }
    return false
  }

  insert(value) {
    if (this.root === null) { // If empty root, add a new root
        this.root = new Node(value)
        return
    }

    let current = this.root
    let parent = null

    while (current !== null) {
        if (value === current.data) return // Return duplicates

        parent = current // Remembers where you were
        if (value < current.data) {
            current = current.left
        } else {
            current = current.right
        }
    }

    // Parent is the node parent of the left or right
    // After loop, current finds the empty null which we can create a new node
    if (value < parent.data) {
        parent.left = new Node(value)
    } else {
        parent.right = new Node(value)
    }
  }

  deleteItem(value) {
    this.root = this.deleteNode(this.root, value)
  }

  deleteNode(node, value) {
    if (node === null) return null // Returns if the node value isn't in the tree

    if (value < node.data) {
        node.left = this.deleteNode(node.left, value) // Recursion to find the value
        return node
    } else if (value > node.data) {
        node.right = this.deleteNode(node.right, value)
        return node
    }

    // Finally we get the node to delete
    // If they only have 1 child, return it.
    if (node.left === null) {
        return node.right
    } else if (node.right === null) {
        return node.left
    }

    // Otherwise they must have 2 children
    let smallestNode = node.right
    while (smallestNode.left !== null) { // Left of the node on the right
        smallestNode = smallestNode.left // Keeps going left
    }

    node.data = smallestNode.data // Copying its value
    node.right = this.deleteNode(node.right, smallestNode.data) // Removes old copy
    return node
  }

  levelOrderForEach(callback) {
    if (typeof callback !== "function") {
        throw new Error("A callback is required")
    }

    if (this.root === null) return

    const queue = [this.root]

    while (queue.length > 0) {
        const current = queue.shift() // Grabs first node, which is node 8
        callback(current.data) // Callback on the number

        if (current.left) queue.push(current.left)
        if (current.right) queue.push(current.right)
    }
  }

  inOrderForEach(callback) {
    if (typeof callback !== "function") {
        throw new Error("A callback is required")
    }

    // helper that takes a node
    const visit = (node) => {
        if (node === null) return

        // Recursion goes all to the left
        visit(node.left) // Node becomes the smallest node
        callback(node.data) // Calls node data
        visit(node.right) // Smallest node doesn't have a right, returns
    }

    visit(this.root)
  }

  preOrderForEach(callback) {
    if (typeof callback !== "function") {
        throw new Error("A callback is required")
    }

    const visit = (node) => {
        if (node === null) return

        callback(node.data) // Node first
        visit(node.left)
        visit(node.right)
    }

    visit(this.root)
  }

  postOrderForEach(callback) {
    if (typeof callback !== "function") {
        throw new Error("A callback is required")
    }

    const visit = (node) => {
        if (node === null) return

        visit(node.left)
        visit(node.right)
        callback(node.data) // Node last
    }

    visit(this.root)
  }

  depth(value) {
    let current = this.root
    let edges = 0

    while (current !== null) {
        if (value === current.data) return edges

        if (value < current.data) {
            current = current.left
        } else {
            current = current.right
        }
        edges++ // Moved down one level
    }

    return undefined // Value isn't in the tree
  }

  height(value) {
    let current = this.root

    // Walk down to find the node
    while (current !== null) {
        if (value === current.data) return this.nodeHeight(current)

        if (value < current.data) {
            current = current.left
        } else {
            current = current.right
        }
    }

    return undefined // Value isn't in the tree
  }

  nodeHeight(node) {
    if (node === null) return -1 // So a leaf comes out as 0

    const leftHeight = this.nodeHeight(node.left)
    const rightHeight = this.nodeHeight(node.right)

    return 1 + Math.max(leftHeight, rightHeight)
  }

  isBalanced() {
    const check = (node) => {
        if (node === null) return true

        // Height difference at THIS node
        const diff = Math.abs(this.nodeHeight(node.left) - this.nodeHeight(node.right))
        if (diff > 1) return false

        // Every node below must be balanced too
        return check(node.left) && check(node.right)
    }

    return check(this.root)
  }

  rebalance() {
    // Collect all values in sorted order (in order gives low to high)
    const values = []
    this.inOrderForEach(value => values.push(value))

    // Rebuild from the sorted array. It's already sorted with no duplicates
    this.root = this.buildTree(values)
  }
}

const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null || node === undefined) {
    return;
  }

  prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
}

// ---------- Driver script ----------

// Makes an array of random numbers less than 100
const randomArray = (size) => {
    const arr = []
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * 100))
    }
    return arr
}

// Prints all four traversals
const printAll = (tree) => {
    const level = []
    const pre = []
    const post = []
    const inOrder = []

    tree.levelOrderForEach(v => level.push(v))
    tree.preOrderForEach(v => pre.push(v))
    tree.postOrderForEach(v => post.push(v))
    tree.inOrderForEach(v => inOrder.push(v))

    console.log("Level order:", level)
    console.log("Pre order:  ", pre)
    console.log("Post order: ", post)
    console.log("In order:   ", inOrder)
}

// 1. Build the tree from random numbers
const tree = new Tree(randomArray(15))
prettyPrint(tree.root)

// 2. Confirm it's balanced
console.log("Balanced?", tree.isBalanced())

// 3. Print all traversals
printAll(tree)

// 4. Unbalance it with numbers over 100
tree.insert(101)
tree.insert(102)
tree.insert(103)
tree.insert(104)
tree.insert(105)
prettyPrint(tree.root)

// 5. Confirm it's unbalanced
console.log("Balanced?", tree.isBalanced())

// 6. Rebalance
tree.rebalance()

// 7. Confirm it's balanced again
console.log("Balanced?", tree.isBalanced())
prettyPrint(tree.root)

// 8. Print all traversals again
printAll(tree)