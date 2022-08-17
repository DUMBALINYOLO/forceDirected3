import React, { useEffect, useRef, useState, useMemo } from "react";
import ReactDOM from "react-dom";
import ForceGraph2D from "react-force-graph-2d";
import { data, clusterIds, clusters } from "./exampleData";
import * as d3 from "d3";

var nodeData = {
  nodes: [
    { x: 100, y: 100, r: 10 },
    { x: 200, y: 100, r: 10 },
    { x: 50, y: 200, r: 10 },
    { x: 350, y: 200, r: 10 },
    { x: 100, y: 300, r: 10 },
    { x: 300, y: 300, r: 10 },
    { x: 300, y: 250, r: 10 }
  ],
  links: []
};

const App = () => {
  const [initialCenter, setInitialCenter] = useState(true);
  const [collapsedClusters, setCollapsedClusters] = useState(clusterIds);
  const [hiddenClusters, setHiddenClusters] = useState([]);
  const forceRef = useRef();

  useEffect(() => {
    // forceRef.current.d3Force("charge", null);
    // forceRef.current.d3Force("center", null);
    forceRef.current.d3Force(
      "collide",
      d3.forceCollide(12).strength(1).iterations(100)
    );
    forceRef.current.d3Force(
      "attract",
      d3.forceManyBody().strength(80).distanceMax(400).distanceMin(80)
    );
    // forceRef.current
    //   .d3Force("link")
    //   .distance((link) => (link.target.isClusterNode ? 20 : 20));
    // forceRef.current.d3Force("charge").strength(0);
    // forceRef.current.d3Force("friction", () => 0.1);
    // forceRef.current.d3Force("link").distance((link) => {
    //   return link.source.isClusterNode ? 120 : 20;
    // });
    // forceRef.current.d3Force("collision", d3.forceCollide(4));
    // forceRef.current.d3Force("charge").distanceMax(100);
  }, []);

  const handleNodeClick = (node) => {
    toggleClusterCollapse(node.id);
  };

  const toggleClusterCollapse = (clusterId) => {
    if (collapsedClusters.includes(clusterId)) {
      setCollapsedClusters(collapsedClusters.filter((id) => id !== clusterId));
    } else {
      setCollapsedClusters([...collapsedClusters, clusterId]);
    }
  };
  const toggleCluster = (clusterId) => {
    if (hiddenClusters.includes(clusterId)) {
      setHiddenClusters(hiddenClusters.filter((id) => id !== clusterId));
    } else {
      setHiddenClusters([...hiddenClusters, clusterId]);
    }
    if (!collapsedClusters.includes(clusterId)) {
      toggleClusterCollapse(clusterId);
    }
  };

  const graphData = useMemo(() => {
    return {
      nodes: data.nodes.filter((node) => !hiddenClusters.includes(node.id)),
      links: data.links
    };
  }, [hiddenClusters]);

  return (
    <div>
      <button
        onClick={() => {
          forceRef.current.zoomToFit();
          setHiddenClusters([]);
          setCollapsedClusters(clusterIds);
        }}
      >
        RESET
      </button>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {clusters.map((cluster) => (
          <button key={cluster.id} onClick={() => toggleCluster(cluster.id)}>
            Toggle {cluster.name}
          </button>
        ))}
      </div>
      <ForceGraph2D
        width={800}
        height={600}
        backgroundColor="lightgray"
        ref={forceRef}
        //    onNodeClick={handleNodeClick}
        graphData={nodeData}
        cooldownTicks={50}
        // nodeRelSize={1}
        onEngineStop={() => {
          if (initialCenter) {
            forceRef.current.zoomToFit();
          }
          setInitialCenter(false);
        }}
        // nodeCanvasObjectMode={() => "after"}
        // nodeCanvasObject={(node, ctx, globalScale) => {
        //   const label = node.id;
        //   const fontSize = 12 / globalScale;
        //   ctx.font = `${fontSize}px Sans-Serif`;
        //   ctx.textAlign = node.isClusterNode ? "center" : "left";
        //   ctx.textBaseline = "middle";
        //   ctx.fillStyle = "black"; //node.color;
        //   if (node.isClusterNode) {
        //     ctx.fillText(label, node.x, node.y);
        //   } else {
        //     ctx.fillText(label, node.x + 4, node.y);
        //   }
        // }}
        enableNodeDrag={false}
        // nodeVisibility={(node) => {
        //   if (collapsedClusters.includes(node.clusterId)) {
        //     return false;
        //   } else return true;
        // }}
        // linkVisibility={(link) => {
        //   if (
        //     collapsedClusters.includes(link.source.id) &&
        //     !link.target.isClusterNode
        //   ) {
        //     return false;
        //   } else return true;
        // }}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("container"));
