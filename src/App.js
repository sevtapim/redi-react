import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Loading from "./Loading";
import QueryParams from "./QueryParams";
import SankeyContainer from "./SankeyContainer";

import { IDMC_COUNTRY_YEAR_DATA_URL, ALL_COUNTRY_MARKER } from "./config";
import { getCountriesYears, getUniqueYears, getUniqueCountries } from "./utils";

import "./styles.css";

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const App = () => {
  const [query, setQuery] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const initialize = async () => {
    const data = await getCountriesYears(IDMC_COUNTRY_YEAR_DATA_URL);
    const years = getUniqueYears(data.map((item) => item.year)).sort(
      (a, b) => b - a
    );
    const countries = [
      ALL_COUNTRY_MARKER,
      ...getUniqueCountries(
        data.map((item) => ({
          iso3: item.iso3,
          name: item.geo_name,
        }))
      ),
    ];

    const year = years[0];
    const country = countries[0].iso3;

    // Set the default values:
    setQuery({
      years,
      countries,
      year,
      country,
      shouldFilter: false,
    });
    setIsLoading(false);
  };

  useEffect(initialize, []);

  const handleQueryChange = ({target}) => {
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setQuery(prevQuery => ({...prevQuery, ...{ [name]: value }}));
  };

  return (
    <Main className="App">
      <h3>Sankey diagram for disasters by year and country</h3>
      {isLoading && <Loading />}
      {query && <>
        <SankeyContainer
          year={query.year}
          country={query.country}
          shouldFilter={query.shouldFilter}
        />
        <QueryParams
          year={query.year}
          country={query.country}
          years={query.years}
          countries={query.countries}
          shouldFilter={query.shouldFilter}
          onQueryChange={handleQueryChange}
        />
      </>}
    </Main>
  );
}

export default App;