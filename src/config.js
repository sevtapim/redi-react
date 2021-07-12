
export const IDMC_COUNTRY_YEAR_DATA_URL = "https://api.idmcdb.org/api/disaster_data?&ci=IDMCWSHSOLO009";

export const get_IDMC_DISASTER_BY_YEAR_DATA_URL = (year) => `${IDMC_COUNTRY_YEAR_DATA_URL}&year=${year}`;

export const ALL_COUNTRY_MARKER = {iso3: "all", name: "All"};
