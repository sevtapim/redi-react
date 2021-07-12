import React from "react";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Space = styled.div`
  margin-left: 15px;
`;
const Spacespan = styled.span`
  margin-left: 5px;
`;

const QueryParams = ({
  year,
  years,
  country,
  countries,
  shouldFilter,
  onQueryChange
}) => (
  <Form>
      <label htmlFor="year">
        Year
        <Spacespan />
        <select name="year" id="year" value={year} onChange={onQueryChange}>
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </label>
    <Space />
      <label htmlFor="country">
        Country
        <Spacespan />
        <select name="country" id="country" value={country} onChange={onQueryChange}>
          {countries.map(country => (
            <option key={country.iso3} value={country.iso3}>
              {country.name}
            </option>
          ))}
        </select>
      </label>
    <Space />
      <label htmlFor="shouldFilter">
        Reduce Details
        <Spacespan />
        <input
          name="shouldFilter"
          id="shouldFilter"
          type="checkbox"
          checked={shouldFilter}
          onChange={onQueryChange}
        />
      </label>
  </Form>
);

export default QueryParams;