// Initialize an empty array to store nodes.
let nodes = [];

// Function to add a node at the beginning of the list.
function addAtBeginning() {
    const value = document.getElementById("node-value").value;

    if (value === "") {
        return;
    }

    const newNode = {
        name: generateNodeName(),
        data: value,
        prev: null,
        next: nodes.length > 0 ? nodes[0].name : null
    };

    nodes.unshift(newNode);

    if (nodes.length > 1) {
        nodes[1].prev = newNode.name;
    }

    renderList();
    clearInputs();
}

// Function to add a node at the end of the list.
function addAtEnd() {
    const value = document.getElementById("node-value").value;

    if (value === "") {
        return;
    }

    const newNode = {
        name: generateNodeName(),
        data: value,
        prev: nodes.length > 0 ? nodes[nodes.length - 1].name : null,
        next: null
    };

    if (nodes.length > 0) {
        nodes[nodes.length - 1].next = newNode.name;
    }

    nodes.push(newNode);

    renderList();
    clearInputs();
}

// Function to add a node at a specific position.
function addAtPosition() {
    const value = document.getElementById("node-value").value;
    const position = parseInt(document.getElementById("node-position").value);

    if (value === "" || isNaN(position) || position < 0 || position > nodes.length) {
        return;
    }

    const newNode = {
        name: generateNodeName(),
        data: value,
        prev: null,
        next: null
    };

    if (position === 0) {
        addAtBeginning();
        return;
    } else if (position === nodes.length) {
        addAtEnd();
        return;
    } else {
        const prevNode = nodes[position - 1];
        const nextNode = nodes[position];

        newNode.prev = prevNode.name;
        newNode.next = nextNode.name;

        prevNode.next = newNode.name;
        nextNode.prev = newNode.name;

        nodes.splice(position, 0, newNode);
    }

    renderList();
    clearInputs();
}

// Function to delete a node at a specific position.
function deleteAtPosition() {
    const position = parseInt(document.getElementById("node-position").value);

    if (isNaN(position) || position < 0 || position >= nodes.length) {
        return;
    }

    const nodeToDelete = nodes[position];

    if (nodeToDelete.prev) {
        const prevNode = nodes.find(n => n.name === nodeToDelete.prev);
        prevNode.next = nodeToDelete.next;
    }

    if (nodeToDelete.next) {
        const nextNode = nodes.find(n => n.name === nodeToDelete.next);
        nextNode.prev = nodeToDelete.prev;
    }

    nodes.splice(position, 1);

    renderList();
    clearInputs();
}

// Initialize counter for node naming.
let nodeCounter = 0;
// Function to generate unique node names.
function generateNodeName() {
    return `node${nodeCounter++}`;
}

// Function to render the list in the DOM.
function renderList() {
    // Get the list viewer element and clear its content.
    const listViewer = document.getElementById("list-viewer");
    listViewer.innerHTML = "";

    nodes.forEach(function (node, index) {
        // Create a container for nodes.
        const nodesContainer = document.createElement("div");
        nodesContainer.id = "nodes-container";

        // Create a wrapper for the node position and the node itself.
        const nodeWrapper = document.createElement("div");
        nodeWrapper.className = "node-wrapper";

        const nodePosition = document.createElement("div");
        nodePosition.className = "node-position";
        nodePosition.textContent = index;

        // Create a container for the node and its elements.
        const nodeContainer = document.createElement("div");
        nodeContainer.className = "node-container";

        const prevContainer = document.createElement("div");
        prevContainer.className = "prev-container";
        prevContainer.textContent = node.prev ? "prev" : "NULL";

        const valueContainer = document.createElement("div");
        valueContainer.className = "value-container";
        valueContainer.textContent = node.data;

        const nextContainer = document.createElement("div");
        nextContainer.className = "next-container";
        nextContainer.textContent = node.next ? "next" : "NULL";

        // Append prev, value, and next containers to node container.
        nodeContainer.appendChild(prevContainer);
        nodeContainer.appendChild(valueContainer);
        nodeContainer.appendChild(nextContainer);

        // Append position and node container to node wrapper.
        nodeWrapper.appendChild(nodePosition);
        nodeWrapper.appendChild(nodeContainer);

        // Append node wrapper to nodes container.
        nodesContainer.appendChild(nodeWrapper);

        // Append nodes container to the list viewer.
        listViewer.appendChild(nodesContainer);

        // If not the last node, create arrows between nodes.
        if (index < nodes.length - 1) {
            const arrowsContainer = document.createElement("div");
            arrowsContainer.className = "arrows-container";

            // Create arrow elements.
            const arrowRight = document.createElement("div");
            arrowRight.className = "arrow-right";
            const arrowLeft = document.createElement("div");
            arrowLeft.className = "arrow-left";

            // Append arrows to arrows container.
            arrowsContainer.appendChild(arrowRight);
            arrowsContainer.appendChild(arrowLeft);

            // Append arrows container to the list viewer.
            listViewer.appendChild(arrowsContainer);
        }
    });
}

// Function to reset the list and node counter.
function resetList() {
    nodes = [];
    nodeCounter = 0;

    renderList();
    clearInputs();
}

// Function to clear input fields.
function clearInputs() {
    document.getElementById("node-value").value = "";
    document.getElementById("node-position").value = "";
}

window.onload = function () {
    renderList();
};