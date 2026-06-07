/************
* CONSTANTS *
************/

// Default node references.
const EMPTY_NODE_REFERENCE = null;

// Node generated class names.
const EMPTY_LIST_CLASS = "w-full mt-4 text-center text-sm font-semibold";
const NODE_WRAPPER_CLASS = "grid shrink-0 justify-items-center gap-2";
const NODE_POSITION_CLASS = "min-w-7 h-6 px-2 inline-flex justify-center items-center text-xs font-extrabold text-slate-500 rounded-full border border-slate-300 bg-white";
const NODE_CONTAINER_CLASS = "grid grid-cols-[70px_minmax(80px,auto)_70px] overflow-hidden rounded-xl border-2 border-slate-700 bg-white shadow-lg shadow-slate-900/10";
const PREVIOUS_CONTAINER_CLASS = "min-h-12 px-3 flex justify-center items-center text-sm font-extrabold whitespace-nowrap border-r border-slate-300 text-green-600 bg-green-50";
const VALUE_CONTAINER_CLASS = "min-h-12 px-3 flex justify-center items-center text-sm font-extrabold whitespace-nowrap border-r border-slate-300 text-slate-900 bg-white";
const NEXT_CONTAINER_CLASS = "min-h-12 px-3 flex justify-center items-center text-sm font-extrabold whitespace-nowrap text-red-600 bg-red-50";

// Arrow generated class names.
const ARROWS_CONTAINER_CLASS = "w-18 min-w-18 h-20 mt-8 flex shrink-0 flex-col justify-center gap-1";
const ARROW_WRAPPER_CLASS = "relative flex items-center w-full h-3";
const NEXT_ARROW_LINE_CLASS = "w-full h-0.5 bg-red-600";
const NEXT_ARROW_HEAD_CLASS = "absolute right-0 w-0 h-0 border-y-[5px] border-y-transparent border-l-[9px] border-l-red-600";
const PREVIOUS_ARROW_LINE_CLASS = "w-full h-0.5 bg-green-600";
const PREVIOUS_ARROW_HEAD_CLASS = "absolute left-0 w-0 h-0 border-y-[5px] border-y-transparent border-r-[9px] border-r-green-600";


/********
* STATE *
********/

// Doubly linked list data.
let nodes = [];

// Counter used to generate unique node names.
let nodeCounter = 0;


/***************
* DOM ELEMENTS *
***************/

// Input fields.
const valueInput = document.getElementById("value-input");
const positionInput = document.getElementById("position-input");

// Main controls.
const addBeginningButton = document.getElementById("add-beginning-button");
const addEndButton = document.getElementById("add-end-button");
const addPositionButton = document.getElementById("add-position-button");
const deletePositionButton = document.getElementById("delete-position-button");
const resetButton = document.getElementById("reset-button");
const copyCodeButton = document.getElementById("copy-code-button");

// Output areas.
const listViewer = document.getElementById("list-viewer");
const listInfo = document.getElementById("list-info");
const codeDisplay = document.getElementById("code-display");


/***********************
* NODE ACTION BEHAVIOR *
***********************/

// Adds a new node at the beginning of the list.
function addAtBeginning() {
  const nodeValue = getNodeValue();

  if (nodeValue === "") {
    return;
  }

  const newNode = createNode(nodeValue);

  if (nodes.length > 0) {
    newNode.next = nodes[0].name;
    nodes[0].prev = newNode.name;
  }

  nodes.unshift(newNode);

  refreshApplication();
  clearInputs();
}

// Adds a new node at the end of the list.
function addAtEnd() {
  const nodeValue = getNodeValue();

  if (nodeValue === "") {
    return;
  }

  const newNode = createNode(nodeValue);

  if (nodes.length > 0) {
    const lastNode = nodes[nodes.length - 1];

    newNode.prev = lastNode.name;
    lastNode.next = newNode.name;
  }

  nodes.push(newNode);

  refreshApplication();
  clearInputs();
}

// Adds a new node at the requested position.
function addAtPosition() {
  const nodeValue = getNodeValue();
  const nodePosition = getNodePosition();

  if (nodeValue === "") {
    return;
  }

  if (nodePosition === null) {
    return;
  }

  if (nodePosition < 0 || nodePosition > nodes.length) {
    return;
  }

  if (nodePosition === 0) {
    addAtBeginning();
    return;
  }

  if (nodePosition === nodes.length) {
    addAtEnd();
    return;
  }

  const newNode = createNode(nodeValue);
  const previousNode = nodes[nodePosition - 1];
  const nextNode = nodes[nodePosition];

  newNode.prev = previousNode.name;
  newNode.next = nextNode.name;

  previousNode.next = newNode.name;
  nextNode.prev = newNode.name;

  nodes.splice(nodePosition, 0, newNode);

  refreshApplication();
  clearInputs();
}

// Deletes the node at the requested position.
function deleteAtPosition() {
  const nodePosition = getNodePosition();

  if (nodePosition === null) {
    return;
  }

  if (nodePosition < 0 || nodePosition >= nodes.length) {
    return;
  }

  const nodeToDelete = nodes[nodePosition];

  if (nodeToDelete.prev !== null) {
    const previousNode = findNodeByName(nodeToDelete.prev);

    if (previousNode !== null) {
      previousNode.next = nodeToDelete.next;
    }
  }

  if (nodeToDelete.next !== null) {
    const nextNode = findNodeByName(nodeToDelete.next);

    if (nextNode !== null) {
      nextNode.prev = nodeToDelete.prev;
    }
  }

  nodes.splice(nodePosition, 1);

  refreshApplication();
  clearInputs();
}

// Resets the list and the node counter.
function resetList() {
  nodes = [];
  nodeCounter = 0;

  refreshApplication();
  clearInputs();
}


/**********************
* NODE DATA BEHAVIOR *
**********************/

// Creates a new node object.
function createNode(nodeValue) {
  const newNode = {
    name: generateNodeName(),
    data: nodeValue,
    prev: EMPTY_NODE_REFERENCE,
    next: EMPTY_NODE_REFERENCE
  };

  return newNode;
}

// Returns the trimmed value entered by the user.
function getNodeValue() {
  const nodeValue = valueInput.value.trim();

  return nodeValue;
}

// Returns the requested position as a number.
function getNodePosition() {
  const rawPosition = positionInput.value.trim();

  if (rawPosition === "") {
    return null;
  }

  const nodePosition = Number(rawPosition);

  if (!Number.isInteger(nodePosition)) {
    return null;
  }

  return nodePosition;
}

// Generates a unique node name.
function generateNodeName() {
  const nodeName = "node" + nodeCounter;

  nodeCounter = nodeCounter + 1;

  return nodeName;
}

// Finds a node from its generated name.
function findNodeByName(nodeName) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].name === nodeName) {
      return nodes[i];
    }
  }

  return null;
}

// Clears both input fields.
function clearInputs() {
  valueInput.value = "";
  positionInput.value = "";
}


/**********************
* RENDERING BEHAVIOR *
**********************/

// Refreshes the full interface after each list update.
function refreshApplication() {
  updateCodeDisplay();
  renderList();
  updateListInfo();
}

// Renders the current doubly linked list.
function renderList() {
  listViewer.innerHTML = "";

  if (nodes.length === 0) {
    const emptyElement = createEmptyListElement();

    listViewer.appendChild(emptyElement);
    return;
  }

  for (let i = 0; i < nodes.length; i++) {
    const nodeElement = createNodeElement(nodes[i], i);

    listViewer.appendChild(nodeElement);

    if (i < nodes.length - 1) {
      const arrowsElement = createArrowsElement();
      listViewer.appendChild(arrowsElement);
    }
  }
}

// Creates the empty list message.
function createEmptyListElement() {
  const emptyElement = document.createElement("p");

  emptyElement.className = EMPTY_LIST_CLASS;
  emptyElement.textContent = "The list is empty. Add a node to start.";

  return emptyElement;
}

// Creates the full visual element for one node.
function createNodeElement(node, nodeIndex) {
  const nodeWrapper = document.createElement("div");
  nodeWrapper.className = NODE_WRAPPER_CLASS;

  const nodePosition = createNodePositionElement(nodeIndex);
  const nodeContainer = createNodeContainerElement(node);

  nodeWrapper.appendChild(nodePosition);
  nodeWrapper.appendChild(nodeContainer);

  return nodeWrapper;
}

// Creates the index badge above a node.
function createNodePositionElement(nodeIndex) {
  const nodePosition = document.createElement("div");

  nodePosition.className = NODE_POSITION_CLASS;
  nodePosition.textContent = nodeIndex;

  return nodePosition;
}

// Creates the visual container containing prev, value and next.
function createNodeContainerElement(node) {
  const nodeContainer = document.createElement("div");

  const previousContainer = createPreviousContainerElement(node);
  const valueContainer = createValueContainerElement(node);
  const nextContainer = createNextContainerElement(node);

  nodeContainer.className = NODE_CONTAINER_CLASS;

  nodeContainer.appendChild(previousContainer);
  nodeContainer.appendChild(valueContainer);
  nodeContainer.appendChild(nextContainer);

  return nodeContainer;
}

// Creates the previous pointer area.
function createPreviousContainerElement(node) {
  const previousContainer = document.createElement("div");

  previousContainer.className = PREVIOUS_CONTAINER_CLASS;

  if (node.prev === null) {
    previousContainer.textContent = "NULL";
  } else {
    previousContainer.textContent = "prev";
  }

  return previousContainer;
}

// Creates the value area.
function createValueContainerElement(node) {
  const valueContainer = document.createElement("div");

  valueContainer.className = VALUE_CONTAINER_CLASS;
  valueContainer.textContent = node.data;

  return valueContainer;
}

// Creates the next pointer area.
function createNextContainerElement(node) {
  const nextContainer = document.createElement("div");

  nextContainer.className = NEXT_CONTAINER_CLASS;

  if (node.next === null) {
    nextContainer.textContent = "NULL";
  } else {
    nextContainer.textContent = "next";
  }

  return nextContainer;
}

// Creates the double arrows between two nodes.
function createArrowsElement() {
  const arrowsContainer = document.createElement("div");

  const nextArrow = createNextArrowElement();
  const previousArrow = createPreviousArrowElement();

  arrowsContainer.className = ARROWS_CONTAINER_CLASS;

  arrowsContainer.appendChild(nextArrow);
  arrowsContainer.appendChild(previousArrow);

  return arrowsContainer;
}

// Creates the next arrow.
function createNextArrowElement() {
  const nextArrowWrapper = document.createElement("div");
  nextArrowWrapper.className = ARROW_WRAPPER_CLASS;

  const nextArrowLine = document.createElement("div");
  nextArrowLine.className = NEXT_ARROW_LINE_CLASS;

  const nextArrowHead = document.createElement("div");
  nextArrowHead.className = NEXT_ARROW_HEAD_CLASS;

  nextArrowWrapper.appendChild(nextArrowLine);
  nextArrowWrapper.appendChild(nextArrowHead);

  return nextArrowWrapper;
}

// Creates the previous arrow.
function createPreviousArrowElement() {
  const previousArrowWrapper = document.createElement("div");
  previousArrowWrapper.className = ARROW_WRAPPER_CLASS;

  const previousArrowLine = document.createElement("div");
  previousArrowLine.className = PREVIOUS_ARROW_LINE_CLASS;

  const previousArrowHead = document.createElement("div");
  previousArrowHead.className = PREVIOUS_ARROW_HEAD_CLASS;

  previousArrowWrapper.appendChild(previousArrowLine);
  previousArrowWrapper.appendChild(previousArrowHead);

  return previousArrowWrapper;
}

// Updates the list information text.
function updateListInfo() {
  const nodeCount = nodes.length;

  if (nodeCount === 0) {
    listInfo.textContent = "0 node";
    return;
  }

  if (nodeCount === 1) {
    listInfo.textContent = "1 node";
    return;
  }

  listInfo.textContent = nodeCount + " nodes";
}


/****************************
* CODE GENERATION BEHAVIOR *
****************************/

// Generates and displays the C code matching the current list.
function updateCodeDisplay() {
  let code = "";

  code = code + "#include <stdio.h>\n";
  code = code + "#include <stdlib.h>\n";
  code = code + "#include <string.h>\n\n";

  code = code + "/**\n";
  code = code + " * struct node_s - Doubly linked list node.\n";
  code = code + " * @data: string data stored in the node.\n";
  code = code + " * @prev: pointer to the previous node.\n";
  code = code + " * @next: pointer to the next node.\n";
  code = code + " */\n";
  code = code + "typedef struct node_s\n";
  code = code + "{\n";
  code = code + "\tchar *data;\n";
  code = code + "\tstruct node_s *prev;\n";
  code = code + "\tstruct node_s *next;\n";
  code = code + "} node_t;\n\n";

  code = code + "void display_list(node_t *head);\n";
  code = code + "void free_list(node_t *head);\n\n";

  code = code + "/**\n";
  code = code + " * main - Entry point of the program.\n";
  code = code + " *\n";
  code = code + " * Return: always 0 (Success).\n";
  code = code + " */\n";
  code = code + "int main(void)\n";
  code = code + "{\n";
  code = code + "\tnode_t *head = NULL;\n";

  if (nodes.length > 0) {
    code = code + "\n";
    code = code + "\t/* Declaration of nodes. */\n";

    for (let i = 0; i < nodes.length; i++) {
      code = code + "\tnode_t *" + nodes[i].name + ";\n";
    }

    code = code + "\n";
    code = code + "\t/* Allocation and initialization of nodes. */\n";

    for (let i = 0; i < nodes.length; i++) {
      const escapedData = nodes[i].data.replace(/"/g, "\\\"");

      code = code + "\t" + nodes[i].name + " = malloc(sizeof(node_t));\n";
      code = code + "\tif (" + nodes[i].name + " == NULL)\n";
      code = code + "\t{\n";
      code = code + "\t\tperror(\"Failed to allocate memory\");\n";
      code = code + "\t\texit(EXIT_FAILURE);\n";
      code = code + "\t}\n";
      code = code + "\t" + nodes[i].name + "->data = strdup(\"" + escapedData + "\");\n";
      code = code + "\tif (" + nodes[i].name + "->data == NULL)\n";
      code = code + "\t{\n";
      code = code + "\t\tperror(\"Failed to allocate memory\");\n";
      code = code + "\t\texit(EXIT_FAILURE);\n";
      code = code + "\t}\n";

      if (i < nodes.length - 1) {
        code = code + "\n";
      }
    }

    code = code + "\n";
    code = code + "\t/* Setting prev and next pointers. */\n";

    for (let i = 0; i < nodes.length; i++) {
      let previousValue = "NULL";
      let nextValue = "NULL";

      if (nodes[i].prev !== null) {
        previousValue = nodes[i].prev;
      }

      if (nodes[i].next !== null) {
        nextValue = nodes[i].next;
      }

      code = code + "\t" + nodes[i].name + "->prev = " + previousValue + ";\n";
      code = code + "\t" + nodes[i].name + "->next = " + nextValue + ";\n";
    }

    code = code + "\n";
    code = code + "\t/* Defining the head pointer. */\n";
    code = code + "\thead = " + nodes[0].name + ";\n";
  }

  code = code + "\n";
  code = code + "\tdisplay_list(head);\n";
  code = code + "\tfree_list(head);\n";
  code = code + "\treturn (0);\n";
  code = code + "}\n\n";

  code = code + "/**\n";
  code = code + " * display_list - Displays the doubly linked list.\n";
  code = code + " * @head: pointer to the head of the list.\n";
  code = code + " */\n";
  code = code + "void display_list(node_t *head)\n";
  code = code + "{\n";
  code = code + "\tnode_t *current = head;\n\n";
  code = code + "\tprintf(\"\\n\");\n";
  code = code + "\twhile (current != NULL)\n";
  code = code + "\t{\n";
  code = code + "\t\tprintf(\"[\");\n";
  code = code + "\t\tif (current->prev != NULL)\n";
  code = code + "\t\t\tprintf(\"prev\");\n";
  code = code + "\t\telse\n";
  code = code + "\t\t\tprintf(\"NULL\");\n";
  code = code + "\t\tprintf(\"][%s][\", current->data);\n";
  code = code + "\t\tif (current->next != NULL)\n";
  code = code + "\t\t\tprintf(\"next\");\n";
  code = code + "\t\telse\n";
  code = code + "\t\t\tprintf(\"NULL\");\n";
  code = code + "\t\tprintf(\"]\");\n";
  code = code + "\t\tif (current->next != NULL)\n";
  code = code + "\t\t\tprintf(\" <-> \");\n";
  code = code + "\t\tcurrent = current->next;\n";
  code = code + "\t}\n";
  code = code + "\tprintf(\"\\n\\n\");\n";
  code = code + "}\n\n";

  code = code + "/**\n";
  code = code + " * free_list - Frees the doubly linked list.\n";
  code = code + " * @head: pointer to the head of the list.\n";
  code = code + " */\n";
  code = code + "void free_list(node_t *head)\n";
  code = code + "{\n";
  code = code + "\tnode_t *current = head;\n";
  code = code + "\tnode_t *next_node;\n\n";
  code = code + "\twhile (current != NULL)\n";
  code = code + "\t{\n";
  code = code + "\t\tnext_node = current->next;\n";
  code = code + "\t\tfree(current->data);\n";
  code = code + "\t\tfree(current);\n";
  code = code + "\t\tcurrent = next_node;\n";
  code = code + "\t}\n";
  code = code + "}\n";

  codeDisplay.textContent = code;

  if (window.Prism) {
    Prism.highlightElement(codeDisplay);
  }
}


/**********************
* CLIPBOARD BEHAVIOR *
**********************/

// Copies the generated C code to the clipboard.
function copyCode() {
  const code = codeDisplay.textContent;

  if (!navigator.clipboard) {
    alert("Your browser does not support the Clipboard API.");
    return;
  }

  navigator.clipboard.writeText(code)
    .then(function () {
      copyCodeButton.textContent = "Copied";

      setTimeout(function () {
        copyCodeButton.textContent = "Copy";
      }, 1200);
    })
    .catch(function () {
      alert("Failed to copy code.");
    });
}


/******************
* EVENTS BEHAVIOR *
******************/

// Adds a node at the beginning.
addBeginningButton.addEventListener("click", function () {
  addAtBeginning();
});

// Adds a node at the end.
addEndButton.addEventListener("click", function () {
  addAtEnd();
});

// Adds a node at a specific position.
addPositionButton.addEventListener("click", function () {
  addAtPosition();
});

// Deletes a node at a specific position.
deletePositionButton.addEventListener("click", function () {
  deleteAtPosition();
});

// Resets the full list.
resetButton.addEventListener("click", function () {
  resetList();
});

// Copies the generated C code.
copyCodeButton.addEventListener("click", function () {
  copyCode();
});

// Adds a node at the end when pressing Enter inside the value input.
valueInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addAtEnd();
  }
});


/*****************
* INITIALIZATION *
*****************/

// Renders the initial empty state.
refreshApplication();