import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import getUniqueCountriesandYears from "./utils";

import { Loading } from "./Loading";
import { SankeyContainer } from "./SankeyContainer";
import { QueryPanel } from "./QueryPanel";
import { IDMC_COUNTRY_YEAR_DATA_URL, ALL_COUNTRY_MARKER } from "./config";

import "./styles.css";

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true };
    this.initialize();
  }

  initialize = async () => {
    const yearsAndCountries = await getUniqueCountriesandYears(
      IDMC_COUNTRY_YEAR_DATA_URL
    );
    let { years, countries } = yearsAndCountries;

    // sort the years like this 2017, 2016, ...
    years = years.sort((a, b) => b - a);

    // show the most recent year's statistic as default
    const year = years[0];

    // Add the wilcard country to the countries
    countries = [ALL_COUNTRY_MARKER, ...countries];

    // show the statistics for all as default
    const country = countries[0].iso3;

    // Set the default values:
    this.setState({
      years,
      countries,
      year,
      country,
      shouldFilter: false,
      isLoading: false
    });
  };

  handleQueryChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

  render() {
    const { isLoading } = this.state;
    return (<Main className="App">
              <h3>Sankey diagram for disasters by year and country</h3>
              {isLoading ? 
                <Loading/>:
                <div>
                  <SankeyContainer
                    year={this.state.year}
                    country={this.state.country}
                    shouldFilter={this.state.shouldFilter}
                  />
                  <QueryPanel
                    year={this.state.year}
                    country={this.state.country}
                    years={this.state.years}
                    countries={this.state.countries}
                    shouldFilter={this.state.shouldFilter}
                    onQueryChange={this.handleQueryChange}
                  />
                </div>
              }
            </Main>);
  }
  
}

export default App;