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

	updateCodeDisplay()
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

	updateCodeDisplay()
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

	updateCodeDisplay()
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

	updateCodeDisplay()
	renderList();
	clearInputs();
}

// Initialize counter for node naming.
let nodeCounter = 0;
// Function to generate unique node names.
function generateNodeName() {
	return `node${nodeCounter++}`;
}

function updateCodeDisplay() {
	const codeDisplay = document.getElementById("code-display");
	let code = `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/**
 * struct node_s - Doubly linked list node.
 * @data: string data stored in the node.
 * @prev: pointer to the previous node.
 * @next: pointer to the next node.
 */
typedef struct node_s
{
\tchar *data;
\tstruct node_s *prev;
\tstruct node_s *next;
} node_t;

/* Function prototype. */
void display_list(node_t *head);
void free_list(node_t *head);

/**
 * main - Entry point of the program.
 *
 * Return: always 0 (Success).
 */
int main(void)
{
\tnode_t *head = NULL;
`;

	// Declaration of node pointers.
	if (nodes.length > 0) {
		code += `\n\t/* Declaration of nodes. */\n`;
		nodes.forEach(node => {
			code += `\tnode_t *${node.name};\n`;
		});
	}

	// Allocation and initialization of nodes.
	if (nodes.length > 0) {
		code += `\n`;
		code += `\t/* Allocation and initialization of nodes. */\n`;
		nodes.forEach((node, index) => {
			// Escape quotes in data.
			const escapedData = node.data.replace(/"/g, '\\"');
			code += `\t${node.name} = malloc(sizeof(node_t));\n`;
			code += `\tif (${node.name} == NULL)\n`;
			code += `\t{\n`;
			code += `\t\tperror("Failed to allocate memory.");\n`;
			code += `\t\texit(EXIT_FAILURE);\n`;
			code += `\t}\n`;
			code += `\t${node.name}->data = strdup("${escapedData}");\n`;
			code += `\tif (${node.name}->data == NULL)\n`;
			code += `\t{\n`;
			code += `\t\tperror("Failed to allocate memory.");\n`;
			code += `\t\texit(EXIT_FAILURE);\n`;
			code += `\t}\n`;

			// Add an extra newline only if this is not the last node.
			if (index < nodes.length - 1) {
				code += `\n`;
			}
		});
	}

	// Setting prev and next pointers.
	if (nodes.length > 0) {
		code += `\n\t/* Setting prev and next pointers */\n`;
		nodes.forEach(node => {
			let prevNode = (node.prev === null) ? "NULL" : node.prev;
			let nextNode = (node.next === null) ? "NULL" : node.next;
			code += `\t${node.name}->prev = ${prevNode};\n`;
			code += `\t${node.name}->next = ${nextNode};\n`;
		});
	}

	// Defining the head pointer.
	if (nodes.length > 0) {
		code += `\n\t/* Defining the head pointer */\n`;
		code += `\thead = ${nodes[0].name};\n`;
	}

	// Closing main and adding functions.
	code += `
\t/* Displaying the list */
\tdisplay_list(head);
\t/* Freeing allocated memory */
\tfree_list(head);

\treturn (0);
}

/**
 * display_list - Displays the doubly linked list.
 * @head: pointer to the head of the list.
 */
void display_list(node_t *head)
{
\tnode_t *current = head;

\tprintf("\\n");

\twhile (current != NULL)
\t{
\t\tprintf("[");

\t\tif (current->prev != NULL)
\t\t\tprintf("prev");
\t\telse
\t\t\tprintf("NULL");
\t\tprintf("][%s][", current->data);
\t\tif (current->next != NULL)
\t\t\tprintf("next");
\t\telse
\t\t\tprintf("NULL");

\t\tprintf("]");

\t\tif (current->next != NULL)
\t\t\tprintf(" <-> ");

\t\tcurrent = current->next;
\t}
\tprintf("\\n\\n");
}

/**
 * free_list - Frees the doubly linked list.
 * @head: pointer to the head of the list.
 */
void free_list(node_t *head)
{
\tnode_t *current = head;
\tnode_t *next_node;

\twhile (current != NULL)
\t{
\t\tnext_node = current->next;
\t\tfree(current->data);
\t\tfree(current);
\t\tcurrent = next_node;
\t}
}
`;

	// Update the code display area.
	codeDisplay.textContent = code.trim();
	Prism.highlightAll();
}

// Function to copy code from the "code-display" element to the clipboard.
function copyCode() {
	const codeDisplay = document.getElementById("code-display");
	const code = codeDisplay.textContent;

	if (navigator.clipboard) {
		navigator.clipboard.writeText(code)
			.then(function () {
				alert("Code copied to clipboard!");
			})
			.catch(function () {
				alert("Failed to copy: " + error);
			});
	} else {
		alert("Your browser does not support the Clipboard API.");
	}
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

// Function to reset the list and node counter.
function resetList() {
	nodes = [];
	nodeCounter = 0;

	updateCodeDisplay()
	renderList();
	clearInputs();
}

// Function to clear input fields.
function clearInputs() {
	document.getElementById("node-value").value = "";
	document.getElementById("node-position").value = "";
}

// Initialize on page load.
window.onload = function () {
	updateCodeDisplay()
	renderList();
};