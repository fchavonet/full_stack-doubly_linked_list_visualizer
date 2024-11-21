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

    nodes.forEach((node, index) => {
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

// Function to clear input fields.
function clearInputs() {
    document.getElementById("node-value").value = "";
    document.getElementById("node-position").value = "";
}