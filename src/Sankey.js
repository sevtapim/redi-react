import React from "react";
import { ResponsiveSankey } from "@nivo/sankey";

const Sankey = ({ data }) => (
  <ResponsiveSankey
    data={data}
    colors={["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]}
    nodeThickness="5"
    margin={{
      top: 10,
      right: 10,
      bottom: 20,
      left: 10
    }}
    align="justify"
  />
);

export default Sankey;