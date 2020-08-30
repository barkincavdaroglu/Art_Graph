const fs = require('fs'), JSONStream = require('JSONStream');

class Vertex {
    constructor(Object_ID, culture, object_date, classification) {
        this.Object_ID = Object_ID
        this.culture = culture
        this.object_date = object_date
        this.classification = classification
        this.adjacents = new Map()

    }
    addAdjacent(v) {
        if (this.adjacents[v.Object_ID] == null) {
            this.adjacents.set(v.Object_ID, v)
        }
    }
    get getAdjacents() {
        return this.adjacents
    }
}

class ArtGraph {
    constructor() {
        this.vertices = new Map();
        this.classifications = new Set()
        this.cultures = new Set()
        this.numVertices = 0;
        this.numEdges = 0;
    }

    insertVertex(v) {
        if (!(this.vertices.has(v.Object_ID))) {
            this.vertices.set(v.Object_ID, v);
            this.numVertices += 1;
            this.classifications.add(v.classification)
            this.cultures.add(v.culture)
        }
    }

    getClassifications() {
        return this.classifications
    }

    getCultures() {
        return this.cultures
    }

    getVertex(v) {
        if (!isNaN(v)) {
            return this.vertices.get(v);
        } else {
            return this.vertices.get(v.Object_ID);
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
            this.vertices.delete(v.Object_ID);
            this.numVertices -= 1;
            for (const [id, vertex] of this.vertices.entries()) {
                vertex.adjacents.delete(v.Object_ID)
            }
        }
    }

    getByCulture(culture) {
        var result = []
        for (const [id, vertex] of this.vertices.entries()) {
            if (vertex.culture.split(":")[0] == culture) {
                result.push(vertex)
            }
        }
        return result
    }

    insertEdge(v, e) {
        this.insertVertex(v);
        this.insertVertex(e);

        v.addAdjacent(e);
        e.addAdjacent(v);

        this.numEdges += 2;
    }

    hasEdge(v, e) {
        return (e.Object_ID in this.vertices[v.Object_ID].getAdjacents);
    }
}

var artGraph = new ArtGraph();


var stream = fs.createReadStream('./prettified.json', {encoding: 'utf8'}),
    parser = JSONStream.parse();

stream.pipe(parser);

parser.on('data', function (obj) {

    for (var each in obj) {
        if ((obj[each]["culture"] !== "") && (obj[each]["classification"] !== "") && (obj[each]["primaryImage"] !== "") && (obj[each]["isPublicDomain"] === true) && (obj[each]["isTimelineWork"] === true)) {
            var vert = new Vertex(obj[each]["objectID"], obj[each]["culture"], obj[each]["objectDate"], obj[each]["classification"])
            artGraph.insertVertex(vert)
        }
    }
    addEdges()
});

async function addEdges() {
    for (var [id, vertex] of artGraph.vertices.entries()) {
        for (var [id2, vertex2] of artGraph.vertices.entries()) {
            if (vertex.culture.includes(":") && vertex2.culture.includes(":")) {
                if ((vertex.culture.split(":")[0] !== "" && vertex2.culture.split(":") !== "") && (vertex.culture.split(":")[0] === vertex2.culture.split(":")[0]) && (vertex.Object_ID !== vertex2.Object_ID) && (!vertex.adjacents.has(vertex2.Object_ID))) {
                    artGraph.insertEdge(vertex, vertex2)
                }
            } else {
                if ((vertex.culture !== "" && vertex2.culture !== "") && (vertex.culture === vertex2.culture) && (vertex.Object_ID !== vertex2.Object_ID) && (!vertex.adjacents.has(vertex2.Object_ID))) {
                    artGraph.insertEdge(vertex, vertex2)
                }
            }
        }
    }
}
