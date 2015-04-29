// convenience method to stringify a JSON object
function toJSON (obj) {
  return JSON.stringify(obj, null, 4);
}

// check if the number n is already in the graph, adding its path if not
function addIfNotInGraph(n)
{
  var node = nodes.get(n)
  if (! node) {
    var curPath = [n];
    buildPath(curPath, n);
  }
}

// build a path by computing sigma iteratively
function buildPath(curPath, n)
{
  var s = sigma(n);
  if (s === 12496 || s === 14288 || s === 15472 || s === 14536 || s === 14264)
  {
    console.log("sociable");
  }
  if (s >= INF) 
  {
    // assume sequence diverges to infinity so add path to the infinity node
    addCurPathToNode(curPath, INFID);
  }
  else if (curPath.indexOf(s) >= 0) 
  {
    // the current path reveals a cycle (and hence is not already in the network)
    var group = getNewGroup();
    addPathWithCycleToNetwork(curPath, s, group);
  }
  else 
  {
    var node = nodes.get(s);
    if (node) 
    {
      // reached an existing node in the network
      addCurPathToNode(curPath, s);
    }
    else 
    {
      // recursively build the path
      curPath.push(s);      
      buildPath(curPath, s);
    }
  }
}
// walk backwards through the path array, creating a node and an edge at each step.
function addCurPathToNode(curPath, destNodeID)
{
  var destNode = nodes.get(destNodeID);
  var group = destNode.group;
  var nn = destNodeID
  for (var i = curPath.length - 1; i >= 0; i--) {
    var n = curPath[i];
    nodes.add(nodeFor(n, group));
    edges.add(edgeFor(n, nn))
    nn = n;
  }
}

// create the final node, then work backwards from it, creating nodes and edges
// when we reach a node with the same value as the final node, close the loop by adding 
// a special edge.
function addPathWithCycleToNetwork(curPath, s, group) 
{
  var li = curPath.length - 1;
  var last = curPath[li];
  var nn = last
  nodes.add(nodeFor(nn, group));
  for (var i = li - 1; i >= 0; i--) {
    var n = curPath[i];
    nodes.add(nodeFor(n, group));
    edges.add(edgeFor(n, nn));
    nn = n;
  }
  edges.add(edgeFor(last, s));
}

function nodeFor(n, group)
{
  return { id: n, label: n.toString(), group: group };
}

function edgeFor(n, d)
{
  return { from: n, to: d.toString() };
}

function getNewGroup()
{
  groupCt += 1
  return groupCt
}

// simple function to compute the sum of proper divisors of a number
// for simplicity we're defining the sum of proper divisors of 1 to be 1
function sigma(n)
{
  var sum = 0;
  var max = (n === 1 ? 1 : n/2);
  for (var i = 1; i <= max; i++) {
    if (n % i === 0) {
      sum += i;
    }
  }
  return sum;
}


// create an array with nodes
var nodes = new vis.DataSet();
var INFID = 'inf';
nodes.add( {id: INFID, label: 'Inf', group: 0});

// create an array with edges
var edges = new vis.DataSet();

var MAXN = 20000;
var INF = 1000000;
var container;
var data;
var options;
var network;
var groups = groups = {
  0: {color: {background: "#BFD84D"}},
  1: {color: {background: "#548232"}},
  2: {color: {background: "#CD54D0"}},
  3: {color: {background: "#D1423A"}},
  4: {color: {background: "#C8BFD1"}},
  5: {color: {background: "#543867"}},
  6: {color: {background: "#D5B13C"}},
  7: {color: {background: "#67D847"}},
  8: {color: {background: "#37382F"}},
  9: {color: {background: "#C64585"}},
  10: {color: {background: "#CCC48E"}},
  11: {color: {background: "#79D792"}},
  12: {color: {background: "#8973CD"}},
  13: {color: {background: "#76D2CE"}},
  14: {color: {background: "#702B31"}},
  15: {color: {background: "#7C602E"}},
  16: {color: {background: "#C6838C"}},
  17: {color: {background: "#5B7F6C"}},
  18: {color: {background: "#CF793B"}},
  19: {color: {background: "#608BB7"}}
};

var groupCt = 0;

$(document).ready(function() {
  // create a network
  container = $('#network').get(0);
  data = {
    nodes: nodes,
    edges: edges
  };

  options = { 
    clustering: true,
    keyboard: true,
    groups: groups,
    stabilize: true,
    hideEdgesOnDrag: true,
    edges: {
      style: 'arrow'
    }
  };

  for (var n = 1; n <= MAXN; n++) {
    addIfNotInGraph(n);
  }; 

  network = new vis.Network(container, data, options);
})

