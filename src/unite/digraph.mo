import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Types "./types";

//a social graph is basically vertices connected along edges...
module {
  type Vertex = Types.Vertex;

  public class Digraph() {

    var vertexList: [Vertex] = []; //all the users/principals
    var edgeList: [(Vertex, Vertex)] = []; //all the relationships between pairs

    public func addVertex(vertex: Vertex) {
      vertexList := Array.append<Vertex>(vertexList, [vertex]);
    };

	//creating a new connection == adding an edge
    public func addEdge(fromVertex: Vertex, toVertex: Vertex) {
      edgeList := Array.append<(Vertex, Vertex)>(edgeList, [(fromVertex, toVertex)]);
    };

	//relationships
    public func getAdjacent(vertex: Vertex): [Vertex] {
      var adjacencyList: [Vertex] = [];
	  //need to make the array iterable in order to apply our for....
      for ((fromVertex, toVertex) in Iter.fromArray<(Vertex, Vertex)>(edgeList)) {
		  //Why fromVertex? Because connections are one way, so fromvertex tells us those who initiated connections...from their perspective they are "connected" even if there is no connection in the other direction 
        if (fromVertex == vertex) {
          adjacencyList := Array.append<Vertex>(adjacencyList, [toVertex]);
        };
      };
      adjacencyList
    };

  };
};