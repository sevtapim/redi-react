async function getCountriesYears(url) {
  try {
    const response = await fetch(url);
    const result = await response.json();
    return result.results;
  } catch (error) {
    console.log(error);
  }

}
function getUniqueYears(years) {
  return [ ... new Set(years)];
}
function getUniqueCountries(countries) {
  const uniqueIso3s = {};
  countries.forEach(country => {
    const key = country.iso3;
    if(!uniqueIso3s[key]) {
      uniqueIso3s[key] = country;
    }
  });
  return Object.values(uniqueIso3s);  
}

export {getCountriesYears, getUniqueYears, getUniqueCountries};
