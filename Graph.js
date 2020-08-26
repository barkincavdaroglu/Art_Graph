class Vertex {
    constructor(id) {
        this.id = id
        this.adjacents = new Map()
    }
    addAdjacent(v) {
        if (this.adjacents[v.id] == null) {
            this.adjacents.set(v.id, v)
        }
    }
    get getAdjacents() {
        return this.adjacents
    }
    get vertex() {
        return this
    }
    get degree() {
        return Object.keys(this.adjacents).length
    }

    removeAdjacent(v) {
        this.adjacents.delete(v.id)
    }
}

class Graph {
    constructor() {
        this.vertices = new Map();
        this.numVertices = 0;
        this.numEdges = 0;
    }

    insertVertex(v) {
        if (!(this.vertices.has(v.id))) {
            this.vertices.set(v.id, v);
            this.numVertices += 1;
        }
    }

    getVertex(v) {
        if (Number.isInteger(v)) {
            return this.vertices[v];
        } else {
            return this.vertices[v.id];
        }
    }

    removeVertex(v) {
        if (Number.isInteger(v)) {
            this.vertices.delete(v);
            this.numVertices -= 1;
            for (const [id, vertex] of this.vertices.entries()) {
                vertex.adjacents.delete(v)
            }
        } else {
            this.vertices.delete(v.id);
            this.numVertices -= 1;
            for (const [id, vertex] of this.vertices.entries()) {
                vertex.adjacents.delete(v.id)
            }
        }
    }

    insertEdge(v, e) {
        this.insertVertex(v);
        this.insertVertex(e);

        v.addAdjacent(e);
        e.addAdjacent(v);

        this.numEdges += 2;
    }

    hasEdge(v, e) {
        return (e.id in this.vertices[v.id].getAdjacents);
    }
}

var gr = new Graph();

for (var i = 0; i < 20; i++) {
    var vertexx = new Vertex(i)
    gr.insertVertex(vertexx)
}

for (var [id, vertex] of gr.vertices.entries()) {
    for (var [id2, vertex2] of gr.vertices.entries()) {
        //console.log(vertex.id % 2 === 0)
        if ((Number(vertex.id) % 2 === 0) && (Number(vertex2.id) % 2 === 0) && (vertex.id !== vertex2.id) && (!vertex.adjacents.has(vertex2.id))) {
            gr.insertEdge(vertex, vertex2)
        }
    }
}
for (var [id, vertex] of gr.vertices.entries()) {
    console.log("\n")
    console.log(id)
    console.log(vertex.adjacents)
    console.log("\n")
}

