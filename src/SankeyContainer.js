import React from "react";
import Sankey from "./Sankey";
import styled from "styled-components";

import Loading from "./Loading";

import {
  get_IDMC_DISASTER_BY_YEAR_DATA_URL,
  ALL_COUNTRY_MARKER
} from "./config";

const SankeyDiv = styled.div`
  width: 90vw;
  height: 600px;
  margin-bottom: 30px;
  border: 1px solid black;
`;
export default class SankeyContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isDataEmpty: true,
      shouldRefreshData: true,
      cache: [],
      data: []
    };
    this.fetchData();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.year !== this.props.year) {
      await this.fetchData();
    }
    if (
      this.state.shouldRefreshData ||
      prevProps.country !== this.props.country
    ) {
      await this.setComponentData();
    }
  }

  fetchData = async () => {
    const resp = await fetch(
      get_IDMC_DISASTER_BY_YEAR_DATA_URL(this.props.year)
    );
    const { results } = await resp.json();
    await new Promise(resolve => {
      this.setState({ cache: results, shouldRefreshData: true }, resolve);
    });
  };

  setComponentData = async () => {
    let data =
      this.props.country !== ALL_COUNTRY_MARKER.iso3
        ? filterByCountry(this.state.cache, this.props.country)
        : this.state.cache;

    data = data.filter(isValidData);

    const newState = {
      isDataEmpty: data.length === 0,
      shouldRefreshData: false,
      loading: false,
      data
    };

    await new Promise(resolve => {
      this.setState(newState, resolve);
    });

    function filterByCountry(data, country) {
      return data.filter(byCountry);

      function byCountry(item) {
        return item.iso3 === country;
      }
    }

    function isValidData(item) {
      // Filter for Germany 2010 with new_displacements 0 value
      // Filter for All 2009 with undefined new_displacements
      // Filter for undefined hazard_category
      return (
        item.new_displacements !== undefined &&
        item.new_displacements !== 0 &&
        item.hazard_category !== undefined
      );
    }
  };

  render() {
    if (this.state.loading) {
      return <Loading/>;
    }
    if (this.state.isDataEmpty) {
      return (
        <h3>
          No data for this year and country combination. Choose another one!
        </h3>
      );
    }
    return (
      <SankeyDiv>
        <Sankey
          data={replaceIdsWithSpaces(
            hideLeaves(
            prepareData(this.state.data),
            this.props.shouldFilter
          ))}
        />
      </SankeyDiv>
    );
  }
}

function replaceIdsWithSpaces({nodes, links}) {
  let keys = {};
  let cache = {};
  let newNodes = nodes.map(padSpaces);
  let newLinks = links.map(padSpaces2);

  return {nodes: newNodes, links: newLinks};

  function padSpaces(item) {
    let id = item["id"];
    let name = id.substr(id.indexOf(" ") + 1);
    let spaceCount = getSpaceCount(name, keys);
    let newId = " ".repeat(spaceCount) + name;
    cache[id] = newId;
    return {"id": newId};
  }

  function getSpaceCount(key, keys) {
    let count = keys.hasOwnProperty(key) ? keys[key] + 1 : 0;
    keys[key] = count;
    return count;
  }

  function padSpaces2(item) {
    let {source, target, value} = item;
    let newSource = cache[source];
    let newTarget = cache[target];
    return {source: newSource, target: newTarget, value};
  }
}

function hideLeaves(data, shouldFilter) {
  if (!shouldFilter) {
    return data;
  }

  const { nodes, links } = data;
  return { nodes: nodes.filter(isLeafNode), links: links.filter(isLeafLink) };

  function isLeafNode(item) {
    // filter out patterns like "0.0.0.2 Riverine flood"
    const string = item.id;
    const pattern = /^\d\.\d\.\d\.\d/;
    return !pattern.test(string);
  }

  function isLeafLink(item) {
    // filter out patterns like "0.0.0.2 Riverine flood"
    const string = item.target;
    const pattern = /^\d\.\d\.\d\.\d/;
    return !pattern.test(string);
  }
}

function prepareData(dataIn) {
  const data = dataIn.map(requiredAttributes);

  function requiredAttributes(item) {
    return {
      hazard_category: item.hazard_category,
      hazard_sub_category: item.hazard_sub_category,
      hazard_type: item.hazard_type,
      hazard_sub_type: item.hazard_sub_type,
      new_displacements: item.new_displacements
    };
  }

  const categories = {};

  for (let obj of data) {
    let sub_categories = accumulate(
      categories,
      obj.hazard_category,
      obj.new_displacements
    );

    let types = accumulate(
      sub_categories,
      obj.hazard_sub_category,
      obj.new_displacements
    );

    let sub_types = accumulate(types, obj.hazard_type, obj.new_displacements);

    if (obj.hazard_sub_type !== undefined) {
      accumulate(sub_types, obj.hazard_sub_type, obj.new_displacements);
    }
  }

  function accumulate(map, key, increment) {
    let { count, sub } = map.hasOwnProperty(key)
      ? map[key]
      : { count: 0, sub: {} };
    let newCount = count + increment;
    map[key] = { count: newCount, sub };
    return sub;
  }

  //printObject(categories);

  const nodes = [];
  const links = [];
  getNodesandLinks(categories, nodes, links);

  function getNodesandLinks(map, nodes, links) {
    let count = 0;
    for (let key in map) {
      let label = `${count} ${key}`;
      nodes.push({ id: label });
      getNodesandLinksDeeper(count, key, map[key].sub, nodes, links);
      count++;
    }
    function getNodesandLinksDeeper(prefix, top, map, nodes, links) {
      let count = 0;
      for (let key in map) {
        let prefixNew = prefix + "." + count;
        let label = `${prefixNew} ${key}`;
        nodes.push({ id: label });

        let label1 = `${prefix} ${top}`;
        let label2 = `${prefixNew} ${key}`;
        links.push({
          source: label1,
          target: label2,
          value: map[key].count
        });
        getNodesandLinksDeeper(prefixNew, key, map[key].sub, nodes, links);
        count++;
      }
    }
  }

  return { nodes, links };
}
